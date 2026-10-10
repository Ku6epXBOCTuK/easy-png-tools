import type { Page } from "$lib/registry";
import { PAGES } from "../registry";
import type { ChainWarning } from "$lib/run-chain";
import type { Field } from "$lib/registry-schema";
import { getMergedDict } from "./locale.svelte";
import { normalizeForSearch, scoreDoc, type SearchDoc } from "./matching";
import { ru } from "./ru";
import { interpolate, t } from "./t";

function labelOf(id: string): string {
	return id
		.replace(/([a-z])([A-Z])/g, "$1 $2")
		.replace(/[_-]+/g, " ")
		.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function pageTitle(page: Page): string {
	return getMergedDict().pages?.[page.slug]?.title ?? page.title;
}

export function pageDescription(page: Page): string {
	return getMergedDict().pages?.[page.slug]?.description ?? page.description;
}

/** Step title for chain UIs: the owning page title, else the raw tool id. */
export function chainStepTitle(toolId: string): string {
	const owner = PAGES.find((p) => p.steps[0].id === toolId);
	return owner ? pageTitle(owner) : toolId;
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

/** Select option label: dict `tools[id].options[fieldId][value]`, fallback is the schema label. */
export function optionLabel(
	toolId: string,
	fieldId: string,
	value: string,
	fallback: string,
): string {
	return getMergedDict().tools[toolId]?.options?.[fieldId]?.[value] ?? fallback;
}

export function verdictText(
	toolId: string,
	key: string,
	vars?: Record<string, string | number>,
): string {
	return interpolate(
		getMergedDict().tools[toolId]?.results?.[key] ?? key,
		vars,
	);
}

export function verdictTone(key: string): "success" | "danger" | "info" {
	if (/[Yy]es$|[Tt]rue$/.test(key)) return "success";
	if (/[Nn]o$|[Ff]alse$/.test(key)) return "danger";
	return "info";
}

/** Human-readable text for a chain run/source warning. */
export function chainWarningText(w: ChainWarning): string {
	switch (w.kind) {
		case "partial":
			return t("chain.warnPartial", { n: w.step, ok: w.ok, total: w.total });
		case "firstOnly":
			return t("chain.warnFirstOnly", { n: w.step, total: w.total });
		case "sourceSkip":
			return t("chain.warnSourceSkip", {
				skipped: w.skipped,
				total: w.total,
			});
	}
}

function dedupe(values: string[]): string[] {
	return [...new Set(values.filter((v) => v.length > 0))];
}

export function pageSearchDoc(page: Page): SearchDoc {
	const active = getMergedDict().pages?.[page.slug];
	return {
		id: page.slug,
		titles: dedupe([
			active?.title ?? "",
			ru.pages?.[page.slug]?.title ?? "",
			page.title,
		]),
		descriptions: dedupe([
			active?.description ?? "",
			ru.pages?.[page.slug]?.description ?? "",
			page.description,
		]),
	};
}

/**
 * Cross-language catalog search: scores via `scoreDoc` over `pageSearchDoc`
 * (titles/descriptions of all locales). Catalog order is preserved,
 * non-matching entries are dropped.
 */
export function searchPages(pages: readonly Page[], query: string): Page[] {
	const q = normalizeForSearch(query.trim());
	if (q.length === 0) return [...pages];
	return pages.filter((page) => scoreDoc(pageSearchDoc(page), q) !== null);
}
