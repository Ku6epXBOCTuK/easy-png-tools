import { describe, expect, it } from "vitest";
import {
	diffMask,
	extractByColor,
	isGrayscaleish,
	luma01,
	rarityPredicate,
	renderPredicateMask,
} from "./masks";
import { makeImage } from "./test-helpers";

const px = makeImage(2, 1, [
	[255, 0, 0, 255],
	[10, 10, 10, 255],
]);

describe("isGrayscaleish / luma01", () => {
	it("gray recognized within tolerance, colored not", () => {
		expect(isGrayscaleish(10, 10, 10, 0)).toBe(true);
		expect(isGrayscaleish(12, 10, 11, 2)).toBe(true);
		expect(isGrayscaleish(255, 0, 0, 0)).toBe(false);
	});

	it("luma01: white 1, black 0", () => {
		expect(luma01(255, 255, 255)).toBeCloseTo(1);
		expect(luma01(0, 0, 0)).toBeCloseTo(0);
	});
});

describe("renderPredicateMask", () => {
	it("binary: matches white on black, alpha forced", () => {
		const out = renderPredicateMask(px, (r) => r > 200, { mode: "binary" });
		expect([...out.data.slice(0, 4)]).toEqual([255, 255, 255, 255]);
		expect([...out.data.slice(4, 8)]).toEqual([0, 0, 0, 255]);
	});

	it("highlight: tints only matches, rest unchanged", () => {
		const out = renderPredicateMask(px, (r) => r > 200, {
			mode: "highlight",
			color: "#0000ff",
			opacityPercent: 100,
		});
		expect([...out.data.slice(0, 4)]).toEqual([0, 0, 255, 255]);
		expect([...out.data.slice(4, 8)]).toEqual([10, 10, 10, 255]);
	});

	it("original alpha preserved in highlight mode", () => {
		const semi = makeImage(1, 1, [[200, 200, 200, 128]]);
		const out = renderPredicateMask(semi, () => true, {
			mode: "highlight",
			color: "#00ff00",
			opacityPercent: 50,
		});
		expect(out.data[3]).toBe(128);
		expect(out.data[0]).toBeGreaterThan(90);
	});
});

describe("rarityPredicate + extractByColor", () => {
	const img = makeImage(3, 1, [
		[255, 0, 0, 255],
		[255, 0, 0, 255],
		[0, 255, 0, 255],
	]);

	it("unique (single) color found, common not", () => {
		const pred = rarityPredicate(img, 1);
		expect(pred(0, 255, 0, 255)).toBe(true);
		expect(pred(255, 0, 0, 255)).toBe(false);
	});

	it("extractByColor keeps near and makes far transparent", () => {
		const out = extractByColor(px, "#0a0a0a", 5);
		expect(out.data[3]).toBe(0);
		expect(out.data[7]).toBe(255);
	});
});

describe("diffMask", () => {
	const before = makeImage(2, 1, [
		[255, 0, 0, 255],
		[0, 255, 0, 128],
	]);

	it("white where channels differ, black where equal, always opaque", () => {
		const after = makeImage(2, 1, [
			[255, 0, 0, 255],
			[0, 255, 0, 255],
		]);
		const out = diffMask(before, after);
		expect([...out.data.slice(0, 4)]).toEqual([0, 0, 0, 255]);
		expect([...out.data.slice(4, 8)]).toEqual([255, 255, 255, 255]);
	});

	it("size mismatch means everything changed", () => {
		const smaller = makeImage(1, 1, [[255, 0, 0, 255]]);
		const out = diffMask(before, smaller);
		expect([...out.data.slice(0, 4)]).toEqual([255, 255, 255, 255]);
	});
});
