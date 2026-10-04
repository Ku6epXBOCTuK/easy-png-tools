import { describe, expect, it } from "vitest";
import { boxTest, circleTest, renderShape, starTest, wavyTest } from "./shapes";
import { makeImage } from "./test-helpers";

describe("тесты фигур", () => {
	it("круг: центр внутри, угол снаружи", () => {
		const t = circleTest(0.5);
		expect(t(0, 0)).toBe(true);
		expect(t(0.49, 0)).toBe(true);
		expect(t(0.51, 0)).toBe(false);
		expect(t(0.4, 0.4)).toBe(false);
	});

	it("прямоугольник: полуоси независимы", () => {
		const t = boxTest(0.5, 0.25);
		expect(t(0.45, 0.2)).toBe(true);
		expect(t(0.2, 0.3)).toBe(false);
	});

	it("звезда: луч внутри дальше впадины", () => {
		const t = starTest(5, 0.5, 1, 0);
		expect(t(0.9, 0)).toBe(true); // вдоль луча (θ=0)
		const valleyAngle = Math.PI / 5; // середина между лучами
		expect(t(Math.cos(valleyAngle) * 0.8, Math.sin(valleyAngle) * 0.8)).toBe(
			false,
		);
		expect(t(0.4, 0)).toBe(true); // радиус впадин 0.5 — 0.4 внутри всегда
	});

	it("волна: фаза двигает границу", () => {
		const a = wavyTest(0.5, 0.1, 6, 0);
		const b = wavyTest(0.5, 0.1, 6, 180);
		const deg = 15; // sin(6·15°)=1 → край 0.6; при фазе 180° край 0.4
		const rad = (deg * Math.PI) / 180;
		const px = 0.55;
		expect(a(px * Math.cos(rad), px * Math.sin(rad))).toBe(true); // край 0.6
		expect(b(px * Math.cos(rad), px * Math.sin(rad))).toBe(false); // край 0.4
	});
});

describe("renderShape", () => {
	const img = makeImage(4, 2, new Array(8).fill([255, 255, 255, 255]));

	it("внутри сохраняет пиксели, снаружи альфа 0", () => {
		const out = renderShape(img, boxTest(0.5, 0.5));
		let opaque = 0;
		for (let i = 3; i < out.data.length; i += 4)
			if (out.data[i] === 255) opaque++;
		expect(opaque).toBe(4);
		expect(out.data[4]).toBe(255); // RGB внутри фигуры сохранён
	});

	it("смещение центра переносит маску", () => {
		const shifted = renderShape(
			makeImage(2, 2, new Array(4).fill([255, 255, 255, 255])),
			circleTest(0.7),
			0.5,
		);
		expect(shifted.data[3]).toBe(0);
		expect(shifted.data[4 + 3]).toBe(255);
	});

	// Регрессия старого бага square-mask: полный размер без смещения обязан
	// сохранять квадратную картинку целиком.
	it("квадрат 100% без смещения сохраняет всё квадратное изображение", () => {
		const out = renderShape(
			makeImage(4, 4, new Array(16).fill([255, 255, 255, 255])),
			boxTest(0.5, 0.5),
		);
		for (let i = 3; i < out.data.length; i += 4) expect(out.data[i]).toBe(255);
	});

	// Смещение — доля свободного места: ±0.5 прижимает фигуру к краю при любом
	// её размере, фигура не уезжает за холст.
	it("максимальное смещение прижимает фигуру к краю", () => {
		const out = renderShape(
			makeImage(4, 4, new Array(16).fill([255, 255, 255, 255])),
			boxTest(0.25, 0.25),
			0.5,
			0.5,
			{ x: 0.25, y: 0.25 },
		);
		const opaqueAt = (x: number, y: number) =>
			out.data[(y * 4 + x) * 4 + 3] === 255;
		expect(opaqueAt(3, 3)).toBe(true);
		expect(opaqueAt(2, 2)).toBe(true);
		expect(opaqueAt(1, 1)).toBe(false);
		expect(opaqueAt(2, 1)).toBe(false);
	});
});
