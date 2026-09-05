import type { ToolEntry } from "./types";
import { field, toolSchema } from "../registry-schema";
import type { Offset } from "../registry-schema";
import { colorMask, removeColorToAlpha } from "../core/alpha";
import { contourImage, strokeImage } from "../core/morphology";
import {
	boxTest,
	circleTest,
	renderShape,
	starTest,
	wavyTest,
} from "../core/shapes";

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

interface CircleMaskParams {
	size: number;
	offset: Offset;
}

const circleMaskSchema = toolSchema<CircleMaskParams>(
	{
		size: field.slider({ min: 20, max: 100, step: 1, default: 100 }),
		offset: field.offset({ min: -50, max: 50, x: 0, y: 0 }),
	},
	{
		layout: {
			groups: [
				{ title: "Shape", fields: ["size"] },
				{ title: "Position", fields: ["offset"] },
			],
		},
	},
);

const circleMask: ToolEntry<CircleMaskParams> = {
	id: "circle-mask-png",
	title: "Circle Mask PNG",
	description:
		"Cuts the image into a circle. Diameter is set as a share of the smaller side.",
	category: "alpha",
	schema: circleMaskSchema,
	run: (img, p) =>
		renderShape(
			img,
			circleTest(p.size / 200),
			p.offset.x / 100,
			p.offset.y / 100,
		),
};

interface SquareMaskParams {
	widthPct: number;
	heightPct: number;
	offset: Offset;
}

const squareMaskSchema = toolSchema<SquareMaskParams>(
	{
		widthPct: field.slider({ min: 10, max: 100, step: 1, default: 100 }),
		heightPct: field.slider({ min: 10, max: 100, step: 1, default: 100 }),
		offset: field.offset({ min: -50, max: 50, x: 0, y: 0 }),
	},
	{
		layout: {
			groups: [
				{
					title: "Shape",
					cols: 2,
					fields: ["widthPct", "heightPct"],
				},
				{ title: "Position", fields: ["offset"] },
			],
		},
	},
);

const squareMask: ToolEntry<SquareMaskParams> = {
	id: "square-mask-png",
	title: "Square Mask PNG",
	description:
		"Cuts the image into a rectangle with sides as a share of the smaller side.",
	category: "alpha",
	schema: squareMaskSchema,
	run: (img, p) =>
		renderShape(
			img,
			boxTest(p.widthPct / 200, p.heightPct / 200),
			p.offset.x / 100,
			p.offset.y / 100,
		),
};

interface StarMaskParams {
	points: number;
	innerRadius: number;
	size: number;
	rotation: number;
	offset: Offset;
}

const starMaskSchema = toolSchema<StarMaskParams>(
	{
		points: field.slider({ min: 3, max: 12, step: 1, default: 5 }),
		innerRadius: field.slider({ min: 10, max: 90, step: 1, default: 45 }),
		size: field.slider({ min: 20, max: 100, step: 1, default: 100 }),
		rotation: field.slider({ min: -180, max: 180, step: 1, default: 0 }),
		offset: field.offset({ min: -50, max: 50, x: 0, y: 0 }),
	},
	{
		layout: {
			groups: [
				{
					title: "Shape",
					cols: 2,
					fields: ["points", "innerRadius", "size", "rotation"],
				},
				{ title: "Position", fields: ["offset"] },
			],
		},
	},
);

const starMask: ToolEntry<StarMaskParams> = {
	id: "star-mask-png",
	title: "Star Mask PNG",
	description:
		"Cuts the image into an n-pointed star with adjustable inner radius and rotation.",
	category: "alpha",
	schema: starMaskSchema,
	run: (img, p) =>
		renderShape(
			img,
			starTest(p.points, p.innerRadius / 100, p.size / 200, p.rotation),
			p.offset.x / 100,
			p.offset.y / 100,
		),
};

interface WavyMaskParams {
	size: number;
	amplitude: number;
	waves: number;
	phase: number;
	offset: Offset;
}

const wavyMaskSchema = toolSchema<WavyMaskParams>(
	{
		size: field.slider({ min: 20, max: 100, step: 1, default: 90 }),
		amplitude: field.slider({ min: 2, max: 30, step: 1, default: 8 }),
		waves: field.slider({ min: 3, max: 24, step: 1, default: 8 }),
		phase: field.slider({ min: 0, max: 360, step: 1, default: 0 }),
		offset: field.offset({ min: -50, max: 50, x: 0, y: 0 }),
	},
	{
		layout: {
			groups: [
				{
					title: "Shape",
					cols: 2,
					fields: ["size", "amplitude", "waves", "phase"],
				},
				{ title: "Position", fields: ["offset"] },
			],
		},
	},
);

const wavyMask: ToolEntry<WavyMaskParams> = {
	id: "wavy-mask-png",
	title: "Wavy Mask PNG",
	description:
		"Cuts the image into a wavy-edged circle: radius is modulated by a sine with chosen amplitude and frequency.",
	category: "alpha",
	schema: wavyMaskSchema,
	run: (img, p) =>
		renderShape(
			img,
			wavyTest(p.size / 200, p.amplitude / 200, p.waves, p.phase),
			p.offset.x / 100,
			p.offset.y / 100,
		),
};

export const alphaEntries = [
	addStroke,
	findContour,
	removeColor,
	circleMask,
	squareMask,
	starMask,
	wavyMask,
];
