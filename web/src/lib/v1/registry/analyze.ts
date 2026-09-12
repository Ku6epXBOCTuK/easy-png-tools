import type { ToolEntry } from "../registry";
import {
	extractByColor,
	isGrayscaleish,
	luma01,
	rarityPredicate,
	renderPredicateMask,
} from "../../core/masks";
import {
	hasTransparency,
	isGrayscale,
	orientationOf,
} from "../../core/analyze";
import { looksLikePng, base64ToBytes, stripDataUri } from "../../core/textio";
import { clonePixelImage, type PixelImage } from "../../core/types";
import { encode } from "../../core/io";
import { t } from "../i18n/t";
import { num, str } from "../registry-helpers";

type MaskToolSpec = {
	id: string;
	title: string;
	description: string;
	defaultMode: "binary" | "highlight";
	predicate: (
		img: PixelImage,
		p: Record<string, unknown>,
	) => (r: number, g: number, b: number, a: number) => boolean;
	extraParams?: ToolEntry["params"];
};

const MASK_TOOLS: MaskToolSpec[] = [
	{
		id: "show-transparent-png",
		title: "Show Transparent Areas PNG",
		description:
			"Highlights every transparent or semi-transparent pixel with the chosen color so gaps become obvious.",
		defaultMode: "highlight",
		predicate: (_img, _p) => (_r, _g, _b, a) => a < 255,
	},
	{
		id: "show-grayscale-pixels-png",
		title: "Show Grayscale Pixels PNG",
		description:
			"Finds pixels whose channels are nearly equal and renders them as a mask. Tolerance is in channel units.",
		defaultMode: "binary",
		predicate: (_i, p) => (r, g, b) =>
			isGrayscaleish(r, g, b, num(p, "tolerance")),
		extraParams: [
			{
				id: "tolerance",
				label: "Channel tolerance",
				type: "slider",
				min: 0,
				max: 64,
				step: 1,
				default: 0,
			},
		],
	},
	{
		id: "show-color-pixels-png",
		title: "Show Color Pixels PNG",
		description:
			"Finds colored (non-gray) pixels beyond the channel tolerance and renders them as a mask.",
		defaultMode: "binary",
		predicate: (_i, p) => (r, g, b) =>
			!isGrayscaleish(r, g, b, num(p, "tolerance")),
		extraParams: [
			{
				id: "tolerance",
				label: "Channel tolerance",
				type: "slider",
				min: 0,
				max: 64,
				step: 1,
				default: 8,
			},
		],
	},
	{
		id: "light-pixel-mask-png",
		title: "Light Pixel Mask PNG",
		description: "Selects pixels brighter than the luminance threshold.",
		defaultMode: "binary",
		predicate: (_i, p) => (r, g, b) =>
			luma01(r, g, b) >= num(p, "threshold") / 100,
		extraParams: [
			{
				id: "threshold",
				label: "Luminance threshold, %",
				type: "slider",
				min: 0,
				max: 100,
				step: 1,
				default: 70,
			},
		],
	},
	{
		id: "dark-pixel-mask-png",
		title: "Dark Pixel Mask PNG",
		description: "Selects pixels darker than the luminance threshold.",
		defaultMode: "binary",
		predicate: (_i, p) => (r, g, b) =>
			luma01(r, g, b) <= num(p, "threshold") / 100,
		extraParams: [
			{
				id: "threshold",
				label: "Luminance threshold, %",
				type: "slider",
				min: 0,
				max: 100,
				step: 1,
				default: 30,
			},
		],
	},
	{
		id: "unique-color-mask-png",
		title: "Unique Color Mask PNG",
		description:
			"Selects colors that occur no more than the given number of times — rare and one-off pixels.",
		defaultMode: "binary",
		predicate: (img, p) => rarityPredicate(img, num(p, "rarity")),
		extraParams: [
			{
				id: "rarity",
				label: "Max occurrences",
				type: "slider",
				min: 1,
				max: 50,
				step: 1,
				default: 1,
			},
		],
	},
];

