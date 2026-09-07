import { renderEmoji, renderTextToImage } from "../core/domText";
import { colorSpectrum, drawGrid, randomColorBlocks } from "../core/gen-tools";
import { noiseImage, solidImage } from "../core/generate";
import { changeCanvasSize } from "../core/geometry";
import type { PixelImage } from "../core/types";
import {
	analogousSet,
	complementarySet,
	hexToRgb,
	monochromaticSet,
	renderBlend,
	renderSwatches,
	renderWheel,
	shadeSet,
	stepColors,
	tetradicSet,
	triadicSet,
} from "../core/palette";
import {
	field,
	toolSchema,
	type ColorPair,
	type Dimension,
	type FontStyle,
	type Gradient,
} from "../registry-schema";
import type { ToolEntry } from "./types";

function rgba(hex: string): [number, number, number, number] {
	const { r, g, b } = hexToRgb(hex);
	return [r, g, b, 255];
}

/**
 * Линейный градиент по произвольному углу. 0° — слева направо, 90° — сверху
 * вниз (рост угла по часовой, ось Y вниз). Угол задаёт направление оси
 * градиента; t пикселя — нормализованная проекция на эту ось.
 */
function angleGradient(
	width: number,
	height: number,
	fromRgba: [number, number, number, number],
	toRgba: [number, number, number, number],
	angle: number,
): PixelImage {
	const rad = (angle * Math.PI) / 180;
	const vx = Math.cos(rad);
	const vy = Math.sin(rad);
	// Минимум и максимум проекции на ось достигаются в противоположных углах.
	const rightX = vx >= 0 ? width - 1 : 0;
	const bottomY = vy >= 0 ? height - 1 : 0;
	const projMax = rightX * vx + bottomY * vy;
	const projMin = (width - 1 - rightX) * vx + (height - 1 - bottomY) * vy;
	const span = projMax - projMin;
	const out: PixelImage = {
		width,
		height,
		data: new Uint8ClampedArray(width * height * 4),
	};
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const t = span === 0 ? 0 : (x * vx + y * vy - projMin) / span;
			const i = (y * width + x) * 4;
			out.data[i] = fromRgba[0] + (toRgba[0] - fromRgba[0]) * t;
			out.data[i + 1] = fromRgba[1] + (toRgba[1] - fromRgba[1]) * t;
			out.data[i + 2] = fromRgba[2] + (toRgba[2] - fromRgba[2]) * t;
			out.data[i + 3] = fromRgba[3] + (toRgba[3] - fromRgba[3]) * t;
		}
	}
	return out;
}

interface CreateEmptyParams {
	size: Dimension;
	transparent: boolean;
	color: string;
}

export const createEmptySchema = toolSchema<CreateEmptyParams>(
	{
		size: field.dimension({ min: 1, max: 20000, width: 800, height: 600 }),
		transparent: field.checkbox({ default: true }),
		color: field.color({ default: "#ffffff" }),
	},
	{
		layout: {
			groups: [
				{ title: "Canvas", fields: ["size"] },
				{ title: "Fill", fields: ["transparent", "color"] },
			],
		},
	},
);

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
	gradient: Gradient;
}

export const linearGradientSchema = toolSchema<LinearGradientParams>(
	{
		size: field.dimension({ min: 1, max: 20000, width: 800, height: 600 }),
		gradient: field.gradient({ from: "#000000", to: "#ffffff", angle: 0 }),
	},
	{
		layout: {
			groups: [
				{ title: "Canvas", fields: ["size"] },
				{ title: "Colors", fields: ["gradient"] },
			],
		},
	},
);

const linearGradient: ToolEntry<LinearGradientParams> = {
	id: "linear-gradient-png",
	title: "Create gradient PNG",
	description:
		"Generates a smooth transition between two colors along a chosen angle.",
	category: "generate",
	schema: linearGradientSchema,
	generate: (p) => {
		const w = Math.trunc(p.size.width);
		const h = Math.trunc(p.size.height);
		return angleGradient(
			w,
			h,
			rgba(p.gradient.from),
			rgba(p.gradient.to),
			p.gradient.angle,
		);
	},
};

interface ColorSpectrumParams {
	size: Dimension;
	direction: "horizontal" | "vertical";
	saturation: number;
	lightness: number;
}

export const colorSpectrumSchema = toolSchema<ColorSpectrumParams>(
	{
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
	},
	{
		layout: {
			groups: [
				{ title: "Canvas", fields: ["size"] },
				{ title: "Spectrum", fields: ["direction", "saturation", "lightness"] },
			],
		},
	},
);

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

export const randomColorsSchema = toolSchema<RandomColorsParams>(
	{
		size: field.dimension({ min: 1, max: 5000, width: 512, height: 512 }),
		blockSize: field.slider({ min: 4, max: 256, step: 2, default: 64 }),
		seed: field.number({ min: 0, max: 999999999, step: 1, default: 7 }),
	},
	{
		layout: {
			groups: [
				{ title: "Canvas", fields: ["size"] },
				{ title: "Random", cols: 2, fields: ["blockSize", "seed"] },
			],
		},
	},
);

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

