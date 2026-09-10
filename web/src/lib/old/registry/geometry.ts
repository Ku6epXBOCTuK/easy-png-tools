import type { ToolEntry } from "../registry";
import { ToolError } from "../../core/errors";
import {
	crop,
	expandCanvas,
	flip,
	resize,
	rotate90,
	tile,
	centerByAlpha,
	changeCanvasSize,
	cropToRatio,
	forceOrientation,
	padToRatio,
	symmetricCopy,
	trimToContent,
	type Anchor9,
} from "../../core/geometry";
import {
	rotateFreeImage,
	skewImage,
	transformImage,
	zoomImage,
} from "../../core/affine";
import { num, str } from "../registry-helpers";

export function geometryEntries(): ToolEntry[] {
	return [
		{
			id: "resize-png",
			title: "Resize PNG",
			description:
				"Scales the image with bilinear interpolation. With aspect kept, one side defines the scale; if both are set, the image fits inside them.",
			category: "geometry",
			params: [
				{
					id: "width",
					label: "Width (0 = auto)",
					type: "number",
					min: 0,
					max: 20000,
					step: 1,
					default: 0,
				},
				{
					id: "height",
					label: "Height (0 = auto)",
					type: "number",
					min: 0,
					max: 20000,
					step: 1,
					default: 0,
				},
				{
					id: "keepAspect",
					label: "Keep aspect ratio",
					type: "checkbox",
					default: true,
				},
			],
			run: (img, p) => {
				const keepAspect = p["keepAspect"] === true;
				let w = Math.trunc(num(p, "width"));
				let h = Math.trunc(num(p, "height"));
				if (keepAspect) {
					if (w > 0 && h > 0) {
						const scale = Math.min(w / img.width, h / img.height);
						w = Math.max(1, Math.round(img.width * scale));
						h = Math.max(1, Math.round(img.height * scale));
					} else if (w > 0) {
						h = Math.max(1, Math.round((img.height / img.width) * w));
					} else if (h > 0) {
						w = Math.max(1, Math.round((img.width / img.height) * h));
					}
				}
				if (w <= 0 || h <= 0) {
					throw new ToolError("errors.resizeSize");
				}
				return resize(img, w, h);
			},
		},
		{
			id: "crop-png",
			title: "Crop PNG",
			description:
				"Cuts out a rectangular area. Coordinates and sizes may go beyond the image — the area is clipped to the intersection.",
			category: "geometry",
			params: [
				{
					id: "x",
					label: "X (from left)",
					type: "number",
					min: -100000,
					max: 100000,
					step: 1,
					default: 0,
				},
				{
					id: "y",
					label: "Y (from top)",
					type: "number",
					min: -100000,
					max: 100000,
					step: 1,
					default: 0,
				},
				{
					id: "width",
					label: "Area width",
					type: "number",
					min: -100000,
					max: 100000,
					step: 1,
					default: 0,
				},
				{
					id: "height",
					label: "Area height",
					type: "number",
					min: -100000,
					max: 100000,
					step: 1,
					default: 0,
				},
			],
			run: (img, p) => {
				const w = Math.trunc(num(p, "width"));
				const h = Math.trunc(num(p, "height"));
				if (w <= 0 || h <= 0) {
					throw new ToolError("errors.cropSize");
				}
				return crop(
					img,
					Math.trunc(num(p, "x")),
					Math.trunc(num(p, "y")),
					w,
					h,
				);
			},
		},
		{
			id: "rotate-png",
			title: "Rotate PNG",
			description:
				"Rotates by 90°, 180° or 270° clockwise without quality loss.",
			category: "geometry",
			params: [
				{
					id: "angle",
					label: "Rotation angle",
					type: "select",
					default: "90",
					options: [
						{ value: "90", label: "90° clockwise" },
						{ value: "180", label: "180°" },
						{ value: "270", label: "270° clockwise" },
					],
				},
			],
			run: (img, p) => rotate90(img, Number(str(p, "angle")) / 90),
		},
		{
			id: "flip-png",
			title: "Flip PNG",
			description: "Mirrors horizontally or vertically without quality loss.",
			category: "geometry",
			params: [
				{
					id: "axis",
					label: "Flip axis",
					type: "select",
					default: "horizontal",
					options: [
						{
							value: "horizontal",
							label: "Horizontal (left to right)",
						},
						{
							value: "vertical",
							label: "Vertical (top to bottom)",
						},
					],
				},
			],
			run: (img, p) =>
				flip(img, str(p, "axis") === "vertical" ? "vertical" : "horizontal"),
		},
		{
			id: "add-padding-png",
			title: "Add padding to PNG",
			description:
				"Expands the canvas on all sides by the chosen number of pixels.",
			category: "geometry",
			params: [
				{
					id: "padding",
					label: "Padding, px",
					type: "number",
					min: 1,
					max: 2000,
					step: 1,
					default: 10,
				},
				{
					id: "transparent",
					label: "Transparent padding",
					type: "checkbox",
					default: true,
				},
				{
					id: "color",
					label: "Padding color",
					type: "color",
					default: "#ffffff",
				},
			],
			run: (img, p) =>
				expandCanvas(
					img,
					num(p, "padding"),
					num(p, "padding"),
					num(p, "padding"),
					num(p, "padding"),
					p["transparent"] === true ? undefined : str(p, "color"),
				),
		},
		{
			id: "add-border-png",
			title: "Add border to PNG",
			description:
				"Draws a colored frame of the chosen thickness around the image.",
			category: "geometry",
			params: [
				{
					id: "thickness",
					label: "Border thickness, px",
					type: "number",
					min: 1,
					max: 500,
					step: 1,
					default: 5,
				},
				{
					id: "color",
					label: "Border color",
					type: "color",
					default: "#000000",
				},
			],
			run: (img, p) =>
				expandCanvas(
					img,
					num(p, "thickness"),
					num(p, "thickness"),
					num(p, "thickness"),
					num(p, "thickness"),
					str(p, "color"),
				),
		},
		{
			id: "fit-on-background-png",
			title: "Fit PNG onto background",
			description:
				"Places the image centered on a canvas of the given size with a transparent or colored background.",
			category: "geometry",
			params: [
				{
					id: "width",
					label: "Canvas width",
					type: "number",
					min: 1,
					max: 20000,
					step: 1,
					default: 800,
				},
				{
					id: "height",
					label: "Canvas height",
					type: "number",
					min: 1,
					max: 20000,
					step: 1,
					default: 600,
				},
				{
					id: "transparent",
					label: "Transparent background",
					type: "checkbox",
					default: false,
				},
				{
					id: "color",
					label: "Background color",
					type: "color",
					default: "#ffffff",
				},
			],
			run: (img, p) => {
				const width = Math.trunc(num(p, "width"));
				const height = Math.trunc(num(p, "height"));
				if (width <= 0 || height <= 0) {
					throw new ToolError("errors.sizePositive");
				}
				const left = Math.max(0, Math.floor((width - img.width) / 2));
				const top = Math.max(0, Math.floor((height - img.height) / 2));
				return expandCanvas(
					img,
					left,
					top,
					Math.max(0, width - img.width - left),
					Math.max(0, height - img.height - top),
					p["transparent"] === true ? undefined : str(p, "color"),
				);
			},
		},
		{
			id: "tile-png",
			title: "Tile PNG",
			description:
				"Repeats the image in a grid of the chosen columns and rows.",
			category: "geometry",
			params: [
				{
					id: "columns",
					label: "Columns",
					type: "number",
					min: 1,
					max: 50,
					step: 1,
					default: 2,
				},
				{
					id: "rows",
					label: "Rows",
					type: "number",
					min: 1,
					max: 50,
					step: 1,
					default: 2,
				},
			],
			run: (img, p) => tile(img, num(p, "columns"), num(p, "rows")),
		},
		{
			id: "center-by-alpha-png",
			title: "Center PNG by content",
			description:
				"Finds the opaque part of the image and centers it on the original canvas.",
			category: "geometry",
			params: [],
			run: (img) => centerByAlpha(img),
		},
		{
			id: "skew-png",
			title: "Skew PNG",
			description:
				"Shifts content horizontally and vertically — a perspective effect.",
			category: "geometry",
			params: [
				{
					id: "degX",
					label: "Skew X, °",
					type: "slider",
					min: -80,
					max: 80,
					step: 1,
					default: 0,
				},
				{
					id: "degY",
					label: "Skew Y, °",
					type: "slider",
					min: -80,
					max: 80,
					step: 1,
					default: 0,
				},
			],
			run: (img, p) => skewImage(img, num(p, "degX"), num(p, "degY")),
		},
		{
			id: "rotate-free-png",
			title: "Rotate by custom angle",
			description:
				"Rotation by any angle. The canvas grows to fit the new bounds; corners stay transparent.",
			category: "geometry",
			params: [
				{
					id: "angle",
					label: "Angle, °",
					type: "slider",
					min: -180,
					max: 180,
					step: 1,
					default: 15,
				},
			],
			run: (img, p) => rotateFreeImage(img, num(p, "angle")),
		},
		{
			id: "zoom-png",
			title: "Zoom PNG",
			description:
				"Magnifies content toward the center. The canvas keeps its size — edges are cropped.",
			category: "geometry",
			params: [
				{
					id: "scale",
					label: "Scale, %",
					type: "slider",
					min: 100,
					max: 500,
					step: 10,
					default: 200,
				},
			],
			run: (img, p) => zoomImage(img, num(p, "scale")),
		},
		{
			id: "trim-empty-space-png",
			title: "Trim Empty Space PNG",
			description:
				"Crops transparent borders around the content. Pixels with alpha above the threshold count as content.",
			category: "geometry",
			params: [
				{
					id: "threshold",
					label: "Alpha threshold",
					type: "slider",
					min: 0,
					max: 254,
					step: 1,
					default: 0,
				},
			],
			run: (img, p) => trimToContent(img, num(p, "threshold")),
		},
		{
			id: "change-canvas-size-png",
			title: "Change Canvas Size PNG",
			description:
				"Sets the exact canvas size: overflow is cropped, missing space is filled with transparency. Anchor picks which part of the image stays.",
			category: "geometry",
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
					id: "anchor",
					label: "Anchor",
					type: "select",
					default: "center",
					options: [
						{ value: "top-left", label: "Top left" },
						{ value: "top-center", label: "Top center" },
						{ value: "top-right", label: "Top right" },
						{ value: "middle-left", label: "Middle left" },
						{ value: "center", label: "Center" },
						{ value: "middle-right", label: "Middle right" },
						{ value: "bottom-left", label: "Bottom left" },
						{ value: "bottom-center", label: "Bottom center" },
						{ value: "bottom-right", label: "Bottom right" },
					],
				},
			],
			run: (img, p) =>
				changeCanvasSize(
					img,
					Math.trunc(num(p, "width")),
					Math.trunc(num(p, "height")),
					str(p, "anchor") as Anchor9,
				),
		},
		{
			id: "change-aspect-ratio-png",
			title: "Change Aspect Ratio PNG",
			description:
				"Fits the image into a target aspect ratio: crop the center to fill, or pad with transparency.",
			category: "geometry",
			params: [
				{
					id: "ratio",
					label: "Target ratio",
					type: "select",
					default: "1:1",
					options: [
						{ value: "1:1", label: "1:1" },
						{ value: "4:3", label: "4:3" },
						{ value: "3:4", label: "3:4" },
						{ value: "3:2", label: "3:2" },
						{ value: "2:3", label: "2:3" },
						{ value: "16:9", label: "16:9" },
						{ value: "9:16", label: "9:16" },
					],
				},
				{
					id: "mode",
					label: "Mode",
					type: "select",
					default: "crop",
					options: [
						{ value: "crop", label: "Crop to fill" },
						{ value: "pad", label: "Pad to fit" },
					],
				},
			],
			run: (img, p) => {
				const [rw, rh] = str(p, "ratio").split(":").map(Number);
				const ratio = rw / rh;
				return str(p, "mode") === "pad"
					? padToRatio(img, ratio)
					: cropToRatio(img, ratio);
			},
		},
		{
			id: "swap-orientation-png",
			title: "Swap Orientation PNG",
			description:
				"Rotates the image by 90° when its orientation differs from the target — landscape becomes portrait and back. Square images are untouched.",
			category: "geometry",
			params: [
				{
					id: "target",
					label: "Target orientation",
					type: "select",
					default: "portrait",
					options: [
						{ value: "portrait", label: "Portrait" },
						{ value: "landscape", label: "Landscape" },
					],
				},
			],
			run: (img, p) =>
				forceOrientation(
					img,
					str(p, "target") === "landscape" ? "landscape" : "portrait",
				),
		},
		{
			id: "symmetric-copy-png",
			title: "Symmetric Copy PNG",
			description:
				"Doubles the canvas by mirroring the kept side onto the empty half — instant symmetric pattern.",
			category: "geometry",
			params: [
				{
					id: "axis",
					label: "Mirror line",
					type: "select",
					default: "vertical",
					options: [
						{
							value: "vertical",
							label: "Vertical (double width)",
						},
						{
							value: "horizontal",
							label: "Horizontal (double height)",
						},
					],
				},
				{
					id: "keepSide",
					label: "Keep side",
					type: "select",
					default: "left",
					options: [
						{ value: "left", label: "Left" },
						{ value: "right", label: "Right" },
						{ value: "top", label: "Top" },
						{ value: "bottom", label: "Bottom" },
					],
				},
			],
			run: (img, p) =>
				symmetricCopy(
					img,
					str(p, "axis") === "horizontal" ? "horizontal" : "vertical",
					str(p, "keepSide") as "left" | "right" | "top" | "bottom",
				),
		},
		{
			id: "shift-png",
			title: "Shift PNG",
			description: "Moves content by the given X and Y offset.",
			category: "geometry",
			params: [
				{
					id: "offsetX",
					label: "Offset X, px",
					type: "number",
					min: -5000,
					max: 5000,
					step: 1,
					default: 0,
				},
				{
					id: "offsetY",
					label: "Offset Y, px",
					type: "number",
					min: -5000,
					max: 5000,
					step: 1,
					default: 0,
				},
				{
					id: "color",
					label: "Background color",
					type: "color",
					default: "#ffffff",
				},
			],
			run: (img, p) =>
				transformImage(
					img,
					[
						1,
						0,
						0,
						1,
						-Math.trunc(num(p, "offsetX")),
						-Math.trunc(num(p, "offsetY")),
					],
					img.width,
					img.height,
					str(p, "color"),
				),
		},
	];
}
