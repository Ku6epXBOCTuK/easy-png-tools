import { describe, expect, it } from 'vitest';
import {
	buildAlphaMask,
	closingImage,
	contourImage,
	dilateImage,
	dilateMask,
	erodeImage,
	erodeMask,
	openingImage,
	strokeImage
} from './morphology';
import { makeImage } from './test-helpers';

function maskFrom(rows: string[]): Uint8Array {
	const flat = rows.join('');
	const mask = new Uint8Array(flat.length);
	for (let i = 0; i < flat.length; i++) {
		mask[i] = flat[i] === '#' ? 1 : 0;
	}
	return mask;
}

function toRows(mask: Uint8Array, w: number): string[] {
	const rows: string[] = [];
	for (let y = 0; y < mask.length / w; y++) {
		let row = '';
		for (let x = 0; x < w; x++) {
			row += mask[y * w + x] === 1 ? '#' : '.';
		}
		rows.push(row);
	}
	return rows;
}

describe('dilateMask', () => {
	it('одиночный пиксель r=1 превращается в плюс', () => {
		const out = dilateMask(
			maskFrom(['.....', '.....', '..#..', '.....', '.....']),
			5,
			5,
			1
		);
		expect(toRows(out, 5)).toEqual(['.....', '..#..', '.###.', '..#..', '.....']);
	});

	it('r=2 даёт ромб радиуса 2', () => {
		const out = dilateMask(
			maskFrom(['.....', '.....', '..#..', '.....', '.....']),
			5,
			5,
			2
		);
		expect(toRows(out, 5)).toEqual(['..#..', '.###.', '#####', '.###.', '..#..']);
	});
});

describe('erodeMask', () => {
	it('сплошной объект во весь кадр не сжимается от границ', () => {
		const solid = maskFrom(['#####', '#####', '#####', '#####', '#####']);
		expect([...erodeMask(solid, 5, 5, 1)]).toEqual([...solid]);
	});

	it('изолированный пиксель исчезает', () => {
		const out = erodeMask(
			maskFrom(['.....', '.....', '..#..', '.....', '.....']),
			5,
			5,
			1
		);
		expect([...out].every((v) => v === 0)).toBe(true);
	});
});

describe('opening/closing образы', () => {
	it('opening убирает отстоящий мусорный пиксель и сохраняет блок', () => {
		const B = [10, 10, 10, 255];
		const T = [0, 0, 0, 0];
		const S = [200, 200, 200, 255];
		const out = openingImage(
			makeImage(
				6,
				3,
				[B, B, B, T, S, T, B, B, B, T, T, T, B, B, B, T, T, T]
			),
			1
		);
		const at = (x: number, y: number) => out.data[(y * 6 + x) * 4 + 3];
		expect(at(0, 1)).toBe(255);
		expect(at(2, 1)).toBe(255);
		expect(at(4, 1)).toBe(0);
	});

	it('closing заполняет одиночную прозрачную дыру чёрным', () => {
		const pixels: number[][] = [];
		for (let y = 0; y < 3; y++) {
			for (let x = 0; x < 3; x++) {
				pixels.push(x === 1 && y === 1 ? [0, 0, 0, 0] : [255, 255, 255, 255]);
			}
		}
		const out = closingImage(makeImage(3, 3, pixels), 1);
		const di = (1 * 3 + 1) * 4;
		expect(out.data[di + 3]).toBe(255);
	});
});

describe('image-обёртки', () => {
	it('dilateImage сохраняет RGB содержимого, новые пиксели непрозрачны', () => {
		const T = [0, 0, 0, 0];
		const O = [200, 50, 25, 255];
		const img = makeImage(5, 2, [T, O, T, T, T, T, T, T, T, T]);
		const out = dilateImage(img, 1);
		const at = (x: number, y: number) => {
			const di = (y * 5 + x) * 4;
			return [out.data[di], out.data[di + 1], out.data[di + 2], out.data[di + 3]];
		};
		expect(at(1, 0)).toEqual([200, 50, 25, 255]);
		expect(at(0, 0)).toEqual([0, 0, 0, 255]);
		expect(at(4, 0)[3]).toBe(0);
	});

	it('erodeImage не стирает объект у края кадра', () => {
		const img = makeImage(2, 2, [
			[10, 20, 30, 255],
			[10, 20, 30, 255],
			[10, 20, 30, 255],
			[10, 20, 30, 255]
		]);
		const out = erodeImage(img, 1);
		for (let i = 0; i < out.data.length; i += 4) {
			expect(out.data[i + 3]).toBe(255);
		}
	});
});

describe('strokeImage', () => {
	it('кольцо цвета обводки вокруг квадрата', () => {
		const pixels: number[][] = [];
		for (let y = 0; y < 7; y++) {
			for (let x = 0; x < 7; x++) {
				pixels.push(x >= 2 && x <= 4 && y >= 2 && y <= 4 ? [255, 0, 0, 255] : [0, 0, 0, 0]);
			}
		}
		const out = strokeImage(makeImage(7, 7, pixels), 1, '#0000ff');
		const at = (x: number, y: number) =>
			[...out.data.slice((y * 7 + x) * 4, (y * 7 + x) * 4 + 4)];
		expect(at(2, 3)).toEqual([255, 0, 0, 255]);
		expect(at(1, 3)).toEqual([0, 0, 255, 255]);
		expect(at(0, 0)).toEqual([0, 0, 0, 0]);
	});
});

describe('contourImage', () => {
	it('линия по краю квадрата, центр прозрачен', () => {
		const pixels: number[][] = [];
		for (let y = 0; y < 7; y++) {
			for (let x = 0; x < 7; x++) {
				pixels.push(x >= 2 && x <= 4 && y >= 2 && y <= 4 ? [255, 0, 0, 255] : [0, 0, 0, 0]);
			}
		}
		const out = contourImage(makeImage(7, 7, pixels), 1, '#0000ff');
		const at = (x: number, y: number) =>
			[...out.data.slice((y * 7 + x) * 4, (y * 7 + x) * 4 + 4)];
		expect(at(2, 2)).toEqual([0, 0, 255, 255]);
		expect(at(3, 3)).toEqual([0, 0, 0, 0]);
		expect(at(1, 3)).toEqual([0, 0, 0, 0]);
	});
});
