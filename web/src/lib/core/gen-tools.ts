import { createPixelImage, type PixelImage } from "./types";
import { hslToRgb } from "./palette";
import { mulberry32 } from "./pixel-fx";

/** Радужный спектр: оттенок 0..360 вдоль выбранной оси. */
export function colorSpectrum(
	width: number,
	height: number,
	direction: "horizontal" | "vertical",
	saturationPercent: number,
	lightnessPercent: number,
): PixelImage {
	const out = createPixelImage(width, height);
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const t =
				direction === "vertical"
					? y / Math.max(1, height - 1)
					: x / Math.max(1, width - 1);
			const { r, g, b } = hslToRgb({
				h: t * 360,
				s: saturationPercent / 100,
				l: lightnessPercent / 100,
			});
			const di = (y * width + x) * 4;
			out.data[di] = r;
			out.data[di + 1] = g;
			out.data[di + 2] = b;
			out.data[di + 3] = 255;
		}
	}
	return out;
}

/** Случайные яркие блоки: детерминировано по seed. */
export function randomColorBlocks(
	width: number,
	height: number,
	blockSize: number,
	seed: number,
): PixelImage {
	const bs = Math.max(1, Math.round(blockSize));
	const out = createPixelImage(width, height);
	const rng = mulberry32(seed);
	for (let by = 0; by < height; by += bs) {
		for (let bx = 0; bx < width; bx += bs) {
			const { r, g, b } = hslToRgb({
				h: rng() * 360,
				s: 0.65 + rng() * 0.35,
				l: 0.45 + rng() * 0.25,
			});
			const yMax = Math.min(by + bs, height);
			const xMax = Math.min(bx + bs, width);
			for (let y = by; y < yMax; y++) {
				for (let x = bx; x < xMax; x++) {
					const di = (y * width + x) * 4;
					out.data[di] = r;
					out.data[di + 1] = g;
					out.data[di + 2] = b;
					out.data[di + 3] = 255;
				}
			}
		}
	}
	return out;
}

function lineMask(
	length: number,
	divisions: number,
	lineWidth: number,
): Uint8Array {
	const mask = new Uint8Array(length);
	const lw = Math.max(1, Math.round(lineWidth));
	for (let i = 0; i <= divisions; i++) {
		const start = Math.round((i * length) / divisions);
		for (let x = start; x < Math.min(start + lw, length); x++) mask[x] = 1;
	}
	return mask;
}

/** Сетка линий на прозрачном или белом фоне. */
export function drawGrid(
	width: number,
	height: number,
	cols: number,
	rows: number,
	lineWidth: number,
	colorHex: string,
	transparentBg: boolean,
): PixelImage {
	const out = createPixelImage(width, height);
	if (!transparentBg) out.data.fill(255);

	const m = /^#([0-9a-f]{6})$/i.exec(colorHex.trim());
	const r = m ? parseInt(m[1].slice(0, 2), 16) : 0;
	const g = m ? parseInt(m[1].slice(2, 4), 16) : 0;
	const b = m ? parseInt(m[1].slice(4, 6), 16) : 0;

	const colMask = lineMask(width, Math.max(1, cols), lineWidth);
	const rowMask = lineMask(height, Math.max(1, rows), lineWidth);
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (!colMask[x] && !rowMask[y]) continue;
			const di = (y * width + x) * 4;
			out.data[di] = r;
			out.data[di + 1] = g;
			out.data[di + 2] = b;
			out.data[di + 3] = 255;
		}
	}
	return out;
}