export const drawGridSchema = toolSchema<DrawGridParams>(
	{
		size: field.dimension({ min: 1, max: 5000, width: 512, height: 512 }),
		cols: field.slider({ min: 1, max: 64, step: 1, default: 8 }),
		rows: field.slider({ min: 1, max: 64, step: 1, default: 8 }),
		lineWidth: field.slider({ min: 1, max: 40, step: 1, default: 2 }),
		color: field.color({ default: "#111318" }),
		transparentBg: field.checkbox({ default: true }),
	},
	{
		layout: {
			groups: [
				{ title: "Canvas", fields: ["size"] },
				{
					title: "Grid",
					cols: 2,
					fields: ["cols", "rows", "lineWidth", "color", "transparentBg"],
				},
			],
		},
	},
);

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

export const placeholderSchema = toolSchema<PlaceholderParams>(
	{
		size: field.dimension({ min: 1, max: 5000, width: 800, height: 400 }),
		backgroundColor: field.color({ default: "#dfe2e8" }),
		color: field.color({ default: "#5c6470" }),
		showText: field.checkbox({ default: true }),
	},
	{
		layout: {
			groups: [
				{ title: "Canvas", fields: ["size"] },
				{ title: "Colors", cols: 2, fields: ["backgroundColor", "color"] },
				{ title: "Text", fields: ["showText"] },
			],
		},
	},
);

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

export const stepColorsSchema = toolSchema<StepColorsParams>(
	{
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
	},
	{
		layout: {
			groups: [
				{ title: "Colors", fields: ["pair"] },
				{ title: "Output", cols: 2, fields: ["steps", "width", "layout"] },
			],
		},
	},
);

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

interface EmojiToPngParams {
	emoji: string;
	size: number;
}

export const emojiToPngSchema = toolSchema<EmojiToPngParams>({
	emoji: field.text({ default: "😀" }),
	size: field.slider({ min: 32, max: 1024, step: 16, default: 256 }),
});

const emojiToPng: ToolEntry<EmojiToPngParams> = {
	id: "emoji-to-png",
	title: "Emoji to PNG",
	description:
		"Renders an emoji or any Unicode symbol as a transparent PNG of the chosen size.",
	category: "generate",
	domOnly: true,
	schema: emojiToPngSchema,
	generate: (p) => renderEmoji(p.emoji, Math.round(p.size)),
};

interface ColorWheelParams {
	size: number;
	lightness: number;
}

export const colorWheelSchema = toolSchema<ColorWheelParams>({
	size: field.slider({ min: 128, max: 1024, step: 16, default: 512 }),
	lightness: field.slider({ min: 0, max: 100, step: 1, default: 50 }),
});

const colorWheelTool: ToolEntry<ColorWheelParams> = {
	id: "color-wheel-png",
	title: "Color Wheel PNG",
	description:
		"Generates an HSL color wheel: hue around the circle, saturation from center to edge, chosen lightness.",
	category: "generate",
	schema: colorWheelSchema,
	generate: (p) => renderWheel(p.size, p.lightness),
};

interface PaletteBaseParams {
	baseColor: string;
	width: number;
	layout: "strip" | "grid";
}

const paletteBaseSchema = {
	baseColor: field.color({ default: "#2563eb" }),
	width: field.slider({ min: 128, max: 1024, step: 16, default: 512 }),
	layout: field.select({
		default: "grid",
		options: [
			{ value: "grid", label: "Grid" },
			{ value: "strip", label: "Strip" },
		],
	}),
};

const paletteLayoutGroup = {
	layout: {
		groups: [
			{ title: "Base color", fields: ["baseColor"] },
			{
				title: "Output",
				cols: 2,
				fields: ["width", "layout"],
			},
		],
	},
};

const complementaryTool: ToolEntry<PaletteBaseParams> = {
	id: "complementary-png",
	title: "Complementary Palette PNG",
	description:
		"Two opposite colors on the color wheel — the base and its complement.",
	category: "generate",
	schema: toolSchema<PaletteBaseParams>(
		{ ...paletteBaseSchema },
		{ ...paletteLayoutGroup },
	),
	generate: (p) =>
		renderSwatches(complementarySet(p.baseColor), p.width, p.layout),
};

const triadicTool: ToolEntry<PaletteBaseParams> = {
	id: "triadic-png",
	title: "Triadic Palette PNG",
	description: "Three colors evenly spaced 120° apart on the color wheel.",
	category: "generate",
	schema: toolSchema<PaletteBaseParams>(
		{
			...paletteBaseSchema,
			baseColor: field.color({ default: "#ff0000" }),
		},
		{ ...paletteLayoutGroup },
	),
	generate: (p) => renderSwatches(triadicSet(p.baseColor), p.width, p.layout),
};

