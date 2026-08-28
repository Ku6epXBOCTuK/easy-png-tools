import { describe, expect, it } from "vitest";
import { gradientImage, noiseImage, solidImage } from "./generate";

describe("solidImage", () => {
	it("заливает весь холст заданным цветом", () => {
		const out = solidImage(2, 2, [10, 20, 30, 255]);
		expect(out.width).toBe(2);
		expect([...out.data]).toEqual(new Array(4).fill([10, 20, 30, 255]).flat());
	});

	it.each([
		[0, 10],
		[10, 0],
		[2.5, 10],
		[-1, 5],
	])("бросает ошибку на размерах %i x %i", (w, h) => {
		expect(() => solidImage(w, h, [0, 0, 0, 255])).toThrow();
	});
});

describe("noiseImage", () => {
	it("детерминирован: одно зерно — одни байты", () => {
		expect([...noiseImage(4, 4, 42).data]).toEqual([
			...noiseImage(4, 4, 42).data,
		]);
	});

	it("разные зерна дают разные данные", () => {
		const a = [...noiseImage(8, 8, 1).data];
		const b = [...noiseImage(8, 8, 2).data];
		expect(a).not.toEqual(b);
	});

	it("альфа всегда непрозрачная", () => {
		const data = noiseImage(3, 3, 7).data;
		for (let i = 3; i < data.length; i += 4) {
			expect(data[i]).toBe(255);
		}
	});
});

describe("gradientImage", () => {
	it("горизонтальный градиент идёт от цвета A к цвету B", () => {
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

	it("вертикальный градиент меняется по строкам", () => {
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
