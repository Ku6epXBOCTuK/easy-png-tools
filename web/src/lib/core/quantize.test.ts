import { describe, expect, it } from "vitest";
import {
	ditherImage,
	mapToNearest,
	medianCutPalette,
	quantizeImage,
} from "./quantize";
import { makeImage } from "./test-helpers";

describe("medianCutPalette", () => {
	it("two clear clusters at k=2 yield the colors themselves", () => {
		const img = makeImage(4, 1, [
			[0, 0, 0, 255],
			[0, 0, 0, 255],
			[255, 255, 255, 255],
			[255, 255, 255, 255],
		]);
		const palette = medianCutPalette(img, 2);
		expect(palette).toHaveLength(2);
		const hexes = palette.map((c) => `${c.r},${c.g},${c.b}`).sort();
		expect(hexes).toEqual(["0,0,0", "255,255,255"]);
	});

	it("empty image yields black placeholder", () => {
		const empty = makeImage(2, 2, new Array(4).fill([0, 0, 0, 0]));
		expect(medianCutPalette(empty, 4)).toHaveLength(1);
	});
});

describe("quantizeImage / ditherImage", () => {
	it("quantization fits pixels into palette, keeps transparency", () => {
		const img = makeImage(3, 1, [
			[10, 10, 10, 255],
			[250, 250, 250, 255],
			[0, 0, 0, 0],
		]);
		const { image, palette } = quantizeImage(img, 2);
		expect(palette.length).toBeLessThanOrEqual(2);
		expect(image.data[2 * 4 + 3]).toBe(0); // transparent kept
		for (let x = 0; x < 2; x++) {
			const i = x * 4;
			const matched = palette.some((hex) => {
				const c = parseInt(hex.slice(1, 3), 16);
				return Math.abs(image.data[i] - c) <= 1;
			});
			expect(matched).toBe(true);
		}
	});

	it("floyd-steinberg splits 50% gray into black and white", () => {
		const gray = makeImage(16, 16, new Array(256).fill([128, 128, 128, 255]));
		const out = ditherImage(gray, 2, "floyd-steinberg", ["#000000", "#ffffff"]);
		let hasDark = false;
		let hasLight = false;
		for (let i = 0; i < out.data.length; i += 4) {
			if (out.data[i] < 60) hasDark = true;
			if (out.data[i] > 195) hasLight = true;
		}
		expect(hasDark).toBe(true);
		expect(hasLight).toBe(true);
	});

	it("bayer is deterministic", () => {
		const gray = makeImage(8, 8, new Array(64).fill([128, 128, 128, 255]));
		const a = ditherImage(gray, 2, "bayer");
		const b = ditherImage(gray, 2, "bayer");
		expect([...a.data]).toEqual([...b.data]);
	});

	it("fully transparent image does not crash", () => {
		const empty = makeImage(2, 2, new Array(4).fill([0, 0, 0, 0]));
		const out = ditherImage(empty, 4, "bayer");
		expect(out.data[3]).toBe(0);
	});
});

describe("mapToNearest", () => {
	it("maps to nearest from list", () => {
		const img = makeImage(2, 1, [
			[10, 10, 10, 255],
			[240, 240, 240, 255],
		]);
		const out = mapToNearest(img, ["#000000", "#ffffff"]);
		expect(out.data[0]).toBe(0);
		expect(out.data[4]).toBe(255);
	});
});
