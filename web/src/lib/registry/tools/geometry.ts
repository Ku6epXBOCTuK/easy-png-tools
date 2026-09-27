import {
	rotateFreeImage,
	skewImage,
	transformImage,
	zoomImage,
} from "../../core/affine";
import { ToolError } from "../../core/errors";
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
} from "../../core/geometry";
import { field, toolSchema, type Dimension } from "../../registry-schema";
import {
	imgTool,
	requireSource,
	type Tool,
	type ToolImageFile,
} from "../types";

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

const addBorder: Tool<AddBorderParams> = {
	id: "add-border-png",
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

const fitOnBackground: Tool<FitOnBackgroundParams> = {
	id: "fit-on-background-png",
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

const changeCanvasSizeTool: Tool<ChangeCanvasSizeParams> = {
	id: "change-canvas-size-png",
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
			width: 1,
			height: 1,
			defaultFromSource: true,
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

const resizeTool: Tool<ResizeParams> = {
	id: "resize-png",
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
			min: 0,
			max: 2000,
			step: 1,
			default: 0,
		}),
		y: field.number({
			label: "fields.y",
			min: 0,
			max: 1200,
			step: 1,
			default: 0,
		}),
		size: field.dimension({
			label: "fields.cropAreaSize",
			min: 1,
			max: 2000,
			width: 1,
			height: 1,
			defaultFromSource: true,
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

const cropTool: Tool<CropParams> = {
	id: "crop-png",
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

const rotateTool: Tool<RotateParams> = {
	id: "rotate-png",
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

const flipTool: Tool<FlipParams> = {
	id: "flip-png",
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

const addPaddingTool: Tool<AddPaddingParams> = {
	id: "add-padding-png",
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

const tileTool: Tool<TileParams> = {
	id: "tile-png",
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

const splitPartsTool: Tool<SplitPartsParams> = {
	id: "split-into-parts-png",
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

const centerByAlphaTool: Tool<EmptyParams> = {
	id: "center-by-alpha-png",
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

const skewTool: Tool<SkewParams> = {
	id: "skew-png",
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

const rotateFreeTool: Tool<RotateFreeParams> = {
	id: "rotate-free-png",
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

const zoomTool: Tool<ZoomParams> = {
	id: "zoom-png",
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

const trimEmptySpaceTool: Tool<TrimEmptySpaceParams> = {
	id: "trim-empty-space-png",
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

const changeAspectRatioTool: Tool<ChangeAspectRatioParams> = {
	id: "change-aspect-ratio-png",
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

const swapOrientationTool: Tool<SwapOrientationParams> = {
	id: "swap-orientation-png",
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

const symmetricCopyTool: Tool<SymmetricCopyParams> = {
	id: "symmetric-copy-png",
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

const shiftTool: Tool<ShiftParams> = {
	id: "shift-png",
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

export const geometryTools = [
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
