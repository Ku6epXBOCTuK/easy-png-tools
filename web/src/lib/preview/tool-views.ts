import type { ToolEntry } from "$lib/registry";

export type SegmentedField = {
	id: string;
	kind: "segmented";
	label: string;
	options: string[];
	selected: number;
};
export type ColorPairField = {
	id: string;
	kind: "color-pair";
	label: string;
	from: string;
	to: string;
};
export type SliderField = {
	id: string;
	kind: "slider" | "direction";
	label: string;
	value: number;
	min: number;
	max: number;
	suffix: string;
	space?: boolean;
	hints?: [string, string];
};
export type ColorField = {
	id: string;
	kind: "color";
	label: string;
	value: string;
	native?: boolean;
	reference?: boolean;
};
export type ToggleField = {
	id: string;
	kind: "toggle";
	label: string;
	checked: boolean;
	note: string;
};

export type FieldDef =
	| SegmentedField
	| ColorPairField
	| SliderField
	| ColorField
	| ToggleField;

export interface PreviewToolView {
	title: string;
	lede: string;
	panelLabel: string;
	panelStrong: string;
	stepType: string;
	toolbarLabel: string;
	fileName: string;
	downloadLabel: string;
	layoutClass: string;
	previewClass: string;
	preview: "gradient" | "comparison";
	fields: FieldDef[];
}

export type FieldValue = number | string | boolean | { from: string; to: string };

function initValue(f: FieldDef): FieldValue {
	switch (f.kind) {
		case "segmented":
			return f.selected;
		case "color-pair":
			return { from: f.from, to: f.to };
		case "color":
			return f.value;
		case "slider":
		case "direction":
			return f.value;
		case "toggle":
			return f.checked;
	}
}

export function initForm(view: PreviewToolView): Record<string, FieldValue> {
	const form: Record<string, FieldValue> = {};
	for (const f of view.fields) form[f.id] = initValue(f);
	return form;
}

const gradient: PreviewToolView = {
	title: "Gradient background.",
	lede: "Create a clean, export-ready gradient with precise control over color, direction and transparency.",
	panelLabel: "GRADIENT SETTINGS",
	panelStrong: "Configure output",
	stepType: "TOOL 01",
	toolbarLabel: "OUTPUT PREVIEW",
	fileName: "gradient.png",
	downloadLabel: "Download PNG",
	layoutClass: "gradient-layout",
	previewClass: "gradient-preview",
	preview: "gradient",
	fields: [
		{
			id: "type",
			kind: "segmented",
			label: "GRADIENT TYPE",
			options: ["Linear", "Radial"],
			selected: 0,
		},
		{
			id: "stops",
			kind: "color-pair",
			label: "COLOR STOPS",
			from: "#1769D2",
			to: "#00A8C7",
		},
		{ id: "dir", kind: "direction", label: "DIRECTION", value: 135, min: 0, max: 360, suffix: "°", space: true },
		{ id: "op", kind: "slider", label: "OPACITY", value: 100, min: 0, max: 100, suffix: "%", space: true },
	],
};

const background: PreviewToolView = {
	title: "Remove background.",
	lede: "Select a background color and tune the edge detection. Changes are processed automatically in your browser.",
	panelLabel: "REMOVER SETTINGS",
	panelStrong: "Configure detection",
	stepType: "TOOL 02",
	toolbarLabel: "SOURCE / RESULT",
	fileName: "comparison.png",
	downloadLabel: "Download result",
	layoutClass: "remover-layout",
	previewClass: "remover-preview",
	preview: "comparison",
	fields: [
		{
			id: "color",
			kind: "color",
			label: "BACKGROUND COLOR",
			value: "#E8EEF2",
			native: true,
			reference: true,
		},
		{
			id: "sim",
			kind: "slider",
			label: "COLOR SIMILARITY",
			value: 72,
			min: 0,
			max: 100,
			suffix: "%",
			space: true,
			hints: ["strict edges", "more removal"],
		},
		{
			id: "outer",
			kind: "toggle",
			label: "OUTER COLOR ONLY",
			checked: true,
			note: "Only remove connected background pixels from the edges.",
		},
		{
			id: "mask",
			kind: "toggle",
			label: "SHOW MASK",
			checked: false,
			note: "Preview the detected transparency mask.",
		},
	],
};

export const PREVIEW_TOOL_VIEWS: Record<string, PreviewToolView> = {
	"linear-gradient-png": gradient,
	"remove-background-png": background,
};

export function getPreviewView(tool: ToolEntry): PreviewToolView | undefined {
	return PREVIEW_TOOL_VIEWS[tool.id];
}
