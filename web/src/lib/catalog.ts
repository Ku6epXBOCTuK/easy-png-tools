import { CATEGORY_IDS } from "./categories";
import { TOOLS, type ToolEntry } from "./registry";

export type PreviewGroup = {
	id: string;
	tools: ToolEntry[];
};

/**
 * Preview-каталог: полный реестр инструментов, сгруппированный по категориям.
 */
export const PREVIEW_GROUPS: PreviewGroup[] = CATEGORY_IDS.map((category) => ({
	id: category,
	tools: TOOLS.filter((tool) => tool.category === category),
})).filter((group) => group.tools.length > 0);

export const PREVIEW_TOTAL = TOOLS.length;
