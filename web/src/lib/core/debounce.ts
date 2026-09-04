export function debounce(
	fn: () => void,
	ms: number,
): { (): void; cancel: () => void } {
	let timer: ReturnType<typeof setTimeout> | undefined;

	const debounced = () => {
		if (timer !== undefined) clearTimeout(timer);
		timer = setTimeout(() => fn(), ms);
	};

	debounced.cancel = () => {
		if (timer !== undefined) clearTimeout(timer);
	};

	return debounced;
}
