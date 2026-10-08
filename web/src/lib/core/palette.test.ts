import { describe, expect, it } from "vitest";
import {
	analogousSet,
	complementarySet,
	hexToRgb,
	hslToRgb,
	monochromaticSet,
	mixColors,
	normalizeHex,
	parseHexList,
	renderBlend,
	renderSwatches,
	renderWheel,
	rgbToHsl,
	rgbToHex,
	shadeSet,
	sortPalette,
	triadicSet,
	tetradicSet,
} from "./palette";

describe("rgb<->hsl conversion", () => {
	it("red -> hsl(0,100%,50%) and back", () => {
		const hsl = rgbToHsl(hexToRgb("#ff0000"));
		expect(hsl.h).toBeCloseTo(0, 0);
		expect(hsl.s).toBeCloseTo(1, 5);
		expect(hsl.l).toBeCloseTo(0.5, 5);
		expect(rgbToHex(hslToRgb({ h: 0, s: 1, l: 0.5 }))).toBe("#ff0000");
	});

	it("grays have no hue", () => {
		expect(rgbToHsl(hexToRgb("#808080")).s).toBe(0);
	});

	it("360 deg wraparound returns original color", () => {
		const base = "#3b82f6";
		expect(
			rgbToHex(hslToRgb({ ...rgbToHsl(hexToRgb(base)), h: 720 + 30 })),
		).toBe(rgbToHex(hslToRgb({ ...rgbToHsl(hexToRgb(base)), h: 30 })));
	});
});

describe("harmonies", () => {
	it("complementary - pair shifted 180 deg", () => {
		const [a, b] = complementarySet("#ff0000");
		expect(a).toBe("#ff0000");
		const ha = rgbToHsl(hexToRgb(a)).h;
		const hb = rgbToHsl(hexToRgb(b)).h;
		expect(Math.abs((hb - ha + 360) % 360)).toBeCloseTo(180, 0);
	});

	it("triadic - three colors 120 deg apart", () => {
		const set = triadicSet("#ff0000");
		expect(set).toHaveLength(3);
		const hues = set.map((h) => rgbToHsl(hexToRgb(h)).h);
		expect(hues[1] - hues[0]).toBeCloseTo(120, 0);
		expect(hues[2] - hues[0]).toBeCloseTo(240, 0);
	});

	it("tetradic - four colors 90 deg apart", () => {
		const set = tetradicSet("#00ff00");
		expect(set).toHaveLength(4);
	});

	it("analogous symmetric around base", () => {
		const set = analogousSet("#0000ff", 30, 5);
		expect(set).toHaveLength(5);
		expect(set[2]).toBe(normalizeHex("#0000ff"));
	});

	it("monochromatic keeps hue, varies lightness", () => {
		const set = monochromaticSet("#ff8800", 5, 60);
		expect(set).toHaveLength(5);
		const hues = new Set(set.map((h) => Math.round(rgbToHsl(hexToRgb(h)).h)));
		expect(hues.size).toBe(1);
		const lights = set.map((h) => rgbToHsl(hexToRgb(h)).l);
		expect(Math.min(...lights)).toBeLessThan(Math.max(...lights));
	});

	it("shades - dark edge darker than base", () => {
		const set = shadeSet("#88cc44", 4, 70);
		const lights = set.map((h) => rgbToHsl(hexToRgb(h)).l);
		expect(lights[lights.length - 1]).toBeLessThan(lights[0]);
	});
});

describe("parseHexList / mixColors / sortPalette", () => {
	it("parses list, drops junk and hash-less tokens", () => {
		expect(parseHexList("#ff0000, #00FF00 ; 00ff00 zz")).toEqual([
			"#ff0000",
			"#00ff00",
		]);
	});

	it("empty valid list throws badHex", () => {
		expect(() => parseHexList("no colors")).toThrow(/errors\.badHex/);
	});

	it("mixColors - component average", () => {
		expect(mixColors(["#000000", "#ffffff"])).toBe("#808080");
	});

	it("sortPalette by luma puts dark first", () => {
		const sorted = sortPalette(["#ffffff", "#000000", "#808080"], "luma");
		expect(sorted[0]).toBe("#000000");
		expect(sorted[2]).toBe("#ffffff");
	});
});

describe("renders", () => {
	it("renderSwatches strip: columns by color", () => {
		const img = renderSwatches(["#ff0000", "#00ff00"], 200, "strip");
		expect(img.width).toBe(200);
		expect(img.data[(Math.floor(img.height / 2) * 200 + 10) * 4 + 3]).toBe(255);
		expect(
			img.data[(Math.floor(img.height / 2) * 200 + 10) * 4],
		).toBeGreaterThan(200);
		const right = (Math.floor(img.height / 2) * 200 + 150) * 4;
		expect(img.data[right]).toBeLessThan(50);
		expect(img.data[right + 1]).toBeGreaterThan(200);
	});

	it("renderSwatches grid: square cells", () => {
		const img = renderSwatches(["#111111", "#222222", "#333333"], 120, "grid");
		expect(img.width).toBe(120);
		expect(img.height).toBeGreaterThan(0);
	});

	it("renderWheel: corners transparent, center opaque", () => {
		const size = 101;
		const img = renderWheel(size, 50);
		expect(img.data[3]).toBe(0);
		const c = (Math.floor(size / 2) * size + Math.floor(size / 2)) * 4;
		expect(img.data[c + 3]).toBe(255);
	});

	it("renderBlend: left edge = a, right = b", () => {
		const img = renderBlend("#000000", "#ffffff", 100);
		expect(img.data[0]).toBe(0);
		const last = 99 * 4;
		expect(img.data[last]).toBe(255);
	});
});
