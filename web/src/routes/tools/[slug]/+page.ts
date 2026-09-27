import { PAGES } from "$lib/registry";

export const prerender = true;

export function entries() {
	return PAGES.map((page) => ({ slug: page.slug }));
}

export function load({ params }: { params: { slug: string } }) {
	return { slug: params.slug };
}
