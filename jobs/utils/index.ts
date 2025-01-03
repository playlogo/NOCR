import { parseArgs } from "jsr:@std/cli/parse-args";

const flags = parseArgs(Deno.args, {
	string: ["ntfy", "mongo"],
});

export default flags;
