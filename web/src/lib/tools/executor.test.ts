import { describe, expect, it } from 'vitest';
import { executeStep } from './executor';
import { makeImage } from '../core/test-helpers';
import type { PixelImage } from '../core/types';

function cloneOf(img: PixelImage): PixelImage {
	return { width: img.width, height: img.height, data: new Uint8ClampedArray(img.data) };
}

describe('executeStep: прямой путь (среда без Worker)', () => {
	it('возвращает результат инструмента', async () => {
		const img = makeImage(1, 1, [
			[1, 2, 3, 4]
		]);
		const out = await executeStep(
			{ id: 'stub', run: (i) => cloneOf(i) },
			img,
			{}
		);
		expect(out).toEqual(img);
	});

	it('пробрасывает ошибку инструмента как есть', async () => {
		const boom = () => {
			throw new Error('бум');
		};
		await expect(executeStep({ id: 'stub', run: boom }, makeImage(1, 1, [[0, 0, 0, 255]]), {})).rejects.toThrow(
			'бум'
		);
	});

	it('инструмент без run даёт понятную ошибку', async () => {
		await expect(executeStep({ id: 'stub' }, makeImage(1, 1, [[0, 0, 0, 255]]), {})).rejects.toThrow(
			'не обрабатывает изображения'
		);
	});
});
