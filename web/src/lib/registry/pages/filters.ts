import type { Page } from "../types";

export const filtersPages: Page[] = [
	{
		slug: "blur-png",
		title: "Blur PNG",
		description:
			"Gaussian blur: three passes of separable box blur — fast at any radius. Transparent edges do not darken.",
		category: "filters",
		steps: [{ id: "blur-png" }],
	},
	{
		slug: "sharpen-png",
		title: "Sharpen PNG",
		description:
			"Emphasizes edges with a sharpening kernel; strength sets the blend with the original. 0% means no change.",
		category: "filters",
		steps: [{ id: "sharpen-png" }],
	},
	{
		slug: "silhouette-png",
		title: "Silhouette PNG",
		description:
			"Turns all visible pixels into a single solid color while keeping their transparency — instant silhouette.",
		category: "filters",
		steps: [{ id: "silhouette-png" }],
	},
	{
		slug: "vignette-png",
		title: "Vignette PNG",
		description:
			"Smoothly darkens the edges of the image, leaving the center untouched.",
		category: "filters",
		steps: [{ id: "vignette-png" }],
	},
	{
		slug: "pixelate-png",
		title: "Pixelate PNG",
		description:
			"Averages every blockSize×blockSize area into one color — classic mosaic.",
		category: "filters",
		steps: [{ id: "pixelate-png" }],
	},
	{
		slug: "randomize-pixels-png",
		title: "Randomize Pixels PNG",
		description:
			"Shuffles blocks of the image between positions. Same seed gives the same arrangement.",
		category: "filters",
		steps: [{ id: "randomize-pixels-png" }],
	},
	{
		slug: "add-noise-png",
		title: "Add Noise to PNG",
		description:
			"Adds film-grain style noise. Deterministic by seed; monochrome keeps original hue balance.",
		category: "filters",
		steps: [{ id: "add-noise-png" }],
	},
	{
		slug: "jpeg-artifacts-png",
		title: "JPEG artifacts",
		description:
			"Simulates low-quality JPEG re-compression — visible blocks and smeared colors.",
		category: "filters",
		steps: [{ id: "jpeg-artifacts-png" }],
	},
];
