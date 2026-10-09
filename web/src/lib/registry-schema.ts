// Typed parameter schema for the UI.
// Compile-time type binding (drift protection): `field.x<T>()` returns
// `Field<T>` whose phantom `__fieldT` ties the runtime spec to the expected
// value type; `toolSchema<P>(fields)` requires `fields` keys to match `P`
// exactly. Compiler errors catch Params/schema mismatches.

import type { TextFont } from "./core/domText";
import type { Position9 } from "./core/textdraw";
import { clamp } from "./core/math";

/**
 * Optional field of every spec: the field's label key in the dictionary.
 * Rendered via `fieldLabel` (decision C); without a key, `labelOf(id)` is used.
 */
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

/**
 * 9-position grid (3x3): top/middle/bottom x left/center/right.
 * Values match the `Position9` string type from core/textdraw.
 */
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

/**
 * Text caption style: font, size, bold, and color as one object
 * (reused by text-to-png, add-text, date-stamp).
 */
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

/**
 * Backing plate under a text caption: on/off, color, and opacity
 * as one object (add-text, date-stamp).
 */
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

/**
 * Color gradient: color pair + direction angle. 0 deg: left to right,
 * 90 deg: top to bottom (clockwise growth in pixel axes, Y axis down).
 */
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

/**
 * "as const" object: kind -> field spec. Single source of truth for the kind
 * list: `FieldSpecKind` = map keys, `FieldSpec` = union of values. A new kind
 * added here makes the type-checker flag where it is missing (default/sanitize).
 */
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

export interface ResolvedLayoutGroup {
	key: string;
	title?: string;
	cols: number;
	fields: string[];
}

export function resolveLayoutGroups<P>(
	schema: ToolSchema<P>,
): ResolvedLayoutGroup[] {
	const all = Object.keys(schema.fields);
	const groups = schema.layout?.groups ?? [];
	const used: Record<string, true> = {};
	const named: ResolvedLayoutGroup[] = groups
		.map((group, index) => {
			const fields = group.fields.filter((fieldId) => {
				if (used[fieldId] || !(fieldId in schema.fields)) return false;
				used[fieldId] = true;
				return true;
			});
			return {
				key: `${group.title ?? "group"}-${index}`,
				title: group.title,
				cols: Math.max(1, Math.trunc(group.cols ?? 1)),
				fields,
			} satisfies ResolvedLayoutGroup;
		})
		.filter((group) => group.fields.length > 0);
	const rest = all.filter((fieldId) => !used[fieldId]);
	if (rest.length > 0) {
		named.push({ key: "__default", cols: 1, fields: rest });
	}
	return named;
}

/** Field cap: from source dimensions under maxFromSource, else static. */
export function effectiveMax(
	spec: NumberSpec,
	source?: Dimension,
): number | undefined {
	if (spec.maxFromSource && source) {
		return source[spec.maxFromSource] - (spec.maxMinus ?? 0);
	}
	return spec.max;
}

function dimensionAxisMax(
	spec: DimensionSpec,
	axis: "width" | "height",
	source?: Dimension,
): number {
	return spec.maxFromSource && source ? source[axis] : spec.max;
}

/** Clamps maxFromSource fields to the current cap (source changed). */
export function clampSourceAwareMaxes<P>(
	schema: ToolSchema<P>,
	params: Record<string, unknown>,
	source?: Dimension,
): Record<string, unknown> {
	if (!source) return params;
	let changed = false;
	const out = { ...params };
	for (const key of Object.keys(schema.fields) as (keyof P)[]) {
		const spec = schema.fields[key].spec;
		if (spec.kind === "number" && spec.maxFromSource) {
			const v = out[key as string];
			if (typeof v !== "number" || !Number.isFinite(v)) continue;
			const clamped = clamp(
				v,
				spec.min ?? -Infinity,
				effectiveMax(spec, source) ?? Infinity,
			);
			if (clamped !== v) {
				out[key as string] = clamped;
				changed = true;
			}
		} else if (spec.kind === "dimension" && spec.maxFromSource) {
			const v = out[key as string] as Partial<Dimension> | undefined;
			if (typeof v?.width !== "number" || typeof v?.height !== "number") {
				continue;
			}
			const width = clamp(
				v.width,
				spec.min ?? -Infinity,
				dimensionAxisMax(spec, "width", source),
			);
			const height = clamp(
				v.height,
				spec.min ?? -Infinity,
				dimensionAxisMax(spec, "height", source),
			);
			if (width !== v.width || height !== v.height) {
				out[key as string] = { width, height };
				changed = true;
			}
		}
	}
	return changed ? out : params;
}

