import { describe, expect, it } from 'vitest';
import {
	autoContrast,
	brightnessContrast,
	changeHue,
	extractChannel,
	gammaCorrection,
	grayscale,
	invert,
	posterize,
	rgbToHex,
	sepia,
	setOpacity,
	swapChannels,
	temperature,
	tint,
	thresholdBlackWhite,
	twoColors
} from './color';
import { makeImage } from './test-helpers';

describe('rgbToHex', () => {
	it('форматирует базовые цвета', () => {
		expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
		expect(rgbToHex(1, 2, 3)).toBe('#010203');
	});

	it('округляет дробные значения и клампит диапазон', () => {
		expect(rgbToHex(127.6, -5, 300)).toBe('#8000ff');
	});
});

describe('setOpacity', () => {
	it('умножает альфу на процент, RGB не трогает', () => {
		const out = setOpacity(makeImage(1, 1, [[10, 20, 30, 128]]), 50);
		expect([...out.data]).toEqual([10, 20, 30, 64]);
	});

	it('100% не меняет, 0% делает полностью прозрачным', () => {
		expect(setOpacity(makeImage(1, 1, [[1, 2, 3, 200]]), 100).data[3]).toBe(200);
		expect(setOpacity(makeImage(1, 1, [[1, 2, 3, 200]]), 0).data[3]).toBe(0);
	});
});

describe('sepia', () => {
	it('применяет классическую матрицу с клампом', () => {
		const out = sepia(makeImage(2, 1, [
			[255, 0, 0, 255],
			[255, 255, 255, 255]
		]));
		const px = (n: number) => [...out.data.slice(n * 4, n * 4 + 4)];
		expect(px(0)).toEqual([100, 89, 69, 255]);
		expect(px(1)[0]).toBe(255);
		expect(out.data[7]).toBe(255);
	});
});

describe('changeHue', () => {
	it('чистый красный при +120° становится чистым зелёным', () => {
		const out = changeHue(makeImage(1, 1, [[255, 0, 0, 255]]), 120);
		expect([...out.data]).toEqual([0, 255, 0, 255]);
	});

	it('сдвиг 360° возвращает исходные цвета', () => {
		const img = makeImage(1, 1, [[90, 140, 210, 255]]);
		expect([...changeHue(img, 360).data]).toEqual([...img.data]);
	});
});

describe('extractChannel', () => {
	it('выдаёт выбранный канал оттенками серого', () => {
		const out = extractChannel(makeImage(1, 1, [[10, 20, 30, 40]]), 'green');
		expect([...out.data]).toEqual([20, 20, 20, 40]);
	});
});

describe('swapChannels', () => {
	it('переставляет каналы парами', () => {
		expect([...swapChannels(makeImage(1, 1, [[10, 20, 30, 40]]), 'r-b').data]).toEqual([
			30, 20, 10, 40
		]);
		expect([...swapChannels(makeImage(1, 1, [[10, 20, 30, 40]]), 'g-b').data]).toEqual([
			10, 30, 20, 40
		]);
	});
});

describe('thresholdBlackWhite', () => {
	it('серый 128 относительно порога 50% — белый', () => {
		expect(thresholdBlackWhite(makeImage(1, 1, [[128, 128, 128, 255]]), 50).data[0]).toBe(255);
		expect(thresholdBlackWhite(makeImage(1, 1, [[128, 128, 128, 255]]), 60).data[0]).toBe(0);
	});
});

describe('posterize', () => {
	it('два уровня квантуют в чёрное и белое', () => {
		const out = posterize(
			makeImage(2, 1, [
				[100, 100, 100, 255],
				[200, 200, 200, 255]
			]),
			2
		);
		expect(out.data[0]).toBe(0);
		expect(out.data[4]).toBe(255);
	});
});

describe('twoColors', () => {
	it('яркие пиксели получают светлый цвет, тёмные — тёмный', () => {
		const out = twoColors(
			makeImage(2, 1, [
				[250, 250, 250, 255],
				[10, 10, 10, 128]
			]),
			'#ff0000',
			'#00ff00',
			50
		);
		expect([...out.data.slice(0, 4)]).toEqual([255, 0, 0, 255]);
		expect([...out.data.slice(4, 8)]).toEqual([0, 255, 0, 128]);
	});
});

