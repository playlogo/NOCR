export function randomID() {
	return Math.random().toString(36).slice(2).slice(0, 6);
}
