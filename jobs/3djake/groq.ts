if (!Deno.env.has("GROQ_API_KEY")) {
	console.error("Exiting: GROQ_API_KEY is missing");
	Deno.exit(1);
}

export const groq = {
	apiKey: Deno.env.get("GROQ_API_KEY"),

	async chatCompletion(messages: any[]) {
		const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${groq.apiKey}`,
			},
			body: JSON.stringify({
				messages: messages,
				model: "llama-3.3-70b-versatile",
				temperature: 0.5,
				max_tokens: 4092,
				top_p: 0.95,
				stream: false,
				response_format: {
					type: "json_object",
				},
				stop: null,
			}),
		});

		if (!res.ok) {
			throw new Error(`GROQ: Failed to fetch response: ${res.statusText}`);
		}

		const json = await res.json();

		// Parse JSON res
		try {
			const completion = JSON.parse(json.choices[0].message.content);
			return completion;
		} catch (err) {
			throw new Error(`GROQ: Failed to parse JSON: ${err}`);
		}
	},
};
