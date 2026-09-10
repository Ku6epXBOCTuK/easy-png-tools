import type { ParamDef, ToolEntry } from "$lib/v1/registry";
import { getMergedDict } from "./locale.svelte";
import type { SearchDoc } from "./matching";
import { ru } from "./ru";

/**
 * Строки инструмента на активной локали.
 * Русский текст живёт в самом реестре (базовая локаль),
 * переводы — в секции tools словарей; отсутствие ключа даёт фолбэк на реестр.
 */
export function toolTitle(tool: ToolEntry): string {
	return getMergedDict().tools[tool.id]?.title ?? tool.title;
}

export function toolDescription(tool: ToolEntry): string {
	return getMergedDict().tools[tool.id]?.description ?? tool.description;
}

export function paramLabel(tool: ToolEntry, param: ParamDef): string {
	const viaDict = getMergedDict().tools[tool.id]?.params?.[param.id];
	if (viaDict) return viaDict;
	const viaDef = param as { label?: string };
	return viaDef.label ?? param.id;
}

export function optionLabel(
	tool: ToolEntry,
	param: ParamDef,
	value: string,
): string {
	const viaDict = getMergedDict().tools[tool.id]?.options?.[param.id]?.[value];
	if (viaDict) return viaDict;
	if (param.type === "select") {
		return param.options.find((o) => o.value === value)?.label ?? value;
	}
	return value;
}

function dedupe(values: string[]): string[] {
	return [...new Set(values.filter((v) => v.length > 0))];
}

/**
 * Поисковый документ инструмента: строки активной локали, русского и английского
 * (реестр) вместе — запрос находит инструмент по любому из языков независимо
 * от того, какой сейчас включён.
 */
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
