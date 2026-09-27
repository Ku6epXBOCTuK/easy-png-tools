export const LOCALES = ["en", "ru", "de"] as const;

export const BASE_LOCALE: "en" = "en";

export type Dict = {
	header: Record<string, string>;
	home: Record<string, string>;
	errors: Record<string, string>;
	pages?: Record<string, PageStrings>;
	tools: Record<string, ToolStrings>;
};

export type PageStrings = {
	title?: string;
	description?: string;
};

export type ToolStrings = {
	results?: Record<string, string>;
};
