import { describe, expect, it } from "vitest";
import { normalizeForSearch, scoreDoc, type SearchDoc } from "./matching";
import { ru } from "./ru";

const YO = "\u0451";
const YE = "\u0435";

describe("normalizeForSearch", () => {
	it("lowercases the query", () => {
		expect(normalizeForSearch("Rotate PNG")).toBe("rotate png");
	});

	it("folds yo to ye", () => {
		// dictionary word containing U+0451, from the grayscale page title
		const withYo = (ru.pages?.["grayscale-png"]?.title ?? "").split(" ")[0];
		expect(withYo).toContain(YO);
		const withYe = withYo.replaceAll(YO, YE);
		expect(normalizeForSearch(withYo)).toBe(normalizeForSearch(withYe));
	});

	it("strips diacritics via NFD", () => {
		expect(normalizeForSearch("caf\u00e9")).toBe("cafe");
		expect(normalizeForSearch("\u00dcber")).toBe("uber");
	});
});

describe("scoreDoc", () => {
	// fixture derived from the ru dictionary entry of rotate-free-png
	const page = ru.pages?.["rotate-free-png"];
	const doc: SearchDoc = {
		id: "rotate-free-png",
		titles: [page?.title ?? ""],
		descriptions: [page?.description ?? ""],
	};
	const normTitle = normalizeForSearch(doc.titles[0]);

	it("empty query gives a neutral score", () => {
		expect(scoreDoc(doc, "")).toBe(1);
	});

	it("title prefix scores higher than an infix", () => {
		const prefix = scoreDoc(doc, normTitle.slice(0, 5));
		const infix = scoreDoc(doc, normTitle.slice(2, 7));
		expect(prefix!).toBe(100);
		expect(infix!).toBeGreaterThan(30);
	});

	it("title substring scores higher than a description match", () => {
		// last title word vs a long description word absent from the title
		const titleWord = normTitle.split(" ").at(-1)!;
		const descWord = normalizeForSearch(doc.descriptions[0])
			.split(/[^\p{L}\p{N}]+/u)
			.filter((w) => w.length >= 5 && !normTitle.includes(w))
			.at(-1)!;
		const title = scoreDoc(doc, titleWord);
		const desc = scoreDoc(doc, descWord);
		expect(title!).toBeGreaterThan(desc!);
	});

	it("no match returns null", () => {
		expect(scoreDoc(doc, "zzz")).toBeNull();
	});

	it("a query with a yo/ye typo still matches", () => {
		// title prefix with ye replaced by yo, derived from the ru title
		const typo = normTitle.slice(0, 8).replace(YE, YO);
		expect(typo).toContain(YO);
		expect(scoreDoc(doc, normalizeForSearch(typo))).not.toBeNull();
	});
});
