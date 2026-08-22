import { createPixelImage, type PixelImage } from './types';

export function grayscale(img: PixelImage): PixelImage {
	const out = createPixelImage(img.width, img.height);
	for (let i = 0; i < img.data.length; i += 4) {
		const luma = 0.299 * img.data[i] + 0.587 * img.data[i + 1] + 0.114 * img.data[i + 2];
		out.data[i] = luma;
		out.data[i + 1] = luma;
		out.data[i + 2] = luma;
		out.data[i + 3] = img.data[i + 3];
	}
	return out;
}

export function invert(img: PixelImage): PixelImage {
	const out = createPixelImage(img.width, img.height);
	for (let i = 0; i < img.data.length; i += 4) {
		out.data[i] = 255 - img.data[i];
		out.data[i + 1] = 255 - img.data[i + 1];
		out.data[i + 2] = 255 - img.data[i + 2];
		out.data[i + 3] = img.data[i + 3];
	}
	return out;
}

export function brightnessContrast(
	img: PixelImage,
	brightness: number,
	contrast: number
): PixelImage {
	const offset = (clamp(brightness, -100, 100) / 100) * 255;
	const c = (clamp(contrast, -100, 100) / 100) * 255;
	const factor = (259 * (c + 255)) / (255 * (259 - c));
	const out = createPixelImage(img.width, img.height);
	for (let i = 0; i < img.data.length; i += 4) {
		for (let ch = 0; ch < 3; ch++) {
			const v = factor * (img.data[i + ch] + offset - 128) + 128;
			out.data[i + ch] = v;
		}
		out.data[i + 3] = img.data[i + 3];
	}
	return out;
}

function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}
