import flags from "./index.ts";

import { MongoClient } from "https://deno.land/x/mongo@v0.33.0/mod.ts";

// Check if flag exist
if (flags.mongo === undefined) {
	throw new Error(`[mongo] Missing 'mongo' requirement`);
}

// Connect to db
const client = new MongoClient();
await client.connect(flags.mongo!);

export const db = client.database("nocr");
