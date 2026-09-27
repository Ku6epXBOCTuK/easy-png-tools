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
} from "../../core/color";
import { renderSpace, SPACES, type SpaceId } from "../../core/channels";
import { parseHexList } from "../../core/palette";
import { ditherImage, mapToNearest, quantizeImage } from "../../core/quantize";
import { field, toolSchema, type ColorPair } from "../../registry-schema";
import { imgTool, type Tool } from "../types";

interface TwoColorsParams {
	pair: ColorPair;
	threshold: number;
}

export const twoColorsSchema = toolSchema<TwoColorsParams>({
	pair: field.colorPair({
		label: "fields.colorPair",
		from: "#ffffff",
		to: "#000000",
	}),
	threshold: field.slider({
		label: "fields.threshold",
		min: 0,
		max: 100,
		step: 1,
		default: 50,
	}),
});

const twoColorsTool: Tool<TwoColorsParams> = {
	id: "two-colors-png",
	schema: twoColorsSchema,
	input: "image",
	run: imgTool((img, p) => twoColors(img, p.pair.from, p.pair.to, p.threshold)),
};

interface GammaParams {
	value: number;
}

export const gammaSchema = toolSchema<GammaParams>({
	value: field.slider({
		label: "fields.gamma",
		min: 0.1,
		max: 3,
		step: 0.05,
		default: 1,
	}),
});

const gammaTool: Tool<GammaParams> = {
	id: "gamma-png",
	schema: gammaSchema,
	input: "image",
	run: imgTool((img, p) => gammaCorrection(img, p.value)),
};

interface TemperatureParams {
	percent: number;
}

export const temperatureSchema = toolSchema<TemperatureParams>({
	percent: field.slider({
		label: "fields.percent",
		min: -100,
		max: 100,
		step: 1,
		default: 0,
	}),
});

const temperatureTool: Tool<TemperatureParams> = {
	id: "temperature-png",
	schema: temperatureSchema,
	input: "image",
	run: imgTool((img, p) => temperature(img, p.percent)),
};

interface TintParams {
	color: string;
	strength: number;
}

export const tintSchema = toolSchema<TintParams>({
	color: field.color({ label: "fields.color", default: "#ffb060" }),
	strength: field.slider({
		label: "fields.strength",
		min: 0,
		max: 100,
		step: 1,
		default: 30,
	}),
});

const tintTool: Tool<TintParams> = {
	id: "tint-png",
	schema: tintSchema,
	input: "image",
	run: imgTool((img, p) => tint(img, p.color, p.strength)),
};

interface QuantizeParams {
	colors: number;
}

export const quantizeSchema = toolSchema<QuantizeParams>({
	colors: field.slider({
		label: "fields.colorCount",
		min: 2,
		max: 64,
		step: 1,
		default: 16,
	}),
});

const quantizeTool: Tool<QuantizeParams> = {
	id: "quantize-png",
	schema: quantizeSchema,
	input: "image",
	run: imgTool((img, p) => quantizeImage(img, p.colors).image),
};

interface CustomPaletteParams {
	colors: string;
}

export const customPaletteSchema = toolSchema<CustomPaletteParams>({
	colors: field.text({ label: "fields.hexList", default: "#000000,#ffffff" }),
});

const customPalette: Tool<CustomPaletteParams> = {
	id: "custom-palette-png",
	schema: customPaletteSchema,
	input: "image",
	run: imgTool((img, p) => mapToNearest(img, parseHexList(p.colors))),
};

interface DitheringParams {
	colors: number;
	pattern: "floyd-steinberg" | "bayer";
}

export const ditheringSchema = toolSchema<DitheringParams>({
	colors: field.slider({
		label: "fields.colorCount",
		min: 2,
		max: 16,
		step: 1,
		default: 4,
	}),
	pattern: field.select({
		label: "fields.pattern",
		default: "floyd-steinberg",
		options: [
			{ value: "floyd-steinberg", label: "Floyd–Steinberg" },
			{ value: "bayer", label: "Bayer 4x4" },
		],
	}),
});

const ditheringTool: Tool<DitheringParams> = {
	id: "dithering-png",
	schema: ditheringSchema,
	input: "image",
	run: imgTool((img, p) => ditherImage(img, p.colors, p.pattern)),
};

interface EmptyParams {}

export const grayscaleSchema = toolSchema<EmptyParams>({});

const grayscaleTool: Tool<EmptyParams> = {
	id: "grayscale-png",
	schema: grayscaleSchema,
	input: "image",
	run: imgTool((img) => grayscale(img)),
};

export const invertColorsSchema = toolSchema<EmptyParams>({});

const invertColorsTool: Tool<EmptyParams> = {
	id: "invert-colors-png",
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
		brightness: field.slider({
			label: "fields.brightness",
			min: -100,
			max: 100,
			step: 1,
			default: 0,
		}),
		contrast: field.slider({
			label: "fields.contrast",
			min: -100,
			max: 100,
			step: 1,
			default: 0,
		}),
	},
	{
		layout: {
			groups: [
				{ title: "groups.adjust", cols: 2, fields: ["brightness", "contrast"] },
			],
		},
	},
);

