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

	const productsHTML = htmlDoc.querySelector("#productList")?.outerHTML;

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
      "kind": string, // One of the following categories: "FDM 3D Printer", "RESIN 3D Printer", "RESIN Utils", "CNC", "Other".
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

	const products = await groq.chatCompletion([
		{
			role: "system",
			content: "You are a website data extraction specialist. Only respond in JSON!",
		},
		{
			role: "user",
			content: prompt,
		},
	]);
	return products.products as Product[];
}

//const result = await scrape();

// Get last report (if available)
const last = await scrapesCollection.findOne({}, { sort: { date: -1 } });

console.log(last);

// Store current
//await scrapesCollection.insertOne({ products: result, date: Date.now() });

const notification: Notification = {
	title: "3D Jake: 1 CNC, 2 FDM, 1 SLA",
	body: `🔩 109€: Phrozen Sonic Mightydsaadsas
🌡️ 295€: Phrozen Sonic Mightydsaadsas
👀  89€: Phrozen Sonic Mightydsaadsas`,
	click: "https://www.3djake.de/3d-drucker-und-mehr/outlet",
	priority: 3,
	icon: "https://yt3.googleusercontent.com/-EvEIeCH1jcqXn7V1iaAk_B7hn_AurfXA5qHCKl8jD2SVJXIDyGWUFn6B3dM-d_awPB0byWy1w=s900-c-k-c0x00ffffff-no-rj",
};
