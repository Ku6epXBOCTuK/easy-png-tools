import { afterEach, describe, expect, it, vi } from "vitest";
import { getLocale, setLocale } from "./locale.svelte";
import { LOCALE_TAGS } from "./dict";
import { normalizeForSearch } from "./matching";
import { t } from "./t";
import { getPageBySlug, PAGES } from "../registry";
import { pageTitle } from "./schema-tool-strings";
import { en } from "./en";
import { ru } from "./ru";

afterEach(() => {
	setLocale("ru");
	vi.unstubAllGlobals();
});

describe("smoke: i18n (new UI)", () => {
	it("1. html lang follows the locale", () => {
		const doc = { documentElement: { lang: "" } };
		vi.stubGlobal("document", doc);
		setLocale("en");
		expect(doc.documentElement.lang).toBe("en");
		setLocale("ru");
		expect(doc.documentElement.lang).toBe("ru");
	});

	it("2. getLocale reflects the last choice", () => {
		setLocale("en");
		expect(getLocale()).toBe("en");
		setLocale("ru");
		expect(getLocale()).toBe("ru");
	});

	it("3. key sections are translated without mixing languages", () => {
		const samples: Array<[string, string | undefined, string]> = [
			["header.workspace", ru.header.workspace, "Workspace"],
			["catalog.heading", ru.catalog.heading, "Tool catalog"],
			["home.heroTitle", ru.home.heroTitle, "What do you want to do"],
			["chain.inputLegend", ru.chain.inputLegend, "Input"],
			["resultCard.nextTool", ru.resultCard.nextTool, "Next tool"],
			["download.busy", ru.download.busy, "Preparing file"],
			["dropZone.pickDefault", ru.dropZone.pickDefault, "Drop an image"],
		];
		for (const [key, ruValue, enPart] of samples) {
			setLocale("ru");
			expect(t(key), key + " @ru").toBe(ruValue);
			setLocale("en");
			expect(t(key), key + " @en").toContain(enPart);
		}
	});

	it("4. tool title switches with the locale (schema-tool-strings)", () => {
		const page = getPageBySlug("crop-png") ?? PAGES[0];
		setLocale("ru");
		expect(pageTitle(page)).toBe(ru.pages?.[page.slug]?.title);
		setLocale("en");
		expect(pageTitle(page)).toBe(page.title);
	});

	it("5. errors with vars localize to both languages", () => {
		setLocale("ru");
		expect(t("errors.badHex", { value: "#zz" })).toBe(
			(ru.errors.badHex ?? "").replace("{value}", "#zz"),
		);
		expect(t("errors.pageUnknown", { slug: "x" })).toBe(
			(ru.errors.pageUnknown ?? "").replace("{slug}", "x"),
		);
		setLocale("en");
		expect(t("errors.badHex", { value: "#zz" })).toBe(
			(en.errors.badHex ?? "").replace("{value}", "#zz"),
		);
		expect(t("errors.pageUnknown", { slug: "x" })).toContain("No page");
	});

	it("6. U+0451 (yo) does not break query normalization", () => {
		const YO = "\u0451";
		const YE = "\u0435";
		// dictionary word containing U+0451, from the ru grayscale title
		const word = (ru.pages?.["grayscale-png"]?.title ?? "").split(" ")[0];
		expect(word).toContain(YO);
		expect(normalizeForSearch(word)).toBe(
			normalizeForSearch(word.replaceAll(YO, YE)),
		);
		expect(normalizeForSearch(word.toUpperCase())).toBe(
			normalizeForSearch(word.toUpperCase().replaceAll(YO, YE)),
		);
	});

	it("7. locale tags for number formatting are correct", () => {
		expect(LOCALE_TAGS.ru).toBe("ru-RU");
		expect(LOCALE_TAGS.en).toBe("en-US");
	});
});
