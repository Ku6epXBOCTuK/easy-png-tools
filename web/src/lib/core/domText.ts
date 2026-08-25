import { ToolError } from './errors';
import type { PixelImage } from './types';
import { anchorOrigin, tileGrid, wrapText, type Position9 } from './textdraw';

export type TextFont = 'sans' | 'serif' | 'mono';

const FONT_STACKS: Record<TextFont, string> = {
	sans: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
	serif: 'Georgia, "Times New Roman", serif',
	mono: 'ui-monospace, "Cascadia Code", Consolas, monospace'
};

function ctx2d(w: number, h: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
	const canvas = document.createElement('canvas');
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext('2d', { willReadFrequently: true });
	if (!ctx) throw new ToolError('errors.noCanvasCtx');
	return { canvas, ctx };
}

function toPixelImage(canvas: HTMLCanvasElement): PixelImage {
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new ToolError('errors.noCanvasCtx');
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	return { width: imageData.width, height: imageData.height, data: imageData.data };
}

export function fontString(size: number, font: TextFont, bold: boolean): string {
	return `${bold ? '700 ' : '400 '}${size}px ${FONT_STACKS[font]}`;
}

export interface TextBlockOptions {
	text: string;
	fontSize: number;
	font: TextFont;
	bold: boolean;
	color: string;
	opacityPercent: number;
	position: Position9;
	margin: number;
	maxWidthPercent?: number;
	plateColor?: string;
	plateOpacityPercent?: number;
	angleDeg?: number;
}

/** Одна надпись (с автопереносом и опциональной плашкой) поверх изображения. */
export function drawTextBlock(img: PixelImage, o: TextBlockOptions): PixelImage {
	const { canvas, ctx } = ctx2d(img.width, img.height);
	ctx.putImageData(new ImageData(new Uint8ClampedArray(img.data), img.width, img.height), 0, 0);

	ctx.font = fontString(o.fontSize, o.font, o.bold);
	const maxWidth = ((o.maxWidthPercent ?? 90) / 100) * img.width;
	const lines = wrapText(o.text, maxWidth, (s) => ctx.measureText(s).width);
	const lineH = o.fontSize * 1.25;
	const ascent = o.fontSize * 0.8;
	const blockW = Math.min(
		maxWidth,
		lines.reduce((max, s) => Math.max(max, ctx.measureText(s).width), 0)
	);
	const blockH = lines.length * lineH;

	const origin = anchorOrigin(o.position, blockW, blockH, img.width, img.height, o.margin);

	ctx.save();
	ctx.globalAlpha = o.opacityPercent / 100;
	if (o.angleDeg) {
		ctx.translate(origin.x + blockW / 2, origin.y + blockH / 2);
		ctx.rotate((o.angleDeg * Math.PI) / 180);
		ctx.translate(-(origin.x + blockW / 2), -(origin.y + blockH / 2));
	}
	if (o.plateColor && (o.plateOpacityPercent ?? 0) > 0) {
		ctx.globalAlpha = (o.plateOpacityPercent ?? 0) / 100;
		ctx.fillStyle = o.plateColor;
		ctx.fillRect(origin.x, origin.y, blockW, blockH);
		ctx.globalAlpha = o.opacityPercent / 100;
	}
	ctx.fillStyle = o.color;
	ctx.textBaseline = 'alphabetic';
	lines.forEach((line, i) => {
		ctx.fillText(line, origin.x, origin.y + ascent + i * lineH);
	});
	ctx.restore();

	return toPixelImage(canvas);
}

export interface TileTextOptions extends Omit<TextBlockOptions, 'position' | 'margin' | 'angleDeg'> {
	stepX: number;
	stepY: number;
	angleDeg: number;
}

/** Повторяющаяся диагональная плитка текста на весь холст. */
export function drawTextTile(img: PixelImage, o: TileTextOptions): PixelImage {
	const { canvas, ctx } = ctx2d(img.width, img.height);
	ctx.putImageData(new ImageData(new Uint8ClampedArray(img.data), img.width, img.height), 0, 0);

	ctx.font = fontString(o.fontSize, o.font, o.bold);
	const sample = o.text.length > 0 ? o.text : ' ';
	const blockW = ctx.measureText(sample).width;
	const blockH = o.fontSize * 1.4;

	const points = tileGrid(img.width, img.height, o.angleDeg, o.stepX, o.stepY, blockW, blockH);

	ctx.save();
	ctx.translate(img.width / 2, img.height / 2);
	ctx.rotate((o.angleDeg * Math.PI) / 180);
	ctx.globalAlpha = o.opacityPercent / 100;
	ctx.fillStyle = o.color;
	ctx.textBaseline = 'middle';
	for (const p of points) {
		ctx.fillText(sample, p.x - blockW / 2, p.y);
	}
	ctx.restore();

	return toPixelImage(canvas);
}
