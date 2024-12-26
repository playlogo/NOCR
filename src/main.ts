import "jsr:@std/dotenv/load";

class Job {
	name: string;
	cron: string[] = [];
	subprocess: Deno.ChildProcess | undefined;

	constructor(name: string) {
		this.name = name;
	}

	async load() {
		// Load job json description
		const description_content = await Deno.readTextFile(`./jobs/${this.name}/job.json`);
		let description;

		try {
			description = JSON.parse(description_content);
		} catch (err) {
			console.error(description_content);
			console.error(`[main] Failed to parse description of job '${this.name}': ${err}`);
			return;
		}

		this.cron = description.schedules;
	}
}

// Collect jobs

for await (const entry of Deno.readDir("./jobs")) {
	// Ignore non job folders
	if (!entry.isDirectory) {
		continue;
	}

	console.log(entry);
}
console.log(Deno.env.get("GREETING")); // "Hello, world."

// 31
