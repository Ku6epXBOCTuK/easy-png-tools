import { describe, expect, it } from 'vitest';
import { brightnessContrast, grayscale, invert } from './color';
import { makeImage } from './test-helpers';

describe('grayscale', () => {
	it('считает luma по весам BT.601 с округлением', () => {
		const out = grayscale(
			makeImage(3, 1, [
				[255, 0, 0, 255],
				[0, 255, 0, 255],
				[0, 0, 255, 255]
			])
		);
		const rgb = [...out.data].reduce<number[]>((acc, v, i) => {
			if (i % 4 === 0) acc.push(v);
			return acc;
		}, []);
		expect(rgb).toEqual([76, 150, 29]);
	});

	it('сохраняет альфу и не мутирует вход', () => {
		const img = makeImage(1, 1, [[10, 20, 30, 200]]);
		const out = grayscale(img);
		expect([...out.data]).toEqual([18, 18, 18, 200]);
		expect([...img.data]).toEqual([10, 20, 30, 200]);
	});
});

describe('invert', () => {
	it('инвертирует RGB, не трогая альфу', () => {
		const out = invert(makeImage(1, 1, [[10, 200, 30, 7]]));
		expect([...out.data]).toEqual([245, 55, 225, 7]);
	});
});

describe('brightnessContrast', () => {
	const pixel = (r: number) => makeImage(1, 1, [[r, r, r, 255]]);
	const red = (out: number[]) => [out[0], out[1], out[2]];

	it('b=0, c=0 — тождественное преобразование', () => {
		const out = brightnessContrast(pixel(77), 0, 0);
		expect(red([...out.data])).toEqual([77, 77, 77]);
	});

	it('brightness +100 насыщает всё в белый', () => {
		const out = brightnessContrast(pixel(10), 100, 0);
		expect(red([...out.data])).toEqual([255, 255, 255]);
	});

	it('brightness -100 заливает чёрным', () => {
		const out = brightnessContrast(pixel(240), -100, 0);
		expect(red([...out.data])).toEqual([0, 0, 0]);
	});

	it('contrast -100 сводит всё к серому 128', () => {
		const out = brightnessContrast(pixel(30), 0, -100);
		expect(red([...out.data])).toEqual([128, 128, 128]);
	});

	it('параметры вне диапазона клампятся', () => {
		const out = brightnessContrast(pixel(10), 150, 0);
		expect(red([...out.data])).toEqual([255, 255, 255]);
	});

	it('альфа не меняется', () => {
		const out = brightnessContrast(makeImage(1, 1, [[10, 20, 30, 64]]), 50, 50);
		expect(out.data[3]).toBe(64);
	});
});
