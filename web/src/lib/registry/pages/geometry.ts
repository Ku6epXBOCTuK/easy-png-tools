import type { Page } from "../types";

export const geometryPages: Page[] = [
	{
		slug: "add-border-png",
		title: "Add border to PNG",
		description:
			"Draws a colored frame of the chosen thickness around the image.",
		category: "geometry",
		steps: [{ id: "add-border-png" }],
	},
	{
		slug: "fit-on-background-png",
		title: "Fit PNG onto background",
		description:
			"Places the image centered on a canvas of the given size with a transparent or colored background.",
		category: "geometry",
		steps: [{ id: "fit-on-background-png" }],
	},
	{
		slug: "change-canvas-size-png",
		title: "Change Canvas Size PNG",
		description:
			"Sets the exact canvas size: overflow is cropped, missing space is filled with transparency. Anchor picks which part of the image stays.",
		category: "geometry",
		steps: [{ id: "change-canvas-size-png" }],
	},
	{
		slug: "resize-png",
		title: "Resize PNG",
		description:
			"Scales the image with bilinear interpolation. With aspect kept, one side defines the scale; if both are set, the image fits inside them.",
		category: "geometry",
		steps: [{ id: "resize-png" }],
	},
	{
		slug: "crop-png",
		title: "Crop PNG",
		description:
			"Cuts out a rectangular area. Coordinates and sizes may go beyond the image — the area is clipped to the intersection.",
		category: "geometry",
		steps: [{ id: "crop-png" }],
	},
	{
		slug: "rotate-png",
		title: "Rotate PNG",
		description: "Rotates by 90°, 180° or 270° clockwise without quality loss.",
		category: "geometry",
		steps: [{ id: "rotate-png" }],
	},
	{
		slug: "flip-png",
		title: "Flip PNG",
		description: "Mirrors horizontally or vertically without quality loss.",
		category: "geometry",
		steps: [{ id: "flip-png" }],
	},
	{
		slug: "add-padding-png",
		title: "Add padding to PNG",
		description:
			"Expands the canvas on all sides by the chosen number of pixels.",
		category: "geometry",
		steps: [{ id: "add-padding-png" }],
	},
	{
		slug: "tile-png",
		title: "Tile PNG",
		description: "Repeats the image in a grid of the chosen columns and rows.",
		category: "geometry",
		steps: [{ id: "tile-png" }],
	},
	{
		slug: "split-into-parts-png",
		title: "Split PNG into parts",
		description:
			"Divides the image into a grid of equal-sized parts. The canvas is padded with transparency to keep every part the same size.",
		category: "geometry",
		steps: [{ id: "split-into-parts-png" }],
	},
	{
		slug: "center-by-alpha-png",
		title: "Center PNG by content",
		description:
			"Finds the opaque part of the image and centers it on the original canvas.",
		category: "geometry",
		steps: [{ id: "center-by-alpha-png" }],
	},
	{
		slug: "skew-png",
		title: "Skew PNG",
		description:
			"Shifts content horizontally and vertically — a perspective effect.",
		category: "geometry",
		steps: [{ id: "skew-png" }],
	},
	{
		slug: "rotate-free-png",
		title: "Rotate by custom angle",
		description:
			"Rotation by any angle. The canvas grows to fit the new bounds; corners stay transparent.",
		category: "geometry",
		steps: [{ id: "rotate-free-png" }],
	},
	{
		slug: "zoom-png",
		title: "Zoom PNG",
		description:
			"Magnifies content toward the center. The canvas keeps its size — edges are cropped.",
		category: "geometry",
		steps: [{ id: "zoom-png" }],
	},
	{
		slug: "trim-empty-space-png",
		title: "Trim Empty Space PNG",
		description:
			"Crops transparent borders around the content. Pixels with alpha above the threshold count as content.",
		category: "geometry",
		steps: [{ id: "trim-empty-space-png" }],
	},
	{
		slug: "change-aspect-ratio-png",
		title: "Change Aspect Ratio PNG",
		description:
			"Fits the image into a target aspect ratio: crop the center to fill, or pad with transparency.",
		category: "geometry",
		steps: [{ id: "change-aspect-ratio-png" }],
	},
	{
		slug: "swap-orientation-png",
		title: "Swap Orientation PNG",
		description:
			"Rotates the image by 90° when its orientation differs from the target — landscape becomes portrait and back. Square images are untouched.",
		category: "geometry",
		steps: [{ id: "swap-orientation-png" }],
	},
	{
		slug: "symmetric-copy-png",
		title: "Symmetric Copy PNG",
		description:
			"Doubles the canvas by mirroring the kept side onto the empty half — instant symmetric pattern.",
		category: "geometry",
		steps: [{ id: "symmetric-copy-png" }],
	},
	{
		slug: "shift-png",
		title: "Shift PNG",
		description: "Moves content by the given X and Y offset.",
		category: "geometry",
		steps: [{ id: "shift-png" }],
	},
];
