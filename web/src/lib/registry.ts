import type { CategoryId } from "./categories";
import type { ToolSchema } from "./registry-schema";
import type { OutputMime } from "./core/io";
import type { PixelImage } from "./core/types";

import { convertEntries } from "./registry/convert";
import { geometryEntries } from "./registry/geometry";
import { alphaEntries } from "./registry/alpha";
import { colorEntries } from "./registry/color";
import { analyzeEntries } from "./registry/analyze";
import { generateEntries } from "./registry/generate";
import { textEntries } from "./registry/text";
import { filterEntries } from "./registry/filters";

export type ParamDef =
	| {
			id: string;
			label: string;
			type: "number";
			min?: number;
			max?: number;
			step?: number;
			default: number;
	  }
	| {
			id: string;
			label: string;
			type: "slider";
			min: number;
			max: number;
			step?: number;
			default: number;
	  }
	| {
			id: string;
			label: string;
			type: "select";
			options: { value: string; label: string }[];
			default: string;
	  }
	| { id: string; label: string; type: "checkbox"; default: boolean }
	| { id: string; label: string; type: "color"; default: string }
	| {
			id: string;
			label: string;
			type: "text";
			default: string;
			placeholder?: string;
	  };

export type OutputFormat = {
	mime: OutputMime;
	ext: string;
	qualityParamId?: string;
};

export type SourceMode = "file" | "none" | "text";

export type ToolEntry<P = Record<string, unknown>> = {
	id: string;
	title: string;
	description: string;
	category: CategoryId;
	sourceMode?: SourceMode;
	params: ParamDef[];
	schema?: ToolSchema<P>;
	run?: (img: PixelImage, params: P) => Promise<PixelImage> | PixelImage;
	generate?: (params: P) => Promise<PixelImage> | PixelImage;
	toText?: (img: PixelImage, params: P) => Promise<string> | string;
	runFromText?: (text: string, params: P) => Promise<PixelImage> | PixelImage;
	textToText?: (text: string) => Promise<string> | string;
	preview?: (img: PixelImage, params: P) => Promise<PixelImage> | PixelImage;
	popularity?: number;
	icon?: string;
	resultType?: "image" | "info" | "text";
	output?: OutputFormat;
	domOnly?: boolean;
	needsOverlaySource?: boolean;
};

export const PNG_OUTPUT: OutputFormat = { mime: "image/png", ext: "png" };

export function isChainable(tool: ToolEntry): boolean {
	return (
		(tool.resultType ?? "image") === "image" &&
		(!tool.sourceMode || tool.sourceMode === "file")
	);
}

const _convert = convertEntries();
const _geometry = geometryEntries();
const _alpha = alphaEntries();
const _color = colorEntries();
const _analyze = analyzeEntries();
const _generate = generateEntries();
const _text = textEntries();
const _filters = filterEntries();

export const TOOLS: ToolEntry[] = [
	..._color.slice(0, 6),
	..._analyze.slice(0, 6),
	..._convert.slice(0, 16),
	..._geometry.slice(0, 8),
	..._alpha.slice(0, 4),
	..._geometry.slice(8, 9),
	..._filters.slice(0, 2),
	..._color.slice(6, 17),
	..._convert.slice(16, 18),
	..._alpha.slice(4, 20),
	..._analyze.slice(6, 9),
	..._generate,
	..._text,
	..._alpha.slice(20, 21),
	..._analyze.slice(9, 10),
	..._geometry.slice(9, 18),
	..._filters.slice(2, 8),
	..._color.slice(17, 25),
	..._convert.slice(18, 20),
	..._analyze.slice(10, 11),
	..._convert.slice(20, 21),
	..._analyze.slice(11, 13),
];

import { TOOL_ICONS } from "./tools/tool-icons";
import { TOOL_POPULARITY } from "./tools/tool-popularity";

for (const entry of TOOLS) {
	entry.icon = entry.id;
	entry.popularity = TOOL_POPULARITY[entry.id] ?? 50;
}

export function getTool(id: string): ToolEntry | undefined {
	return TOOLS.find((tool) => tool.id === id);
}

export function defaultParams(tool: ToolEntry): Record<string, unknown> {
	return Object.fromEntries(tool.params.map((p) => [p.id, p.default]));
}

export function sanitizeParams(
	tool: ToolEntry,
	values: Record<string, unknown>,
): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	for (const param of tool.params) {
		const raw = values[param.id];
		switch (param.type) {
			case "number":
			case "slider": {
				const n =
					typeof raw === "number" && Number.isFinite(raw) ? raw : param.default;
				out[param.id] = clampRange(n, param.min, param.max);
				break;
			}
			case "select":
				out[param.id] =
					typeof raw === "string" && param.options.some((o) => o.value === raw)
						? raw
						: param.default;
				break;
			case "checkbox":
				out[param.id] = typeof raw === "boolean" ? raw : param.default;
				break;
			case "color":
				out[param.id] =
					typeof raw === "string" && /^#[0-9a-f]{6}$/i.test(raw)
						? raw
						: param.default;
				break;
			case "text":
				out[param.id] = typeof raw === "string" ? raw : param.default;
				break;
		}
	}
	return out;
}

function clampRange(value: number, min?: number, max?: number): number {
	if (min !== undefined && value < min) return min;
	if (max !== undefined && value > max) return max;
	return value;
}

export function outputOf(tool: ToolEntry): OutputFormat | undefined {
	if (tool.resultType === "info") return undefined;
	return tool.output ?? PNG_OUTPUT;
}
