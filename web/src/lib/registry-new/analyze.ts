import type { ToolEntry } from "./types";
import { field, toolSchema } from "../registry-schema";
import {
	extractByColor,
	isGrayscaleish,
	luma01,
	rarityPredicate,
	renderPredicateMask,
} from "../core/masks";

interface ExtractColorParams {
	color: string;
	tolerance: number;
}

export const extractColorSchema = toolSchema<ExtractColorParams>({
	color: field.color({ default: "#00ff88" }),
	tolerance: field.slider({ min: 0, max: 50, step: 1, default: 10 }),
});

const extractColor: ToolEntry<ExtractColorParams> = {
	id: "extract-color-from-png",
	title: "Extract Color from PNG",
	description:
		"Keeps only pixels close to the chosen color and makes everything else transparent — the inverse of Remove Color.",
	category: "analyze",
	schema: extractColorSchema,
	run: (img, p) => extractByColor(img, p.color, p.tolerance),
};

interface MaskParams {
	mode: "binary" | "highlight";
	color: string;
	opacity: number;
}

const maskBaseFields = {
	mode: field.select({
		default: "binary",
		options: [
			{ value: "binary", label: "Black & white mask" },
			{ value: "highlight", label: "Color highlight" },
		],
	}),
	color: field.color({ default: "#ff00aa" }),
	opacity: field.slider({ min: 0, max: 100, step: 5, default: 70 }),
};

function renderMask(
	img: Parameters<typeof renderPredicateMask>[0],
	p: MaskParams,
	predicate: (r: number, g: number, b: number, a: number) => boolean,
) {
	return renderPredicateMask(img, predicate, {
		mode: p.mode,
		color: p.color,
		opacityPercent: p.opacity,
	});
}

export const showTransparentSchema = toolSchema<MaskParams>({
	...maskBaseFields,
	mode: field.select({
		default: "highlight",
		options: [
			{ value: "binary", label: "Black & white mask" },
			{ value: "highlight", label: "Color highlight" },
		],
	}),
});

const showTransparent: ToolEntry<MaskParams> = {
	id: "show-transparent-png",
	title: "Show Transparent Areas PNG",
	description:
		"Highlights every transparent or semi-transparent pixel with the chosen color so gaps become obvious.",
	category: "analyze",
	schema: showTransparentSchema,
	run: (img, p) => renderMask(img, p, (_r, _g, _b, a) => a < 255),
};

interface GrayscalePixelsParams extends MaskParams {
	tolerance: number;
}

export const showGrayscalePixelsSchema = toolSchema<GrayscalePixelsParams>({
	...maskBaseFields,
	tolerance: field.slider({ min: 0, max: 64, step: 1, default: 0 }),
});

const showGrayscalePixels: ToolEntry<GrayscalePixelsParams> = {
	id: "show-grayscale-pixels-png",
	title: "Show Grayscale Pixels PNG",
	description:
		"Finds pixels whose channels are nearly equal and renders them as a mask. Tolerance is in channel units.",
	category: "analyze",
	schema: showGrayscalePixelsSchema,
	run: (img, p) =>
		renderMask(img, p, (r, g, b) => isGrayscaleish(r, g, b, p.tolerance)),
};

interface ColorPixelsParams extends MaskParams {
	tolerance: number;
}

export const showColorPixelsSchema = toolSchema<ColorPixelsParams>({
	...maskBaseFields,
	tolerance: field.slider({ min: 0, max: 64, step: 1, default: 8 }),
});

const showColorPixels: ToolEntry<ColorPixelsParams> = {
	id: "show-color-pixels-png",
	title: "Show Color Pixels PNG",
	description:
		"Finds colored (non-gray) pixels beyond the channel tolerance and renders them as a mask.",
	category: "analyze",
	schema: showColorPixelsSchema,
	run: (img, p) =>
		renderMask(img, p, (r, g, b) => !isGrayscaleish(r, g, b, p.tolerance)),
};

interface LightPixelParams extends MaskParams {
	threshold: number;
}

export const lightPixelMaskSchema = toolSchema<LightPixelParams>({
	...maskBaseFields,
	threshold: field.slider({ min: 0, max: 100, step: 1, default: 70 }),
});

const lightPixelMask: ToolEntry<LightPixelParams> = {
	id: "light-pixel-mask-png",
	title: "Light Pixel Mask PNG",
	description: "Selects pixels brighter than the luminance threshold.",
	category: "analyze",
	schema: lightPixelMaskSchema,
	run: (img, p) =>
		renderMask(img, p, (r, g, b) => luma01(r, g, b) >= p.threshold / 100),
};

interface DarkPixelParams extends MaskParams {
	threshold: number;
}

export const darkPixelMaskSchema = toolSchema<DarkPixelParams>({
	...maskBaseFields,
	threshold: field.slider({ min: 0, max: 100, step: 1, default: 30 }),
});

const darkPixelMask: ToolEntry<DarkPixelParams> = {
	id: "dark-pixel-mask-png",
	title: "Dark Pixel Mask PNG",
	description: "Selects pixels darker than the luminance threshold.",
	category: "analyze",
	schema: darkPixelMaskSchema,
	run: (img, p) =>
		renderMask(img, p, (r, g, b) => luma01(r, g, b) <= p.threshold / 100),
};

interface UniqueColorParams extends MaskParams {
	rarity: number;
}

export const uniqueColorMaskSchema = toolSchema<UniqueColorParams>({
	...maskBaseFields,
	rarity: field.slider({ min: 1, max: 50, step: 1, default: 1 }),
});

const uniqueColorMask: ToolEntry<UniqueColorParams> = {
	id: "unique-color-mask-png",
	title: "Unique Color Mask PNG",
	description:
		"Selects colors that occur no more than the given number of times — rare and one-off pixels.",
	category: "analyze",
	schema: uniqueColorMaskSchema,
	run: (img, p) => renderMask(img, p, rarityPredicate(img, p.rarity)),
};

export const analyzeEntries = [
	extractColor,
	showTransparent,
	showGrayscalePixels,
	showColorPixels,
	lightPixelMask,
	darkPixelMask,
	uniqueColorMask,
];
