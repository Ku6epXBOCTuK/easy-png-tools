import { encodeBmpBytes } from './bmp';
import { type PixelImage } from './types';

export type OutputMime = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/bmp';

export const ACCEPTED_IMAGE_TYPES =
	'image/png,image/jpeg,image/webp,image/gif,image/bmp,image/x-icon';

const SUPPORTED_MIME_TYPES = new Set(ACCEPTED_IMAGE_TYPES.split(','));

export function isSupportedImage(file: File): boolean {
	return SUPPORTED_MIME_TYPES.has(file.type);
}

export function unsupportedImageMessage(file: File): string {
	return `Неподдерживаемый формат файла (${file.type || 'неизвестный'}). Поддерживаются PNG, JPEG, WebP, GIF и BMP.`;
}

export async function decodeFile(file: File): Promise<PixelImage> {
	const bitmap = await createImageBitmap(file);
	try {
		const canvas = document.createElement('canvas');
		canvas.width = bitmap.width;
		canvas.height = bitmap.height;
		const ctx = canvas.getContext('2d', { willReadFrequently: true });
		if (!ctx) {
			throw new Error('Canvas 2D context недоступен в этом браузере');
		}
		ctx.drawImage(bitmap, 0, 0);
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		return { width: imageData.width, height: imageData.height, data: imageData.data };
	} finally {
		bitmap.close();
	}
}

export async function encode(
	img: PixelImage,
	mime: OutputMime = 'image/png',
	quality?: number
): Promise<Blob> {
	if (mime === 'image/bmp') {
		return new Blob([encodeBmpBytes(img)], { type: mime });
	}
	if (mime === 'image/jpeg' || mime === 'image/webp') {
		if (quality !== undefined && (quality < 0 || quality > 1)) {
			throw new RangeError('quality должен быть в диапазоне 0..1');
		}
	}
	const canvas = document.createElement('canvas');
	canvas.width = img.width;
	canvas.height = img.height;
	const ctx = canvas.getContext('2d');
	if (!ctx) {
		throw new Error('Canvas 2D context недоступен в этом браузере');
	}
	ctx.putImageData(new ImageData(img.data, img.width, img.height), 0, 0);
	return await canvasToBlob(canvas, mime, quality);
}

function canvasToBlob(canvas: HTMLCanvasElement, mime: OutputMime, quality?: number): Promise<Blob> {
	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) => (blob ? resolve(blob) : reject(new Error(`Браузер не поддерживает кодирование в ${mime}`))),
			mime,
			quality
		);
	});
}

export function downloadBlob(blob: Blob, filename: string): void {
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	document.body.append(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}

export function replaceExtension(filename: string, ext: string): string {
	const base = filename.replace(/\.[^./\\]+$/, '');
	return `${base}.${ext}`;
}
