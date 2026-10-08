import { describe, expect, it } from "vitest";
import {
	changeCanvasSize,
	contentBounds,
	cropToRatio,
	forceOrientation,
	padToRatio,
	symmetricCopy,
	trimToContent,
} from "./geometry";
import { makeImage } from "./test-helpers";

const bordered = () => {
	// 4x4: transparent pixel frame around red 2x2 center
	const img = makeImage(4, 4, new Array(16).fill([0, 0, 0, 0]));
	for (let y = 1; y <= 2; y++) {
		for (let x = 1; x <= 2; x++) {
			const di = (y * 4 + x) * 4;
			img.data[di] = 255;
			img.data[di + 3] = 255;
		}
	}
	return img;
};

describe("contentBounds / trimToContent", () => {
	it("bounds by alpha threshold", () => {
		expect(contentBounds(bordered(), 0)).toEqual({ x: 1, y: 1, w: 2, h: 2 });
	});

	it("trim cuts margins and keeps content", () => {
		const out = trimToContent(bordered(), 0);
		expect(out.width).toBe(2);
		expect(out.height).toBe(2);
		expect(out.data[0]).toBe(255);
		expect(out.data[3]).toBe(255);
	});

	it("fully transparent image -> 1x1", () => {
		const empty = makeImage(3, 3, new Array(9).fill([0, 0, 0, 0]));
		const out = trimToContent(empty, 0);
		expect(out.width).toBe(1);
		expect(out.height).toBe(1);
	});
});

describe("changeCanvasSize", () => {
	const img = makeImage(2, 2, [
		[1, 1, 1, 255],
		[2, 2, 2, 255],
		[3, 3, 3, 255],
		[4, 4, 4, 255],
	]);

	it("grow with center anchor - transparent margins all around", () => {
		const out = changeCanvasSize(img, 4, 4, "center");
		expect(out.width).toBe(4);
		expect(out.data[3]).toBe(0);
		expect(out.data[(1 * 4 + 1) * 4 + 3]).toBe(255);
	});

	it("grow with top-left anchor - content pinned to corner", () => {
		const out = changeCanvasSize(img, 4, 4, "top-left");
		expect(out.data[3]).toBe(255);
		expect(out.data[(3 * 4 + 3) * 4 + 3]).toBe(0);
	});

	it("shrink crops from bottom-right anchor", () => {
		const out = changeCanvasSize(img, 1, 1, "bottom-right");
		expect(out.data[0]).toBe(4);
	});
});

describe("aspect ratio", () => {
	const wide = makeImage(400, 200, new Array(80000).fill([9, 9, 9, 255]));

	it("cropToRatio 1:1 from 2:1 -> square by height", () => {
		const out = cropToRatio(wide, 1);
		expect(out.width).toBe(200);
		expect(out.height).toBe(200);
	});

	it("padToRatio 1:1 from 2:1 -> square with transparent margins", () => {
		const out = padToRatio(wide, 1);
		expect(out.width).toBe(400);
		expect(out.height).toBe(400);
		expect(out.data[3]).toBe(0);
		expect(out.data[(200 * 400 + 100) * 4 + 3]).toBe(255);
	});
});

describe("forceOrientation / symmetricCopy", () => {
	it("wide becomes tall via rotation", () => {
		const wide = makeImage(300, 100, new Array(30000).fill([5, 5, 5, 255]));
		const out = forceOrientation(wide, "portrait");
		expect(out.width).toBe(100);
		expect(out.height).toBe(300);
	});

	it("square is not rotated", () => {
		const sq = makeImage(50, 50, new Array(2500).fill([5, 5, 5, 255]));
		const out = forceOrientation(sq, "portrait");
		expect(out.width).toBe(50);
		expect(out.height).toBe(50);
	});

	it("symmetric copy doubles width and mirrors right half", () => {
		const img = makeImage(2, 1, [
			[10, 0, 0, 255],
			[20, 0, 0, 255],
		]);
		const out = symmetricCopy(img, "vertical", "left");
		expect(out.width).toBe(4);
		expect(out.data[0]).toBe(10);
		expect(out.data[8]).toBe(20); // pixel 2 = mirror of start
		expect(out.data[12]).toBe(10); // pixel 3 = mirror of end
	});

	it("vertical axis doubles height", () => {
		const img = makeImage(1, 2, [
			[10, 0, 0, 255],
			[30, 0, 0, 255],
		]);
		const out = symmetricCopy(img, "horizontal", "top");
		expect(out.height).toBe(4);
		expect(out.data[(2 * 1 + 0) * 4]).toBe(30); // row 2 = mirror of row 1
		expect(out.data[(3 * 1 + 0) * 4]).toBe(10); // row 3 = mirror of row 0
	});
});
