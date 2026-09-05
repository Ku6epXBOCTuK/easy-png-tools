import { renderTextToImage } from "../core/domText";
import { colorSpectrum, drawGrid, randomColorBlocks } from "../core/gen-tools";
import { gradientImage, noiseImage, solidImage } from "../core/generate";
import { changeCanvasSize } from "../core/geometry";
import {
	hexToRgb,
	renderBlend,
	renderSwatches,
	stepColors,
} from "../core/palette";
import {
	field,
	toolSchema,
	type ColorPair,
	type Dimension,
} from "../registry-schema";
import type { ToolEntry } from "./types";

function rgba(hex: string): [number, number, number, number] {
	const { r, g, b } = hexToRgb(hex);
	return [r, g, b, 255];
}

interface CreateEmptyParams {
	size: Dimension;
	transparent: boolean;
	color: string;
}

export const createEmptySchema = toolSchema<CreateEmptyParams>({
	size: field.dimension({ min: 1, max: 20000, width: 800, height: 600 }),
	transparent: field.checkbox({ default: true }),
	color: field.color({ default: "#ffffff" }),
});

const createEmpty: ToolEntry<CreateEmptyParams> = {
	id: "create-empty-png",
	title: "Create empty PNG",
	description:
		"Creates a blank canvas of the chosen dimensions, either transparent or filled with a solid color.",
	category: "generate",
	schema: createEmptySchema,
	generate: (p) => {
		const w = Math.trunc(p.size.width);
		const h = Math.trunc(p.size.height);
		if (p.transparent) {
			return solidImage(w, h, [0, 0, 0, 0]);
		}
		return solidImage(w, h, rgba(p.color));
	},
};

interface SingleColorParams {
	size: Dimension;
	color: string;
}

export const singleColorSchema = toolSchema<SingleColorParams>({
	size: field.dimension({ min: 1, max: 20000, width: 256, height: 256 }),
	color: field.color({ default: "#ff0000" }),
});

const singleColor: ToolEntry<SingleColorParams> = {
	id: "single-color-png",
	title: "Create solid color PNG",
	description: "Generates a rectangle of the given size and color.",
	category: "generate",
	schema: singleColorSchema,
	generate: (p) => {
		const w = Math.trunc(p.size.width);
		const h = Math.trunc(p.size.height);
		return solidImage(w, h, rgba(p.color));
	},
};

interface RandomNoiseParams {
	size: Dimension;
	seed: number;
}

export const randomNoiseSchema = toolSchema<RandomNoiseParams>({
	size: field.dimension({ min: 1, max: 5000, width: 512, height: 512 }),
	seed: field.number({ min: 0, max: 999999999, step: 1, default: 1 }),
});

const randomNoise: ToolEntry<RandomNoiseParams> = {
	id: "random-noise-png",
	title: "Create random noise PNG",
	description:
		"Generates an image with random pixels. The seed fixes the result: one seed — one image.",
	category: "generate",
	schema: randomNoiseSchema,
	generate: (p) => {
		const w = Math.trunc(p.size.width);
		const h = Math.trunc(p.size.height);
		return noiseImage(w, h, p.seed);
	},
};

interface LinearGradientParams {
	size: Dimension;
	pair: ColorPair;
	direction: "horizontal" | "vertical";
}

export const linearGradientSchema = toolSchema<LinearGradientParams>({
	size: field.dimension({ min: 1, max: 20000, width: 800, height: 600 }),
	pair: field.colorPair({ from: "#000000", to: "#ffffff" }),
	direction: field.select({
		default: "horizontal",
		options: [
			{ value: "horizontal", label: "Horizontal" },
			{ value: "vertical", label: "Vertical" },
		],
	}),
});

const linearGradient: ToolEntry<LinearGradientParams> = {
	id: "linear-gradient-png",
	title: "Create gradient PNG",
	description:
		"Generates a smooth transition between two colors, horizontally or vertically.",
	category: "generate",
	schema: linearGradientSchema,
	generate: (p) => {
		const w = Math.trunc(p.size.width);
		const h = Math.trunc(p.size.height);
		return gradientImage(w, h, rgba(p.pair.from), rgba(p.pair.to), p.direction);
	},
};

interface ColorSpectrumParams {
	size: Dimension;
	direction: "horizontal" | "vertical";
	saturation: number;
	lightness: number;
}

export const colorSpectrumSchema = toolSchema<ColorSpectrumParams>({
	size: field.dimension({ min: 1, max: 5000, width: 1024, height: 128 }),
	direction: field.select({
		default: "horizontal",
		options: [
			{ value: "horizontal", label: "Horizontal" },
			{ value: "vertical", label: "Vertical" },
		],
	}),
	saturation: field.slider({ min: 0, max: 100, step: 1, default: 100 }),
	lightness: field.slider({ min: 0, max: 100, step: 1, default: 50 }),
});

const colorSpectrumTool: ToolEntry<ColorSpectrumParams> = {
	id: "color-spectrum-png",
	title: "Color Spectrum PNG",
	description:
		"Full hue rainbow 0–360° along the chosen axis with adjustable saturation and lightness.",
	category: "generate",
	schema: colorSpectrumSchema,
	generate: (p) => {
		const w = Math.trunc(p.size.width);
		const h = Math.trunc(p.size.height);
		return colorSpectrum(w, h, p.direction, p.saturation, p.lightness);
	},
};

