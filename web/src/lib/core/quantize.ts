import type { PixelImage } from "./types";
import { createPixelImage } from "./types";
import { rgbToHex } from "./palette";
import { hexToRgb } from "./palette";

type Rgb = { r: number; g: number; b: number };

function dist2(a: Rgb, b: Rgb): number {
	const dr = a.r - b.r;
	const dg = a.g - b.g;
	const db = a.b - b.b;
	return dr * dr + dg * dg + db * db;
}

function nearestIndex(palette: Rgb[], r: number, g: number, b: number): number {
	let best = 0;
	let bestDist = Infinity;
	for (let i = 0; i < palette.length; i++) {
		const d = dist2(palette[i], { r, g, b });
		if (d < bestDist) {
			bestDist = d;
			best = i;
		}
	}
	return best;
}

/** Median-cut: делит корзину с наибольшим разбросом по самому широкому каналу до k корзин. */
export function medianCutPalette(img: PixelImage, k: number): Rgb[] {
	const maxColors = Math.max(2, Math.min(64, Math.round(k)));
	const pixels: Rgb[] = [];
	const total = img.width * img.height;
	const step = Math.max(1, Math.floor(total / 32000));
	for (let p = 0; p < total; p += step) {
		const i = p * 4;
		if (img.data[i + 3] === 0) continue;
		pixels.push({ r: img.data[i], g: img.data[i + 1], b: img.data[i + 2] });
	}
	if (pixels.length === 0) return [{ r: 0, g: 0, b: 0 }];

	type Bucket = { px: Rgb[]; min: Rgb; max: Rgb };
	const makeBucket = (list: Rgb[]): Bucket => {
		const min = { r: 255, g: 255, b: 255 };
		const max = { r: 0, g: 0, b: 0 };
		for (const c of list) {
			if (c.r < min.r) min.r = c.r;
			if (c.g < min.g) min.g = c.g;
			if (c.b < min.b) min.b = c.b;
			if (c.r > max.r) max.r = c.r;
			if (c.g > max.g) max.g = c.g;
			if (c.b > max.b) max.b = c.b;
		}
		return { px: list, min, max };
	};

	let buckets: Bucket[] = [makeBucket(pixels)];
	while (buckets.length < maxColors) {
		let targetIdx = -1;
		let targetScore = -1;
		buckets.forEach((bucket, idx) => {
			if (bucket.px.length < 2) return;
			const score =
				(bucket.max.r - bucket.min.r) *
				(bucket.max.g - bucket.min.g) *
				(bucket.max.b - bucket.min.b) *
				bucket.px.length;
			if (score > targetScore) {
				targetScore = score;
				targetIdx = idx;
			}
		});
		if (targetIdx < 0 || targetScore <= 0) break;

		const bucket = buckets[targetIdx];
		const ranges = [
			{ ch: "r" as const, range: bucket.max.r - bucket.min.r },
			{ ch: "g" as const, range: bucket.max.g - bucket.min.g },
			{ ch: "b" as const, range: bucket.max.b - bucket.min.b },
		].sort((a, b) => b.range - a.range);
		const widest = ranges[0].ch;
		bucket.px.sort((a, b) => a[widest] - b[widest]);
		const mid = Math.floor(bucket.px.length / 2);
		buckets = [
			...buckets.slice(0, targetIdx),
			makeBucket(bucket.px.slice(0, mid)),
			makeBucket(bucket.px.slice(mid)),
			...buckets.slice(targetIdx + 1),
		];
	}

	return buckets
		.filter((b) => b.px.length > 0)
		.map((b) => ({
			r: Math.round(b.px.reduce((s, c) => s + c.r, 0) / b.px.length),
			g: Math.round(b.px.reduce((s, c) => s + c.g, 0) / b.px.length),
			b: Math.round(b.px.reduce((s, c) => s + c.b, 0) / b.px.length),
		}));
}

export interface QuantizeResult {
	image: PixelImage;
	palette: string[];
}

