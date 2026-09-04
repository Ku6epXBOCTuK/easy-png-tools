import type { ToolEntry } from "./types";
import { field, toolSchema } from "../registry-schema";
import { colorMask, removeColorToAlpha } from "../core/alpha";
import { contourImage, strokeImage } from "../core/morphology";

interface AddStrokeParams {
	color: string;
	thickness: number;
}

export const addStrokeSchema = toolSchema<AddStrokeParams>({
	color: field.color({ default: "#ff0000" }),
	thickness: field.slider({ min: 1, max: 10, step: 1, default: 3 }),
});

const addStroke: ToolEntry<AddStrokeParams> = {
	id: "add-stroke-png",
	title: "Outline PNG",
	description:
		"Adds a colored ring outline around the opaque content with the chosen thickness.",
	category: "alpha",
	schema: addStrokeSchema,
	run: (img, p) => strokeImage(img, p.thickness, p.color),
};

interface FindContourParams {
	color: string;
	thickness: number;
}

export const findContourSchema = toolSchema<FindContourParams>({
	color: field.color({ default: "#000000" }),
	thickness: field.slider({ min: 1, max: 5, step: 1, default: 1 }),
});

const findContour: ToolEntry<FindContourParams> = {
	id: "find-contour-png",
	title: "Find contour PNG",
	description:
		"Leaves only a line along the boundary of opaque regions in the chosen color and thickness.",
	category: "alpha",
	schema: findContourSchema,
	run: (img, p) => contourImage(img, p.thickness, p.color),
};

interface RemoveColorParams {
	targetColor: string;
	tolerance: number;
}

export const removeColorSchema = toolSchema<RemoveColorParams>({
	targetColor: field.color({ default: "#00ff00" }),
	tolerance: field.slider({ min: 0, max: 100, step: 1, default: 10 }),
});

const removeColor: ToolEntry<RemoveColorParams> = {
	id: "remove-color-from-png",
	title: "Remove color from PNG (make transparent)",
	description:
		"Makes all pixels close to the chosen color transparent. The tolerance sets the allowed deviation as a percentage of the maximum color distance.",
	category: "alpha",
	schema: removeColorSchema,
	run: (img, p) => removeColorToAlpha(img, p.targetColor, p.tolerance),
	preview: (img, p) => colorMask(img, p.targetColor, p.tolerance),
};

export const alphaEntries = [addStroke, findContour, removeColor];
