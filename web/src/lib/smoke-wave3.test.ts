import { describe, expect, it } from 'vitest';
import { rotateFreeImage, skewImage, transformImage, zoomImage } from './core/affine';
import { vignette } from './core/effects';
import { autoContrast, gammaCorrection, temperature, tint } from './core/color';
import { makeImage } from './core/test-helpers';

function solid(w: number, h: number, rgba: [number, number, number, number]) {
	return makeImage(w, h, new Array(w * h).fill(rgba));
}

function opaqueRatio(img: { data: Uint8ClampedArray }) {
	let n = 0;
	for (let i = 3; i < img.data.length; i += 4) if (img.data[i] === 255) n++;
	return n / (img.data.length / 4);
}

function px(img: { width: number; data: Uint8ClampedArray }, x: number, y: number) {
	const d = (y * img.width + x) * 4;
	return [img.data[d], img.data[d + 1], img.data[d + 2], img.data[d + 3]] as const;
}

describe('Смоук §5 wave3', () => {
	it('1. Наклон X/Y по отдельности и вместе искажает форму без чёрных полос', () => {
		const img = solid(20, 20, [200, 30, 30, 255]);
		for (const [dx, dy] of [
			[15, 0],
			[0, 15],
			[12, 12]
		] as const) {
			const out = skewImage(img, dx, dy);
			expect(out.width).toBeGreaterThanOrEqual(img.width);
			expect(out.height).toBeGreaterThanOrEqual(img.height);
			for (let i = 0; i < out.data.length; i += 4) {
				const [r, g, b] = [out.data[i], out.data[i + 1], out.data[i + 2]];
				if (out.data[i + 3] > 0) {
					expect(r).toBeGreaterThan(150);
					expect(g).toBeLessThan(80);
					expect(b).toBeLessThan(80);
				}
			}
		}
	});

	it('2. Поворот 30°: холст вырос, углы прозрачны, центр на месте', () => {
		const img = solid(100, 100, [255, 0, 0, 255]);
		const out = rotateFreeImage(img, 30);
		expect(out.width).toBe(136);
		expect(out.height).toBe(136);
		expect(px(out, 0, 0)[3]).toBe(0);
		expect(px(out, 135, 0)[3]).toBe(0);
		expect(px(out, 0, 135)[3]).toBe(0);
		expect(px(out, 135, 135)[3]).toBe(0);
		expect(px(out, 67, 67)).toEqual([255, 0, 0, 255]);
	});

	it('3. Зум 200%: холст прежний, центр совпадает, края обрезаны', () => {
		const grad = makeImage(
			11,
			11,
			Array.from({ length: 121 }, (_, i) => [(i * 2) % 256, i % 11 * 23, 128, 255] as [number, number, number, number])
		);
		const out = zoomImage(grad, 200);
		expect(out.width).toBe(11);
		expect(out.height).toBe(11);
		expect([...px(out, 5, 5)]).toEqual([...px(grad, 5, 5)]);
	});

	it('4. Сдвиг уводит содержимое за край, противоположный край залит фоном', () => {
		const img = solid(4, 4, [0, 0, 255, 255]);
		const out = transformImage(img, [1, 0, 0, 1, -2, 0], 4, 4, '#ffffff');
		expect(px(out, 0, 0)).toEqual([255, 255, 255, 255]);
		expect(px(out, 3, 0)).toEqual([0, 0, 255, 255]);
	});

	it('5. Гамма: 1 — без изменений, 0.5 темнее, 2 светлее', () => {
		const img = solid(3, 3, [128, 128, 128, 255]);
		const id = gammaCorrection(img, 1);
		expect([...id.data]).toEqual([...img.data]);
		const dark = px(gammaCorrection(img, 0.5), 1, 1)[0];
		const light = px(gammaCorrection(img, 2), 1, 1)[0];
		expect(dark).toBeLessThan(128);
		expect(light).toBeGreaterThan(128);
	});

	it('6. Автоконтраст вытягивает тусклый диапазон', () => {
		const dim = makeImage(
			2,
			2,
			new Array(4).fill([50, 55, 45, 255])
		);
		dim.data[0] = 40;
		const out = autoContrast(dim);
		const values = Array.from({ length: 4 }, (_, k) => px(out, k % 2, Math.floor(k / 2))[0]);
		expect(Math.min(...values)).toBeLessThanOrEqual(1);
	});

	it('7. Температура ±50 теплеет/холодеет заметно', () => {
		const img = solid(2, 2, [128, 128, 128, 255]);
		const warm = px(temperature(img, 50), 0, 0);
		const cool = px(temperature(img, -50), 0, 0);
		expect(warm[0]).toBeGreaterThan(cool[0]);
		expect(warm[2]).toBeLessThan(cool[2]);
	});

	it('8. Тонирование красным: белое окрашивается сильнее серого', () => {
		const img = makeImage(2, 1, [
			[255, 255, 255, 255],
			[128, 128, 128, 255]
		]);
		const out = tint(img, '#ff0000', 100);
		expect(px(out, 0, 0)).toEqual([255, 0, 0, 255]);
		const gray = px(out, 1, 0);
		expect(gray[1]).toBe(0);
		expect(gray[0]).toBeGreaterThan(gray[2]);
	});

	it('9. Виньетка: сила 0 — идентичность, центр не темнеет, углы темнеют', () => {
		const img = solid(21, 21, [200, 200, 200, 255]);
		expect([...vignette(img, 0).data]).toEqual([...img.data]);
		const out = vignette(img, 60);
		expect(px(out, 10, 10)).toEqual([200, 200, 200, 255]);
		expect(px(out, 0, 0)[0]).toBeLessThan(120);
	});
});
