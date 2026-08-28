import { clonePixelImage, createPixelImage, type PixelImage } from "./types";
import { ToolError } from "./errors";

export type RgbChannel = "red" | "green" | "blue";

export type ChannelSwapPair = "r-g" | "r-b" | "g-b";

export function setOpacity(img: PixelImage, percent: number): PixelImage {
	const factor = clamp(percent, 0, 100) / 100;
	const out = createPixelImage(img.width, img.height);
	for (let i = 0; i < out.data.length; i += 4) {
		out.data[i] = img.data[i];
		out.data[i + 1] = img.data[i + 1];
		out.data[i + 2] = img.data[i + 2];
		out.data[i + 3] = img.data[i + 3] * factor;
	}
	return out;
}

export function sepia(img: PixelImage): PixelImage {
	const out = createPixelImage(img.width, img.height);
	for (let i = 0; i < out.data.length; i += 4) {
		const r = img.data[i];
		const g = img.data[i + 1];
		const b = img.data[i + 2];
		out.data[i] = Math.min(255, 0.393 * r + 0.769 * g + 0.189 * b);
		out.data[i + 1] = Math.min(255, 0.349 * r + 0.686 * g + 0.168 * b);
		out.data[i + 2] = Math.min(255, 0.272 * r + 0.534 * g + 0.131 * b);
		out.data[i + 3] = img.data[i + 3];
	}
	return out;
}

export function changeHue(img: PixelImage, degrees: number): PixelImage {
	const shift = (((Math.round(degrees) % 360) + 360) % 360) / 360;
	if (shift === 0) return clonePixelImage(img);
	const out = createPixelImage(img.width, img.height);
	for (let i = 0; i < out.data.length; i += 4) {
		const rf = img.data[i] / 255;
		const gf = img.data[i + 1] / 255;
		const bf = img.data[i + 2] / 255;
		const max = Math.max(rf, gf, bf);
		const min = Math.min(rf, gf, bf);
		const l = (max + min) / 2;
		let h = 0;
		let s = 0;
		if (max !== min) {
			const d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			if (max === rf) h = (gf - bf) / d + (gf < bf ? 6 : 0);
			else if (max === gf) h = (bf - rf) / d + 2;
			else h = (rf - gf) / d + 4;
			h /= 6;
		}
		h = (h + shift) % 1;
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		out.data[i] = hueComponent(p, q, h + 1 / 3) * 255;
		out.data[i + 1] = hueComponent(p, q, h) * 255;
		out.data[i + 2] = hueComponent(p, q, h - 1 / 3) * 255;
		out.data[i + 3] = img.data[i + 3];
	}
	return out;
}

function hueComponent(p: number, q: number, t: number): number {
	if (t < 0) t += 1;
	if (t > 1) t -= 1;
	if (t < 1 / 6) return p + (q - p) * 6 * t;
	if (t < 1 / 2) return q;
	if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
	return p;
}

const CHANNEL_INDEX: Record<RgbChannel, number> = { red: 0, green: 1, blue: 2 };

export function extractChannel(
	img: PixelImage,
	channel: RgbChannel,
): PixelImage {
	const index = CHANNEL_INDEX[channel];
	const out = createPixelImage(img.width, img.height);
	for (let i = 0; i < out.data.length; i += 4) {
		const v = img.data[i + index];
		out.data[i] = v;
		out.data[i + 1] = v;
		out.data[i + 2] = v;
		out.data[i + 3] = img.data[i + 3];
	}
	return out;
}

const SWAP_INDEX: Record<ChannelSwapPair, [number, number]> = {
	"r-g": [0, 1],
	"r-b": [0, 2],
	"g-b": [1, 2],
};

export function swapChannels(
	img: PixelImage,
	pair: ChannelSwapPair,
): PixelImage {
	const [a, b] = SWAP_INDEX[pair];
	const out = createPixelImage(img.width, img.height);
	for (let i = 0; i < out.data.length; i += 4) {
		out.data[i] = img.data[i];
		out.data[i + 1] = img.data[i + 1];
		out.data[i + 2] = img.data[i + 2];
		out.data[i + 3] = img.data[i + 3];
		const tmp = out.data[i + a];
		out.data[i + a] = out.data[i + b];
		out.data[i + b] = tmp;
	}
	return out;
}

export function thresholdBlackWhite(
	img: PixelImage,
	thresholdPercent: number,
): PixelImage {
	const threshold = (clamp(thresholdPercent, 0, 100) / 100) * 255;
	const out = createPixelImage(img.width, img.height);
	for (let i = 0; i < out.data.length; i += 4) {
		const luma =
			0.299 * img.data[i] + 0.587 * img.data[i + 1] + 0.114 * img.data[i + 2];
		const v = luma >= threshold ? 255 : 0;
		out.data[i] = v;
		out.data[i + 1] = v;
		out.data[i + 2] = v;
		out.data[i + 3] = img.data[i + 3];
	}
	return out;
}

export function posterize(img: PixelImage, levels: number): PixelImage {
	const n = clamp(Math.round(levels), 2, 256);
	const stepSize = 255 / (n - 1);
	const out = createPixelImage(img.width, img.height);
	for (let i = 0; i < out.data.length; i += 4) {
		for (let ch = 0; ch < 3; ch++) {
			out.data[i + ch] = Math.round(
				Math.round(img.data[i + ch] / stepSize) * stepSize,
			);
		}
		out.data[i + 3] = img.data[i + 3];
	}
	return out;
}

