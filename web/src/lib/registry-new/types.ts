import type { CategoryId } from "../preview/categories";
import type { ToolSchema } from "../registry-schema";
import type { PixelImage } from "../core/types";
import type { OutputMime } from "../core/io";

/** Формат скачивания, отличный от PNG (bmp/jpeg/webp). */
export interface OutputFormat {
	mime: OutputMime;
	ext: string;
	qualityParamId?: string;
}

/**
 * Инструмент нового registry: полностью типизирован на `Params`, схема —
 * обязательна (единый источник дефолтов/валидации/UI). Старого `ParamDef[]`
 * нет — это отдельная система от старого UI.
 */
export type ToolEntry<P = Record<string, unknown>> = {
	id: string;
	title: string;
	description: string;
	category: CategoryId;
	schema: ToolSchema<P>;
	/** Требует DOM (canvas/document); превью-executor запускает напрямую, не в worker. */
	domOnly?: boolean;
	/** Чем управляется инструмент: файлом (по умолчанию), текстом или ничем (генератор). */
	input?: "file" | "text" | "none";
	/** Тип результата: картинка (по умолчанию), большой текст или короткий вердикт. */
	result?: "image" | "text" | "verdict";
	/** Применение к входному изображению. Для чистых генераторов отсутствует. */
	run?(img: PixelImage, params: P): Promise<PixelImage> | PixelImage;
	generate?(params: P): Promise<PixelImage> | PixelImage;
	toText?(img: PixelImage, params: P): Promise<string> | string;
	runFromText?(text: string, params: P): Promise<PixelImage> | PixelImage;
	textToText?(text: string): Promise<string> | string;
	preview?(img: PixelImage, params: P): Promise<PixelImage> | PixelImage;
	/** Формат/качество скачивания результата; по умолчанию — PNG. */
	output?: OutputFormat;
	icon?: string;
};
