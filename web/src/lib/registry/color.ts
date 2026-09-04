import type { ToolEntry } from "../registry";
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
	tint,
	thresholdBlackWhite,
	twoColors,
	type ChannelSwapPair,
	type RgbChannel,
} from "../core/color";
import { renderSpace, SPACES, type SpaceId } from "../core/channels";
import { quantizeImage, ditherImage, mapToNearest } from "../core/quantize";
import { parseHexList } from "../core/palette";
import { num, str } from "../registry-helpers";

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

function channelEntries(): ToolEntry[] {
	return CHANNEL_SPACES.map((space) => {
		const components = SPACES[space.id].components;
		return {
			id: `png-to-${space.suffix}`,
			title: space.title,
			description: space.description,
			category: "color" as const,
			params: [
				{
					id: "component",
					label: "Component",
					type: "select" as const,
					default: components[0],
					options: components.map((c) => ({
						value: c,
						label: c.toUpperCase(),
					})),
				},
				{
					id: "display",
					label: "Display mode",
					type: "select" as const,
					default: "gray",
					options: [
						{ value: "gray", label: "Grayscale" },
						{ value: "color", label: "Space as RGB" },
					],
				},
			],
			run: (img, p) =>
				renderSpace(
					img,
					space.id,
					str(p, "component"),
					str(p, "display") === "color" ? "color" : "gray",
				),
		} satisfies ToolEntry;
	});
}

