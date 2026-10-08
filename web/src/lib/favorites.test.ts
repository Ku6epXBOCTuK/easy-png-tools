import { describe, expect, it } from "vitest";
import {
	favFirst,
	favPages,
	initFavorites,
	isFav,
	toggleFav,
} from "./favorites.svelte";

describe("favorites", () => {
	it("toggle adds and removes, isFav reflects state", () => {
		expect(isFav("flip-png")).toBe(false);
		toggleFav("flip-png");
		expect(isFav("flip-png")).toBe(true);
		toggleFav("flip-png");
		expect(isFav("flip-png")).toBe(false);
	});

	it("favPages filters, favFirst lifts favorites", () => {
		toggleFav("resize-png");
		const pages = [{ slug: "crop-png" }, { slug: "resize-png" }];
		expect(favPages(pages)).toEqual([{ slug: "resize-png" }]);
		expect(favFirst(pages).map((p) => p.slug)).toEqual([
			"resize-png",
			"crop-png",
		]);
		toggleFav("resize-png");
	});

	it("initFavorites without localStorage and with junk does not throw", () => {
		expect(() => initFavorites()).not.toThrow();
	});
});
