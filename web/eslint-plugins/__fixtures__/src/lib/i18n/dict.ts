export const LOCALES = ["en", "ru", "de"] as const;

export const BASE_LOCALE: "en" = "en";

export type Dict = {
	header: Record<string, string>;
	home: Record<string, string>;
	errors: Record<string, string>;
	tools: Record<string, ToolStrings>;
};

export type ToolStrings = {
	title?: string;
	description?: string;
	results?: Record<string, string>;
};
