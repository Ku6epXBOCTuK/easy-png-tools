import { describe, expect, it } from "vitest";
import {
	centerByAlpha,
	crop,
	expandCanvas,
	flip,
	resize,
	rotate90,
	splitToParts,
	tile,
} from "./geometry";
import { expectImageEqual, makeImage } from "./test-helpers";
import type { PixelImage } from "./types";

const square = () =>
	makeImage(2, 2, [
		[1, 1, 1, 1],
		[2, 2, 2, 2],
		[3, 3, 3, 3],
		[4, 4, 4, 4],
	]);

describe("flip", () => {
	it("отражает по горизонтали (зеркало слева-направо)", () => {
		const out = flip(square(), "horizontal");
		expect(out.width).toBe(2);
		expect(out.height).toBe(2);
		expect([...out.data]).toEqual([
			2, 2, 2, 2, 1, 1, 1, 1, 4, 4, 4, 4, 3, 3, 3, 3,
		]);
	});

	it("отражает по вертикали (сверху-вниз)", () => {
		const out = flip(square(), "vertical");
		expect([...out.data]).toEqual([
			3, 3, 3, 3, 4, 4, 4, 4, 1, 1, 1, 1, 2, 2, 2, 2,
		]);
	});

	it("не мутирует вход", () => {
		const img = square();
		flip(img, "horizontal");
		expect([...img.data]).toEqual([
			1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4,
		]);
	});
});

describe("rotate90", () => {
	it("поворачивает неквадрат 2x3 на 90° по часовой", () => {
		const rect = makeImage(2, 3, [
			[1, 1, 1, 1],
			[2, 2, 2, 2],
			[3, 3, 3, 3],
			[4, 4, 4, 4],
			[5, 5, 5, 5],
			[6, 6, 6, 6],
		]);
		const out = rotate90(rect, 1);
		expect(out.width).toBe(3);
		expect(out.height).toBe(2);
		expect([...out.data]).toEqual([
			5, 5, 5, 5, 3, 3, 3, 3, 1, 1, 1, 1, 6, 6, 6, 6, 4, 4, 4, 4, 2, 2, 2, 2,
		]);
	});

	it("turns=0 возвращает копию без изменений", () => {
		const img = square();
		const out = rotate90(img, 0);
		expect(out).not.toBe(img);
		expect([...out.data]).toEqual([...img.data]);
	});

	it("нормализует turns: 5 ≡ 1, -3 ≡ 1, 4 ≡ 0", () => {
		const once = [...rotate90(square(), 1).data];
		expect([...rotate90(square(), 5).data]).toEqual(once);
		expect([...rotate90(square(), -3).data]).toEqual(once);
		expect([...rotate90(square(), 4).data]).toEqual([...square().data]);
	});

	it("turns=2 на квадрате равно двойному отражению", () => {
		const out = rotate90(square(), 2);
		expect([...out.data]).toEqual([
			4, 4, 4, 4, 3, 3, 3, 3, 2, 2, 2, 2, 1, 1, 1, 1,
		]);
	});
});

describe("crop", () => {
	const grid = () =>
		makeImage(3, 3, [
			[1, 1, 1, 1],
			[2, 2, 2, 2],
			[3, 3, 3, 3],
			[4, 4, 4, 4],
			[5, 5, 5, 5],
			[6, 6, 6, 6],
			[7, 7, 7, 7],
			[8, 8, 8, 8],
			[9, 9, 9, 9],
		]);

	it("вырезает центральную область 2x2 из 3x3", () => {
		const out = crop(grid(), 1, 1, 2, 2);
		expect(out.width).toBe(2);
		expect(out.height).toBe(2);
		expect([...out.data]).toEqual([
			5, 5, 5, 5, 6, 6, 6, 6, 8, 8, 8, 8, 9, 9, 9, 9,
		]);
	});

	it("усекает область, выходящую за границы", () => {
		const out = crop(grid(), -1, -1, 2, 2);
		expect(out.width).toBe(1);
		expect(out.height).toBe(1);
		expect([...out.data]).toEqual([1, 1, 1, 1]);
	});

	it("бросает ToolError для области вне изображения", () => {
		expect(() => crop(grid(), 5, 5, 2, 2)).toThrow(/errors\.cropBounds/);
	});
});

describe("expandCanvas", () => {
	const pixel = () => makeImage(1, 1, [[10, 20, 30, 255]]);

	it("прозрачное расширение кладёт пиксель со смещением", () => {
		const out = expandCanvas(pixel(), 1, 2, 3, 4);
		expect(out.width).toBe(5);
		expect(out.height).toBe(7);
		expect([...out.data.slice(0, 4)]).toEqual([0, 0, 0, 0]);
		expect([...out.data.slice((2 * 5 + 1) * 4, (2 * 5 + 1) * 4 + 4)]).toEqual([
			10, 20, 30, 255,
		]);
	});

	it("цветной фон заливает всё вокруг", () => {
		const out = expandCanvas(pixel(), 1, 0, 0, 0, "#ffffff");
		expect(out.data[0]).toBe(255);
		expect(out.data[3]).toBe(255);
		expect(out.data[(0 * 2 + 1) * 4 + 3]).toBe(255);
	});
});

describe("tile", () => {
	it("повторяет изображение по сетке", () => {
		const out = tile(makeImage(1, 1, [[9, 9, 9, 255]]), 3, 2);
		expect(out.width).toBe(3);
		expect(out.height).toBe(2);
		expect([...out.data].filter((_, i) => i % 4 === 0)).toEqual([
			9, 9, 9, 9, 9, 9,
		]);
	});
});

