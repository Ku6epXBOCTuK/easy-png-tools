import { describe, expect, it } from "vitest";
import {
	autoContrast,
	brightnessContrast,
	changeHue,
	extractChannel,
	gammaCorrection,
	grayscale,
	invert,
	posterize,
	rgbToHex,
	sepia,
	setOpacity,
	swapChannels,
	temperature,
	tint,
	thresholdBlackWhite,
	twoColors,
} from "./color";
import { makeImage } from "./test-helpers";

describe("rgbToHex", () => {
	it("formats base colors", () => {
		expect(rgbToHex(255, 0, 0)).toBe("#ff0000");
		expect(rgbToHex(1, 2, 3)).toBe("#010203");
	});

	it("rounds fractional values and clamps range", () => {
		expect(rgbToHex(127.6, -5, 300)).toBe("#8000ff");
	});
});

describe("setOpacity", () => {
	it("multiplies alpha by percent, keeps RGB", () => {
		const out = setOpacity(makeImage(1, 1, [[10, 20, 30, 128]]), 50);
		expect([...out.data]).toEqual([10, 20, 30, 64]);
	});

	it("100% keeps alpha, 0% makes fully transparent", () => {
		expect(setOpacity(makeImage(1, 1, [[1, 2, 3, 200]]), 100).data[3]).toBe(
			200,
		);
		expect(setOpacity(makeImage(1, 1, [[1, 2, 3, 200]]), 0).data[3]).toBe(0);
	});
});

describe("sepia", () => {
	it("applies classic matrix with clamping", () => {
		const out = sepia(
			makeImage(2, 1, [
				[255, 0, 0, 255],
				[255, 255, 255, 255],
			]),
		);
		const px = (n: number) => [...out.data.slice(n * 4, n * 4 + 4)];
		expect(px(0)).toEqual([100, 89, 69, 255]);
		expect(px(1)[0]).toBe(255);
		expect(out.data[7]).toBe(255);
	});
});

describe("changeHue", () => {
	it("pure red at +120 deg becomes pure green", () => {
		const out = changeHue(makeImage(1, 1, [[255, 0, 0, 255]]), 120);
		expect([...out.data]).toEqual([0, 255, 0, 255]);
	});

	it("360 deg shift returns original colors", () => {
		const img = makeImage(1, 1, [[90, 140, 210, 255]]);
		expect([...changeHue(img, 360).data]).toEqual([...img.data]);
	});
});

describe("extractChannel", () => {
	it("renders selected channel in grayscale", () => {
		const out = extractChannel(makeImage(1, 1, [[10, 20, 30, 40]]), "green");
		expect([...out.data]).toEqual([20, 20, 20, 40]);
	});
});

describe("swapChannels", () => {
	it("swaps channels in pairs", () => {
		expect([
			...swapChannels(makeImage(1, 1, [[10, 20, 30, 40]]), "r-b").data,
		]).toEqual([30, 20, 10, 40]);
		expect([
			...swapChannels(makeImage(1, 1, [[10, 20, 30, 40]]), "g-b").data,
		]).toEqual([10, 30, 20, 40]);
	});
});

describe("thresholdBlackWhite", () => {
	it("gray 128 vs 50% threshold - white", () => {
		expect(
			thresholdBlackWhite(makeImage(1, 1, [[128, 128, 128, 255]]), 50).data[0],
		).toBe(255);
		expect(
			thresholdBlackWhite(makeImage(1, 1, [[128, 128, 128, 255]]), 60).data[0],
		).toBe(0);
	});
});

describe("posterize", () => {
	it("two levels quantize to black and white", () => {
		const out = posterize(
			makeImage(2, 1, [
				[100, 100, 100, 255],
				[200, 200, 200, 255],
			]),
			2,
		);
		expect(out.data[0]).toBe(0);
		expect(out.data[4]).toBe(255);
	});
});

describe("twoColors", () => {
	it("bright pixels get light color, dark get dark", () => {
		const out = twoColors(
			makeImage(2, 1, [
				[250, 250, 250, 255],
				[10, 10, 10, 128],
			]),
			"#ff0000",
			"#00ff00",
			50,
		);
		expect([...out.data.slice(0, 4)]).toEqual([255, 0, 0, 255]);
		expect([...out.data.slice(4, 8)]).toEqual([0, 255, 0, 128]);
	});
});