export function twoColors(
	img: PixelImage,
	lightHex: string,
	darkHex: string,
	thresholdPercent: number,
): PixelImage {
	const [lr, lg, lb] = parseColor(lightHex);
	const [dr, dg, db] = parseColor(darkHex);
	const threshold = (clamp(thresholdPercent, 0, 100) / 100) * 255;
	const out = createPixelImage(img.width, img.height);
	for (let i = 0; i < out.data.length; i += 4) {
		const luma =
			0.299 * img.data[i] + 0.587 * img.data[i + 1] + 0.114 * img.data[i + 2];
		if (luma >= threshold) {
			out.data[i] = lr;
			out.data[i + 1] = lg;
			out.data[i + 2] = lb;
		} else {
			out.data[i] = dr;
			out.data[i + 1] = dg;
			out.data[i + 2] = db;
		}
		out.data[i + 3] = img.data[i + 3];
	}
	return out;
}

function parseColor(hex: string): [number, number, number] {
	const match = /^#([0-9a-f]{6})$/i.exec(hex.trim());
	if (!match) {
		throw new ToolError("errors.badHex", { value: hex });
	}
	const digits = match[1];
	return [
		parseInt(digits.slice(0, 2), 16),
		parseInt(digits.slice(2, 4), 16),
		parseInt(digits.slice(4, 6), 16),
	];
}

export function grayscale(img: PixelImage): PixelImage {
	const out = createPixelImage(img.width, img.height);
	for (let i = 0; i < img.data.length; i += 4) {
		const luma =
			0.299 * img.data[i] + 0.587 * img.data[i + 1] + 0.114 * img.data[i + 2];
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
	contrast: number,
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

export function rgbToHex(r: number, g: number, b: number): string {
	const byte = (v: number) =>
		clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0");
	return `#${byte(r)}${byte(g)}${byte(b)}`;
}

function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

export function gammaCorrection(img: PixelImage, value: number): PixelImage {
	const g = clamp(value, 0.1, 5);
	const lut = new Uint8ClampedArray(256);
	for (let v = 0; v < 256; v++) {
		lut[v] = 255 * Math.pow(v / 255, 1 / g);
	}
	const out = createPixelImage(img.width, img.height);
	for (let i = 0; i < out.data.length; i += 4) {
		out.data[i] = lut[img.data[i]];
		out.data[i + 1] = lut[img.data[i + 1]];
		out.data[i + 2] = lut[img.data[i + 2]];
		out.data[i + 3] = img.data[i + 3];
	}
	return out;
}

export function autoContrast(img: PixelImage): PixelImage {
	const lo = [255, 255, 255];
	const hi = [0, 0, 0];
	for (let i = 0; i < img.data.length; i += 4) {
		for (let ch = 0; ch < 3; ch++) {
			if (img.data[i + ch] < lo[ch]) lo[ch] = img.data[i + ch];
			if (img.data[i + ch] > hi[ch]) hi[ch] = img.data[i + ch];
		}
	}
	const luts: Uint8ClampedArray[] = [];
	for (let ch = 0; ch < 3; ch++) {
		const lut = new Uint8ClampedArray(256);
		const range = hi[ch] - lo[ch];
		for (let v = 0; v < 256; v++) {
			lut[v] = range > 0 ? ((v - lo[ch]) * 255) / range : v;
		}
		luts.push(lut);
	}
	const out = createPixelImage(img.width, img.height);
	for (let i = 0; i < out.data.length; i += 4) {
		out.data[i] = luts[0][img.data[i]];
		out.data[i + 1] = luts[1][img.data[i + 1]];
		out.data[i + 2] = luts[2][img.data[i + 2]];
		out.data[i + 3] = img.data[i + 3];
	}
	return out;
}

export function temperature(img: PixelImage, percent: number): PixelImage {
	const k = clamp(percent, -100, 100) / 100;
	const rFactor = 1 + 0.25 * k;
	const bFactor = 1 - 0.25 * k;
	const out = createPixelImage(img.width, img.height);
	for (let i = 0; i < out.data.length; i += 4) {
		out.data[i] = img.data[i] * rFactor;
		out.data[i + 1] = img.data[i + 1];
		out.data[i + 2] = img.data[i + 2] * bFactor;
		out.data[i + 3] = img.data[i + 3];
	}
	return out;
}

export function tint(
	img: PixelImage,
	colorHex: string,
	strengthPercent: number,
): PixelImage {
	const s = clamp(strengthPercent, 0, 100) / 100;
	const match = /^#([0-9a-f]{6})$/i.exec(colorHex.trim());
	if (!match) throw new ToolError("errors.badHex", { value: colorHex });
	const d = match[1];
	const tr = parseInt(d.slice(0, 2), 16) / 255;
	const tg = parseInt(d.slice(2, 4), 16) / 255;
	const tb = parseInt(d.slice(4, 6), 16) / 255;
	const factors = [1 + (tr - 1) * s, 1 + (tg - 1) * s, 1 + (tb - 1) * s];
	const out = createPixelImage(img.width, img.height);
	for (let i = 0; i < out.data.length; i += 4) {
		for (let ch = 0; ch < 3; ch++) {
			out.data[i + ch] = img.data[i + ch] * factors[ch];
		}
		out.data[i + 3] = img.data[i + 3];
	}
	return out;
}