interface RandomColorsParams {
	size: Dimension;
	blockSize: number;
	seed: number;
}

export const randomColorsSchema = toolSchema<RandomColorsParams>({
	size: field.dimension({ min: 1, max: 5000, width: 512, height: 512 }),
	blockSize: field.slider({ min: 4, max: 256, step: 2, default: 64 }),
	seed: field.number({ min: 0, max: 999999999, step: 1, default: 7 }),
});

const randomColors: ToolEntry<RandomColorsParams> = {
	id: "random-colors-png",
	title: "Random Color Blocks PNG",
	description:
		"Fills the canvas with random vivid color blocks. Deterministic by seed.",
	category: "generate",
	schema: randomColorsSchema,
	generate: (p) => {
		const w = Math.trunc(p.size.width);
		const h = Math.trunc(p.size.height);
		return randomColorBlocks(w, h, p.blockSize, p.seed);
	},
};

interface DrawGridParams {
	size: Dimension;
	cols: number;
	rows: number;
	lineWidth: number;
	color: string;
	transparentBg: boolean;
}

export const drawGridSchema = toolSchema<DrawGridParams>({
	size: field.dimension({ min: 1, max: 5000, width: 512, height: 512 }),
	cols: field.slider({ min: 1, max: 64, step: 1, default: 8 }),
	rows: field.slider({ min: 1, max: 64, step: 1, default: 8 }),
	lineWidth: field.slider({ min: 1, max: 40, step: 1, default: 2 }),
	color: field.color({ default: "#111318" }),
	transparentBg: field.checkbox({ default: true }),
});

const drawGridTool: ToolEntry<DrawGridParams> = {
	id: "draw-grid-png",
	title: "Draw Grid PNG",
	description:
		"Draws a grid with custom columns, rows and line width on a transparent or white background.",
	category: "generate",
	schema: drawGridSchema,
	generate: (p) => {
		const w = Math.trunc(p.size.width);
		const h = Math.trunc(p.size.height);
		return drawGrid(
			w,
			h,
			p.cols,
			p.rows,
			p.lineWidth,
			p.color,
			p.transparentBg,
		);
	},
};

interface PlaceholderParams {
	size: Dimension;
	backgroundColor: string;
	color: string;
	showText: boolean;
}

export const placeholderSchema = toolSchema<PlaceholderParams>({
	size: field.dimension({ min: 1, max: 5000, width: 800, height: 400 }),
	backgroundColor: field.color({ default: "#dfe2e8" }),
	color: field.color({ default: "#5c6470" }),
	showText: field.checkbox({ default: true }),
});

const placeholder: ToolEntry<PlaceholderParams> = {
	id: "placeholder-png",
	title: "Create Placeholder PNG",
	description:
		"Generates a placeholder rectangle with its dimensions printed in the center.",
	category: "generate",
	schema: placeholderSchema,
	generate: (p) => {
		const w = Math.trunc(p.size.width);
		const h = Math.trunc(p.size.height);
		let out = solidImage(w, h, rgba(p.backgroundColor));
		if (p.showText) {
			const label = renderTextToImage({
				text: `${w} × ${h}`,
				fontSize: Math.max(12, Math.round(Math.min(w, h) * 0.14)),
				font: "sans",
				bold: true,
				color: p.color,
				backgroundColor: p.backgroundColor,
				transparentBg: false,
				padding: 0,
			});
			out = changeCanvasSize(label, w, h, "center");
		}
		return out;
	},
};

interface BlendTwoParams {
	pair: ColorPair;
	width: number;
}

export const blendTwoSchema = toolSchema<BlendTwoParams>({
	pair: field.colorPair({ from: "#000000", to: "#ffffff" }),
	width: field.slider({ min: 128, max: 1024, step: 16, default: 512 }),
});

const blendTwo: ToolEntry<BlendTwoParams> = {
	id: "blend-two-png",
	title: "Blend Two Colors PNG",
	description: "A continuous horizontal gradient between two colors.",
	category: "generate",
	schema: blendTwoSchema,
	generate: (p) => renderBlend(p.pair.from, p.pair.to, p.width),
};

interface StepColorsParams {
	pair: ColorPair;
	steps: number;
	width: number;
	layout: "strip" | "grid";
}

export const stepColorsSchema = toolSchema<StepColorsParams>({
	pair: field.colorPair({ from: "#000000", to: "#ffffff" }),
	steps: field.slider({ min: 2, max: 12, step: 1, default: 6 }),
	width: field.slider({ min: 128, max: 1024, step: 16, default: 512 }),
	layout: field.select({
		default: "grid",
		options: [
			{ value: "grid", label: "Grid" },
			{ value: "strip", label: "Strip" },
		],
	}),
});

const stepColorsTool: ToolEntry<StepColorsParams> = {
	id: "step-colors-png",
	title: "Color Steps PNG",
	description: "A discrete set of evenly spaced steps between two colors.",
	category: "generate",
	schema: stepColorsSchema,
	generate: (p) =>
		renderSwatches(
			stepColors(p.pair.from, p.pair.to, p.steps),
			p.width,
			p.layout,
		),
};

export const generateEntries = [
	createEmpty,
	singleColor,
	randomNoise,
	linearGradient,
	colorSpectrumTool,
	randomColors,
	drawGridTool,
	placeholder,
	blendTwo,
	stepColorsTool,
];
