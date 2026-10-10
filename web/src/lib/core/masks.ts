import { parseHexColor } from "./palette";
import type { PixelImage } from "./types";
import { createPixelImage } from "./types";

export type MaskMode = "binary" | "highlight";

export interface MaskOptions {
	/** binary: white/black without alpha; highlight: tint matching pixels. */
	mode?: MaskMode;
	color?: string;
	opacityPercent?: number;
}

/**
 * Unified mask renderer: the predicate decides whether a pixel matches;
 * the mode defines the look of the result.
 */
export function renderPredicateMask(
	img: PixelImage,
	predicate: (r: number, g: number, b: number, a: number) => boolean,
	o: MaskOptions = {},
): PixelImage {
	const out = createPixelImage(img.width, img.height);
	const highlight = o.mode !== "binary";
	const tint = o.color ? parseHexColor(o.color) : { r: 255, g: 0, b: 170 };
	const opacity = Math.min(Math.max(o.opacityPercent ?? 70, 0), 100) / 100;
	if (!highlight) {
		// Binary mask: opaque white-on-black
		for (let a = 3; a < out.data.length; a += 4) out.data[a] = 255;
	}
	for (let i = 0; i < img.data.length; i += 4) {
		const r = img.data[i];
		const g = img.data[i + 1];
		const b = img.data[i + 2];
		const a = img.data[i + 3];
		if (!predicate(r, g, b, a)) {
			if (highlight && o.mode === "highlight") {
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

function maxChannelDelta(
	r1: number,
	g1: number,
	b1: number,
	r2: number,
	g2: number,
	b2: number,
): number {
	return Math.max(Math.abs(r1 - r2), Math.abs(g1 - g2), Math.abs(b1 - b2));
}

export function isGrayscaleish(
	r: number,
	g: number,
	b: number,
	tolerance: number,
): boolean {
	return (
		Math.abs(r - g) <= tolerance &&
		Math.abs(g - b) <= tolerance &&
		Math.abs(r - b) <= tolerance
	);
}

export function luma01(r: number, g: number, b: number): number {
	return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/**
 * Keeps pixels close to the target color, makes the rest transparent.
 * Tolerance is a percentage of the max per-channel delta (255).
 */
export function extractByColor(
	img: PixelImage,
	targetHex: string,
	tolerancePercent: number,
): PixelImage {
	const out = createPixelImage(img.width, img.height);
	const t = parseHexColor(targetHex);
	const tol = (Math.min(Math.max(tolerancePercent, 0), 100) / 100) * 255;
	for (let i = 0; i < img.data.length; i += 4) {
		if (
			maxChannelDelta(
				img.data[i],
				img.data[i + 1],
				img.data[i + 2],
				t.r,
				t.g,
				t.b,
			) <= tol
		) {
			out.data[i] = img.data[i];
			out.data[i + 1] = img.data[i + 1];
			out.data[i + 2] = img.data[i + 2];
			out.data[i + 3] = img.data[i + 3];
		}
	}
	return out;
}

/**
 * Pixels that differ between before/after become white, the rest black.
 * Size mismatch (crop/trim) means everything changed: all white.
 */
export function diffMask(before: PixelImage, after: PixelImage): PixelImage {
	const out = createPixelImage(before.width, before.height);
	const sameSize =
		before.width === after.width && before.height === after.height;
	for (let i = 0; i < out.data.length; i += 4) {
		const changed =
			!sameSize ||
			before.data[i] !== after.data[i] ||
			before.data[i + 1] !== after.data[i + 1] ||
			before.data[i + 2] !== after.data[i + 2] ||
			before.data[i + 3] !== after.data[i + 3];
		const v = changed ? 255 : 0;
		out.data[i] = v;
		out.data[i + 1] = v;
		out.data[i + 2] = v;
		out.data[i + 3] = 255;
	}
	return out;
}

/**
 * Counts color frequencies and returns a predicate "occurs at most limit times".
 */
export function rarityPredicate(
	img: PixelImage,
	limit: number,
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
