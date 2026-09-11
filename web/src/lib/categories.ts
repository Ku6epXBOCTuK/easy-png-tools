/**
 * Категории инструментов для нового registry.
 *
 * Единая точка правды: тип `CategoryId` и порядок отображения в каталоге
 * выводятся из одного `as const`-объекта, чтобы не рассинхронизироваться.
 * Этот файл — локальная копия подхода для нового UI; старый
 * `lib/v1/categories` (массив + union вручную) не трогаем — он обслуживает
 * старый UI в `/v1/*`.
 *
 * Человекочитаемые названия живут в словарях i18n: секция categories,
 * ключ = CategoryId.
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

/** Порядок категорий в каталоге (как задано в `CATEGORIES`). */
export const CATEGORY_IDS = Object.keys(CATEGORIES) as CategoryId[];
