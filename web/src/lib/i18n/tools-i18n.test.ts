import { describe, expect, it } from "vitest";
import { PAGES, TOOLS, type Tool } from "../registry";
import { en } from "./en";
import { ru } from "./ru";

function toolKeys(tool: Tool): { fields: string[]; groups: string[] } {
	const fields: string[] = [];
	for (const field of Object.values(tool.schema?.fields ?? {})) {
		const label = (field as { spec?: { label?: string } }).spec?.label;
		if (label) fields.push(label.replace(/^fields\./, ""));
	}
	const groups = (tool.schema?.layout?.groups ?? []).map((g) =>
		(g.title ?? "").replace(/^groups\./, ""),
	);
	return { fields, groups };
}

type SelectOption = { value: string; label: string };

function selectOptions(
	tool: Tool,
): { fieldId: string; option: SelectOption }[] {
	const result: { fieldId: string; option: SelectOption }[] = [];
	for (const [fieldId, field] of Object.entries(tool.schema?.fields ?? {})) {
		const spec = (
			field as { spec?: { kind?: string; options?: SelectOption[] } }
		).spec;
		if (spec?.kind !== "select" && spec?.kind !== "segmented") continue;
		for (const option of spec.options ?? []) result.push({ fieldId, option });
	}
	return result;
}

describe("dictionary completeness for the new registry", () => {
	it("every page has an ru translation with non-empty title/description", () => {
		for (const page of PAGES) {
			const strings = ru.pages?.[page.slug];
			expect(strings, `no ru translation for ${page.slug}`).toBeDefined();
			expect(strings?.title, `${page.slug}: title`).toBeTruthy();
			expect(strings?.description, `${page.slug}: description`).toBeTruthy();
		}
	});

	it("every schema field label key is translated in fields of both dictionaries", () => {
		for (const tool of TOOLS) {
			for (const key of toolKeys(tool).fields) {
				expect(en.fields?.[key], `${tool.id}: ${key} in en`).toBeTruthy();
				expect(ru.fields?.[key], `${tool.id}: ${key} in ru`).toBeTruthy();
			}
		}
	});

	it("every schema groups key is translated in groups of both dictionaries", () => {
		for (const tool of TOOLS) {
			for (const key of toolKeys(tool).groups) {
				expect(en.groups?.[key], `${tool.id}: ${key} in en`).toBeTruthy();
				expect(ru.groups?.[key], `${tool.id}: ${key} in ru`).toBeTruthy();
			}
		}
	});

	it("all active select options are translated in en and ru", () => {
		for (const tool of TOOLS) {
			for (const { fieldId, option } of selectOptions(tool)) {
				if (fieldId === "component") continue;
				const key = `${tool.id}: ${fieldId}.${option.value}`;
				expect(en.tools[tool.id]?.options?.[fieldId]?.[option.value], key).toBe(
					option.label,
				);
				expect(
					ru.tools[tool.id]?.options?.[fieldId]?.[option.value],
					key,
				).toBeTruthy();
			}
		}
	});

	it("the pages section has no extra pages", () => {
		const slugs = new Set(PAGES.map((page) => page.slug));
		for (const [locale, dict] of [
			["ru", ru],
			["en", en],
		] as const) {
			for (const key of Object.keys(dict.pages ?? {})) {
				expect(slugs.has(key), `extra page in ${locale}: ${key}`).toBe(true);
			}
		}
	});

	it("dictionaries have no keys without a registry entry", () => {
		const known = new Set([
			...TOOLS.map((tool) => tool.id),
			...PAGES.map((page) => page.slug),
		]);
		for (const dict of [ru.tools, en.tools]) {
			for (const key of Object.keys(dict)) {
				expect(known.has(key), `extra dictionary key: ${key}`).toBe(true);
			}
		}
	});

	it("fields and groups have no keys unused by schemas", () => {
		const usedFields = new Set<string>();
		const usedGroups = new Set<string>();
		for (const tool of TOOLS) {
			const keys = toolKeys(tool);
			keys.fields.forEach((k) => usedFields.add(k));
			keys.groups.forEach((k) => usedGroups.add(k));
		}
		for (const dict of [en, ru]) {
			for (const key of Object.keys(dict.fields ?? {})) {
				expect(usedFields.has(key), `extra fields key: ${key}`).toBe(true);
			}
			for (const key of Object.keys(dict.groups ?? {})) {
				expect(usedGroups.has(key), `extra groups key: ${key}`).toBe(true);
			}
		}
	});
});
