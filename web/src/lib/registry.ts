import type { CategoryId } from './categories';
import { colorMask, flattenOntoColor, removeColorToAlpha } from './core/alpha';
import { brightnessContrast, grayscale, invert } from './core/color';
import { crop, flip, resize, rotate90 } from './core/geometry';
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
