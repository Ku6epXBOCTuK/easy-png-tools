import { ToolError } from "../core/errors";
import {
	rotateFreeImage,
	skewImage,
	transformImage,
	zoomImage,
} from "../core/affine";
import {
	centerByAlpha,
	changeCanvasSize,
	crop,
	cropToRatio,
	expandCanvas,
	flip,
	forceOrientation,
	padToRatio,
	resize,
	rotate90,
	splitToParts,
	symmetricCopy,
	tile,
	trimToContent,
	type Anchor9,
	type FlipAxis,
} from "../core/geometry";
import { field, toolSchema, type Dimension } from "../registry-schema";
import {
	imgTool,
	requireSource,
	type ToolEntry,
	type ToolImageFile,
} from "./types";

interface AddBorderParams {
	thickness: number;
	color: string;
}

export const addBorderSchema = toolSchema<AddBorderParams>({
	thickness: field.number({
		label: "fields.thickness",
		min: 1,
		max: 500,
		step: 1,
		default: 5,
	}),
	color: field.color({ label: "fields.borderColor", default: "#000000" }),
});

const addBorder: ToolEntry<AddBorderParams> = {
	id: "add-border-png",
	title: "Add border to PNG",
	description:
		"Draws a colored frame of the chosen thickness around the image.",
	category: "geometry",
	schema: addBorderSchema,
	input: "image",
	run: imgTool((img, p) =>
		expandCanvas(
			img,
			p.thickness,
			p.thickness,
			p.thickness,
			p.thickness,
			p.color,
		),
	),
};

interface FitOnBackgroundParams {
	size: Dimension;
	transparent: boolean;
	color: string;
}

export const fitOnBackgroundSchema = toolSchema<FitOnBackgroundParams>(
	{
		size: field.dimension({
			label: "fields.canvasSize",
			min: 1,
			max: 20000,
			width: 800,
			height: 600,
		}),
		transparent: field.checkbox({
			label: "fields.transparent",
			default: false,
		}),
		color: field.color({ label: "fields.background", default: "#ffffff" }),
	},
	{
		layout: {
			groups: [
				{ title: "groups.canvas", fields: ["size"] },
				{ title: "groups.background", fields: ["transparent", "color"] },
			],
		},
	},
);

const fitOnBackground: ToolEntry<FitOnBackgroundParams> = {
	id: "fit-on-background-png",
	title: "Fit PNG onto background",
	description:
		"Places the image centered on a canvas of the given size with a transparent or colored background.",
	category: "geometry",
	schema: fitOnBackgroundSchema,
	input: "image",
	run: imgTool((img, p) => {
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
	}),
};

interface ChangeCanvasSizeParams {
	size: Dimension;
	anchor: Anchor9;
}

