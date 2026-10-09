import { describe, expect, it } from "vitest";
import { vignette, vignetteMask } from "./effects";
import { makeImage } from "./test-helpers";

describe("vignette", () => {
	it("strength 0 - identity transform", () => {
		const img = makeImage(3, 3, new Array(9).fill([200, 100, 50, 255]));
		expect([...vignette(img, 0).data]).toEqual([...img.data]);
	});

	it("corners darker than center", () => {
		const img = makeImage(7, 7, new Array(49).fill([200, 200, 200, 255]));
		const out = vignette(img, 80);
		const centerR = out.data[(3 * 7 + 3) * 4];
		const cornerR = out.data[0];
		expect(cornerR).toBeLessThan(centerR);
		expect(centerR).toBeGreaterThan(150);
	});
});

describe("vignetteMask", () => {
	it("white at corners, black at center, opaque", () => {
		const out = vignetteMask(7, 7, 80);
		const center = out.data[(3 * 7 + 3) * 4];
		const corner = out.data[0];
		expect(corner).toBeGreaterThan(center);
		expect(corner).toBeGreaterThan(100);
		expect(out.data[3]).toBe(255);
	});

	it("zero strength -> all black", () => {
		const out = vignetteMask(3, 3, 0);
		expect(Math.max(...out.data.filter((_, i) => i % 4 !== 3))).toBe(0);
	});
});
