import { getMergedDict } from "./locale.svelte";

export function interpolate(
	template: string,
	vars?: Record<string, string | number>,
): string {
	if (!vars) return template;
	return template.replace(/\{(\w+)\}/g, (match, name: string) =>
		name in vars ? String(vars[name]) : match,
	);
}

/**
 * Перевод по точечному пути вида 'header.workspace' или 'errors.ERR_BAD_HEX'.
 * Сначала активная локаль, затем базовая; если ключа нет нигде — возвращается сам путь.
 */
export function t(
	path: string,
	vars?: Record<string, string | number>,
): string {
	let node: unknown = getMergedDict();
	for (const part of path.split(".")) {
		if (
			node &&
			typeof node === "object" &&
			part in (node as Record<string, unknown>)
		) {
			node = (node as Record<string, unknown>)[part];
		} else {
			return path;
		}
	}
	return typeof node === "string" ? interpolate(node, vars) : path;
}
