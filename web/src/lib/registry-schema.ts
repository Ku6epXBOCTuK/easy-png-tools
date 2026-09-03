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

export type FieldSpec =
	NumberSpec | SliderSpec | ColorSpec | SelectSpec | TextSpec | CheckboxSpec;

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
		out[key] = schema.fields[key].spec.default;
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
		}
	}
	return out;
}
