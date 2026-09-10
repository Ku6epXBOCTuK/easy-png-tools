import { imgTool, type ToolEntry } from "./types";
import { field, toolSchema } from "../registry-schema";
import {
	addNoise,
	pixelate,
	shuffleBlocks,
	silhouette,
} from "../core/pixel-fx";
import { gaussianBlur, sharpen as sharpenImage } from "../core/convolution";
import { vignette } from "../core/effects";
import { jpegRoundtrip } from "../core/io";

interface BlurParams {
	radius: number;
}

export const blurSchema = toolSchema<BlurParams>({
	radius: field.slider({ min: 1, max: 32, step: 1, default: 4 }),
});

const blurTool: ToolEntry<BlurParams> = {
	id: "blur-png",
	title: "Blur PNG",
	description:
		"Gaussian blur: three passes of separable box blur — fast at any radius. Transparent edges do not darken.",
	category: "filters",
	schema: blurSchema,
	input: "image",
	run: imgTool((img, p) => gaussianBlur(img, p.radius)),
};

interface SharpenParams {
	strength: number;
}

export const sharpenSchema = toolSchema<SharpenParams>({
	strength: field.slider({ min: 0, max: 100, step: 1, default: 50 }),
});

const sharpenTool: ToolEntry<SharpenParams> = {
	id: "sharpen-png",
	title: "Sharpen PNG",
	description:
		"Emphasizes edges with a sharpening kernel; strength sets the blend with the original. 0% means no change.",
	category: "filters",
	schema: sharpenSchema,
	input: "image",
	run: imgTool((img, p) => sharpenImage(img, p.strength)),
};

interface SilhouetteParams {
	color: string;
	threshold: number;
}

export const silhouetteSchema = toolSchema<SilhouetteParams>({
	color: field.color({ default: "#111318" }),
	threshold: field.slider({ min: 0, max: 100, step: 1, default: 10 }),
});

const silhouetteTool: ToolEntry<SilhouetteParams> = {
	id: "silhouette-png",
	title: "Silhouette PNG",
	description:
		"Turns all visible pixels into a single solid color while keeping their transparency — instant silhouette.",
	category: "filters",
	schema: silhouetteSchema,
	input: "image",
	run: imgTool((img, p) => silhouette(img, p.color, p.threshold * 2.55)),
};

interface VignetteParams {
	strength: number;
}

export const vignetteSchema = toolSchema<VignetteParams>({
	strength: field.slider({ min: 0, max: 100, step: 5, default: 50 }),
});

const vignetteTool: ToolEntry<VignetteParams> = {
	id: "vignette-png",
	title: "Vignette PNG",
	description:
		"Smoothly darkens the edges of the image, leaving the center untouched.",
	category: "filters",
	schema: vignetteSchema,
	input: "image",
	run: imgTool((img, p) => vignette(img, p.strength)),
};

interface PixelateParams {
	blockSize: number;
}

export const pixelateSchema = toolSchema<PixelateParams>({
	blockSize: field.slider({ min: 2, max: 64, step: 1, default: 8 }),
});

const pixelateTool: ToolEntry<PixelateParams> = {
	id: "pixelate-png",
	title: "Pixelate PNG",
	description:
		"Averages every blockSize×blockSize area into one color — classic mosaic.",
	category: "filters",
	schema: pixelateSchema,
	input: "image",
	run: imgTool((img, p) => pixelate(img, p.blockSize)),
};

interface RandomizePixelsParams {
	blockSize: number;
	seed: number;
}

export const randomizePixelsSchema = toolSchema<RandomizePixelsParams>(
	{
		blockSize: field.slider({ min: 1, max: 64, step: 1, default: 8 }),
		seed: field.number({ min: 0, max: 999999, step: 1, default: 42 }),
	},
	{
		layout: {
			groups: [{ title: "Blocks", cols: 2, fields: ["blockSize", "seed"] }],
		},
	},
);

const randomizePixels: ToolEntry<RandomizePixelsParams> = {
	id: "randomize-pixels-png",
	title: "Randomize Pixels PNG",
	description:
		"Shuffles blocks of the image between positions. Same seed gives the same arrangement.",
	category: "filters",
	schema: randomizePixelsSchema,
	input: "image",
	run: imgTool((img, p) => shuffleBlocks(img, p.blockSize, p.seed)),
};

interface AddNoiseParams {
	amount: number;
	mode: "mono" | "color";
	seed: number;
}

export const addNoiseSchema = toolSchema<AddNoiseParams>(
	{
		amount: field.slider({ min: 0, max: 100, step: 1, default: 25 }),
		mode: field.select({
			default: "mono",
			options: [
				{ value: "mono", label: "Monochrome grain" },
				{ value: "color", label: "Color noise" },
			],
		}),
		seed: field.number({ min: 0, max: 999999, step: 1, default: 1234 }),
	},
	{
		layout: {
			groups: [
				{ title: "Noise", cols: 2, fields: ["amount", "mode"] },
				{ title: "Seed", fields: ["seed"] },
			],
		},
	},
);

const addNoiseTool: ToolEntry<AddNoiseParams> = {
	id: "add-noise-png",
	title: "Add Noise to PNG",
	description:
		"Adds film-grain style noise. Deterministic by seed; monochrome keeps original hue balance.",
	category: "filters",
	schema: addNoiseSchema,
	input: "image",
	run: imgTool((img, p) => addNoise(img, p.amount, p.mode, p.seed)),
};

interface JpegArtifactsParams {
	quality: number;
}

export const jpegArtifactsSchema = toolSchema<JpegArtifactsParams>({
	quality: field.slider({ min: 1, max: 50, step: 1, default: 10 }),
});

const jpegArtifacts: ToolEntry<JpegArtifactsParams> = {
	id: "jpeg-artifacts-png",
	title: "JPEG artifacts",
	description:
		"Simulates low-quality JPEG re-compression — visible blocks and smeared colors.",
	category: "filters",
	schema: jpegArtifactsSchema,
	input: "image",
	run: imgTool((img, p) => jpegRoundtrip(img, p.quality)),
};

export const filtersEntries = [
	vignetteTool,
	pixelateTool,
	randomizePixels,
	addNoiseTool,
	jpegArtifacts,
	blurTool,
	sharpenTool,
	silhouetteTool,
];
