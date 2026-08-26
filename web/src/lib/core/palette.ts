import { ToolError } from './errors';
import type { PixelImage } from './types';
import { createPixelImage } from './types';

export type Rgb = { r: number; g: number; b: number };
export type Hsl = { h: number; s: number; l: number };

export function hexToRgb(hex: string): Rgb {
	const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
	if (!m) throw new ToolError('errors.badHex', { value: hex });
	const d = m[1];
	return {
		r: parseInt(d.slice(0, 2), 16),
		g: parseInt(d.slice(2, 4), 16),
		b: parseInt(d.slice(4, 6), 16)
	};
}

const byte = (v: number) =>
	Math.round(Math.min(255, Math.max(0, v)))
		.toString(16)
		.padStart(2, '0');

export function rgbToHex({ r, g, b }: Rgb): string {
	return `#${byte(r)}${byte(g)}${byte(b)}`;
}

/** h ∈ [0..360), s,l ∈ [0..1] */
export function rgbToHsl({ r, g, b }: Rgb): Hsl {
	const rn = r / 255;
	const gn = g / 255;
	const bn = b / 255;
	const max = Math.max(rn, gn, bn);
	const min = Math.min(rn, gn, bn);
	const l = (max + min) / 2;
	if (max === min) return { h: 0, s: 0, l };
	const d = max - min;
	const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	let h: number;
	if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60;
	else if (max === gn) h = ((bn - rn) / d + 2) * 60;
	else h = ((rn - gn) / d + 4) * 60;
	return { h, s, l };
}

export function hslToRgb({ h, s, l }: Hsl): Rgb {
	const hn = ((h % 360) + 360) % 360;
	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(((hn / 60) % 2) - 1));
	const m = l - c / 2;
	let r = 0;
	let g = 0;
	let b = 0;
	if (hn < 60) [r, g, b] = [c, x, 0];
	else if (hn < 120) [r, g, b] = [x, c, 0];
	else if (hn < 180) [r, g, b] = [0, c, x];
	else if (hn < 240) [r, g, b] = [0, x, c];
	else if (hn < 300) [r, g, b] = [x, 0, c];
	else [r, g, b] = [c, 0, x];
	return {
		r: Math.round((r + m) * 255),
		g: Math.round((g + m) * 255),
		b: Math.round((b + m) * 255)
	};
}

export function shiftHue(hex: string, deltaDeg: number): string {
	const hsl = rgbToHsl(hexToRgb(hex));
	return rgbToHex(hslToRgb({ ...hsl, h: hsl.h + deltaDeg }));
}

function withLightness(hex: string, l: number): string {
	return rgbToHex(hslToRgb({ ...rgbToHsl(hexToRgb(hex)), l }));
}

export function complementarySet(base: string): string[] {
	return [normalizeHex(base), shiftHue(base, 180)];
}

export function triadicSet(base: string): string[] {
	return [normalizeHex(base), shiftHue(base, 120), shiftHue(base, 240)];
}

export function tetradicSet(base: string): string[] {
	return [normalizeHex(base), shiftHue(base, 90), shiftHue(base, 180), shiftHue(base, 270)];
}

export function analogousSet(base: string, spreadDeg: number, count: number): string[] {
	const n = Math.max(3, Math.min(9, Math.round(count)));
	const half = Math.floor(n / 2);
	return Array.from({ length: n }, (_, i) => shiftHue(base, (i - half) * spreadDeg));
}

export function monochromaticSet(base: string, count: number, rangePercent: number): string[] {
	const n = Math.max(2, Math.min(9, Math.round(count)));
	const baseL = rgbToHsl(hexToRgb(normalizeHex(base))).l;
	const halfSpan = Math.min(0.495, rangePercent / 200);
	return Array.from({ length: n }, (_, i) => {
		const t = n === 1 ? 0.5 : i / (n - 1);
		const l = clamp01(baseL - halfSpan + t * halfSpan * 2);
		return withLightness(normalizeHex(base), l);
	});
}

export function shadeSet(base: string, count: number, depthPercent: number): string[] {
	const n = Math.max(2, Math.min(9, Math.round(count)));
	const baseL = rgbToHsl(hexToRgb(normalizeHex(base))).l;
	const floorL = Math.max(0.03, baseL - depthPercent / 100);
	return Array.from({ length: n }, (_, i) => {
		const t = i / (n - 1);
		return withLightness(normalizeHex(base), baseL - (baseL - floorL) * t);
	});
}

