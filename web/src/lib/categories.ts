export type CategoryId = 'convert' | 'alpha' | 'color' | 'geometry' | 'analyze' | 'generate';

export type Category = { id: CategoryId; label: string };

export const CATEGORIES: Category[] = [
	{ id: 'convert', label: 'Конвертация' },
	{ id: 'alpha', label: 'Прозрачность' },
	{ id: 'color', label: 'Цвет' },
	{ id: 'geometry', label: 'Геометрия' },
	{ id: 'analyze', label: 'Анализ' },
	{ id: 'generate', label: 'Генерация' }
];
