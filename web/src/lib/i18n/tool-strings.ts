import type { ParamDef, ToolEntry } from '$lib/registry';
import { getMergedDict } from './locale.svelte';

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

export function optionLabel(tool: ToolEntry, param: ParamDef, value: string): string {
	const viaDict = getMergedDict().tools[tool.id]?.options?.[param.id]?.[value];
	if (viaDict) return viaDict;
	if (param.type === 'select') {
		return param.options.find((o) => o.value === value)?.label ?? value;
	}
	return value;
}
