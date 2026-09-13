import { afterEach, describe, expect, it } from "vitest";
import { TOOLS } from "../registry";
import { setLocale } from "./locale.svelte";
import { searchTools, verdictText } from "./schema-tool-strings";

afterEach(() => {
	setLocale("ru");
});

const ids = (tools: { id: string }[]) => tools.map((t) => t.id);

describe("searchTools (кросс-языковой поиск каталога)", () => {
	it("пустой запрос возвращает весь каталог", () => {
		expect(searchTools(TOOLS, "")).toHaveLength(TOOLS.length);
		expect(searchTools(TOOLS, "   ")).toHaveLength(TOOLS.length);
	});

	it("находит ru-название, даже когда локаль en", () => {
		setLocale("en");
		expect(ids(searchTools(TOOLS, "обрез"))).toContain("crop-png");
		expect(ids(searchTools(TOOLS, "пустые поля"))).toContain(
			"trim-empty-space-png",
		);
	});

	it("находит en-название, даже когда локаль ru", () => {
		expect(ids(searchTools(TOOLS, "resize"))).toContain("resize-png");
		expect(ids(searchTools(TOOLS, "round corners"))).toContain(
			"round-corners-png",
		);
	});

	it("находит по id", () => {
		expect(ids(searchTools(TOOLS, "crop png"))).toContain("crop-png");
	});

	it("ё и е — один запрос", () => {
		const byYo = searchTools(TOOLS, "чёрно");
		const byYe = searchTools(TOOLS, "черно");
		expect(ids(byYo)).toEqual(ids(byYe));
	});

	it("нет совпадения — пустой список", () => {
		expect(searchTools(TOOLS, "квантовый тостер")).toEqual([]);
	});
});

describe("verdictText (вердикт с vars)", () => {
	it("интерполирует {vars} в обоих локалях", () => {
		setLocale("ru");
		expect(verdictText("png-file-size", "line", { kb: "12.3" })).toBe(
			"Размер PNG: 12.3 КБ",
		);
		setLocale("en");
		expect(verdictText("png-file-size", "line", { kb: "12.3" })).toBe(
			"PNG size: 12.3 KB",
		);
	});

	it("без vars возвращает ключ как есть при отсутствии в словаре", () => {
		expect(verdictText("png-file-size", "нет-такого")).toBe("нет-такого");
	});
});
