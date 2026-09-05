import { describe, expect, it } from "vitest";
import { TOOLS } from "../registry-new";
import { PREVIEW_GROUPS } from "../preview/catalog";
import { defaultSchemaParams, sanitizeSchemaParams } from "../registry-schema";

describe("registry-new (переведённые инструменты)", () => {
	it("id уникальны", () => {
		const ids = TOOLS.map((t) => t.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it("PREVIEW_GROUPS строится без ошибок", () => {
		expect(PREVIEW_GROUPS.length).toBeGreaterThan(0);
		expect(PREVIEW_GROUPS.reduce((n, g) => n + g.tools.length, 0)).toBe(TOOLS.length);
	});

	it("дефолты схем дают валидные параметры (включая dimension)", () => {
		for (const tool of TOOLS) {
			const defaults = defaultSchemaParams(tool.schema);
			const sanitized = sanitizeSchemaParams(tool.schema, defaults);
			expect(Object.keys(sanitized).sort()).toEqual(Object.keys(defaults).sort());
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
});
