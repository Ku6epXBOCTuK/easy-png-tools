import { gammaCorrection, temperature, tint } from "../core/color";
import { parseHexList } from "../core/palette";
import { ditherImage, mapToNearest, quantizeImage } from "../core/quantize";
import { field, toolSchema } from "../registry-schema";
import type { ToolEntry } from "./types";

interface GammaParams {
	value: number;
}

export const gammaSchema = toolSchema<GammaParams>({
	value: field.slider({ min: 0.1, max: 3, step: 0.05, default: 1 }),
});

const gammaTool: ToolEntry<GammaParams> = {
	id: "gamma-png",
	title: "Gamma correction PNG",
	description:
		"Corrects midtone brightness. <1 darker, >1 lighter, 1 — unchanged.",
	category: "color",
	schema: gammaSchema,
	run: (img, p) => gammaCorrection(img, p.value),
};

interface TemperatureParams {
	percent: number;
}

export const temperatureSchema = toolSchema<TemperatureParams>({
	percent: field.slider({ min: -100, max: 100, step: 1, default: 0 }),
});

const temperatureTool: ToolEntry<TemperatureParams> = {
	id: "temperature-png",
	title: "Temperature PNG",
	description:
		"Positive values make the image warmer (more orange), negative ones cooler (more blue).",
	category: "color",
	schema: temperatureSchema,
	run: (img, p) => temperature(img, p.percent),
};

interface TintParams {
	color: string;
	strength: number;
}

export const tintSchema = toolSchema<TintParams>({
	color: field.color({ default: "#ffb060" }),
	strength: field.slider({ min: 0, max: 100, step: 1, default: 30 }),
});

const tintTool: ToolEntry<TintParams> = {
	id: "tint-png",
	title: "Tint PNG",
	description:
		"Multiplies color channels by the chosen tint with the given strength.",
	category: "color",
	schema: tintSchema,
	run: (img, p) => tint(img, p.color, p.strength),
};

interface QuantizeParams {
	colors: number;
}

export const quantizeSchema = toolSchema<QuantizeParams>({
	colors: field.slider({ min: 2, max: 64, step: 1, default: 16 }),
});

const quantizeTool: ToolEntry<QuantizeParams> = {
	id: "quantize-png",
	title: "Quantize PNG",
	description:
		"Reduces the image to k colors via median-cut palette. Transparent pixels are preserved.",
	category: "color",
	schema: quantizeSchema,
	run: (img, p) => quantizeImage(img, p.colors).image,
};

interface CustomPaletteParams {
	colors: string;
}

export const customPaletteSchema = toolSchema<CustomPaletteParams>({
	colors: field.text({ default: "#000000,#ffffff" }),
});

const customPalette: ToolEntry<CustomPaletteParams> = {
	id: "custom-palette-png",
	title: "Custom Palette PNG",
	description:
		"Maps every pixel to the nearest color from your comma-separated hex list.",
	category: "color",
	schema: customPaletteSchema,
	run: (img, p) => mapToNearest(img, parseHexList(p.colors)),
};

interface DitheringParams {
	colors: number;
	pattern: "floyd-steinberg" | "bayer";
}

export const ditheringSchema = toolSchema<DitheringParams>({
	colors: field.slider({ min: 2, max: 16, step: 1, default: 4 }),
	pattern: field.select({
		default: "floyd-steinberg",
		options: [
			{ value: "floyd-steinberg", label: "Floyd–Steinberg" },
			{ value: "bayer", label: "Bayer 4x4" },
		],
	}),
});

const ditheringTool: ToolEntry<DitheringParams> = {
	id: "dithering-png",
	title: "Dithering PNG",
	description:
		"Applies Floyd–Steinberg error diffusion or ordered Bayer dithering while reducing to k colors.",
	category: "color",
	schema: ditheringSchema,
	run: (img, p) => ditherImage(img, p.colors, p.pattern),
};

export const colorEntries = [
	gammaTool,
	temperatureTool,
	tintTool,
	quantizeTool,
	customPalette,
	ditheringTool,
];
