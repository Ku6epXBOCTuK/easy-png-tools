import { expect } from 'vitest';
import type { PixelImage } from './types';

export function makeImage(width: number, height: number, pixels: number[][]): PixelImage {
	const data = new Uint8ClampedArray(pixels.flat());
	if (data.length !== width * height * 4) {
		throw new Error(`Fixture mismatch: ${data.length} байт на ${width}x${height}`);
	}
	return { width, height, data };
}

export function expectImageEqual(actual: PixelImage, expectedPixels: number[][]): void {
	expect([...actual.data]).toEqual(expectedPixels.flat());
}
