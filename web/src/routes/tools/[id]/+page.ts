import { error } from '@sveltejs/kit';
import { getTool, TOOLS } from '$lib/registry';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => TOOLS.map((tool) => ({ id: tool.id }));

export const load: PageLoad = ({ params }) => {
	const tool = getTool(params.id);
	if (!tool) {
		error(404, 'Инструмент не найден');
	}
	return { id: tool.id };
};
