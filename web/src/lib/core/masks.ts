import { hexToRgb } from './palette';
import type { PixelImage } from './types';
import { createPixelImage } from './types';

export type MaskMode = 'binary' | 'highlight';

export interface MaskOptions {
	/** binary: белое/чёрное без альфы; highlight: подкрасить совпавшие пиксели цветом. */
	mode?: MaskMode;
	color?: string;
	opacityPercent?: number;
}

/**
 * Единый рендер масок: предикат решает, совпал ли пиксель;
 * режим определяет вид результата.
 */
export function renderPredicateMask(
	img: PixelImage,
	predicate: (r: number, g: number, b: number, a: number) => boolean,
	o: MaskOptions = {}
): PixelImage {
	const out = createPixelImage(img.width, img.height);
	const highlight = o.mode !== 'binary';
	const tint = o.color ? hexToRgb(o.color) : { r: 255, g: 0, b: 170 };
	const opacity = Math.min(Math.max(o.opacityPercent ?? 70, 0), 100) / 100;
	if (!highlight) {
		// Бинарная маска — непрозрачное белое-на-чёрном
		for (let a = 3; a < out.data.length; a += 4) out.data[a] = 255;
	}
	for (let i = 0; i < img.data.length; i += 4) {
		const r = img.data[i];
		const g = img.data[i + 1];
		const b = img.data[i + 2];
		const a = img.data[i + 3];
		if (!predicate(r, g, b, a)) {
			if (highlight && o.mode === 'highlight') {
				out.data[i] = r;
				out.data[i + 1] = g;
				out.data[i + 2] = b;
				out.data[i + 3] = a;
			}
			continue;
		}
		if (!highlight) {
			out.data[i] = 255;
			out.data[i + 1] = 255;
			out.data[i + 2] = 255;
			out.data[i + 3] = 255;
			continue;
		}
		out.data[i] = Math.round(r * (1 - opacity) + tint.r * opacity);
		out.data[i + 1] = Math.round(g * (1 - opacity) + tint.g * opacity);
		out.data[i + 2] = Math.round(b * (1 - opacity) + tint.b * opacity);
		out.data[i + 3] = a;
	}
	return out;
}

function maxChannelDelta(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
	return Math.max(Math.abs(r1 - r2), Math.abs(g1 - g2), Math.abs(b1 - b2));
}

export function isGrayscaleish(r: number, g: number, b: number, tolerance: number): boolean {
	return (
		Math.abs(r - g) <= tolerance && Math.abs(g - b) <= tolerance && Math.abs(r - b) <= tolerance
	);
}

export function luma01(r: number, g: number, b: number): number {
	return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/**
 * Оставляет пиксели, близкие к целевому цвету, остальное делает прозрачным.
 * Допуск — в процентах от максимального поканального разброса (255).
 */
export function extractByColor(
	img: PixelImage,
	targetHex: string,
	tolerancePercent: number
): PixelImage {
	const out = createPixelImage(img.width, img.height);
	const t = hexToRgb(targetHex);
	const tol = (Math.min(Math.max(tolerancePercent, 0), 100) / 100) * 255;
	for (let i = 0; i < img.data.length; i += 4) {
		if (maxChannelDelta(img.data[i], img.data[i + 1], img.data[i + 2], t.r, t.g, t.b) <= tol) {
			out.data[i] = img.data[i];
			out.data[i + 1] = img.data[i + 1];
			out.data[i + 2] = img.data[i + 2];
			out.data[i + 3] = img.data[i + 3];
		}
	}
	return out;
}

/**
 * Считает частоты цветов и возвращает предикат «встречается не чаще limit раз».
 */
export function rarityPredicate(
	img: PixelImage,
	limit: number
): (r: number, g: number, b: number, a: number) => boolean {
	const counts = new Map<number, number>();
	for (let i = 0; i < img.data.length; i += 4) {
		const key = (img.data[i] << 16) | (img.data[i + 1] << 8) | img.data[i + 2];
		counts.set(key, (counts.get(key) ?? 0) + 1);
	}
	return (r, g, b) => {
		const key = (r << 16) | (g << 8) | b;
		return (counts.get(key) ?? 0) <= limit;
	};
}

