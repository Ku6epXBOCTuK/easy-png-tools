import { afterEach, describe, expect, it } from "vitest";
import { PAGES } from "../registry";
import { setLocale } from "./locale.svelte";
import { en } from "./en";
import { ru } from "./ru";
import { searchPages, verdictText } from "./schema-tool-strings";

const YO = "\u0451";
const YE = "\u0435";

afterEach(() => {
	setLocale("ru");
});

const slugs = (pages: { slug: string }[]) => pages.map((page) => page.slug);

describe("searchPages (cross-locale catalog search)", () => {
	it("empty query returns the whole catalog", () => {
		expect(searchPages(PAGES, "")).toHaveLength(PAGES.length);
		expect(searchPages(PAGES, "   ")).toHaveLength(PAGES.length);
	});

	it("finds the ru title while the locale is en", () => {
		setLocale("en");
		// query derived from the ru title
		const cropQuery = (ru.pages?.["crop-png"]?.title ?? "")
			.toLowerCase()
			.slice(0, 5);
		expect(slugs(searchPages(PAGES, cropQuery))).toContain("crop-png");
		// two middle words of the ru title (verb, X, Y, PNG)
		const trimQuery = (ru.pages?.["trim-empty-space-png"]?.title ?? "")
			.toLowerCase()
			.split(" ")
			.slice(1, 3)
			.join(" ");
		expect(slugs(searchPages(PAGES, trimQuery))).toContain(
			"trim-empty-space-png",
		);
	});

	it("finds the en title while the locale is ru", () => {
		expect(slugs(searchPages(PAGES, "resize"))).toContain("resize-png");
		expect(slugs(searchPages(PAGES, "round corners"))).toContain(
			"round-corners-png",
		);
	});

	it("finds by slug (address text)", () => {
		expect(slugs(searchPages(PAGES, "crop png"))).toContain("crop-png");
	});

	it("yo and ye spellings are one query", () => {
		// query with U+0451 derived from the ru grayscale title, then folded to U+0435
		const qYo = (ru.pages?.["grayscale-png"]?.title ?? "")
			.split(" ")[0]
			.slice(0, 5);
		expect(qYo).toContain(YO);
		const qYe = qYo.replaceAll(YO, YE);
		expect(slugs(searchPages(PAGES, qYo))).toEqual(
			slugs(searchPages(PAGES, qYe)),
		);
	});

	it("no match returns an empty list", () => {
		expect(searchPages(PAGES, "zzz qqq")).toEqual([]);
	});
});

describe("verdictText (verdict with vars)", () => {
	it("interpolates {vars} in both locales", () => {
		setLocale("ru");
		expect(verdictText("file-size", "line", { kb: "12.3" })).toBe(
			(ru.tools["file-size"]?.results?.line ?? "").replace("{kb}", "12.3"),
		);
		setLocale("en");
		expect(verdictText("file-size", "line", { kb: "12.3" })).toBe(
			(en.tools["file-size"]?.results?.line ?? "").replace("{kb}", "12.3"),
		);
	});

	it("returns the key as-is when it is missing from the dictionary", () => {
		expect(verdictText("file-size", "no-such-key")).toBe("no-such-key");
	});

	it.each([
		["verify-png", "verifyYes"],
		["is-transparent", "transparentNo"],
		["orientation", "orientationLandscape"],
	])("translates verdict %s/%s in both locales", (toolId, key) => {
		const ruText = ru.tools[toolId]?.results?.[key];
		const enText = en.tools[toolId]?.results?.[key];
		expect(ruText, `${toolId}/${key} @ru dict`).toBeTruthy();
		expect(enText, `${toolId}/${key} @en dict`).toBeTruthy();
		expect(ruText).not.toBe(enText);
		setLocale("ru");
		expect(verdictText(toolId, key)).toBe(ruText);
		setLocale("en");
		expect(verdictText(toolId, key)).toBe(enText);
	});
});
