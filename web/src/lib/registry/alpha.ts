import {
	extractAlphaMask,
	flattenOntoColor,
	hardenAlpha,
	invertAlpha,
	removeColorToAlpha,
	roundCorners,
	setAlphaChannel,
} from "../core/alpha";
import { removeBackground } from "../core/background";
import {
	closingImage,
	contourImage,
	dilateImage,
	erodeImage,
	openingImage,
	strokeImage,
} from "../core/morphology";
import { defringe, featherAlpha } from "../core/pixel-fx";
import {
	boxTest,
	circleTest,
	renderShape,
	starTest,
	wavyTest,
} from "../core/shapes";
import type { Offset } from "../registry-schema";
import { field, toolSchema } from "../registry-schema";
import { imgTool, type ToolEntry } from "./types";

interface AddStrokeParams {
	color: string;
	thickness: number;
}

export const addStrokeSchema = toolSchema<AddStrokeParams>({
	color: field.color({ label: "fields.strokeColor", default: "#ff0000" }),
	thickness: field.slider({
		label: "fields.thickness",
		min: 1,
		max: 10,
		step: 1,
		default: 3,
	}),
});

const addStroke: ToolEntry<AddStrokeParams> = {
	id: "add-stroke-png",
	title: "Outline PNG",
	description:
		"Adds a colored ring outline around the opaque content with the chosen thickness.",
	category: "alpha",
	schema: addStrokeSchema,
	input: "image",
	run: imgTool((img, p) => strokeImage(img, p.thickness, p.color)),
};

interface FindContourParams {
	color: string;
	thickness: number;
}

export const findContourSchema = toolSchema<FindContourParams>({
	color: field.color({ label: "fields.strokeColor", default: "#000000" }),
	thickness: field.slider({
		label: "fields.thickness",
		min: 1,
		max: 5,
		step: 1,
		default: 1,
	}),
});

const findContour: ToolEntry<FindContourParams> = {
	id: "find-contour-png",
	title: "Find contour PNG",
	description:
		"Leaves only a line along the boundary of opaque regions in the chosen color and thickness.",
	category: "alpha",
	schema: findContourSchema,
	input: "image",
	run: imgTool((img, p) => contourImage(img, p.thickness, p.color)),
};

interface RemoveColorParams {
	targetColor: string;
	tolerance: number;
}

export const removeColorSchema = toolSchema<RemoveColorParams>({
	targetColor: field.color({ label: "fields.targetColor", default: "#00ff00" }),
	tolerance: field.slider({
		label: "fields.colorTolerance",
		min: 0,
		max: 100,
		step: 1,
		default: 10,
	}),
});

const removeColor: ToolEntry<RemoveColorParams> = {
	id: "remove-color-from-png",
	title: "Remove color from PNG (make transparent)",
	description:
		"Makes all pixels close to the chosen color transparent. The tolerance sets the allowed deviation as a percentage of the maximum color distance.",
	category: "alpha",
	schema: removeColorSchema,
	input: "image",
	run: imgTool((img, p) => removeColorToAlpha(img, p.targetColor, p.tolerance)),
};

interface CircleMaskParams {
	size: number;
	offset: Offset;
}

