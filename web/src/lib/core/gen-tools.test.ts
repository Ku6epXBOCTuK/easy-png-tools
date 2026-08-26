import { describe, expect, it } from 'vitest';
import { colorSpectrum, drawGrid, randomColorBlocks } from './gen-tools';

describe('colorSpectrum', () => {
	it('горизонтальный: левый край красный (hue 0)', () => {
		const img = colorSpectrum(100, 10, 'horizontal', 100, 50);
		expect(img.data[0]).toBeGreaterThan(200);
		expect(img.data[1]).toBeLessThan(60);
	});

	it('вертикальный: зелёный максимум около hue 120°', () => {
		const img = colorSpectrum(10, 100, 'vertical', 100, 50);
		const rowHue120 = Math.round((120 / 360) * 99);
		const g = img.data[(rowHue120 * 10 + 5) * 4 + 1];
		expect(g).toBeGreaterThan(200);
	});
});

describe('randomColorBlocks', () => {
	it('детерминирован по seed и блоки однотонные', () => {
		const a = randomColorBlocks(64, 64, 16, 7);
		const b = randomColorBlocks(64, 64, 16, 7);
		expect([...a.data]).toEqual([...b.data]);
		const c = randomColorBlocks(64, 64, 16, 8);
		expect([...a.data]).not.toEqual([...c.data]);
		expect(a.data[3]).toBe(255);
	});
});

describe('drawGrid', () => {
	it('линии на пересечениях непрозрачны, фон прозрачен', () => {
		const out = drawGrid(100, 100, 4, 4, 2, '#000000', true);
		expect(out.data[0]).toBe(0);
		expect(out.data[3]).toBe(255); // (0,0) на линии
		const mid = ((53 * 100) + 53) * 4;
		expect(out.data[mid + 3]).toBe(0); // между линиями прозрачн
	});

	it('белый непрозрачный фон при transparentBg=false', () => {
		const out = drawGrid(20, 20, 2, 2, 1, '#000000', false);
		const mid = ((5 * 20) + 5) * 4;
		expect(out.data[mid]).toBe(255);
	});
});
