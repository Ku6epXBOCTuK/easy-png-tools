import { describe, expect, it } from 'vitest';
import { rotate90, sampleBilinear } from './geometry';
import { rotateFreeImage, skewImage, transformImage, zoomImage } from './affine';
import { makeImage } from './test-helpers';

describe('sampleBilinear', () => {
	it('целые координаты возвращают точный пиксель', () => {
		const img = makeImage(2, 1, [
			[255, 0, 0, 255],
			[0, 0, 255, 255]
		]);
		expect(sampleBilinear(img, 0, 0)).toEqual([255, 0, 0, 255]);
		expect(sampleBilinear(img, 1, 0)).toEqual([0, 0, 255, 255]);
	});

	it('дробная координата интерполирует', () => {
		const img = makeImage(2, 1, [
			[0, 0, 0, 255],
			[200, 200, 200, 255]
		]);
		const [r] = sampleBilinear(img, 0.5, 0);
		expect(r).toBeCloseTo(100, 0);
	});

	it('координаты за краем клампятся', () => {
		const img = makeImage(1, 1, [[7, 7, 7, 255]]);
		expect(sampleBilinear(img, -10, -10)).toEqual([7, 7, 7, 255]);
	});
});

describe('rotateFreeImage', () => {
	it('поворот на 180° даёт размеры не меньше исходных и непустой результат', () => {
		const img = makeImage(4, 3, [
			[255, 0, 0, 255], [0, 255, 0, 255], [0, 0, 255, 255], [255, 255, 0, 255],
			[128, 128, 128, 255], [64, 64, 64, 255], [32, 32, 32, 255], [200, 200, 200, 255],
			[10, 20, 30, 255], [40, 50, 60, 255], [70, 80, 90, 255], [100, 100, 100, 255]
		]);
		const out = rotateFreeImage(img, 180);
		expect(out.width).toBeGreaterThanOrEqual(img.width);
		expect(out.height).toBeGreaterThanOrEqual(img.height);
		let opaque = 0;
		const total = out.width * out.height;
		for (let i = 3; i < out.data.length; i += 4) {
			if (out.data[i] > 0) opaque++;
		}
		expect(opaque / total).toBeGreaterThan(0.8);
	});

	it('поворот квадрата на 360° близок к оригиналу', () => {
		const img = makeImage(
			5,
			5,
			new Array(25).fill([200, 100, 50, 255])
		);
		const out = rotateFreeImage(img, 360);
		expect(out.width).toBeGreaterThanOrEqual(5);
		expect(out.height).toBeGreaterThanOrEqual(5);
		for (let y = 0; y < 5; y++) {
			for (let x = 0; x < 5; x++) {
				const di = (y * out.width + x) * 4;
				for (let ch = 0; ch < 4; ch++) {
					expect(Math.abs(out.data[di + ch] - img.data[(y * 5 + x) * 4 + ch])).toBeLessThanOrEqual(4);
				}
			}
		}
	});
});

describe('skewImage', () => {
	it('наклон X=45° сдвигает верхний правый угол', () => {
		const img = makeImage(2, 2, [
			[255, 0, 0, 255], [0, 255, 0, 255],
			[0, 0, 255, 255], [128, 128, 128, 255]
		]);
		const out = skewImage(img, 45, 0);
		expect(out.width).toBeGreaterThan(2);
		expect(out.data[3]).toBe(255);
	});

	it('углы 0° — тождественное преобразование', () => {
		const img = makeImage(2, 2, [
			[255, 0, 0, 255], [0, 255, 0, 255],
			[0, 0, 255, 255], [128, 128, 128, 255]
		]);
		const out = skewImage(img, 0, 0);
		expect(out.width).toBe(2);
		expect([...out.data]).toEqual([...img.data]);
	});
});