/**
 * Recompute under lockAspect: the leading axis (last user edit) is kept,
 * the other is fitted to the source aspect.
 */
export function withAspectLock(
	next: Dimension,
	leading: "width" | "height",
	aspect: number,
): Dimension {
	if (leading === "width") {
		return { ...next, height: Math.max(1, Math.round(next.width / aspect)) };
	}
	return { ...next, width: Math.max(1, Math.round(next.height * aspect)) };
}

function resolveDimensionDefaults(
	spec: DimensionSpec,
	context?: SchemaContext,
): Dimension {
	const source = spec.defaultFromSource ? context?.source : undefined;
	return {
		width: clamp(source?.width ?? spec.width, spec.min, spec.max),
		height: clamp(source?.height ?? spec.height, spec.min, spec.max),
	};
}

/** Defaults from the schema: the single source of default values for the UI. */
export function defaultSchemaParams<P>(
	schema: ToolSchema<P>,
	context?: SchemaContext,
): Record<keyof P, unknown> {
	const out = {} as Record<keyof P, unknown>;
	for (const key of Object.keys(schema.fields) as (keyof P)[]) {
		const spec = schema.fields[key].spec;
		if (spec.kind === "dimension") {
			out[key] = resolveDimensionDefaults(spec, context);
		} else if (spec.kind === "color-pair") {
			out[key] = { from: spec.from, to: spec.to };
		} else if (spec.kind === "colors") {
			out[key] = [...spec.default];
		} else if (spec.kind === "offset") {
			out[key] = { x: spec.x, y: spec.y };
		} else if (spec.kind === "font-style") {
			out[key] = {
				font: spec.font,
				size: spec.size,
				bold: spec.bold,
				color: spec.color,
			};
		} else if (spec.kind === "plate") {
			out[key] = {
				enabled: spec.enabled,
				color: spec.color,
				opacity: spec.opacity,
			};
		} else if (spec.kind === "gradient") {
			out[key] = {
				from: spec.from,
				to: spec.to,
				angle: spec.angle,
			};
		} else {
			out[key] = spec.default;
		}
	}
	return out;
}

/**
 * Recomputes defaults from a new source, preserving user values. Fields in
 * touched (edited manually) are not overwritten even with a source default;
 * otherwise loading a new file would wipe configured sizes.
 */
export function applySourceDefaults<P>(
	schema: ToolSchema<P>,
	values: Record<string, unknown>,
	context: SchemaContext,
	touched?: ReadonlySet<string>,
): Record<keyof P, unknown> {
	const defaults = defaultSchemaParams(schema, context);
	for (const key of Object.keys(schema.fields) as (keyof P)[]) {
		const spec = schema.fields[key].spec;
		const fromSource = spec.kind === "dimension" && spec.defaultFromSource;
		if (fromSource && !touched?.has(key as string)) continue;
		if (Object.prototype.hasOwnProperty.call(values, key)) {
			defaults[key] = values[key as string];
		}
	}
	return defaults;
}

