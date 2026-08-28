import { describe, expect, it } from "vitest";
import {
	changeCanvasSize,
	contentBounds,
	cropToRatio,
	forceOrientation,
	padToRatio,
	symmetricCopy,
	trimToContent,
} from "./geometry";
import { makeImage } from "./test-helpers";

const bordered = () => {
	// 4×4: рамка из прозрачных пикселей вокруг красного центра 2×2
	const img = makeImage(4, 4, new Array(16).fill([0, 0, 0, 0]));
	for (let y = 1; y <= 2; y++) {
		for (let x = 1; x <= 2; x++) {
			const di = (y * 4 + x) * 4;
			img.data[di] = 255;
			img.data[di + 3] = 255;
		}
	}
	return img;
};

describe("contentBounds / trimToContent", () => {
	it("границы по порогу альфы", () => {
		expect(contentBounds(bordered(), 0)).toEqual({ x: 1, y: 1, w: 2, h: 2 });
	});

	it("trim обрезает поля и сохраняет содержимое", () => {
		const out = trimToContent(bordered(), 0);
		expect(out.width).toBe(2);
		expect(out.height).toBe(2);
		expect(out.data[0]).toBe(255);
		expect(out.data[3]).toBe(255);
	});

	it("полностью прозрачное изображение → 1×1", () => {
		const empty = makeImage(3, 3, new Array(9).fill([0, 0, 0, 0]));
		const out = trimToContent(empty, 0);
		expect(out.width).toBe(1);
		expect(out.height).toBe(1);
	});
});

describe("changeCanvasSize", () => {
	const img = makeImage(2, 2, [
		[1, 1, 1, 255],
		[2, 2, 2, 255],
		[3, 3, 3, 255],
		[4, 4, 4, 255],
	]);

	it("увеличение с якорем center — прозрачные поля со всех сторон", () => {
		const out = changeCanvasSize(img, 4, 4, "center");
		expect(out.width).toBe(4);
		expect(out.data[3]).toBe(0);
		expect(out.data[(1 * 4 + 1) * 4 + 3]).toBe(255);
	});

	it("увеличение с якорем top-left — контент прижат в угол", () => {
		const out = changeCanvasSize(img, 4, 4, "top-left");
		expect(out.data[3]).toBe(255);
		expect(out.data[(3 * 4 + 3) * 4 + 3]).toBe(0);
	});

	it("уменьшение обрезает как кроп от якоря bottom-right", () => {
		const out = changeCanvasSize(img, 1, 1, "bottom-right");
		expect(out.data[0]).toBe(4);
	});
});

describe("соотношение сторон", () => {
	const wide = makeImage(400, 200, new Array(80000).fill([9, 9, 9, 255]));

	it("cropToRatio 1:1 из 2:1 → квадрат по высоте", () => {
		const out = cropToRatio(wide, 1);
		expect(out.width).toBe(200);
		expect(out.height).toBe(200);
	});

	it("padToRatio 1:1 из 2:1 → квадрат с прозрачными полями", () => {
		const out = padToRatio(wide, 1);
		expect(out.width).toBe(400);
		expect(out.height).toBe(400);
		expect(out.data[3]).toBe(0);
		expect(out.data[(200 * 400 + 100) * 4 + 3]).toBe(255);
	});
});

describe("forceOrientation / symmetricCopy", () => {
	it("широкое становится высоким поворотом", () => {
		const wide = makeImage(300, 100, new Array(30000).fill([5, 5, 5, 255]));
		const out = forceOrientation(wide, "portrait");
		expect(out.width).toBe(100);
		expect(out.height).toBe(300);
	});

	it("квадрат не поворачивается", () => {
		const sq = makeImage(50, 50, new Array(2500).fill([5, 5, 5, 255]));
		const out = forceOrientation(sq, "portrait");
		expect(out.width).toBe(50);
		expect(out.height).toBe(50);
	});

	it("симметричная копия удваивает ширину и зеркалит правую половину", () => {
		const img = makeImage(2, 1, [
			[10, 0, 0, 255],
			[20, 0, 0, 255],
		]);
		const out = symmetricCopy(img, "vertical", "left");
		expect(out.width).toBe(4);
		expect(out.data[0]).toBe(10);
		expect(out.data[8]).toBe(20); // пиксель 2 = зеркало начала
		expect(out.data[12]).toBe(10); // пиксель 3 = зеркало конца
	});

	it("вертикальная ось удваивает высоту", () => {
		const img = makeImage(1, 2, [
			[10, 0, 0, 255],
			[30, 0, 0, 255],
		]);
		const out = symmetricCopy(img, "horizontal", "top");
		expect(out.height).toBe(4);
		expect(out.data[(2 * 1 + 0) * 4]).toBe(30); // строка 2 = зеркало строки 1
		expect(out.data[(3 * 1 + 0) * 4]).toBe(10); // строка 3 = зеркало строки 0
	});
});
