// Новая типизированная схема параметров (для нового UI, старый UI не трогаем).
//
// Параллельный источник правды к старому `ParamDef[]`: старый pipeline
// продолжает работать на `ParamDef[]` как сейчас, а новый строит UI/deфолты/
// валидацию поверх `ToolSchema<P>`.
//
// Связка типов на этапе компиляции (защита от рассинхрона):
//   - `field.x<T>()` возвращает `Field<T>` — phantom `__fieldT` связывает
//     runtime-спецификацию поля с ожидаемым типом значения (`number`|`string`|`boolean`).
//   - `toolSchema<P>(fields)` требует, чтобы ключи `fields` в точности совпадали
//     с полями `P`, а `Field<P[K]>` тип-проверялся на соответствие `P[K]`.
// Ошибки компилятора ловят расхождения между интерфейсом Params и схемой.

import type { Position9 } from "./core/textdraw";
import type { TextFont } from "./core/domText";

export interface NumberSpec {
	kind: "number";
	default: number;
	min?: number;
	max?: number;
	step?: number;
}

export interface SliderSpec {
	kind: "slider";
	default: number;
	min: number;
	max: number;
	step?: number;
}

export interface ColorSpec {
	kind: "color";
	default: string;
}

export interface SelectSpec<V extends string = string> {
	kind: "select";
	default: V;
	options: { value: V; label: string }[];
}

export interface TextSpec {
	kind: "text";
	default: string;
	placeholder?: string;
}

export interface CheckboxSpec {
	kind: "checkbox";
	default: boolean;
}

/** Составное поле «размеры»: width + height как один объект. */
export interface Dimension {
	width: number;
	height: number;
}

export interface DimensionSpec {
	kind: "dimension";
	/** Общий диапазон для обоих измерений. */
	min: number;
	max: number;
	width: number;
	height: number;
}

/** Пара цветов «от → к» (градиенты, сведение к двум цветам и т.п.). */
export interface ColorPair {
	from: string;
	to: string;
}

export interface ColorPairSpec {
	kind: "color-pair";
	from: string;
	to: string;
}

/** Смещение фигуры/объекта по центру: x + y в процентах. */
export interface Offset {
	x: number;
	y: number;
}

export interface OffsetSpec {
	kind: "offset";
	/** Общий диапазон для обеих осей (в процентах). */
	min: number;
	max: number;
	x: number;
	y: number;
}

/**
 * 9-позиционная сетка (3×3): top/middle/bottom × left/center/right.
 * Значение совпадает со строковым типом `Position9` из core/textdraw.
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

export interface Position9Spec {
	kind: "position9";
	default: Position9;
}

/**
 * Стиль текстовой надписи: шрифт, размер, жирность и цвет как один объект
 * (переиспользуется text-to-png, add-text, date-stamp).
 */
export interface FontStyle {
	font: TextFont;
	size: number;
	bold: boolean;
	color: string;
}

export interface FontStyleSpec {
	kind: "font-style";
	/** Диапазон размера шрифта. */
	min: number;
	max: number;
	size: number;
	font: TextFont;
	bold: boolean;
	color: string;
}

/**
 * Подложка-плашка под текстовой надписью: вкл/выкл, цвет и непрозрачность
 * как один объект (add-text, date-stamp).
 */
export interface Plate {
	enabled: boolean;
	color: string;
	opacity: number;
}

export interface PlateSpec {
	kind: "plate";
	enabled: boolean;
	color: string;
	opacity: number;
}

/**
 * Цветовой градиент: пара цветов + угол направления. 0° — слева направо,
 * 90° — сверху вниз (прирост по часовой в пиксельных осях, ось Y вниз).
 */
export interface Gradient {
	from: string;
	to: string;
	angle: number;
}

export interface GradientSpec {
	kind: "gradient";
	from: string;
	to: string;
	/** Направление градиента: 0..360°, угол в градусах. */
	angle: number;
}

/**
 * «Объект as const» kind → спека поля. Единственный источник правды для
 * перечня kinds: `FieldSpecKind` = ключи map, `FieldSpec` = значение по любому
 * ключу (тот же union). Добавляем новый составной тип — добавляем сюда, и
 * type-checker укажет, где его не хватает (record контролов, default/sanitize).
 */
