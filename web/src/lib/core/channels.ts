import type { PixelImage } from "./types";
import { createPixelImage } from "./types";
import { rgbToHsl } from "./palette";
import type { Rgb } from "./palette";

/** Все компоненты нормализованы в 0..1 в порядке объявления. */
export type SpaceComponents = number[];

export type SpaceId = "hsl" | "hsv" | "hsi" | "cmyk" | "ycbcr" | "lab";

function hueOf({ r, g, b }: Rgb): number {
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	if (max === min) return 0;
	const d = max - min;
	let h: number;
	if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
	else if (max === g) h = ((b - r) / d + 2) * 60;
	else h = ((r - g) / d + 4) * 60;
	return h;
}

function rgbToHsv({ r, g, b }: Rgb): [number, number, number] {
	r /= 255;
	g /= 255;
	b /= 255;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	return [hueOf({ r, g, b }), max === 0 ? 0 : (max - min) / max, max];
}

function rgbToHsi({ r, g, b }: Rgb): [number, number, number] {
	r /= 255;
	g /= 255;
	b /= 255;
	const sum = r + g + b;
	const intensity = sum / 3;
	if (sum === 0) return [0, 0, 0];
	const min = Math.min(r, g, b);
	const saturation = 1 - min / intensity;
	return [hueOf({ r, g, b }), saturation, intensity];
}

function rgbToCmyk({ r, g, b }: Rgb): [number, number, number, number] {
	const rn = r / 255;
	const gn = g / 255;
	const bn = b / 255;
	const k = 1 - Math.max(rn, gn, bn);
	if (k === 1) return [0, 0, 0, 1];
	return [
		(1 - rn - k) / (1 - k),
		(1 - gn - k) / (1 - k),
		(1 - bn - k) / (1 - k),
		k,
	];
}

function rgbToYcbcr({ r, g, b }: Rgb): [number, number, number] {
	const y = 0.299 * r + 0.587 * g + 0.114 * b;
	const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
	const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
	return [y / 255, cb / 255, cr / 255];
}

function srgbTransfer(v: number): number {
	return v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
}

function rgbToLab({ r, g, b }: Rgb): [number, number, number] {
	const lin = [r, g, b].map((v) => srgbTransfer(v / 255));
	const x = (lin[0] * 0.4124 + lin[1] * 0.3576 + lin[2] * 0.1805) / 0.95047;
	const y = lin[0] * 0.2126 + lin[1] * 0.7152 + lin[2] * 0.0722;
	const z = (lin[0] * 0.0193 + lin[1] * 0.1192 + lin[2] * 0.9505) / 1.08883;
	const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
	const fx = f(x);
	const fy = f(y);
	const fz = f(z);
	// L нормирован 0..1; a/b центрированы на 0.5 с размахом ±0.5
	return [
		(116 * fy - 16) / 100,
		(500 * (fx - fy)) / 250 + 0.5,
		(200 * (fy - fz)) / 250 + 0.5,
	];
}

type SpaceDef = {
	components: string[];
	convert: (rgb: Rgb) => SpaceComponents;
};

export const SPACES: Record<SpaceId, SpaceDef> = {
	hsl: {
		components: ["h", "s", "l"],
		convert: ({ r, g, b }) => {
			const { h, s, l } = rgbToHsl({ r, g, b });
			return [h / 360, s, l];
		},
	},
	hsv: { components: ["h", "s", "v"], convert: rgbToHsv },
	hsi: { components: ["h", "s", "i"], convert: rgbToHsi },
	cmyk: { components: ["c", "m", "y", "k"], convert: rgbToCmyk },
	ycbcr: { components: ["y", "cb", "cr"], convert: rgbToYcbcr },
	lab: { components: ["l", "a", "b"], convert: rgbToLab },
};

export type ChannelDisplay = "gray" | "color";

/**
 * Визуализация выбранного пространства: каждый компонент пространства
 * попадает в свой канал результата (mode 'color') или выбранный компонент
 * рисуется градациями серого (mode 'gray').
 */
export function renderSpace(
	img: PixelImage,
	space: SpaceId,
	component: string,
	display: ChannelDisplay,
): PixelImage {
	const def = SPACES[space];
	if (!def) return createPixelImage(img.width, img.height);
	const idx = def.components.indexOf(component);
	if (idx < 0) return createPixelImage(img.width, img.height);
	const out = createPixelImage(img.width, img.height);
	for (let i = 0; i < img.data.length; i += 4) {
		const comps = def.convert({
			r: img.data[i],
			g: img.data[i + 1],
			b: img.data[i + 2],
		});
		const di = i;
		out.data[di + 3] = img.data[i + 3];
		if (display === "gray") {
			const v = comps[idx] * 255;
			out.data[di] = v;
			out.data[di + 1] = v;
			out.data[di + 2] = v;
		} else {
			out.data[di] = comps[0] * 255;
			out.data[di + 1] = (comps[1] ?? 0) * 255;
			out.data[di + 2] = (comps[2] ?? 0) * 255;
		}
	}
	return out;
}
