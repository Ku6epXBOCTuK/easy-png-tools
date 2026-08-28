import { describe, expect, it } from "vitest";
import { anchorOrigin, tileGrid, wrapText } from "./textdraw";

const measure = (s: string) => s.length * 10;

describe("anchorOrigin", () => {
	it("углы и отступ считаются от краёв", () => {
		expect(anchorOrigin("top-left", 100, 50, 400, 300, 30)).toEqual({
			x: 30,
			y: 30,
		});
		expect(anchorOrigin("top-right", 100, 50, 400, 300, 30)).toEqual({
			x: 270,
			y: 30,
		});
		expect(anchorOrigin("bottom-left", 100, 50, 400, 300, 30)).toEqual({
			x: 30,
			y: 220,
		});
		expect(anchorOrigin("bottom-right", 100, 50, 400, 300, 30)).toEqual({
			x: 270,
			y: 220,
		});
	});

	it("центрирование — ровно половина остатка", () => {
		expect(anchorOrigin("center", 100, 50, 401, 301, 0)).toEqual({
			x: 150.5,
			y: 125.5,
		});
		expect(anchorOrigin("middle-left", 100, 50, 400, 300, 12)).toEqual({
			x: 12,
			y: 125,
		});
		expect(anchorOrigin("top-center", 100, 50, 400, 300, 8)).toEqual({
			x: 150,
			y: 8,
		});
	});
});

describe("wrapText", () => {
	it("жадно набирает строки в пределах ширины", () => {
		// measure: 10px за символ → строка ≤ 120px = 12 символов
		expect(wrapText("один два три четыре пять", 120, measure)).toEqual([
			"один два три",
			"четыре пять",
		]);
	});

	it("слово длиннее ширины уходит на отдельную строку целиком", () => {
		expect(
			wrapText("короткое сверхдлинноеслово без переносов", 90, measure),
		).toEqual(["короткое", "сверхдлинноеслово", "без", "переносов"]);
	});

	it("пустой и пробельный текст дают пустой массив", () => {
		expect(wrapText("", 100, measure)).toEqual([]);
		expect(wrapText("   \n\t ", 100, measure)).toEqual([]);
	});
});

describe("tileGrid", () => {
	it("стабильная сетка с шагом и центрированием", () => {
		const pts = tileGrid(200, 200, 0, 60, 60, 80, 24);
		expect(pts.length).toBeGreaterThan(0);
		const xs = new Set(pts.map((p) => p.x));
		const ys = new Set(pts.map((p) => p.y));
		expect(xs.size).toBeGreaterThan(1);
		expect(ys.size).toBeGreaterThan(1);
	});

	it("кап защищает от гигантского количества плиток", () => {
		const pts = tileGrid(4000, 4000, 45, 8, 8, 100, 40);
		expect(pts.length).toBeLessThanOrEqual(2500);
		expect(pts.length).toBeGreaterThan(0);
	});

	it("обычные входные данные не триггерят кап", () => {
		const pts = tileGrid(800, 600, 30, 140, 90, 160, 40);
		expect(pts.length).toBeLessThanOrEqual(2500);
		expect(pts.length).toBeGreaterThan(4);
	});
});
