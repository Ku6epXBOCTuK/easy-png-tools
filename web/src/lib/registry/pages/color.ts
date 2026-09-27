import type { Page } from "../types";

export const colorPages: Page[] = [
	{
		slug: "two-colors-png",
		title: "Two colors PNG",
		description:
			"Recolors the image into two chosen colors by luminance threshold.",
		category: "color",
		steps: [{ id: "two-colors" }],
	},
	{
		slug: "gamma-png",
		title: "Gamma correction PNG",
		description:
			"Corrects midtone brightness. <1 darker, >1 lighter, 1 — unchanged.",
		category: "color",
		steps: [{ id: "gamma" }],
	},
	{
		slug: "temperature-png",
		title: "Temperature PNG",
		description:
			"Positive values make the image warmer (more orange), negative ones cooler (more blue).",
		category: "color",
		steps: [{ id: "temperature" }],
	},
	{
		slug: "tint-png",
		title: "Tint PNG",
		description:
			"Multiplies color channels by the chosen tint with the given strength.",
		category: "color",
		steps: [{ id: "tint" }],
	},
	{
		slug: "quantize-png",
		title: "Quantize PNG",
		description:
			"Reduces the image to k colors via median-cut palette. Transparent pixels are preserved.",
		category: "color",
		steps: [{ id: "quantize" }],
	},
	{
		slug: "custom-palette-png",
		title: "Custom Palette PNG",
		description:
			"Maps every pixel to the nearest color from your comma-separated hex list.",
		category: "color",
		steps: [{ id: "custom-palette" }],
	},
	{
		slug: "dithering-png",
		title: "Dithering PNG",
		description:
			"Applies Floyd–Steinberg error diffusion or ordered Bayer dithering while reducing to k colors.",
		category: "color",
		steps: [{ id: "dithering" }],
	},
	{
		slug: "grayscale-png",
		title: "Grayscale PNG",
		description:
			"Converts the image to shades of gray using the BT.601 luminance formula. Alpha is preserved.",
		category: "color",
		steps: [{ id: "grayscale" }],
	},
	{
		slug: "invert-colors-png",
		title: "Invert colors PNG",
		description:
			"Inverts each color channel (255 − value). Alpha is unchanged.",
		category: "color",
		steps: [{ id: "invert-colors" }],
	},
	{
		slug: "adjust-brightness-contrast-png",
		title: "Brightness & contrast PNG",
		description:
			"Adjusts brightness and contrast in the range from −100 to +100. Zero means no change.",
		category: "color",
		steps: [{ id: "adjust-brightness-contrast" }],
	},
	{
		slug: "change-png-opacity",
		title: "Change PNG opacity",
		description:
			"Multiplies the alpha channel by a percentage: 0% — fully transparent, 100% — unchanged.",
		category: "color",
		steps: [{ id: "change-opacity" }],
	},
	{
		slug: "sepia-png",
		title: "Sepia effect",
		description: "Tints the image into the warm brown tones of classic sepia.",
		category: "color",
		steps: [{ id: "sepia" }],
	},
	{
		slug: "change-png-hue",
		title: "Change hue PNG",
		description:
			"Shifts the hue around the circle. Saturation and lightness are preserved.",
		category: "color",
		steps: [{ id: "change-hue" }],
	},
	{
		slug: "extract-channel-png",
		title: "Extract channel PNG",
		description:
			"Keeps only the chosen channel — red, green or blue — as shades of gray.",
		category: "color",
		steps: [{ id: "extract-channel" }],
	},
	{
		slug: "swap-channels-png",
		title: "Swap channels PNG",
		description:
			"Swaps two color channels — a quick way to get unusual coloring.",
		category: "color",
		steps: [{ id: "swap-channels" }],
	},
	{
		slug: "black-and-white-png",
		title: "Black & white threshold PNG",
		description:
			"Hard binarization by luminance: every pixel becomes black or white.",
		category: "color",
		steps: [{ id: "black-and-white" }],
	},
	{
		slug: "posterize-png",
		title: "Posterize PNG",
		description: "Reduces the number of levels per channel — a poster effect.",
		category: "color",
		steps: [{ id: "posterize" }],
	},
	{
		slug: "auto-contrast-png",
		title: "Auto contrast PNG",
		description:
			"Stretches each channel's range across the full available brightness range.",
		category: "color",
		steps: [{ id: "auto-contrast" }],
	},
	{
		slug: "decrease-color-count-png",
		title: "Decrease Color Count PNG",
		description:
			"Median-cut engine as a quick way to drop to 2–256 colors. Presets marked (extreme/strong/balanced/light) match the classic compression levels.",
		category: "color",
		steps: [{ id: "decrease-color-count" }],
	},
	{
		slug: "png-to-hsl",
		title: "Split PNG into HSL",
		description:
			"Decomposes the image into Hue, Saturation and Lightness components.",
		category: "color",
		steps: [{ id: "to-hsl" }],
	},
	{
		slug: "png-to-hsv",
		title: "Split PNG into HSV",
		description:
			"Decomposes the image into Hue, Saturation and Value (brightness) components.",
		category: "color",
		steps: [{ id: "to-hsv" }],
	},
	{
		slug: "png-to-hsi",
		title: "Split PNG into HSI",
		description:
			"Decomposes the image into Hue, Saturation and Intensity components.",
		category: "color",
		steps: [{ id: "to-hsi" }],
	},
	{
		slug: "png-to-cmyk",
		title: "Convert PNG to CMYK Colors",
		description:
			"Decomposes the image into print-style Cyan, Magenta, Yellow and Key (black) components.",
		category: "color",
		steps: [{ id: "to-cmyk" }],
	},
	{
		slug: "png-to-ycbcr",
		title: "Convert PNG to YCbCr Colors",
		description:
			"Decomposes the image into Luma (Y) and Blue-difference / Red-difference chroma components.",
		category: "color",
		steps: [{ id: "to-ycbcr" }],
	},
	{
		slug: "png-to-lab",
		title: "Convert PNG to LAB Colors",
		description:
			"Decomposes the image into perceptual Lightness and green–magenta / blue–yellow opponents.",
		category: "color",
		steps: [{ id: "to-lab" }],
	},
];
