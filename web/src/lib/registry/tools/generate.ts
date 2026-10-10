import { renderEmoji, renderTextToImage } from "../../core/domText";
import {
	colorSpectrum,
	drawGrid,
	randomColorBlocks,
} from "../../core/gen-tools";
import { noiseImage, solidImage } from "../../core/generate";
import { changeCanvasSize } from "../../core/geometry";
import {
	analogousSet,
	complementarySet,
	mixColors,
	monochromaticSet,
	parseHexColor,
	renderBlend,
	renderSwatches,
	renderWheel,
	shadeSet,
	sortPalette,
	stepColors,
	tetradicSet,
	triadicSet,
} from "../../core/palette";
import type { PixelImage } from "../../core/types";
import {
	field,
	toolSchema,
	type ColorPair,
	type Dimension,
	type FontStyle,
	type Gradient,
} from "../../registry-schema";
import { genTool, type Tool } from "../types";

function rgba(hex: string): [number, number, number, number] {
	const { r, g, b } = parseHexColor(hex);
	return [r, g, b, 255];
}

/**
 * Linear gradient at an arbitrary angle. 0 deg: left to right, 90 deg: top
 * to bottom (angle grows clockwise, Y axis down). The angle sets the
 * gradient axis direction; a pixel's t is its normalized projection on it.
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
	// Projection min and max on the axis are reached at opposite corners.
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
	opacity: number;
	color: string;
}

export const createEmptySchema = toolSchema<CreateEmptyParams>(
	{
		size: field.dimension({
			label: "fields.canvasSize",
			min: 1,
			max: 20000,
			width: 800,
			height: 600,
			presets: true,
		}),
		opacity: field.slider({
			label: "fields.opacity",
			min: 0,
			max: 100,
			step: 1,
			default: 0,
		}),
		color: field.color({ label: "fields.fillColor", default: "#ffffff" }),
	},
	{
		layout: {
			groups: [
				{ title: "groups.canvas", fields: ["size"] },
				{ title: "groups.fill", fields: ["opacity", "color"] },
			],
		},
	},
);

const createEmpty: Tool<CreateEmptyParams> = {
	id: "create-empty",
	schema: createEmptySchema,
	input: "none",
	run: genTool((p) => {
		const w = Math.trunc(p.size.width);
		const h = Math.trunc(p.size.height);
		const [r, g, b] = rgba(p.color).slice(0, 3);
		const alpha = Math.round((Math.trunc(p.opacity) / 100) * 255);
		return solidImage(w, h, [r, g, b, alpha]);
	}),
};

interface SingleColorParams {
	size: Dimension;
	color: string;
}

export const singleColorSchema = toolSchema<SingleColorParams>({
	size: field.dimension({
		label: "fields.canvasSize",
		min: 1,
		max: 20000,
		width: 256,
		height: 256,
		presets: true,
	}),
	color: field.color({ label: "fields.color", default: "#ff0000" }),
});

const singleColor: Tool<SingleColorParams> = {
	id: "single-color",
	schema: singleColorSchema,
	input: "none",
	run: genTool((p) => {
		const w = Math.trunc(p.size.width);
		const h = Math.trunc(p.size.height);
		return solidImage(w, h, rgba(p.color));
	}),
};

interface RandomNoiseParams {
	size: Dimension;
	seed: number;
}

export const randomNoiseSchema = toolSchema<RandomNoiseParams>({
	size: field.dimension({
		label: "fields.canvasSize",
		min: 1,
		max: 5000,
		width: 512,
		height: 512,
		presets: true,
	}),
	seed: field.number({
		label: "fields.seed",
		min: 0,
		max: 999999999,
		step: 1,
		default: 1,
	}),
});

const randomNoise: Tool<RandomNoiseParams> = {
	id: "random-noise",
	schema: randomNoiseSchema,
	input: "none",
	run: genTool((p) => {
		const w = Math.trunc(p.size.width);
		const h = Math.trunc(p.size.height);
		return noiseImage(w, h, p.seed);
	}),
};

interface LinearGradientParams {
	size: Dimension;
	gradient: Gradient;
}

export const linearGradientSchema = toolSchema<LinearGradientParams>(
	{
		size: field.dimension({
			label: "fields.canvasSize",
			min: 1,
			max: 20000,
			width: 800,
			height: 600,
			presets: true,
		}),
		gradient: field.gradient({
			label: "fields.gradient",
			from: "#000000",
			to: "#ffffff",
			angle: 0,
		}),
	},
	{
		layout: {
			groups: [
				{ title: "groups.canvas", fields: ["size"] },
				{ title: "groups.colors", fields: ["gradient"] },
			],
		},
	},
);

const linearGradient: Tool<LinearGradientParams> = {
	id: "linear-gradient",
	schema: linearGradientSchema,
	input: "none",
	run: genTool((p) => {
		const w = Math.trunc(p.size.width);
		const h = Math.trunc(p.size.height);
		return angleGradient(
			w,
			h,
			rgba(p.gradient.from),
			rgba(p.gradient.to),
			p.gradient.angle,
		);
	}),
};

interface ColorSpectrumParams {
	size: Dimension;
	direction: "horizontal" | "vertical";
	saturation: number;
	lightness: number;
}

export const colorSpectrumSchema = toolSchema<ColorSpectrumParams>(
	{
		size: field.dimension({
			label: "fields.canvasSize",
			min: 1,
			max: 5000,
			width: 1024,
			height: 128,
			presets: true,
		}),
		direction: field.select({
			label: "fields.direction",
			default: "horizontal",
			options: [
				{ value: "horizontal", label: "Horizontal" },
				{ value: "vertical", label: "Vertical" },
			],
		}),
		saturation: field.slider({
			label: "fields.saturation",
			min: 0,
			max: 100,
			step: 1,
			default: 100,
		}),
		lightness: field.slider({
			label: "fields.lightness",
			min: 0,
			max: 100,
			step: 1,
			default: 50,
		}),
	},
	{
		layout: {
			groups: [
				{ title: "groups.canvas", fields: ["size"] },
				{
					title: "groups.spectrum",
					fields: ["direction", "saturation", "lightness"],
				},
			],
		},
	},
);

const colorSpectrumTool: Tool<ColorSpectrumParams> = {
	id: "color-spectrum",
	schema: colorSpectrumSchema,
	input: "none",
	run: genTool((p) => {
		const w = Math.trunc(p.size.width);
		const h = Math.trunc(p.size.height);
		return colorSpectrum(w, h, p.direction, p.saturation, p.lightness);
	}),
};

interface RandomColorsParams {
	size: Dimension;
	blockSize: number;
	seed: number;
}

export const randomColorsSchema = toolSchema<RandomColorsParams>(
	{
		size: field.dimension({
			label: "fields.canvasSize",
			min: 1,
			max: 5000,
			width: 512,
			height: 512,
			presets: true,
		}),
		blockSize: field.slider({
			label: "fields.blockSize",
			min: 4,
			max: 256,
			step: 2,
			default: 64,
		}),
		seed: field.number({
			label: "fields.seed",
			min: 0,
			max: 999999999,
			step: 1,
			default: 7,
		}),
	},
	{
		layout: {
			groups: [
				{ title: "groups.canvas", fields: ["size"] },
				{ title: "groups.random", cols: 2, fields: ["blockSize", "seed"] },
			],
		},
	},
);

const randomColors: Tool<RandomColorsParams> = {
	id: "random-colors",
	schema: randomColorsSchema,
	input: "none",
	run: genTool((p) => {
		const w = Math.trunc(p.size.width);
		const h = Math.trunc(p.size.height);
		return randomColorBlocks(w, h, p.blockSize, p.seed);
	}),
};

interface DrawGridParams {
	size: Dimension;
	cols: number;
	rows: number;
	lineWidth: number;
	color: string;
	bgOpacity: number;
}

export const drawGridSchema = toolSchema<DrawGridParams>(
	{
		size: field.dimension({
			label: "fields.canvasSize",
			min: 1,
			max: 5000,
			width: 512,
			height: 512,
			presets: true,
		}),
		cols: field.slider({
			label: "fields.cols",
			min: 1,
			max: 64,
			step: 1,
			default: 8,
		}),
		rows: field.slider({
			label: "fields.rows",
			min: 1,
			max: 64,
			step: 1,
			default: 8,
		}),
		lineWidth: field.slider({
			label: "fields.lineWidth",
			min: 1,
			max: 40,
			step: 1,
			default: 2,
		}),
		color: field.color({ label: "fields.lineColor", default: "#111318" }),
		bgOpacity: field.slider({
			label: "fields.opacity",
			min: 0,
			max: 100,
			step: 1,
			default: 0,
		}),
	},
	{
		layout: {
			groups: [
				{ title: "groups.canvas", fields: ["size"] },
				{
					title: "groups.grid",
					cols: 2,
					fields: ["cols", "rows", "lineWidth", "color", "bgOpacity"],
				},
			],
		},
	},
);

const drawGridTool: Tool<DrawGridParams> = {
	id: "draw-grid",
	schema: drawGridSchema,
	input: "none",
	run: genTool((p) => {
		const w = Math.trunc(p.size.width);
		const h = Math.trunc(p.size.height);
		return drawGrid(w, h, p.cols, p.rows, p.lineWidth, p.color, p.bgOpacity);
	}),
};

interface PlaceholderParams {
	size: Dimension;
	backgroundColor: string;
	color: string;
	showText: boolean;
}

export const placeholderSchema = toolSchema<PlaceholderParams>(
	{
		size: field.dimension({
			label: "fields.canvasSize",
			min: 1,
			max: 5000,
			width: 800,
			height: 400,
			presets: true,
		}),
		backgroundColor: field.color({
			label: "fields.backgroundColor",
			default: "#dfe2e8",
		}),
		color: field.color({ label: "fields.textColor", default: "#5c6470" }),
		showText: field.checkbox({ label: "fields.showText", default: true }),
	},
	{
		layout: {
			groups: [
				{ title: "groups.canvas", fields: ["size"] },
				{
					title: "groups.colors",
					cols: 2,
					fields: ["backgroundColor", "color"],
				},
				{ title: "groups.text", fields: ["showText"] },
			],
		},
	},
);

const placeholder: Tool<PlaceholderParams> = {
	id: "placeholder",
	schema: placeholderSchema,
	input: "none",
	domOnly: true,
	run: genTool((p) => {
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
				bgOpacity: 100,
				padding: 0,
			});
			out = changeCanvasSize(label, w, h, "center");
		}
		return out;
	}),
};

interface BlendTwoParams {
	pair: ColorPair;
	width: number;
}

export const blendTwoSchema = toolSchema<BlendTwoParams>({
	pair: field.colorPair({
		label: "fields.colorPair",
		from: "#000000",
		to: "#ffffff",
	}),
	width: field.slider({
		label: "fields.width",
		min: 128,
		max: 1024,
		step: 16,
		default: 512,
	}),
});

const blendTwo: Tool<BlendTwoParams> = {
	id: "blend-two",
	schema: blendTwoSchema,
	input: "none",
	run: genTool((p) => renderBlend(p.pair.from, p.pair.to, p.width)),
};

interface StepColorsParams {
	pair: ColorPair;
	steps: number;
	width: number;
	layout: "strip" | "grid";
}

export const stepColorsSchema = toolSchema<StepColorsParams>(
	{
		pair: field.colorPair({
			label: "fields.colorPair",
			from: "#000000",
			to: "#ffffff",
		}),
		steps: field.slider({
			label: "fields.steps",
			min: 2,
			max: 12,
			step: 1,
			default: 6,
		}),
		width: field.slider({
			label: "fields.width",
			min: 128,
			max: 1024,
			step: 16,
			default: 512,
		}),
		layout: field.select({
			label: "fields.layout",
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
				{ title: "groups.colors", fields: ["pair"] },
				{
					title: "groups.output",
					cols: 2,
					fields: ["steps", "width", "layout"],
				},
			],
		},
	},
);

const stepColorsTool: Tool<StepColorsParams> = {
	id: "step-colors",
	schema: stepColorsSchema,
	input: "none",
	run: genTool((p) =>
		renderSwatches(
			stepColors(p.pair.from, p.pair.to, p.steps),
			p.width,
			p.layout,
		),
	),
};

interface EmojiToPngParams {
	emoji: string;
	size: number;
}

export const emojiToPngSchema = toolSchema<EmojiToPngParams>({
	emoji: field.text({ label: "fields.emoji", default: "😀" }),
	size: field.slider({
		label: "fields.imageSize",
		min: 32,
		max: 1024,
		step: 16,
		default: 256,
	}),
});

const emojiToPng: Tool<EmojiToPngParams> = {
	id: "from-emoji",
	domOnly: true,
	schema: emojiToPngSchema,
	input: "none",
	run: genTool((p) => renderEmoji(p.emoji, Math.round(p.size))),
};

interface ColorWheelParams {
	size: number;
	lightness: number;
}

export const colorWheelSchema = toolSchema<ColorWheelParams>({
	size: field.slider({
		label: "fields.imageSize",
		min: 128,
		max: 1024,
		step: 16,
		default: 512,
	}),
	lightness: field.slider({
		label: "fields.lightness",
		min: 0,
		max: 100,
		step: 1,
		default: 50,
	}),
});

const colorWheelTool: Tool<ColorWheelParams> = {
	id: "color-wheel",
	schema: colorWheelSchema,
	input: "none",
	run: genTool((p) => renderWheel(p.size, p.lightness)),
};

interface PaletteBaseParams {
	baseColor: string;
	width: number;
	layout: "strip" | "grid";
}

const paletteBaseSchema = {
	baseColor: field.color({ label: "fields.baseColor", default: "#2563eb" }),
	width: field.slider({
		label: "fields.width",
		min: 128,
		max: 1024,
		step: 16,
		default: 512,
	}),
	layout: field.select({
		label: "fields.layout",
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
			{ title: "groups.baseColor", fields: ["baseColor"] },
			{
				title: "groups.output",
				cols: 2,
				fields: ["width", "layout"],
			},
		],
	},
};

const complementaryTool: Tool<PaletteBaseParams> = {
	id: "complementary",
	schema: toolSchema<PaletteBaseParams>(
		{ ...paletteBaseSchema },
		{ ...paletteLayoutGroup },
	),
	input: "none",
	run: genTool((p) =>
		renderSwatches(complementarySet(p.baseColor), p.width, p.layout),
	),
};

const triadicTool: Tool<PaletteBaseParams> = {
	id: "triadic",
	schema: toolSchema<PaletteBaseParams>(
		{
			...paletteBaseSchema,
			baseColor: field.color({ label: "fields.baseColor", default: "#ff0000" }),
		},
		{ ...paletteLayoutGroup },
	),
	input: "none",
	run: genTool((p) =>
		renderSwatches(triadicSet(p.baseColor), p.width, p.layout),
	),
};

const tetradicTool: Tool<PaletteBaseParams> = {
	id: "tetradic",
	schema: toolSchema<PaletteBaseParams>(
		{
			...paletteBaseSchema,
			baseColor: field.color({ label: "fields.baseColor", default: "#8000ff" }),
		},
		{ ...paletteLayoutGroup },
	),
	input: "none",
	run: genTool((p) =>
		renderSwatches(tetradicSet(p.baseColor), p.width, p.layout),
	),
};

interface AnalogousParams extends PaletteBaseParams {
	spread: number;
	count: number;
}

const analogousTool: Tool<AnalogousParams> = {
	id: "analogous",
	schema: toolSchema<AnalogousParams>(
		{
			...paletteBaseSchema,
			baseColor: field.color({ label: "fields.baseColor", default: "#22c55e" }),
			spread: field.slider({
				label: "fields.spread",
				min: 10,
				max: 90,
				step: 5,
				default: 30,
			}),
			count: field.slider({
				label: "fields.count",
				min: 3,
				max: 9,
				step: 1,
				default: 5,
			}),
		},
		{ ...paletteLayoutGroup },
	),
	input: "none",
	run: genTool((p) =>
		renderSwatches(
			analogousSet(p.baseColor, p.spread, p.count),
			p.width,
			p.layout,
		),
	),
};

interface MonochromaticParams extends PaletteBaseParams {
	count: number;
	range: number;
}

const monochromaticTool: Tool<MonochromaticParams> = {
	id: "monochromatic",
	schema: toolSchema<MonochromaticParams>(
		{
			...paletteBaseSchema,
			baseColor: field.color({ label: "fields.baseColor", default: "#0ea5e9" }),
			count: field.slider({
				label: "fields.count",
				min: 2,
				max: 9,
				step: 1,
				default: 5,
			}),
			range: field.slider({
				label: "fields.range",
				min: 10,
				max: 90,
				step: 5,
				default: 40,
			}),
		},
		{ ...paletteLayoutGroup },
	),
	input: "none",
	run: genTool((p) =>
		renderSwatches(
			monochromaticSet(p.baseColor, p.count, p.range),
			p.width,
			p.layout,
		),
	),
};

interface ShadesParams extends PaletteBaseParams {
	count: number;
	depth: number;
}

const shadesTool: Tool<ShadesParams> = {
	id: "shades",
	schema: toolSchema<ShadesParams>(
		{
			...paletteBaseSchema,
			baseColor: field.color({ label: "fields.baseColor", default: "#f59e0b" }),
			count: field.slider({
				label: "fields.count",
				min: 2,
				max: 9,
				step: 1,
				default: 5,
			}),
			depth: field.slider({
				label: "fields.depth",
				min: 10,
				max: 90,
				step: 5,
				default: 50,
			}),
		},
		{ ...paletteLayoutGroup },
	),
	input: "none",
	run: genTool((p) =>
		renderSwatches(shadeSet(p.baseColor, p.count, p.depth), p.width, p.layout),
	),
};

interface MixColorsParams {
	colors: string[];
	width: number;
}

export const mixColorsSchema = toolSchema<MixColorsParams>(
	{
		colors: field.colors({
			label: "fields.colorList",
			default: ["#ff0000", "#00ff00", "#0000ff"],
		}),
		width: field.slider({
			label: "fields.width",
			min: 128,
			max: 1024,
			step: 16,
			default: 512,
		}),
	},
	{
		layout: {
			groups: [
				{ title: "groups.colors", fields: ["colors"] },
				{ title: "groups.output", fields: ["width"] },
			],
		},
	},
);

const mixColorsTool: Tool<MixColorsParams> = {
	id: "mix-colors",
	schema: mixColorsSchema,
	input: "none",
	run: genTool((p) => renderSwatches([mixColors(p.colors)], p.width, "strip")),
};

interface SortColorsParams {
	colors: string[];
	order: "hue" | "luma" | "sat";
	width: number;
	layout: "strip" | "grid";
}

export const sortColorsSchema = toolSchema<SortColorsParams>(
	{
		colors: field.colors({
			label: "fields.colorList",
			default: [
				"#ff0000",
				"#ff8800",
				"#ffff00",
				"#00cc44",
				"#0066ff",
				"#8800ff",
			],
		}),
		order: field.select({
			label: "fields.order",
			default: "hue",
			options: [
				{ value: "hue", label: "Hue" },
				{ value: "luma", label: "Brightness" },
				{ value: "sat", label: "Saturation" },
			],
		}),
		width: field.slider({
			label: "fields.width",
			min: 128,
			max: 1024,
			step: 16,
			default: 512,
		}),
		layout: field.select({
			label: "fields.layout",
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
				{ title: "groups.colors", fields: ["colors"] },
				{
					title: "groups.output",
					cols: 2,
					fields: ["order", "width", "layout"],
				},
			],
		},
	},
);

const sortColorsTool: Tool<SortColorsParams> = {
	id: "sort-colors",
	schema: sortColorsSchema,
	input: "none",
	run: genTool((p) =>
		renderSwatches(sortPalette(p.colors, p.order), p.width, p.layout),
	),
};

interface TextToPngParams {
	text: string;
	style: FontStyle;
	bgOpacity: number;
	backgroundColor: string;
	padding: number;
}

export const textToPngSchema = toolSchema<TextToPngParams>(
	{
		text: field.text({
			label: "fields.text",
			default: "Hello!",
			placeholder: "Your text",
		}),
		style: field.fontStyle({
			label: "fields.textStyle",
			min: 8,
			max: 300,
			size: 96,
			font: "sans",
			bold: true,
			color: "#111318",
		}),
		bgOpacity: field.slider({
			label: "fields.opacity",
			min: 0,
			max: 100,
			step: 1,
			default: 100,
		}),
		backgroundColor: field.color({
			label: "fields.backgroundColor",
			default: "#ffffff",
		}),
		padding: field.slider({
			label: "fields.padding",
			min: 0,
			max: 200,
			step: 2,
			default: 24,
		}),
	},
	{
		layout: {
			groups: [
				{ title: "groups.text", fields: ["text", "style"] },
				{
					title: "groups.background",
					fields: ["bgOpacity", "backgroundColor"],
				},
				{ title: "groups.padding", fields: ["padding"] },
			],
		},
	},
);

const textToPng: Tool<TextToPngParams> = {
	id: "from-text",
	domOnly: true,
	schema: textToPngSchema,
	input: "none",
	run: genTool((p) =>
		renderTextToImage({
			text: p.text,
			fontSize: p.style.size,
			font: p.style.font,
			bold: p.style.bold,
			color: p.style.color,
			backgroundColor: p.backgroundColor,
			bgOpacity: p.bgOpacity,
			padding: p.padding,
		}),
	),
};

export const generateTools = [
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
	mixColorsTool,
	sortColorsTool,
	textToPng,
];
