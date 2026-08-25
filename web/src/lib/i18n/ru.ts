import type { Dict } from './dict';

export const ru: Dict = {
	header: {
		workspace: 'Рабочая область',
		catalog: 'Каталог',
		sectionsAria: 'Разделы',
		footerNote:
			'Все операции выполняются локально в вашем браузере — файлы никуда не отправляются.'
	},
	categories: {
		convert: 'Конвертация',
		alpha: 'Прозрачность',
		color: 'Цвет',
		geometry: 'Геометрия',
		filters: 'Фильтры',
		analyze: 'Анализ',
		generate: 'Генерация'
	},
	home: {
		defaultTitle: 'easy-png-tools — PNG-утилиты прямо в браузере',
		heroTitle: 'Что делаем с изображением?',
		heroLead: 'Найдите инструмент — все операции выполняются локально в браузере.',
		restoreLast: '↩ Вернуть последний: {title}',
		changeTool: '← Сменить инструмент'
	},
	catalog: {
		pageTitle: 'Все инструменты — easy-png-tools',
		metaDescription:
			'Полный каталог PNG-утилит: конвертация, прозрачность, цвет, геометрия, анализ и генерация изображений.',
		heading: 'Каталог инструментов',
		lead: '{count} утилит для работы с PNG. Все операции выполняются локально в браузере.'
	},
	toolPage: {
		fallbackTitle: 'Инструмент',
		legendSource: 'Исходник',
		legendSummary: 'Сводка',
		legendResult: 'Результат',
		legendParams: 'Параметры',
		stepHeading: 'Шаг {n}',
		removeStepAria: 'Убрать шаг',
		stepError: 'Шаг {n} ({title}): {msg}'
	},
	chain: {
		stepLabel: 'Шаг {n}: {title}',
		inputLegend: 'Вход',
		resultLegend: 'Результат',
		paramsLegend: 'Параметры',
		busyTitle: 'Обработка…',
		busyHint: 'Выполняется шаг цепочки',
		removeStepAria: 'Убрать шаг'
	},
	sourceCard: {
		replaceImage: 'Заменить изображение'
	},
	resultCard: {
		emptyTitle: 'Результат появится здесь',
		emptyHint: 'Сначала загрузите исходное изображение слева',
		processingTitle: 'Обработка…',
		processingHint: 'Изображение обрабатывается, это займёт немного времени',
		recalc: 'Пересчёт…',
		nextTool: '⛓ Следующий инструмент',
		breakChain: '✂ Оборвать цепочку'
	},
	paramsCard: {
		noParams: 'У этого инструмента нет параметров — результат уже готов.'
	},
	textInput: {
		heading: 'Текст',
		placeholder: 'Вставьте данные сюда',
		aria: 'Текстовые данные',
		decode: 'Декодировать'
	},
	textResult: {
		outputAria: 'Текстовый результат',
		copied: 'Скопировано',
		copy: 'Копировать',
		downloadTxt: 'Скачать .txt'
	},
	download: {
		busy: 'Готовим файл…',
		file: 'Скачать .{ext}'
	},
	infoPanel: {
		dimensions: 'Размеры',
		alpha: 'Альфа-канал',
		alphaYes: 'есть — есть полупрозрачные пиксели',
		alphaNo: 'нет',
		colorCount: 'Уникальных цветов (RGBA)'
	},
	dropZone: {
		pickDefault: 'Перетащите изображение сюда или нажмите, чтобы выбрать файл',
		overlayDefault: 'Отпустите файл, чтобы заменить изображение'
	},
	search: {
		placeholder: 'Найдите инструмент…',
		aria: 'Поиск инструмента',
		nothingFound: 'Ничего не найдено — попробуйте другое слово.'
	},
	ui: {
		showMask: 'Показать маску',
		decrease: 'Уменьшить',
		increase: 'Увеличить',
		reset: 'Сбросить',
		pipette: 'Пипетка'
	},
	errors: {
		noImageRun: 'Этот инструмент не обрабатывает изображения',
		workerFailed: 'Ошибка исполнения в воркере',
		workerUnavailable: 'Воркер недоступен',
		notFound: 'Инструмент не найден'
	},
	tools: {}
};
