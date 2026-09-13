import {
	autoContrast,
	brightnessContrast,
	changeHue,
	extractChannel,
	gammaCorrection,
	grayscale,
	invert,
	posterize,
	sepia,
	setOpacity,
	swapChannels,
	temperature,
	thresholdBlackWhite,
	tint,
	twoColors,
	type ChannelSwapPair,
	type RgbChannel,
} from "../core/color";
import { renderSpace, SPACES, type SpaceId } from "../core/channels";
import { parseHexList } from "../core/palette";
import { ditherImage, mapToNearest, quantizeImage } from "../core/quantize";
import { field, toolSchema, type ColorPair } from "../registry-schema";
import { imgTool, type ToolEntry } from "./types";

interface TwoColorsParams {
	pair: ColorPair;
	threshold: number;
}

export const twoColorsSchema = toolSchema<TwoColorsParams>({
	pair: field.colorPair({ from: "#ffffff", to: "#000000" }),
	threshold: field.slider({ min: 0, max: 100, step: 1, default: 50 }),
});

const twoColorsTool: ToolEntry<TwoColorsParams> = {
	id: "two-colors-png",
	title: "Two colors PNG",
	description:
		"Recolors the image into two chosen colors by luminance threshold.",
	category: "color",
	schema: twoColorsSchema,
	input: "image",
	run: imgTool((img, p) => twoColors(img, p.pair.from, p.pair.to, p.threshold)),
};

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
	input: "image",
	run: imgTool((img, p) => gammaCorrection(img, p.value)),
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
	input: "image",
	run: imgTool((img, p) => temperature(img, p.percent)),
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
	input: "image",
	run: imgTool((img, p) => tint(img, p.color, p.strength)),
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
	input: "image",
	run: imgTool((img, p) => quantizeImage(img, p.colors).image),
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
	input: "image",
	run: imgTool((img, p) => mapToNearest(img, parseHexList(p.colors))),
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
	input: "image",
	run: imgTool((img, p) => ditherImage(img, p.colors, p.pattern)),
};

interface EmptyParams {}

export const grayscaleSchema = toolSchema<EmptyParams>({});

const grayscaleTool: ToolEntry<EmptyParams> = {
	id: "grayscale-png",
	title: "Grayscale PNG",
	description:
		"Converts the image to shades of gray using the BT.601 luminance formula. Alpha is preserved.",
	category: "color",
	schema: grayscaleSchema,
	input: "image",
	run: imgTool((img) => grayscale(img)),
};

export const invertColorsSchema = toolSchema<EmptyParams>({});

const invertColorsTool: ToolEntry<EmptyParams> = {
	id: "invert-colors-png",
	title: "Invert colors PNG",
	description: "Inverts each color channel (255 − value). Alpha is unchanged.",
	category: "color",
	schema: invertColorsSchema,
	input: "image",
	run: imgTool((img) => invert(img)),
};

interface BrightnessContrastParams {
	brightness: number;
	contrast: number;
}

export const brightnessContrastSchema = toolSchema<BrightnessContrastParams>(
	{
		brightness: field.slider({ min: -100, max: 100, step: 1, default: 0 }),
		contrast: field.slider({ min: -100, max: 100, step: 1, default: 0 }),
	},
	{
		layout: {
			groups: [
				{ title: "groups.adjust", cols: 2, fields: ["brightness", "contrast"] },
			],
		},
	},
);

const brightnessContrastTool: ToolEntry<BrightnessContrastParams> = {
	id: "adjust-brightness-contrast-png",
	title: "Brightness & contrast PNG",
	description:
		"Adjusts brightness and contrast in the range from −100 to +100. Zero means no change.",
	category: "color",
	schema: brightnessContrastSchema,
	input: "image",
	run: imgTool((img, p) => brightnessContrast(img, p.brightness, p.contrast)),
};

interface OpacityParams {
	percent: number;
}

export const opacitySchema = toolSchema<OpacityParams>({
	percent: field.slider({ min: 0, max: 100, step: 1, default: 100 }),
});

