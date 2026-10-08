import { SvelteSet } from "svelte/reactivity";

const KEY = "fav-tools";

const slugs = new SvelteSet<string>();

function storage(): Storage | null {
	return typeof localStorage === "undefined" ? null : localStorage;
}

export function initFavorites(): void {
	const raw = storage()?.getItem(KEY);
	if (!raw) return;
	try {
		const list: unknown = JSON.parse(raw);
		if (Array.isArray(list)) {
			for (const s of list) if (typeof s === "string") slugs.add(s);
		}
	} catch {
		// garbage in localStorage: fall back to an empty set
	}
}

export function isFav(slug: string): boolean {
	return slugs.has(slug);
}

export function toggleFav(slug: string): void {
	if (slugs.has(slug)) {
		slugs.delete(slug);
	} else {
		slugs.add(slug);
	}
	storage()?.setItem(KEY, JSON.stringify([...slugs]));
}

/** Favorite pages from the list (order preserved). */
export function favPages<T extends { slug: string }>(pages: readonly T[]): T[] {
	return pages.filter((p) => slugs.has(p.slug));
}

/** Same pages, favorites first (a boost in search results). */
export function favFirst<T extends { slug: string }>(pages: readonly T[]): T[] {
	return [...pages].sort(
		(a, b) => Number(slugs.has(b.slug)) - Number(slugs.has(a.slug)),
	);
}
