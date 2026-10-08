/**
 * Tool categories: `CategoryId` type and catalog display order derive from
 * one `as const` object to avoid drift. Human-readable names live in the
 * i18n dictionaries, section categories, key = CategoryId.
 */
export const CATEGORIES = {
	convert: "convert",
	alpha: "alpha",
	color: "color",
	geometry: "geometry",
	filters: "filters",
	text: "text",
	analyze: "analyze",
	generate: "generate",
} as const;

export type CategoryId = (typeof CATEGORIES)[keyof typeof CATEGORIES];

/** Category order in the catalog (as defined in `CATEGORIES`). */
export const CATEGORY_IDS = Object.keys(CATEGORIES) as CategoryId[];
