import type { CategoryId } from './categories';
import {
	colorMask,
	extractAlphaMask,
	flattenOntoColor,
	invertAlpha,
	removeColorToAlpha,
	roundCorners,
	setAlphaChannel
} from './core/alpha';
import {
	brightnessContrast,
	changeHue,
	extractChannel,
	grayscale,
	invert,
	posterize,
	sepia,
	setOpacity,
	swapChannels,
	thresholdBlackWhite,
	twoColors,
	type ChannelSwapPair,
	type RgbChannel
} from './core/color';
import { centerByAlpha, crop, expandCanvas, flip, resize, rotate90, tile } from './core/geometry';
import { decodeTextImage, toBase64, toDataUrl, type OutputMime } from './core/io';
import { hexToPixels, pixelsToHex } from './core/text';
import { clonePixelImage, type PixelImage } from './core/types';

export type ParamDef =
	| {
			id: string;
			label: string;
			type: 'number';
			min?: number;
			max?: number;
			step?: number;
			default: number;
	  }
	| {
			id: string;
			label: string;
			type: 'slider';
			min: number;
			max: number;
			step?: number;
			default: number;
	  }
	| {
			id: string;
			label: string;
			type: 'select';
			options: { value: string; label: string }[];
			default: string;
	  }
	| { id: string; label: string; type: 'checkbox'; default: boolean }
	| { id: string; label: string; type: 'color'; default: string };

export type OutputFormat = {
	mime: OutputMime;
	ext: string;
	qualityParamId?: string;
};

export type SourceMode = 'file' | 'none' | 'text';

export type ToolEntry = {
	id: string;
	title: string;
	description: string;
	category: CategoryId;
	sourceMode?: SourceMode;
	params: ParamDef[];
	run?: (img: PixelImage, params: Record<string, unknown>) => Promise<PixelImage> | PixelImage;
	generate?: (params: Record<string, unknown>) => Promise<PixelImage> | PixelImage;
	toText?: (img: PixelImage, params: Record<string, unknown>) => Promise<string> | string;
	runFromText?: (text: string, params: Record<string, unknown>) => Promise<PixelImage> | PixelImage;
	preview?: (
		img: PixelImage,
		params: Record<string, unknown>
	) => Promise<PixelImage> | PixelImage;
	resultType?: 'image' | 'info' | 'text';
	output?: OutputFormat;
};

const PNG_OUTPUT: OutputFormat = { mime: 'image/png', ext: 'png' };

function num(params: Record<string, unknown>, id: string): number {
	const v = params[id];
	if (typeof v !== 'number' || !Number.isFinite(v)) {
		throw new Error(`Параметр "${id}" должен быть числом`);
	}
	return v;
}

function str(params: Record<string, unknown>, id: string): string {
	const v = params[id];
	if (typeof v !== 'string') {
		throw new Error(`Параметр "${id}" должен быть строкой`);
	}
	return v;
}

function decodeToPng(id: string, title: string, description: string): ToolEntry {
	return {
		id,
		title,
		description,
		category: 'convert',
		params: [],
		run: (img) => clonePixelImage(img)
	};
}