const opacityTool: ToolEntry<OpacityParams> = {
	id: "change-png-opacity",
	title: "Change PNG opacity",
	description:
		"Multiplies the alpha channel by a percentage: 0% — fully transparent, 100% — unchanged.",
	category: "color",
	schema: opacitySchema,
	input: "image",
	run: imgTool((img, p) => setOpacity(img, p.percent)),
};

export const sepiaSchema = toolSchema<EmptyParams>({});

const sepiaTool: ToolEntry<EmptyParams> = {
	id: "sepia-png",
	title: "Sepia effect",
	description: "Tints the image into the warm brown tones of classic sepia.",
	category: "color",
	schema: sepiaSchema,
	input: "image",
	run: imgTool((img) => sepia(img)),
};

interface HueShiftParams {
	degrees: number;
}

export const hueShiftSchema = toolSchema<HueShiftParams>({
	degrees: field.slider({ min: -180, max: 180, step: 1, default: 0 }),
});

const hueShiftTool: ToolEntry<HueShiftParams> = {
	id: "change-png-hue",
	title: "Change hue PNG",
	description:
		"Shifts the hue around the circle. Saturation and lightness are preserved.",
	category: "color",
	schema: hueShiftSchema,
	input: "image",
	run: imgTool((img, p) => changeHue(img, p.degrees)),
};

interface ExtractChannelParams {
	channel: RgbChannel;
}

export const extractChannelSchema = toolSchema<ExtractChannelParams>({
	channel: field.select({
		default: "red",
		options: [
			{ value: "red", label: "Red" },
			{ value: "green", label: "Green" },
			{ value: "blue", label: "Blue" },
		],
	}),
});

const extractChannelTool: ToolEntry<ExtractChannelParams> = {
	id: "extract-channel-png",
	title: "Extract channel PNG",
	description:
		"Keeps only the chosen channel — red, green or blue — as shades of gray.",
	category: "color",
	schema: extractChannelSchema,
	input: "image",
	run: imgTool((img, p) => extractChannel(img, p.channel)),
};

interface SwapChannelsParams {
	pair: ChannelSwapPair;
}

export const swapChannelsSchema = toolSchema<SwapChannelsParams>({
	pair: field.select({
		default: "r-g",
		options: [
			{ value: "r-g", label: "Red ↔ Green" },
			{ value: "r-b", label: "Red ↔ Blue" },
			{ value: "g-b", label: "Green ↔ Blue" },
		],
	}),
});

const swapChannelsTool: ToolEntry<SwapChannelsParams> = {
	id: "swap-channels-png",
	title: "Swap channels PNG",
	description:
		"Swaps two color channels — a quick way to get unusual coloring.",
	category: "color",
	schema: swapChannelsSchema,
	input: "image",
	run: imgTool((img, p) => swapChannels(img, p.pair)),
};

interface BlackAndWhiteParams {
	threshold: number;
}

export const blackAndWhiteSchema = toolSchema<BlackAndWhiteParams>({
	threshold: field.slider({ min: 0, max: 100, step: 1, default: 50 }),
});

const blackAndWhiteTool: ToolEntry<BlackAndWhiteParams> = {
	id: "black-and-white-png",
	title: "Black & white threshold PNG",
	description:
		"Hard binarization by luminance: every pixel becomes black or white.",
	category: "color",
	schema: blackAndWhiteSchema,
	input: "image",
	run: imgTool((img, p) => thresholdBlackWhite(img, p.threshold)),
};

interface PosterizeParams {
	levels: number;
}

export const posterizeSchema = toolSchema<PosterizeParams>({
	levels: field.slider({ min: 2, max: 16, step: 1, default: 4 }),
});

const posterizeTool: ToolEntry<PosterizeParams> = {
	id: "posterize-png",
	title: "Posterize PNG",
	description: "Reduces the number of levels per channel — a poster effect.",
	category: "color",
	schema: posterizeSchema,
	input: "image",
	run: imgTool((img, p) => posterize(img, p.levels)),
};

export const autoContrastSchema = toolSchema<EmptyParams>({});

const autoContrastTool: ToolEntry<EmptyParams> = {
	id: "auto-contrast-png",
	title: "Auto contrast PNG",
	description:
		"Stretches each channel's range across the full available brightness range.",
	category: "color",
	schema: autoContrastSchema,
	input: "image",
	run: imgTool((img) => autoContrast(img)),
};

