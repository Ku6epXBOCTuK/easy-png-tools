import { describe, expect, it } from "vitest";
import { anchorOrigin, tileGrid, wrapText } from "./textdraw";

const measure = (s: string) => s.length * 10;

describe("anchorOrigin", () => {
	it("corners and padding measured from edges", () => {
		expect(anchorOrigin("top-left", 100, 50, 400, 300, 30)).toEqual({
			x: 30,
			y: 30,
		});
		expect(anchorOrigin("top-right", 100, 50, 400, 300, 30)).toEqual({
			x: 270,
			y: 30,
		});
		expect(anchorOrigin("bottom-left", 100, 50, 400, 300, 30)).toEqual({
			x: 30,
			y: 220,
		});
		expect(anchorOrigin("bottom-right", 100, 50, 400, 300, 30)).toEqual({
			x: 270,
			y: 220,
		});
	});

	it("centering - exactly half the remainder", () => {
		expect(anchorOrigin("center", 100, 50, 401, 301, 0)).toEqual({
			x: 150.5,
			y: 125.5,
		});
		expect(anchorOrigin("middle-left", 100, 50, 400, 300, 12)).toEqual({
			x: 12,
			y: 125,
		});
		expect(anchorOrigin("top-center", 100, 50, 400, 300, 8)).toEqual({
			x: 150,
			y: 8,
		});
	});
});

describe("wrapText", () => {
	it("greedily fills lines within width", () => {
		// measure: 10px per char -> line <= 120px = 12 chars
		expect(wrapText("four two six banana pear", 120, measure)).toEqual([
			"four two six",
			"banana pear",
		]);
	});

	it("word longer than width goes on its own line", () => {
		expect(
			wrapText("giraffes superlongwordhere cat crocodile", 90, measure),
		).toEqual(["giraffes", "superlongwordhere", "cat", "crocodile"]);
	});

	it("empty and whitespace text give empty array", () => {
		expect(wrapText("", 100, measure)).toEqual([]);
		expect(wrapText("   \n\t ", 100, measure)).toEqual([]);
	});
});

describe("tileGrid", () => {
	it("stable grid with spacing and centering", () => {
		const pts = tileGrid(200, 200, 0, 60, 60, 80, 24);
		expect(pts.length).toBeGreaterThan(0);
		const xs = new Set(pts.map((p) => p.x));
		const ys = new Set(pts.map((p) => p.y));
		expect(xs.size).toBeGreaterThan(1);
		expect(ys.size).toBeGreaterThan(1);
	});

	it("cap protects against huge tile count", () => {
		const pts = tileGrid(4000, 4000, 45, 8, 8, 100, 40);
		expect(pts.length).toBeLessThanOrEqual(2500);
		expect(pts.length).toBeGreaterThan(0);
	});

	it("normal input does not trigger cap", () => {
		const pts = tileGrid(800, 600, 30, 140, 90, 160, 40);
		expect(pts.length).toBeLessThanOrEqual(2500);
		expect(pts.length).toBeGreaterThan(4);
	});
});
