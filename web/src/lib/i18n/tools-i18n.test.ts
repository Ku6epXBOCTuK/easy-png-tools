import { describe, expect, it } from "vitest";
import { TOOLS } from "../old/registry";
import { en } from "./en";
import { ru } from "./ru";

describe("секция tools словарей покрывает реестр", () => {
	it("у каждого инструмента есть перевод ru с непустыми title/description", () => {
		for (const tool of TOOLS) {
			const strings = ru.tools[tool.id];
			expect(strings, `нет перевода для ${tool.id}`).toBeDefined();
			expect(strings?.title, `${tool.id}: title`).toBeTruthy();
			expect(strings?.description, `${tool.id}: description`).toBeTruthy();
		}
	});

	it("переведены подписи всех параметров", () => {
		for (const tool of TOOLS) {
			const params = ru.tools[tool.id]?.params ?? {};
			for (const param of tool.params) {
				const label = params[param.id];
				expect(
					label,
					`${tool.id}.${param.id}: нет перевода подписи`,
				).toBeDefined();
				expect(label?.length).toBeGreaterThan(0);
			}
		}
	});

	it("переведены подписи всех опций select", () => {
		for (const tool of TOOLS) {
			const options = ru.tools[tool.id]?.options ?? {};
			for (const param of tool.params) {
				if (param.type !== "select") continue;
				const labels = options[param.id] ?? {};
				for (const option of param.options) {
					const label = labels[option.value];
					expect(
						label,
						`${tool.id}.${param.id}[${option.value}]: нет перевода`,
					).toBeDefined();
					expect(label.length).toBeGreaterThan(0);
				}
			}
		}
	});

	it("в словарях нет лишних ключей инструментов и параметров", () => {
		const ids = new Set(TOOLS.map((tool) => tool.id));
		for (const dict of [ru.tools, en.tools]) {
			for (const id of Object.keys(dict)) {
				expect(ids.has(id), `лишний инструмент в словаре: ${id}`).toBe(true);
				const tool = TOOLS.find((t) => t.id === id)!;
				const paramIds = new Set(tool.params.map((p) => p.id));
				for (const paramId of Object.keys(dict[id].params ?? {})) {
					expect(
						paramIds.has(paramId),
						`${id}: лишний параметр ${paramId}`,
					).toBe(true);
				}
				const selectIds = new Set(
					tool.params.filter((p) => p.type === "select").map((p) => p.id),
				);
				for (const paramId of Object.keys(dict[id].options ?? {})) {
					expect(
						selectIds.has(paramId),
						`${id}: options у не-select параметра ${paramId}`,
					).toBe(true);
				}
			}
		}
	});

	it("тексты-результаты анализаторов переведены в обоих словарях", () => {
		const expectations: Array<[string, string[]]> = [
			["png-is-grayscale", ["grayscaleYes", "grayscaleNo"]],
			["png-is-transparent", ["transparentYes", "transparentNo"]],
			[
				"png-orientation",
				["orientationPortrait", "orientationLandscape", "orientationSquare"],
			],
		];
		for (const [id, keys] of expectations) {
			for (const key of keys) {
				expect(en.tools[id]?.results?.[key], `${id}.${key} (en)`).toBeDefined();
				expect(ru.tools[id]?.results?.[key], `${id}.${key} (ru)`).toBeDefined();
			}
		}
	});
});
