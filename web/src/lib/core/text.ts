import type { PixelImage } from './types';

export function pixelsToHex(img: PixelImage): string {
	const rows: string[] = [];
	for (let y = 0; y < img.height; y++) {
		const parts: string[] = [];
		for (let x = 0; x < img.width; x++) {
			const i = (y * img.width + x) * 4;
			parts.push(byteHex(img.data[i]) + byteHex(img.data[i + 1]) + byteHex(img.data[i + 2]) + byteHex(img.data[i + 3]));
		}
		rows.push(parts.join(' '));
	}
	return rows.join('\n');
}

export function hexToPixels(text: string, width: number): PixelImage {
	if (!Number.isInteger(width) || width < 1) {
		throw new Error('Укажите ширину изображения (целое число >= 1)');
	}
	const tokens = text.trim().split(/\s+/).filter((t) => t.length > 0);
	if (tokens.length === 0) {
		throw new Error('Вставьте hex-данные пикселей');
	}
	if (tokens.some((t) => !/^[0-9a-fA-F]{8}$/.test(t))) {
		throw new Error('Каждый пиксель должен быть 8 hex-символов RRGGBBAA, разделённых пробелами');
	}
	const height = tokens.length / width;
	if (!Number.isInteger(height)) {
		throw new Error(
			`Число пикселей (${tokens.length}) не делится на ширину ${width} без остатка`
		);
	}
	const data = new Uint8ClampedArray(tokens.length * 4);
	tokens.forEach((token, index) => {
		data[index * 4] = parseInt(token.slice(0, 2), 16);
		data[index * 4 + 1] = parseInt(token.slice(2, 4), 16);
		data[index * 4 + 2] = parseInt(token.slice(4, 6), 16);
		data[index * 4 + 3] = parseInt(token.slice(6, 8), 16);
	});
	return { width, height, data };
}

function byteHex(value: number): string {
	return value.toString(16).padStart(2, '0');
}
