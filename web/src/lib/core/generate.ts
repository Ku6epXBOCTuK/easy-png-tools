import type { PixelImage } from './types';
import { ToolError } from './errors';

export function solidImage(
	width: number,
	height: number,
	rgba: [number, number, number, number]
): PixelImage {
	if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) {
		throw new ToolError('errors.sizeInt');
	}
	const data = new Uint8ClampedArray(width * height * 4);
	for (let i = 0; i < data.length; i += 4) {
		data[i] = rgba[0];
		data[i + 1] = rgba[1];
		data[i + 2] = rgba[2];
		data[i + 3] = rgba[3];
	}
	return { width, height, data };
}

export function noiseImage(width: number, height: number, seed: number): PixelImage {
	if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) {
		throw new ToolError('errors.sizeInt');
	}
	const random = mulberry32(seed);
	const data = new Uint8ClampedArray(width * height * 4);
	for (let i = 0; i < data.length; i += 4) {
		data[i] = Math.floor(random() * 256);
		data[i + 1] = Math.floor(random() * 256);
		data[i + 2] = Math.floor(random() * 256);
		data[i + 3] = 255;
	}
	return { width, height, data };
}

export function gradientImage(
	width: number,
	height: number,
	fromRgba: [number, number, number, number],
	toRgba: [number, number, number, number],
	direction: 'horizontal' | 'vertical'
): PixelImage {
	if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) {
		throw new ToolError('errors.sizeInt');
	}
	const out: PixelImage = {
		width,
		height,
		data: new Uint8ClampedArray(width * height * 4)
	};
	const steps = (direction === 'horizontal' ? width : height) - 1;
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const t = steps === 0 ? 0 : (direction === 'horizontal' ? x : y) / steps;
			const i = (y * width + x) * 4;
			out.data[i] = fromRgba[0] + (toRgba[0] - fromRgba[0]) * t;
			out.data[i + 1] = fromRgba[1] + (toRgba[1] - fromRgba[1]) * t;
			out.data[i + 2] = fromRgba[2] + (toRgba[2] - fromRgba[2]) * t;
			out.data[i + 3] = fromRgba[3] + (toRgba[3] - fromRgba[3]) * t;
		}
	}
	return out;
}

function mulberry32(seed: number): () => number {
	let a = seed >>> 0;
	return () => {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}