export const fieldSpecs = {
	number: {} as NumberSpec,
	slider: {} as SliderSpec,
	color: {} as ColorSpec,
	select: {} as SelectSpec,
	text: {} as TextSpec,
	checkbox: {} as CheckboxSpec,
	dimension: {} as DimensionSpec,
	"color-pair": {} as ColorPairSpec,
	offset: {} as OffsetSpec,
	position9: {} as Position9Spec,
	"font-style": {} as FontStyleSpec,
	plate: {} as PlateSpec,
	gradient: {} as GradientSpec,
} as const;

export type FieldSpecKind = keyof typeof fieldSpecs;
export type FieldSpecOf<K extends FieldSpecKind> = (typeof fieldSpecs)[K];
export type FieldSpec = FieldSpecOf<FieldSpecKind>;

/** `Field<T>`: runtime-спека поля + phantom-тип ожидаемого значения (number|string|boolean). */
export interface Field<T> {
	spec: FieldSpec;
	/** Phantom, только для типобезопасности — не задаётся и не читается в рантайме. */
	__fieldT?: T;
}

export interface ToolSchemaMeta {
	/** Пер-инструмент раскладка полей (группировка/колонки). */
	layout?: { group?: string; cols?: number };
	/** Короткая подпись инструмента для нового UI (необязательно). */
	label?: string;
}

export interface ToolSchema<P> {
	fields: { [K in keyof P]: Field<P[K]> };
	layout?: { group?: string; cols?: number };
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
	text: (s: Omit<TextSpec, "kind">): Field<string> => ({
		spec: { kind: "text", ...s },
	}),
	checkbox: (s: Omit<CheckboxSpec, "kind">): Field<boolean> => ({
		spec: { kind: "checkbox", ...s },
	}),
	dimension: (s: {
		min: number;
		max: number;
		width: number;
		height: number;
	}): Field<Dimension> => ({
		spec: { kind: "dimension", ...s },
	}),
	colorPair: (s: { from: string; to: string }): Field<ColorPair> => ({
		spec: { kind: "color-pair", ...s },
	}),
	offset: (s: {
		min: number;
		max: number;
		x: number;
		y: number;
	}): Field<Offset> => ({
		spec: { kind: "offset", ...s },
	}),
	position9: (s: { default: Position9 }): Field<Position9> => ({
		spec: { kind: "position9", ...s },
	}),
	fontStyle: (s: {
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
		enabled: boolean;
		color: string;
		opacity: number;
	}): Field<Plate> => ({
		spec: { kind: "plate", ...s },
	}),
	gradient: (s: {
		from: string;
		to: string;
		angle: number;
	}): Field<Gradient> => ({
		spec: { kind: "gradient", ...s },
	}),
};

/**
 * Собирает `ToolSchema<P>` из объявленных полей.
 * Компилятор проверяет: ключи `fields` === полям `P`, типы полей совместимы с `P[K]`.
 */
export function toolSchema<P>(
	fields: { [K in keyof P]: Field<P[K]> },
	meta?: ToolSchemaMeta,
): ToolSchema<P> {
	return { fields, ...(meta ?? {}) };
}

function clamp(value: number, min?: number, max?: number): number {
	if (min !== undefined && value < min) return min;
	if (max !== undefined && value > max) return max;
	return value;
}

/** Дефолты из схемы — единый источник значений по умолчанию для нового UI. */
export function defaultSchemaParams<P>(
	schema: ToolSchema<P>,
): Record<keyof P, unknown> {
	const out = {} as Record<keyof P, unknown>;
	for (const key of Object.keys(schema.fields) as (keyof P)[]) {
		const spec = schema.fields[key].spec;
		if (spec.kind === "dimension") {
			out[key] = { width: spec.width, height: spec.height };
		} else if (spec.kind === "color-pair") {
			out[key] = { from: spec.from, to: spec.to };
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

/** Валидация/нормализация значений по схеме. Аналог старого `sanitizeParams`. */
export function sanitizeSchemaParams<P>(
	schema: ToolSchema<P>,
	values: Record<string, unknown>,
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
				out[key] = clamp(n, spec.min, spec.max);
				break;
			}
			case "select":
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
				const w =
					typeof r?.width === "number" && Number.isFinite(r.width)
						? r.width
						: spec.width;
				const h =
					typeof r?.height === "number" && Number.isFinite(r.height)
						? r.height
						: spec.height;
				out[key] = {
					width: clamp(w, spec.min, spec.max),
					height: clamp(h, spec.min, spec.max),
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
