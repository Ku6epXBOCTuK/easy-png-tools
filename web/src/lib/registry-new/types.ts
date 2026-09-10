import type { CategoryId } from "../categories";
import { ToolError } from "../core/errors";
import type { OutputMime } from "../core/io";
import type { PixelImage } from "../core/types";
import type { ToolSchema } from "../registry-schema";

/** Формат скачивания, отличный от PNG (bmp/jpeg/webp). */
export interface OutputFormat {
	mime: OutputMime;
	ext: string;
	qualityParamId?: string;
}

/** Чем управляется инструмент. `image` — требуется входное изображение. */
export const INPUT_MODES = {
	image: "image",
	text: "text",
	none: "none",
} as const;
export type InputMode = (typeof INPUT_MODES)[keyof typeof INPUT_MODES];

/** Тип результата: картинка (по умолчанию), большой текст или короткий вердикт. */
export const RESULT_KINDS = {
	image: "image",
	text: "text",
	verdict: "verdict",
} as const;
export type ResultKind = (typeof RESULT_KINDS)[keyof typeof RESULT_KINDS];

/** Единый вход инструмента. `source`/`text` присутствуют строго по `input`. */
export interface ToolContext<P> {
	params: P;
	source?: PixelImage;
	text?: string;
}

export type ToolResult = PixelImage | string;

/**
 * Инструмент нового registry: полностью типизирован на `Params`, схема —
 * обязательна (единый источник дефолтов/валидации/UI). У каждого инструмента
 * ровно один метод `run(ctx)`; контракт входа декларируется через `input`
 * (обязательное поле), а результат — через `result`. Отдельных методов
 * `generate`/`runFromText`/`toText`/`textToText` нет.
 */
export type ToolEntry<P = Record<string, unknown>> = {
	id: string;
	title: string;
	description: string;
	category: CategoryId;
	schema: ToolSchema<P>;
	/** Чем управляется инструмент: входным изображением, текстом или ничем. */
	input: InputMode;
	/** Тип результата: картинка (по умолчанию), большой текст или короткий вердикт. */
	result?: ResultKind;
	/** Единственный метод исполнения — и для генераторов, и для трансформаторов. */
	run(ctx: ToolContext<P>): Promise<ToolResult> | ToolResult;
	/** Требует DOM (canvas/document); превью-executor запускает напрямую, не в worker. */
	domOnly?: boolean;
	/** Формат/качество скачивания результата; по умолчанию — PNG. */
	output?: OutputFormat;
	icon?: string;
};

/** Гарантирует наличие входного изображения для трансформаторов. */
export function requireSource<P>(ctx: ToolContext<P>): PixelImage {
	if (!ctx.source) {
		throw new ToolError("errors.sourceRequired");
	}
	return ctx.source;
}

/** Гарантирует наличие текстового входа для text-инструментов. */
export function requireText<P>(ctx: ToolContext<P>): string {
	if (!ctx.text?.trim()) {
		throw new ToolError("errors.textRequired");
	}
	return ctx.text;
}

/**
 * Обёртка для image-to-image инструментов: подставляет `src` и `params`
 * из контекста. Позволяет оставить тело инструмента в виде `(img, p) => …`.
 */
export function imgTool<P>(
	fn: (img: PixelImage, params: P) => ToolResult | Promise<ToolResult>,
): (ctx: ToolContext<P>) => ToolResult | Promise<ToolResult> {
	return (ctx) => fn(requireSource(ctx), ctx.params);
}

/** Обёртка для генераторов: инструменту нужны только параметры. */
export function genTool<P>(
	fn: (params: P) => ToolResult | Promise<ToolResult>,
): (ctx: ToolContext<P>) => ToolResult | Promise<ToolResult> {
	return (ctx) => fn(ctx.params);
}

/** Обёртка для text-to-image инструментов: подставляет `text` и `params`. */
export function textGen<P>(
	fn: (text: string, params: P) => ToolResult | Promise<ToolResult>,
): (ctx: ToolContext<P>) => ToolResult | Promise<ToolResult> {
	return (ctx) => fn(requireText(ctx), ctx.params);
}