export const TOOLS: ToolEntry[] = [
	decodeToPng(
		'jpg-to-png',
		'Конвертировать JPG в PNG',
		'Открывает JPEG и сохраняет его как PNG без потерь. Прозрачность, если была, сохраняется.'
	),
	decodeToPng(
		'webp-to-png',
		'Конвертировать WebP в PNG',
		'Перекодирует WebP-изображение в универсальный PNG.'
	),
	decodeToPng(
		'gif-to-png',
		'Конвертировать GIF в PNG',
		'Dостаёт первый кадр GIF-анимации и сохраняет его как PNG.'
	),
	decodeToPng(
		'bmp-to-png',
		'Конвертировать BMP в PNG',
		'Перекодирует BMP в компактный PNG без потерь.'
	),
	decodeToPng(
		'ico-to-png',
		'Конвертировать ICO в PNG',
		'Превращает иконку .ico в обычный PNG нужного размера.'
	),
	{
		id: 'png-to-bmp',
		title: 'Конвертировать PNG в BMP',
		description:
			'Sохраняет изображение в 24-битный BMP без альфа-канала: прозрачность заменяется чёрным фоном.',
		category: 'convert',
		params: [],
		run: (img) => flattenOntoColor(img, '#000000'),
		output: { mime: 'image/bmp', ext: 'bmp' }
	},
	{
		id: 'png-to-base64',
		title: 'PNG в Base64',
		description: 'Кодирует изображение в base64-строку для вставки в код или стили.',
		category: 'convert',
		params: [],
		resultType: 'text',
		toText: (img) => toBase64(img)
	},
	{
		id: 'base64-to-png',
		title: 'Base64 в PNG',
		description:
			'Dекодирует base64-строку или data-uri обратно в картинку. Вставьте строку слева.',
		category: 'convert',
		sourceMode: 'text',
		params: [],
		run: (img) => clonePixelImage(img)
	},
	{
		id: 'png-to-data-uri',
		title: 'PNG в Data URI',
		description: 'Строит полный data-uri (data:image/png;base64,…) для встраивания в HTML/CSS.',
		category: 'convert',
		params: [],
		resultType: 'text',
		toText: (img) => toDataUrl(img)
	},
	{
		id: 'data-uri-to-png',
		title: 'Data URI в PNG',
		description: 'Dекодирует data:image/…;base64,… обратно в файл картинки.',
		category: 'convert',
		sourceMode: 'text',
		params: [],
		run: (img) => clonePixelImage(img)
	},
	{
		id: 'png-to-hex',
		title: 'PNG в HEX-пиксели',
		description:
			'Показывает все пиксели как hex-значения rrggbbaa — по строкам, через пробел.',
		category: 'convert',
		params: [],
		resultType: 'text',
		toText: (img) => pixelsToHex(img)
	},
	{
		id: 'hex-to-png',
		title: 'HEX-пиксели в PNG',
		description:
			'Sобирает картинку из hex-значений rrggbbaa (через пробел). Укажите ширину — высота рассчитается сама.',
		category: 'convert',
		sourceMode: 'text',
		params: [
			{ id: 'width', label: 'Ширина изображения', type: 'number', min: 1, max: 10000, step: 1, default: 1 }
		],
		runFromText: (text, p) => hexToPixels(text, Math.trunc(Number(p['width']))),
		run: (img) => clonePixelImage(img)
	},
	{
		id: 'resize-png',
		title: 'Изменить размер PNG',
		description:
			'Масштабирование изображения с билинейной интерполяцией. При сохранении пропорций одна сторона задаёт масштаб, а если указаны обе — изображение вписывается в эти размеры.',
		category: 'geometry',
		params: [
			{ id: 'width', label: 'Ширина (0 — авто)', type: 'number', min: 0, max: 20000, step: 1, default: 0 },
			{ id: 'height', label: 'Высота (0 — авто)', type: 'number', min: 0, max: 20000, step: 1, default: 0 },
			{ id: 'keepAspect', label: 'Сохранять пропорции', type: 'checkbox', default: true }
		],
		run: (img, p) => {
			const keepAspect = p['keepAspect'] === true;
			let w = Math.trunc(num(p, 'width'));
			let h = Math.trunc(num(p, 'height'));
			if (keepAspect) {
				if (w > 0 && h > 0) {
					const scale = Math.min(w / img.width, h / img.height);
					w = Math.max(1, Math.round(img.width * scale));
					h = Math.max(1, Math.round(img.height * scale));
				} else if (w > 0) {
					h = Math.max(1, Math.round((img.height / img.width) * w));
				} else if (h > 0) {
					w = Math.max(1, Math.round((img.width / img.height) * h));
				}
			}
			if (w <= 0 || h <= 0) {
				throw new Error('Укажите ширину и/или высоту нового размера');
			}
			return resize(img, w, h);
		}
	},
	{
		id: 'crop-png',
		title: 'Обрезать PNG',
		description:
			'Вырезает прямоугольную область. Координаты и размеры выходят за границы изображения — область усекается до пересечения с картинкой.',
		category: 'geometry',
		params: [
			{ id: 'x', label: 'X (слева)', type: 'number', min: -100000, max: 100000, step: 1, default: 0 },
			{ id: 'y', label: 'Y (сверху)', type: 'number', min: -100000, max: 100000, step: 1, default: 0 },
			{ id: 'width', label: 'Ширина области', type: 'number', min: -100000, max: 100000, step: 1, default: 0 },
			{ id: 'height', label: 'Высота области', type: 'number', min: -100000, max: 100000, step: 1, default: 0 }
		],
		run: (img, p) => {
			const w = Math.trunc(num(p, 'width'));
			const h = Math.trunc(num(p, 'height'));
			if (w <= 0 || h <= 0) {
				throw new Error('Укажите ширину и высоту области обрезки');
			}
			return crop(img, Math.trunc(num(p, 'x')), Math.trunc(num(p, 'y')), w, h);
		}
	},
	{
		id: 'rotate-png',
		title: 'Повернуть PNG',
		description: 'Поворот на 90°, 180° или 270° по часовой стрелке без потери качества.',
		category: 'geometry',
		params: [
			{
				id: 'angle',
				label: 'Угол поворота',
				type: 'select',
				default: '90',
				options: [
					{ value: '90', label: '90° по часовой' },
					{ value: '180', label: '180°' },
					{ value: '270', label: '270° по часовой' }
				]
			}
		],
		run: (img, p) => rotate90(img, Number(str(p, 'angle')) / 90)
	},
	{
		id: 'flip-png',
		title: 'Отразить PNG',
		description: 'Зеркальное отражение по горизонтали или вертикали без потери качества.',
		category: 'geometry',
		params: [
			{
				id: 'axis',
				label: 'Ось отражения',
				type: 'select',
				default: 'horizontal',
				options: [
					{ value: 'horizontal', label: 'По горизонтали (слева направо)' },
					{ value: 'vertical', label: 'По вертикали (сверху вниз)' }
				]
			}
		],
		run: (img, p) => flip(img, str(p, 'axis') === 'vertical' ? 'vertical' : 'horizontal')
	},
	{
		id: 'add-padding-png',
		title: 'Добавить поля PNG',
		description: 'Расширяет холст во все стороны на выбранное число пикселей.',
		category: 'geometry',
		params: [
			{ id: 'padding', label: 'Поля, px', type: 'number', min: 1, max: 2000, step: 1, default: 10 },
			{ id: 'transparent', label: 'Прозрачные поля', type: 'checkbox', default: true },
			{ id: 'color', label: 'Цвет полей', type: 'color', default: '#ffffff' }
		],
		run: (img, p) =>
			expandCanvas(
				img,
				num(p, 'padding'),
				num(p, 'padding'),
				num(p, 'padding'),
				num(p, 'padding'),
				p['transparent'] === true ? undefined : str(p, 'color')
			)
	},
	{
		id: 'add-border-png',
		title: 'Добавить рамку PNG',
		description: 'Рисует цветную рамку вокруг изображения выбранной толщины.',
		category: 'geometry',
		params: [
			{ id: 'thickness', label: 'Толщина рамки, px', type: 'number', min: 1, max: 500, step: 1, default: 5 },
			{ id: 'color', label: 'Цвет рамки', type: 'color', default: '#000000' }
		],
		run: (img, p) => expandCanvas(img, num(p, 'thickness'), num(p, 'thickness'), num(p, 'thickness'), num(p, 'thickness'), str(p, 'color'))
	},
	{
		id: 'fit-on-background-png',
		title: 'Вписать PNG на фон',
		description:
			'Помещает изображение по центру полотна заданного размера с прозрачным или цветным фоном.',
		category: 'geometry',
		params: [
			{ id: 'width', label: 'Ширина полотна', type: 'number', min: 1, max: 20000, step: 1, default: 800 },
			{ id: 'height', label: 'Высота полотна', type: 'number', min: 1, max: 20000, step: 1, default: 600 },
			{ id: 'transparent', label: 'Прозрачный фон', type: 'checkbox', default: false },
			{ id: 'color', label: 'Цвет фона', type: 'color', default: '#ffffff' }
		],
		run: (img, p) => {
			const width = Math.trunc(num(p, 'width'));
			const height = Math.trunc(num(p, 'height'));
			if (width <= 0 || height <= 0) {
				throw new Error('Укажите положительные размеры полотна');
			}
			const left = Math.max(0, Math.floor((width - img.width) / 2));
			const top = Math.max(0, Math.floor((height - img.height) / 2));
			return expandCanvas(
				img,
				left,
				top,
				Math.max(0, width - img.width - left),
				Math.max(0, height - img.height - top),
				p['transparent'] === true ? undefined : str(p, 'color')
			);
		}
	},
	{
		id: 'tile-png',
		title: 'Замостить PNG',
		description: 'Повторяет изображение сеткой из выбранного числа столбцов и строк.',
		category: 'geometry',
		params: [
			{ id: 'columns', label: 'Столбцов', type: 'number', min: 1, max: 50, step: 1, default: 2 },
			{ id: 'rows', label: 'Строк', type: 'number', min: 1, max: 50, step: 1, default: 2 }
		],
		run: (img, p) => tile(img, num(p, 'columns'), num(p, 'rows'))
	},
	{
		id: 'center-by-alpha-png',
		title: 'Центрировать PNG по содержимому',
		description:
			'Находит непрозрачную часть изображения и размещает её по центру прежнего холста.',
		category: 'geometry',
		params: [],
		run: (img) => centerByAlpha(img)
	},
	{
		id: 'grayscale-png',
		title: 'Чёрно-белый PNG',
		description: 'Переводит изображение в оттенки серого по яркостной формуле BT.601. Альфа сохраняется.',
		category: 'color',
		params: [],
		run: (img) => grayscale(img)
	},
	{
		id: 'invert-colors-png',
		title: 'Инвертировать цвета PNG',
		description: 'Обращает каждый цветовой канал (255 − значение). Альфа не меняется.',
		category: 'color',
		params: [],
		run: (img) => invert(img)
	},
	{
		id: 'adjust-brightness-contrast-png',
		title: 'Яркость и контраст PNG',
		description: 'Изменяет яркость и контраст в диапазоне от −100 до +100. Значение 0 — без изменений.',
		category: 'color',
		params: [
			{ id: 'brightness', label: 'Яркость', type: 'slider', min: -100, max: 100, step: 1, default: 0 },
			{ id: 'contrast', label: 'Контраст', type: 'slider', min: -100, max: 100, step: 1, default: 0 }
		],
		run: (img, p) => brightnessContrast(img, num(p, 'brightness'), num(p, 'contrast'))
	},
	{
		id: 'change-png-opacity',
		title: 'Изменить прозрачность PNG',
		description:
			'Умножает альфа-канал на процент: 0% — полностью прозрачный, 100% — без изменений.',
		category: 'color',
		params: [
			{ id: 'percent', label: 'Прозрачность, %', type: 'slider', min: 0, max: 100, step: 1, default: 100 }
		],
		run: (img, p) => setOpacity(img, num(p, 'percent'))
	},
	{
		id: 'sepia-png',
		title: 'Эффект сепии',
		description: 'Тонирует изображение в тёплые коричневые тона классической сепии.',
		category: 'color',
		params: [],
		run: (img) => sepia(img)
	},
	{
		id: 'change-png-hue',
		title: 'Сменить оттенок PNG',
		description: 'Сдвиг цветового тона по кругу. Насыщенность и яркость сохраняются.',
		category: 'color',
		params: [
			{ id: 'degrees', label: 'Сдвиг тона, °', type: 'slider', min: -180, max: 180, step: 1, default: 0 }
		],
		run: (img, p) => changeHue(img, num(p, 'degrees'))
	},
	{
		id: 'extract-channel-png',
		title: 'Извлечь канал PNG',
		description: 'Оставляет выбранный канал — красный, зелёный или синий — в оттенках серого.',
		category: 'color',
		params: [
			{
				id: 'channel',
				label: 'Канал',
				type: 'select',
				default: 'red',
				options: [
					{ value: 'red', label: 'Красный' },
					{ value: 'green', label: 'Зелёный' },
					{ value: 'blue', label: 'Синий' }
				]
			}
		],
		run: (img, p) => extractChannel(img, str(p, 'channel') as RgbChannel)
	},
	{
		id: 'swap-channels-png',
		title: 'Переставить каналы PNG',
		description: 'Меняет местами два цветовых канала — быстрый способ получить необычный окрас.',
		category: 'color',
		params: [
			{
				id: 'pair',
				label: 'Пара каналов',
				type: 'select',
				default: 'r-g',
				options: [
					{ value: 'r-g', label: 'Красный ↔ Зелёный' },
					{ value: 'r-b', label: 'Красный ↔ Синий' },
					{ value: 'g-b', label: 'Зелёный ↔ Синий' }
				]
			}
		],
		run: (img, p) => swapChannels(img, str(p, 'pair') as ChannelSwapPair)
	},
	{
		id: 'black-and-white-png',
		title: 'Чёрно-белый PNG по порогу',
		description: 'Жёсткая бинаризация по яркости: каждый пиксель становится чёрным или белым.',
		category: 'color',
		params: [
			{ id: 'threshold', label: 'Порог яркости, %', type: 'slider', min: 0, max: 100, step: 1, default: 50 }
		],
		run: (img, p) => thresholdBlackWhite(img, num(p, 'threshold'))
	},
	{
		id: 'posterize-png',
		title: 'Постеризация PNG',
		description: 'Уменьшает число уровней каждого канала — плакатный эффект.',
		category: 'color',
		params: [
			{ id: 'levels', label: 'Уровней на канал', type: 'slider', min: 2, max: 16, step: 1, default: 4 }
		],
		run: (img, p) => posterize(img, num(p, 'levels'))
	},
	{
		id: 'two-colors-png',
		title: 'Два цвета PNG',
		description: 'Перекрашивает изображение в два выбранных цвета по порогу яркости.',
		category: 'color',
		params: [
			{ id: 'lightColor', label: 'Цвет светлых участков', type: 'color', default: '#ffffff' },
			{ id: 'darkColor', label: 'Цвет тёмных участков', type: 'color', default: '#000000' },
			{ id: 'threshold', label: 'Порог яркости, %', type: 'slider', min: 0, max: 100, step: 1, default: 50 }
		],
		run: (img, p) => twoColors(img, str(p, 'lightColor'), str(p, 'darkColor'), num(p, 'threshold'))
	},
	{
		id: 'convert-png-to-jpg',
		title: 'Конвертировать PNG в JPG',
		description:
			'Прозрачность накладывается на выбранный цвет подложки (по умолчанию белый), результат сохраняется в JPEG.',
		category: 'convert',
		params: [
			{ id: 'background', label: 'Цвет подложки', type: 'color', default: '#ffffff' },
			{ id: 'quality', label: 'Качество JPEG', type: 'slider', min: 1, max: 100, step: 1, default: 90 }
		],
		output: { mime: 'image/jpeg', ext: 'jpg', qualityParamId: 'quality' },
		run: (img, p) => flattenOntoColor(img, str(p, 'background'))
	},
	{
		id: 'convert-png-to-webp',
		title: 'Конвертировать PNG в WebP',
		description: 'Перекодирует изображение в WebP с настраиваемым качеством. Прозрачность сохраняется.',
		category: 'convert',
		params: [{ id: 'quality', label: 'Качество WebP', type: 'slider', min: 1, max: 100, step: 1, default: 90 }],
		output: { mime: 'image/webp', ext: 'webp', qualityParamId: 'quality' },
		run: (img) => clonePixelImage(img)
	},
	{
		id: 'remove-alpha-channel-png',
		title: 'Убрать альфа-канал PNG',
		description: 'Накладывает изображение на белый фон и сохраняет без прозрачности.',
		category: 'alpha',
		params: [],
		run: (img) => flattenOntoColor(img, '#ffffff')
	},
	{
		id: 'set-alpha-channel-png',
		title: 'Задать альфа-канал PNG',
		description: 'Присваивает всем пикселям одинаковую прозрачность, цвета не меняются.',
		category: 'alpha',
		params: [
			{ id: 'percent', label: 'Прозрачность, %', type: 'slider', min: 0, max: 100, step: 1, default: 100 }
		],
		run: (img, p) => setAlphaChannel(img, num(p, 'percent'))
	},
	{
		id: 'extract-alpha-mask-png',
		title: 'Извлечь маску альфы PNG',
		description: 'Превращает прозрачность в чёрно-белую непрозрачную маску.',
		category: 'alpha',
		params: [],
		run: (img) => extractAlphaMask(img)
	},
	{
		id: 'round-corners-png',
		title: 'Скруглить углы PNG',
		description:
			'Обрезает углы по радиусу, заданному в процентах от половины меньшей стороны.',
		category: 'alpha',
		params: [
			{ id: 'radius', label: 'Радиус скругления, %', type: 'slider', min: 0, max: 50, step: 1, default: 10 }
		],
		run: (img, p) => roundCorners(img, num(p, 'radius'))
	},
	{
		id: 'invert-alpha-png',
		title: 'Инвертировать альфа-канал PNG',
		description: 'Непрозрачные области становятся прозрачными и наоборот.',
		category: 'alpha',
		params: [],
		run: (img) => invertAlpha(img)
	},
	{
		id: 'remove-color-from-png',
		title: 'Удалить цвет из PNG (прозрачность)',
		description:
			'Делает прозрачными все пиксели, близкие к выбранному цвету. Порог задаёт допустимое отклонение в процентах от максимального цветового расстояния.',
		category: 'alpha',
		params: [
			{ id: 'targetColor', label: 'Цвет для удаления', type: 'color', default: '#00ff00' },
			{ id: 'tolerance', label: 'Порог похожести, %', type: 'slider', min: 0, max: 100, step: 1, default: 10 }
		],
		run: (img, p) => removeColorToAlpha(img, str(p, 'targetColor'), num(p, 'tolerance')),
		preview: (img, p) => colorMask(img, str(p, 'targetColor'), num(p, 'tolerance'))
	},
	{
		id: 'png-info',
		title: 'Информация о PNG',
		description:
			'Показывает размеры, наличие альфа-канала и количество уникальных цветов загруженного изображения.',
		category: 'analyze',
		params: [],
		resultType: 'info',
		run: (img) => clonePixelImage(img)
	}
];

