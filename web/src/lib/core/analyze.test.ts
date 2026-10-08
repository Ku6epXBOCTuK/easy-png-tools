import { describe, expect, it } from "vitest";
import {
	hasTransparency,
	imageInfo,
	isGrayscale,
	orientationOf,
} from "./analyze";
import { makeImage } from "./test-helpers";

describe("imageInfo", () => {
	it("finds semi-transparent pixels and counts unique RGBA colors", () => {
		const info = imageInfo(
			makeImage(2, 2, [
				[0, 0, 0, 255],
				[0, 0, 0, 255],
				[255, 0, 0, 128],
				[255, 0, 0, 128],
			]),
		);
		expect(info).toEqual({
			width: 2,
			height: 2,
			hasAlpha: true,
			colorCount: 2,
		});
	});

	it("fully opaque image - hasAlpha false", () => {
		const info = imageInfo(
			makeImage(2, 1, [
				[10, 20, 30, 255],
				[40, 50, 60, 255],
			]),
		);
		expect(info.hasAlpha).toBe(false);
		expect(info.colorCount).toBe(2);
	});

	it("different alpha means different colors", () => {
		const info = imageInfo(
			makeImage(2, 1, [
				[255, 0, 0, 255],
				[255, 0, 0, 128],
			]),
		);
		expect(info.hasAlpha).toBe(true);
		expect(info.colorCount).toBe(2);
	});

	it("returns correct sizes for non-square image", () => {
		const info = imageInfo(makeImage(5, 3, new Array(15).fill([1, 2, 3, 4])));
		expect(info.width).toBe(5);
		expect(info.height).toBe(3);
	});
});

describe("isGrayscale", () => {
	it("gray pixels are monochrome", () => {
		expect(isGrayscale(makeImage(1, 1, [[10, 10, 10, 255]]))).toBe(true);
	});
	it("colored pixel breaks monochrome", () => {
		expect(isGrayscale(makeImage(1, 1, [[10, 11, 10, 255]]))).toBe(false);
	});
});

describe("hasTransparency", () => {
	it("alpha below 255 means transparency", () => {
		expect(hasTransparency(makeImage(1, 1, [[0, 0, 0, 254]]))).toBe(true);
	});
	it("all pixels opaque", () => {
		expect(hasTransparency(makeImage(1, 1, [[0, 0, 0, 255]]))).toBe(false);
	});
});

describe("special decoded pixel data", () => {
	it("palette keeps color count after browser decode", () => {
		const image = makeImage(2, 2, [
			[255, 0, 0, 255],
			[0, 255, 0, 255],
			[0, 0, 255, 255],
			[255, 255, 255, 255],
		]);

		expect(imageInfo(image)).toMatchObject({
			width: 2,
			height: 2,
			hasAlpha: false,
			colorCount: 4,
		});
	});

	it("16-bit stays colored and opaque after downscale", () => {
		const image = makeImage(
			4,
			4,
			Array.from({ length: 16 }, (_, index) => {
				const value = index * 8;
				return [value, value, 128, 255];
			}),
		);

		expect(imageInfo(image).colorCount).toBe(16);
		expect(hasTransparency(image)).toBe(false);
		expect(isGrayscale(image)).toBe(false);
		expect(orientationOf(image)).toBe("square");
	});
});

describe("orientationOf", () => {
	it("detects orientation", () => {
		expect(
			orientationOf(makeImage(2, 3, new Array(6).fill([1, 1, 1, 1]))),
		).toBe("portrait");
		expect(
			orientationOf(makeImage(3, 2, new Array(6).fill([1, 1, 1, 1]))),
		).toBe("landscape");
		expect(
			orientationOf(makeImage(2, 2, new Array(4).fill([1, 1, 1, 1]))),
		).toBe("square");
	});
});
