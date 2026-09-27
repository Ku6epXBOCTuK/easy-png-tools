import { afterEach, describe, expect, it, vi } from "vitest";
import { getLocale, setLocale } from "./locale.svelte";
import { LOCALE_TAGS } from "./dict";
import { normalizeForSearch } from "./matching";
import { t } from "./t";
import { getPageBySlug, PAGES } from "../registry";
import { pageTitle } from "./schema-tool-strings";

afterEach(() => {
	setLocale("ru");
	vi.unstubAllGlobals();
});

describe("Смоук §6 i18n (новый UI)", () => {
	it("1. html lang следует за локалью", () => {
		const doc = { documentElement: { lang: "" } };
		vi.stubGlobal("document", doc);
		setLocale("en");
		expect(doc.documentElement.lang).toBe("en");
		setLocale("ru");
		expect(doc.documentElement.lang).toBe("ru");
	});

	it("2. getLocale отражает последний выбор", () => {
		setLocale("en");
		expect(getLocale()).toBe("en");
		setLocale("ru");
		expect(getLocale()).toBe("ru");
	});

	it("3. Ключевые секции переведены без смеси языков", () => {
		const samples: Array<[string, string, string]> = [
			["header.workspace", "Рабочая область", "Workspace"],
			["catalog.heading", "Каталог инструментов", "Tool catalog"],
			[
				"home.heroTitle",
				"Что делаем с изображением?",
				"What do you want to do",
			],
			["chain.inputLegend", "Вход", "Input"],
			["resultCard.nextTool", "Следующий инструмент", "Next tool"],
			["paramsCard.toolSettings", "Настройки инструмента", "Tool settings"],
			["download.busy", "Готовим файл", "Preparing file"],
			["dropZone.pickDefault", "Перетащите изображение", "Drop an image"],
		];
		for (const [key, ruPart, enPart] of samples) {
			setLocale("ru");
			expect(t(key), key + " @ru").toContain(ruPart);
			setLocale("en");
			expect(t(key), key + " @en").toContain(enPart);
		}
	});

	it("4. Заголовок инструмента переключается локалями (schema-tool-strings)", () => {
		const page = getPageBySlug("crop-png") ?? PAGES[0];
		setLocale("ru");
		expect(pageTitle(page)).toContain("Обрезать");
		setLocale("en");
		expect(pageTitle(page)).toBe(page.title);
	});

	it("5. Ошибки с vars локализуются на оба языка", () => {
		setLocale("ru");
		expect(t("errors.badHex", { value: "#zz" })).toBe(
			'Некорректный HEX-цвет: "#zz"',
		);
		expect(t("errors.pageUnknown", { slug: "x" })).toContain("каталоге");
		setLocale("en");
		expect(t("errors.badHex", { value: "#zz" })).toBe(
			'Invalid HEX color: "#zz"',
		);
		expect(t("errors.pageUnknown", { slug: "x" })).toContain("No page");
	});

	it("6. Ё не мешает нормализации поискового запроса", () => {
		expect(normalizeForSearch("ЧЁРНО") === normalizeForSearch("ЧЕРНО")).toBe(
			true,
		);
		expect(normalizeForSearch("ёлка") === normalizeForSearch("елка")).toBe(
			true,
		);
	});

	it("7. Теги локалей для форматирования чисел корректны", () => {
		expect(LOCALE_TAGS.ru).toBe("ru-RU");
		expect(LOCALE_TAGS.en).toBe("en-US");
	});
});