/** Validation/normalization of values against the schema. Successor of `sanitizeParams`. */
export function sanitizeSchemaParams<P>(
	schema: ToolSchema<P>,
	values: Record<string, unknown>,
	context?: SchemaContext,
): Record<keyof P, unknown> {
	const out = {} as Record<keyof P, unknown>;
	for (const key of Object.keys(schema.fields) as (keyof P)[]) {
		const spec = schema.fields[key].spec;
		const raw = values[key as string];
		switch (spec.kind) {
			case "number":
			case "slider": {
				const n =
					typeof raw === "number" && Number.isFinite(raw) ? raw : spec.default;
				const max =
					spec.kind === "number"
						? effectiveMax(spec, context?.source)
						: spec.max;
				out[key] = clamp(n, spec.min ?? -Infinity, max ?? Infinity);
				break;
			}
			case "select":
			case "segmented":
				out[key] =
					typeof raw === "string" && spec.options.some((o) => o.value === raw)
						? raw
						: spec.default;
				break;
			case "checkbox":
				out[key] = typeof raw === "boolean" ? raw : spec.default;
				break;
			case "color":
				out[key] =
					typeof raw === "string" && /^#[0-9a-f]{6}$/i.test(raw)
						? raw
						: spec.default;
				break;
			case "text":
				out[key] = typeof raw === "string" ? raw : spec.default;
				break;
			case "dimension": {
				const r =
					typeof raw === "object" &&
					raw !== null &&
					"width" in raw &&
					"height" in raw
						? (raw as Record<string, unknown>)
						: undefined;
				const defaults = resolveDimensionDefaults(spec, context);
				const w =
					typeof r?.width === "number" && Number.isFinite(r.width)
						? r.width
						: defaults.width;
				const h =
					typeof r?.height === "number" && Number.isFinite(r.height)
						? r.height
						: defaults.height;
				const sourceSize =
					spec.defaultFromSource && context?.source && w === 0 && h === 0
						? defaults
						: { width: w, height: h };
				out[key] = {
					width: clamp(
						sourceSize.width,
						spec.min,
						dimensionAxisMax(spec, "width", context?.source),
					),
					height: clamp(
						sourceSize.height,
						spec.min,
						dimensionAxisMax(spec, "height", context?.source),
					),
				};
				break;
			}
			case "color-pair": {
				const r =
					typeof raw === "object" &&
					raw !== null &&
					"from" in raw &&
					"to" in raw
						? (raw as Record<string, unknown>)
						: undefined;
				const from =
					typeof r?.from === "string" && /^#[0-9a-f]{6}$/i.test(r.from)
						? r.from
						: spec.from;
				const to =
					typeof r?.to === "string" && /^#[0-9a-f]{6}$/i.test(r.to)
						? r.to
						: spec.to;
				out[key] = { from, to };
				break;
			}
			case "colors": {
				const r =
					Array.isArray(raw) &&
					raw.every((c) => typeof c === "string" && /^#[0-9a-f]{6}$/i.test(c))
						? (raw as string[])
						: undefined;
				out[key] = r && r.length > 0 ? [...r] : [...spec.default];
				break;
			}
			case "position9":
				out[key] =
					typeof raw === "string" &&
					(POSITION9_VALUES as readonly string[]).includes(raw)
						? (raw as Position9)
						: spec.default;
				break;
			case "font-style": {
				const r =
					typeof raw === "object" &&
					raw !== null &&
					"font" in raw &&
					"size" in raw &&
					"bold" in raw &&
					"color" in raw
						? (raw as Record<string, unknown>)
						: undefined;
				out[key] = {
					font:
						r?.font === "sans" || r?.font === "serif" || r?.font === "mono"
							? r.font
							: spec.font,
					size:
						typeof r?.size === "number" && Number.isFinite(r.size)
							? clamp(r.size, spec.min, spec.max)
							: spec.size,
					bold: typeof r?.bold === "boolean" ? r.bold : spec.bold,
					color:
						typeof r?.color === "string" && /^#[0-9a-f]{6}$/i.test(r.color)
							? r.color
							: spec.color,
				};
				break;
			}
			case "plate": {
				const r =
					typeof raw === "object" &&
					raw !== null &&
					"enabled" in raw &&
					"color" in raw &&
					"opacity" in raw
						? (raw as Record<string, unknown>)
						: undefined;
				out[key] = {
					enabled: typeof r?.enabled === "boolean" ? r.enabled : spec.enabled,
					color:
						typeof r?.color === "string" && /^#[0-9a-f]{6}$/i.test(r.color)
							? r.color
							: spec.color,
					opacity:
						typeof r?.opacity === "number" && Number.isFinite(r.opacity)
							? clamp(r.opacity, 0, 100)
							: spec.opacity,
				};
				break;
			}
			case "offset": {
				const r =
					typeof raw === "object" && raw !== null && "x" in raw && "y" in raw
						? (raw as Record<string, unknown>)
						: undefined;
				const x =
					typeof r?.x === "number" && Number.isFinite(r.x) ? r.x : spec.x;
				const y =
					typeof r?.y === "number" && Number.isFinite(r.y) ? r.y : spec.y;
				out[key] = {
					x: clamp(x, spec.min, spec.max),
					y: clamp(y, spec.min, spec.max),
				};
				break;
			}
			case "gradient": {
				const r =
					typeof raw === "object" &&
					raw !== null &&
					"from" in raw &&
					"to" in raw &&
					"angle" in raw
						? (raw as Record<string, unknown>)
						: undefined;
				out[key] = {
					from:
						typeof r?.from === "string" && /^#[0-9a-f]{6}$/i.test(r.from)
							? r.from
							: spec.from,
					to:
						typeof r?.to === "string" && /^#[0-9a-f]{6}$/i.test(r.to)
							? r.to
							: spec.to,
					angle:
						typeof r?.angle === "number" && Number.isFinite(r.angle)
							? clamp(r.angle, 0, 360)
							: spec.angle,
				};
				break;
			}
		}
	}
	return out;
}
