import { describe, expect, it } from "vitest";
import { hexToRgb } from "./palette";
import { renderSpace, SPACES } from "./channels";
import { makeImage } from "./test-helpers";

describe("преобразования пространств", () => {
	it("hsl красного: h=0, s=1, l=0.5", () => {
		const [h, s, l] = SPACES.hsl.convert(hexToRgb("#ff0000"));
		expect(h).toBeCloseTo(0);
		expect(s).toBeCloseTo(1);
		expect(l).toBeCloseTo(0.5);
	});

	it("hsv белого: v=1, чёрного: v=0", () => {
		expect(SPACES.hsv.convert({ r: 255, g: 255, b: 255 })[2]).toBeCloseTo(1);
		expect(SPACES.hsv.convert({ r: 0, g: 0, b: 0 })[2]).toBe(0);
	});

	it("hsi серого: s=0", () => {
		const [, s] = SPACES.hsi.convert({ r: 128, g: 128, b: 128 });
		expect(s).toBeCloseTo(0);
	});

	it("cmyk: белый — 0,0,0,0; чёрный — 0,0,0,1", () => {
		const w = SPACES.cmyk.convert({ r: 255, g: 255, b: 255 });
		const b = SPACES.cmyk.convert({ r: 0, g: 0, b: 0 });
		expect(w.every((v) => Math.abs(v) < 1e-9)).toBe(true);
		expect(b[3]).toBeCloseTo(1);
	});

	it("ycbcr белого: y≈1, cb≈cr≈0.5", () => {
		const [y, cb, cr] = SPACES.ycbcr.convert({ r: 255, g: 255, b: 255 });
		expect(y).toBeCloseTo(1);
		expect(cb).toBeCloseTo(0.5, 2);
		expect(cr).toBeCloseTo(0.5, 2);
	});

	it("lab белого: l≈1, a≈b≈0.5 (центр)", () => {
		const [l, a, bb] = SPACES.lab.convert({ r: 255, g: 255, b: 255 });
		expect(l).toBeCloseTo(1, 2);
		expect(a).toBeCloseTo(0.5, 2);
		expect(bb).toBeCloseTo(0.5, 2);
	});
});

describe("renderSpace", () => {
	const red = makeImage(1, 1, [[255, 0, 0, 255]]);

	it("gray-режим: компонент y (жёлтый) чистого красного = белый", () => {
		const out = renderSpace(red, "cmyk", "y", "gray");
		expect([...out.data]).toEqual([255, 255, 255, 255]);
	});

	it("color-режим hsl красного: каналы = тон/насыщенность/светлота", () => {
		const out = renderSpace(red, "hsl", "s", "color");
		expect(out.data[0]).toBe(0);
		expect(out.data[1]).toBe(255);
		expect(out.data[2]).toBeGreaterThanOrEqual(127);
	});

	it("неизвестное пространство или компонент дают прозрачную заглушку", () => {
		const junk = makeImage(1, 1, [[10, 20, 30, 255]]);
		expect(
			renderSpace(junk, "cmyk" as never, "zz" as never, "gray").data[3],
		).toBe(0);
	});
});
