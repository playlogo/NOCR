import { randomID } from "./utils.ts";

const ENV_LOOKUP: { [key: string]: string } = {
	mongo: "MONGO_DB_SRV",
	ntfy: "NTFY_CHANNEL",
};

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
				args: string[];
				env?: string[];
			};
		} catch (err) {
			console.error(description_content);
			console.error(`[main] Failed to parse description of job '${this.name}': ${err}`);
			return;
		}

		this.cron = description.schedules;

		// Collect requirements
		const args: string[] = [...description.args];

		for (const requirement of description.requires) {
			if (ENV_LOOKUP[requirement] === undefined) {
				throw new Error(`[jobs] Unknown requirement '${requirement}'`);
			}

			if (!Deno.env.has(ENV_LOOKUP[requirement])) {
				throw new Error(
					`[jobs] Missing env variable '${ENV_LOOKUP[requirement]}' for requirement '${requirement}'`
				);
			}

			args.push(`--${requirement}=${Deno.env.get(ENV_LOOKUP[requirement])}`);
		}

		// Collect env variables
		const env: { [key: string]: string } = {};

		if (description.env !== undefined) {
			for (const envVar of description.env) {
				if (!Deno.env.has(envVar)) {
					throw new Error(`[jobs] Missing manually required env variable '${envVar}'`);
				}

				env[envVar] = Deno.env.get(envVar)!;
			}
		}

		// Resolve home path in executable
		description.executable = description.executable.replace(
			"~",
			Deno.build.os === "windows" ? Deno.env.get("USERPROFILE")! : Deno.env.get("HOME")!
		);

		this.command = new Deno.Command(description.executable, {
			cwd: `${Deno.cwd()}/jobs/${this.name}`,
			stderr: "piped",
			stdout: "piped",
			args,
			env,
		});

		// Schedule cron runs
		const fn = this.run.bind(this);

		let i = 0;
		for (const cronTime of this.cron) {
			Deno.cron(`${this.name}-${i}`, cronTime, fn);
			i++;
		}
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