describe('grayscale', () => {
	it('считает luma по весам BT.601 с округлением', () => {
		const out = grayscale(
			makeImage(3, 1, [
				[255, 0, 0, 255],
				[0, 255, 0, 255],
				[0, 0, 255, 255]
			])
		);
		const rgb = [...out.data].reduce<number[]>((acc, v, i) => {
			if (i % 4 === 0) acc.push(v);
			return acc;
		}, []);
		expect(rgb).toEqual([76, 150, 29]);
	});

	it('сохраняет альфу и не мутирует вход', () => {
		const img = makeImage(1, 1, [[10, 20, 30, 200]]);
		const out = grayscale(img);
		expect([...out.data]).toEqual([18, 18, 18, 200]);
		expect([...img.data]).toEqual([10, 20, 30, 200]);
	});
});

describe('invert', () => {
	it('инвертирует RGB, не трогая альфу', () => {
		const out = invert(makeImage(1, 1, [[10, 200, 30, 7]]));
		expect([...out.data]).toEqual([245, 55, 225, 7]);
	});
});

describe('brightnessContrast', () => {
	const pixel = (r: number) => makeImage(1, 1, [[r, r, r, 255]]);
	const red = (out: number[]) => [out[0], out[1], out[2]];

	it('b=0, c=0 — тождественное преобразование', () => {
		const out = brightnessContrast(pixel(77), 0, 0);
		expect(red([...out.data])).toEqual([77, 77, 77]);
	});

	it('brightness +100 насыщает всё в белый', () => {
		const out = brightnessContrast(pixel(10), 100, 0);
		expect(red([...out.data])).toEqual([255, 255, 255]);
	});

	it('brightness -100 заливает чёрным', () => {
		const out = brightnessContrast(pixel(240), -100, 0);
		expect(red([...out.data])).toEqual([0, 0, 0]);
	});

	it('contrast -100 сводит всё к серому 128', () => {
		const out = brightnessContrast(pixel(30), 0, -100);
		expect(red([...out.data])).toEqual([128, 128, 128]);
	});

	it('параметры вне диапазона клампятся', () => {
		const out = brightnessContrast(pixel(10), 150, 0);
		expect(red([...out.data])).toEqual([255, 255, 255]);
	});

	it('альфа не меняется', () => {
		const out = brightnessContrast(makeImage(1, 1, [[10, 20, 30, 64]]), 50, 50);
		expect(out.data[3]).toBe(64);
	});
});

describe('gammaCorrection', () => {
	it('гамма 1 — идентичность', () => {
		const img = makeImage(1, 1, [[64, 128, 192, 255]]);
		expect([...gammaCorrection(img, 1).data]).toEqual([64, 128, 192, 255]);
	});
	it('гамма 2 удваивает яркость (64 → 128)', () => {
		const out = gammaCorrection(makeImage(1, 1, [[64, 64, 64, 255]]), 2);
		expect(out.data[0]).toBe(128);
	});
});

describe('autoContrast', () => {
	it('растягивает диапазон [10..200] до [0..255]', () => {
		const out = autoContrast(makeImage(2, 1, [
			[10, 10, 10, 255],
			[200, 200, 200, 255]
		]));
		expect(out.data[0]).toBe(0);
		expect(out.data[4]).toBe(255);
	});
});

describe('temperature', () => {
	it('положительная — теплее (красный ↑, синий ↓)', () => {
		const out = temperature(makeImage(1, 1, [[128, 128, 128, 255]]), 50);
		expect(out.data[0]).toBeGreaterThan(128);
		expect(out.data[2]).toBeLessThan(128);
	});
	it('нулевая температура не меняет', () => {
		const img = makeImage(1, 1, [[128, 128, 128, 255]]);
		expect([...temperature(img, 0).data]).toEqual([...img.data]);
	});
});

describe('tint', () => {
	it('сила 100 на белом даёт чистый цвет', () => {
		const out = tint(makeImage(1, 1, [[255, 255, 255, 255]]), '#ff0000', 100);
		expect([...out.data]).toEqual([255, 0, 0, 255]);
	});
	it('сила 0 — идентичность', () => {
		const img = makeImage(1, 1, [[100, 150, 200, 255]]);
		expect([...tint(img, '#ff0000', 0).data]).toEqual([...img.data]);
	});
});
