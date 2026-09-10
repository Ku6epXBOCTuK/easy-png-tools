import { TOOLS } from "$lib/registry";

export const prerender = true;

export function entries() {
	return TOOLS.map((tool) => ({ id: tool.id }));
}

export function load({ params }: { params: { id: string } }) {
	return { id: params.id };
}
