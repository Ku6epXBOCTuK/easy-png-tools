import { describe, expect, it } from "vitest";
import { colorSpectrum, drawGrid, randomColorBlocks } from "./gen-tools";

describe("colorSpectrum", () => {
	it("horizontal: left edge red (hue 0)", () => {
		const img = colorSpectrum(100, 10, "horizontal", 100, 50);
		expect(img.data[0]).toBeGreaterThan(200);
		expect(img.data[1]).toBeLessThan(60);
	});

	it("vertical: green max near hue 120 deg", () => {
		const img = colorSpectrum(10, 100, "vertical", 100, 50);
		const rowHue120 = Math.round((120 / 360) * 99);
		const g = img.data[(rowHue120 * 10 + 5) * 4 + 1];
		expect(g).toBeGreaterThan(200);
	});
});

describe("randomColorBlocks", () => {
	it("deterministic by seed, blocks are solid", () => {
		const a = randomColorBlocks(64, 64, 16, 7);
		const b = randomColorBlocks(64, 64, 16, 7);
		expect([...a.data]).toEqual([...b.data]);
		const c = randomColorBlocks(64, 64, 16, 8);
		expect([...a.data]).not.toEqual([...c.data]);
		expect(a.data[3]).toBe(255);
	});
});

describe("drawGrid", () => {
	it("grid lines opaque, background transparent", () => {
		const out = drawGrid(100, 100, 4, 4, 2, "#000000", 0);
		expect(out.data[0]).toBe(0);
		expect(out.data[3]).toBe(255); // (0,0) on a line
		const mid = (53 * 100 + 53) * 4;
		expect(out.data[mid + 3]).toBe(0); // transparent between lines
	});

	it("white opaque background at bgOpacity=100", () => {
		const out = drawGrid(20, 20, 2, 2, 1, "#000000", 100);
		const mid = (5 * 20 + 5) * 4;
		expect(out.data[mid]).toBe(255);
	});

	it("semi-transparent background at bgOpacity=50", () => {
		const out = drawGrid(20, 20, 2, 2, 1, "#000000", 50);
		const mid = (5 * 20 + 5) * 4;
		expect(out.data[mid + 3]).toBe(128);
	});
});