export function parseHexList(text: string): string[] {
	const list = text
		.split(/[,\s;]+/)
		.map((t) => t.trim())
		.filter((t) => /^#[0-9a-f]{6}$/i.test(t))
		.map((t) => normalizeHex(t));
	if (list.length === 0) throw new ToolError('errors.badHex', { value: text });
	return list;
}

export function normalizeHex(hex: string): string {
	const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
	if (!m) throw new ToolError('errors.badHex', { value: hex });
	return `#${m[1].toLowerCase()}`;
}

export function mixColors(hexes: string[]): string {
	const sum = hexes
		.map(hexToRgb)
		.reduce((acc, c) => ({ r: acc.r + c.r, g: acc.g + c.g, b: acc.b + c.b }), { r: 0, g: 0, b: 0 });
	return rgbToHex({
		r: sum.r / hexes.length,
		g: sum.g / hexes.length,
		b: sum.b / hexes.length
	});
}

export function luma(hex: string): number {
	const { r, g, b } = hexToRgb(hex);
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export type SortKey = 'hue' | 'luma' | 'sat';

export function sortPalette(hexes: string[], key: SortKey): string[] {
	const scored = hexes.map((h) => {
		if (key === 'luma') return { h, k: luma(h) };
		const hsl = rgbToHsl(hexToRgb(h));
		return { h, k: key === 'hue' ? hsl.h : hsl.s };
	});
	return scored.sort((a, b) => a.k - b.k || a.h.localeCompare(b.h)).map((s) => s.h);
}

function clamp01(v: number): number {
	return Math.min(1, Math.max(0, v));
}

/** Горизонтальные равные колонки-свотчи (strip) или сетка ~квадратных ячеек (grid). */
export function renderSwatches(colors: string[], width: number, layout: 'strip' | 'grid'): PixelImage {
	const n = colors.length;
	if (layout === 'strip') {
		const cellW = width / n;
		const height = Math.max(24, Math.round(cellW));
		const out = createPixelImage(width, height);
		colors.forEach((hex, i) => {
			const { r, g, b } = hexToRgb(hex);
			fillRect(out, Math.floor(i * cellW), 0, Math.ceil(cellW), height, r, g, b);
		});
		return out;
	}
	const cols = Math.max(1, Math.ceil(Math.sqrt(n)));
	const rows = Math.max(1, Math.ceil(n / cols));
	const cell = Math.floor(width / cols);
	const height = cell * rows;
	const out = createPixelImage(width, height);
	colors.forEach((hex, i) => {
		const { r, g, b } = hexToRgb(hex);
		fillRect(out, (i % cols) * cell, Math.floor(i / cols) * cell, cell, cell, r, g, b);
	});
	return out;
}

export function renderWheel(size: number, lightness: number): PixelImage {
	const out = createPixelImage(size, size);
	const c = (size - 1) / 2;
	const radius = c;
	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			const dx = x - c;
			const dy = y - c;
			const dist = Math.sqrt(dx * dx + dy * dy);
			const di = (y * size + x) * 4;
			if (dist > radius) continue;
			const h = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
			const s = dist / radius;
			const { r, g, b } = hslToRgb({ h, s, l: lightness / 100 });
			out.data[di] = r;
			out.data[di + 1] = g;
			out.data[di + 2] = b;
			out.data[di + 3] = 255;
		}
	}
	return out;
}

export function renderBlend(a: string, b: string, width: number): PixelImage {
	const height = Math.max(24, Math.round(width / 4));
	const out = createPixelImage(width, height);
	const ca = hexToRgb(a);
	const cb = hexToRgb(b);
	for (let x = 0; x < width; x++) {
		const t = width === 1 ? 0 : x / (width - 1);
		fillRect(
			out,
			x,
			0,
			1,
			height,
			Math.round(ca.r + (cb.r - ca.r) * t),
			Math.round(ca.g + (cb.g - ca.g) * t),
			Math.round(ca.b + (cb.b - ca.b) * t)
		);
	}
	return out;
}

export function stepColors(aHex: string, bHex: string, steps: number): string[] {
	const n = Math.max(2, Math.min(12, Math.round(steps)));
	const ca = hexToRgb(aHex);
	const cb = hexToRgb(bHex);
	return Array.from({ length: n }, (_, i) => {
		const t = i / (n - 1);
		return rgbToHex({
			r: ca.r + (cb.r - ca.r) * t,
			g: ca.g + (cb.g - ca.g) * t,
			b: ca.b + (cb.b - ca.b) * t
		});
	});
}

function fillRect(
	img: PixelImage,
	x0: number,
	y0: number,
	w: number,
	h: number,
	r: number,
	g: number,
	b: number
): void {
	for (let y = y0; y < Math.min(y0 + h, img.height); y++) {
		for (let x = x0; x < Math.min(x0 + w, img.width); x++) {
			const di = (y * img.width + x) * 4;
			img.data[di] = r;
			img.data[di + 1] = g;
			img.data[di + 2] = b;
			img.data[di + 3] = 255;
		}
	}
}
