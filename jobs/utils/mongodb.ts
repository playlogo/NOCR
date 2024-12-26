import flags from "./index.ts";

import { MongoClient, ObjectId } from "https://deno.land/x/mongo@v0.33.0/mod.ts";

// Connect to db
const client = new MongoClient();
await client.connect(flags.mongosrv!);

export const db = client.database("nocr");
