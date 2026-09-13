import { imgTool, textGen, type ToolEntry } from "./types";
import { field, toolSchema } from "../registry-schema";
import {
	extractByColor,
	isGrayscaleish,
	luma01,
	rarityPredicate,
	renderPredicateMask,
} from "../core/masks";
import { hasTransparency, isGrayscale, orientationOf } from "../core/analyze";
import { encode } from "../core/io";
import { base64ToBytes, looksLikePng, stripDataUri } from "../core/textio";
import { t } from "../i18n/t";

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
	input: "image",
	run: imgTool((img, p) => extractByColor(img, p.color, p.tolerance)),
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
	input: "image",
	run: imgTool((img, p) => renderMask(img, p, (_r, _g, _b, a) => a < 255)),
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
	input: "image",
	run: imgTool((img, p) =>
		renderMask(img, p, (r, g, b) => isGrayscaleish(r, g, b, p.tolerance)),
	),
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
	input: "image",
	run: imgTool((img, p) =>
		renderMask(img, p, (r, g, b) => !isGrayscaleish(r, g, b, p.tolerance)),
	),
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
	input: "image",
	run: imgTool((img, p) =>
		renderMask(img, p, (r, g, b) => luma01(r, g, b) >= p.threshold / 100),
	),
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
	input: "image",
	run: imgTool((img, p) =>
		renderMask(img, p, (r, g, b) => luma01(r, g, b) <= p.threshold / 100),
	),
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
	input: "image",
	run: imgTool((img, p) => renderMask(img, p, rarityPredicate(img, p.rarity))),
};

interface NoParams {}

const emptySchema = toolSchema<NoParams>({});

const verifyIsPng: ToolEntry<NoParams> = {
	id: "verify-is-png",
	title: "Verify If Image Is a PNG",
	description:
		"Checks the signature of pasted base64 / data-uri content and reports whether it is a real PNG.",
	category: "analyze",
	schema: emptySchema,
	input: "text",
	result: "verdict",
	run: textGen((text) =>
		looksLikePng(base64ToBytes(stripDataUri(text))) ? "verifyYes" : "verifyNo",
	),
};

const pngIsGrayscale: ToolEntry<NoParams> = {
	id: "png-is-grayscale",
	title: "Check: is PNG grayscale?",
	description: "Reports whether the image consists only of shades of gray.",
	category: "analyze",
	schema: emptySchema,
	input: "image",
	result: "verdict",
	run: imgTool((img) => (isGrayscale(img) ? "grayscaleYes" : "grayscaleNo")),
};

const pngFileSize: ToolEntry<NoParams> = {
	id: "png-file-size",
	title: "PNG File Size",
	description: "Encodes the image as PNG and reports the resulting file size.",
	category: "analyze",
	schema: emptySchema,
	domOnly: true,
	input: "image",
	result: "verdict",
	run: imgTool(async (img) => {
		const blob = await encode(img, "image/png");
		const kb = blob.size / 1024;
		const kbText = kb >= 100 ? Math.round(kb).toString() : kb.toFixed(1);
		return t("tools.png-file-size.results.line", { kb: kbText });
	}),
};

const pngIsTransparent: ToolEntry<NoParams> = {
	id: "png-is-transparent",
	title: "Check: is PNG transparent?",
	description:
		"Reports whether the image contains transparent or semi-transparent pixels.",
	category: "analyze",
	schema: emptySchema,
	input: "image",
	result: "verdict",
	run: imgTool((img) =>
		hasTransparency(img) ? "transparentYes" : "transparentNo",
	),
};

const pngOrientation: ToolEntry<NoParams> = {
	id: "png-orientation",
	title: "PNG orientation",
	description: "Reports whether it is portrait, landscape or square.",
	category: "analyze",
	schema: emptySchema,
	input: "image",
	result: "verdict",
	run: imgTool((img) => {
		switch (orientationOf(img)) {
			case "portrait":
				return "orientationPortrait";
			case "landscape":
				return "orientationLandscape";
			default:
				return "orientationSquare";
		}
	}),
};

export const analyzeEntries = [
	extractColor,
	showTransparent,
	showGrayscalePixels,
	showColorPixels,
	lightPixelMask,
	darkPixelMask,
	uniqueColorMask,
	verifyIsPng,
	pngIsGrayscale,
	pngFileSize,
	pngIsTransparent,
	pngOrientation,
];
