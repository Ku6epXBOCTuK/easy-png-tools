import { ToolError } from "../core/errors";
import {
	changeCanvasSize,
	crop,
	expandCanvas,
	resize,
	type Anchor9,
} from "../core/geometry";
import { field, toolSchema, type Dimension } from "../registry-schema";
import type { ToolEntry } from "./types";

interface AddBorderParams {
	thickness: number;
	color: string;
}

export const addBorderSchema = toolSchema<AddBorderParams>({
	thickness: field.number({ min: 1, max: 500, step: 1, default: 5 }),
	color: field.color({ default: "#000000" }),
});

const addBorder: ToolEntry<AddBorderParams> = {
	id: "add-border-png",
	title: "Add border to PNG",
	description:
		"Draws a colored frame of the chosen thickness around the image.",
	category: "geometry",
	schema: addBorderSchema,
	run: (img, p) =>
		expandCanvas(
			img,
			p.thickness,
			p.thickness,
			p.thickness,
			p.thickness,
			p.color,
		),
};

interface FitOnBackgroundParams {
	size: Dimension;
	transparent: boolean;
	color: string;
}

export const fitOnBackgroundSchema = toolSchema<FitOnBackgroundParams>({
	size: field.dimension({ min: 1, max: 20000, width: 800, height: 600 }),
	transparent: field.checkbox({ default: false }),
	color: field.color({ default: "#ffffff" }),
});

const fitOnBackground: ToolEntry<FitOnBackgroundParams> = {
	id: "fit-on-background-png",
	title: "Fit PNG onto background",
	description:
		"Places the image centered on a canvas of the given size with a transparent or colored background.",
	category: "geometry",
	schema: fitOnBackgroundSchema,
	run: (img, p) => {
		const width = Math.trunc(p.size.width);
		const height = Math.trunc(p.size.height);
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
			p.transparent ? undefined : p.color,
		);
	},
};

interface ChangeCanvasSizeParams {
	size: Dimension;
	anchor: Anchor9;
}

export const changeCanvasSizeSchema = toolSchema<ChangeCanvasSizeParams>({
	size: field.dimension({ min: 1, max: 20000, width: 800, height: 600 }),
	anchor: field.select({
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
	}),
});

const changeCanvasSizeTool: ToolEntry<ChangeCanvasSizeParams> = {
	id: "change-canvas-size-png",
	title: "Change Canvas Size PNG",
	description:
		"Sets the exact canvas size: overflow is cropped, missing space is filled with transparency. Anchor picks which part of the image stays.",
	category: "geometry",
	schema: changeCanvasSizeSchema,
	run: (img, p) =>
		changeCanvasSize(
			img,
			Math.trunc(p.size.width),
			Math.trunc(p.size.height),
			p.anchor,
		),
};

interface ResizeParams {
	size: Dimension;
	keepAspect: boolean;
}

export const resizeSchema = toolSchema<ResizeParams>({
	size: field.dimension({ min: 0, max: 20000, width: 0, height: 0 }),
	keepAspect: field.checkbox({ default: true }),
});

const resizeTool: ToolEntry<ResizeParams> = {
	id: "resize-png",
	title: "Resize PNG",
	description:
		"Scales the image with bilinear interpolation. With aspect kept, one side defines the scale; if both are set, the image fits inside them.",
	category: "geometry",
	schema: resizeSchema,
	run: (img, p) => {
		const keepAspect = p.keepAspect;
		let w = Math.trunc(p.size.width);
		let h = Math.trunc(p.size.height);
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
};

interface CropParams {
	x: number;
	y: number;
	size: Dimension;
}

export const cropSchema = toolSchema<CropParams>({
	x: field.number({ min: -100000, max: 100000, step: 1, default: 0 }),
	y: field.number({ min: -100000, max: 100000, step: 1, default: 0 }),
	size: field.dimension({ min: 0, max: 100000, width: 0, height: 0 }),
});

const cropTool: ToolEntry<CropParams> = {
	id: "crop-png",
	title: "Crop PNG",
	description:
		"Cuts out a rectangular area. Coordinates and sizes may go beyond the image — the area is clipped to the intersection.",
	category: "geometry",
	schema: cropSchema,
	run: (img, p) => {
		const w = Math.trunc(p.size.width);
		const h = Math.trunc(p.size.height);
		if (w <= 0 || h <= 0) {
			throw new ToolError("errors.cropSize");
		}
		return crop(img, Math.trunc(p.x), Math.trunc(p.y), w, h);
	},
};

export const geometryEntries = [
	addBorder,
	fitOnBackground,
	changeCanvasSizeTool,
	resizeTool,
	cropTool,
];
