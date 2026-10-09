import { gaussianBlur, sharpen as sharpenImage } from "../../core/convolution";
import { vignette, vignetteMask } from "../../core/effects";
import { jpegRoundtrip } from "../../core/io";
import {
	addNoise,
	pixelate,
	shuffleBlocks,
	silhouette,
} from "../../core/pixel-fx";
import { field, toolSchema } from "../../registry-schema";
import { imgTool, requireSource, type Tool } from "../types";

interface BlurParams {
	radius: number;
}

export const blurSchema = toolSchema<BlurParams>({
	radius: field.slider({
		label: "fields.radius",
		min: 1,
		max: 32,
		step: 1,
		default: 4,
	}),
});

const blurTool: Tool<BlurParams> = {
	id: "blur",
	schema: blurSchema,
	input: "image",
	run: imgTool((img, p) => gaussianBlur(img, p.radius)),
};

interface SharpenParams {
	strength: number;
}

export const sharpenSchema = toolSchema<SharpenParams>({
	strength: field.slider({
		label: "fields.strength",
		min: 0,
		max: 100,
		step: 1,
		default: 50,
	}),
});

const sharpenTool: Tool<SharpenParams> = {
	id: "sharpen",
	schema: sharpenSchema,
	input: "image",
	run: imgTool((img, p) => sharpenImage(img, p.strength)),
};

interface SilhouetteParams {
	color: string;
	threshold: number;
}

export const silhouetteSchema = toolSchema<SilhouetteParams>({
	color: field.color({ label: "fields.fillColor", default: "#111318" }),
	threshold: field.slider({
		label: "fields.threshold",
		min: 0,
		max: 100,
		step: 1,
		default: 10,
	}),
});

const silhouetteTool: Tool<SilhouetteParams> = {
	id: "silhouette",
	schema: silhouetteSchema,
	input: "image",
	run: imgTool((img, p) => silhouette(img, p.color, p.threshold * 2.55)),
};

interface VignetteParams {
	strength: number;
}

export const vignetteSchema = toolSchema<VignetteParams>({
	strength: field.slider({
		label: "fields.strength",
		min: 0,
		max: 100,
		step: 5,
		default: 50,
	}),
});

const vignetteTool: Tool<VignetteParams> = {
	id: "vignette",
	schema: vignetteSchema,
	input: "image",
	run: imgTool((img, p) => vignette(img, p.strength)),
	runMask: (ctx) => {
		const img = requireSource(ctx);
		return vignetteMask(img.width, img.height, ctx.params.strength);
	},
};

interface PixelateParams {
	blockSize: number;
}

export const pixelateSchema = toolSchema<PixelateParams>({
	blockSize: field.slider({
		label: "fields.blockSize",
		min: 2,
		max: 64,
		step: 1,
		default: 8,
	}),
});

const pixelateTool: Tool<PixelateParams> = {
	id: "pixelate",
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
		blockSize: field.slider({
			label: "fields.blockSize",
			min: 1,
			max: 64,
			step: 1,
			default: 8,
		}),
		seed: field.number({
			label: "fields.seed",
			min: 0,
			max: 999999,
			step: 1,
			default: 42,
		}),
	},
	{
		layout: {
			groups: [
				{ title: "groups.blocks", cols: 2, fields: ["blockSize", "seed"] },
			],
		},
	},
);

const randomizePixels: Tool<RandomizePixelsParams> = {
	id: "randomize-pixels",
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
		amount: field.slider({
			label: "fields.amount",
			min: 0,
			max: 100,
			step: 1,
			default: 25,
		}),
		mode: field.select({
			label: "fields.mode",
			default: "mono",
			options: [
				{ value: "mono", label: "Monochrome grain" },
				{ value: "color", label: "Color noise" },
			],
		}),
		seed: field.number({
			label: "fields.seed",
			min: 0,
			max: 999999,
			step: 1,
			default: 1234,
		}),
	},
	{
		layout: {
			groups: [
				{ title: "groups.noise", cols: 2, fields: ["amount", "mode"] },
				{ title: "groups.seed", fields: ["seed"] },
			],
		},
	},
);

const addNoiseTool: Tool<AddNoiseParams> = {
	id: "add-noise",
	schema: addNoiseSchema,
	input: "image",
	run: imgTool((img, p) => addNoise(img, p.amount, p.mode, p.seed)),
};

interface JpegArtifactsParams {
	quality: number;
}

export const jpegArtifactsSchema = toolSchema<JpegArtifactsParams>({
	quality: field.slider({
		label: "fields.quality",
		min: 1,
		max: 50,
		step: 1,
		default: 10,
	}),
});

const jpegArtifacts: Tool<JpegArtifactsParams> = {
	id: "jpeg-artifacts",
	schema: jpegArtifactsSchema,
	input: "image",
	domOnly: true,
	run: imgTool((img, p) => jpegRoundtrip(img, p.quality)),
};

export const filtersTools = [
	vignetteTool,
	pixelateTool,
	randomizePixels,
	addNoiseTool,
	jpegArtifacts,
	blurTool,
	sharpenTool,
	silhouetteTool,
];
