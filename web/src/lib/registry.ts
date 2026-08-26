import type { CategoryId } from './categories';
import { ToolError } from './core/errors';
import {
	colorMask,
	extractAlphaMask,
	flattenOntoColor,
	hardenAlpha,
	invertAlpha,
	removeColorToAlpha,
	roundCorners,
	setAlphaChannel
} from './core/alpha';
import {
	hasTransparency,
	isGrayscale,
	orientationOf
} from './core/analyze';
import {
	backgroundMaskPreview,
	removeBackground
} from './core/background';
import {
	closingImage,
	contourImage,
	dilateImage,
	erodeImage,
	openingImage,
	strokeImage
} from './core/morphology';
import { gaussianBlur, sharpen as sharpenImage } from './core/convolution';
import { gradientImage, noiseImage, solidImage } from './core/generate';
import { rotateFreeImage, skewImage, transformImage, zoomImage } from './core/affine';
import { vignette } from './core/effects';
import {
	autoContrast,
	brightnessContrast,
	changeHue,
	extractChannel,
	gammaCorrection,
	grayscale,
	invert,
	posterize,
	sepia,
	setOpacity,
	swapChannels,
	temperature,
	tint,
	thresholdBlackWhite,
	twoColors,
	type ChannelSwapPair,
	type RgbChannel
} from './core/color';
import { centerByAlpha, crop, expandCanvas, flip, resize, rotate90, tile } from './core/geometry';
import { decodeSvgText, decodeTextImage, jpegRoundtrip, toBase64, toDataUrl, type OutputMime } from './core/io';
import {
	drawImageWatermark,
	drawTextBlock,
	drawTextTile,
	type TextFont
} from './core/domText';
import { getOverlay } from './tools/overlay-store.svelte';
import { formatStamp } from './core/datefmt';
import type { Position9 } from './core/textdraw';
import {
	analogousSet,
	complementarySet,
	monochromaticSet,
	parseHexList,
	renderBlend,
	renderSwatches,
	renderWheel,
	shadeSet,
	sortPalette,
	stepColors,
	mixColors,
	tetradicSet,
	triadicSet,
	type SortKey
} from './core/palette';
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
	| { id: string; label: string; type: 'color'; default: string }
	| { id: string; label: string; type: 'text'; default: string; placeholder?: string };

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
	popularity?: number;
	icon?: string;
	resultType?: 'image' | 'info' | 'text';
	output?: OutputFormat;
	/** Инструменту нужен DOM (canvas): исполняется только напрямую, без воркера. */
	domOnly?: boolean;
	/** Инструменту нужна вторая картинка-источник (знак), загружаемая на странице. */
	needsOverlaySource?: boolean;
};

export const PNG_OUTPUT: OutputFormat = { mime: 'image/png', ext: 'png' };

export function isChainable(tool: ToolEntry): boolean {
	return (tool.resultType ?? 'image') === 'image' && (!tool.sourceMode || tool.sourceMode === 'file');
}

function num(params: Record<string, unknown>, id: string): number {
	const v = params[id];
	if (typeof v !== 'number' || !Number.isFinite(v)) {
		throw new ToolError('errors.paramNumber', { id });
	}
	return v;
}

function str(params: Record<string, unknown>, id: string): string {
	const v = params[id];
	if (typeof v !== 'string') {
		throw new ToolError('errors.paramString', { id });
	}
	return v;
}

function bool(params: Record<string, unknown>, id: string): boolean {
	const v = params[id];
	if (typeof v !== 'boolean') {
		throw new ToolError('errors.paramBool', { id });
	}
	return v;
}

