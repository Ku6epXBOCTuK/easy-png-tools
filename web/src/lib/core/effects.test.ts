import { describe, expect, it } from "vitest";
import { vignette } from "./effects";
import { makeImage } from "./test-helpers";

describe("vignette", () => {
	it("сила 0 — идентичное преобразование", () => {
		const img = makeImage(3, 3, new Array(9).fill([200, 100, 50, 255]));
		expect([...vignette(img, 0).data]).toEqual([...img.data]);
	});

	it("углы темнее центра", () => {
		const img = makeImage(7, 7, new Array(49).fill([200, 200, 200, 255]));
		const out = vignette(img, 80);
		const centerR = out.data[(3 * 7 + 3) * 4];
		const cornerR = out.data[0];
		expect(cornerR).toBeLessThan(centerR);
		expect(centerR).toBeGreaterThan(150);
	});
});