const circleMaskSchema = toolSchema<CircleMaskParams>(
	{
		size: field.slider({
			label: "fields.shapeSize",
			min: 20,
			max: 100,
			step: 1,
			default: 100,
		}),
		offset: field.offset({
			label: "fields.offset",
			min: -50,
			max: 50,
			x: 0,
			y: 0,
		}),
	},
	{
		layout: {
			groups: [
				{ title: "groups.shape", fields: ["size"] },
				{ title: "groups.position", fields: ["offset"] },
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
	input: "image",
	run: imgTool((img, p) =>
		renderShape(
			img,
			circleTest(p.size / 200),
			p.offset.x / 100,
			p.offset.y / 100,
		),
	),
};

interface SquareMaskParams {
	widthPct: number;
	heightPct: number;
	offset: Offset;
}

const squareMaskSchema = toolSchema<SquareMaskParams>(
	{
		widthPct: field.slider({
			label: "fields.shapeWidthPct",
			min: 10,
			max: 100,
			step: 1,
			default: 100,
		}),
		heightPct: field.slider({
			label: "fields.shapeHeightPct",
			min: 10,
			max: 100,
			step: 1,
			default: 100,
		}),
		offset: field.offset({
			label: "fields.offset",
			min: -50,
			max: 50,
			x: 0,
			y: 0,
		}),
	},
	{
		layout: {
			groups: [
				{
					title: "groups.shape",
					cols: 2,
					fields: ["widthPct", "heightPct"],
				},
				{ title: "groups.position", fields: ["offset"] },
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
	input: "image",
	run: imgTool((img, p) =>
		renderShape(
			img,
			boxTest(p.widthPct / 200, p.heightPct / 200),
			p.offset.x / 100,
			p.offset.y / 100,
		),
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
		points: field.slider({
			label: "fields.points",
			min: 3,
			max: 12,
			step: 1,
			default: 5,
		}),
		innerRadius: field.slider({
			label: "fields.innerRadius",
			min: 10,
			max: 90,
			step: 1,
			default: 45,
		}),
		size: field.slider({
			label: "fields.shapeSize",
			min: 20,
			max: 100,
			step: 1,
			default: 100,
		}),
		rotation: field.slider({
			label: "fields.rotation",
			min: -180,
			max: 180,
			step: 1,
			default: 0,
		}),
		offset: field.offset({
			label: "fields.offset",
			min: -50,
			max: 50,
			x: 0,
			y: 0,
		}),
	},
	{
		layout: {
			groups: [
				{
					title: "groups.shape",
					cols: 2,
					fields: ["points", "innerRadius", "size", "rotation"],
				},
				{ title: "groups.position", fields: ["offset"] },
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
	input: "image",
	run: imgTool((img, p) =>
		renderShape(
			img,
			starTest(p.points, p.innerRadius / 100, p.size / 200, p.rotation),
			p.offset.x / 100,
			p.offset.y / 100,
		),
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
		size: field.slider({
			label: "fields.shapeSize",
			min: 20,
			max: 100,
			step: 1,
			default: 90,
		}),
		amplitude: field.slider({
			label: "fields.amplitude",
			min: 2,
			max: 30,
			step: 1,
			default: 8,
		}),
		waves: field.slider({
			label: "fields.waves",
			min: 3,
			max: 24,
			step: 1,
			default: 8,
		}),
		phase: field.slider({
			label: "fields.phase",
			min: 0,
			max: 360,
			step: 1,
			default: 0,
		}),
		offset: field.offset({
			label: "fields.offset",
			min: -50,
			max: 50,
			x: 0,
			y: 0,
		}),
	},
	{
		layout: {
			groups: [
				{
					title: "groups.shape",
					cols: 2,
					fields: ["size", "amplitude", "waves", "phase"],
				},
				{ title: "groups.position", fields: ["offset"] },
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
	input: "image",
	run: imgTool((img, p) =>
		renderShape(
			img,
			wavyTest(p.size / 200, p.amplitude / 200, p.waves, p.phase),
			p.offset.x / 100,
			p.offset.y / 100,
		),
	),
};

interface EmptyParams {}

export const removeAlphaChannelSchema = toolSchema<EmptyParams>({});

const removeAlphaChannel: ToolEntry<EmptyParams> = {
	id: "remove-alpha-channel-png",
	title: "Remove alpha channel PNG",
	description:
		"Composites the image over a white background and saves without transparency.",
	category: "alpha",
	schema: removeAlphaChannelSchema,
	input: "image",
	run: imgTool((img) => flattenOntoColor(img, "#ffffff")),
};

interface SetAlphaChannelParams {
	percent: number;
}

export const setAlphaChannelSchema = toolSchema<SetAlphaChannelParams>({
	percent: field.slider({
		label: "fields.percent",
		min: 0,
		max: 100,
		step: 1,
		default: 100,
	}),
});

const setAlphaChannelTool: ToolEntry<SetAlphaChannelParams> = {
	id: "set-alpha-channel-png",
	title: "Set alpha channel PNG",
	description: "Assigns the same opacity to all pixels; colors stay unchanged.",
	category: "alpha",
	schema: setAlphaChannelSchema,
	input: "image",
	run: imgTool((img, p) => setAlphaChannel(img, p.percent)),
};

export const extractAlphaMaskSchema = toolSchema<EmptyParams>({});

const extractAlphaMaskTool: ToolEntry<EmptyParams> = {
	id: "extract-alpha-mask-png",
	title: "Extract alpha mask PNG",
	description: "Turns transparency into a black-and-white opaque mask.",
	category: "alpha",
	schema: extractAlphaMaskSchema,
	input: "image",
	run: imgTool((img) => extractAlphaMask(img)),
};

interface RoundCornersParams {
	radius: number;
}

export const roundCornersSchema = toolSchema<RoundCornersParams>({
	radius: field.slider({
		label: "fields.radius",
		min: 0,
		max: 50,
		step: 1,
		default: 10,
	}),
});

const roundCornersTool: ToolEntry<RoundCornersParams> = {
	id: "round-corners-png",
	title: "Round corners PNG",
	description:
		"Clips corners by a radius set as a percentage of half the smaller side.",
	category: "alpha",
	schema: roundCornersSchema,
	input: "image",
	run: imgTool((img, p) => roundCorners(img, p.radius)),
};

export const invertAlphaSchema = toolSchema<EmptyParams>({});

const invertAlphaTool: ToolEntry<EmptyParams> = {
	id: "invert-alpha-png",
	title: "Invert alpha PNG",
	description: "Opaque areas become transparent and vice versa.",
	category: "alpha",
	schema: invertAlphaSchema,
	input: "image",
	run: imgTool((img) => invertAlpha(img)),
};

interface RemoveBackgroundParams {
	color: string;
	tolerance: number;
	outerOnly: boolean;
	smooth: number;
}

export const removeBackgroundSchema = toolSchema<RemoveBackgroundParams>(
	{
		color: field.color({ label: "fields.backgroundColor", default: "#ffffff" }),
		tolerance: field.slider({
			label: "fields.colorTolerance",
			min: 0,
			max: 100,
			step: 1,
			default: 10,
		}),
		outerOnly: field.checkbox({ label: "fields.outerOnly", default: true }),
		smooth: field.slider({
			label: "fields.smooth",
			min: 0,
			max: 8,
			step: 1,
			default: 1,
		}),
	},
	{
		layout: {
			groups: [
				{
					title: "groups.background",
					cols: 2,
					fields: ["color", "tolerance"],
				},
				{ title: "groups.options", fields: ["outerOnly", "smooth"] },
			],
		},
	},
);

const removeBackgroundTool: ToolEntry<RemoveBackgroundParams> = {
	id: "remove-background-png",
	title: "Remove background PNG (smart)",
	description:
		"Removes a solid background: by color with tolerance, outer regions from the edges only, or every matching pixel. Can smooth the boundary.",
	category: "alpha",
	schema: removeBackgroundSchema,
	input: "image",
	run: imgTool((img, p) =>
		removeBackground(img, {
			color: p.color,
			tolerancePercent: p.tolerance,
			outerOnly: p.outerOnly,
			smoothPasses: p.smooth,
		}),
	),
};

interface MakeThickerParams {
	radius: number;
}

export const makeThickerSchema = toolSchema<MakeThickerParams>({
	radius: field.slider({
		label: "fields.radius",
		min: 1,
		max: 10,
		step: 1,
		default: 2,
	}),
});

const makeThickerTool: ToolEntry<MakeThickerParams> = {
	id: "make-thicker-png",
	title: "Thicken PNG",
	description: "Expands opaque areas by the given number of pixels.",
	category: "alpha",
	schema: makeThickerSchema,
	input: "image",
	run: imgTool((img, p) => dilateImage(img, p.radius)),
};

interface MakeThinnerParams {
	radius: number;
}

export const makeThinnerSchema = toolSchema<MakeThinnerParams>({
	radius: field.slider({
		label: "fields.radius",
		min: 1,
		max: 10,
		step: 1,
		default: 1,
	}),
});

const makeThinnerTool: ToolEntry<MakeThinnerParams> = {
	id: "make-thinner-png",
	title: "Thin PNG",
	description: "Shrinks opaque areas — thins the strokes of text and details.",
	category: "alpha",
	schema: makeThinnerSchema,
	input: "image",
	run: imgTool((img, p) => erodeImage(img, p.radius)),
};

interface FeatherEdgesParams {
	radius: number;
}

export const featherEdgesSchema = toolSchema<FeatherEdgesParams>({
	radius: field.slider({
		label: "fields.radius",
		min: 1,
		max: 20,
		step: 1,
		default: 3,
	}),
});

const featherEdgesTool: ToolEntry<FeatherEdgesParams> = {
	id: "feather-edges-png",
	title: "Feather Edges PNG",
	description:
		"Blurs only the alpha channel: hard cutout edges become soft and gradual, colors stay untouched.",
	category: "alpha",
	schema: featherEdgesSchema,
	input: "image",
	run: imgTool((img, p) => featherAlpha(img, p.radius)),
};

interface CleanEdgesParams {
	radius: number;
}

export const cleanEdgesSchema = toolSchema<CleanEdgesParams>({
	radius: field.slider({
		label: "fields.radius",
		min: 1,
		max: 10,
		step: 1,
		default: 3,
	}),
});

const cleanEdgesTool: ToolEntry<CleanEdgesParams> = {
	id: "clean-edges-png",
	title: "Clean Edges PNG (defringe)",
	description:
		"Replaces edge-halo colors of semi-transparent pixels with the nearest fully opaque color. Alpha stays as is.",
	category: "alpha",
	schema: cleanEdgesSchema,
	input: "image",
	run: imgTool((img, p) => defringe(img, p.radius)),
};

interface HardenAlphaParams {
	threshold: number;
}

export const hardenAlphaSchema = toolSchema<HardenAlphaParams>({
	threshold: field.slider({
		label: "fields.alphaThreshold",
		min: 0,
		max: 100,
		step: 1,
		default: 50,
	}),
});

const hardenAlphaTool: ToolEntry<HardenAlphaParams> = {
	id: "harden-alpha-png",
	title: "Harden edges PNG",
	description:
		"Binarizes the alpha channel by threshold: semi-transparent pixels become either fully transparent or fully opaque.",
	category: "alpha",
	schema: hardenAlphaSchema,
	input: "image",
	run: imgTool((img, p) => hardenAlpha(img, p.threshold)),
};

interface DespeckleAlphaParams {
	radius: number;
}

export const despeckleAlphaSchema = toolSchema<DespeckleAlphaParams>({
	radius: field.slider({
		label: "fields.radius",
		min: 1,
		max: 3,
		step: 1,
		default: 1,
	}),
});

const despeckleAlphaTool: ToolEntry<DespeckleAlphaParams> = {
	id: "despeckle-alpha-png",
	title: "Despeckle PNG",
	description:
		"Opening: removes lone semi-transparent pixels and small specks.",
	category: "alpha",
	schema: despeckleAlphaSchema,
	input: "image",
	run: imgTool((img, p) => openingImage(img, p.radius)),
};

interface CloseHolesParams {
	radius: number;
}

export const closeHolesSchema = toolSchema<CloseHolesParams>({
	radius: field.slider({
		label: "fields.radius",
		min: 1,
		max: 3,
		step: 1,
		default: 1,
	}),
});

const closeHolesTool: ToolEntry<CloseHolesParams> = {
	id: "close-holes-png",
	title: "Close holes PNG",
	description: "Closing: fills lone transparent dots inside the object.",
	category: "alpha",
	schema: closeHolesSchema,
	input: "image",
	run: imgTool((img, p) => closingImage(img, p.radius)),
};

export const alphaEntries = [
	addStroke,
	findContour,
	removeColor,
	circleMask,
	squareMask,
	starMask,
	wavyMask,
	removeAlphaChannel,
	setAlphaChannelTool,
	extractAlphaMaskTool,
	roundCornersTool,
	invertAlphaTool,
	removeBackgroundTool,
	makeThickerTool,
	makeThinnerTool,
	featherEdgesTool,
	cleanEdgesTool,
	hardenAlphaTool,
	despeckleAlphaTool,
	closeHolesTool,
];
