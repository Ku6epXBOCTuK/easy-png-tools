import type { CategoryId } from "../categories";

export const LOCALES = ["ru", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const BASE_LOCALE: Locale = "en";

export const LOCALE_TAGS: Record<Locale, string> = {
	ru: "ru-RU",
	en: "en-US",
};

export function isLocale(value: unknown): value is Locale {
	return (
		typeof value === "string" && (LOCALES as readonly string[]).includes(value)
	);
}

export type ToolStrings = {
	title?: string;
	description?: string;
	/** Подписи параметров по их id. */
	params?: Record<string, string>;
	/** Подписи опций select: paramId -> value -> label. */
	options?: Record<string, Record<string, string>>;
	/** Тексты-результаты текстовых инструментов (analyze): ключ -> строка. */
	results?: Record<string, string>;
};

export type HeaderStrings = {
	workspace: string;
	catalog: string;
	sectionsAria: string;
	footerNote: string;
};

export type Dict = {
	header: HeaderStrings;
	categories: Record<CategoryId, string>;
	home: Record<string, string>;
	catalog: Record<string, string>;
	toolPage: Record<string, string>;
	chain: Record<string, string>;
	sourceCard: Record<string, string>;
	resultCard: Record<string, string>;
	paramsCard: Record<string, string>;
	textInput: Record<string, string>;
	textResult: Record<string, string>;
	download: Record<string, string>;
	infoPanel: Record<string, string>;
	dropZone: Record<string, string>;
	search: Record<string, string>;
	ui: Record<string, string>;
	errors: Record<string, string>;
	tools: Record<string, ToolStrings>;
	/** Действия панели результата/генерации (Generate, Open image…). */
	actions?: Record<string, string>;
	/** Поля ввода текста нового UI (placeholder, Try sample…). */
	textSource?: Record<string, string>;
	/** Подписи полей по ключу (решение C: label-ключ на поле). */
	fields?: Record<string, string>;
	/** Заголовки групп полей по ключу (решение A). */
	groups?: Record<string, string>;
};
