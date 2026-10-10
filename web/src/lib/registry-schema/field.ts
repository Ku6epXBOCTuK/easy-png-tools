import type { TextFont } from "../core/domText";
import type { Position9 } from "../core/textdraw";
import type {
	CheckboxSpec,
	ColorList,
	ColorPair,
	ColorSpec,
	Dimension,
	Field,
	FontStyle,
	Gradient,
	NumberSpec,
	Offset,
	Plate,
	SegmentedSpec,
	SelectSpec,
	SliderSpec,
	TextSpec,
	ToolSchema,
	ToolSchemaMeta,
} from "./specs";

export const field = {
	number: (s: Omit<NumberSpec, "kind">): Field<number> => ({
		spec: { kind: "number", ...s },
	}),
	slider: (s: Omit<SliderSpec, "kind">): Field<number> => ({
		spec: { kind: "slider", ...s },
	}),
	color: (s: Omit<ColorSpec, "kind">): Field<string> => ({
		spec: { kind: "color", ...s },
	}),
	select: <V extends string>(s: Omit<SelectSpec<V>, "kind">): Field<V> => ({
		spec: { kind: "select", ...s },
	}),
	segmented: <V extends string>(
		s: Omit<SegmentedSpec<V>, "kind">,
	): Field<V> => ({
		spec: { kind: "segmented", ...s },
	}),
	text: (s: Omit<TextSpec, "kind">): Field<string> => ({
		spec: { kind: "text", ...s },
	}),
	checkbox: (s: Omit<CheckboxSpec, "kind">): Field<boolean> => ({
		spec: { kind: "checkbox", ...s },
	}),
	dimension: (s: {
		label?: string;
		min: number;
		max: number;
		width: number;
		height: number;
		defaultFromSource?: boolean;
		maxFromSource?: boolean;
		lockAspectWith?: string;
		presets?: boolean;
		visibleWhen?: { field: string; equals: string };
	}): Field<Dimension> => ({
		spec: { kind: "dimension", ...s },
	}),
	colorPair: (s: {
		label?: string;
		from: string;
		to: string;
	}): Field<ColorPair> => ({
		spec: { kind: "color-pair", ...s },
	}),
	colors: (s: { label?: string; default: string[] }): Field<ColorList> => ({
		spec: { kind: "colors", ...s },
	}),
	offset: (s: {
		label?: string;
		min: number;
		max: number;
		x: number;
		y: number;
	}): Field<Offset> => ({
		spec: { kind: "offset", ...s },
	}),
	position9: (s: { label?: string; default: Position9 }): Field<Position9> => ({
		spec: { kind: "position9", ...s },
	}),
	fontStyle: (s: {
		label?: string;
		min: number;
		max: number;
		size: number;
		font: TextFont;
		bold: boolean;
		color: string;
	}): Field<FontStyle> => ({
		spec: { kind: "font-style", ...s },
	}),
	plate: (s: {
		label?: string;
		enabled: boolean;
		color: string;
		opacity: number;
	}): Field<Plate> => ({
		spec: { kind: "plate", ...s },
	}),
	gradient: (s: {
		label?: string;
		from: string;
		to: string;
		angle: number;
	}): Field<Gradient> => ({
		spec: { kind: "gradient", ...s },
	}),
};

/**
 * Builds a `ToolSchema<P>` from declared fields.
 * The compiler checks: `fields` keys === keys of `P`, field types match `P[K]`.
 */
export function toolSchema<P>(
	fields: { [K in keyof P]: Field<P[K]> },
	meta?: ToolSchemaMeta,
): ToolSchema<P> {
	return { fields, ...(meta ?? {}) };
}
