import "jsr:@std/dotenv/load";

import { Job } from "./job.ts";

const jobs = [];

async function collectJobs() {
	for await (const entry of Deno.readDir("./jobs")) {
		// Ignore non job folders
		if (!entry.isDirectory) {
			continue;
		}

		if (entry.name === "utils") {
			continue;
		}

		const path = `./jobs/${entry.name}`;

		try {
			await Deno.stat(`${path}/job.json`);
		} catch (_err) {
			continue;
		}

		// Create job
		try {
			const job = new Job(entry.name);
			await job.load();

			console.log(`[main] Loaded job '${entry.name}'`);

			jobs.push(job);
		} catch (err) {
			console.error(`[main] Error loading job '${entry.name}': ${err}`);
		}
	}
}

// Collect jobs
console.log(`[main] Collecting Jobs`);
await collectJobs();

console.log(`[main] Done`);
