import type { ToolEntry } from "../registry";
import { gaussianBlur, sharpen as sharpenImage } from "../../core/convolution";
import { vignette } from "../../core/effects";
import {
	pixelate,
	shuffleBlocks,
	addNoise,
	silhouette,
} from "../../core/pixel-fx";
import { jpegRoundtrip } from "../../core/io";
import { num, str } from "../registry-helpers";

export function filterEntries(): ToolEntry[] {
	return [
		{
			id: "blur-png",
			title: "Blur PNG",
			description:
				"Gaussian blur: three passes of separable box blur — fast at any radius. Transparent edges do not darken.",
			category: "filters",
			params: [
				{
					id: "radius",
					label: "Radius, px",
					type: "slider",
					min: 1,
					max: 32,
					step: 1,
					default: 4,
				},
			],
			run: (img, p) => gaussianBlur(img, num(p, "radius")),
		},
		{
			id: "sharpen-png",
			title: "Sharpen PNG",
			description:
				"Emphasizes edges with a sharpening kernel; strength sets the blend with the original. 0% means no change.",
			category: "filters",
			params: [
				{
					id: "strength",
					label: "Strength, %",
					type: "slider",
					min: 0,
					max: 100,
					step: 1,
					default: 50,
				},
			],
			run: (img, p) => sharpenImage(img, num(p, "strength")),
		},
		{
			id: "vignette-png",
			title: "Vignette PNG",
			description:
				"Smoothly darkens the edges of the image, leaving the center untouched.",
			category: "filters",
			params: [
				{
					id: "strength",
					label: "Darkening strength, %",
					type: "slider",
					min: 0,
					max: 100,
					step: 5,
					default: 50,
				},
			],
			run: (img, p) => vignette(img, num(p, "strength")),
		},
		{
			id: "pixelate-png",
			title: "Pixelate PNG",
			description:
				"Averages every blockSize×blockSize area into one color — classic mosaic.",
			category: "filters",
			params: [
				{
					id: "blockSize",
					label: "Block size, px",
					type: "slider",
					min: 2,
					max: 64,
					step: 1,
					default: 8,
				},
			],
			run: (img, p) => pixelate(img, num(p, "blockSize")),
		},
		{
			id: "randomize-pixels-png",
			title: "Randomize Pixels PNG",
			description:
				"Shuffles blocks of the image between positions. Same seed gives the same arrangement.",
			category: "filters",
			params: [
				{
					id: "blockSize",
					label: "Block size, px",
					type: "slider",
					min: 1,
					max: 64,
					step: 1,
					default: 8,
				},
				{
					id: "seed",
					label: "Seed",
					type: "number",
					min: 0,
					max: 999999,
					step: 1,
					default: 42,
				},
			],
			run: (img, p) => shuffleBlocks(img, num(p, "blockSize"), num(p, "seed")),
		},
		{
			id: "add-noise-png",
			title: "Add Noise to PNG",
			description:
				"Adds film-grain style noise. Deterministic by seed; monochrome keeps original hue balance.",
			category: "filters",
			params: [
				{
					id: "amount",
					label: "Amount, %",
					type: "slider",
					min: 0,
					max: 100,
					step: 1,
					default: 25,
				},
				{
					id: "mode",
					label: "Noise type",
					type: "select",
					default: "mono",
					options: [
						{ value: "mono", label: "Monochrome grain" },
						{ value: "color", label: "Color noise" },
					],
				},
				{
					id: "seed",
					label: "Seed",
					type: "number",
					min: 0,
					max: 999999,
					step: 1,
					default: 1234,
				},
			],
			run: (img, p) =>
				addNoise(
					img,
					num(p, "amount"),
					str(p, "mode") === "color" ? "color" : "mono",
					num(p, "seed"),
				),
		},
		{
			id: "silhouette-png",
			title: "Silhouette PNG",
			description:
				"Turns all visible pixels into a single solid color while keeping their transparency — instant silhouette.",
			category: "filters",
			params: [
				{
					id: "color",
					label: "Silhouette color",
					type: "color",
					default: "#111318",
				},
				{
					id: "threshold",
					label: "Visibility threshold, %",
					type: "slider",
					min: 0,
					max: 100,
					step: 1,
					default: 10,
				},
			],
			run: (img, p) =>
				silhouette(img, str(p, "color"), num(p, "threshold") * 2.55),
		},
		{
			id: "jpeg-artifacts-png",
			title: "JPEG artifacts",
			description:
				"Simulates low-quality JPEG re-compression — visible blocks and smeared colors.",
			category: "filters",
			params: [
				{
					id: "quality",
					label: "JPEG quality",
					type: "slider",
					min: 1,
					max: 50,
					step: 1,
					default: 10,
				},
			],
			run: (img, p) => jpegRoundtrip(img, num(p, "quality")),
		},
	];
}
