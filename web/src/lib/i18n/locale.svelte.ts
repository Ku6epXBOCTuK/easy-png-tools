import { BASE_LOCALE, isLocale, type Dict, type Locale } from "./dict";
import { ru } from "./ru";
import { en } from "./en";

const STORAGE_KEY = "locale";

const DICTS: Record<Locale, Dict> = { ru, en };

let locale = $state<Locale>(BASE_LOCALE);

function storage(): Storage | null {
	return typeof localStorage === "undefined" ? null : localStorage;
}

export function getLocale(): Locale {
	return locale;
}

export function getDict(): Dict {
	return DICTS[locale];
}

/** Dictionary of the active locale; missing values fall back to the base locale. */
export function getMergedDict(): Dict {
	if (locale === BASE_LOCALE) return DICTS[BASE_LOCALE];
	const active = DICTS[locale];
	const base = DICTS[BASE_LOCALE];
	return new Proxy(base, {
		get(_target, section: string) {
			const a = (active as unknown as Record<string, unknown>)[section];
			const b = (base as unknown as Record<string, unknown>)[section];
			if (a && b && typeof a === "object" && typeof b === "object") {
				return { ...(b as object), ...(a as object) };
			}
			return a ?? b;
		},
	}) as Dict;
}

export function setLocale(next: Locale): void {
	locale = next;
	storage()?.setItem(STORAGE_KEY, next);
	syncLangAttr();
}

/** Reads the saved choice and syncs the lang attribute. Called on the client. */
export function initLocale(): void {
	if (typeof window === "undefined") return;
	const saved = storage()?.getItem(STORAGE_KEY);
	if (isLocale(saved)) locale = saved;
	syncLangAttr();
}

function syncLangAttr(): void {
	if (typeof document !== "undefined") {
		document.documentElement.lang = locale;
	}
}
