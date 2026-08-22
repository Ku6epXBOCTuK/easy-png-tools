import { describe, expect, it } from 'vitest';
import { imageInfo } from './analyze';
import { makeImage } from './test-helpers';

describe('imageInfo', () => {
	it('находит полупрозрачные пиксели и считает уникальные RGBA-цвета', () => {
		const info = imageInfo(
			makeImage(2, 2, [
				[0, 0, 0, 255],
				[0, 0, 0, 255],
				[255, 0, 0, 128],
				[255, 0, 0, 128]
			])
		);
		expect(info).toEqual({ width: 2, height: 2, hasAlpha: true, colorCount: 2 });
	});

	it('полностью непрозрачное изображение — hasAlpha false', () => {
		const info = imageInfo(
			makeImage(2, 1, [
				[10, 20, 30, 255],
				[40, 50, 60, 255]
			])
		);
		expect(info.hasAlpha).toBe(false);
		expect(info.colorCount).toBe(2);
	});

	it('разная альфа означает разные цвета', () => {
		const info = imageInfo(
			makeImage(2, 1, [
				[255, 0, 0, 255],
				[255, 0, 0, 128]
			])
		);
		expect(info.hasAlpha).toBe(true);
		expect(info.colorCount).toBe(2);
	});

	it('возвращает корректные размеры неквадрата', () => {
		const info = imageInfo(makeImage(5, 3, new Array(15).fill([1, 2, 3, 4])));
		expect(info.width).toBe(5);
		expect(info.height).toBe(3);
	});
});