/** Приводит изображение к k цветам: median-cut + ближайший цвет палитры. Прозрачные пиксели не трогаются. */
export function quantizeImage(img: PixelImage, k: number): QuantizeResult {
	const palette = medianCutPalette(img, k);
	const out = createPixelImage(img.width, img.height);
	for (let i = 0; i < img.data.length; i += 4) {
		out.data[i + 3] = img.data[i + 3];
		if (img.data[i + 3] === 0) continue;
		const chosen = nearestIndex(
			palette,
			img.data[i],
			img.data[i + 1],
			img.data[i + 2],
		);
		out.data[i] = palette[chosen].r;
		out.data[i + 1] = palette[chosen].g;
		out.data[i + 2] = palette[chosen].b;
	}
	return { image: out, palette: palette.map(rgbToHex) };
}

/** Маппинг каждого пикселя на ближайший цвет пользовательского списка. */
export function mapToNearest(
	img: PixelImage,
	paletteHexes: string[],
): PixelImage {
	const palette = paletteHexes.map(hexToRgb);
	const out = createPixelImage(img.width, img.height);
	for (let i = 0; i < img.data.length; i += 4) {
		out.data[i + 3] = img.data[i + 3];
		if (img.data[i + 3] === 0) continue;
		const chosen = nearestIndex(
			palette,
			img.data[i],
			img.data[i + 1],
			img.data[i + 2],
		);
		out.data[i] = palette[chosen].r;
		out.data[i + 1] = palette[chosen].g;
		out.data[i + 2] = palette[chosen].b;
	}
	return out;
}

const BAYER_4 = [
	[0, 8, 2, 10],
	[12, 4, 14, 6],
	[3, 11, 1, 9],
	[15, 7, 13, 5],
];

export type DitherPattern = "floyd-steinberg" | "bayer";

/**
 * Дизеринг к палитре из k цветов (median-cut) или к явно заданному списку hex.
 * floyd-steinberg — распространение ошибки; bayer — упорядоченный 4×4.
 */
export function ditherImage(
	img: PixelImage,
	k: number,
	pattern: DitherPattern,
	forcedPaletteHexes?: string[],
): PixelImage {
	const palette = forcedPaletteHexes
		? forcedPaletteHexes.map(hexToRgb)
		: medianCutPalette(img, k);
	const total = img.width * img.height;
	const buf = new Float32Array(total * 3);
	for (let p = 0; p < total; p++) {
		buf[p * 3] = img.data[p * 4];
		buf[p * 3 + 1] = img.data[p * 4 + 1];
		buf[p * 3 + 2] = img.data[p * 4 + 2];
	}

	const spread = 255 / Math.cbrt(Math.max(2, palette.length));
	const out = createPixelImage(img.width, img.height);

	for (let y = 0; y < img.height; y++) {
		for (let x = 0; x < img.width; x++) {
			const p = y * img.width + x;
			const di = p * 4;
			const alpha = img.data[di + 3];
			out.data[di + 3] = alpha;
			if (alpha === 0) continue;

			let r = buf[p * 3];
			let g = buf[p * 3 + 1];
			let b = buf[p * 3 + 2];

			if (pattern === "bayer") {
				const offset = ((BAYER_4[y % 4][x % 4] + 0.5) / 16 - 0.5) * spread;
				r += offset;
				g += offset;
				b += offset;
			}

			const chosen = nearestIndex(palette, r, g, b);
			out.data[di] = palette[chosen].r;
			out.data[di + 1] = palette[chosen].g;
			out.data[di + 2] = palette[chosen].b;

			if (pattern !== "floyd-steinberg") continue;
			const er = r - palette[chosen].r;
			const eg = g - palette[chosen].g;
			const eb = b - palette[chosen].b;
			const push = (nx: number, ny: number, factor: number) => {
				if (nx < 0 || ny < 0 || nx >= img.width || ny >= img.height) return;
				const np = ny * img.width + nx;
				buf[np * 3] += er * factor;
				buf[np * 3 + 1] += eg * factor;
				buf[np * 3 + 2] += eb * factor;
			};
			push(x + 1, y, 7 / 16);
			push(x - 1, y + 1, 3 / 16);
			push(x, y + 1, 5 / 16);
			push(x + 1, y + 1, 1 / 16);
		}
	}
	return out;
}
