import type { Dict } from "./dict";

export const en: Dict = {
	header: {
		workspace: "Workspace",
		catalog: "Catalog",
	},
	home: {
		hero: "Hello {name}!",
		restoreLast: "Restore {title}",
	},
	errors: {
		sourceRequired: "Source image required",
	},
	// Базовая локаль: тексты страниц берутся из EN-строк реестра.
	pages: {},
	tools: {
		addBorder: {
			results: {
				done: "Border {what}",
			},
		},
	},
};