export function getTool(id: string): ToolEntry | undefined {
	return TOOLS.find((tool) => tool.id === id);
}

export function defaultParams(tool: ToolEntry): Record<string, unknown> {
	return Object.fromEntries(tool.params.map((p) => [p.id, p.default]));
}

export function sanitizeParams(
	tool: ToolEntry,
	values: Record<string, unknown>
): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	for (const param of tool.params) {
		const raw = values[param.id];
		switch (param.type) {
			case 'number':
			case 'slider': {
				const n =
					typeof raw === 'number' && Number.isFinite(raw) ? raw : param.default;
				out[param.id] = clampRange(n, param.min, param.max);
				break;
			}
			case 'select':
				out[param.id] =
					typeof raw === 'string' && param.options.some((o) => o.value === raw)
						? raw
						: param.default;
				break;
			case 'checkbox':
				out[param.id] = typeof raw === 'boolean' ? raw : param.default;
				break;
			case 'color':
				out[param.id] =
					typeof raw === 'string' && /^#[0-9a-f]{6}$/i.test(raw) ? raw : param.default;
				break;
		}
	}
	return out;
}

function clampRange(value: number, min?: number, max?: number): number {
	if (min !== undefined && value < min) return min;
	if (max !== undefined && value > max) return max;
	return value;
}

export function outputOf(tool: ToolEntry): OutputFormat | undefined {
	if (tool.resultType === 'info') return undefined;
	return tool.output ?? PNG_OUTPUT;
}
