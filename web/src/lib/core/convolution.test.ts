import { describe, expect, it } from "vitest";
import { convolve, gaussianBlur, sharpen } from "./convolution";
import { makeImage } from "./test-helpers";

const SHARPEN_KERNEL = [0, -1, 0, -1, 5, -1, 0, -1, 0];

describe("convolve", () => {
	it("крестовое ядро резкости на полоске из трёх пикселей", () => {
		const out = convolve(
			makeImage(3, 1, [
				[0, 0, 0, 255],
				[100, 100, 100, 255],
				[0, 0, 0, 255],
			]),
			SHARPEN_KERNEL,
			3,
		);
		expect([...out.data.slice(4, 8)]).toEqual([255, 255, 255, 255]);
		expect([...out.data.slice(0, 4)]).toEqual([0, 0, 0, 255]);
		expect([...out.data.slice(8, 12)]).toEqual([0, 0, 0, 255]);
	});

	it.each([
		[2, 3],
		[3.5, 3],
		[0, 3],
	])("бросает ошибку на некорректном размере ядра %i", (size) => {
		expect(() =>
			convolve(makeImage(1, 1, [[0, 0, 0, 255]]), [1], size as number),
		).toThrow();
	});
});

describe("sharpen", () => {
	it("сила 0 возвращает копию", () => {
		const img = makeImage(2, 2, [
			[10, 20, 30, 255],
			[40, 50, 60, 128],
			[70, 80, 90, 255],
			[100, 110, 120, 200],
		]);
		expect([...sharpen(img, 0).data]).toEqual([...img.data]);
	});

	it("сила 100 применяет чистое ядро резкости", () => {
		const out = sharpen(
			makeImage(3, 1, [
				[0, 0, 0, 255],
				[100, 100, 100, 255],
				[0, 0, 0, 255],
			]),
			100,
		);
		expect(out.data[4]).toBe(255);
		expect(out.data[0]).toBe(0);
	});
});

describe("gaussianBlur", () => {
	it("постоянное изображение не меняется ни в RGB, ни в альфе", () => {
		const img = makeImage(3, 3, new Array(9).fill([40, 80, 120, 128]));
		const out = gaussianBlur(img, 16);
		for (let i = 0; i < out.data.length; i++) {
			expect(out.data[i]).toBe(img.data[i]);
		}
	});

	it("далёкие углы остаются прозрачными, цвет центра не искажается", () => {
		const size = 61;
		const pixels: number[][] = [];
		for (let y = 0; y < size; y++) {
			for (let x = 0; x < size; x++) {
				pixels.push(
					x >= 26 && x <= 34 && y >= 26 && y <= 34
						? [200, 50, 25, 255]
						: [0, 0, 0, 0],
				);
			}
		}
		const out = gaussianBlur(makeImage(size, size, pixels), 8);
		const corner = 0;
		expect(out.data[corner]).toBe(0);
		expect(out.data[corner + 1]).toBe(0);
		expect(out.data[corner + 2]).toBe(0);
		expect(out.data[corner + 3]).toBe(0);
		const center = (30 * size + 30) * 4;
		expect(out.data[center]).toBe(200);
		expect(out.data[center + 1]).toBe(50);
		expect(out.data[center + 2]).toBe(25);
	});

	it("симметричный вход даёт симметричный результат", () => {
		const leftByRow = [
			[
				[255, 0, 0, 255],
				[10, 20, 30, 255],
				[64, 64, 64, 64],
				[5, 5, 5, 200],
			],
			[
				[10, 20, 30, 255],
				[200, 100, 50, 255],
				[1, 2, 3, 4],
				[90, 90, 90, 250],
			],
			[
				[64, 64, 64, 64],
				[1, 2, 3, 4],
				[128, 128, 128, 128],
				[40, 40, 40, 240],
			],
			[
				[200, 100, 50, 255],
				[90, 90, 90, 250],
				[40, 40, 40, 240],
				[7, 7, 7, 255],
			],
			[
				[10, 20, 30, 255],
				[1, 2, 3, 4],
				[64, 64, 64, 64],
				[90, 90, 90, 250],
			],
			[
				[64, 64, 64, 64],
				[200, 100, 50, 255],
				[5, 5, 5, 200],
				[1, 2, 3, 4],
			],
			[
				[5, 5, 5, 200],
				[40, 40, 40, 240],
				[90, 90, 90, 250],
				[128, 128, 128, 128],
			],
		];
		const pixels: number[][] = [];
		for (let y = 0; y < 7; y++) {
			for (let x = 0; x < 7; x++) {
				pixels.push(leftByRow[y][Math.min(x, 6 - x)]);
			}
		}
		const img = makeImage(7, 7, pixels);
		const blurred = gaussianBlur(img, 3);
		for (let y = 0; y < 7; y++) {
			for (let x = 0; x < 3; x++) {
				const li = (y * 7 + x) * 4;
				const ri = (y * 7 + (6 - x)) * 4;
				expect([...blurred.data.slice(li, li + 4)]).toEqual([
					blurred.data[ri],
					blurred.data[ri + 1],
					blurred.data[ri + 2],
					blurred.data[ri + 3],
				]);
			}
		}
	});
});
