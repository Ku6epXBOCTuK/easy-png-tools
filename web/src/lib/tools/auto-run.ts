export function createAutoRunner(delayMs = 300) {
	let token = 0;
	let timer: ReturnType<typeof setTimeout> | undefined;

	return {
		next(): number {
			cancelTimer();
			return ++token;
		},
		isCurrent(t: number): boolean {
			return t === token;
		},
		schedule(run: () => void): () => void {
			cancelTimer();
			timer = setTimeout(run, delayMs);
			return cancelTimer;
		},
	};

	function cancelTimer() {
		if (timer !== undefined) {
			clearTimeout(timer);
			timer = undefined;
		}
	}
}
