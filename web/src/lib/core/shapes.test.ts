import { describe, expect, it } from 'vitest';
import { boxTest, circleTest, renderShape, starTest, wavyTest } from './shapes';
import { makeImage } from './test-helpers';

describe('тесты фигур', () => {
	it('круг: центр внутри, угол снаружи', () => {
		const t = circleTest(0.5);
		expect(t(0, 0)).toBe(true);
		expect(t(0.49, 0)).toBe(true);
		expect(t(0.51, 0)).toBe(false);
		expect(t(0.4, 0.4)).toBe(false);
	});

	it('прямоугольник: полуоси независимы', () => {
		const t = boxTest(0.5, 0.25);
		expect(t(0.45, 0.2)).toBe(true);
		expect(t(0.2, 0.3)).toBe(false);
	});

	it('звезда: луч внутри дальше впадины', () => {
		const t = starTest(5, 0.5, 1, 0);
		expect(t(0.9, 0)).toBe(true); // вдоль луча (θ=0)
		const valleyAngle = Math.PI / 5; // середина между лучами
		expect(t(Math.cos(valleyAngle) * 0.8, Math.sin(valleyAngle) * 0.8)).toBe(false);
		expect(t(0.4, 0)).toBe(true); // радиус впадин 0.5 — 0.4 внутри всегда
	});

	it('волна: фаза двигает границу', () => {
		const a = wavyTest(0.5, 0.1, 6, 0);
		const b = wavyTest(0.5, 0.1, 6, 180);
		const deg = 15; // sin(6·15°)=1 → край 0.6; при фазе 180° край 0.4
		const rad = (deg * Math.PI) / 180;
		const px = 0.55;
		expect(a(px * Math.cos(rad), px * Math.sin(rad))).toBe(true); // край 0.6
		expect(b(px * Math.cos(rad), px * Math.sin(rad))).toBe(false); // край 0.4
	});
});

describe('renderShape', () => {
	const img = makeImage(4, 2, new Array(8).fill([255, 255, 255, 255]));

	it('внутри сохраняет пиксели, снаружи альфа 0', () => {
		const out = renderShape(img, boxTest(0.5, 0.5));
		let opaque = 0;
		for (let i = 3; i < out.data.length; i += 4) if (out.data[i] === 255) opaque++;
		expect(opaque).toBe(4);
		expect(out.data[4]).toBe(255); // RGB внутри фигуры сохранён
	});

	it('смещение центра переносит маску', () => {
		const shifted = renderShape(makeImage(2, 2, new Array(4).fill([255, 255, 255, 255])), circleTest(0.7), 0.5);
		expect(shifted.data[3]).toBe(0);
		expect(shifted.data[4 + 3]).toBe(255);
	});
});
