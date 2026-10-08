import { describe, expect, it } from "vitest";
import {
	backgroundMaskPreview,
	backgroundRemovalMask,
	removeBackground,
} from "./background";
import { makeImage } from "./test-helpers";

const GREEN = [0, 255, 0, 255];
const RED = [255, 0, 0, 255];

describe("backgroundRemovalMask", () => {
	it("global mode removes all matching pixels", () => {
		const mask = backgroundRemovalMask(makeImage(2, 1, [GREEN, RED]), {
			color: "#00ff00",
			tolerancePercent: 0,
			outerOnly: false,
			smoothPasses: 0,
		});
		expect([...mask]).toEqual([1, 0]);
	});

	describe("outer regions mode", () => {
		const ringRedCenterGreen = [RED, RED, RED, RED, GREEN, RED, RED, RED, RED];

		it("edge flood cannot reach isolated matching island", () => {
			const mask = backgroundRemovalMask(makeImage(3, 3, ringRedCenterGreen), {
				color: "#00ff00",
				tolerancePercent: 0,
				outerOnly: true,
				smoothPasses: 0,
			});
			expect(mask[4]).toBe(0);
		});

		it("global mode removes isolated island too", () => {
			const mask = backgroundRemovalMask(makeImage(3, 3, ringRedCenterGreen), {
				color: "#00ff00",
				tolerancePercent: 0,
				outerOnly: false,
				smoothPasses: 0,
			});
			expect(mask[4]).toBe(1);
			expect(mask[0]).toBe(0);
		});
	});

	it("tolerance widens capture by color distance", () => {
		const img = makeImage(2, 1, [
			[10, 10, 10, 255],
			[128, 128, 128, 255],
		]);
		const tight = backgroundRemovalMask(img, {
			color: "#000000",
			tolerancePercent: 40,
			outerOnly: false,
			smoothPasses: 0,
		});
		const wide = backgroundRemovalMask(img, {
			color: "#000000",
			tolerancePercent: 60,
			outerOnly: false,
			smoothPasses: 0,
		});
		expect(tight[1]).toBe(0);
		expect(wide[1]).toBe(1);
	});
});

describe("smoothMask behavior via backgroundRemovalMask", () => {
	const ringRedCenterGreen = [RED, RED, RED, RED, GREEN, RED, RED, RED, RED];
	const opts = { color: "#00ff00", tolerancePercent: 0, outerOnly: false };

	const alphaAtCenter = (img: { data: Uint8ClampedArray }) => img.data[19];

	it("without smoothing center is removed", () => {
		const img = removeBackground(makeImage(3, 3, ringRedCenterGreen), {
			...opts,
			smoothPasses: 0,
		});
		expect(alphaAtCenter(img)).toBe(0);
	});

	it("two majority filter passes restore isolated pixel", () => {
		const img = removeBackground(makeImage(3, 3, ringRedCenterGreen), {
			...opts,
			smoothPasses: 2,
		});
		expect(alphaAtCenter(img)).toBe(255);
	});
});

describe("removeBackground", () => {
	it("zeroes alpha of removed, keeps RGB of rest", () => {
		const out = removeBackground(makeImage(2, 1, [GREEN, [5, 6, 7, 200]]), {
			color: "#00ff00",
			tolerancePercent: 0,
			outerOnly: false,
			smoothPasses: 0,
		});
		expect(out.data[3]).toBe(0);
		expect([...out.data.slice(4, 8)]).toEqual([5, 6, 7, 200]);
	});
});

describe("backgroundMaskPreview", () => {
	it("white where removed, black where kept, all opaque", () => {
		const preview = backgroundMaskPreview(
			makeImage(2, 1, [GREEN, [9, 9, 9, 60]]),
			{
				color: "#00ff00",
				tolerancePercent: 0,
				outerOnly: false,
				smoothPasses: 0,
			},
		);
		expect([...preview.data]).toEqual([255, 255, 255, 255, 0, 0, 0, 255]);
	});
});
