import { describe, expect, it } from "vitest";
import { PREVIEW_GROUPS } from "../preview/catalog";
import { TOOLS } from "../registry-new";
import { defaultSchemaParams, sanitizeSchemaParams } from "../registry-schema";

describe("registry-new (переведённые инструменты)", () => {
	it("id уникальны", () => {
		const ids = TOOLS.map((t) => t.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it("PREVIEW_GROUPS строится без ошибок", () => {
		expect(PREVIEW_GROUPS.length).toBeGreaterThan(0);
		expect(PREVIEW_GROUPS.reduce((n, g) => n + g.tools.length, 0)).toBe(
			TOOLS.length,
		);
	});

	it("дефолты схем дают валидные параметры (включая dimension)", () => {
		for (const tool of TOOLS) {
			const defaults = defaultSchemaParams(tool.schema);
			const sanitized = sanitizeSchemaParams(tool.schema, defaults);
			expect(Object.keys(sanitized).sort()).toEqual(
				Object.keys(defaults).sort(),
			);
		}
	});

	it("create-empty: dimension-дефолты корректны", () => {
		const tool = TOOLS.find((t) => t.id === "create-empty-png")!;
		const d = defaultSchemaParams(tool.schema);
		expect(d.size).toEqual({ width: 800, height: 600 });
		expect(d.transparent).toBe(true);
	});

	it("sanitize клампит dimension к min/max и чинит мусор", () => {
		const tool = TOOLS.find((t) => t.id === "create-empty-png")!;
		const s = sanitizeSchemaParams(tool.schema, {
			size: { width: 999999, height: -5 },
			transparent: false,
			color: "#ff0000",
		});
		expect(s.size).toEqual({ width: 20000, height: 1 });
		const bad = sanitizeSchemaParams(tool.schema, {});
		expect(bad.size).toEqual({ width: 800, height: 600 });
	});

	it("executeGenerate для create-empty даёт картинку нужного размера", async () => {
		const tool = TOOLS.find((t) => t.id === "create-empty-png")!;
		const params = sanitizeSchemaParams(tool.schema, {
			size: { width: 320, height: 200 },
			transparent: true,
			color: "#ff0000",
		});
		const img = await tool.generate!(params);
		expect(img.width).toBe(320);
		expect(img.height).toBe(200);
		expect(img.data[3]).toBe(0);
	});

	it.each([
		["single-color-png", { size: { width: 40, height: 30 }, color: "#00ff00" }],
		["random-noise-png", { size: { width: 40, height: 30 }, seed: 5 }],
		[
			"linear-gradient-png",
			{
				size: { width: 40, height: 30 },
				pair: { from: "#000000", to: "#ffffff" },
				direction: "horizontal",
			},
		],
		[
			"color-spectrum-png",
			{
				size: { width: 40, height: 30 },
				direction: "horizontal",
				saturation: 100,
				lightness: 50,
			},
		],
		[
			"random-colors-png",
			{ size: { width: 40, height: 30 }, blockSize: 16, seed: 7 },
		],
		[
			"draw-grid-png",
			{
				size: { width: 40, height: 30 },
				cols: 4,
				rows: 3,
				lineWidth: 2,
				color: "#000000",
				transparentBg: true,
			},
		],
	])("генератор %s даёт картинку по dimension", async (id, params) => {
		const tool = TOOLS.find((t) => t.id === id)!;
		expect(tool.generate).toBeDefined();
		const sanitized = sanitizeSchemaParams(tool.schema, params);
		const img = await tool.generate!(sanitized);
		expect(img.width).toBe(40);
		expect(img.height).toBe(30);
	});

	it("random-noisе детерминирован по seed", async () => {
		const tool = TOOLS.find((t) => t.id === "random-noise-png")!;
		const a = await tool.generate!(
			sanitizeSchemaParams(tool.schema, {
				size: { width: 32, height: 32 },
				seed: 1,
			}),
		);
		const b = await tool.generate!(
			sanitizeSchemaParams(tool.schema, {
				size: { width: 32, height: 32 },
				seed: 1,
			}),
		);
		expect(a.data).toEqual(b.data);
	});

	it("resize: keepAspect с одной стороной сохраняет пропорции", async () => {
		const tool = TOOLS.find((t) => t.id === "resize-png")!;
		const img = solid(100, 50);
		const out = await tool.run!(
			img,
			sanitizeSchemaParams(tool.schema, {
				size: { width: 200, height: 0 },
				keepAspect: true,
			}),
		);
		expect(out.width).toBe(200);
		expect(out.height).toBe(100);
	});

	it("crop вырезает область по x/y", async () => {
		const tool = TOOLS.find((t) => t.id === "crop-png")!;
		const img = solid(100, 100);
		const out = await tool.run!(
			img,
			sanitizeSchemaParams(tool.schema, {
				x: 10,
				y: 20,
				size: { width: 30, height: 40 },
			}),
		);
		expect(out.width).toBe(30);
		expect(out.height).toBe(40);
	});

	it("fit-on-background центрирует картинку на канвасе", async () => {
		const tool = TOOLS.find((t) => t.id === "fit-on-background-png")!;
		const img = solid(20, 10);
		const out = await tool.run!(
			img,
			sanitizeSchemaParams(tool.schema, {
				size: { width: 60, height: 30 },
				transparent: true,
				color: "#ffffff",
			}),
		);
		expect(out.width).toBe(60);
		expect(out.height).toBe(30);
		expect(out.data[3]).toBe(0);
	});

	it("change-canvas-size использует anchor для позиции", async () => {
		const tool = TOOLS.find((t) => t.id === "change-canvas-size-png")!;
		const img = solid(10, 10);
		const out = await tool.run!(
			img,
			sanitizeSchemaParams(tool.schema, {
				size: { width: 20, height: 20 },
				anchor: "top-left",
			}),
		);
		expect(out.width).toBe(20);
		expect(out.height).toBe(20);
		const topLeft = out.data[3];
		const center = out.data[(10 * out.width + 10) * 4 + 3];
		expect(topLeft).toBe(255);
		expect(center).toBe(0);
	});

	it("blend-two: дефолты пары и работа генератора", async () => {
		const tool = TOOLS.find((t) => t.id === "blend-two-png")!;
		const d = defaultSchemaParams(tool.schema);
		expect(d.pair).toEqual({ from: "#000000", to: "#ffffff" });
		const img = await tool.generate!(
			sanitizeSchemaParams(tool.schema, {
				pair: { from: "#ff0000", to: "#0000ff" },
				width: 128,
			}),
		);
		expect(img.width).toBe(128);
	});

	it("step-colors: рендерит steps полос по паре", async () => {
		const tool = TOOLS.find((t) => t.id === "step-colors-png")!;
		const img = await tool.generate!(
			sanitizeSchemaParams(tool.schema, {
				pair: { from: "#000000", to: "#ffffff" },
				steps: 4,
				width: 128,
				layout: "strip",
			}),
		);
		expect(img.width).toBe(128);
	});

	it("two-colors: перекрашивает светлые/тёмные пиксели по паре", async () => {
		const tool = TOOLS.find((t) => t.id === "two-colors-png")!;
		// 50×1, левая половина тёмная, правая светлая
		const data = new Uint8ClampedArray(50 * 4).fill(255);
		const img = { width: 50, height: 1, data };
		for (let x = 0; x < 25; x++) {
			const i = x * 4;
			data[i] = 0;
			data[i + 1] = 0;
			data[i + 2] = 0;
		}
		const out = await tool.run!(
			img,
			sanitizeSchemaParams(tool.schema, {
				pair: { from: "#ffffff", to: "#ff0000" },
				threshold: 50,
			}),
		);
		// Светлый пиксель → from (#ffffff), тёмный → to (#ff0000)
		expect(out.data[0]).toBe(255);
		expect(out.data[1]).toBe(0);
		expect(out.data[2]).toBe(0);
		expect(out.data[100]).toBe(255);
		expect(out.data[101]).toBe(255);
		expect(out.data[102]).toBe(255);
	});

	it("sanitize чинит мусор в паре и клампит threshold", () => {
		const tool = TOOLS.find((t) => t.id === "two-colors-png")!;
		const s = sanitizeSchemaParams(tool.schema, {
			pair: { from: "not-a-color", to: "#00ff00", extra: 1 },
			threshold: 999,
		});
		expect(s.pair).toEqual({ from: "#ffffff", to: "#00ff00" });
		expect(s.threshold).toBe(100);
	});

	it("circle-mask: срезает углы и сохраняет центр", async () => {
		const tool = TOOLS.find((t) => t.id === "circle-mask-png")!;
		const img = await tool.run!(
			solid(100, 100),
			sanitizeSchemaParams(tool.schema, {
				size: 100,
				offset: { x: 0, y: 0 },
			}),
		);
		// Внешний угол (0,0) — вне круга радиуса 50 → прозрачен
		expect(img.data[3]).toBe(0);
		// Центр (50,50) — внутри
		expect(img.data[(50 * img.width + 50) * 4 + 3]).toBe(255);
	});

	it("circle-mask: offset сдвигает фигуру", async () => {
		const tool = TOOLS.find((t) => t.id === "circle-mask-png")!;
		const img = await tool.run!(
			solid(100, 100),
			sanitizeSchemaParams(tool.schema, {
				size: 50,
				offset: { x: 50, y: 0 },
			}),
		);
		// Радиус 25, центр смещён к x=100; пиксель (75,50) внутри, (49,50) снаружи
		expect(img.data[(50 * img.width + 75) * 4 + 3]).toBe(255);
		expect(img.data[(50 * img.width + 49) * 4 + 3]).toBe(0);
	});

	it("star-mask: сохраняет центр, режет углы", async () => {
		const tool = TOOLS.find((t) => t.id === "star-mask-png")!;
		const img = await tool.run!(
			solid(100, 100),
			sanitizeSchemaParams(tool.schema, {
				points: 5,
				innerRadius: 45,
				size: 100,
				rotation: 0,
				offset: { x: 0, y: 0 },
			}),
		);
		expect(img.data[(50 * img.width + 50) * 4 + 3]).toBe(255);
		expect(img.data[3]).toBe(0);
	});

	it("sanitize клампит offset к min/max и чинит мусор", () => {
		const tool = TOOLS.find((t) => t.id === "wavy-mask-png")!;
		const s = sanitizeSchemaParams(tool.schema, {
			size: 90,
			amplitude: 8,
			waves: 8,
			phase: 0,
			offset: { x: 999, y: "abc", extra: true } as unknown as Record<
				string,
				unknown
			>,
		});
		expect(s.offset).toEqual({ x: 50, y: 0 });
	});

	it("add-text: дефолты position9 и текстовых полей", () => {
		const tool = TOOLS.find((t) => t.id === "add-text-png")!;
		const d = defaultSchemaParams(tool.schema);
		expect(d.position).toBe("bottom-right");
		expect(d.text).toBe("Hello!");
		expect(d.plate).toBe(false);
	});

	it("sanitize чинит мусор в position9 и оставляет валидные значения", () => {
		const tool = TOOLS.find((t) => t.id === "date-stamp-png")!;
		const s = sanitizeSchemaParams(tool.schema, {
			format: "YYYY-MM-DD",
			fontSize: 32,
			color: "#ffffff",
			font: "mono",
			bold: "no" as unknown as boolean,
			position: "somewhere-outside",
			margin: 20,
			plate: true,
			plateColor: "#000000",
			plateOpacity: 55,
		});
		expect(s.position).toBe("bottom-right");
		expect(s.bold).toBe(false);
		const valid = sanitizeSchemaParams(tool.schema, {
			...defaultSchemaParams(tool.schema),
			position: "top-center",
		});
		expect(valid.position).toBe("top-center");
	});
});

function solid(width: number, height: number) {
	const data = new Uint8ClampedArray(width * height * 4).fill(255);
	return { width, height, data };
}
