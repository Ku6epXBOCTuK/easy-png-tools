// Popover dismiss: close on pointerdown outside the root and on Escape.
// Subscribe inside `$effect` while the popover is open; returns unsubscribe.
export function onDismiss(
	root: () => HTMLElement | null,
	close: () => void,
): () => void {
	function onPointerDown(e: PointerEvent) {
		if (!root()?.contains(e.target as Node)) close();
	}
	function onKey(e: KeyboardEvent) {
		if (e.key === "Escape") close();
	}
	window.addEventListener("pointerdown", onPointerDown);
	window.addEventListener("keydown", onKey);
	return () => {
		window.removeEventListener("pointerdown", onPointerDown);
		window.removeEventListener("keydown", onKey);
	};
}