const brightnessContrastTool: Tool<BrightnessContrastParams> = {
	id: "adjust-brightness-contrast-png",
	schema: brightnessContrastSchema,
	input: "image",
	run: imgTool((img, p) => brightnessContrast(img, p.brightness, p.contrast)),
};

interface OpacityParams {
	percent: number;
}

export const opacitySchema = toolSchema<OpacityParams>({
	percent: field.slider({
		label: "fields.percent",
		min: 0,
		max: 100,
		step: 1,
		default: 100,
	}),
});

const opacityTool: Tool<OpacityParams> = {
	id: "change-png-opacity",
	schema: opacitySchema,
	input: "image",
	run: imgTool((img, p) => setOpacity(img, p.percent)),
};

export const sepiaSchema = toolSchema<EmptyParams>({});

const sepiaTool: Tool<EmptyParams> = {
	id: "sepia-png",
	schema: sepiaSchema,
	input: "image",
	run: imgTool((img) => sepia(img)),
};

interface HueShiftParams {
	degrees: number;
}

export const hueShiftSchema = toolSchema<HueShiftParams>({
	degrees: field.slider({
		label: "fields.degrees",
		min: -180,
		max: 180,
		step: 1,
		default: 0,
	}),
});

const hueShiftTool: Tool<HueShiftParams> = {
	id: "change-png-hue",
	schema: hueShiftSchema,
	input: "image",
	run: imgTool((img, p) => changeHue(img, p.degrees)),
};

interface ExtractChannelParams {
	channel: RgbChannel;
}

export const extractChannelSchema = toolSchema<ExtractChannelParams>({
	channel: field.select({
		label: "fields.channel",
		default: "red",
		options: [
			{ value: "red", label: "Red" },
			{ value: "green", label: "Green" },
			{ value: "blue", label: "Blue" },
		],
	}),
});

const extractChannelTool: Tool<ExtractChannelParams> = {
	id: "extract-channel-png",
	schema: extractChannelSchema,
	input: "image",
	run: imgTool((img, p) => extractChannel(img, p.channel)),
};

interface SwapChannelsParams {
	pair: ChannelSwapPair;
}

export const swapChannelsSchema = toolSchema<SwapChannelsParams>({
	pair: field.select({
		label: "fields.channelPair",
		default: "r-g",
		options: [
			{ value: "r-g", label: "Red ↔ Green" },
			{ value: "r-b", label: "Red ↔ Blue" },
			{ value: "g-b", label: "Green ↔ Blue" },
		],
	}),
});

const swapChannelsTool: Tool<SwapChannelsParams> = {
	id: "swap-channels-png",
	schema: swapChannelsSchema,
	input: "image",
	run: imgTool((img, p) => swapChannels(img, p.pair)),
};

interface BlackAndWhiteParams {
	threshold: number;
}

export const blackAndWhiteSchema = toolSchema<BlackAndWhiteParams>({
	threshold: field.slider({
		label: "fields.threshold",
		min: 0,
		max: 100,
		step: 1,
		default: 50,
	}),
});

const blackAndWhiteTool: Tool<BlackAndWhiteParams> = {
	id: "black-and-white-png",
	schema: blackAndWhiteSchema,
	input: "image",
	run: imgTool((img, p) => thresholdBlackWhite(img, p.threshold)),
};

interface PosterizeParams {
	levels: number;
}

export const posterizeSchema = toolSchema<PosterizeParams>({
	levels: field.slider({
		label: "fields.levels",
		min: 2,
		max: 16,
		step: 1,
		default: 4,
	}),
});

const posterizeTool: Tool<PosterizeParams> = {
	id: "posterize-png",
	schema: posterizeSchema,
	input: "image",
	run: imgTool((img, p) => posterize(img, p.levels)),
};

export const autoContrastSchema = toolSchema<EmptyParams>({});

const autoContrastTool: Tool<EmptyParams> = {
	id: "auto-contrast-png",
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
		label: "fields.maxColors",
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

const decreaseColorCountTool: Tool<DecreaseColorCountParams> = {
	id: "decrease-color-count-png",
	schema: decreaseColorCountSchema,
	input: "image",
	run: imgTool((img, p) => quantizeImage(img, Number(p.maxColors)).image),
};

interface ChannelParams {
	component: string;
	display: "gray" | "color";
}

// Пространства, для которых есть инструмент и страница; тексты страницы живут
// в `registry/pages/color.ts`, поэтому здесь только идентификаторы.
const CHANNEL_SPACES: SpaceId[] = ["hsl", "hsv", "hsi", "cmyk", "ycbcr", "lab"];

function channelEntries(): Tool<ChannelParams>[] {
	return CHANNEL_SPACES.map((space) => {
		const components = SPACES[space].components;
		return {
			id: `png-to-${space}`,
			schema: toolSchema<ChannelParams>({
				component: field.select({
					label: "fields.component",
					default: components[0],
					options: components.map((c) => ({
						value: c,
						label: c.toUpperCase(),
					})),
				}),
				display: field.select({
					label: "fields.display",
					default: "gray",
					options: [
						{ value: "gray", label: "Grayscale" },
						{ value: "color", label: "Space as RGB" },
					],
				}),
			}),
			input: "image",
			run: imgTool((img, p) => renderSpace(img, space, p.component, p.display)),
		} satisfies Tool<ChannelParams>;
	});
}

export const colorTools = [
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
