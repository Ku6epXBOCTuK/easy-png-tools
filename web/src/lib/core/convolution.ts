import { clonePixelImage, createPixelImage, type PixelImage } from './types';

type Plane = Float64Array;

export function convolve(
	img: PixelImage,
	kernel: readonly number[],
	size: number
): PixelImage {
	if (!Number.isInteger(size) || size < 1 || size % 2 === 0) {
		throw new Error('Размер ядра должен быть нечётным положительным числом');
	}
	if (kernel.length !== size * size) {
		throw new Error('Длина ядра не совпадает с его размером');
	}
	const half = Math.floor(size / 2);
	const out = createPixelImage(img.width, img.height);
	for (let y = 0; y < out.height; y++) {
		for (let x = 0; x < out.width; x++) {
			for (let ch = 0; ch < 3; ch++) {
				let acc = 0;
				for (let ky = 0; ky < size; ky++) {
					const sy = clampInt(y + ky - half, 0, img.height - 1);
					for (let kx = 0; kx < size; kx++) {
						const sx = clampInt(x + kx - half, 0, img.width - 1);
						acc += img.data[(sy * img.width + sx) * 4 + ch] * kernel[ky * size + kx];
					}
				}
				out.data[(y * out.width + x) * 4 + ch] = acc;
			}
			out.data[(y * out.width + x) * 4 + 3] = img.data[(y * img.width + x) * 4 + 3];
		}
	}
	return out;
}

const SHARPEN_KERNEL = [0, -1, 0, -1, 5, -1, 0, -1, 0];

export function sharpen(img: PixelImage, strengthPercent: number): PixelImage {
	const strength = clamp(strengthPercent, 0, 100) / 100;
	if (strength === 0) return clonePixelImage(img);
	const sharp = convolve(img, SHARPEN_KERNEL, 3);
	const out = createPixelImage(img.width, img.height);
	for (let i = 0; i < out.data.length; i += 4) {
		for (let ch = 0; ch < 3; ch++) {
			out.data[i + ch] =
				img.data[i + ch] * (1 - strength) + sharp.data[i + ch] * strength;
		}
		out.data[i + 3] = img.data[i + 3];
	}
	return out;
}

export function gaussianBlur(img: PixelImage, radiusPx: number): PixelImage {
	const radius = clamp(radiusPx, 0, 512);
	if (radius < 1) return clonePixelImage(img);
	const sigma = Math.max(0.25, radius / 2);
	const boxes = boxesForGauss(sigma, 3);

	const w = img.width;
	const h = img.height;
	const pixels = w * h;

	const red = new Float64Array(pixels);
	const green = new Float64Array(pixels);
	const blue = new Float64Array(pixels);
	const alpha = new Float64Array(pixels);
	for (let i = 0; i < pixels; i++) {
		const a = img.data[i * 4 + 3] / 255;
		red[i] = (img.data[i * 4] / 255) * a;
		green[i] = (img.data[i * 4 + 1] / 255) * a;
		blue[i] = (img.data[i * 4 + 2] / 255) * a;
		alpha[i] = a;
	}

	const tmp = new Float64Array(pixels);
	for (const box of boxes) {
		const r = Math.max(0, (box - 1) / 2);
		if (r < 1) continue;
		blurPlanePass(red, tmp, w, h, r);
		blurPlanePass(green, tmp, w, h, r);
		blurPlanePass(blue, tmp, w, h, r);
		blurPlanePass(alpha, tmp, w, h, r);
	}

	const out = createPixelImage(w, h);
	for (let i = 0; i < pixels; i++) {
		const a = alpha[i];
		const di = i * 4;
		if (a < 1 / 255) {
			out.data[di] = 0;
			out.data[di + 1] = 0;
			out.data[di + 2] = 0;
			out.data[di + 3] = 0;
			continue;
		}
		out.data[di] = (red[i] / a) * 255;
		out.data[di + 1] = (green[i] / a) * 255;
		out.data[di + 2] = (blue[i] / a) * 255;
		out.data[di + 3] = a * 255;
	}
	return out;
}

function blurPlanePass(plane: Plane, tmp: Plane, w: number, h: number, r: number): void {
	blurPlaneHorizontal(plane, tmp, w, h, r);
	blurPlaneVertical(tmp, plane, w, h, r);
}

function blurPlaneHorizontal(
	src: Plane,
	dst: Plane,
	w: number,
	h: number,
	r: number
): void {
	const div = 2 * r + 1;
	const inv = 1 / div;
	for (let y = 0; y < h; y++) {
		const row = y * w;
		let sum = src[row] * (r + 1);
		for (let k = 1; k <= r; k++) {
			sum += src[row + clampInt(k, 0, w - 1)];
		}
		for (let x = 0; x < w; x++) {
			dst[row + x] = sum * inv;
			const addIndex = clampInt(x + r + 1, 0, w - 1);
			const removeIndex = clampInt(x - r, 0, w - 1);
			sum += src[row + addIndex] - src[row + removeIndex];
		}
	}
}

function blurPlaneVertical(
	src: Plane,
	dst: Plane,
	w: number,
	h: number,
	r: number
): void {
	const div = 2 * r + 1;
	const inv = 1 / div;
	for (let x = 0; x < w; x++) {
		let sum = src[x] * (r + 1);
		for (let k = 1; k <= r; k++) {
			sum += src[clampInt(k, 0, h - 1) * w + x];
		}
		for (let y = 0; y < h; y++) {
			dst[y * w + x] = sum * inv;
			const addIndex = clampInt(y + r + 1, 0, h - 1);
			const removeIndex = clampInt(y - r, 0, h - 1);
			sum += src[addIndex * w + x] - src[removeIndex * w + x];
		}
	}
}

function boxesForGauss(sigma: number, boxes: number): number[] {
	const wIdeal = Math.sqrt((12 * sigma * sigma) / boxes + 1);
	let wl = Math.floor(wIdeal);
	if (wl % 2 === 0) wl--;
	const wu = wl + 2;
	const mIdeal = (12 * sigma * sigma - boxes * wl * wl - boxes * wl - boxes) / (4 * wl + 4);
	const m = Math.round(mIdeal);
	const sizes: number[] = [];
	for (let i = 0; i < boxes; i++) {
		sizes.push(i < m ? wl : wu);
	}
	return sizes;
}

function clamp(v: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, v));
}

function clampInt(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, Math.trunc(value)));
}