describe("centerByAlpha", () => {
	it("вырезает непрозрачный блок и центрирует на прежнем холсте", () => {
		const img = makeImage(3, 3, [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[5, 5, 5, 255],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		]);
		const out = centerByAlpha(img);
		expect(out.width).toBe(3);
		expect(out.height).toBe(3);
		const alphaAt = (x: number, y: number) => out.data[(y * 3 + x) * 4 + 3];
		expect(alphaAt(0, 0)).toBe(0);
		expect(alphaAt(1, 1)).toBe(255);
	});

	it("полностью прозрачное изображение возвращается без изменений", () => {
		const img = makeImage(2, 1, [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		]);
		expect([...centerByAlpha(img).data]).toEqual([...img.data]);
	});
});

describe("resize", () => {
	const twoByTwo = () =>
		makeImage(2, 2, [
			[0, 0, 0, 255],
			[100, 100, 100, 255],
			[200, 200, 200, 255],
			[255, 255, 255, 255],
		]);

	it("совпадает с входом при тех же размерах", () => {
		const img = twoByTwo();
		expect([...resize(img, 2, 2).data]).toEqual([...img.data]);
	});

	it("апскейл 2x2 -> 4x4 билинейно интерполирует", () => {
		const out = resize(twoByTwo(), 4, 4);
		expect(out.width).toBe(4);
		expect(out.height).toBe(4);
		const red = [...out.data].filter((_, i) => i % 4 === 0);
		expect(red.slice(0, 4)).toEqual([0, 25, 75, 100]);
		expect(red.slice(4, 8)).toEqual([50, 72, 117, 139]);
	});

	it("бросает ToolError на некорректные размеры", () => {
		const img = twoByTwo();
		expect(() => resize(img, 0, 10)).toThrow(/errors\.sizeInt/);
		expect(() => resize(img, 10.5, 10)).toThrow(/errors\.sizeInt/);
	});
});

describe("splitToParts", () => {
	function grid(w: number, h: number): PixelImage {
		const pixels: number[][] = [];
		for (let y = 0; y < h; y++) {
			for (let x = 0; x < w; x++) {
				const v = y * w + x + 1;
				pixels.push([v, v, v, 255]);
			}
		}
		return makeImage(w, h, pixels);
	}

	it("ровное деление 4x4 на 2x2 даёт четыре части 2x2 в row-major порядке", () => {
		const parts = splitToParts(grid(4, 4), 2, 2);
		expect(parts).toHaveLength(4);
		for (const part of parts) {
			expect(part.width).toBe(2);
			expect(part.height).toBe(2);
		}
		expectImageEqual(parts[0], [
			[1, 1, 1, 255],
			[2, 2, 2, 255],
			[5, 5, 5, 255],
			[6, 6, 6, 255],
		]);
		expectImageEqual(parts[1], [
			[3, 3, 3, 255],
			[4, 4, 4, 255],
			[7, 7, 7, 255],
			[8, 8, 8, 255],
		]);
		expectImageEqual(parts[2], [
			[9, 9, 9, 255],
			[10, 10, 10, 255],
			[13, 13, 13, 255],
			[14, 14, 14, 255],
		]);
		expectImageEqual(parts[3], [
			[11, 11, 11, 255],
			[12, 12, 12, 255],
			[15, 15, 15, 255],
			[16, 16, 16, 255],
		]);
	});

	it("неделимый размер: канвас дополняется прозрачным, части одинаковые", () => {
		const parts = splitToParts(grid(5, 3), 2, 2);
		expect(parts).toHaveLength(4);
		for (const part of parts) {
			expect(part.width).toBe(3);
			expect(part.height).toBe(2);
		}
		expectImageEqual(parts[0], [
			[1, 1, 1, 255],
			[2, 2, 2, 255],
			[3, 3, 3, 255],
			[6, 6, 6, 255],
			[7, 7, 7, 255],
			[8, 8, 8, 255],
		]);
		expectImageEqual(parts[1], [
			[4, 4, 4, 255],
			[5, 5, 5, 255],
			[0, 0, 0, 0],
			[9, 9, 9, 255],
			[10, 10, 10, 255],
			[0, 0, 0, 0],
		]);
		expectImageEqual(parts[2], [
			[11, 11, 11, 255],
			[12, 12, 12, 255],
			[13, 13, 13, 255],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		]);
		expectImageEqual(parts[3], [
			[14, 14, 14, 255],
			[15, 15, 15, 255],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		]);
	});

	it("одна колонка или строка — полосы без паддинга", () => {
		const parts = splitToParts(grid(3, 4), 1, 2);
		expect(parts).toHaveLength(2);
		expect(parts[0].width).toBe(3);
		expect(parts[0].height).toBe(2);
		expect(parts[1].height).toBe(2);
	});

	it("части в row-major порядке: последний кусок содержит правый нижний пиксель", () => {
		const img = grid(5, 3);
		const parts = splitToParts(img, 2, 2);
		expect(parts[parts.length - 1].data[0]).toBe(14);
		expect(parts[parts.length - 1].data[4]).toBe(15);
		expect(parts[parts.length - 1].data[8]).toBe(0);
	});

	it("дробные и нулевые значения колонок/строк нормализуются", () => {
		const parts = splitToParts(grid(6, 6), 2.9, 0);
		expect(parts).toHaveLength(2);
		expect(parts[0].width).toBe(3);
		expect(parts[0].height).toBe(6);
	});
});
