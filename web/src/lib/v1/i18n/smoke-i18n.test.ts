import { afterEach, describe, expect, it, vi } from "vitest";
import { TOOLS } from "../registry";
import { LOCALE_TAGS } from "./dict";
import { setLocale } from "./locale.svelte";
import { normalizeForSearch, scoreDoc } from "./matching";
import { t } from "./t";
import { toolSearchDoc } from "./tool-strings";

afterEach(() => {
	setLocale("ru");
	vi.unstubAllGlobals();
});

describe("Смоук §6 i18n", () => {
	it("1. html lang следует за локалью", () => {
		const doc = { documentElement: { lang: "" } };
		vi.stubGlobal("document", doc);
		setLocale("en");
		expect(doc.documentElement.lang).toBe("en");
		setLocale("ru");
		expect(doc.documentElement.lang).toBe("ru");
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
			["download.busy", "Готовим файл", "Preparing file"],
		];
		for (const [key, ruPart, enPart] of samples) {
			setLocale("ru");
			expect(t(key), key + " @ru").toContain(ruPart);
			setLocale("en");
			expect(t(key), key + " @en").toContain(enPart);
		}
	});

	it("5. Ошибки с vars локализуются на оба языка", () => {
		setLocale("ru");
		expect(t("errors.badHex", { value: "#zz" })).toBe(
			'Некорректный HEX-цвет: "#zz"',
		);
		expect(t("errors.toolNotFound", { id: "x" })).toContain("не найден");
		setLocale("en");
		expect(t("errors.badHex", { value: "#zz" })).toBe(
			'Invalid HEX color: "#zz"',
		);
	});

	it("6. Поиск кросс-языковой в обе стороны", () => {
		const ids = (q: string) =>
			TOOLS.filter((tool) => {
				const s = scoreDoc(toolSearchDoc(tool), normalizeForSearch(q));
				return s !== null && s > 0;
			}).map((tool) => tool.id);

		setLocale("ru");
		let hits = ids("rotate");
		expect(hits).toContain("rotate-png");
		hits = ids("повер");
		expect(hits).toContain("rotate-png");

		setLocale("en");
		hits = ids("пово");
		expect(hits).toContain("rotate-free-png");
		hits = ids("rotate");
		expect(hits).toContain("rotate-png");
	});

	it("6b. Ё не мешает совпадению", () => {
		const blackWhite = TOOLS.find((tool) => tool.id === "black-and-white-png")!;
		setLocale("ru");
		const hit = scoreDoc(
			toolSearchDoc(blackWhite),
			normalizeForSearch("ЧЁРНО"),
		);
		expect(hit).not.toBeNull();
		const withoutYo = scoreDoc(
			toolSearchDoc(blackWhite),
			normalizeForSearch("черно"),
		);
		expect(withoutYo).not.toBeNull();
	});

	it("7. Теги локалей для форматирования чисел корректны", () => {
		expect(LOCALE_TAGS.ru).toBe("ru-RU");
		expect(LOCALE_TAGS.en).toBe("en-US");
	});
});
