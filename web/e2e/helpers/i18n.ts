import { ru } from "../../src/lib/i18n/ru";

/** RU page title from the dictionary; RU text is never hardcoded in specs. */
export function ruPageTitle(slug: string): string {
	const title = ru.pages?.[slug]?.title;
	if (!title) throw new Error(`ru dictionary has no pages.${slug}.title`);
	return title;
}
