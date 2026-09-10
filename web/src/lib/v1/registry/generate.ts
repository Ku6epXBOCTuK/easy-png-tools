import type { ToolEntry } from "../registry";
import { ToolError } from "../../core/errors";
import { solidImage, noiseImage, gradientImage } from "../../core/generate";
import {
	colorSpectrum,
	drawGrid,
	randomColorBlocks,
} from "../../core/gen-tools";
import {
	renderTextToImage,
	renderEmoji,
	type TextFont,
} from "../../core/domText";
import { changeCanvasSize } from "../../core/geometry";
import {
	renderWheel,
	renderSwatches,
	renderBlend,
	complementarySet,
	triadicSet,
	tetradicSet,
	analogousSet,
	monochromaticSet,
	shadeSet,
	mixColors,
	parseHexList,
	stepColors,
	sortPalette,
	type SortKey,
} from "../../core/palette";
import { num, str, bool } from "../registry-helpers";

function hexToRgba(hex: string, alpha = 255): [number, number, number, number] {
	const match = /^#([0-9a-f]{6})$/i.exec(hex.trim());
	if (!match) {
		throw new ToolError("errors.badHex", { value: hex });
	}
	const d = match[1];
	return [
		parseInt(d.slice(0, 2), 16),
		parseInt(d.slice(2, 4), 16),
		parseInt(d.slice(4, 6), 16),
		alpha,
	];
}

function paletteParams(baseDefault: string) {
	return [
		{
			id: "baseColor",
			label: "Base color",
			type: "color" as const,
			default: baseDefault,
		},
		{
			id: "width",
			label: "Width",
			type: "slider" as const,
			min: 128,
			max: 1024,
			step: 16,
			default: 512,
		},
		{
			id: "layout",
			label: "Layout",
			type: "select" as const,
			default: "grid",
			options: [
				{ value: "grid", label: "Grid" },
				{ value: "strip", label: "Strip" },
			],
		},
	];
}

