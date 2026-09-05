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
				fromColor: "#000000",
				toColor: "#ffffff",
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
});

function solid(width: number, height: number) {
	const data = new Uint8ClampedArray(width * height * 4).fill(255);
	return { width, height, data };
}
