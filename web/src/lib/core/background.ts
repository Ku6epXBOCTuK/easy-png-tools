import { parseHex } from './alpha';
import { createPixelImage, type PixelImage } from './types';

export type BackgroundOptions = {
	color: string;
	tolerancePercent: number;
	outerOnly: boolean;
	smoothPasses: number;
};

function buildRawMask(
	img: PixelImage,
	targetR: number,
	targetG: number,
	targetB: number,
	tolerancePercent: number
): Uint8Array {
	const tolerance = (clamp(tolerancePercent, 0, 100) / 100) * Math.sqrt(3 * 255 * 255);
	const thresholdSq = tolerance * tolerance;
	const mask = new Uint8Array(img.width * img.height);
	for (let i = 0; i < mask.length; i++) {
		const dr = img.data[i * 4] - targetR;
		const dg = img.data[i * 4 + 1] - targetG;
		const db = img.data[i * 4 + 2] - targetB;
		mask[i] = dr * dr + dg * dg + db * db <= thresholdSq ? 1 : 0;
	}
	return mask;
}

function floodFromBorders(mask: Uint8Array, w: number, h: number): void {
	const queue: number[] = [];
	const push = (index: number) => {
		if (mask[index] === 1) {
			mask[index] = 2;
			queue.push(index);
		}
	};
	for (let x = 0; x < w; x++) {
		push(x);
		push((h - 1) * w + x);
	}
	for (let y = 0; y < h; y++) {
		push(y * w);
		push(y * w + w - 1);
	}
	let head = 0;
	while (head < queue.length) {
		const index = queue[head++];
		const x = index % w;
		if (x > 0) push(index - 1);
		if (x < w - 1) push(index + 1);
		if (index >= w) push(index - w);
		if (index < (h - 1) * w) push(index + w);
	}
	for (let i = 0; i < mask.length; i++) {
		mask[i] = mask[i] === 2 ? 1 : 0;
	}
}

export function smoothMask(
	mask: Uint8Array,
	w: number,
	h: number,
	passes: number
): Uint8Array {
	let current = mask;
	const count = clamp(Math.trunc(passes), 0, 8);
	for (let pass = 0; pass < count; pass++) {
		const next = new Uint8Array(current.length);
		for (let y = 0; y < h; y++) {
			for (let x = 0; x < w; x++) {
				let removed = 0;
				let total = 0;
				for (let dy = -1; dy <= 1; dy++) {
					const sy = clamp(y + dy, 0, h - 1);
					for (let dx = -1; dx <= 1; dx++) {
						const sx = clamp(x + dx, 0, w - 1);
						removed += current[sy * w + sx];
						total++;
					}
				}
				next[y * w + x] = removed * 2 >= total ? 1 : 0;
			}
		}
		current = next;
	}
	return current;
}

export function backgroundRemovalMask(
	img: PixelImage,
	options: BackgroundOptions
): Uint8Array {
	const [tr, tg, tb] = parseHex(options.color);
	const mask = buildRawMask(img, tr, tg, tb, options.tolerancePercent);
	if (options.outerOnly) {
		floodFromBorders(mask, img.width, img.height);
	}
	return smoothMask(mask, img.width, img.height, options.smoothPasses);
}

export function removeBackground(img: PixelImage, options: BackgroundOptions): PixelImage {
	const mask = backgroundRemovalMask(img, options);
	const out = createPixelImage(img.width, img.height);
	for (let i = 0; i < mask.length; i++) {
		const di = i * 4;
		out.data[di] = img.data[di];
		out.data[di + 1] = img.data[di + 1];
		out.data[di + 2] = img.data[di + 2];
		out.data[di + 3] = mask[i] === 1 ? 0 : img.data[di + 3];
	}
	return out;
}

export function backgroundMaskPreview(img: PixelImage, options: BackgroundOptions): PixelImage {
	const mask = backgroundRemovalMask(img, options);
	const out = createPixelImage(img.width, img.height);
	for (let i = 0; i < mask.length; i++) {
		const v = mask[i] === 1 ? 255 : 0;
		const di = i * 4;
		out.data[di] = v;
		out.data[di + 1] = v;
		out.data[di + 2] = v;
		out.data[di + 3] = 255;
	}
	return out;
}

function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}
