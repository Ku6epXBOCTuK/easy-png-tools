import { describe, expect, it } from "vitest";
import { TOOLS, type ToolEntry } from "../registry";
import { en } from "./en";
import { ru } from "./ru";

function toolKeys(tool: ToolEntry): { fields: string[]; groups: string[] } {
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

describe("полнота словарей для нового registry", () => {
	it("у каждого инструмента есть перевод ru с непустыми title/description", () => {
		for (const tool of TOOLS) {
			const strings = ru.tools[tool.id];
			expect(strings, `нет перевода ru для ${tool.id}`).toBeDefined();
			expect(strings?.title, `${tool.id}: title`).toBeTruthy();
			expect(strings?.description, `${tool.id}: description`).toBeTruthy();
		}
	});

	it("каждый label-ключ поля схемы переведён в fields обоих словарей", () => {
		for (const tool of TOOLS) {
			for (const key of toolKeys(tool).fields) {
				expect(en.fields?.[key], `${tool.id}: ${key} в en`).toBeTruthy();
				expect(ru.fields?.[key], `${tool.id}: ${key} в ru`).toBeTruthy();
			}
		}
	});

	it("каждый groups-ключ схемы переведён в groups обоих словарей", () => {
		for (const tool of TOOLS) {
			for (const key of toolKeys(tool).groups) {
				expect(en.groups?.[key], `${tool.id}: ${key} в en`).toBeTruthy();
				expect(ru.groups?.[key], `${tool.id}: ${key} в ru`).toBeTruthy();
			}
		}
	});

	it("в словарях нет лишних инструментов", () => {
		const ids = new Set(TOOLS.map((tool) => tool.id));
		for (const dict of [ru.tools, en.tools]) {
			for (const id of Object.keys(dict)) {
				expect(ids.has(id), `лишний инструмент в словаре: ${id}`).toBe(true);
			}
		}
	});

	it("в fields и groups нет ключей, не используемых схемами", () => {
		const usedFields = new Set<string>();
		const usedGroups = new Set<string>();
		for (const tool of TOOLS) {
			const keys = toolKeys(tool);
			keys.fields.forEach((k) => usedFields.add(k));
			keys.groups.forEach((k) => usedGroups.add(k));
		}
		for (const dict of [en, ru]) {
			for (const key of Object.keys(dict.fields ?? {})) {
				expect(usedFields.has(key), `лишний fields-ключ: ${key}`).toBe(true);
			}
			for (const key of Object.keys(dict.groups ?? {})) {
				expect(usedGroups.has(key), `лишний groups-ключ: ${key}`).toBe(true);
			}
		}
	});
});
