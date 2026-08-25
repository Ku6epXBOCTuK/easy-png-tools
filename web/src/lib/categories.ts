export type CategoryId =
	| 'convert'
	| 'alpha'
	| 'color'
	| 'geometry'
	| 'analyze'
	| 'generate'
	| 'filters'
	| 'text';

/**
 * Порядок категорий в каталоге. Человекочитаемые названия живут в словарях
 * i18n: секция categories, ключ = CategoryId.
 */
export const CATEGORIES: readonly CategoryId[] = [
	'convert',
	'alpha',
	'color',
	'geometry',
	'filters',
	'text',
	'analyze',
	'generate'
];
