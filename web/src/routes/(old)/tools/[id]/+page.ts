import { error } from "@sveltejs/kit";
import { getTool, TOOLS } from "$lib/registry";
import { t } from "$lib/i18n/t";
import type { EntryGenerator, PageLoad } from "./$types";

export const entries: EntryGenerator = () =>
	TOOLS.map((tool) => ({ id: tool.id }));

export const load: PageLoad = ({ params }) => {
	const tool = getTool(params.id);
	if (!tool) {
		error(404, t("errors.notFound"));
	}
	return { id: tool.id };
};
