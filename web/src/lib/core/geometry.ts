import { parseHex } from "./alpha";
import { ToolError } from "./errors";
import { clonePixelImage, createPixelImage, type PixelImage } from "./types";

export function expandCanvas(
	img: PixelImage,
	left: number,
	top: number,
	right: number,
	bottom: number,
	backgroundHex?: string,
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
			((y + t) * out.width + l) * 4,
		);
	}
	return out;
}

export function tile(
	img: PixelImage,
	columns: number,
	rows: number,
): PixelImage {
	const cols = Math.max(1, Math.trunc(columns));
	const rowsCount = Math.max(1, Math.trunc(rows));
	const out = createPixelImage(img.width * cols, img.height * rowsCount);
	for (let ty = 0; ty < rowsCount; ty++) {
		for (let tx = 0; tx < cols; tx++) {
			for (let y = 0; y < img.height; y++) {
				const srcStart = y * img.width * 4;
				out.data.set(
					img.data.subarray(srcStart, srcStart + img.width * 4),
					((ty * img.height + y) * out.width + tx * img.width) * 4,
				);
			}
		}
	}
	return out;
}

/**
 * Разрезает изображение на сетку columns × rows строго равных частей.
 * Холст дополняется прозрачным до кратного размера (`ceil(width / cols)`),
 * поэтому весь исходный контент сохраняется. Порядок — row-major: сначала все
 * столбцы первой строки (part 1-1, 1-2, …), затем второй и т.д.
 */
export function splitToParts(
	img: PixelImage,
	columns: number,
	rows: number,
): PixelImage[] {
	const cols = Math.max(1, Math.trunc(columns));
	const rowsCount = Math.max(1, Math.trunc(rows));
	const pieceW = Math.ceil(img.width / cols);
	const pieceH = Math.ceil(img.height / rowsCount);
	const gridW = pieceW * cols;
	const gridH = pieceH * rowsCount;
	const padded =
		gridW === img.width && gridH === img.height
			? img
			: expandCanvas(img, 0, 0, gridW - img.width, gridH - img.height);
	const parts: PixelImage[] = [];
	for (let row = 0; row < rowsCount; row++) {
		for (let col = 0; col < cols; col++) {
			parts.push(crop(padded, col * pieceW, row * pieceH, pieceW, pieceH));
		}
	}
	return parts;
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
			((y + dy) * out.width + dx) * 4,
		);
	}
	return out;
}

export type FlipAxis = "horizontal" | "vertical";

