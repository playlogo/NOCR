import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

import { groq } from "./groq.ts";
import { Notification, publish } from "../utils/ntfy.ts";
import { db } from "../utils/mongodb.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.33.0/deps.ts";

// Schemas
interface ScrapeResult {
	_id: ObjectId;
	products: Product[];
	date: number;
}

interface Product {
	name: string;
	image: string;
	link: string;
	kind: string;
	priceBeforeSale: number;
	price: number;
	soldOut: boolean;
}

const scrapesCollection = db.collection<ScrapeResult>("3djake");

// Scraper
async function scrape() {
	const url = "https://www.3djake.de/3d-drucker-und-mehr/outlet";

	const text = await (await fetch(url)).text();

	const parser = new DOMParser();
	const htmlDoc = parser.parseFromString(text, "text/html");

	// Minify html
	const element = htmlDoc.querySelector("#productList")!;
	const toRemove: string[] = ["svg", "ul", "input", "button"];

	for (const removingSelector of toRemove) {
		for (const entry of element.querySelectorAll(removingSelector)) {
			entry.remove();
		}
	}

	for (const entry of element.querySelectorAll("img")) {
		entry.setAttribute("srcset", "");
		entry.setAttribute("sizes", "");
		entry.setAttribute("class", "");
	}

	// Regex!
	let productsHTML = element?.outerHTML;

	productsHTML = productsHTML.replace(/data-json="\{.*?\}"/g, ""); // Remove json data
	productsHTML = productsHTML.replace(/\s+/g, " "); // Remove whitespace mess

	// Inference
	const prompt = `
## Task

Extract product details from the provided HTML code and structure the response strictly in JSON format as specified below.

## JSON Format

\`\`\`json
{
 "products": [
    {
      "name": string, // Full name and brand of the product.
      "image": string, // URL of the highest resolution image available for the product.
      "link": string, // URL to the product's details page. Add https://www.3djake.de/ if not given
      "kind": string, // One of the following categories: "FDM 3D Printer", "RESIN 3D Printer", "RESIN Utils", "CNC", "LASER", "Other".
      "priceBeforeSale"?: number, // (Optional) The original price of the product before any discounts, e.g., 45.99 for €45.99.
      "price": number, // The current sale price of the product.
      "soldOut": boolean // If the product is sold out true or false if it's still available
    }
  ]
}
\`\`\`

## Instructions

Parse the HTML to extract product information.
Ensure each product is accurately classified under kind. Use "Other" if no category matches.
If a product does not have a before-sale price, omit the priceBeforeSale field from that product's JSON object.
Always provide the highest resolution image URL for the image field.
Output only the resulting JSON.

## HTML Code

\`\`\`html
${productsHTML}
\`\`\`
`;

	let response;

	try {
		response = await groq.chatCompletion([
			{
				role: "system",
				content: "You are a website data extraction specialist. Only respond in JSON!",
			},
			{
				role: "user",
				content: prompt,
			},
		]);
	} catch (err) {
		console.error(prompt);
		console.error(prompt.length);
		console.error(err);

		await publish({
			title: "3D Jake: Unable to invoke llm",
			body: "Unable to invoke llm",
			click: "https://www.3djake.de/3d-drucker-und-mehr/outlet",
			priority: 3,
			icon: "https://yt3.googleusercontent.com/-EvEIeCH1jcqXn7V1iaAk_B7hn_AurfXA5qHCKl8jD2SVJXIDyGWUFn6B3dM-d_awPB0byWy1w=s900-c-k-c0x00ffffff-no-rj",
		});

		throw new Error("Unable to invoke llm");
	}

	const products = response.products as Product[];

	// Remove trailing " - defekt" in title
	products.forEach((entry) => entry.name.replaceAll(" - defekt", ""));

	return products;
}

const result = await scrape();
console.log(`[3djake] Scraped ${result.length} products`);

// Get last report (if available)
let last = (await scrapesCollection.findOne({}, { sort: { date: -1 } }))?.products;

if (last === undefined) {
	last = [];
}

// Store current
await scrapesCollection.insertOne({ products: result, date: Date.now() });

// Filter added devices
const added: Product[] = [];

for (const entry of result) {
	if (last.some((lastEntry: Product) => lastEntry.link === entry.link)) {
		// Not a new entry
		continue;
	}

	if (entry.soldOut) {
		// Not available anymore
		continue;
	}

	added.push(entry);
}

// Send notification
async function notify() {
	if (added.length === 0) {
		console.log("[3djake] No new entries");
		return;
	}

	console.log(`[3djake] ${added.length} new entries`);

	// Build notification
	const notification: Notification = {
		title: "3D Jake:",
		body: "",
		click: "https://www.3djake.de/3d-drucker-und-mehr/outlet",
		priority: 3,
		icon: "https://yt3.googleusercontent.com/-EvEIeCH1jcqXn7V1iaAk_B7hn_AurfXA5qHCKl8jD2SVJXIDyGWUFn6B3dM-d_awPB0byWy1w=s900-c-k-c0x00ffffff-no-rj",
	};

	// Limit and sort
	added.sort((a, b) => (a.price > b.price ? 1 : -1));

	const counts = {
		cnc: added.filter((entry) => entry.kind === "CNC" || entry.kind === "LASER"),
		fdm: added.filter((entry) => entry.kind === "FDM 3D Printer"),
		sla: added.filter((entry) => entry.kind === "RESIN 3D Printer"),
	};

	const rest = added.length - counts.cnc.length - counts.fdm.length - counts.sla.length;

	// Title
	if (counts.cnc.length > 0) {
		notification.title += ` ${counts.cnc.length} CNC`;
	}

	if (counts.fdm.length > 0) {
		notification.title += ` ${counts.fdm.length} FDM`;
	}

	if (counts.sla.length > 0) {
		notification.title += ` ${counts.sla.length} SLA`;
	}

	if (rest > 0) {
		notification.title += ` +${counts.sla.length}`;
	}

	// Body
	let i = 4;

	for (const cnc of counts.cnc) {
		if (i == 0) {
			continue;
		}

		notification.body += `🔩 ${Math.floor(cnc.price)}€: ${cnc.name.slice(0, 30)}\n`;
		i--;
	}

	for (const fdm of counts.fdm) {
		if (i == 0) {
			continue;
		}

		notification.body += `🌡️ ${Math.floor(fdm.price)}€: ${fdm.name.slice(0, 30)}\n`;
		i--;
	}

	for (const sla of counts.sla) {
		if (i == 0) {
			continue;
		}

		notification.body += `👀 ${Math.floor(sla.price)}€: ${sla.name.slice(0, 30)}\n`;
		i--;
	}

	// Send notification
	await publish(notification);
}

await notify();
