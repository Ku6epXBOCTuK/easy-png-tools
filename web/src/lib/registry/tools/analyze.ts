import {
	hasTransparency,
	isGrayscale,
	orientationOf,
} from "../../core/analyze";
import { encode } from "../../core/io";
import {
	extractByColor,
	isGrayscaleish,
	luma01,
	rarityPredicate,
	renderPredicateMask,
} from "../../core/masks";
import { base64ToBytes, looksLikePng, stripDataUri } from "../../core/textio";
import { field, toolSchema } from "../../registry-schema";
import { imgTool, textGen, type Tool } from "../types";

interface ExtractColorParams {
	color: string;
	tolerance: number;
}

export const extractColorSchema = toolSchema<ExtractColorParams>({
	color: field.color({ label: "fields.color", default: "#00ff88" }),
	tolerance: field.slider({
		label: "fields.colorTolerance",
		min: 0,
		max: 50,
		step: 1,
		default: 10,
	}),
});

const extractColor: Tool<ExtractColorParams> = {
	id: "extract-color-from-png",
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
		label: "fields.mode",
		default: "binary",
		options: [
			{ value: "binary", label: "Black & white mask" },
			{ value: "highlight", label: "Color highlight" },
		],
	}),
	color: field.color({ label: "fields.highlightColor", default: "#ff00aa" }),
	opacity: field.slider({
		label: "fields.opacity",
		min: 0,
		max: 100,
		step: 5,
		default: 70,
	}),
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
		label: "fields.mode",
		default: "highlight",
		options: [
			{ value: "binary", label: "Black & white mask" },
			{ value: "highlight", label: "Color highlight" },
		],
	}),
});

const showTransparent: Tool<MaskParams> = {
	id: "show-transparent-png",
	schema: showTransparentSchema,
	input: "image",
	run: imgTool((img, p) => renderMask(img, p, (_r, _g, _b, a) => a < 255)),
};

interface GrayscalePixelsParams extends MaskParams {
	tolerance: number;
}

export const showGrayscalePixelsSchema = toolSchema<GrayscalePixelsParams>({
	...maskBaseFields,
	tolerance: field.slider({
		label: "fields.channelTolerance",
		min: 0,
		max: 64,
		step: 1,
		default: 0,
	}),
});

const showGrayscalePixels: Tool<GrayscalePixelsParams> = {
	id: "show-grayscale-pixels-png",
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
	tolerance: field.slider({
		label: "fields.channelTolerance",
		min: 0,
		max: 64,
		step: 1,
		default: 8,
	}),
});

const showColorPixels: Tool<ColorPixelsParams> = {
	id: "show-color-pixels-png",
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
	threshold: field.slider({
		label: "fields.lumaThreshold",
		min: 0,
		max: 100,
		step: 1,
		default: 70,
	}),
});

const lightPixelMask: Tool<LightPixelParams> = {
	id: "light-pixel-mask-png",
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
	threshold: field.slider({
		label: "fields.lumaThreshold",
		min: 0,
		max: 100,
		step: 1,
		default: 30,
	}),
});

const darkPixelMask: Tool<DarkPixelParams> = {
	id: "dark-pixel-mask-png",
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
	rarity: field.slider({
		label: "fields.rarity",
		min: 1,
		max: 50,
		step: 1,
		default: 1,
	}),
});

const uniqueColorMask: Tool<UniqueColorParams> = {
	id: "unique-color-mask-png",
	schema: uniqueColorMaskSchema,
	input: "image",
	run: imgTool((img, p) => renderMask(img, p, rarityPredicate(img, p.rarity))),
};

interface NoParams {}

const emptySchema = toolSchema<NoParams>({});

const verifyIsPng: Tool<NoParams> = {
	id: "verify-is-png",
	schema: emptySchema,
	input: "text",
	result: "verdict",
	run: textGen((text) =>
		looksLikePng(base64ToBytes(stripDataUri(text))) ? "verifyYes" : "verifyNo",
	),
};

const pngIsGrayscale: Tool<NoParams> = {
	id: "png-is-grayscale",
	schema: emptySchema,
	input: "image",
	result: "verdict",
	run: imgTool((img) => (isGrayscale(img) ? "grayscaleYes" : "grayscaleNo")),
};

const pngFileSize: Tool<NoParams> = {
	id: "png-file-size",
	schema: emptySchema,
	domOnly: true,
	input: "image",
	result: "verdict",
	run: imgTool(async (img) => {
		const blob = await encode(img, "image/png");
		const kb = blob.size / 1024;
		const kbText = kb >= 100 ? Math.round(kb).toString() : kb.toFixed(1);
		return { key: "line", vars: { kb: kbText } };
	}),
};

const pngIsTransparent: Tool<NoParams> = {
	id: "png-is-transparent",
	schema: emptySchema,
	input: "image",
	result: "verdict",
	run: imgTool((img) =>
		hasTransparency(img) ? "transparentYes" : "transparentNo",
	),
};

const pngOrientation: Tool<NoParams> = {
	id: "png-orientation",
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

export const analyzeTools = [
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