export function colorEntries(): ToolEntry[] {
	return [
		...channelEntries(),
		{
			id: "grayscale-png",
			title: "Grayscale PNG",
			description:
				"Converts the image to shades of gray using the BT.601 luminance formula. Alpha is preserved.",
			category: "color",
			params: [],
			run: (img) => grayscale(img),
		},
		{
			id: "invert-colors-png",
			title: "Invert colors PNG",
			description:
				"Inverts each color channel (255 − value). Alpha is unchanged.",
			category: "color",
			params: [],
			run: (img) => invert(img),
		},
		{
			id: "adjust-brightness-contrast-png",
			title: "Brightness & contrast PNG",
			description:
				"Adjusts brightness and contrast in the range from −100 to +100. Zero means no change.",
			category: "color",
			params: [
				{
					id: "brightness",
					label: "Brightness",
					type: "slider",
					min: -100,
					max: 100,
					step: 1,
					default: 0,
				},
				{
					id: "contrast",
					label: "Contrast",
					type: "slider",
					min: -100,
					max: 100,
					step: 1,
					default: 0,
				},
			],
			run: (img, p) =>
				brightnessContrast(img, num(p, "brightness"), num(p, "contrast")),
		},
		{
			id: "change-png-opacity",
			title: "Change PNG opacity",
			description:
				"Multiplies the alpha channel by a percentage: 0% — fully transparent, 100% — unchanged.",
			category: "color",
			params: [
				{
					id: "percent",
					label: "Opacity, %",
					type: "slider",
					min: 0,
					max: 100,
					step: 1,
					default: 100,
				},
			],
			run: (img, p) => setOpacity(img, num(p, "percent")),
		},
		{
			id: "sepia-png",
			title: "Sepia effect",
			description:
				"Tints the image into the warm brown tones of classic sepia.",
			category: "color",
			params: [],
			run: (img) => sepia(img),
		},
		{
			id: "change-png-hue",
			title: "Change hue PNG",
			description:
				"Shifts the hue around the circle. Saturation and lightness are preserved.",
			category: "color",
			params: [
				{
					id: "degrees",
					label: "Hue shift, °",
					type: "slider",
					min: -180,
					max: 180,
					step: 1,
					default: 0,
				},
			],
			run: (img, p) => changeHue(img, num(p, "degrees")),
		},
		{
			id: "extract-channel-png",
			title: "Extract channel PNG",
			description:
				"Keeps only the chosen channel — red, green or blue — as shades of gray.",
			category: "color",
			params: [
				{
					id: "channel",
					label: "Channel",
					type: "select",
					default: "red",
					options: [
						{ value: "red", label: "Red" },
						{ value: "green", label: "Green" },
						{ value: "blue", label: "Blue" },
					],
				},
			],
			run: (img, p) => extractChannel(img, str(p, "channel") as RgbChannel),
		},
		{
			id: "swap-channels-png",
			title: "Swap channels PNG",
			description:
				"Swaps two color channels — a quick way to get unusual coloring.",
			category: "color",
			params: [
				{
					id: "pair",
					label: "Channel pair",
					type: "select",
					default: "r-g",
					options: [
						{ value: "r-g", label: "Red ↔ Green" },
						{ value: "r-b", label: "Red ↔ Blue" },
						{ value: "g-b", label: "Green ↔ Blue" },
					],
				},
			],
			run: (img, p) => swapChannels(img, str(p, "pair") as ChannelSwapPair),
		},
		{
			id: "black-and-white-png",
			title: "Black & white threshold PNG",
			description:
				"Hard binarization by luminance: every pixel becomes black or white.",
			category: "color",
			params: [
				{
					id: "threshold",
					label: "Brightness threshold, %",
					type: "slider",
					min: 0,
					max: 100,
					step: 1,
					default: 50,
				},
			],
			run: (img, p) => thresholdBlackWhite(img, num(p, "threshold")),
		},
		{
			id: "posterize-png",
			title: "Posterize PNG",
			description:
				"Reduces the number of levels per channel — a poster effect.",
			category: "color",
			params: [
				{
					id: "levels",
					label: "Levels per channel",
					type: "slider",
					min: 2,
					max: 16,
					step: 1,
					default: 4,
				},
			],
			run: (img, p) => posterize(img, num(p, "levels")),
		},
		{
			id: "two-colors-png",
			title: "Two colors PNG",
			description:
				"Recolors the image into two chosen colors by luminance threshold.",
			category: "color",
			params: [
				{
					id: "lightColor",
					label: "Light areas color",
					type: "color",
					default: "#ffffff",
				},
				{
					id: "darkColor",
					label: "Dark areas color",
					type: "color",
					default: "#000000",
				},
				{
					id: "threshold",
					label: "Brightness threshold, %",
					type: "slider",
					min: 0,
					max: 100,
					step: 1,
					default: 50,
				},
			],
			run: (img, p) =>
				twoColors(
					img,
					str(p, "lightColor"),
					str(p, "darkColor"),
					num(p, "threshold"),
				),
		},
		{
			id: "gamma-png",
			title: "Gamma correction PNG",
			description:
				"Corrects midtone brightness. <1 darker, >1 lighter, 1 — unchanged.",
			category: "color",
			params: [
				{
					id: "value",
					label: "Gamma",
					type: "slider",
					min: 0.1,
					max: 3,
					step: 0.05,
					default: 1,
				},
			],
			run: (img, p) => gammaCorrection(img, num(p, "value")),
		},
		{
			id: "auto-contrast-png",
			title: "Auto contrast PNG",
			description:
				"Stretches each channel's range across the full available brightness range.",
			category: "color",
			params: [],
			run: (img) => autoContrast(img),
		},
		{
			id: "temperature-png",
			title: "Temperature PNG",
			description:
				"Positive values make the image warmer (more orange), negative ones cooler (more blue).",
			category: "color",
			params: [
				{
					id: "percent",
					label: "Temperature",
					type: "slider",
					min: -100,
					max: 100,
					step: 1,
					default: 0,
				},
			],
			run: (img, p) => temperature(img, num(p, "percent")),
		},
		{
			id: "tint-png",
			title: "Tint PNG",
			description:
				"Multiplies color channels by the chosen tint with the given strength.",
			category: "color",
			params: [
				{
					id: "color",
					label: "Tint color",
					type: "color",
					default: "#ffb060",
				},
				{
					id: "strength",
					label: "Strength, %",
					type: "slider",
					min: 0,
					max: 100,
					step: 1,
					default: 30,
				},
			],
			run: (img, p) => tint(img, str(p, "color"), num(p, "strength")),
		},
		{
			id: "quantize-png",
			title: "Quantize PNG",
			description:
				"Reduces the image to k colors via median-cut palette. Transparent pixels are preserved.",
			category: "color",
			params: [
				{
					id: "colors",
					label: "Colors (k)",
					type: "slider",
					min: 2,
					max: 64,
					step: 1,
					default: 16,
				},
			],
			run: (img, p) => quantizeImage(img, num(p, "colors")).image,
		},
		{
			id: "decrease-color-count-png",
			title: "Decrease Color Count PNG",
			description:
				"Same median-cut engine with fixed power-of-two presets — quick way to drop to 2–256 colors.",
			category: "color",
			params: [
				{
					id: "maxColors",
					label: "Max colors",
					type: "select",
					default: "16",
					options: [
						{ value: "2", label: "2" },
						{ value: "4", label: "4" },
						{ value: "8", label: "8" },
						{ value: "16", label: "16" },
						{ value: "32", label: "32" },
						{ value: "64", label: "64" },
						{ value: "128", label: "128" },
						{ value: "256", label: "256" },
					],
				},
			],
			run: (img, p) => quantizeImage(img, num(p, "maxColors")).image,
		},
		{
			id: "custom-palette-png",
			title: "Custom Palette PNG",
			description:
				"Maps every pixel to the nearest color from your comma-separated hex list.",
			category: "color",
			params: [
				{
					id: "colors",
					label: "Palette (comma-separated hex)",
					type: "text",
					default: "#000000,#ffffff",
				},
			],
			run: (img, p) => mapToNearest(img, parseHexList(str(p, "colors"))),
		},
		{
			id: "dithering-png",
			title: "Dithering PNG",
			description:
				"Applies Floyd–Steinberg error diffusion or ordered Bayer dithering while reducing to k colors.",
			category: "color",
			params: [
				{
					id: "colors",
					label: "Colors (k)",
					type: "slider",
					min: 2,
					max: 16,
					step: 1,
					default: 4,
				},
				{
					id: "pattern",
					label: "Pattern",
					type: "select",
					default: "floyd-steinberg",
					options: [
						{ value: "floyd-steinberg", label: "Floyd–Steinberg" },
						{ value: "bayer", label: "Bayer 4×4" },
					],
				},
			],
			run: (img, p) =>
				ditherImage(
					img,
					num(p, "colors"),
					str(p, "pattern") === "bayer" ? "bayer" : "floyd-steinberg",
				),
		},
	];
}
