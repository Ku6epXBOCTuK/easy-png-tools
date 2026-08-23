import { describe, expect, it } from 'vitest';
import { hexToPixels, pixelsToHex } from './text';
import { makeImage } from './test-helpers';

describe('pixelsToHex', () => {
	it('форматирует пиксели как rrggbbaa построчно', () => {
		const out = pixelsToHex(
			makeImage(2, 2, [
				[255, 0, 0, 255],
				[0, 255, 0, 200],
				[16, 32, 48, 64],
				[0, 0, 0, 0]
			])
		);
		expect(out).toBe('ff0000ff 00ff00c8\n10203040 00000000');
	});
});

describe('hexToPixels', () => {
	it('обратим к pixelsToHex', () => {
		const source = makeImage(3, 1, [
			[1, 2, 3, 4],
			[250, 251, 252, 253],
			[9, 9, 9, 128]
		]);
		expect(hexToPixels(pixelsToHex(source), 3)).toEqual(source);
	});

	it('допускает произвольные переводы строк и регистр', () => {
		const out = hexToPixels('FF0000FF\n\n00FF0080 00000080', 1);
		expect(out.width).toBe(1);
		expect(out.height).toBe(3);
		expect([...out.data]).toEqual([
			255, 0, 0, 255,
			0, 255, 0, 128,
			0, 0, 0, 128
		]);
	});

	it.each([
		['ff0000', 'битые токены'],
		['ff0000ff ff0000ff ff0000ff', 'не делится на ширину'],
		['', 'пустой ввод']
	])('бросает понятную ошибку: %s (%s)', (input) => {
		expect(() => hexToPixels(input, 2)).toThrow();
	});
});