describe("grayscale", () => {
	it("computes luma with BT.601 weights and rounding", () => {
		const out = grayscale(
			makeImage(3, 1, [
				[255, 0, 0, 255],
				[0, 255, 0, 255],
				[0, 0, 255, 255],
			]),
		);
		const rgb = [...out.data].reduce<number[]>((acc, v, i) => {
			if (i % 4 === 0) acc.push(v);
			return acc;
		}, []);
		expect(rgb).toEqual([76, 150, 29]);
	});

	it("keeps alpha and does not mutate input", () => {
		const img = makeImage(1, 1, [[10, 20, 30, 200]]);
		const out = grayscale(img);
		expect([...out.data]).toEqual([18, 18, 18, 200]);
		expect([...img.data]).toEqual([10, 20, 30, 200]);
	});
});

describe("invert", () => {
	it("inverts RGB, keeps alpha", () => {
		const out = invert(makeImage(1, 1, [[10, 200, 30, 7]]));
		expect([...out.data]).toEqual([245, 55, 225, 7]);
	});
});

describe("brightnessContrast", () => {
	const pixel = (r: number) => makeImage(1, 1, [[r, r, r, 255]]);
	const red = (out: number[]) => [out[0], out[1], out[2]];

	it("b=0, c=0 - identity transform", () => {
		const out = brightnessContrast(pixel(77), 0, 0);
		expect(red([...out.data])).toEqual([77, 77, 77]);
	});

	it("brightness +100 saturates all to white", () => {
		const out = brightnessContrast(pixel(10), 100, 0);
		expect(red([...out.data])).toEqual([255, 255, 255]);
	});

	it("brightness -100 fills with black", () => {
		const out = brightnessContrast(pixel(240), -100, 0);
		expect(red([...out.data])).toEqual([0, 0, 0]);
	});

	it("contrast -100 collapses all to gray 128", () => {
		const out = brightnessContrast(pixel(30), 0, -100);
		expect(red([...out.data])).toEqual([128, 128, 128]);
	});

	it("out-of-range params are clamped", () => {
		const out = brightnessContrast(pixel(10), 150, 0);
		expect(red([...out.data])).toEqual([255, 255, 255]);
	});

	it("alpha unchanged", () => {
		const out = brightnessContrast(makeImage(1, 1, [[10, 20, 30, 64]]), 50, 50);
		expect(out.data[3]).toBe(64);
	});
});

describe("gammaCorrection", () => {
	it("gamma 1 - identity", () => {
		const img = makeImage(1, 1, [[64, 128, 192, 255]]);
		expect([...gammaCorrection(img, 1).data]).toEqual([64, 128, 192, 255]);
	});
	it("gamma 2 doubles brightness (64 -> 128)", () => {
		const out = gammaCorrection(makeImage(1, 1, [[64, 64, 64, 255]]), 2);
		expect(out.data[0]).toBe(128);
	});
});

describe("autoContrast", () => {
	it("stretches range [10..200] to [0..255]", () => {
		const out = autoContrast(
			makeImage(2, 1, [
				[10, 10, 10, 255],
				[200, 200, 200, 255],
			]),
		);
		expect(out.data[0]).toBe(0);
		expect(out.data[4]).toBe(255);
	});
});

describe("temperature", () => {
	it("positive - warmer (red up, blue down)", () => {
		const out = temperature(makeImage(1, 1, [[128, 128, 128, 255]]), 50);
		expect(out.data[0]).toBeGreaterThan(128);
		expect(out.data[2]).toBeLessThan(128);
	});
	it("zero temperature changes nothing", () => {
		const img = makeImage(1, 1, [[128, 128, 128, 255]]);
		expect([...temperature(img, 0).data]).toEqual([...img.data]);
	});
});

describe("tint", () => {
	it("strength 100 on white yields pure color", () => {
		const out = tint(makeImage(1, 1, [[255, 255, 255, 255]]), "#ff0000", 100);
		expect([...out.data]).toEqual([255, 0, 0, 255]);
	});
	it("strength 0 - identity", () => {
		const img = makeImage(1, 1, [[100, 150, 200, 255]]);
		expect([...tint(img, "#ff0000", 0).data]).toEqual([...img.data]);
	});
});
