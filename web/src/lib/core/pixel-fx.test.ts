import { describe, expect, it } from 'vitest';
import { addNoise, defringe, featherAlpha, mulberry32, pixelate, shuffleBlocks, silhouette } from './pixel-fx';
import { makeImage } from './test-helpers';

describe('pixelate', () => {
	it('блок усредняется: шахматка 2×2 с блоком 2 → один цвет', () => {
		const img = makeImage(2, 2, [
			[0, 0, 0, 255],
			[200, 200, 200, 255],
			[100, 100, 100, 255],
			[140, 140, 140, 255]
		]);
		const out = pixelate(img, 2);
		expect(out.data[0]).toBeCloseTo(110, 0);
		expect(out.data[4]).toBeCloseTo(110, 0);
	});

	it('однотонное изображение не меняется', () => {
		const img = makeImage(3, 3, new Array(9).fill([50, 60, 70, 255]));
		expect([...pixelate(img, 2).data]).toEqual([...img.data]);
	});
});

describe('shuffleBlocks / addNoise — детерминизм по seed', () => {
	it('тот же seed даёт то же перемешивание', () => {
		const img = makeImage(4, 1, [
			[10, 0, 0, 255],
			[20, 0, 0, 255],
			[30, 0, 0, 255],
			[40, 0, 0, 255]
		]);
		const a = shuffleBlocks(img, 1, 7);
		const b = shuffleBlocks(img, 1, 7);
		expect([...a.data]).toEqual([...b.data]);
	});

	it('мультимножество пикселей сохраняется (перестановка)', () => {
		const img = makeImage(4, 1, [
			[10, 0, 0, 255],
			[20, 0, 0, 255],
			[30, 0, 0, 255],
			[40, 0, 0, 255]
		]);
		const out = [...shuffleBlocks(img, 1, 99).data.filter((_, i) => i % 4 === 0)].sort(
			(x, y) => x - y
		);
		expect(out).toEqual([10, 20, 30, 40]);
	});

	it('addNoise при том же seed воспроизводим, amount=0 — идентичность', () => {
		const img = makeImage(2, 2, new Array(4).fill([128, 64, 32, 255]));
		const a = addNoise(img, 20, 'mono', 5);
		const b = addNoise(img, 20, 'mono', 5);
		expect([...a.data]).toEqual([...b.data]);
		expect([...addNoise(img, 0, 'mono', 999).data]).toEqual([...img.data]);
	});
});

describe('featherAlpha', () => {
	it('жёсткий край получает промежуточные альфы', () => {
		// левая половина непрозрачная, правая прозрачная
		const img = makeImage(6, 1, [
			[255, 0, 0, 255],
			[255, 0, 0, 255],
			[255, 0, 0, 255],
			[255, 0, 0, 0],
			[255, 0, 0, 0],
			[255, 0, 0, 0]
		]);
		const out = featherAlpha(img, 1);
		const alphas = [0, 1, 2].map((x) => out.data[x * 4 + 3]);
		expect(alphas[0]).toBeGreaterThan(240);
		expect(alphas.some((v) => v > 0 && v < 240)).toBe(true);
	});
});

describe('defringe', () => {
	it('полупрозрачному пикселю берётся RGB от соседнего непрозрачного', () => {
		const img = makeImage(2, 1, [
			[250, 250, 250, 255],
			[255, 0, 0, 128]
		]);
		const out = defringe(img, 2);
		expect(out.data[4]).toBe(250);
		expect(out.data[6]).toBe(250);
		expect(out.data[7]).toBe(128); // альфа сохранена
	});

	it('полностью прозрачные области не трогаются', () => {
		const img = makeImage(2, 1, [
			[250, 250, 250, 255],
			[0, 0, 0, 0]
		]);
		const out = defringe(img, 2);
		expect(out.data[4 + 3]).toBe(0);
	});
});

describe('silhouette', () => {
	it('видимые пиксели заливаются цветом, ниже порога — прозрачность', () => {
		const img = makeImage(2, 1, [
			[123, 45, 67, 255],
			[123, 45, 67, 10]
		]);
		const out = silhouette(img, '#00ff00', 50);
		expect([...out.data.slice(0, 4)]).toEqual([0, 255, 0, 255]);
		expect(out.data[4 + 3]).toBe(0);
	});
});

describe('mulberry32', () => {
	it('последовательность детерминирована', () => {
		const a = mulberry32(42);
		const b = mulberry32(42);
		expect([a(), a(), a()]).toEqual([b(), b(), b()]);
	});
});
