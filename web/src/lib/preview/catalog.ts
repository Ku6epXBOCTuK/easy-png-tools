import { TOOLS, type ToolEntry } from "../registry";

export type PreviewGroup = {
	id: string;
	label: string;
	tools: ToolEntry[];
};

/**
 * Preview-only catalog: a trimmed view of the registry that mirrors
 * refs-html/list-tools.html (28 tools in 6 groups). Used exclusively by
 * /preview and /kit so the working site (old) and /ui keep the full registry.
 *
 * Titles/descriptions are overridden with the ref's exact copy where they
 * diverge from the registry. The underlying ToolEntry (params, run, …) is
 * reused so navigation and tool pages stay functional.
 */
const REF: {
	group: string;
	label: string;
	tools: { id: string; title: string; description: string }[];
}[] = [
	{
		group: "convert",
		label: "CONVERT",
		tools: [
			{
				id: "jpg-to-png",
				title: "Convert JPG to PNG",
				description:
					"Re-encode JPEG files as lossless PNG while preserving transparency.",
			},
			{
				id: "webp-to-png",
				title: "Convert WebP to PNG",
				description:
					"Turn WebP images into a universal PNG format for any workflow.",
			},
			{
				id: "png-to-base64",
				title: "PNG to Base64",
				description:
					"Encode an image as a base64 string for embedding in code or styles.",
			},
			{
				id: "png-to-data-uri",
				title: "PNG to Data URI",
				description: "Build a complete data URI ready for HTML and CSS.",
			},
			{
				id: "convert-png-to-jpg",
				title: "Convert PNG to JPG",
				description:
					"Composite transparency over a selected backdrop and export JPEG.",
			},
		],
	},
	{
		group: "alpha",
		label: "TRANSPARENCY",
		tools: [
			{
				id: "remove-background-png",
				title: "Remove background PNG",
				description:
					"Remove a solid background by color, tolerance, or edge-connected regions.",
			},
			{
				id: "extract-alpha-mask-png",
				title: "Extract alpha mask",
				description:
					"Turn the alpha channel into a clean black-and-white mask.",
			},
			{
				id: "round-corners-png",
				title: "Round corners PNG",
				description: "Clip the image corners by a precise radius percentage.",
			},
			{
				id: "add-stroke-png",
				title: "Outline PNG",
				description:
					"Add a colored ring around opaque content with adjustable thickness.",
			},
			{
				id: "change-png-opacity",
				title: "Change PNG opacity",
				description:
					"Multiply the alpha channel while keeping the original colors unchanged.",
			},
		],
	},
	{
		group: "color",
		label: "COLOR",
		tools: [
			{
				id: "linear-gradient-png",
				title: "Create gradient PNG",
				description:
					"Generate a smooth transition between two colors with direction controls.",
			},
			{
				id: "grayscale-png",
				title: "Grayscale PNG",
				description: "Convert the image to luminance-based shades of gray.",
			},
			{
				id: "invert-colors-png",
				title: "Invert colors PNG",
				description:
					"Invert every color channel while leaving alpha untouched.",
			},
			{
				id: "adjust-brightness-contrast-png",
				title: "Brightness & contrast",
				description:
					"Adjust brightness and contrast across a controlled range.",
			},
			{
				id: "temperature-png",
				title: "Temperature PNG",
				description:
					"Make an image warmer or cooler with a single precise control.",
			},
		],
	},
	{
		group: "geometry",
		label: "GEOMETRY",
		tools: [
			{
				id: "resize-png",
				title: "Resize PNG",
				description:
					"Scale an image with bilinear interpolation and optional aspect lock.",
			},
			{
				id: "crop-png",
				title: "Crop PNG",
				description:
					"Cut a rectangular area with exact coordinates and dimensions.",
			},
			{
				id: "rotate-png",
				title: "Rotate PNG",
				description: "Rotate by 90, 180, or 270 degrees without quality loss.",
			},
			{
				id: "flip-png",
				title: "Flip PNG",
				description: "Mirror the image horizontally or vertically.",
			},
			{
				id: "add-padding-png",
				title: "Add padding to PNG",
				description:
					"Expand the canvas on all sides by a chosen number of pixels.",
			},
		],
	},
	{
		group: "filters",
		label: "FILTERS",
		tools: [
			{
				id: "blur-png",
				title: "Blur PNG",
				description:
					"Apply a fast Gaussian-style blur with transparent edge handling.",
			},
			{
				id: "sharpen-png",
				title: "Sharpen PNG",
				description: "Emphasize edges with an adjustable sharpening kernel.",
			},
			{
				id: "vignette-png",
				title: "Vignette PNG",
				description:
					"Smoothly darken the image edges while preserving the center.",
			},
			{
				id: "jpeg-artifacts-png",
				title: "JPEG artifacts",
				description: "Simulate low-quality JPEG recompression for testing.",
			},
		],
	},
	{
		group: "analyze",
		label: "ANALYZE",
		tools: [
			{
				id: "png-info",
				title: "PNG info",
				description:
					"Inspect dimensions, alpha presence, and unique color count.",
			},
			{
				id: "png-is-grayscale",
				title: "Check grayscale",
				description: "Report whether the image contains only shades of gray.",
			},
			{
				id: "png-is-transparent",
				title: "Check transparency",
				description: "Detect transparent and semi-transparent pixels.",
			},
			{
				id: "png-orientation",
				title: "PNG orientation",
				description: "Classify the image as portrait, landscape, or square.",
			},
		],
	},
];

const TOOL_BY_ID = new Map(TOOLS.map((t) => [t.id, t]));

export const PREVIEW_GROUPS: PreviewGroup[] = REF.map((g) => ({
	id: g.group,
	label: g.label,
	tools: g.tools.map((spec) => {
		const base = TOOL_BY_ID.get(spec.id);
		if (!base) {
			throw new Error(`preview catalog: missing tool ${spec.id}`);
		}
		return { ...base, title: spec.title, description: spec.description };
	}),
}));

// The ref header statically reads 32 (its own count); the body lists 28 cards.
// Mirroring the ref exactly keeps the audit at 0/0.
export const PREVIEW_TOTAL = 32;