function maskEntries(): ToolEntry[] {
	return MASK_TOOLS.map((spec) => ({
		id: spec.id,
		title: spec.title,
		description: spec.description,
		category: "analyze" as const,
		params: [
			...(spec.extraParams ?? []),
			{
				id: "mode",
				label: "Mask mode",
				type: "select" as const,
				default: spec.defaultMode,
				options: [
					{ value: "binary", label: "Black & white mask" },
					{ value: "highlight", label: "Color highlight" },
				],
			},
			{
				id: "color",
				label: "Highlight color",
				type: "color",
				default: "#ff00aa",
			},
			{
				id: "opacity",
				label: "Highlight opacity, %",
				type: "slider",
				min: 0,
				max: 100,
				step: 5,
				default: 70,
			},
		],
		run: (img, p) =>
			renderPredicateMask(img, spec.predicate(img, p), {
				mode: str(p, "mode") === "highlight" ? "highlight" : "binary",
				color: str(p, "color"),
				opacityPercent: num(p, "opacity"),
			}),
	}));
}

export function analyzeEntries(): ToolEntry[] {
	return [
		...maskEntries(),
		{
			id: "extract-color-from-png",
			title: "Extract Color from PNG",
			description:
				"Keeps only pixels close to the chosen color and makes everything else transparent — the inverse of Remove Color.",
			category: "analyze",
			params: [
				{
					id: "color",
					label: "Color to keep",
					type: "color",
					default: "#00ff88",
				},
				{
					id: "tolerance",
					label: "Similarity tolerance, %",
					type: "slider",
					min: 0,
					max: 50,
					step: 1,
					default: 10,
				},
			],
			run: (img, p) =>
				extractByColor(img, str(p, "color"), num(p, "tolerance")),
		},
		{
			id: "verify-is-png",
			title: "Verify If Image Is a PNG",
			description:
				"Checks the signature of pasted base64 / data-uri content and reports whether it is a real PNG.",
			category: "analyze",
			sourceMode: "text",
			params: [],
			resultType: "text",
			textToText: (text) =>
				looksLikePng(base64ToBytes(stripDataUri(text)))
					? "verifyYes"
					: "verifyNo",
		},
		{
			id: "png-info",
			title: "PNG info",
			description:
				"Shows dimensions, alpha presence and the number of unique colors of the uploaded image.",
			category: "analyze",
			params: [],
			resultType: "info",
			run: (img) => clonePixelImage(img),
		},
		{
			id: "png-is-grayscale",
			title: "Check: is PNG grayscale?",
			description: "Reports whether the image consists only of shades of gray.",
			category: "analyze",
			params: [],
			resultType: "text",
			toText: (img) => (isGrayscale(img) ? "grayscaleYes" : "grayscaleNo"),
		},
		{
			id: "png-file-size",
			title: "PNG File Size",
			description:
				"Encodes the image as PNG and reports the resulting file size.",
			category: "analyze",
			domOnly: true,
			params: [],
			resultType: "text",
			toText: async (img) => {
				const blob = await encode(img, "image/png");
				const kb = blob.size / 1024;
				const kbText = kb >= 100 ? Math.round(kb).toString() : kb.toFixed(1);
				return t("tools.png-file-size.results.line", {
					kb: kbText,
				});
			},
		},
		{
			id: "png-is-transparent",
			title: "Check: is PNG transparent?",
			description:
				"Reports whether the image contains transparent or semi-transparent pixels.",
			category: "analyze",
			params: [],
			resultType: "text",
			toText: (img) =>
				hasTransparency(img) ? "transparentYes" : "transparentNo",
		},
		{
			id: "png-orientation",
			title: "PNG orientation",
			description: "Reports whether it is portrait, landscape or square.",
			category: "analyze",
			params: [],
			resultType: "text",
			toText: (img) => {
				switch (orientationOf(img)) {
					case "portrait":
						return "orientationPortrait";
					case "landscape":
						return "orientationLandscape";
					default:
						return "orientationSquare";
				}
			},
		},
	];
}
