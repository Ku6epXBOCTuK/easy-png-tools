import type { PixelImage } from './types';

export type ImageInfo = {
	width: number;
	height: number;
	hasAlpha: boolean;
	colorCount: number;
};

export function imageInfo(img: PixelImage): ImageInfo {
	let hasAlpha = false;
	const seen = new Set<number>();
	for (let i = 0; i < img.data.length; i += 4) {
		if (!hasAlpha && img.data[i + 3] !== 255) {
			hasAlpha = true;
		}
		const key =
			((img.data[i] << 24) |
				(img.data[i + 1] << 16) |
				(img.data[i + 2] << 8) |
				img.data[i + 3]) >>>
			0;
		seen.add(key);
	}
	return { width: img.width, height: img.height, hasAlpha, colorCount: seen.size };
}

export function isGrayscale(img: PixelImage): boolean {
	for (let i = 0; i < img.data.length; i += 4) {
		if (img.data[i] !== img.data[i + 1] || img.data[i + 1] !== img.data[i + 2]) {
			return false;
		}
	}
	return true;
}

export function hasTransparency(img: PixelImage): boolean {
	for (let i = 3; i < img.data.length; i += 4) {
		if (img.data[i] < 255) return true;
	}
	return false;
}

export type Orientation = 'portrait' | 'landscape' | 'square';

export function orientationOf(img: PixelImage): Orientation {
	if (img.height > img.width) return 'portrait';
	if (img.width > img.height) return 'landscape';
	return 'square';
}
