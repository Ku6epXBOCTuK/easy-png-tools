// Typed parameter schema for the UI. Compile-time type binding (drift
// protection): the phantom `Field.__fieldT` ties the runtime spec to the
// expected value type, so the compiler catches Params/schema mismatches.

import type { TextFont } from "../core/domText";
import type { Position9 } from "../core/textdraw";

/** Optional field of every spec: label key in the dictionary (see `fieldLabel`). */
export interface FieldSpecBase {
	label?: string;
	/** Field visible only when another field equals a value (tool modes). */
	visibleWhen?: { field: string; equals: string };
}

export interface NumberSpec extends FieldSpecBase {
	kind: "number";
	default: number;
	min?: number;
	max?: number;
	step?: number;
	/** Cap from source dimensions (axis); static max is the fallback. */
	maxFromSource?: "width" | "height";
	maxMinus?: number;
}

export interface SliderSpec extends FieldSpecBase {
	kind: "slider";
	default: number;
	min: number;
	max: number;
	step?: number;
}

export interface ColorSpec extends FieldSpecBase {
	kind: "color";
	default: string;
}

export interface SelectSpec<V extends string = string> extends FieldSpecBase {
	kind: "select";
	default: V;
	options: { value: V; label: string }[];
}

/** Same as select but rendered as segment buttons (1-click choice). */
export interface SegmentedSpec<
	V extends string = string,
> extends FieldSpecBase {
	kind: "segmented";
	default: V;
	options: { value: V; label: string }[];
}

export interface TextSpec extends FieldSpecBase {
	kind: "text";
	default: string;
	placeholder?: string;
}

export interface CheckboxSpec extends FieldSpecBase {
	kind: "checkbox";
	default: boolean;
}

/** Composite "dimensions" field: width + height as one object. */
export interface Dimension {
	width: number;
	height: number;
}

/** Single list of tile presets (squares) for dimension fields. */
export const SIZE_PRESETS = [16, 32, 64, 128, 256, 512] as const;

export interface DimensionSpec extends FieldSpecBase {
	kind: "dimension";
	/** Shared range for both dimensions. */
	min: number;
	max: number;
	width: number;
	height: number;
	defaultFromSource?: boolean;
	/** Per-axis cap from the matching source dimension. */
	maxFromSource?: boolean;
	/** Id of the "keep aspect ratio" checkbox field. */
	lockAspectWith?: string;
	/** Show quick-pick chips from SIZE_PRESETS. */
	presets?: boolean;
}

export interface SchemaContext {
	source?: Dimension;
}

/** Color pair "from -> to" (gradients, two-color mapping, etc.). */
export interface ColorPair {
	from: string;
	to: string;
}

export interface ColorPairSpec extends FieldSpecBase {
	kind: "color-pair";
	from: string;
	to: string;
}

/** Color list (palette): array of hex strings. */
export type ColorList = string[];

export interface ColorListSpec extends FieldSpecBase {
	kind: "colors";
	default: string[];
}

/** Shape/object offset from center: x + y in percent. */
export interface Offset {
	x: number;
	y: number;
}

export interface OffsetSpec extends FieldSpecBase {
	kind: "offset";
	/** Shared range for both axes (in percent). */
	min: number;
	max: number;
	x: number;
	y: number;
}

/** 9-position grid (3x3); values match `Position9` from core/textdraw. */
export const POSITION9_VALUES = [
	"top-left",
	"top-center",
	"top-right",
	"middle-left",
	"center",
	"middle-right",
	"bottom-left",
	"bottom-center",
	"bottom-right",
] as const;

export interface Position9Spec extends FieldSpecBase {
	kind: "position9";
	default: Position9;
}

/** Text caption style: font, size, bold, and color as one object. */
export interface FontStyle {
	font: TextFont;
	size: number;
	bold: boolean;
	color: string;
}

export interface FontStyleSpec extends FieldSpecBase {
	kind: "font-style";
	/** Font size range. */
	min: number;
	max: number;
	size: number;
	font: TextFont;
	bold: boolean;
	color: string;
}

/** Backing plate under a text caption: on/off, color, and opacity. */
export interface Plate {
	enabled: boolean;
	color: string;
	opacity: number;
}

export interface PlateSpec extends FieldSpecBase {
	kind: "plate";
	enabled: boolean;
	color: string;
	opacity: number;
}

/** Color gradient: pair + angle in degrees (0: left-to-right, 90: top-to-bottom). */
export interface Gradient {
	from: string;
	to: string;
	angle: number;
}

export interface GradientSpec extends FieldSpecBase {
	kind: "gradient";
	from: string;
	to: string;
	/** Gradient direction: 0..360, angle in degrees. */
	angle: number;
}

/** kind -> field spec map: single source of `FieldSpecKind`/`FieldSpec`. */
export const fieldSpecs = {
	number: {} as NumberSpec,
	slider: {} as SliderSpec,
	color: {} as ColorSpec,
	select: {} as SelectSpec,
	segmented: {} as SegmentedSpec,
	text: {} as TextSpec,
	checkbox: {} as CheckboxSpec,
	dimension: {} as DimensionSpec,
	"color-pair": {} as ColorPairSpec,
	colors: {} as ColorListSpec,
	offset: {} as OffsetSpec,
	position9: {} as Position9Spec,
	"font-style": {} as FontStyleSpec,
	plate: {} as PlateSpec,
	gradient: {} as GradientSpec,
} as const;

export type FieldSpecKind = keyof typeof fieldSpecs;
export type FieldSpecOf<K extends FieldSpecKind> = (typeof fieldSpecs)[K];
export type FieldSpec = FieldSpecOf<FieldSpecKind>;

/** `Field<T>`: runtime field spec + phantom type of the expected value (number|string|boolean). */
export interface Field<T> {
	spec: FieldSpec;
	/** Phantom, for type safety only; never set or read at runtime. */
	__fieldT?: T;
}

export interface ToolLayoutGroup {
	/** Group title (an empty group is not rendered). */
	title?: string;
	/** Grid column count inside the group (default 1). */
	cols?: number;
	/** Schema field names belonging to the group. */
	fields: string[];
}

export interface ToolSchemaLayout {
	/** Widget field groups. Unmentioned fields go to a trailing default group. */
	groups: ToolLayoutGroup[];
}

export interface ToolSchemaMeta {
	/** Per-tool field layout (grouping/columns). */
	layout?: ToolSchemaLayout;
	/** Short tool label for the UI (optional). */
	label?: string;
}

export interface ToolSchema<P> {
	fields: { [K in keyof P]: Field<P[K]> };
	layout?: ToolSchemaLayout;
	label?: string;
}
