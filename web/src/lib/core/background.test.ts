import { describe, expect, it } from 'vitest';
import {
	backgroundMaskPreview,
	backgroundRemovalMask,
	removeBackground
} from './background';
import { makeImage } from './test-helpers';

const GREEN = [0, 255, 0, 255];
const RED = [255, 0, 0, 255];

describe('backgroundRemovalMask', () => {
	it('глобальный режим удаляет все совпадающие пиксели', () => {
		const mask = backgroundRemovalMask(
			makeImage(2, 1, [GREEN, RED]),
			{ color: '#00ff00', tolerancePercent: 0, outerOnly: false, smoothPasses: 0 }
		);
		expect([...mask]).toEqual([1, 0]);
	});

describe('режим внешних областей', () => {
	const ringRedCenterGreen = [
		RED, RED, RED,
		RED, GREEN, RED,
		RED, RED, RED
	];

	it('заливка от краёв не достаёт до изолированного совпадающего острова', () => {
		const mask = backgroundRemovalMask(
			makeImage(3, 3, ringRedCenterGreen),
			{ color: '#00ff00', tolerancePercent: 0, outerOnly: true, smoothPasses: 0 }
		);
		expect(mask[4]).toBe(0);
	});

	it('глобальный режим удаляет и изолированный остров', () => {
		const mask = backgroundRemovalMask(
			makeImage(3, 3, ringRedCenterGreen),
			{ color: '#00ff00', tolerancePercent: 0, outerOnly: false, smoothPasses: 0 }
		);
		expect(mask[4]).toBe(1);
		expect(mask[0]).toBe(0);
	});
});

	it('допуск расширяет захват по цветовому расстоянию', () => {
		const img = makeImage(2, 1, [
			[10, 10, 10, 255],
			[128, 128, 128, 255]
		]);
		const tight = backgroundRemovalMask(img, {
			color: '#000000', tolerancePercent: 40, outerOnly: false, smoothPasses: 0
		});
		const wide = backgroundRemovalMask(img, {
			color: '#000000', tolerancePercent: 60, outerOnly: false, smoothPasses: 0
		});
		expect(tight[1]).toBe(0);
		expect(wide[1]).toBe(1);
	});
});

describe('smoothMask-поведение через backgroundRemovalMask', () => {
	const ringRedCenterGreen = [
		RED, RED, RED,
		RED, GREEN, RED,
		RED, RED, RED
	];
	const opts = { color: '#00ff00', tolerancePercent: 0, outerOnly: false };

	const alphaAtCenter = (img: { data: Uint8ClampedArray }) => img.data[19];

	it('без сглаживания центр удалён', () => {
		const img = removeBackground(makeImage(3, 3, ringRedCenterGreen), { ...opts, smoothPasses: 0 });
		expect(alphaAtCenter(img)).toBe(0);
	});

	it('два прохода мажоритарного фильтра возвращают изолированный пиксель', () => {
		const img = removeBackground(makeImage(3, 3, ringRedCenterGreen), { ...opts, smoothPasses: 2 });
		expect(alphaAtCenter(img)).toBe(255);
	});
});

describe('removeBackground', () => {
	it('обнуляет альфу удалённых, сохраняет RGB остальных', () => {
		const out = removeBackground(
			makeImage(2, 1, [GREEN, [5, 6, 7, 200]]),
			{ color: '#00ff00', tolerancePercent: 0, outerOnly: false, smoothPasses: 0 }
		);
		expect(out.data[3]).toBe(0);
		expect([...out.data.slice(4, 8)]).toEqual([5, 6, 7, 200]);
	});
});

describe('backgroundMaskPreview', () => {
	it('белое там, где удаление, чёрное — где остаёмся, всё непрозрачно', () => {
		const preview = backgroundMaskPreview(
			makeImage(2, 1, [
				GREEN,
				[9, 9, 9, 60]
			]),
			{ color: '#00ff00', tolerancePercent: 0, outerOnly: false, smoothPasses: 0 }
		);
		expect([...preview.data]).toEqual([
			255, 255, 255, 255,
			0, 0, 0, 255
		]);
	});
});
