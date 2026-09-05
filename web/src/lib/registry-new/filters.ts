import type { ToolEntry } from "./types";
import { field, toolSchema } from "../registry-schema";
import { addNoise, pixelate, shuffleBlocks } from "../core/pixel-fx";
import { vignette } from "../core/effects";
import { jpegRoundtrip } from "../core/io";

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
	run: (img, p) => vignette(img, p.strength),
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
	run: (img, p) => pixelate(img, p.blockSize),
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
	run: (img, p) => shuffleBlocks(img, p.blockSize, p.seed),
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
	run: (img, p) => addNoise(img, p.amount, p.mode, p.seed),
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
	run: (img, p) => jpegRoundtrip(img, p.quality),
};

export const filtersEntries = [
	vignetteTool,
	pixelateTool,
	randomizePixels,
	addNoiseTool,
	jpegArtifacts,
];