const tetradicTool: ToolEntry<PaletteBaseParams> = {
	id: "tetradic-png",
	title: "Tetradic Palette PNG",
	description:
		"Four colors in two complementary pairs, 90° apart on the wheel.",
	category: "generate",
	schema: toolSchema<PaletteBaseParams>(
		{
			...paletteBaseSchema,
			baseColor: field.color({ default: "#8000ff" }),
		},
		{ ...paletteLayoutGroup },
	),
	generate: (p) => renderSwatches(tetradicSet(p.baseColor), p.width, p.layout),
};

interface AnalogousParams extends PaletteBaseParams {
	spread: number;
	count: number;
}

const analogousTool: ToolEntry<AnalogousParams> = {
	id: "analogous-png",
	title: "Analogous Palette PNG",
	description:
		"Neighboring hues around the base color — calm, related color scheme.",
	category: "generate",
	schema: toolSchema<AnalogousParams>(
		{
			...paletteBaseSchema,
			baseColor: field.color({ default: "#22c55e" }),
			spread: field.slider({ min: 10, max: 90, step: 5, default: 30 }),
			count: field.slider({ min: 3, max: 9, step: 1, default: 5 }),
		},
		{ ...paletteLayoutGroup },
	),
	generate: (p) =>
		renderSwatches(
			analogousSet(p.baseColor, p.spread, p.count),
			p.width,
			p.layout,
		),
};

interface MonochromaticParams extends PaletteBaseParams {
	count: number;
	range: number;
}

const monochromaticTool: ToolEntry<MonochromaticParams> = {
	id: "monochromatic-png",
	title: "Monochromatic Palette PNG",
	description:
		"Tones of a single hue: lightness varies within the chosen range, hue and saturation stay fixed.",
	category: "generate",
	schema: toolSchema<MonochromaticParams>(
		{
			...paletteBaseSchema,
			baseColor: field.color({ default: "#0ea5e9" }),
			count: field.slider({ min: 2, max: 9, step: 1, default: 5 }),
			range: field.slider({ min: 10, max: 90, step: 5, default: 40 }),
		},
		{ ...paletteLayoutGroup },
	),
	generate: (p) =>
		renderSwatches(
			monochromaticSet(p.baseColor, p.count, p.range),
			p.width,
			p.layout,
		),
};

interface ShadesParams extends PaletteBaseParams {
	count: number;
	depth: number;
}

const shadesTool: ToolEntry<ShadesParams> = {
	id: "shades-png",
	title: "Shade Ramp PNG",
	description: "A ramp of the base color getting darker step by step.",
	category: "generate",
	schema: toolSchema<ShadesParams>(
		{
			...paletteBaseSchema,
			baseColor: field.color({ default: "#f59e0b" }),
			count: field.slider({ min: 2, max: 9, step: 1, default: 5 }),
			depth: field.slider({ min: 10, max: 90, step: 5, default: 50 }),
		},
		{ ...paletteLayoutGroup },
	),
	generate: (p) =>
		renderSwatches(shadeSet(p.baseColor, p.count, p.depth), p.width, p.layout),
};

interface TextToPngParams {
	text: string;
	style: FontStyle;
	transparentBg: boolean;
	backgroundColor: string;
	padding: number;
}

export const textToPngSchema = toolSchema<TextToPngParams>(
	{
		text: field.text({ default: "Hello!", placeholder: "Your text" }),
		style: field.fontStyle({
			min: 8,
			max: 300,
			size: 96,
			font: "sans",
			bold: true,
			color: "#111318",
		}),
		transparentBg: field.checkbox({ default: false }),
		backgroundColor: field.color({ default: "#ffffff" }),
		padding: field.slider({ min: 0, max: 200, step: 2, default: 24 }),
	},
	{
		layout: {
			groups: [
				{ title: "Text", fields: ["text", "style"] },
				{ title: "Background", fields: ["transparentBg", "backgroundColor"] },
				{ title: "Padding", fields: ["padding"] },
			],
		},
	},
);

const textToPng: ToolEntry<TextToPngParams> = {
	id: "text-to-png",
	title: "Text to PNG",
	description:
		"Creates a PNG image from text: the canvas is sized to fit the label plus padding.",
	category: "generate",
	domOnly: true,
	schema: textToPngSchema,
	generate: (p) =>
		renderTextToImage({
			text: p.text,
			fontSize: p.style.size,
			font: p.style.font,
			bold: p.style.bold,
			color: p.style.color,
			backgroundColor: p.backgroundColor,
			transparentBg: p.transparentBg,
			padding: p.padding,
		}),
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
	emojiToPng,
	colorWheelTool,
	complementaryTool,
	triadicTool,
	tetradicTool,
	analogousTool,
	monochromaticTool,
	shadesTool,
	textToPng,
];
