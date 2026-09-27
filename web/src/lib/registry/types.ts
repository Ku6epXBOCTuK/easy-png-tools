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

/**
 * Тип результата: картинка (по умолчанию), большой текст, короткий вердикт
 * или набор файлов (1 → many, скачивается zip-архивом).
 */
export const RESULT_KINDS = {
	image: "image",
	text: "text",
	verdict: "verdict",
	files: "files",
} as const;
export type ResultKind = (typeof RESULT_KINDS)[keyof typeof RESULT_KINDS];

/** Единый вход инструмента. `source`/`text` присутствуют строго по `input`. */
export interface ToolContext<P> {
	params: P;
	source?: PixelImage;
	text?: string;
}

/** Один файл мультифайлового результата (1 → many). */
export interface ToolImageFile {
	name: string;
	image: PixelImage;
}

/** Результат-набор файлов; скачивается zip-архивом. */
export interface FileResult {
	files: ToolImageFile[];
}

/**
 * Вердикт с подстановками: `key` — ключ словаря (`tools[id].results[key]`),
 * `vars` — значения для интерполяции `{name}`. Локализация выполняется на
 * стороне UI; из run() (и тем более из worker) локализованные строки не
 * возвращаются.
 */
export interface VerdictResult {
	key: string;
	vars?: Record<string, string | number>;
}

export type ToolResult = PixelImage | string | FileResult | VerdictResult;

/**
 * Инструмент: уникальная реализация без адреса, текстов и категории — всё это
 * у страницы. `id` уникален, но обслуживает сколько угодно страниц, поэтому
 * одного инструмента на две страницы хватает, а страница из нескольких
 * инструментов — это уже цепочка. Схема обязательна (единый источник
 * дефолтов/валидации/UI). У каждого инструмента ровно один метод `run(ctx)`;
 * контракт входа декларируется через `input` (обязательное поле), а результат —
 * через `result`. Отдельных методов `generate`/`runFromText`/`toText`/
 * `textToText` нет.
 */
export type Tool<P = Record<string, unknown>> = {
	/** Внутреннее имя: ключ словаря инструмента, `toolId` worker-протокола, запись пайплайна. */
	id: string;
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
};

/** Шаг страницы: инструмент и зафиксированные под него значения параметров. */
export type PageStep = {
	id: string;
	params?: Record<string, unknown>;
};

/**
 * Страница: уникальный адрес, тексты и то, что на ней выполняется. `steps` —
 * упорядоченный список инструментов, потому что страница может быть готовой
 * цепочкой; исполняет их `SchemaToolView`, и на сегодня шаг ровно один.
 */
export type Page = {
	/** Адрес `/tools/<slug>`, имя скачиваемого файла и ключ иконки. */
	slug: string;
	/** EN-строка страницы; перевод лежит в словаре по slug. */
	title: string;
	/** EN-строка страницы; перевод лежит в словаре по slug. */
	description: string;
	category: CategoryId;
	steps: PageStep[];
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
