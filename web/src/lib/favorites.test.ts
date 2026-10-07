import { describe, expect, it } from "vitest";
import {
	favFirst,
	favPages,
	initFavorites,
	isFav,
	toggleFav,
} from "./favorites.svelte";

describe("favorites", () => {
	it("toggle добавляет и убирает, isFav отражает состояние", () => {
		expect(isFav("flip-png")).toBe(false);
		toggleFav("flip-png");
		expect(isFav("flip-png")).toBe(true);
		toggleFav("flip-png");
		expect(isFav("flip-png")).toBe(false);
	});

	it("favPages фильтрует, favFirst поднимает избранное", () => {
		toggleFav("resize-png");
		const pages = [{ slug: "crop-png" }, { slug: "resize-png" }];
		expect(favPages(pages)).toEqual([{ slug: "resize-png" }]);
		expect(favFirst(pages).map((p) => p.slug)).toEqual([
			"resize-png",
			"crop-png",
		]);
		toggleFav("resize-png");
	});

	it("initFavorites без localStorage и с мусором не падает", () => {
		expect(() => initFavorites()).not.toThrow();
	});
});
