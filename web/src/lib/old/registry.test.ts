import { describe, expect, it } from "vitest";
import { CATEGORIES } from "./categories";
import { TOOL_ICONS } from "./tools/tool-icons";
import {
	defaultParams,
	getTool,
	outputOf,
	sanitizeParams,
	TOOLS,
	type ParamDef,
	type ToolEntry,
} from "./registry";

describe("реестр инструментов", () => {
	it("id уникальны и в kebab-case", () => {
		const ids = TOOLS.map((t) => t.id);
		expect(new Set(ids).size).toBe(ids.length);
		for (const id of ids) {
			expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
		}
	});

	it.each(TOOLS.map((t) => [t.id, t] as const))(
		"%s: категория валидна",
		(_, tool) => {
			expect(CATEGORIES).toContain(tool.category);
		},
	);

	it.each(TOOLS.map((t) => [t.id, t] as const))(
		"%s: исполнители определены",
		(_, tool) => {
			if (tool.resultType === "text") {
				expect(
					typeof tool.toText === "function" ||
						typeof tool.textToText === "function",
				).toBe(true);
			} else if (tool.sourceMode === "none") {
				expect(typeof tool.generate).toBe("function");
			} else {
				expect(typeof tool.run).toBe("function");
			}
			if (tool.preview) {
				expect(typeof tool.preview).toBe("function");
			}
			expect(tool.title.length).toBeGreaterThan(0);
			expect(tool.description.length).toBeGreaterThan(0);
		},
	);

	it("у select дефолт входит в options, у number/slider дефолт в диапазоне", () => {
		for (const tool of TOOLS) {
			for (const param of tool.params) {
				if (param.type === "select") {
					expect(param.options.map((o) => o.value)).toContain(param.default);
					expect(param.options.length).toBeGreaterThan(0);
				}
				if (param.type === "number") {
					expect(param.min === undefined || param.default >= param.min).toBe(
						true,
					);
					expect(param.max === undefined || param.default <= param.max).toBe(
						true,
					);
				}
				if (param.type === "slider") {
					expect(param.min).toBeLessThan(param.max);
					expect(param.default).toBeGreaterThanOrEqual(param.min);
					expect(param.default).toBeLessThanOrEqual(param.max);
				}
				if (param.type === "color") {
					expect(param.default).toMatch(/^#[0-9a-f]{6}$/i);
				}
			}
		}
	});

	it("id параметров уникальны внутри инструмента", () => {
		for (const tool of TOOLS) {
			const ids = tool.params.map((p) => p.id);
			expect(new Set(ids).size).toBe(ids.length);
		}
	});

	it("qualityParamId ссылается на существующий числовой параметр", () => {
		for (const tool of TOOLS) {
			const output = outputOf(tool);
			if (output?.qualityParamId) {
				const param = tool.params.find(
					(p): p is Extract<ParamDef, { type: "number" | "slider" }> =>
						p.id === output.qualityParamId,
				);
				expect(param).toBeDefined();
			}
		}
	});

	it("png-info не имеет формата вывода, конвертеры имеют jpeg/webp, остальные — png", () => {
		expect(outputOf(getToolOrThrow("png-info"))).toBeUndefined();
		expect(outputOf(getToolOrThrow("convert-png-to-jpg"))?.mime).toBe(
			"image/jpeg",
		);
		expect(outputOf(getToolOrThrow("convert-png-to-webp"))?.mime).toBe(
			"image/webp",
		);
		expect(outputOf(getToolOrThrow("grayscale-png"))).toEqual({
			mime: "image/png",
			ext: "png",
		});
	});

	it("defaultParams собирает значения по умолчанию", () => {
		const resize = getToolOrThrow("resize-png");
		expect(defaultParams(resize)).toEqual({
			width: 0,
			height: 0,
			keepAspect: true,
		});
	});

	it("словарь иконок покрывает все инструменты", () => {
		for (const tool of TOOLS) {
			expect(TOOL_ICONS[tool.id]).toBeDefined();
		}
	});

	it("у каждого инструмента популярность в диапазоне 0..100 и ключ иконки", () => {
		for (const tool of TOOLS) {
			expect(tool.popularity).toBeGreaterThanOrEqual(0);
			expect(tool.popularity).toBeLessThanOrEqual(100);
			expect(typeof tool.icon).toBe("string");
			expect(tool.icon!.length).toBeGreaterThan(0);
		}
	});
});

describe("sanitizeParams", () => {
	it("заменяет пустые и невалидные числа на дефолт", () => {
		const resize = getToolOrThrow("resize-png");
		expect(
			sanitizeParams(resize, {
				width: undefined,
				height: null,
				keepAspect: true,
			}),
		).toEqual({
			width: 0,
			height: 0,
			keepAspect: true,
		});
	});

	it("клампит числа в диапазон параметра", () => {
		const bc = getToolOrThrow("adjust-brightness-contrast-png");
		expect(sanitizeParams(bc, { brightness: 5000, contrast: -999 })).toEqual({
			brightness: 100,
			contrast: -100,
		});
	});

	it("возвращает дефолт для невалидных select, checkbox и color", () => {
		const rotate = getToolOrThrow("rotate-png");
		expect(sanitizeParams(rotate, { angle: "45" })).toEqual({ angle: "90" });
		const resize = getToolOrThrow("resize-png");
		expect(
			sanitizeParams(resize, { width: 10, height: 10, keepAspect: "yes" }),
		).toEqual({
			width: 10,
			height: 10,
			keepAspect: true,
		});
		const jpg = getToolOrThrow("convert-png-to-jpg");
		expect(sanitizeParams(jpg, { background: "red", quality: 50 })).toEqual({
			background: "#ffffff",
			quality: 50,
		});
	});
});

describe("run инструмента resize-png", () => {
	const img = {
		width: 100,
		height: 50,
		data: new Uint8ClampedArray(100 * 50 * 4),
	};
	const runResize = async (params: Record<string, unknown>) =>
		getToolOrThrow("resize-png").run!(img, params);

	it("keepAspect + одна сторона — вторая считается по пропорции", async () => {
		const out = await runResize({ width: 200, height: 0, keepAspect: true });
		expect(out.width).toBe(200);
		expect(out.height).toBe(100);
	});

	it("keepAspect + обе стороны — вписывание в размеры без искажения", async () => {
		const out = await runResize({ width: 50, height: 50, keepAspect: true });
		expect(out.width).toBe(50);
		expect(out.height).toBe(25);
	});

	it("без keepAspect — обе стороны как задано", async () => {
		const out = await runResize({ width: 30, height: 40, keepAspect: false });
		expect(out.width).toBe(30);
		expect(out.height).toBe(40);
	});

	it("обе стороны 0 — человекочитаемая ошибка", async () => {
		await expect(
			runResize({ width: 0, height: 0, keepAspect: true }),
		).rejects.toThrow("errors.resizeSize");
	});
});

function getToolOrThrow(id: string): ToolEntry {
	const tool = getTool(id);
	if (!tool) throw new Error(`Инструмент "${id}" не найден`);
	return tool;
}
