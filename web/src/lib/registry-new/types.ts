import type { CategoryId } from "../preview/categories";
import type { ToolSchema } from "../registry-schema";
import type { PixelImage } from "../core/types";

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
	/** Применение к входному изображению. Для чистых генераторов отсутствует. */
	run?(img: PixelImage, params: P): Promise<PixelImage> | PixelImage;
	generate?(params: P): Promise<PixelImage> | PixelImage;
	toText?(img: PixelImage, params: P): Promise<string> | string;
	runFromText?(text: string, params: P): Promise<PixelImage> | PixelImage;
	textToText?(text: string): Promise<string> | string;
	preview?(img: PixelImage, params: P): Promise<PixelImage> | PixelImage;
	icon?: string;
};
