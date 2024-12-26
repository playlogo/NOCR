import { randomID } from "./utils.ts";

export class Job {
	name: string;
	cron: string[] = [];
	command: Deno.Command | undefined;

	constructor(name: string) {
		this.name = name;
	}

	async load() {
		// Load job json description
		const description_content = await Deno.readTextFile(`./jobs/${this.name}/job.json`);
		let description;

		try {
			description = JSON.parse(description_content) as {
				requires: string[];
				schedules: string[];
				executable: string;
			};
		} catch (err) {
			console.error(description_content);
			console.error(`[main] Failed to parse description of job '${this.name}': ${err}`);
			return;
		}

		this.cron = description.schedules;

		this.command = new Deno.Command(description.executable, {
			cwd: `${Deno.cwd()}/jobs/${this.name}`,
			args: [
				"run",
				"--allow-all",
				"main.ts",
				`--mongosrv=${Deno.env.get("MONGO_DB_SRV") || "none"}`,
				`--ntfy=${Deno.env.get("NTFY_CHANNEL") || "none"}`,
			],
			stderr: "piped",
			stdout: "piped",
			env: {
				GROQ_API_KEY: Deno.env.get("GROQ_API_KEY") || "",
			},
		});

		// Schedule cron runs
		const fn = this.run.bind(this);

		let i = 0;
		for (const cronTime of this.cron) {
			Deno.cron(`${this.name}-${i}`, cronTime, fn);
			i++;
		}

		fn();
	}

	async run() {
		const ray = randomID();
		const start = Date.now();

		console.log(`[job] [${this.name}] [${ray}] Executing at ${new Date().toISOString()}`);

		// Spawn process
		let process;

		try {
			process = this.command!.spawn();
		} catch (err) {
			console.error(`[job] [${this.name}] [${ray}] Failed to spawn process: ${err}`);
			return;
		}

		const out = await process.output();
		const duration = Math.round((Date.now() - start) / 1000);

		if (out.code === 0) {
			console.log(`[job] [${this.name}] [${ray}] Successfully finished in ${duration}s`);
			console.log(new TextDecoder().decode(out.stdout));
			console.log(new TextDecoder().decode(out.stderr));
		} else {
			console.error(`[job] [${this.name}] [${ray}] Failed in ${duration}s`);
			console.error(new TextDecoder().decode(out.stdout));
			console.error(new TextDecoder().decode(out.stderr));
		}
	}
}
