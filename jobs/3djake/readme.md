# Job - 3DJake

Monitor 3D Jake's (a German online shop for 3D Printers) outlet page and send push notifications if new deals get added.

Uses LLAMA3.3 to extract products from the html page.

Required env variables:

- `NTFY_CHANNEL`: [NTFY](https://ntfy.sh/) Channel name used for push notifications
- `MONGO_DB_SRV`: Connection string for MongoDB, example: mongodb://username:password@ip:27017/?authMechanism=SCRAM-SHA-256
- `GROQ_API_KEY`: Free (as of Feb 2025) API key for [GROQ](https://groq.com/) LLM Inference, used for product extraction
