import { hexToRgb } from "./palette";
import type { PixelImage } from "./types";
import { createPixelImage } from "./types";
import { gaussianBlur } from "./convolution";

/** Детерминированный ГПСЧ (mulberry32): одинаковый seed — одинаковый результат. */
export function mulberry32(seed: number): () => number {
	let a = seed >>> 0;
	return () => {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function clampByte(v: number): number {
	return v < 0 ? 0 : v > 255 ? 255 : Math.round(v);
}

/** Усреднение каждого блока blockSize×BlockSize в его верхний-левый пиксель цвета. */
export function pixelate(img: PixelImage, blockSize: number): PixelImage {
	const bs = Math.max(1, Math.round(blockSize));
	const out = createPixelImage(img.width, img.height);
	for (let by = 0; by < img.height; by += bs) {
		for (let bx = 0; bx < img.width; bx += bs) {
			let r = 0;
			let g = 0;
			let b = 0;
			let n = 0;
			const yMax = Math.min(by + bs, img.height);
			const xMax = Math.min(bx + bs, img.width);
			for (let y = by; y < yMax; y++) {
				for (let x = bx; x < xMax; x++) {
					const i = (y * img.width + x) * 4;
					r += img.data[i];
					g += img.data[i + 1];
					b += img.data[i + 2];
					n++;
				}
			}
			if (n === 0) continue;
			r /= n;
			g /= n;
			b /= n;
			for (let y = by; y < yMax; y++) {
				for (let x = bx; x < xMax; x++) {
					const i = (y * img.width + x) * 4;
					out.data[i] = r;
					out.data[i + 1] = g;
					out.data[i + 2] = b;
					out.data[i + 3] = img.data[i + 3];
				}
			}
		}
	}
	return out;
}

/** Перемешивает блоки blockSize×Blocksize между собой детерминированно по seed. */
export function shuffleBlocks(
	img: PixelImage,
	blockSize: number,
	seed: number,
): PixelImage {
	const bs = Math.max(1, Math.round(blockSize));
	const cols = Math.ceil(img.width / bs);
	const rows = Math.ceil(img.height / bs);
	const total = cols * rows;

	const rng = mulberry32(seed);
	const order = Array.from({ length: total }, (_, i) => i);
	for (let i = total - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		[order[i], order[j]] = [order[j], order[i]];
	}

	const out = createPixelImage(img.width, img.height);
	for (let i = 0; i < total; i++) {
		const src = order[i];
		const sx = (i % cols) * bs;
		const sy = Math.floor(i / cols) * bs;
		const dx = (src % cols) * bs;
		const dy = Math.floor(src / cols) * bs;
		for (let yy = 0; yy < bs; yy++) {
			for (let xx = 0; xx < bs; xx++) {
				if (sy + yy >= img.height || sx + xx >= img.width) continue;
				if (dy + yy >= img.height || dx + xx >= img.width) continue;
				const si = ((sy + yy) * img.width + sx + xx) * 4;
				const di = ((dy + yy) * img.width + dx + xx) * 4;
				for (let ch = 0; ch < 4; ch++) out.data[di + ch] = img.data[si + ch];
			}
		}
	}
	return out;
}

export type NoiseMode = "mono" | "color";

/** Зерно: amountPercent — сила отклонения от оригинала. Детерминировано по seed. */
export function addNoise(
	img: PixelImage,
	amountPercent: number,
	mode: NoiseMode,
	seed: number,
): PixelImage {
	const out = createPixelImage(img.width, img.height);
	const amount = Math.min(Math.max(amountPercent, 0), 100) / 100;
	const rng = mulberry32(seed);
	for (let i = 0; i < img.data.length; i += 4) {
		const shift = (rng() * 2 - 1) * amount * 255;
		if (mode === "mono") {
			out.data[i] = clampByte(img.data[i] + shift);
			out.data[i + 1] = clampByte(img.data[i + 1] + shift);
			out.data[i + 2] = clampByte(img.data[i + 2] + shift);
		} else {
			out.data[i] = clampByte(img.data[i] + (rng() * 2 - 1) * amount * 255);
			out.data[i + 1] = clampByte(
				img.data[i + 1] + (rng() * 2 - 1) * amount * 255,
			);
			out.data[i + 2] = clampByte(
				img.data[i + 2] + (rng() * 2 - 1) * amount * 255,
			);
		}
		out.data[i + 3] = img.data[i + 3];
	}
	return out;
}

/** Размытие только альфа-канала: мягкие края при неизменном цвете. */
export function featherAlpha(img: PixelImage, radius: number): PixelImage {
	const gray = createPixelImage(img.width, img.height);
	for (let i = 0; i < img.data.length; i += 4) {
		gray.data[i] = img.data[i + 3];
		gray.data[i + 1] = img.data[i + 3];
		gray.data[i + 2] = img.data[i + 3];
		gray.data[i + 3] = 255;
	}
	const blurred = gaussianBlur(gray, radius);
	const out = createPixelImage(img.width, img.height);
	for (let i = 0; i < img.data.length; i += 4) {
		out.data[i] = img.data[i];
		out.data[i + 1] = img.data[i + 1];
		out.data[i + 2] = img.data[i + 2];
		out.data[i + 3] = blurred.data[i];
	}
	return out;
}

/**
 * Убирает цветную кайму на полупрозрачных краях: RGB полупрозрачного пикселя
 * заменяется цветом ближайшего полностью непрозрачного соседа в пределах radius.
 */
export function defringe(img: PixelImage, radius: number): PixelImage {
	const out = createPixelImage(img.width, img.height);
	out.data.set(img.data);
	const rad = Math.max(1, Math.round(radius));
	for (let y = 0; y < img.height; y++) {
		for (let x = 0; x < img.width; x++) {
			const di = (y * img.width + x) * 4;
			const a = img.data[di + 3];
			if (a === 0 || a === 255) continue;
			let found = false;
			for (let ry = 1; ry <= rad && !found; ry++) {
				for (let dy = -ry; dy <= ry && !found; dy++) {
					for (let dx = -ry; dx <= ry && !found; dx++) {
						if (Math.max(Math.abs(dx), Math.abs(dy)) !== ry) continue;
						const nx = x + dx;
						const ny = y + dy;
						if (nx < 0 || ny < 0 || nx >= img.width || ny >= img.height)
							continue;
						const si = (ny * img.width + nx) * 4;
						if (img.data[si + 3] !== 255) continue;
						out.data[di] = img.data[si];
						out.data[di + 1] = img.data[si + 1];
						out.data[di + 2] = img.data[si + 2];
						found = true;
					}
				}
			}
		}
	}
	return out;
}

/** Силуэт: все видимые пиксели заливаются одним цветом, альфа сохраняется. */
export function silhouette(
	img: PixelImage,
	colorHex: string,
	alphaThreshold: number,
): PixelImage {
	const out = createPixelImage(img.width, img.height);
	const { r, g, b } = hexToRgb(colorHex);
	for (let i = 0; i < img.data.length; i += 4) {
		if (img.data[i + 3] <= alphaThreshold) continue;
		out.data[i] = r;
		out.data[i + 1] = g;
		out.data[i + 2] = b;
		out.data[i + 3] = img.data[i + 3];
	}
	return out;
}
