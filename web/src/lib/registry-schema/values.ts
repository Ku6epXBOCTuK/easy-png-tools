import { clamp } from "../core/math";
import type { Position9 } from "../core/textdraw";
import { dimensionAxisMax, effectiveMax } from "./aspect";
import {
	POSITION9_VALUES,
	type Dimension,
	type DimensionSpec,
	type SchemaContext,
	type ToolSchema,
} from "./specs";

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
