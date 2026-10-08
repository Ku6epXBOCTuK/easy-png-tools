import { CATEGORY_IDS } from "./categories";
import { PAGES, type Page } from "./registry";

export type PreviewGroup = {
	id: string;
	pages: Page[];
};

/**
 * Preview catalog: all pages grouped by category.
 */
export const PREVIEW_GROUPS: PreviewGroup[] = CATEGORY_IDS.map((category) => ({
	id: category,
	pages: PAGES.filter((page) => page.category === category),
})).filter((group) => group.pages.length > 0);

export const PREVIEW_TOTAL = PAGES.length;
