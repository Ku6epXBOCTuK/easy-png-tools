import { describe, expect, it } from 'vitest';
import { parseHex, removeColorToAlpha } from './alpha';
import { makeImage } from './test-helpers';

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
