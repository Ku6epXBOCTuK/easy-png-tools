import { describe, expect, it } from "vitest";
import { gradientImage, noiseImage, solidImage } from "./generate";

describe("solidImage", () => {
	it("fills whole canvas with given color", () => {
		const out = solidImage(2, 2, [10, 20, 30, 255]);
		expect(out.width).toBe(2);
		expect([...out.data]).toEqual(new Array(4).fill([10, 20, 30, 255]).flat());
	});

	it.each([
		[0, 10],
		[10, 0],
		[2.5, 10],
		[-1, 5],
	])("throws on sizes %i x %i", (w, h) => {
		expect(() => solidImage(w, h, [0, 0, 0, 255])).toThrow();
	});
});

describe("noiseImage", () => {
	it("deterministic: same seed - same bytes", () => {
		expect([...noiseImage(4, 4, 42).data]).toEqual([
			...noiseImage(4, 4, 42).data,
		]);
	});

	it("different seeds give different data", () => {
		const a = [...noiseImage(8, 8, 1).data];
		const b = [...noiseImage(8, 8, 2).data];
		expect(a).not.toEqual(b);
	});

	it("alpha always opaque", () => {
		const data = noiseImage(3, 3, 7).data;
		for (let i = 3; i < data.length; i += 4) {
			expect(data[i]).toBe(255);
		}
	});
});

describe("gradientImage", () => {
	it("horizontal gradient goes from color A to color B", () => {
		const out = gradientImage(
			3,
			1,
			[0, 0, 0, 255],
			[255, 255, 255, 255],
			"horizontal",
		);
		const px = (x: number) => [...out.data.slice(x * 4, x * 4 + 4)];
		expect(px(0)).toEqual([0, 0, 0, 255]);
		expect(px(1)).toEqual([128, 128, 128, 255]);
		expect(px(2)).toEqual([255, 255, 255, 255]);
	});

	it("vertical gradient changes by rows", () => {
		const out = gradientImage(
			1,
			2,
			[0, 0, 0, 255],
			[100, 100, 100, 255],
			"vertical",
		);
		expect(out.data[0]).toBe(0);
		expect(out.data[4]).toBe(100);
	});
});
