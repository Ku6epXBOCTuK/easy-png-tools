import type { ToolEntry } from "$lib/registry";
import type { Field } from "$lib/registry-schema";
import { ru } from "./ru";
import { getMergedDict } from "./locale.svelte";
import type { SearchDoc } from "./matching";
import { t } from "./t";

function labelOf(id: string): string {
	return id
		.replace(/([a-z])([A-Z])/g, "$1 $2")
		.replace(/[_-]+/g, " ")
		.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function toolTitle(tool: ToolEntry): string {
	return getMergedDict().tools[tool.id]?.title ?? tool.title;
}

export function toolDescription(tool: ToolEntry): string {
	return getMergedDict().tools[tool.id]?.description ?? tool.description;
}

export function fieldLabel(field: Field<unknown>, id: string): string {
	const key = (field.spec as { label?: string }).label;
	if (key) {
		const translated = t(key);
		if (translated !== key) return translated;
	}
	return labelOf(id);
}

export function groupLabel(title: string): string {
	return t(title);
}

/** Подпись опции select: словарь `tools[id].options[fieldId][value]`, фолбэк — label из схемы. */
export function optionLabel(
	toolId: string,
	fieldId: string,
	value: string,
	fallback: string,
): string {
	return getMergedDict().tools[toolId]?.options?.[fieldId]?.[value] ?? fallback;
}

export function verdictText(toolId: string, key: string): string {
	return getMergedDict().tools[toolId]?.results?.[key] ?? key;
}

export function verdictTone(key: string): "success" | "danger" | "info" {
	if (/[Yy]es$|[Tt]rue$/.test(key)) return "success";
	if (/[Nn]o$|[Ff]alse$/.test(key)) return "danger";
	return "info";
}

function dedupe(values: string[]): string[] {
	return [...new Set(values.filter((v) => v.length > 0))];
}

export function toolSearchDoc(tool: ToolEntry): SearchDoc {
	const active = getMergedDict().tools[tool.id];
	return {
		id: tool.id,
		titles: dedupe([
			active?.title ?? "",
			ru.tools[tool.id]?.title ?? "",
			tool.title,
		]),
		descriptions: dedupe([
			active?.description ?? "",
			ru.tools[tool.id]?.description ?? "",
			tool.description,
		]),
	};
}
