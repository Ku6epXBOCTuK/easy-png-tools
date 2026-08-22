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