export const changeCanvasSizeSchema = toolSchema<ChangeCanvasSizeParams>(
	{
		size: field.dimension({
			label: "fields.canvasSize",
			min: 1,
			max: 20000,
			width: 800,
			height: 600,
		}),
		anchor: field.select({
			label: "fields.anchor",
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
	},
	{
		layout: {
			groups: [
				{ title: "groups.canvas", fields: ["size"] },
				{ title: "groups.anchor", fields: ["anchor"] },
			],
		},
	},
);

const changeCanvasSizeTool: ToolEntry<ChangeCanvasSizeParams> = {
	id: "change-canvas-size-png",
	title: "Change Canvas Size PNG",
	description:
		"Sets the exact canvas size: overflow is cropped, missing space is filled with transparency. Anchor picks which part of the image stays.",
	category: "geometry",
	schema: changeCanvasSizeSchema,
	input: "image",
	run: imgTool((img, p) =>
		changeCanvasSize(
			img,
			Math.trunc(p.size.width),
			Math.trunc(p.size.height),
			p.anchor,
		),
	),
};

interface ResizeParams {
	size: Dimension;
	keepAspect: boolean;
}

export const resizeSchema = toolSchema<ResizeParams>(
	{
		size: field.dimension({
			label: "fields.canvasSize",
			min: 0,
			max: 20000,
			width: 0,
			height: 0,
		}),
		keepAspect: field.checkbox({ label: "fields.keepAspect", default: true }),
	},
	{
		layout: {
			groups: [
				{ title: "groups.canvas", fields: ["size"] },
				{ title: "groups.scaling", fields: ["keepAspect"] },
			],
		},
	},
);

const resizeTool: ToolEntry<ResizeParams> = {
	id: "resize-png",
	title: "Resize PNG",
	description:
		"Scales the image with bilinear interpolation. With aspect kept, one side defines the scale; if both are set, the image fits inside them.",
	category: "geometry",
	schema: resizeSchema,
	input: "image",
	run: imgTool((img, p) => {
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
	}),
};

interface CropParams {
	x: number;
	y: number;
	size: Dimension;
}

export const cropSchema = toolSchema<CropParams>(
	{
		x: field.number({
			label: "fields.x",
			min: -100000,
			max: 100000,
			step: 1,
			default: 0,
		}),
		y: field.number({
			label: "fields.y",
			min: -100000,
			max: 100000,
			step: 1,
			default: 0,
		}),
		size: field.dimension({
			label: "fields.cropAreaSize",
			min: 0,
			max: 100000,
			width: 0,
			height: 0,
		}),
	},
	{
		layout: {
			groups: [
				{ title: "groups.offset", fields: ["x", "y"] },
				{ title: "groups.cropArea", fields: ["size"] },
			],
		},
	},
);

const cropTool: ToolEntry<CropParams> = {
	id: "crop-png",
	title: "Crop PNG",
	description:
		"Cuts out a rectangular area. Coordinates and sizes may go beyond the image — the area is clipped to the intersection.",
	category: "geometry",
	schema: cropSchema,
	input: "image",
	run: imgTool((img, p) => {
		const w = Math.trunc(p.size.width);
		const h = Math.trunc(p.size.height);
		if (w <= 0 || h <= 0) {
			throw new ToolError("errors.cropSize");
		}
		return crop(img, Math.trunc(p.x), Math.trunc(p.y), w, h);
	}),
};

interface RotateParams {
	angle: "90" | "180" | "270";
}

export const rotateSchema = toolSchema<RotateParams>({
	angle: field.select({
		label: "fields.angle",
		default: "90",
		options: [
			{ value: "90", label: "90° clockwise" },
			{ value: "180", label: "180°" },
			{ value: "270", label: "270° clockwise" },
		],
	}),
});

const rotateTool: ToolEntry<RotateParams> = {
	id: "rotate-png",
	title: "Rotate PNG",
	description: "Rotates by 90°, 180° or 270° clockwise without quality loss.",
	category: "geometry",
	schema: rotateSchema,
	input: "image",
	run: imgTool((img, p) => rotate90(img, Number(p.angle) / 90)),
};

interface FlipParams {
	axis: FlipAxis;
}

export const flipSchema = toolSchema<FlipParams>({
	axis: field.select({
		label: "fields.axis",
		default: "horizontal",
		options: [
			{ value: "horizontal", label: "Horizontal (left to right)" },
			{ value: "vertical", label: "Vertical (top to bottom)" },
		],
	}),
});

const flipTool: ToolEntry<FlipParams> = {
	id: "flip-png",
	title: "Flip PNG",
	description: "Mirrors horizontally or vertically without quality loss.",
	category: "geometry",
	schema: flipSchema,
	input: "image",
	run: imgTool((img, p) => flip(img, p.axis)),
};

interface AddPaddingParams {
	padding: number;
	transparent: boolean;
	color: string;
}

export const addPaddingSchema = toolSchema<AddPaddingParams>(
	{
		padding: field.number({
			label: "fields.padding",
			min: 1,
			max: 2000,
			step: 1,
			default: 10,
		}),
		transparent: field.checkbox({ label: "fields.transparent", default: true }),
		color: field.color({ label: "fields.fillColor", default: "#ffffff" }),
	},
	{
		layout: {
			groups: [
				{ title: "groups.padding", fields: ["padding"] },
				{ title: "groups.fill", fields: ["transparent", "color"] },
			],
		},
	},
);

const addPaddingTool: ToolEntry<AddPaddingParams> = {
	id: "add-padding-png",
	title: "Add padding to PNG",
	description:
		"Expands the canvas on all sides by the chosen number of pixels.",
	category: "geometry",
	schema: addPaddingSchema,
	input: "image",
	run: imgTool((img, p) =>
		expandCanvas(
			img,
			p.padding,
			p.padding,
			p.padding,
			p.padding,
			p.transparent ? undefined : p.color,
		),
	),
};

interface TileParams {
	columns: number;
	rows: number;
}

export const tileSchema = toolSchema<TileParams>({
	columns: field.number({
		label: "fields.columns",
		min: 1,
		max: 50,
		step: 1,
		default: 2,
	}),
	rows: field.number({
		label: "fields.rows",
		min: 1,
		max: 50,
		step: 1,
		default: 2,
	}),
});

const tileTool: ToolEntry<TileParams> = {
	id: "tile-png",
	title: "Tile PNG",
	description: "Repeats the image in a grid of the chosen columns and rows.",
	category: "geometry",
	schema: tileSchema,
	input: "image",
	run: imgTool((img, p) => tile(img, p.columns, p.rows)),
};

const MAX_SPLIT_PARTS = 1000;

interface SplitPartsParams {
	columns: number;
	rows: number;
}

export const splitPartsSchema = toolSchema<SplitPartsParams>({
	columns: field.number({
		label: "fields.columns",
		min: 1,
		max: 6,
		step: 1,
		default: 2,
	}),
	rows: field.number({
		label: "fields.rows",
		min: 1,
		max: 6,
		step: 1,
		default: 2,
	}),
});

const splitPartsTool: ToolEntry<SplitPartsParams> = {
	id: "split-into-parts-png",
	title: "Split PNG into parts",
	description:
		"Divides the image into a grid of equal-sized parts. The canvas is padded with transparency to keep every part the same size.",
	category: "geometry",
	schema: splitPartsSchema,
	input: "image",
	result: "files",
	run: (ctx) => {
		const img = requireSource(ctx);
		const params = ctx.params as SplitPartsParams;
		const cols = Math.max(1, Math.trunc(params.columns));
		const rowsCount = Math.max(1, Math.trunc(params.rows));
		const count = cols * rowsCount;
		if (count > MAX_SPLIT_PARTS) {
			throw new ToolError("errors.tooManyParts", { count });
		}
		const parts = splitToParts(img, cols, rowsCount);
		const rowLen = String(rowsCount).length;
		const colLen = String(cols).length;
		const files: ToolImageFile[] = parts.map((image, index) => {
			const col = (index % cols) + 1;
			const row = Math.floor(index / cols) + 1;
			return {
				name: `part-${String(row).padStart(rowLen, "0")}-${String(col).padStart(colLen, "0")}.png`,
				image,
			};
		});
		return { files };
	},
};

interface EmptyParams {}

export const centerByAlphaSchema = toolSchema<EmptyParams>({});

const centerByAlphaTool: ToolEntry<EmptyParams> = {
	id: "center-by-alpha-png",
	title: "Center PNG by content",
	description:
		"Finds the opaque part of the image and centers it on the original canvas.",
	category: "geometry",
	schema: centerByAlphaSchema,
	input: "image",
	run: imgTool((img) => centerByAlpha(img)),
};

interface SkewParams {
	degX: number;
	degY: number;
}

export const skewSchema = toolSchema<SkewParams>({
	degX: field.slider({
		label: "fields.skewX",
		min: -80,
		max: 80,
		step: 1,
		default: 0,
	}),
	degY: field.slider({
		label: "fields.skewY",
		min: -80,
		max: 80,
		step: 1,
		default: 0,
	}),
});

const skewTool: ToolEntry<SkewParams> = {
	id: "skew-png",
	title: "Skew PNG",
	description:
		"Shifts content horizontally and vertically — a perspective effect.",
	category: "geometry",
	schema: skewSchema,
	input: "image",
	run: imgTool((img, p) => skewImage(img, p.degX, p.degY)),
};

interface RotateFreeParams {
	angle: number;
}

export const rotateFreeSchema = toolSchema<RotateFreeParams>({
	angle: field.slider({
		label: "fields.angle",
		min: -180,
		max: 180,
		step: 1,
		default: 15,
	}),
});

const rotateFreeTool: ToolEntry<RotateFreeParams> = {
	id: "rotate-free-png",
	title: "Rotate by custom angle",
	description:
		"Rotation by any angle. The canvas grows to fit the new bounds; corners stay transparent.",
	category: "geometry",
	schema: rotateFreeSchema,
	input: "image",
	run: imgTool((img, p) => rotateFreeImage(img, p.angle)),
};

interface ZoomParams {
	scale: number;
}

export const zoomSchema = toolSchema<ZoomParams>({
	scale: field.slider({
		label: "fields.scalePct",
		min: 100,
		max: 500,
		step: 10,
		default: 200,
	}),
});

const zoomTool: ToolEntry<ZoomParams> = {
	id: "zoom-png",
	title: "Zoom PNG",
	description:
		"Magnifies content toward the center. The canvas keeps its size — edges are cropped.",
	category: "geometry",
	schema: zoomSchema,
	input: "image",
	run: imgTool((img, p) => zoomImage(img, p.scale)),
};

interface TrimEmptySpaceParams {
	threshold: number;
}

export const trimEmptySpaceSchema = toolSchema<TrimEmptySpaceParams>({
	threshold: field.slider({
		label: "fields.alphaThreshold",
		min: 0,
		max: 254,
		step: 1,
		default: 0,
	}),
});

const trimEmptySpaceTool: ToolEntry<TrimEmptySpaceParams> = {
	id: "trim-empty-space-png",
	title: "Trim Empty Space PNG",
	description:
		"Crops transparent borders around the content. Pixels with alpha above the threshold count as content.",
	category: "geometry",
	schema: trimEmptySpaceSchema,
	input: "image",
	run: imgTool((img, p) => trimToContent(img, p.threshold)),
};

type AspectRatio = "1:1" | "4:3" | "3:4" | "3:2" | "2:3" | "16:9" | "9:16";

interface ChangeAspectRatioParams {
	ratio: AspectRatio;
	mode: "crop" | "pad";
}

export const changeAspectRatioSchema = toolSchema<ChangeAspectRatioParams>({
	ratio: field.select({
		label: "fields.ratio",
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
	}),
	mode: field.select({
		label: "fields.fitMode",
		default: "crop",
		options: [
			{ value: "crop", label: "Crop to fill" },
			{ value: "pad", label: "Pad to fit" },
		],
	}),
});

const changeAspectRatioTool: ToolEntry<ChangeAspectRatioParams> = {
	id: "change-aspect-ratio-png",
	title: "Change Aspect Ratio PNG",
	description:
		"Fits the image into a target aspect ratio: crop the center to fill, or pad with transparency.",
	category: "geometry",
	schema: changeAspectRatioSchema,
	input: "image",
	run: imgTool((img, p) => {
		const [rw, rh] = p.ratio.split(":").map(Number);
		const ratio = rw / rh;
		return p.mode === "pad" ? padToRatio(img, ratio) : cropToRatio(img, ratio);
	}),
};

interface SwapOrientationParams {
	target: "portrait" | "landscape";
}

export const swapOrientationSchema = toolSchema<SwapOrientationParams>({
	target: field.select({
		label: "fields.orientation",
		default: "portrait",
		options: [
			{ value: "portrait", label: "Portrait" },
			{ value: "landscape", label: "Landscape" },
		],
	}),
});

const swapOrientationTool: ToolEntry<SwapOrientationParams> = {
	id: "swap-orientation-png",
	title: "Swap Orientation PNG",
	description:
		"Rotates the image by 90° when its orientation differs from the target — landscape becomes portrait and back. Square images are untouched.",
	category: "geometry",
	schema: swapOrientationSchema,
	input: "image",
	run: imgTool((img, p) => forceOrientation(img, p.target)),
};

type SymmetricAxis = "horizontal" | "vertical";
type KeepSide = "left" | "right" | "top" | "bottom";

interface SymmetricCopyParams {
	axis: SymmetricAxis;
	keepSide: KeepSide;
}

export const symmetricCopySchema = toolSchema<SymmetricCopyParams>({
	axis: field.select({
		label: "fields.axis",
		default: "vertical",
		options: [
			{ value: "vertical", label: "Vertical (double width)" },
			{ value: "horizontal", label: "Horizontal (double height)" },
		],
	}),
	keepSide: field.select({
		label: "fields.keepSide",
		default: "left",
		options: [
			{ value: "left", label: "Left" },
			{ value: "right", label: "Right" },
			{ value: "top", label: "Top" },
			{ value: "bottom", label: "Bottom" },
		],
	}),
});

const symmetricCopyTool: ToolEntry<SymmetricCopyParams> = {
	id: "symmetric-copy-png",
	title: "Symmetric Copy PNG",
	description:
		"Doubles the canvas by mirroring the kept side onto the empty half — instant symmetric pattern.",
	category: "geometry",
	schema: symmetricCopySchema,
	input: "image",
	run: imgTool((img, p) => symmetricCopy(img, p.axis, p.keepSide)),
};

interface ShiftParams {
	offsetX: number;
	offsetY: number;
	color: string;
}

export const shiftSchema = toolSchema<ShiftParams>({
	offsetX: field.number({
		label: "fields.offsetX",
		min: -5000,
		max: 5000,
		step: 1,
		default: 0,
	}),
	offsetY: field.number({
		label: "fields.offsetY",
		min: -5000,
		max: 5000,
		step: 1,
		default: 0,
	}),
	color: field.color({ label: "fields.fillColor", default: "#ffffff" }),
});

const shiftTool: ToolEntry<ShiftParams> = {
	id: "shift-png",
	title: "Shift PNG",
	description: "Moves content by the given X and Y offset.",
	category: "geometry",
	schema: shiftSchema,
	input: "image",
	run: imgTool((img, p) =>
		transformImage(
			img,
			[1, 0, 0, 1, -Math.trunc(p.offsetX), -Math.trunc(p.offsetY)],
			img.width,
			img.height,
			p.color,
		),
	),
};

export const geometryEntries = [
	addBorder,
	fitOnBackground,
	changeCanvasSizeTool,
	resizeTool,
	cropTool,
	rotateTool,
	flipTool,
	addPaddingTool,
	tileTool,
	centerByAlphaTool,
	skewTool,
	rotateFreeTool,
	zoomTool,
	trimEmptySpaceTool,
	changeAspectRatioTool,
	swapOrientationTool,
	symmetricCopyTool,
	shiftTool,
	splitPartsTool,
];
