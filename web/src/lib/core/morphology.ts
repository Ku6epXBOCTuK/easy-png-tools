import { parseHex } from "./alpha";
import { clonePixelImage, createPixelImage, type PixelImage } from "./types";

type Mask = Uint8Array;

type Offset = { dx: number; dy: number };

function discOffsets(radius: number): Offset[] {
	const offsets: Offset[] = [];
	for (let dy = -radius; dy <= radius; dy++) {
		for (let dx = -radius; dx <= radius; dx++) {
			if (dx * dx + dy * dy <= radius * radius) {
				offsets.push({ dx, dy });
			}
		}
	}
	return offsets;
}

export function buildAlphaMask(img: PixelImage): Mask {
	const mask = new Uint8Array(img.width * img.height);
	for (let i = 0; i < mask.length; i++) {
		mask[i] = img.data[i * 4 + 3] > 0 ? 1 : 0;
	}
	return mask;
}

export function dilateMask(
	mask: Mask,
	width: number,
	height: number,
	radius: number,
): Mask {
	const r = Math.trunc(radius);
	if (r < 1) return mask.slice();
	const out = new Uint8Array(mask.length);
	const offsets = discOffsets(r);
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			let hit = 0;
			for (const { dx, dy } of offsets) {
				const sx = x + dx;
				const sy = y + dy;
				if (sx < 0 || sy < 0 || sx >= width || sy >= height) continue;
				if (mask[sy * width + sx] === 1) {
					hit = 1;
					break;
				}
			}
			out[y * width + x] = hit;
		}
	}
	return out;
}

export function erodeMask(
	mask: Mask,
	width: number,
	height: number,
	radius: number,
): Mask {
	const r = Math.trunc(radius);
	if (r < 1) return mask.slice();
	const out = new Uint8Array(mask.length);
	const offsets = discOffsets(r);
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			let solid = 1;
			for (const { dx, dy } of offsets) {
				const sx = x + dx;
				const sy = y + dy;
				if (sx < 0 || sy < 0 || sx >= width || sy >= height) continue;
				if (mask[sy * width + sx] !== 1) {
					solid = 0;
					break;
				}
			}
			out[y * width + x] = solid;
		}
	}
	return out;
}

export function applyMaskAlpha(img: PixelImage, mask: Mask): PixelImage {
	const out = createPixelImage(img.width, img.height);
	for (let i = 0; i < mask.length; i++) {
		const di = i * 4;
		if (mask[i] === 1) {
			out.data[di] = img.data[di];
			out.data[di + 1] = img.data[di + 1];
			out.data[di + 2] = img.data[di + 2];
			out.data[di + 3] = 255;
		} else {
			out.data[di + 3] = 0;
		}
	}
	return out;
}

export function dilateImage(img: PixelImage, radiusPx: number): PixelImage {
	if (radiusPx < 1) return clonePixelImage(img);
	return applyMaskAlpha(
		img,
		dilateMask(buildAlphaMask(img), img.width, img.height, radiusPx),
	);
}

export function erodeImage(img: PixelImage, radiusPx: number): PixelImage {
	if (radiusPx < 1) return clonePixelImage(img);
	return applyMaskAlpha(
		img,
		erodeMask(buildAlphaMask(img), img.width, img.height, radiusPx),
	);
}

export function strokeImage(
	img: PixelImage,
	radiusPx: number,
	colorHex: string,
): PixelImage {
	const r = Math.trunc(radiusPx);
	if (r < 1) return clonePixelImage(img);
	const [cr, cg, cb] = parseHex(colorHex);
	const mask = buildAlphaMask(img);
	const ring = dilateMask(mask, img.width, img.height, r);
	const out = createPixelImage(img.width, img.height);
	for (let i = 0; i < ring.length; i++) {
		const di = i * 4;
		if (ring[i] === 1 && mask[i] === 0) {
			out.data[di] = cr;
			out.data[di + 1] = cg;
			out.data[di + 2] = cb;
			out.data[di + 3] = 255;
		} else if (mask[i] === 1) {
			out.data[di] = img.data[di];
			out.data[di + 1] = img.data[di + 1];
			out.data[di + 2] = img.data[di + 2];
			out.data[di + 3] = img.data[di + 3];
		}
	}
	return out;
}

export function contourImage(
	img: PixelImage,
	radiusPx: number,
	colorHex: string,
): PixelImage {
	const r = Math.max(1, Math.trunc(radiusPx));
	const [cr, cg, cb] = parseHex(colorHex);
	const mask = buildAlphaMask(img);
	const inner = erodeMask(mask, img.width, img.height, r);
	const line = new Uint8Array(mask.length);
	for (let i = 0; i < mask.length; i++) {
		line[i] = mask[i] === 1 && inner[i] === 0 ? 1 : 0;
	}
	const out = createPixelImage(img.width, img.height);
	for (let i = 0; i < line.length; i++) {
		const di = i * 4;
		if (line[i] === 1) {
			out.data[di] = cr;
			out.data[di + 1] = cg;
			out.data[di + 2] = cb;
			out.data[di + 3] = 255;
		}
	}
	return out;
}

export function openingMask(
	mask: Mask,
	w: number,
	h: number,
	radius: number,
): Mask {
	return dilateMask(erodeMask(mask, w, h, radius), w, h, radius);
}

export function closingMask(
	mask: Mask,
	w: number,
	h: number,
	radius: number,
): Mask {
	return erodeMask(dilateMask(mask, w, h, radius), w, h, radius);
}

export function openingImage(img: PixelImage, radiusPx: number): PixelImage {
	if (radiusPx < 1) return clonePixelImage(img);
	const mask = buildAlphaMask(img);
	const opened = openingMask(mask, img.width, img.height, radiusPx);
	const out = createPixelImage(img.width, img.height);
	for (let i = 0; i < opened.length; i++) {
		const di = i * 4;
		out.data[di] = img.data[di];
		out.data[di + 1] = img.data[di + 1];
		out.data[di + 2] = img.data[di + 2];
		out.data[di + 3] = opened[i] === 1 ? img.data[di + 3] : 0;
	}
	return out;
}

export function closingImage(img: PixelImage, radiusPx: number): PixelImage {
	if (radiusPx < 1) return clonePixelImage(img);
	const mask = buildAlphaMask(img);
	const closed = closingMask(mask, img.width, img.height, radiusPx);
	const out = createPixelImage(img.width, img.height);
	for (let i = 0; i < closed.length; i++) {
		const di = i * 4;
		if (closed[i] === 1 && mask[i] === 0) {
			out.data[di] = 0;
			out.data[di + 1] = 0;
			out.data[di + 2] = 0;
		} else {
			out.data[di] = img.data[di];
			out.data[di + 1] = img.data[di + 1];
			out.data[di + 2] = img.data[di + 2];
		}
		out.data[di + 3] = closed[i] === 1 ? 255 : img.data[di + 3];
	}
	return out;
}
