import { createPixelImage, type PixelImage } from "./types";
import { ToolError } from "./errors";

const MAX_COLOR_DISTANCE = Math.sqrt(3 * 255 * 255);

export function removeColorToAlpha(
	img: PixelImage,
	hex: string,
	tolerancePercent = 0,
): PixelImage {
	const [targetR, targetG, targetB] = parseHex(hex);
	const tolerance =
		(clamp(tolerancePercent, 0, 100) / 100) * MAX_COLOR_DISTANCE;
	const thresholdSq = tolerance * tolerance;
	const out: PixelImage = {
		width: img.width,
		height: img.height,
		data: img.data.slice(),
	};
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

export function setAlphaChannel(img: PixelImage, percent: number): PixelImage {
	const alpha = Math.round((clamp(percent, 0, 100) / 100) * 255);
	const out: PixelImage = {
		width: img.width,
		height: img.height,
		data: img.data.slice(),
	};
	for (let i = 3; i < out.data.length; i += 4) {
		out.data[i] = alpha;
	}
	return out;
}

export function extractAlphaMask(img: PixelImage): PixelImage {
	const out = createPixelImage(img.width, img.height);
	for (let i = 0; i < out.data.length; i += 4) {
		const v = img.data[i + 3];
		out.data[i] = v;
		out.data[i + 1] = v;
		out.data[i + 2] = v;
		out.data[i + 3] = 255;
	}
	return out;
}

export function roundCorners(
	img: PixelImage,
	radiusPercent: number,
): PixelImage {
	const radius =
		(clamp(radiusPercent, 0, 50) / 100) * (Math.min(img.width, img.height) / 2);
	if (radius < 1)
		return { width: img.width, height: img.height, data: img.data.slice() };
	const out: PixelImage = {
		width: img.width,
		height: img.height,
		data: img.data.slice(),
	};
	const r2 = radius * radius;
	for (let y = 0; y < out.height; y++) {
		for (let x = 0; x < out.width; x++) {
			const cx = clamp(x, radius, out.width - 1 - radius);
			const cy = clamp(y, radius, out.height - 1 - radius);
			const dx = x - cx;
			const dy = y - cy;
			if (dx * dx + dy * dy > r2) {
				out.data[(y * out.width + x) * 4 + 3] = 0;
			}
		}
	}
	return out;
}

export function invertAlpha(img: PixelImage): PixelImage {
	const out = createPixelImage(img.width, img.height);
	for (let i = 0; i < out.data.length; i += 4) {
		out.data[i] = img.data[i];
		out.data[i + 1] = img.data[i + 1];
		out.data[i + 2] = img.data[i + 2];
		out.data[i + 3] = 255 - img.data[i + 3];
	}
	return out;
}

export function hardenAlpha(
	img: PixelImage,
	thresholdPercent: number,
): PixelImage {
	const threshold = (clamp(thresholdPercent, 0, 100) / 100) * 255;
	const out = createPixelImage(img.width, img.height);
	for (let i = 0; i < out.data.length; i += 4) {
		out.data[i] = img.data[i];
		out.data[i + 1] = img.data[i + 1];
		out.data[i + 2] = img.data[i + 2];
		out.data[i + 3] = img.data[i + 3] >= threshold ? 255 : 0;
	}
	return out;
}

export function colorMask(
	img: PixelImage,
	hex: string,
	tolerancePercent = 0,
): PixelImage {
	const [targetR, targetG, targetB] = parseHex(hex);
	const tolerance =
		(clamp(tolerancePercent, 0, 100) / 100) * MAX_COLOR_DISTANCE;
	const thresholdSq = tolerance * tolerance;
	const out = createPixelImage(img.width, img.height);
	for (let i = 0; i < out.data.length; i += 4) {
		const dr = img.data[i] - targetR;
		const dg = img.data[i + 1] - targetG;
		const db = img.data[i + 2] - targetB;
		const matched = dr * dr + dg * dg + db * db <= thresholdSq;
		out.data[i] = matched ? 255 : 0;
		out.data[i + 1] = matched ? 255 : 0;
		out.data[i + 2] = matched ? 255 : 0;
		out.data[i + 3] = 255;
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
		throw new ToolError("errors.badHex", { value: hex });
	}
	const digits = match[1];
	if (digits.length === 3) {
		return [
			parseInt(digits[0] + digits[0], 16),
			parseInt(digits[1] + digits[1], 16),
			parseInt(digits[2] + digits[2], 16),
		];
	}
	return [
		parseInt(digits.slice(0, 2), 16),
		parseInt(digits.slice(2, 4), 16),
		parseInt(digits.slice(4, 6), 16),
	];
}

function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}
