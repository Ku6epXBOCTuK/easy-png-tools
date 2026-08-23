import { parseHex } from './alpha';
import { clonePixelImage, createPixelImage, type PixelImage } from './types';

export function expandCanvas(
	img: PixelImage,
	left: number,
	top: number,
	right: number,
	bottom: number,
	backgroundHex?: string
): PixelImage {
	const l = Math.max(0, Math.trunc(left));
	const t = Math.max(0, Math.trunc(top));
	const r = Math.max(0, Math.trunc(right));
	const b = Math.max(0, Math.trunc(bottom));
	const out = createPixelImage(img.width + l + r, img.height + t + b);
	if (backgroundHex !== undefined) {
		const [cr, cg, cb] = parseHex(backgroundHex);
		for (let i = 0; i < out.data.length; i += 4) {
			out.data[i] = cr;
			out.data[i + 1] = cg;
			out.data[i + 2] = cb;
			out.data[i + 3] = 255;
		}
	}
	for (let y = 0; y < img.height; y++) {
		const srcStart = y * img.width * 4;
		out.data.set(
			img.data.subarray(srcStart, srcStart + img.width * 4),
			((y + t) * out.width + l) * 4
		);
	}
	return out;
}

export function tile(img: PixelImage, columns: number, rows: number): PixelImage {
	const cols = Math.max(1, Math.trunc(columns));
	const rowsCount = Math.max(1, Math.trunc(rows));
	const out = createPixelImage(img.width * cols, img.height * rowsCount);
	for (let ty = 0; ty < rowsCount; ty++) {
		for (let tx = 0; tx < cols; tx++) {
			for (let y = 0; y < img.height; y++) {
				const srcStart = y * img.width * 4;
				out.data.set(
					img.data.subarray(srcStart, srcStart + img.width * 4),
					((ty * img.height + y) * out.width + tx * img.width) * 4
				);
			}
		}
	}
	return out;
}

export function centerByAlpha(img: PixelImage): PixelImage {
	let minX = img.width;
	let minY = img.height;
	let maxX = -1;
	let maxY = -1;
	for (let y = 0; y < img.height; y++) {
		for (let x = 0; x < img.width; x++) {
			if (img.data[(y * img.width + x) * 4 + 3] > 0) {
				if (x < minX) minX = x;
				if (y < minY) minY = y;
				if (x > maxX) maxX = x;
				if (y > maxY) maxY = y;
			}
		}
	}
	if (maxX < 0) return clonePixelImage(img);
	const content = crop(img, minX, minY, maxX - minX + 1, maxY - minY + 1);
	const out = createPixelImage(img.width, img.height);
	const dx = Math.floor((img.width - content.width) / 2);
	const dy = Math.floor((img.height - content.height) / 2);
	for (let y = 0; y < content.height; y++) {
		out.data.set(
			content.data.subarray(y * content.width * 4, (y + 1) * content.width * 4),
			((y + dy) * out.width + dx) * 4
		);
	}
	return out;
}

export type FlipAxis = 'horizontal' | 'vertical';

export function flip(img: PixelImage, axis: FlipAxis): PixelImage {
	const out = createPixelImage(img.width, img.height);
	for (let y = 0; y < img.height; y++) {
		for (let x = 0; x < img.width; x++) {
			const sx = axis === 'horizontal' ? img.width - 1 - x : x;
			const sy = axis === 'vertical' ? img.height - 1 - y : y;
			copyPixel(img, sx, sy, out, x, y);
		}
	}
	return out;
}

export function rotate90(img: PixelImage, turns: number): PixelImage {
	const t = ((Math.trunc(turns) % 4) + 4) % 4;
	if (t === 0) return clonePixelImage(img);
	let current = img;
	for (let i = 0; i < t; i++) {
		current = rotateClockwise(current);
	}
	return current;
}

function rotateClockwise(img: PixelImage): PixelImage {
	const out = createPixelImage(img.height, img.width);
	for (let y = 0; y < img.height; y++) {
		for (let x = 0; x < img.width; x++) {
			copyPixel(img, x, y, out, img.height - 1 - y, x);
		}
	}
	return out;
}

export function crop(
	img: PixelImage,
	x: number,
	y: number,
	width: number,
	height: number
): PixelImage {
	const sx = clampInt(x, 0, img.width);
	const sy = clampInt(y, 0, img.height);
	const ex = clampInt(x + width, sx, img.width);
	const ey = clampInt(y + height, sy, img.height);
	const w = ex - sx;
	const h = ey - sy;
	if (w <= 0 || h <= 0) {
		throw new RangeError('Область обрезки пуста: она целиком вне изображения');
	}
	const out = createPixelImage(w, h);
	for (let row = 0; row < h; row++) {
		const si = (sy + row) * img.width * 4 + sx * 4;
		out.data.set(img.data.subarray(si, si + w * 4), row * w * 4);
	}
	return out;
}

export function resize(img: PixelImage, width: number, height: number): PixelImage {
	if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) {
		throw new RangeError('Размеры должны быть целыми числами >= 1');
	}
	const out = createPixelImage(width, height);
	const xr = img.width / width;
	const yr = img.height / height;
	const maxX = img.width - 1;
	const maxY = img.height - 1;
	for (let dy = 0; dy < height; dy++) {
		const fy = Math.min(Math.max((dy + 0.5) * yr - 0.5, 0), maxY);
		const y0 = Math.floor(fy);
		const ty = fy - y0;
		const y1 = Math.min(y0 + 1, maxY);
		for (let dx = 0; dx < width; dx++) {
			const fx = Math.min(Math.max((dx + 0.5) * xr - 0.5, 0), maxX);
			const x0 = Math.floor(fx);
			const tx = fx - x0;
			const x1 = Math.min(x0 + 1, maxX);
			const di = (dy * width + dx) * 4;
			for (let ch = 0; ch < 4; ch++) {
				const p00 = img.data[(y0 * img.width + x0) * 4 + ch];
				const p10 = img.data[(y0 * img.width + x1) * 4 + ch];
				const p01 = img.data[(y1 * img.width + x0) * 4 + ch];
				const p11 = img.data[(y1 * img.width + x1) * 4 + ch];
				const top = (1 - tx) * p00 + tx * p10;
				const bottom = (1 - tx) * p01 + tx * p11;
				out.data[di + ch] = (1 - ty) * top + ty * bottom;
			}
		}
	}
	return out;
}

function copyPixel(src: PixelImage, sx: number, sy: number, dst: PixelImage, dx: number, dy: number): void {
	const si = (sy * src.width + sx) * 4;
	const di = (dy * dst.width + dx) * 4;
	dst.data[di] = src.data[si];
	dst.data[di + 1] = src.data[si + 1];
	dst.data[di + 2] = src.data[si + 2];
	dst.data[di + 3] = src.data[si + 3];
}

function clampInt(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, Math.trunc(value)));
}
