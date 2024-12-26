import flags from "./index.ts";

export interface Notification {
	title: string;
	icon?: string;
	click?: string;
	priority?: number;
	body: string;
}

export async function publish(notification: Notification) {
	await fetch(`https://ntfy.sh/${flags.ntfy}`, {
		method: "POST",
		headers: {
			Icon: notification.icon || "",
			Title: notification.title,
			Click: notification.click || "",
			Priority: "" + notification.priority || "3",
		},
		body: notification.body,
	});
}
