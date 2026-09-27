import type { Page } from "../types";

export const generatePages: Page[] = [
	{
		slug: "create-empty-png",
		title: "Create empty PNG",
		description:
			"Creates a blank canvas of the chosen dimensions, either transparent or filled with a solid color.",
		category: "generate",
		steps: [{ id: "create-empty-png" }],
	},
	{
		slug: "single-color-png",
		title: "Create solid color PNG",
		description: "Generates a rectangle of the given size and color.",
		category: "generate",
		steps: [{ id: "single-color-png" }],
	},
	{
		slug: "random-noise-png",
		title: "Create random noise PNG",
		description:
			"Generates an image with random pixels. The seed fixes the result: one seed — one image.",
		category: "generate",
		steps: [{ id: "random-noise-png" }],
	},
	{
		slug: "linear-gradient-png",
		title: "Create gradient PNG",
		description:
			"Generates a smooth transition between two colors along a chosen angle.",
		category: "generate",
		steps: [{ id: "linear-gradient-png" }],
	},
	{
		slug: "color-spectrum-png",
		title: "Color Spectrum PNG",
		description:
			"Full hue rainbow 0–360° along the chosen axis with adjustable saturation and lightness.",
		category: "generate",
		steps: [{ id: "color-spectrum-png" }],
	},
	{
		slug: "random-colors-png",
		title: "Random Color Blocks PNG",
		description:
			"Fills the canvas with random vivid color blocks. Deterministic by seed.",
		category: "generate",
		steps: [{ id: "random-colors-png" }],
	},
	{
		slug: "draw-grid-png",
		title: "Draw Grid PNG",
		description:
			"Draws a grid with custom columns, rows and line width on a transparent or white background.",
		category: "generate",
		steps: [{ id: "draw-grid-png" }],
	},
	{
		slug: "placeholder-png",
		title: "Create Placeholder PNG",
		description:
			"Generates a placeholder rectangle with its dimensions printed in the center.",
		category: "generate",
		steps: [{ id: "placeholder-png" }],
	},
	{
		slug: "blend-two-png",
		title: "Blend Two Colors PNG",
		description: "A continuous horizontal gradient between two colors.",
		category: "generate",
		steps: [{ id: "blend-two-png" }],
	},
	{
		slug: "step-colors-png",
		title: "Color Steps PNG",
		description: "A discrete set of evenly spaced steps between two colors.",
		category: "generate",
		steps: [{ id: "step-colors-png" }],
	},
	{
		slug: "emoji-to-png",
		title: "Emoji to PNG",
		description:
			"Renders an emoji or any Unicode symbol as a transparent PNG of the chosen size.",
		category: "generate",
		steps: [{ id: "emoji-to-png" }],
	},
	{
		slug: "color-wheel-png",
		title: "Color Wheel PNG",
		description:
			"Generates an HSL color wheel: hue around the circle, saturation from center to edge, chosen lightness.",
		category: "generate",
		steps: [{ id: "color-wheel-png" }],
	},
	{
		slug: "complementary-png",
		title: "Complementary Palette PNG",
		description:
			"Two opposite colors on the color wheel — the base and its complement.",
		category: "generate",
		steps: [{ id: "complementary-png" }],
	},
	{
		slug: "triadic-png",
		title: "Triadic Palette PNG",
		description: "Three colors evenly spaced 120° apart on the color wheel.",
		category: "generate",
		steps: [{ id: "triadic-png" }],
	},
	{
		slug: "tetradic-png",
		title: "Tetradic Palette PNG",
		description:
			"Four colors in two complementary pairs, 90° apart on the wheel.",
		category: "generate",
		steps: [{ id: "tetradic-png" }],
	},
	{
		slug: "analogous-png",
		title: "Analogous Palette PNG",
		description:
			"Neighboring hues around the base color — calm, related color scheme.",
		category: "generate",
		steps: [{ id: "analogous-png" }],
	},
	{
		slug: "monochromatic-png",
		title: "Monochromatic Palette PNG",
		description:
			"Tones of a single hue: lightness varies within the chosen range, hue and saturation stay fixed.",
		category: "generate",
		steps: [{ id: "monochromatic-png" }],
	},
	{
		slug: "shades-png",
		title: "Shade Ramp PNG",
		description: "A ramp of the base color getting darker step by step.",
		category: "generate",
		steps: [{ id: "shades-png" }],
	},
	{
		slug: "mix-colors-png",
		title: "Mix Colors PNG",
		description:
			"Averages the selected colors into one swatch. Colors become one uniform fill.",
		category: "generate",
		steps: [{ id: "mix-colors-png" }],
	},
	{
		slug: "sort-colors-png",
		title: "Sort Colors PNG",
		description:
			"Renders the chosen colors as swatches sorted by hue, brightness or saturation.",
		category: "generate",
		steps: [{ id: "sort-colors-png" }],
	},
	{
		slug: "text-to-png",
		title: "Text to PNG",
		description:
			"Creates a PNG image from text: the canvas is sized to fit the label plus padding.",
		category: "generate",
		steps: [{ id: "text-to-png" }],
	},
];
