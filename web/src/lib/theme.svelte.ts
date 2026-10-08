export type ThemeChoice = "light" | "dark";

const STORAGE_KEY = "theme";

let theme = $state<ThemeChoice>("light");

function storage(): Storage | null {
	return typeof localStorage === "undefined" ? null : localStorage;
}

function systemTheme(): ThemeChoice {
	if (typeof window === "undefined" || !window.matchMedia) return "light";
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

function apply(): void {
	if (typeof document === "undefined") return;
	document.documentElement.dataset.theme = theme;
}

export function getTheme(): ThemeChoice {
	return theme;
}

export function setTheme(next: ThemeChoice): void {
	theme = next;
	storage()?.setItem(STORAGE_KEY, next);
	apply();
}

/**
 * Catches up state after hydration: the actual attribute is already set by
 * the inline script in app.html; here it is read and synced with runes so
 * the header button reflects the real theme.
 */
export function initTheme(): void {
	if (typeof window === "undefined") return;
	const attr =
		typeof document !== "undefined"
			? document.documentElement.dataset.theme
			: undefined;
	theme = attr === "dark" || attr === "light" ? attr : systemTheme();
	apply();
}
