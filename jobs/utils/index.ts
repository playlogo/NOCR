import { parseArgs } from "jsr:@std/cli/parse-args";

const flags = parseArgs(Deno.args, {
	string: ["ntfy", "mongosrv"],
});

export default flags;
