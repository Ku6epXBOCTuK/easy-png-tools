import { describe, expect, it } from 'vitest';
import { colorMask, flattenOntoColor, invertAlpha, parseHex, removeColorToAlpha } from './alpha';
import { makeImage } from './test-helpers';

describe('invertAlpha', () => {
	it('обращает альфу, RGB не трогает', () => {
		const out = invertAlpha(makeImage(1, 1, [[10, 20, 30, 128]]));
		expect([...out.data]).toEqual([10, 20, 30, 127]);
	});
});

describe('removeColorToAlpha', () => {
	const fixture = () =>
		makeImage(2, 1, [
			[255, 255, 255, 255],
			[255, 0, 0, 255]
		]);

	it('обнуляет альфу только у точного совпадения при tolerance=0', () => {
		const out = removeColorToAlpha(fixture(), '#ff0000', 0);
		expect(out.data[3]).toBe(255);
		expect(out.data[7]).toBe(0);
		expect(out.data[4]).toBe(255);
		expect(out.data[5]).toBe(0);
	});

	it('поддерживает короткую форму и регистр hex', () => {
		expect([...removeColorToAlpha(fixture(), '#f00', 0).data.slice(4)]).toEqual([
			255, 0, 0, 0
		]);
		expect([...removeColorToAlpha(fixture(), '#FF0000', 0).data.slice(4)]).toEqual([
			255, 0, 0, 0
		]);
	});

	it('tolerance 100% удаляет весь диапазон расстояний', () => {
		const out = removeColorToAlpha(fixture(), '#000000', 100);
		expect(out.data[3]).toBe(0);
		expect(out.data[7]).toBe(0);
	});

	it('промежуточный tolerance различает близкие и далёкие цвета', () => {
		const img = makeImage(2, 1, [
			[0, 0, 0, 255],
			[128, 128, 128, 255]
		]);
		const kept = removeColorToAlpha(img, '#000000', 40);
		const removed = removeColorToAlpha(img, '#000000', 60);
		expect(kept.data[3]).toBe(0);
		expect(kept.data[7]).toBe(255);
		expect(removed.data[3]).toBe(0);
		expect(removed.data[7]).toBe(0);
	});

	it('не мутирует вход', () => {
		const img = fixture();
		removeColorToAlpha(img, '#ffffff', 100);
		expect([...img.data]).toEqual([
			255, 255, 255, 255,
			255, 0, 0, 255
		]);
	});
});

describe('colorMask', () => {
	it('удаляемые пиксели белые, остальные чёрные, маска непрозрачная', () => {
		const out = colorMask(
			makeImage(2, 1, [
				[255, 0, 0, 255],
				[0, 255, 0, 255]
			]),
			'#ff0000',
			0
		);
		expect([...out.data]).toEqual([
			255, 255, 255, 255,
			0, 0, 0, 255
		]);
	});

	it('порог совпадает с removeColorToAlpha', () => {
		const img = makeImage(2, 1, [
			[0, 0, 0, 255],
			[128, 128, 128, 255]
		]);
		const kept = colorMask(img, '#000000', 40);
		const removed = colorMask(img, '#000000', 60);
		expect(kept.data[4]).toBe(0);
		expect(removed.data[4]).toBe(255);
	});
});

describe('flattenOntoColor', () => {
	it('непрозрачный пиксель не меняется, альфа становится 255', () => {
		const out = flattenOntoColor(makeImage(1, 1, [[10, 20, 30, 255]]), '#ffffff');
		expect([...out.data]).toEqual([10, 20, 30, 255]);
	});

	it('полностью прозрачный пиксель становится цветом подложки', () => {
		const out = flattenOntoColor(makeImage(1, 1, [[99, 99, 99, 0]]), '#ff8040');
		expect([...out.data]).toEqual([255, 128, 64, 255]);
	});

	it('полупрозрачный пиксель смешивается с подложкой', () => {
		const out = flattenOntoColor(makeImage(1, 1, [[10, 20, 30, 128]]), '#ffffff');
		expect([...out.data]).toEqual([132, 137, 142, 255]);
	});
});

describe('parseHex', () => {
	it('разбирает #rrggbb, rrggbb, #rgb', () => {
		expect(parseHex('#ff8040')).toEqual([255, 128, 64]);
		expect(parseHex('ff8040')).toEqual([255, 128, 64]);
		expect(parseHex('#F80')).toEqual([255, 136, 0]);
	});

	it.each(['zzz', '12345', '##ff', ''])('бросает ошибку на "%s"', (bad) => {
		expect(() => parseHex(bad)).toThrow(/Некорректный HEX/);
	});
});
