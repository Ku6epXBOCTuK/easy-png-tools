import { PAGES } from "$lib/registry";

export const prerender = true;

export function entries() {
	return PAGES.map((page) => ({ id: page.slug }));
}

export function load({ params }: { params: { id: string } }) {
	return { id: params.id };
}
