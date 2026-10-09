export function storage(): Storage | null {
	return typeof localStorage === "undefined" ? null : localStorage;
}

// setItem throws in privacy modes; persistence is best-effort.
export function safeSetItem(key: string, value: string): void {
	try {
		storage()?.setItem(key, value);
	} catch {
		// ignore
	}
}
