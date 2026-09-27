import { afterEach, describe, expect, it } from "vitest";
import { PAGES } from "../registry";
import { setLocale } from "./locale.svelte";
import {
	pageDescription,
	pageTitle,
	searchPages,
	verdictText,
} from "./schema-tool-strings";

afterEach(() => {
	setLocale("ru");
});

const slugs = (pages: { slug: string }[]) => pages.map((page) => page.slug);

describe("searchPages (кросс-языковой поиск каталога)", () => {
	it("пустой запрос возвращает весь каталог", () => {
		expect(searchPages(PAGES, "")).toHaveLength(PAGES.length);
		expect(searchPages(PAGES, "   ")).toHaveLength(PAGES.length);
	});

	it("находит ru-название, даже когда локаль en", () => {
		setLocale("en");
		expect(slugs(searchPages(PAGES, "обрез"))).toContain("crop-png");
		expect(slugs(searchPages(PAGES, "пустые поля"))).toContain(
			"trim-empty-space-png",
		);
	});

	it("находит en-название, даже когда локаль ru", () => {
		expect(slugs(searchPages(PAGES, "resize"))).toContain("resize-png");
		expect(slugs(searchPages(PAGES, "round corners"))).toContain(
			"round-corners-png",
		);
	});

	it("находит по slug (тексту адреса)", () => {
		expect(slugs(searchPages(PAGES, "crop png"))).toContain("crop-png");
	});

	it("ё и е — один запрос", () => {
		const byYo = searchPages(PAGES, "чёрно");
		const byYe = searchPages(PAGES, "черно");
		expect(slugs(byYo)).toEqual(slugs(byYe));
	});

	it("нет совпадения — пустой список", () => {
		expect(searchPages(PAGES, "квантовый тостер")).toEqual([]);
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

	it.each([
		[
			"verify-is-png",
			"verifyYes",
			"Да — сигнатура настоящего PNG.",
			"Yes — this is a valid PNG signature.",
		],
		[
			"png-is-transparent",
			"transparentNo",
			"Нет — все пиксели полностью непрозрачны.",
			"No — all pixels are fully opaque.",
		],
		[
			"png-orientation",
			"orientationLandscape",
			"Ландшафт — ширина больше высоты.",
			"Landscape — width is greater than height.",
		],
	])(
		"переводит verdict %s/%s в обеих локалях",
		(toolId, key, ruText, enText) => {
			setLocale("ru");
			expect(verdictText(toolId, key)).toBe(ruText);
			setLocale("en");
			expect(verdictText(toolId, key)).toBe(enText);
		},
	);
});