interface DecreaseColorCountParams {
	maxColors:
		"2" | "4" | "8" | "16" | "32" | "44" | "64" | "96" | "128" | "192" | "256";
}

export const decreaseColorCountSchema = toolSchema<DecreaseColorCountParams>({
	maxColors: field.select({
		default: "16",
		options: [
			{ value: "2", label: "2" },
			{ value: "4", label: "4" },
			{ value: "8", label: "8" },
			{ value: "16", label: "16 (extreme)" },
			{ value: "32", label: "32" },
			{ value: "44", label: "44 (strong)" },
			{ value: "64", label: "64" },
			{ value: "96", label: "96 (balanced)" },
			{ value: "128", label: "128" },
			{ value: "192", label: "192 (light)" },
			{ value: "256", label: "256" },
		],
	}),
});

const decreaseColorCountTool: ToolEntry<DecreaseColorCountParams> = {
	id: "decrease-color-count-png",
	title: "Decrease Color Count PNG",
	description:
		"Median-cut engine as a quick way to drop to 2–256 colors. Presets marked (extreme/strong/balanced/light) match the classic compression levels.",
	category: "color",
	schema: decreaseColorCountSchema,
	input: "image",
	run: imgTool((img, p) => quantizeImage(img, Number(p.maxColors)).image),
};

interface ChannelParams {
	component: string;
	display: "gray" | "color";
}

type SpaceEntry = {
	id: SpaceId;
	suffix: string;
	title: string;
	description: string;
};

const CHANNEL_SPACES: SpaceEntry[] = [
	{
		id: "hsl",
		suffix: "hsl",
		title: "Split PNG into HSL",
		description:
			"Decomposes the image into Hue, Saturation and Lightness components.",
	},
	{
		id: "hsv",
		suffix: "hsv",
		title: "Split PNG into HSV",
		description:
			"Decomposes the image into Hue, Saturation and Value (brightness) components.",
	},
	{
		id: "hsi",
		suffix: "hsi",
		title: "Split PNG into HSI",
		description:
			"Decomposes the image into Hue, Saturation and Intensity components.",
	},
	{
		id: "cmyk",
		suffix: "cmyk",
		title: "Convert PNG to CMYK Colors",
		description:
			"Decomposes the image into print-style Cyan, Magenta, Yellow and Key (black) components.",
	},
	{
		id: "ycbcr",
		suffix: "ycbcr",
		title: "Convert PNG to YCbCr Colors",
		description:
			"Decomposes the image into Luma (Y) and Blue-difference / Red-difference chroma components.",
	},
	{
		id: "lab",
		suffix: "lab",
		title: "Convert PNG to LAB Colors",
		description:
			"Decomposes the image into perceptual Lightness and green–magenta / blue–yellow opponents.",
	},
];

function channelEntries(): ToolEntry<ChannelParams>[] {
	return CHANNEL_SPACES.map((space) => {
		const components = SPACES[space.id].components;
		return {
			id: `png-to-${space.suffix}`,
			title: space.title,
			description: space.description,
			category: "color",
			schema: toolSchema<ChannelParams>({
				component: field.select({
					default: components[0],
					options: components.map((c) => ({
						value: c,
						label: c.toUpperCase(),
					})),
				}),
				display: field.select({
					default: "gray",
					options: [
						{ value: "gray", label: "Grayscale" },
						{ value: "color", label: "Space as RGB" },
					],
				}),
			}),
			input: "image",
			run: imgTool((img, p) =>
				renderSpace(img, space.id, p.component, p.display),
			),
		} satisfies ToolEntry<ChannelParams>;
	});
}

export const colorEntries = [
	twoColorsTool,
	gammaTool,
	temperatureTool,
	tintTool,
	quantizeTool,
	customPalette,
	ditheringTool,
	grayscaleTool,
	invertColorsTool,
	brightnessContrastTool,
	opacityTool,
	sepiaTool,
	hueShiftTool,
	extractChannelTool,
	swapChannelsTool,
	blackAndWhiteTool,
	posterizeTool,
	autoContrastTool,
	decreaseColorCountTool,
	...channelEntries(),
];
