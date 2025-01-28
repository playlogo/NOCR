import flags from "./index.ts";

if (flags.ntfy === undefined) {
	throw new Error(`[ntfy] Missing 'ntfy' requirement`);
}

export interface Notification {
	title: string;
	icon?: string;
	click?: string;
	priority?: number;
	body: string;
}

export async function publish(notification: Notification) {
	const res = await fetch(`https://ntfy.sh/${flags.ntfy}`, {
		method: "POST",
		headers: {
			Icon: notification.icon || "",
			Title: notification.title,
			Click: notification.click || "",
			Priority: "" + notification.priority || "3",
		},
		body: notification.body,
	});

	if (!res.ok) {
		console.error(`[ntfy] Error: ${res.statusText}`);
	}
}