export function flip(img: PixelImage, axis: FlipAxis): PixelImage {
	const out = createPixelImage(img.width, img.height);
	for (let y = 0; y < img.height; y++) {
		for (let x = 0; x < img.width; x++) {
			const sx = axis === "horizontal" ? img.width - 1 - x : x;
			const sy = axis === "vertical" ? img.height - 1 - y : y;
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
	height: number,
): PixelImage {
	const sx = clampInt(x, 0, img.width);
	const sy = clampInt(y, 0, img.height);
	const ex = clampInt(x + width, sx, img.width);
	const ey = clampInt(y + height, sy, img.height);
	const w = ex - sx;
	const h = ey - sy;
	if (w <= 0 || h <= 0) {
		throw new ToolError("errors.cropBounds");
	}
	const out = createPixelImage(w, h);
	for (let row = 0; row < h; row++) {
		const si = (sy + row) * img.width * 4 + sx * 4;
		out.data.set(img.data.subarray(si, si + w * 4), row * w * 4);
	}
	return out;
}

export function resize(
	img: PixelImage,
	width: number,
	height: number,
): PixelImage {
	if (
		!Number.isInteger(width) ||
		!Number.isInteger(height) ||
		width < 1 ||
		height < 1
	) {
		throw new ToolError("errors.sizeInt");
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

function copyPixel(
	src: PixelImage,
	sx: number,
	sy: number,
	dst: PixelImage,
	dx: number,
	dy: number,
): void {
	const si = (sy * src.width + sx) * 4;
	const di = (dy * dst.width + dx) * 4;
	dst.data[di] = src.data[si];
	dst.data[di + 1] = src.data[si + 1];
	dst.data[di + 2] = src.data[si + 2];
	dst.data[di + 3] = src.data[si + 3];
}

export function sampleBilinear(
	img: PixelImage,
	fx: number,
	fy: number,
): [number, number, number, number] {
	const maxX = img.width - 1;
	const maxY = img.height - 1;
	const cx = Math.min(Math.max(fx, 0), maxX);
	const cy = Math.min(Math.max(fy, 0), maxY);
	const x0 = Math.floor(cx);
	const y0 = Math.floor(cy);
	const tx = cx - x0;
	const ty = cy - y0;
	const x1 = Math.min(x0 + 1, maxX);
	const y1 = Math.min(y0 + 1, maxY);
	const i00 = (y0 * img.width + x0) * 4;
	const i10 = (y0 * img.width + x1) * 4;
	const i01 = (y1 * img.width + x0) * 4;
	const i11 = (y1 * img.width + x1) * 4;
	const result: [number, number, number, number] = [0, 0, 0, 0];
	for (let ch = 0; ch < 4; ch++) {
		const top = (1 - tx) * img.data[i00 + ch] + tx * img.data[i10 + ch];
		const bottom = (1 - tx) * img.data[i01 + ch] + tx * img.data[i11 + ch];
		result[ch] = (1 - ty) * top + ty * bottom;
	}
	return result;
}

function clampInt(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, Math.trunc(value)));
}

export type Anchor9 =
	| "top-left"
	| "top-center"
	| "top-right"
	| "middle-left"
	| "center"
	| "middle-right"
	| "bottom-left"
	| "bottom-center"
	| "bottom-right";

/** Границы контента: пиксели с альфой строго больше порога. Пустое изображение → null. */
export function contentBounds(
	img: PixelImage,
	alphaThreshold = 0,
): { x: number; y: number; w: number; h: number } | null {
	let minX = img.width;
	let minY = img.height;
	let maxX = -1;
	let maxY = -1;
	for (let y = 0; y < img.height; y++) {
		for (let x = 0; x < img.width; x++) {
			if (img.data[(y * img.width + x) * 4 + 3] > alphaThreshold) {
				if (x < minX) minX = x;
				if (y < minY) minY = y;
				if (x > maxX) maxX = x;
				if (y > maxY) maxY = y;
			}
		}
	}
	if (maxX < 0) return null;
	return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

/** Обрезка прозрачных полей по порогу альфы. Полностью пустое → 1×1 прозрачный пиксель. */
export function trimToContent(img: PixelImage, alphaThreshold = 0): PixelImage {
	const b = contentBounds(img, alphaThreshold);
	if (!b) return crop(img, 0, 0, 1, 1);
	return crop(img, b.x, b.y, b.w, b.h);
}

/** Приводит холст к точному размеру: лишнее обрезается, недостающее дополняется прозрачным. */
export function changeCanvasSize(
	img: PixelImage,
	width: number,
	height: number,
	anchor: Anchor9,
): PixelImage {
	const out = createPixelImage(width, height);
	const pasteX = anchor.endsWith("-left")
		? 0
		: anchor.endsWith("-right")
			? width - img.width
			: Math.floor((width - img.width) / 2);
	const pasteY = anchor.startsWith("top-")
		? 0
		: anchor.startsWith("bottom-")
			? height - img.height
			: Math.floor((height - img.height) / 2);
	for (let y = 0; y < height; y++) {
		const sy = y - pasteY;
		if (sy < 0 || sy >= img.height) continue;
		for (let x = 0; x < width; x++) {
			const sx = x - pasteX;
			if (sx < 0 || sx >= img.width) continue;
			const di = (y * width + x) * 4;
			const si = (sy * img.width + sx) * 4;
			out.data[di] = img.data[si];
			out.data[di + 1] = img.data[si + 1];
			out.data[di + 2] = img.data[si + 2];
			out.data[di + 3] = img.data[si + 3];
		}
	}
	return out;
}

/** Центральный кроп до соотношения сторон (ratio ≥ 1 = широкое). */
export function cropToRatio(img: PixelImage, ratio: number): PixelImage {
	const current = img.width / img.height;
	if (current > ratio) {
		const w = Math.max(1, Math.round(img.height * ratio));
		return crop(img, Math.floor((img.width - w) / 2), 0, w, img.height);
	}
	if (current < ratio) {
		const h = Math.max(1, Math.round(img.width / ratio));
		return crop(img, 0, Math.floor((img.height - h) / 2), img.width, h);
	}
	return clonePixelImage(img);
}

/** Вписывает в соотношение сторон, добавляя прозрачные поля. */
export function padToRatio(img: PixelImage, ratio: number): PixelImage {
	const current = img.width / img.height;
	let w = img.width;
	let h = img.height;
	if (current > ratio) h = Math.round(w / ratio);
	else if (current < ratio) w = Math.round(h * ratio);
	w = Math.max(1, w);
	h = Math.max(1, h);
	return changeCanvasSize(img, w, h, "center");
}

/** Разворачивает изображение на 90°, если его ориентация не совпадает с целевой. Квадрат не трогает. */
export function forceOrientation(
	img: PixelImage,
	target: "portrait" | "landscape",
): PixelImage {
	const current =
		img.width > img.height
			? "landscape"
			: img.width < img.height
				? "portrait"
				: "square";
	if (current === target || current === "square") return clonePixelImage(img);
	return rotate90(img, 1);
}

/**
 * Симметричная копия: к выбранной стороне оригинала добавляется его зеркало.
 * axis vertical — зеркалим по вертикальной линии (ширина ×2), horizontal — по горизонтальной (высота ×2).
 */
export function symmetricCopy(
	img: PixelImage,
	axis: "vertical" | "horizontal",
	keepSide: "left" | "right" | "top" | "bottom",
): PixelImage {
	if (axis === "vertical") {
		const out = createPixelImage(img.width * 2, img.height);
		for (let y = 0; y < img.height; y++) {
			for (let x = 0; x < img.width; x++) {
				const srcX = keepSide === "left" ? x : img.width - 1 - x;
				const di = (y * out.width + x) * 4;
				const si = (y * img.width + srcX) * 4;
				out.data[di] = img.data[si];
				out.data[di + 1] = img.data[si + 1];
				out.data[di + 2] = img.data[si + 2];
				out.data[di + 3] = img.data[si + 3];
				const mx = img.width * 2 - 1 - x;
				const md = (y * out.width + mx) * 4;
				out.data[md] = img.data[si];
				out.data[md + 1] = img.data[si + 1];
				out.data[md + 2] = img.data[si + 2];
				out.data[md + 3] = img.data[si + 3];
			}
		}
		return out;
	}
	const out = createPixelImage(img.width, img.height * 2);
	for (let y = 0; y < img.height; y++) {
		const srcY = keepSide === "top" ? y : img.height - 1 - y;
		for (let x = 0; x < img.width; x++) {
			const si = (srcY * img.width + x) * 4;
			const dTop = (y * out.width + x) * 4;
			out.data[dTop] = img.data[si];
			out.data[dTop + 1] = img.data[si + 1];
			out.data[dTop + 2] = img.data[si + 2];
			out.data[dTop + 3] = img.data[si + 3];
			const my = img.height * 2 - 1 - y;
			const md = (my * out.width + x) * 4;
			out.data[md] = img.data[si];
			out.data[md + 1] = img.data[si + 1];
			out.data[md + 2] = img.data[si + 2];
			out.data[md + 3] = img.data[si + 3];
		}
	}
	return out;
}