export function generateEntries(): ToolEntry[] {
	return [
		{
			id: "create-empty-png",
			title: "Create empty PNG",
			description:
				"Generates a canvas of the chosen size — transparent or filled with color.",
			category: "generate",
			sourceMode: "none",
			params: [
				{
					id: "width",
					label: "Width",
					type: "number",
					min: 1,
					max: 20000,
					step: 1,
					default: 800,
				},
				{
					id: "height",
					label: "Height",
					type: "number",
					min: 1,
					max: 20000,
					step: 1,
					default: 600,
				},
				{
					id: "transparent",
					label: "Transparent",
					type: "checkbox",
					default: true,
				},
				{
					id: "color",
					label: "Color",
					type: "color",
					default: "#ffffff",
				},
			],
			generate: (p) =>
				solidImage(
					Math.trunc(num(p, "width")),
					Math.trunc(num(p, "height")),
					p["transparent"] === true ? [0, 0, 0, 0] : hexToRgba(str(p, "color")),
				),
		},
		{
			id: "single-color-png",
			title: "Create solid color PNG",
			description: "Generates a rectangle of the given size and color.",
			category: "generate",
			sourceMode: "none",
			params: [
				{
					id: "width",
					label: "Width",
					type: "number",
					min: 1,
					max: 20000,
					step: 1,
					default: 256,
				},
				{
					id: "height",
					label: "Height",
					type: "number",
					min: 1,
					max: 20000,
					step: 1,
					default: 256,
				},
				{
					id: "color",
					label: "Color",
					type: "color",
					default: "#ff0000",
				},
			],
			generate: (p) =>
				solidImage(
					Math.trunc(num(p, "width")),
					Math.trunc(num(p, "height")),
					hexToRgba(str(p, "color")),
				),
		},
		{
			id: "random-noise-png",
			title: "Create random noise PNG",
			description:
				"Generates an image with random pixels. The seed fixes the result: one seed — one image.",
			category: "generate",
			sourceMode: "none",
			params: [
				{
					id: "width",
					label: "Width",
					type: "number",
					min: 1,
					max: 5000,
					step: 1,
					default: 512,
				},
				{
					id: "height",
					label: "Height",
					type: "number",
					min: 1,
					max: 5000,
					step: 1,
					default: 512,
				},
				{
					id: "seed",
					label: "Seed",
					type: "number",
					min: 0,
					max: 999999999,
					step: 1,
					default: 1,
				},
			],
			generate: (p) =>
				noiseImage(
					Math.trunc(num(p, "width")),
					Math.trunc(num(p, "height")),
					num(p, "seed"),
				),
		},
		{
			id: "text-to-png",
			title: "Text to PNG",
			description:
				"Creates a PNG image from text: the canvas is sized to fit the label plus padding.",
			category: "generate",
			sourceMode: "none",
			domOnly: true,
			params: [
				{
					id: "text",
					label: "Text",
					type: "text",
					default: "Hello!",
					placeholder: "Your text",
				},
				{
					id: "fontSize",
					label: "Font size, px",
					type: "slider",
					min: 8,
					max: 300,
					step: 1,
					default: 96,
				},
				{
					id: "font",
					label: "Font",
					type: "select",
					default: "sans",
					options: [
						{ value: "sans", label: "Sans-serif" },
						{ value: "serif", label: "Serif" },
						{ value: "mono", label: "Monospace" },
					],
				},
				{
					id: "bold",
					label: "Bold",
					type: "checkbox",
					default: true,
				},
				{
					id: "color",
					label: "Text color",
					type: "color",
					default: "#111318",
				},
				{
					id: "transparentBg",
					label: "Transparent background",
					type: "checkbox",
					default: false,
				},
				{
					id: "backgroundColor",
					label: "Background color",
					type: "color",
					default: "#ffffff",
				},
				{
					id: "padding",
					label: "Padding, px",
					type: "slider",
					min: 0,
					max: 200,
					step: 2,
					default: 24,
				},
			],
			generate: (p) =>
				renderTextToImage({
					text: str(p, "text"),
					fontSize: num(p, "fontSize"),
					font: str(p, "font") as TextFont,
					bold: bool(p, "bold"),
					color: str(p, "color"),
					backgroundColor: str(p, "backgroundColor"),
					transparentBg: bool(p, "transparentBg"),
					padding: num(p, "padding"),
				}),
		},
		{
			id: "emoji-to-png",
			title: "Emoji to PNG",
			description:
				"Renders an emoji or any Unicode symbol as a transparent PNG of the chosen size.",
			category: "generate",
			sourceMode: "none",
			domOnly: true,
			params: [
				{
					id: "emoji",
					label: "Emoji / symbol",
					type: "text",
					default: "\u{1F600}",
				},
				{
					id: "size",
					label: "Size",
					type: "slider",
					min: 32,
					max: 1024,
					step: 16,
					default: 256,
				},
			],
			generate: (p) => renderEmoji(str(p, "emoji"), Math.trunc(num(p, "size"))),
		},
		{
			id: "placeholder-png",
			title: "Create Placeholder PNG",
			description:
				"Generates a placeholder rectangle with its dimensions printed in the center.",
			category: "generate",
			sourceMode: "none",
			domOnly: true,
			params: [
				{
					id: "width",
					label: "Width",
					type: "number",
					min: 1,
					max: 5000,
					step: 1,
					default: 800,
				},
				{
					id: "height",
					label: "Height",
					type: "number",
					min: 1,
					max: 5000,
					step: 1,
					default: 400,
				},
				{
					id: "backgroundColor",
					label: "Background",
					type: "color",
					default: "#dfe2e8",
				},
				{
					id: "color",
					label: "Text color",
					type: "color",
					default: "#5c6470",
				},
				{
					id: "showText",
					label: "Print dimensions",
					type: "checkbox",
					default: true,
				},
			],
			generate: (p) => {
				const w = Math.trunc(num(p, "width"));
				const h = Math.trunc(num(p, "height"));
				const label = renderTextToImage({
					text: `${w} × ${h}`,
					fontSize: Math.max(12, Math.round(Math.min(w, h) * 0.14)),
					font: "sans",
					bold: true,
					color: str(p, "color"),
					backgroundColor: str(p, "backgroundColor"),
					transparentBg: false,
					padding: 0,
				});
				return changeCanvasSize(label, w, h, "center");
			},
		},
		{
			id: "linear-gradient-png",
			title: "Create gradient PNG",
			description:
				"Generates a smooth transition between two colors, horizontally or vertically.",
			category: "generate",
			sourceMode: "none",
			params: [
				{
					id: "width",
					label: "Width",
					type: "number",
					min: 1,
					max: 20000,
					step: 1,
					default: 800,
				},
				{
					id: "height",
					label: "Height",
					type: "number",
					min: 1,
					max: 20000,
					step: 1,
					default: 600,
				},
				{
					id: "fromColor",
					label: "Start color",
					type: "color",
					default: "#000000",
				},
				{
					id: "toColor",
					label: "End color",
					type: "color",
					default: "#ffffff",
				},
				{
					id: "direction",
					label: "Direction",
					type: "select",
					default: "horizontal",
					options: [
						{ value: "horizontal", label: "Horizontal" },
						{ value: "vertical", label: "Vertical" },
					],
				},
			],
			generate: (p) =>
				gradientImage(
					Math.trunc(num(p, "width")),
					Math.trunc(num(p, "height")),
					hexToRgba(str(p, "fromColor")),
					hexToRgba(str(p, "toColor")),
					str(p, "direction") === "vertical" ? "vertical" : "horizontal",
				),
		},
		{
			id: "color-spectrum-png",
			title: "Color Spectrum PNG",
			description:
				"Full hue rainbow 0–360° along the chosen axis with adjustable saturation and lightness.",
			category: "generate",
			sourceMode: "none",
			params: [
				{
					id: "width",
					label: "Width",
					type: "number",
					min: 1,
					max: 5000,
					step: 1,
					default: 1024,
				},
				{
					id: "height",
					label: "Height",
					type: "number",
					min: 1,
					max: 5000,
					step: 1,
					default: 128,
				},
				{
					id: "direction",
					label: "Direction",
					type: "select",
					default: "horizontal",
					options: [
						{ value: "horizontal", label: "Horizontal" },
						{ value: "vertical", label: "Vertical" },
					],
				},
				{
					id: "saturation",
					label: "Saturation, %",
					type: "slider",
					min: 0,
					max: 100,
					step: 1,
					default: 100,
				},
				{
					id: "lightness",
					label: "Lightness, %",
					type: "slider",
					min: 0,
					max: 100,
					step: 1,
					default: 50,
				},
			],
			generate: (p) =>
				colorSpectrum(
					Math.trunc(num(p, "width")),
					Math.trunc(num(p, "height")),
					str(p, "direction") === "vertical" ? "vertical" : "horizontal",
					num(p, "saturation"),
					num(p, "lightness"),
				),
		},
		{
			id: "random-colors-png",
			title: "Random Color Blocks PNG",
			description:
				"Fills the canvas with random vivid color blocks. Deterministic by seed.",
			category: "generate",
			sourceMode: "none",
			params: [
				{
					id: "width",
					label: "Width",
					type: "number",
					min: 1,
					max: 5000,
					step: 1,
					default: 512,
				},
				{
					id: "height",
					label: "Height",
					type: "number",
					min: 1,
					max: 5000,
					step: 1,
					default: 512,
				},
				{
					id: "blockSize",
					label: "Block size, px",
					type: "slider",
					min: 4,
					max: 256,
					step: 2,
					default: 64,
				},
				{
					id: "seed",
					label: "Seed",
					type: "number",
					min: 0,
					max: 999999999,
					step: 1,
					default: 7,
				},
			],
			generate: (p) =>
				randomColorBlocks(
					Math.trunc(num(p, "width")),
					Math.trunc(num(p, "height")),
					num(p, "blockSize"),
					num(p, "seed"),
				),
		},
		{
			id: "draw-grid-png",
			title: "Draw Grid PNG",
			description:
				"Draws a grid with custom columns, rows and line width on a transparent or white background.",
			category: "generate",
			sourceMode: "none",
			params: [
				{
					id: "width",
					label: "Width",
					type: "number",
					min: 1,
					max: 5000,
					step: 1,
					default: 512,
				},
				{
					id: "height",
					label: "Height",
					type: "number",
					min: 1,
					max: 5000,
					step: 1,
					default: 512,
				},
				{
					id: "cols",
					label: "Columns",
					type: "slider",
					min: 1,
					max: 64,
					step: 1,
					default: 8,
				},
				{
					id: "rows",
					label: "Rows",
					type: "slider",
					min: 1,
					max: 64,
					step: 1,
					default: 8,
				},
				{
					id: "lineWidth",
					label: "Line width, px",
					type: "slider",
					min: 1,
					max: 40,
					step: 1,
					default: 2,
				},
				{
					id: "color",
					label: "Line color",
					type: "color",
					default: "#111318",
				},
				{
					id: "transparentBg",
					label: "Transparent background",
					type: "checkbox",
					default: true,
				},
			],
			generate: (p) =>
				drawGrid(
					Math.trunc(num(p, "width")),
					Math.trunc(num(p, "height")),
					num(p, "cols"),
					num(p, "rows"),
					num(p, "lineWidth"),
					str(p, "color"),
					bool(p, "transparentBg"),
				),
		},
		{
			id: "color-wheel-png",
			title: "Color Wheel PNG",
			description:
				"Generates an HSL color wheel: hue around the circle, saturation from center to edge, chosen lightness.",
			category: "generate",
			sourceMode: "none",
			params: [
				{
					id: "width",
					label: "Size",
					type: "slider",
					min: 128,
					max: 1024,
					step: 16,
					default: 512,
				},
				{
					id: "lightness",
					label: "Lightness, %",
					type: "slider",
					min: 0,
					max: 100,
					step: 1,
					default: 50,
				},
			],
			generate: (p) =>
				renderWheel(Math.trunc(num(p, "width")), num(p, "lightness")),
		},
		{
			id: "complementary-png",
			title: "Complementary Palette PNG",
			description:
				"Two opposite colors on the color wheel — the base and its complement.",
			category: "generate",
			sourceMode: "none",
			params: paletteParams("#2563eb"),
			generate: (p) =>
				renderSwatches(
					complementarySet(str(p, "baseColor")),
					num(p, "width"),
					str(p, "layout") as "strip" | "grid",
				),
		},
		{
			id: "triadic-png",
			title: "Triadic Palette PNG",
			description: "Three colors evenly spaced 120° apart on the color wheel.",
			category: "generate",
			sourceMode: "none",
			params: paletteParams("#ff0000"),
			generate: (p) =>
				renderSwatches(
					triadicSet(str(p, "baseColor")),
					num(p, "width"),
					str(p, "layout") as "strip" | "grid",
				),
		},
		{
			id: "tetradic-png",
			title: "Tetradic Palette PNG",
			description:
				"Four colors in two complementary pairs, 90° apart on the wheel.",
			category: "generate",
			sourceMode: "none",
			params: paletteParams("#8000ff"),
			generate: (p) =>
				renderSwatches(
					tetradicSet(str(p, "baseColor")),
					num(p, "width"),
					str(p, "layout") as "strip" | "grid",
				),
		},
		{
			id: "analogous-png",
			title: "Analogous Palette PNG",
			description:
				"Neighboring hues around the base color — calm, related color scheme.",
			category: "generate",
			sourceMode: "none",
			params: [
				...paletteParams("#22c55e"),
				{
					id: "spread",
					label: "Hue spread, °",
					type: "slider",
					min: 10,
					max: 90,
					step: 5,
					default: 30,
				},
				{
					id: "count",
					label: "Colors",
					type: "slider",
					min: 3,
					max: 9,
					step: 1,
					default: 5,
				},
			],
			generate: (p) =>
				renderSwatches(
					analogousSet(str(p, "baseColor"), num(p, "spread"), num(p, "count")),
					num(p, "width"),
					str(p, "layout") as "strip" | "grid",
				),
		},
		{
			id: "monochromatic-png",
			title: "Monochromatic Palette PNG",
			description:
				"Tones of a single hue: lightness varies within the chosen range, hue and saturation stay fixed.",
			category: "generate",
			sourceMode: "none",
			params: [
				...paletteParams("#0ea5e9"),
				{
					id: "count",
					label: "Colors",
					type: "slider",
					min: 2,
					max: 9,
					step: 1,
					default: 5,
				},
				{
					id: "range",
					label: "Lightness range, %",
					type: "slider",
					min: 10,
					max: 90,
					step: 5,
					default: 40,
				},
			],
			generate: (p) =>
				renderSwatches(
					monochromaticSet(
						str(p, "baseColor"),
						num(p, "count"),
						num(p, "range"),
					),
					num(p, "width"),
					str(p, "layout") as "strip" | "grid",
				),
		},
		{
			id: "shades-png",
			title: "Shade Ramp PNG",
			description: "A ramp of the base color getting darker step by step.",
			category: "generate",
			sourceMode: "none",
			params: [
				...paletteParams("#f59e0b"),
				{
					id: "count",
					label: "Colors",
					type: "slider",
					min: 2,
					max: 9,
					step: 1,
					default: 5,
				},
				{
					id: "depth",
					label: "Darkening depth, %",
					type: "slider",
					min: 10,
					max: 90,
					step: 5,
					default: 50,
				},
			],
			generate: (p) =>
				renderSwatches(
					shadeSet(str(p, "baseColor"), num(p, "count"), num(p, "depth")),
					num(p, "width"),
					str(p, "layout") as "strip" | "grid",
				),
		},
		{
			id: "mix-colors-png",
			title: "Mix Colors PNG",
			description:
				"Averages several hex colors into one swatch. Enter comma-separated #hex values; invalid tokens are skipped.",
			category: "generate",
			sourceMode: "none",
			params: [
				{
					id: "colors",
					label: "Colors (comma-separated hex)",
					type: "text",
					default: "#ff0000,#00ff00,#0000ff",
				},
				{
					id: "width",
					label: "Width",
					type: "slider",
					min: 128,
					max: 1024,
					step: 16,
					default: 512,
				},
			],
			generate: (p) =>
				renderSwatches(
					[mixColors(parseHexList(str(p, "colors")))],
					num(p, "width"),
					"strip",
				),
		},
		{
			id: "blend-two-png",
			title: "Blend Two Colors PNG",
			description: "A continuous horizontal gradient between two colors.",
			category: "generate",
			sourceMode: "none",
			params: [
				{
					id: "colorA",
					label: "Color A",
					type: "color",
					default: "#000000",
				},
				{
					id: "colorB",
					label: "Color B",
					type: "color",
					default: "#ffffff",
				},
				{
					id: "width",
					label: "Width",
					type: "slider",
					min: 128,
					max: 1024,
					step: 16,
					default: 512,
				},
			],
			generate: (p) =>
				renderBlend(str(p, "colorA"), str(p, "colorB"), num(p, "width")),
		},
		{
			id: "step-colors-png",
			title: "Color Steps PNG",
			description: "A discrete set of evenly spaced steps between two colors.",
			category: "generate",
			sourceMode: "none",
			params: [
				{
					id: "colorA",
					label: "Color A",
					type: "color",
					default: "#000000",
				},
				{
					id: "colorB",
					label: "Color B",
					type: "color",
					default: "#ffffff",
				},
				{
					id: "steps",
					label: "Steps",
					type: "slider",
					min: 2,
					max: 12,
					step: 1,
					default: 6,
				},
				...paletteParams("#808080").filter((q) => q.id !== "baseColor"),
			],
			generate: (p) =>
				renderSwatches(
					stepColors(str(p, "colorA"), str(p, "colorB"), num(p, "steps")),
					num(p, "width"),
					str(p, "layout") as "strip" | "grid",
				),
		},
		{
			id: "sort-colors-png",
			title: "Sort Colors PNG",
			description:
				"Renders your hex list as swatches sorted by hue, brightness or saturation. Invalid tokens are skipped.",
			category: "generate",
			sourceMode: "none",
			params: [
				{
					id: "colors",
					label: "Colors (comma-separated hex)",
					type: "text",
					default: "#ff0000,#ff8800,#ffff00,#00cc44,#0066ff,#8800ff",
				},
				{
					id: "order",
					label: "Sort by",
					type: "select",
					default: "hue",
					options: [
						{ value: "hue", label: "Hue" },
						{ value: "luma", label: "Brightness" },
						{ value: "sat", label: "Saturation" },
					],
				},
				...paletteParams("#ffffff").filter((q) => q.id !== "baseColor"),
			],
			generate: (p) =>
				renderSwatches(
					sortPalette(
						parseHexList(str(p, "colors")),
						str(p, "order") as SortKey,
					),
					num(p, "width"),
					str(p, "layout") as "strip" | "grid",
				),
		},
	];
}