function paletteParams(baseDefault: string) {
	return [
		{ id: 'baseColor', label: 'Base color', type: 'color' as const, default: baseDefault },
		{
			id: 'width',
			label: 'Width',
			type: 'slider' as const,
			min: 128,
			max: 1024,
			step: 16,
			default: 512
		},
		{
			id: 'layout',
			label: 'Layout',
			type: 'select' as const,
			default: 'grid',
			options: [
				{ value: 'grid', label: 'Grid' },
				{ value: 'strip', label: 'Strip' }
			]
		}
	];
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

function hexToRgba(hex: string, alpha = 255): [number, number, number, number] {
	const match = /^#([0-9a-f]{6})$/i.exec(hex.trim());
	if (!match) {
		throw new ToolError('errors.badHex', { value: hex });
	}
	const d = match[1];
	return [
		parseInt(d.slice(0, 2), 16),
		parseInt(d.slice(2, 4), 16),
		parseInt(d.slice(4, 6), 16),
		alpha
	];
}

export const TOOLS: ToolEntry[] = [
	decodeToPng(
		'jpg-to-png',
		'Convert JPG to PNG',
		'Opens a JPEG and saves it as lossless PNG. Transparency, if present, is preserved.'
	),
	decodeToPng(
		'webp-to-png',
		'Convert WebP to PNG',
		'Re-encodes a WebP image into universal PNG.'
	),
	decodeToPng(
		'gif-to-png',
		'Convert GIF to PNG',
		'Extracts the first frame of a GIF animation and saves it as PNG.'
	),
	decodeToPng(
		'bmp-to-png',
		'Convert BMP to PNG',
		'Re-encodes BMP into compact lossless PNG.'
	),
	decodeToPng(
		'ico-to-png',
		'Convert ICO to PNG',
		'Turns an .ico icon into a regular PNG of the chosen size.'
	),
	{
		id: 'png-to-bmp',
		title: 'Convert PNG to BMP',
		description:
			'Saves the image as 24-bit BMP without an alpha channel: transparency is replaced with a black background.',
		category: 'convert',
		params: [],
		run: (img) => flattenOntoColor(img, '#000000'),
		output: { mime: 'image/bmp', ext: 'bmp' }
	},
	{
		id: 'png-to-base64',
		title: 'PNG to Base64',
		description: 'Encodes the image into a base64 string for embedding in code or styles.',
		category: 'convert',
		params: [],
		resultType: 'text',
		toText: (img) => toBase64(img)
	},
	{
		id: 'base64-to-png',
		title: 'Base64 to PNG',
		description:
			'Decodes a base64 string or data-uri back into an image. Paste the string on the left.',
		category: 'convert',
		sourceMode: 'text',
		params: [],
		run: (img) => clonePixelImage(img)
	},
	{
		id: 'png-to-data-uri',
		title: 'PNG to Data URI',
		description: 'Builds a full data-uri (data:image/png;base64,…) for embedding in HTML/CSS.',
		category: 'convert',
		params: [],
		resultType: 'text',
		toText: (img) => toDataUrl(img)
	},
	{
		id: 'data-uri-to-png',
		title: 'Data URI to PNG',
		description: 'Decodes data:image/…;base64,… back into an image file.',
		category: 'convert',
		sourceMode: 'text',
		params: [],
		run: (img) => clonePixelImage(img)
	},
	{
		id: 'png-to-hex',
		title: 'PNG to HEX pixels',
		description:
			'Shows all pixels as rrggbbaa hex values — row by row, space separated.',
		category: 'convert',
		params: [],
		resultType: 'text',
		toText: (img) => pixelsToHex(img)
	},
	{
		id: 'hex-to-png',
		title: 'HEX pixels to PNG',
		description:
			'Assembles an image from rrggbbaa hex values (space separated). Set the width — the height is computed automatically.',
		category: 'convert',
		sourceMode: 'text',
		params: [
			{ id: 'width', label: 'Image width', type: 'number', min: 1, max: 10000, step: 1, default: 1 }
		],
		runFromText: (text, p) => hexToPixels(text, Math.trunc(Number(p['width']))),
		run: (img) => clonePixelImage(img)
	},
	{
		id: 'resize-png',
		title: 'Resize PNG',
		description:
			'Scales the image with bilinear interpolation. With aspect kept, one side defines the scale; if both are set, the image fits inside them.',
		category: 'geometry',
		params: [
			{ id: 'width', label: 'Width (0 = auto)', type: 'number', min: 0, max: 20000, step: 1, default: 0 },
			{ id: 'height', label: 'Height (0 = auto)', type: 'number', min: 0, max: 20000, step: 1, default: 0 },
			{ id: 'keepAspect', label: 'Keep aspect ratio', type: 'checkbox', default: true }
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
				throw new ToolError('errors.resizeSize');
			}
			return resize(img, w, h);
		}
	},
	{
		id: 'crop-png',
		title: 'Crop PNG',
		description:
			'Cuts out a rectangular area. Coordinates and sizes may go beyond the image — the area is clipped to the intersection.',
		category: 'geometry',
		params: [
			{ id: 'x', label: 'X (from left)', type: 'number', min: -100000, max: 100000, step: 1, default: 0 },
			{ id: 'y', label: 'Y (from top)', type: 'number', min: -100000, max: 100000, step: 1, default: 0 },
			{ id: 'width', label: 'Area width', type: 'number', min: -100000, max: 100000, step: 1, default: 0 },
			{ id: 'height', label: 'Area height', type: 'number', min: -100000, max: 100000, step: 1, default: 0 }
		],
		run: (img, p) => {
			const w = Math.trunc(num(p, 'width'));
			const h = Math.trunc(num(p, 'height'));
			if (w <= 0 || h <= 0) {
				throw new ToolError('errors.cropSize');
			}
			return crop(img, Math.trunc(num(p, 'x')), Math.trunc(num(p, 'y')), w, h);
		}
	},
	{
		id: 'rotate-png',
		title: 'Rotate PNG',
		description: 'Rotates by 90°, 180° or 270° clockwise without quality loss.',
		category: 'geometry',
		params: [
			{
				id: 'angle',
				label: 'Rotation angle',
				type: 'select',
				default: '90',
				options: [
					{ value: '90', label: '90° clockwise' },
					{ value: '180', label: '180°' },
					{ value: '270', label: '270° clockwise' }
				]
			}
		],
		run: (img, p) => rotate90(img, Number(str(p, 'angle')) / 90)
	},
	{
		id: 'flip-png',
		title: 'Flip PNG',
		description: 'Mirrors horizontally or vertically without quality loss.',
		category: 'geometry',
		params: [
			{
				id: 'axis',
				label: 'Flip axis',
				type: 'select',
				default: 'horizontal',
				options: [
					{ value: 'horizontal', label: 'Horizontal (left to right)' },
					{ value: 'vertical', label: 'Vertical (top to bottom)' }
				]
			}
		],
		run: (img, p) => flip(img, str(p, 'axis') === 'vertical' ? 'vertical' : 'horizontal')
	},
	{
		id: 'add-padding-png',
		title: 'Add padding to PNG',
		description: 'Expands the canvas on all sides by the chosen number of pixels.',
		category: 'geometry',
		params: [
			{ id: 'padding', label: 'Padding, px', type: 'number', min: 1, max: 2000, step: 1, default: 10 },
			{ id: 'transparent', label: 'Transparent padding', type: 'checkbox', default: true },
			{ id: 'color', label: 'Padding color', type: 'color', default: '#ffffff' }
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
		title: 'Add border to PNG',
		description: 'Draws a colored frame of the chosen thickness around the image.',
		category: 'geometry',
		params: [
			{ id: 'thickness', label: 'Border thickness, px', type: 'number', min: 1, max: 500, step: 1, default: 5 },
			{ id: 'color', label: 'Border color', type: 'color', default: '#000000' }
		],
		run: (img, p) => expandCanvas(img, num(p, 'thickness'), num(p, 'thickness'), num(p, 'thickness'), num(p, 'thickness'), str(p, 'color'))
	},
	{
		id: 'fit-on-background-png',
		title: 'Fit PNG onto background',
		description:
			'Places the image centered on a canvas of the given size with a transparent or colored background.',
		category: 'geometry',
		params: [
			{ id: 'width', label: 'Canvas width', type: 'number', min: 1, max: 20000, step: 1, default: 800 },
			{ id: 'height', label: 'Canvas height', type: 'number', min: 1, max: 20000, step: 1, default: 600 },
			{ id: 'transparent', label: 'Transparent background', type: 'checkbox', default: false },
			{ id: 'color', label: 'Background color', type: 'color', default: '#ffffff' }
		],
		run: (img, p) => {
			const width = Math.trunc(num(p, 'width'));
			const height = Math.trunc(num(p, 'height'));
			if (width <= 0 || height <= 0) {
				throw new ToolError('errors.sizePositive');
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
		title: 'Tile PNG',
		description: 'Repeats the image in a grid of the chosen columns and rows.',
		category: 'geometry',
		params: [
			{ id: 'columns', label: 'Columns', type: 'number', min: 1, max: 50, step: 1, default: 2 },
			{ id: 'rows', label: 'Rows', type: 'number', min: 1, max: 50, step: 1, default: 2 }
		],
		run: (img, p) => tile(img, num(p, 'columns'), num(p, 'rows'))
	},
	{
		id: 'center-by-alpha-png',
		title: 'Center PNG by content',
		description:
			'Finds the opaque part of the image and centers it on the original canvas.',
		category: 'geometry',
		params: [],
		run: (img) => centerByAlpha(img)
	},
	{
		id: 'blur-png',
		title: 'Blur PNG',
		description:
			'Gaussian blur: three passes of separable box blur — fast at any radius. Transparent edges do not darken.',
		category: 'filters',
		params: [
			{ id: 'radius', label: 'Radius, px', type: 'slider', min: 1, max: 32, step: 1, default: 4 }
		],
		run: (img, p) => gaussianBlur(img, num(p, 'radius'))
	},
	{
		id: 'sharpen-png',
		title: 'Sharpen PNG',
		description:
			'Emphasizes edges with a sharpening kernel; strength sets the blend with the original. 0% means no change.',
		category: 'filters',
		params: [
			{ id: 'strength', label: 'Strength, %', type: 'slider', min: 0, max: 100, step: 1, default: 50 }
		],
		run: (img, p) => sharpenImage(img, num(p, 'strength'))
	},
	{
		id: 'grayscale-png',
		title: 'Grayscale PNG',
		description: 'Converts the image to shades of gray using the BT.601 luminance formula. Alpha is preserved.',
		category: 'color',
		params: [],
		run: (img) => grayscale(img)
	},
	{
		id: 'invert-colors-png',
		title: 'Invert colors PNG',
		description: 'Inverts each color channel (255 − value). Alpha is unchanged.',
		category: 'color',
		params: [],
		run: (img) => invert(img)
	},
	{
		id: 'adjust-brightness-contrast-png',
		title: 'Brightness & contrast PNG',
		description: 'Adjusts brightness and contrast in the range from −100 to +100. Zero means no change.',
		category: 'color',
		params: [
			{ id: 'brightness', label: 'Brightness', type: 'slider', min: -100, max: 100, step: 1, default: 0 },
			{ id: 'contrast', label: 'Contrast', type: 'slider', min: -100, max: 100, step: 1, default: 0 }
		],
		run: (img, p) => brightnessContrast(img, num(p, 'brightness'), num(p, 'contrast'))
	},
	{
		id: 'change-png-opacity',
		title: 'Change PNG opacity',
		description:
			'Multiplies the alpha channel by a percentage: 0% — fully transparent, 100% — unchanged.',
		category: 'color',
		params: [
			{ id: 'percent', label: 'Opacity, %', type: 'slider', min: 0, max: 100, step: 1, default: 100 }
		],
		run: (img, p) => setOpacity(img, num(p, 'percent'))
	},
	{
		id: 'sepia-png',
		title: 'Sepia effect',
		description: 'Tints the image into the warm brown tones of classic sepia.',
		category: 'color',
		params: [],
		run: (img) => sepia(img)
	},
	{
		id: 'change-png-hue',
		title: 'Change hue PNG',
		description: 'Shifts the hue around the circle. Saturation and lightness are preserved.',
		category: 'color',
		params: [
			{ id: 'degrees', label: 'Hue shift, °', type: 'slider', min: -180, max: 180, step: 1, default: 0 }
		],
		run: (img, p) => changeHue(img, num(p, 'degrees'))
	},
	{
		id: 'extract-channel-png',
		title: 'Extract channel PNG',
		description: 'Keeps only the chosen channel — red, green or blue — as shades of gray.',
		category: 'color',
		params: [
			{
				id: 'channel',
				label: 'Channel',
				type: 'select',
				default: 'red',
				options: [
					{ value: 'red', label: 'Red' },
					{ value: 'green', label: 'Green' },
					{ value: 'blue', label: 'Blue' }
				]
			}
		],
		run: (img, p) => extractChannel(img, str(p, 'channel') as RgbChannel)
	},
	{
		id: 'swap-channels-png',
		title: 'Swap channels PNG',
		description: 'Swaps two color channels — a quick way to get unusual coloring.',
		category: 'color',
		params: [
			{
				id: 'pair',
				label: 'Channel pair',
				type: 'select',
				default: 'r-g',
				options: [
					{ value: 'r-g', label: 'Red ↔ Green' },
					{ value: 'r-b', label: 'Red ↔ Blue' },
					{ value: 'g-b', label: 'Green ↔ Blue' }
				]
			}
		],
		run: (img, p) => swapChannels(img, str(p, 'pair') as ChannelSwapPair)
	},
	{
		id: 'black-and-white-png',
		title: 'Black & white threshold PNG',
		description: 'Hard binarization by luminance: every pixel becomes black or white.',
		category: 'color',
		params: [
			{ id: 'threshold', label: 'Brightness threshold, %', type: 'slider', min: 0, max: 100, step: 1, default: 50 }
		],
		run: (img, p) => thresholdBlackWhite(img, num(p, 'threshold'))
	},
	{
		id: 'posterize-png',
		title: 'Posterize PNG',
		description: 'Reduces the number of levels per channel — a poster effect.',
		category: 'color',
		params: [
			{ id: 'levels', label: 'Levels per channel', type: 'slider', min: 2, max: 16, step: 1, default: 4 }
		],
		run: (img, p) => posterize(img, num(p, 'levels'))
	},
	{
		id: 'two-colors-png',
		title: 'Two colors PNG',
		description: 'Recolors the image into two chosen colors by luminance threshold.',
		category: 'color',
		params: [
			{ id: 'lightColor', label: 'Light areas color', type: 'color', default: '#ffffff' },
			{ id: 'darkColor', label: 'Dark areas color', type: 'color', default: '#000000' },
			{ id: 'threshold', label: 'Brightness threshold, %', type: 'slider', min: 0, max: 100, step: 1, default: 50 }
		],
		run: (img, p) => twoColors(img, str(p, 'lightColor'), str(p, 'darkColor'), num(p, 'threshold'))
	},
	{
		id: 'convert-png-to-jpg',
		title: 'Convert PNG to JPG',
		description:
			'Transparency is composited over the chosen backdrop color (white by default) and saved as JPEG.',
		category: 'convert',
		params: [
			{ id: 'background', label: 'Backdrop color', type: 'color', default: '#ffffff' },
			{ id: 'quality', label: 'JPEG quality', type: 'slider', min: 1, max: 100, step: 1, default: 90 }
		],
		output: { mime: 'image/jpeg', ext: 'jpg', qualityParamId: 'quality' },
		run: (img, p) => flattenOntoColor(img, str(p, 'background'))
	},
	{
		id: 'convert-png-to-webp',
		title: 'Convert PNG to WebP',
		description: 'Re-encodes the image into WebP with adjustable quality. Transparency is preserved.',
		category: 'convert',
		params: [{ id: 'quality', label: 'WebP quality', type: 'slider', min: 1, max: 100, step: 1, default: 90 }],
		output: { mime: 'image/webp', ext: 'webp', qualityParamId: 'quality' },
		run: (img) => clonePixelImage(img)
	},
	{
		id: 'remove-alpha-channel-png',
		title: 'Remove alpha channel PNG',
		description: 'Composites the image over a white background and saves without transparency.',
		category: 'alpha',
		params: [],
		run: (img) => flattenOntoColor(img, '#ffffff')
	},
	{
		id: 'set-alpha-channel-png',
		title: 'Set alpha channel PNG',
		description: 'Assigns the same opacity to all pixels; colors stay unchanged.',
		category: 'alpha',
		params: [
			{ id: 'percent', label: 'Opacity, %', type: 'slider', min: 0, max: 100, step: 1, default: 100 }
		],
		run: (img, p) => setAlphaChannel(img, num(p, 'percent'))
	},
	{
		id: 'extract-alpha-mask-png',
		title: 'Extract alpha mask PNG',
		description: 'Turns transparency into a black-and-white opaque mask.',
		category: 'alpha',
		params: [],
		run: (img) => extractAlphaMask(img)
	},
	{
		id: 'round-corners-png',
		title: 'Round corners PNG',
		description:
			'Clips corners by a radius set as a percentage of half the smaller side.',
		category: 'alpha',
		params: [
			{ id: 'radius', label: 'Corner radius, %', type: 'slider', min: 0, max: 50, step: 1, default: 10 }
		],
		run: (img, p) => roundCorners(img, num(p, 'radius'))
	},
	{
		id: 'invert-alpha-png',
		title: 'Invert alpha PNG',
		description: 'Opaque areas become transparent and vice versa.',
		category: 'alpha',
		params: [],
		run: (img) => invertAlpha(img)
	},
	{
		id: 'remove-background-png',
		title: 'Remove background PNG (smart)',
		description:
			'Removes a solid background: by color with tolerance, outer regions from the edges only, or every matching pixel. Can smooth the boundary.',
		category: 'alpha',
		params: [
			{ id: 'color', label: 'Background color', type: 'color', default: '#ffffff' },
			{ id: 'tolerance', label: 'Similarity tolerance, %', type: 'slider', min: 0, max: 100, step: 1, default: 10 },
			{ id: 'outerOnly', label: 'Outer regions only', type: 'checkbox', default: true },
			{ id: 'smooth', label: 'Edge smoothing, passes', type: 'slider', min: 0, max: 8, step: 1, default: 1 }
		],
		run: (img, p) =>
			removeBackground(img, {
				color: str(p, 'color'),
				tolerancePercent: num(p, 'tolerance'),
				outerOnly: p['outerOnly'] === true,
				smoothPasses: num(p, 'smooth')
			}),
		preview: (img, p) =>
			backgroundMaskPreview(img, {
				color: str(p, 'color'),
				tolerancePercent: num(p, 'tolerance'),
				outerOnly: p['outerOnly'] === true,
				smoothPasses: num(p, 'smooth')
			})
	},
	{
		id: 'add-stroke-png',
		title: 'Outline PNG',
		description:
			'Adds a colored ring outline around the opaque content with the chosen thickness.',
		category: 'alpha',
		params: [
			{ id: 'color', label: 'Outline color', type: 'color', default: '#ff0000' },
			{ id: 'thickness', label: 'Thickness, px', type: 'slider', min: 1, max: 10, step: 1, default: 3 }
		],
		run: (img, p) => strokeImage(img, num(p, 'thickness'), str(p, 'color'))
	},
	{
		id: 'find-contour-png',
		title: 'Find contour PNG',
		description:
			'Leaves only a line along the boundary of opaque regions in the chosen color and thickness.',
		category: 'alpha',
		params: [
			{ id: 'color', label: 'Line color', type: 'color', default: '#000000' },
			{ id: 'thickness', label: 'Line thickness, px', type: 'slider', min: 1, max: 5, step: 1, default: 1 }
		],
		run: (img, p) => contourImage(img, num(p, 'thickness'), str(p, 'color'))
	},
	{
		id: 'make-thicker-png',
		title: 'Thicken PNG',
		description: 'Expands opaque areas by the given number of pixels.',
		category: 'alpha',
		params: [
			{ id: 'radius', label: 'Amount, px', type: 'slider', min: 1, max: 10, step: 1, default: 2 }
		],
		run: (img, p) => dilateImage(img, num(p, 'radius'))
	},
	{
		id: 'make-thinner-png',
		title: 'Thin PNG',
		description: 'Shrinks opaque areas — thins the strokes of text and details.',
		category: 'alpha',
		params: [
			{ id: 'radius', label: 'Amount, px', type: 'slider', min: 1, max: 10, step: 1, default: 1 }
		],
		run: (img, p) => erodeImage(img, num(p, 'radius'))
	},
	{
		id: 'harden-alpha-png',
		title: 'Harden edges PNG',
		description:
			'Binarizes the alpha channel by threshold: semi-transparent pixels become either fully transparent or fully opaque.',
		category: 'alpha',
		params: [
			{ id: 'threshold', label: 'Alpha threshold, %', type: 'slider', min: 0, max: 100, step: 1, default: 50 }
		],
		run: (img, p) => hardenAlpha(img, num(p, 'threshold'))
	},
	{
		id: 'despeckle-alpha-png',
		title: 'Despeckle PNG',
		description: 'Opening: removes lone semi-transparent pixels and small specks.',
		category: 'alpha',
		params: [
			{ id: 'radius', label: 'Cleanup radius, px', type: 'slider', min: 1, max: 3, step: 1, default: 1 }
		],
		run: (img, p) => openingImage(img, num(p, 'radius'))
	},
	{
		id: 'close-holes-png',
		title: 'Close holes PNG',
		description: 'Closing: fills lone transparent dots inside the object.',
		category: 'alpha',
		params: [
			{ id: 'radius', label: 'Closing radius, px', type: 'slider', min: 1, max: 3, step: 1, default: 1 }
		],
		run: (img, p) => closingImage(img, num(p, 'radius'))
	},
	{
		id: 'remove-color-from-png',
		title: 'Remove color from PNG (make transparent)',
		description:
			'Makes all pixels close to the chosen color transparent. The tolerance sets the allowed deviation as a percentage of the maximum color distance.',
		category: 'alpha',
		params: [
			{ id: 'targetColor', label: 'Color to remove', type: 'color', default: '#00ff00' },
			{ id: 'tolerance', label: 'Similarity threshold, %', type: 'slider', min: 0, max: 100, step: 1, default: 10 }
		],
		run: (img, p) => removeColorToAlpha(img, str(p, 'targetColor'), num(p, 'tolerance')),
		preview: (img, p) => colorMask(img, str(p, 'targetColor'), num(p, 'tolerance'))
	},
	{
		id: 'png-info',
		title: 'PNG info',
		description:
			'Shows dimensions, alpha presence and the number of unique colors of the uploaded image.',
		category: 'analyze',
		params: [],
		resultType: 'info',
		run: (img) => clonePixelImage(img)
	},
	{
		id: 'create-empty-png',
		title: 'Create empty PNG',
		description: 'Generates a canvas of the chosen size — transparent or filled with color.',
		category: 'generate',
		sourceMode: 'none',
		params: [
			{ id: 'width', label: 'Width', type: 'number', min: 1, max: 20000, step: 1, default: 800 },
			{ id: 'height', label: 'Height', type: 'number', min: 1, max: 20000, step: 1, default: 600 },
			{ id: 'transparent', label: 'Transparent', type: 'checkbox', default: true },
			{ id: 'color', label: 'Color', type: 'color', default: '#ffffff' }
		],
		generate: (p) =>
			solidImage(
				Math.trunc(num(p, 'width')),
				Math.trunc(num(p, 'height')),
				p['transparent'] === true
					? [0, 0, 0, 0]
					: hexToRgba(str(p, 'color'))
			)
	},
	{
		id: 'single-color-png',
		title: 'Create solid color PNG',
		description: 'Generates a rectangle of the given size and color.',
		category: 'generate',
		sourceMode: 'none',
		params: [
			{ id: 'width', label: 'Width', type: 'number', min: 1, max: 20000, step: 1, default: 256 },
			{ id: 'height', label: 'Height', type: 'number', min: 1, max: 20000, step: 1, default: 256 },
			{ id: 'color', label: 'Color', type: 'color', default: '#ff0000' }
		],
		generate: (p) =>
			solidImage(
				Math.trunc(num(p, 'width')),
				Math.trunc(num(p, 'height')),
				hexToRgba(str(p, 'color'))
			)
	},
	{
		id: 'random-noise-png',
		title: 'Create random noise PNG',
		description:
			'Generates an image with random pixels. The seed fixes the result: one seed — one image.',
		category: 'generate',
		sourceMode: 'none',
		params: [
			{ id: 'width', label: 'Width', type: 'number', min: 1, max: 5000, step: 1, default: 512 },
			{ id: 'height', label: 'Height', type: 'number', min: 1, max: 5000, step: 1, default: 512 },
			{ id: 'seed', label: 'Seed', type: 'number', min: 0, max: 999999999, step: 1, default: 1 }
		],
		generate: (p) => noiseImage(Math.trunc(num(p, 'width')), Math.trunc(num(p, 'height')), num(p, 'seed'))
	},
	{
		id: 'linear-gradient-png',
		title: 'Create gradient PNG',
		description: 'Generates a smooth transition between two colors, horizontally or vertically.',
		category: 'generate',
		sourceMode: 'none',
		params: [
			{ id: 'width', label: 'Width', type: 'number', min: 1, max: 20000, step: 1, default: 800 },
			{ id: 'height', label: 'Height', type: 'number', min: 1, max: 20000, step: 1, default: 600 },
			{ id: 'fromColor', label: 'Start color', type: 'color', default: '#000000' },
			{ id: 'toColor', label: 'End color', type: 'color', default: '#ffffff' },
			{
				id: 'direction',
				label: 'Direction',
				type: 'select',
				default: 'horizontal',
				options: [
					{ value: 'horizontal', label: 'Horizontal' },
					{ value: 'vertical', label: 'Vertical' }
				]
			}
		],
		generate: (p) =>
			gradientImage(
				Math.trunc(num(p, 'width')),
				Math.trunc(num(p, 'height')),
				hexToRgba(str(p, 'fromColor')),
				hexToRgba(str(p, 'toColor')),
				str(p, 'direction') === 'vertical' ? 'vertical' : 'horizontal'
			)
	},
	{
		id: 'color-wheel-png',
		title: 'Color Wheel PNG',
		description:
			'Generates an HSL color wheel: hue around the circle, saturation from center to edge, chosen lightness.',
		category: 'generate',
		sourceMode: 'none',
		params: [
			{ id: 'width', label: 'Size', type: 'slider', min: 128, max: 1024, step: 16, default: 512 },
			{ id: 'lightness', label: 'Lightness, %', type: 'slider', min: 0, max: 100, step: 1, default: 50 }
		],
		generate: (p) => renderWheel(Math.trunc(num(p, 'width')), num(p, 'lightness'))
	},
	{
		id: 'complementary-png',
		title: 'Complementary Palette PNG',
		description: 'Two opposite colors on the color wheel — the base and its complement.',
		category: 'generate',
		sourceMode: 'none',
		params: paletteParams('#2563eb'),
		generate: (p) =>
			renderSwatches(complementarySet(str(p, 'baseColor')), num(p, 'width'), str(p, 'layout') as 'strip' | 'grid')
	},
	{
		id: 'triadic-png',
		title: 'Triadic Palette PNG',
		description: 'Three colors evenly spaced 120° apart on the color wheel.',
		category: 'generate',
		sourceMode: 'none',
		params: paletteParams('#ff0000'),
		generate: (p) =>
			renderSwatches(triadicSet(str(p, 'baseColor')), num(p, 'width'), str(p, 'layout') as 'strip' | 'grid')
	},
	{
		id: 'tetradic-png',
		title: 'Tetradic Palette PNG',
		description: 'Four colors in two complementary pairs, 90° apart on the wheel.',
		category: 'generate',
		sourceMode: 'none',
		params: paletteParams('#8000ff'),
		generate: (p) =>
			renderSwatches(tetradicSet(str(p, 'baseColor')), num(p, 'width'), str(p, 'layout') as 'strip' | 'grid')
	},
	{
		id: 'analogous-png',
		title: 'Analogous Palette PNG',
		description: 'Neighboring hues around the base color — calm, related color scheme.',
		category: 'generate',
		sourceMode: 'none',
		params: [
			...paletteParams('#22c55e'),
			{ id: 'spread', label: 'Hue spread, °', type: 'slider', min: 10, max: 90, step: 5, default: 30 },
			{ id: 'count', label: 'Colors', type: 'slider', min: 3, max: 9, step: 1, default: 5 }
		],
		generate: (p) =>
			renderSwatches(
				analogousSet(str(p, 'baseColor'), num(p, 'spread'), num(p, 'count')),
				num(p, 'width'),
				str(p, 'layout') as 'strip' | 'grid'
			)
	},
	{
		id: 'monochromatic-png',
		title: 'Monochromatic Palette PNG',
		description: 'Tones of a single hue: lightness varies within the chosen range, hue and saturation stay fixed.',
		category: 'generate',
		sourceMode: 'none',
		params: [
			...paletteParams('#0ea5e9'),
			{ id: 'count', label: 'Colors', type: 'slider', min: 2, max: 9, step: 1, default: 5 },
			{ id: 'range', label: 'Lightness range, %', type: 'slider', min: 10, max: 90, step: 5, default: 40 }
		],
		generate: (p) =>
			renderSwatches(
				monochromaticSet(str(p, 'baseColor'), num(p, 'count'), num(p, 'range')),
				num(p, 'width'),
				str(p, 'layout') as 'strip' | 'grid'
			)
	},
	{
		id: 'shades-png',
		title: 'Shade Ramp PNG',
		description: 'A ramp of the base color getting darker step by step.',
		category: 'generate',
		sourceMode: 'none',
		params: [
			...paletteParams('#f59e0b'),
			{ id: 'count', label: 'Colors', type: 'slider', min: 2, max: 9, step: 1, default: 5 },
			{ id: 'depth', label: 'Darkening depth, %', type: 'slider', min: 10, max: 90, step: 5, default: 50 }
		],
		generate: (p) =>
			renderSwatches(
				shadeSet(str(p, 'baseColor'), num(p, 'count'), num(p, 'depth')),
				num(p, 'width'),
				str(p, 'layout') as 'strip' | 'grid'
			)
	},
	{
		id: 'mix-colors-png',
		title: 'Mix Colors PNG',
		description:
			'Averages several hex colors into one swatch. Enter comma-separated #hex values; invalid tokens are skipped.',
		category: 'generate',
		sourceMode: 'none',
		params: [
			{
				id: 'colors',
				label: 'Colors (comma-separated hex)',
				type: 'text',
				default: '#ff0000,#00ff00,#0000ff'
			},
			{ id: 'width', label: 'Width', type: 'slider', min: 128, max: 1024, step: 16, default: 512 }
		],
		generate: (p) => renderSwatches([mixColors(parseHexList(str(p, 'colors')))], num(p, 'width'), 'strip')
	},
	{
		id: 'blend-two-png',
		title: 'Blend Two Colors PNG',
		description: 'A continuous horizontal gradient between two colors.',
		category: 'generate',
		sourceMode: 'none',
		params: [
			{ id: 'colorA', label: 'Color A', type: 'color', default: '#000000' },
			{ id: 'colorB', label: 'Color B', type: 'color', default: '#ffffff' },
			{ id: 'width', label: 'Width', type: 'slider', min: 128, max: 1024, step: 16, default: 512 }
		],
		generate: (p) => renderBlend(str(p, 'colorA'), str(p, 'colorB'), num(p, 'width'))
	},
	{
		id: 'step-colors-png',
		title: 'Color Steps PNG',
		description: 'A discrete set of evenly spaced steps between two colors.',
		category: 'generate',
		sourceMode: 'none',
		params: [
			{ id: 'colorA', label: 'Color A', type: 'color', default: '#000000' },
			{ id: 'colorB', label: 'Color B', type: 'color', default: '#ffffff' },
			{ id: 'steps', label: 'Steps', type: 'slider', min: 2, max: 12, step: 1, default: 6 },
			...paletteParams('#808080').filter((q) => q.id !== 'baseColor')
		],
		generate: (p) =>
			renderSwatches(
				stepColors(str(p, 'colorA'), str(p, 'colorB'), num(p, 'steps')),
				num(p, 'width'),
				str(p, 'layout') as 'strip' | 'grid'
			)
	},
	{
		id: 'sort-colors-png',
		title: 'Sort Colors PNG',
		description:
			'Renders your hex list as swatches sorted by hue, brightness or saturation. Invalid tokens are skipped.',
		category: 'generate',
		sourceMode: 'none',
		params: [
			{
				id: 'colors',
				label: 'Colors (comma-separated hex)',
				type: 'text',
				default: '#ff0000,#ff8800,#ffff00,#00cc44,#0066ff,#8800ff'
			},
			{
				id: 'order',
				label: 'Sort by',
				type: 'select',
				default: 'hue',
				options: [
					{ value: 'hue', label: 'Hue' },
					{ value: 'luma', label: 'Brightness' },
					{ value: 'sat', label: 'Saturation' }
				]
			},
			...paletteParams('#ffffff').filter((q) => q.id !== 'baseColor')
		],
		generate: (p) =>
			renderSwatches(
				sortPalette(parseHexList(str(p, 'colors')), str(p, 'order') as SortKey),
				num(p, 'width'),
				str(p, 'layout') as 'strip' | 'grid'
			)
	},
	{
		id: 'add-text-png',
		title: 'Add text to PNG',
		description:
			'Draws a text label on the image: font, size, color, bold, position on a 3×3 grid and an optional backing plate.',
		category: 'text',
		domOnly: true,
		params: [
			{ id: 'text', label: 'Text', type: 'text', default: 'Hello!', placeholder: 'Your text' },
			{ id: 'fontSize', label: 'Font size, px', type: 'slider', min: 8, max: 200, step: 1, default: 48 },
			{ id: 'color', label: 'Text color', type: 'color', default: '#ffffff' },
			{
				id: 'font',
				label: 'Font',
				type: 'select',
				default: 'sans',
				options: [
					{ value: 'sans', label: 'Sans-serif' },
					{ value: 'serif', label: 'Serif' },
					{ value: 'mono', label: 'Monospace' }
				]
			},
			{ id: 'bold', label: 'Bold', type: 'checkbox', default: true },
			{
				id: 'position',
				label: 'Position',
				type: 'select',
				default: 'bottom-right',
				options: [
					{ value: 'top-left', label: 'Top left' },
					{ value: 'top-center', label: 'Top center' },
					{ value: 'top-right', label: 'Top right' },
					{ value: 'middle-left', label: 'Middle left' },
					{ value: 'center', label: 'Center' },
					{ value: 'middle-right', label: 'Middle right' },
					{ value: 'bottom-left', label: 'Bottom left' },
					{ value: 'bottom-center', label: 'Bottom center' },
					{ value: 'bottom-right', label: 'Bottom right' }
				]
			},
			{ id: 'margin', label: 'Margin, px', type: 'slider', min: 0, max: 200, step: 1, default: 24 },
			{ id: 'plate', label: 'Backing plate', type: 'checkbox', default: false },
			{ id: 'plateColor', label: 'Plate color', type: 'color', default: '#000000' },
			{
				id: 'plateOpacity',
				label: 'Plate opacity, %',
				type: 'slider',
				min: 0,
				max: 100,
				step: 5,
				default: 60
			}
		],
		run: (img, p) =>
			drawTextBlock(img, {
				text: str(p, 'text'),
				fontSize: num(p, 'fontSize'),
				font: str(p, 'font') as TextFont,
				bold: bool(p, 'bold'),
				color: str(p, 'color'),
				opacityPercent: 100,
				position: str(p, 'position') as Position9,
				margin: num(p, 'margin'),
				plateColor: bool(p, 'plate') ? str(p, 'plateColor') : undefined,
				plateOpacityPercent: num(p, 'plateOpacity')
			})
	},
	{
		id: 'date-stamp-png',
		title: 'Date stamp PNG',
		description:
			'Stamps the current date and time using a format string (YYYY MM DD hh mm ss tokens). Same styling options as Add text.',
		category: 'text',
		domOnly: true,
		params: [
			{ id: 'format', label: 'Format', type: 'text', default: 'YYYY-MM-DD', placeholder: 'YYYY-MM-DD hh:mm' },
			{ id: 'fontSize', label: 'Font size, px', type: 'slider', min: 8, max: 200, step: 1, default: 32 },
			{ id: 'color', label: 'Text color', type: 'color', default: '#ffffff' },
			{
				id: 'font',
				label: 'Font',
				type: 'select',
				default: 'mono',
				options: [
					{ value: 'sans', label: 'Sans-serif' },
					{ value: 'serif', label: 'Serif' },
					{ value: 'mono', label: 'Monospace' }
				]
			},
			{ id: 'bold', label: 'Bold', type: 'checkbox', default: false },
			{
				id: 'position',
				label: 'Position',
				type: 'select',
				default: 'bottom-right',
				options: [
					{ value: 'top-left', label: 'Top left' },
					{ value: 'top-center', label: 'Top center' },
					{ value: 'top-right', label: 'Top right' },
					{ value: 'middle-left', label: 'Middle left' },
					{ value: 'center', label: 'Center' },
					{ value: 'middle-right', label: 'Middle right' },
					{ value: 'bottom-left', label: 'Bottom left' },
					{ value: 'bottom-center', label: 'Bottom center' },
					{ value: 'bottom-right', label: 'Bottom right' }
				]
			},
			{ id: 'margin', label: 'Margin, px', type: 'slider', min: 0, max: 200, step: 1, default: 20 },
			{ id: 'plate', label: 'Backing plate', type: 'checkbox', default: true },
			{ id: 'plateColor', label: 'Plate color', type: 'color', default: '#000000' },
			{
				id: 'plateOpacity',
				label: 'Plate opacity, %',
				type: 'slider',
				min: 0,
				max: 100,
				step: 5,
				default: 55
			}
		],
		run: (img, p) =>
			drawTextBlock(img, {
				text: formatStamp(new Date(), str(p, 'format')),
				fontSize: num(p, 'fontSize'),
				font: str(p, 'font') as TextFont,
				bold: bool(p, 'bold'),
				color: str(p, 'color'),
				opacityPercent: 100,
				position: str(p, 'position') as Position9,
				margin: num(p, 'margin'),
				plateColor: bool(p, 'plate') ? str(p, 'plateColor') : undefined,
				plateOpacityPercent: num(p, 'plateOpacity')
			})
	},
	{
		id: 'watermark-tile-png',
		title: 'Watermark Tile PNG',
		description:
			'Covers the image with a repeating diagonal semi-transparent text tile — a protection watermark.',
		category: 'text',
		domOnly: true,
		params: [
			{ id: 'text', label: 'Text', type: 'text', default: 'DRAFT', placeholder: 'Watermark text' },
			{ id: 'fontSize', label: 'Font size, px', type: 'slider', min: 12, max: 160, step: 1, default: 56 },
			{ id: 'color', label: 'Text color', type: 'color', default: '#ffffff' },
			{ id: 'opacity', label: 'Opacity, %', type: 'slider', min: 5, max: 100, step: 5, default: 30 },
			{ id: 'angle', label: 'Angle, °', type: 'slider', min: -90, max: 90, step: 1, default: -30 },
			{ id: 'stepX', label: 'Step X, px', type: 'slider', min: 40, max: 600, step: 10, default: 220 },
			{ id: 'stepY', label: 'Step Y, px', type: 'slider', min: 40, max: 600, step: 10, default: 180 },
			{
				id: 'font',
				label: 'Font',
				type: 'select',
				default: 'sans',
				options: [
					{ value: 'sans', label: 'Sans-serif' },
					{ value: 'serif', label: 'Serif' },
					{ value: 'mono', label: 'Monospace' }
				]
			},
			{ id: 'bold', label: 'Bold', type: 'checkbox', default: true }
		],
		run: (img, p) =>
			drawTextTile(img, {
				text: str(p, 'text'),
				fontSize: num(p, 'fontSize'),
				font: str(p, 'font') as TextFont,
				bold: bool(p, 'bold'),
				color: str(p, 'color'),
				opacityPercent: num(p, 'opacity'),
				stepX: num(p, 'stepX'),
				stepY: num(p, 'stepY'),
				angleDeg: num(p, 'angle')
			})
	},
	{
		id: 'watermark-image-png',
		title: 'Watermark Image PNG',
		description:
			'Overlays another PNG (logo/signature) on top: scale from canvas width, opacity, 3×3 position. The mark lives only while the page is open — after restoring a chain, pick it again.',
		category: 'text',
		domOnly: true,
		needsOverlaySource: true,
		params: [
			{ id: 'scale', label: 'Mark width, % of canvas', type: 'slider', min: 5, max: 100, step: 1, default: 30 },
			{ id: 'opacity', label: 'Opacity, %', type: 'slider', min: 5, max: 100, step: 5, default: 60 },
			{
				id: 'position',
				label: 'Position',
				type: 'select',
				default: 'bottom-right',
				options: [
					{ value: 'top-left', label: 'Top left' },
					{ value: 'top-center', label: 'Top center' },
					{ value: 'top-right', label: 'Top right' },
					{ value: 'middle-left', label: 'Middle left' },
					{ value: 'center', label: 'Center' },
					{ value: 'middle-right', label: 'Middle right' },
					{ value: 'bottom-left', label: 'Bottom left' },
					{ value: 'bottom-center', label: 'Bottom center' },
					{ value: 'bottom-right', label: 'Bottom right' }
				]
			},
			{ id: 'margin', label: 'Margin, px', type: 'slider', min: 0, max: 200, step: 1, default: 24 }
		],
		run: (img, p) => {
			const mark = getOverlay();
			if (!mark) throw new ToolError('errors.noWatermark');
			return drawImageWatermark(img, {
				mark,
				scalePercent: num(p, 'scale'),
				opacityPercent: num(p, 'opacity'),
				position: str(p, 'position') as Position9,
				margin: num(p, 'margin')
			});
		}
	},
	{
		id: 'png-is-grayscale',
		title: 'Check: is PNG grayscale?',
		description: 'Reports whether the image consists only of shades of gray.',
		category: 'analyze',
		params: [],
		resultType: 'text',
		toText: (img) =>
			isGrayscale(img) ? 'grayscaleYes' : 'grayscaleNo'
	},
	{
		id: 'skew-png',
		title: 'Skew PNG',
		description: 'Shifts content horizontally and vertically — a perspective effect.',
		category: 'geometry',
		params: [
			{ id: 'degX', label: 'Skew X, °', type: 'slider', min: -80, max: 80, step: 1, default: 0 },
			{ id: 'degY', label: 'Skew Y, °', type: 'slider', min: -80, max: 80, step: 1, default: 0 }
		],
		run: (img, p) => skewImage(img, num(p, 'degX'), num(p, 'degY'))
	},
	{
		id: 'rotate-free-png',
		title: 'Rotate by custom angle',
		description:
			'Rotation by any angle. The canvas grows to fit the new bounds; corners stay transparent.',
		category: 'geometry',
		params: [
			{ id: 'angle', label: 'Angle, °', type: 'slider', min: -180, max: 180, step: 1, default: 15 }
		],
		run: (img, p) => rotateFreeImage(img, num(p, 'angle'))
	},
	{
		id: 'zoom-png',
		title: 'Zoom PNG',
		description:
			'Magnifies content toward the center. The canvas keeps its size — edges are cropped.',
		category: 'geometry',
		params: [
			{ id: 'scale', label: 'Scale, %', type: 'slider', min: 100, max: 500, step: 10, default: 200 }
		],
		run: (img, p) => zoomImage(img, num(p, 'scale'))
	},
	{
		id: 'shift-png',
		title: 'Shift PNG',
		description: 'Moves content by the given X and Y offset.',
		category: 'geometry',
		params: [
			{ id: 'offsetX', label: 'Offset X, px', type: 'number', min: -5000, max: 5000, step: 1, default: 0 },
			{ id: 'offsetY', label: 'Offset Y, px', type: 'number', min: -5000, max: 5000, step: 1, default: 0 },
			{ id: 'color', label: 'Background color', type: 'color', default: '#ffffff' }
		],
		run: (img, p) =>
			transformImage(
				img,
				[1, 0, 0, 1, -Math.trunc(num(p, 'offsetX')), -Math.trunc(num(p, 'offsetY'))],
				img.width,
				img.height,
				str(p, 'color')
			)
	},
	{
		id: 'vignette-png',
		title: 'Vignette PNG',
		description: 'Smoothly darkens the edges of the image, leaving the center untouched.',
		category: 'filters',
		params: [
			{ id: 'strength', label: 'Darkening strength, %', type: 'slider', min: 0, max: 100, step: 5, default: 50 }
		],
		run: (img, p) => vignette(img, num(p, 'strength'))
	},
	{
		id: 'jpeg-artifacts-png',
		title: 'JPEG artifacts',
		description:
			'Simulates low-quality JPEG re-compression — visible blocks and smeared colors.',
		category: 'filters',
		params: [
			{ id: 'quality', label: 'JPEG quality', type: 'slider', min: 1, max: 50, step: 1, default: 10 }
		],
		run: (img, p) => jpegRoundtrip(img, num(p, 'quality'))
	},
	{
		id: 'gamma-png',
		title: 'Gamma correction PNG',
		description: 'Corrects midtone brightness. <1 darker, >1 lighter, 1 — unchanged.',
		category: 'color',
		params: [
			{ id: 'value', label: 'Gamma', type: 'slider', min: 0.1, max: 3, step: 0.05, default: 1 }
		],
		run: (img, p) => gammaCorrection(img, num(p, 'value'))
	},
	{
		id: 'auto-contrast-png',
		title: 'Auto contrast PNG',
		description: 'Stretches each channel\'s range across the full available brightness range.',
		category: 'color',
		params: [],
		run: (img) => autoContrast(img)
	},
	{
		id: 'temperature-png',
		title: 'Temperature PNG',
		description: 'Positive values make the image warmer (more orange), negative ones cooler (more blue).',
		category: 'color',
		params: [
			{ id: 'percent', label: 'Temperature', type: 'slider', min: -100, max: 100, step: 1, default: 0 }
		],
		run: (img, p) => temperature(img, num(p, 'percent'))
	},
	{
		id: 'tint-png',
		title: 'Tint PNG',
		description: 'Multiplies color channels by the chosen tint with the given strength.',
		category: 'color',
		params: [
			{ id: 'color', label: 'Tint color', type: 'color', default: '#ffb060' },
			{ id: 'strength', label: 'Strength, %', type: 'slider', min: 0, max: 100, step: 1, default: 30 }
		],
		run: (img, p) => tint(img, str(p, 'color'), num(p, 'strength'))
	},
	{
		id: 'svg-to-png',
		title: 'SVG to PNG',
		description:
			'Decodes SVG markup into a raster image. Paste the SVG code on the left.',
		category: 'convert',
		sourceMode: 'text',
		params: [{ id: 'width', label: 'Result width, px', type: 'number', min: 1, max: 10000, step: 1, default: 512 }],
		runFromText: (text, p) => decodeSvgText(text, Math.trunc(num(p, 'width'))),
		run: (img) => clonePixelImage(img)
	},
	{
		id: 'png-is-transparent',
		title: 'Check: is PNG transparent?',
		description: 'Reports whether the image contains transparent or semi-transparent pixels.',
		category: 'analyze',
		params: [],
		resultType: 'text',
		toText: (img) =>
			hasTransparency(img) ? 'transparentYes' : 'transparentNo'
	},
	{
		id: 'png-orientation',
		title: 'PNG orientation',
		description: 'Reports whether it is portrait, landscape or square.',
		category: 'analyze',
		params: [],
		resultType: 'text',
		toText: (img) => {
			switch (orientationOf(img)) {
				case 'portrait':
					return 'orientationPortrait';
				case 'landscape':
					return 'orientationLandscape';
				default:
					return 'orientationSquare';
			}
		}
	}
];

import { TOOL_ICONS } from './tools/tool-icons';
import { TOOL_POPULARITY } from './tools/tool-popularity';

for (const entry of TOOLS) {
	entry.icon = entry.id;
	entry.popularity = TOOL_POPULARITY[entry.id] ?? 50;
}

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
			case 'text':
				out[param.id] = typeof raw === 'string' ? raw : param.default;
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
