import type { Page } from "../types";

export const analyzePages: Page[] = [
	{
		slug: "extract-color-from-png",
		title: "Extract Color from PNG",
		description:
			"Keeps only pixels close to the chosen color and makes everything else transparent — the inverse of Remove Color.",
		category: "analyze",
		steps: [{ id: "extract-color-from" }],
	},
	{
		slug: "show-transparent-png",
		title: "Show Transparent Areas PNG",
		description:
			"Highlights every transparent or semi-transparent pixel with the chosen color so gaps become obvious.",
		category: "analyze",
		steps: [{ id: "show-transparent" }],
	},
	{
		slug: "show-grayscale-pixels-png",
		title: "Show Grayscale Pixels PNG",
		description:
			"Finds pixels whose channels are nearly equal and renders them as a mask. Tolerance is in channel units.",
		category: "analyze",
		steps: [{ id: "show-grayscale-pixels" }],
	},
	{
		slug: "show-color-pixels-png",
		title: "Show Color Pixels PNG",
		description:
			"Finds colored (non-gray) pixels beyond the channel tolerance and renders them as a mask.",
		category: "analyze",
		steps: [{ id: "show-color-pixels" }],
	},
	{
		slug: "light-pixel-mask-png",
		title: "Light Pixel Mask PNG",
		description: "Selects pixels brighter than the luminance threshold.",
		category: "analyze",
		steps: [{ id: "light-pixel-mask" }],
	},
	{
		slug: "dark-pixel-mask-png",
		title: "Dark Pixel Mask PNG",
		description: "Selects pixels darker than the luminance threshold.",
		category: "analyze",
		steps: [{ id: "dark-pixel-mask" }],
	},
	{
		slug: "unique-color-mask-png",
		title: "Unique Color Mask PNG",
		description:
			"Selects colors that occur no more than the given number of times — rare and one-off pixels.",
		category: "analyze",
		steps: [{ id: "unique-color-mask" }],
	},
	{
		slug: "verify-is-png",
		title: "Verify If Image Is a PNG",
		description:
			"Checks the signature of pasted base64 / data-uri content and reports whether it is a real PNG.",
		category: "analyze",
		steps: [{ id: "verify-png" }],
	},
	{
		slug: "png-is-grayscale",
		title: "Check: is PNG grayscale?",
		description: "Reports whether the image consists only of shades of gray.",
		category: "analyze",
		steps: [{ id: "is-grayscale" }],
	},
	{
		slug: "png-file-size",
		title: "PNG File Size",
		description:
			"Encodes the image as PNG and reports the resulting file size.",
		category: "analyze",
		steps: [{ id: "file-size" }],
	},
	{
		slug: "png-is-transparent",
		title: "Check: is PNG transparent?",
		description:
			"Reports whether the image contains transparent or semi-transparent pixels.",
		category: "analyze",
		steps: [{ id: "is-transparent" }],
	},
	{
		slug: "png-orientation",
		title: "PNG orientation",
		description: "Reports whether it is portrait, landscape or square.",
		category: "analyze",
		steps: [{ id: "orientation" }],
	},
];
