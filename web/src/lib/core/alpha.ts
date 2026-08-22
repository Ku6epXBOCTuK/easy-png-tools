import { createPixelImage, type PixelImage } from './types';

const MAX_COLOR_DISTANCE = Math.sqrt(3 * 255 * 255);

export function removeColorToAlpha(
	img: PixelImage,
	hex: string,
	tolerancePercent = 0
): PixelImage {
	const [targetR, targetG, targetB] = parseHex(hex);
	const tolerance = (clamp(tolerancePercent, 0, 100) / 100) * MAX_COLOR_DISTANCE;
	const thresholdSq = tolerance * tolerance;
	const out: PixelImage = { width: img.width, height: img.height, data: img.data.slice() };
	for (let i = 0; i < out.data.length; i += 4) {
		const dr = out.data[i] - targetR;
		const dg = out.data[i + 1] - targetG;
		const db = out.data[i + 2] - targetB;
		if (dr * dr + dg * dg + db * db <= thresholdSq) {
			out.data[i + 3] = 0;
		}
	}
	return out;
}

export function flattenOntoColor(img: PixelImage, hex: string): PixelImage {
	const [bgR, bgG, bgB] = parseHex(hex);
	const out = createPixelImage(img.width, img.height);
	for (let i = 0; i < out.data.length; i += 4) {
		const a = img.data[i + 3] / 255;
		const inv = 1 - a;
		out.data[i] = img.data[i] * a + bgR * inv;
		out.data[i + 1] = img.data[i + 1] * a + bgG * inv;
		out.data[i + 2] = img.data[i + 2] * a + bgB * inv;
		out.data[i + 3] = 255;
	}
	return out;
}

export function parseHex(hex: string): [number, number, number] {
	const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
	if (!match) {
		throw new Error(`Некорректный HEX-цвет: "${hex}"`);
	}
	const digits = match[1];
	if (digits.length === 3) {
		return [
			parseInt(digits[0] + digits[0], 16),
			parseInt(digits[1] + digits[1], 16),
			parseInt(digits[2] + digits[2], 16)
		];
	}
	return [
		parseInt(digits.slice(0, 2), 16),
		parseInt(digits.slice(2, 4), 16),
		parseInt(digits.slice(4, 6), 16)
	];
}

function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}
