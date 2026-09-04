import { CATEGORIES } from "../categories";
import { TOOLS, type ToolEntry } from "../registry-new";

export type PreviewGroup = {
	id: string;
	label: string;
	tools: ToolEntry[];
};

/** Uppercase labels для всех категорий каталога (стиль нового дизайна). */
const GROUP_LABELS: Record<string, string> = {
	convert: "CONVERT",
	alpha: "TRANSPARENCY",
	color: "COLOR",
	geometry: "GEOMETRY",
	filters: "FILTERS",
	text: "TEXT",
	analyze: "ANALYZE",
	generate: "GENERATE",
};

/**
 * Preview-каталог: полный реестр инструментов, сгруппированный по категориям.
 * Больше не урезаем до референс-набора — показываем все инструменты из TOOLS.
 */
export const PREVIEW_GROUPS: PreviewGroup[] = CATEGORIES.map((category) => ({
	id: category,
	label: GROUP_LABELS[category] ?? category.toUpperCase(),
	tools: TOOLS.filter((tool) => tool.category === category),
})).filter((group) => group.tools.length > 0);

export const PREVIEW_TOTAL = TOOLS.length;
