import { describe, expect, it } from "vitest";
import { TOOLS } from "../registry";
import { normalizeForSearch, scoreDoc, type SearchDoc } from "./matching";
import { setLocale } from "./locale.svelte";
import { toolSearchDoc } from "./tool-strings";

describe("normalizeForSearch", () => {
	it("нижний регистр", () => {
		expect(normalizeForSearch("Rotate PNG")).toBe("rotate png");
	});

	it("ё заменяется на е", () => {
		expect(normalizeForSearch("Ёлка и ёж")).toBe("елка и еж");
	});

	it("диакритика снимается через NFD", () => {
		expect(normalizeForSearch("café")).toBe("cafe");
		expect(normalizeForSearch("Über")).toBe("uber");
	});
});

describe("scoreDoc", () => {
	const doc: SearchDoc = {
		id: "rotate-free-png",
		titles: ["Повернуть на произвольный угол"],
		descriptions: [
			"Поворот на любой угол. Холст расширяется под новые габариты.",
		],
	};

	it("пустой запрос даёт нейтральный балл", () => {
		expect(scoreDoc(doc, "")).toBe(1);
	});

	it("префикс названия ценнее подстроки", () => {
		const prefix = scoreDoc(doc, normalizeForSearch("повер"));
		const infix = scoreDoc(doc, normalizeForSearch("верну"));
		expect(prefix!).toBe(100);
		expect(infix!).toBeGreaterThan(30);
	});

	it("подстрока названия ценнее совпадения в описании", () => {
		const title = scoreDoc(doc, normalizeForSearch("угол"));
		const desc = scoreDoc(doc, normalizeForSearch("габариты"));
		expect(title!).toBeGreaterThan(desc!);
	});

	it("нет совпадения — null", () => {
		expect(scoreDoc(doc, normalizeForSearch("квант"))).toBeNull();
	});

	it("запрос с опечаткой ё/е всё равно находит", () => {
		expect(scoreDoc(doc, normalizeForSearch("повёрнут"))).not.toBeNull();
	});
});

describe("кросс-языковой поиск на реальном реестре", () => {
	it("английский запрос находит инструмент при русской локали", () => {
		setLocale("ru");
		const hits = TOOLS.filter((tool) => {
			const s = scoreDoc(toolSearchDoc(tool), normalizeForSearch("rotate"));
			return s !== null && s > 0;
		}).map((tool) => tool.id);
		expect(hits).toContain("rotate-png");
		expect(hits).toContain("rotate-free-png");
	});

	it("русский запрос находит инструмент при английской локали", () => {
		setLocale("en");
		try {
			for (const q of ["повернуть", "пово"]) {
				const hits = TOOLS.filter((tool) => {
					const s = scoreDoc(toolSearchDoc(tool), normalizeForSearch(q));
					return s !== null && s > 0;
				}).map((tool) => tool.id);
				expect(hits, `запрос «${q}» при en-локали`).toContain("rotate-png");
				expect(hits, `запрос «${q}» при en-локали`).toContain(
					"rotate-free-png",
				);
			}
		} finally {
			setLocale("ru");
		}
	});

	it("поиск работает и по описанию, не только по названию", () => {
		setLocale("en");
		try {
			const hits = TOOLS.filter((tool) => {
				const s = scoreDoc(
					toolSearchDoc(tool),
					normalizeForSearch("полупрозрачные"),
				);
				return s !== null && s > 0;
			}).map((tool) => tool.id);
			expect(hits).toContain("png-is-transparent");
		} finally {
			setLocale("ru");
		}
	});
});
