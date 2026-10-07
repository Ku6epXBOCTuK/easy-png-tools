import { describe, expect, it } from "vitest";
import { PAGES, TOOLS } from ".";
import { PREVIEW_GROUPS } from "../catalog";
import type { PixelImage } from "../core/types";
import type { OutputMime } from "../core/io";
import { defaultSchemaParams, sanitizeSchemaParams } from "../registry-schema";
import type { FileResult, ToolResult } from "./types";

function asImage(result: ToolResult): PixelImage {
	if (typeof result === "string" || "files" in result || "key" in result) {
		throw new Error("expected an image result");
	}
	return result;
}

describe("registry-new (переведённые инструменты)", () => {
	it("id инструментов уникальны", () => {
		const ids = TOOLS.map((t) => t.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it("slug страниц уникальны", () => {
		const slugs = PAGES.map((page) => page.slug);
		expect(new Set(slugs).size).toBe(slugs.length);
	});

	it("id и slug пригодны для адреса и для кода", () => {
		// Тот же формат, что разбирает `tools-map-doc.test.ts`: латиница в
		// нижнем регистре, слова через дефис.
		const shape = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
		for (const tool of TOOLS) {
			expect(shape.test(tool.id), `id: ${tool.id}`).toBe(true);
		}
		for (const page of PAGES) {
			expect(shape.test(page.slug), `slug: ${page.slug}`).toBe(true);
		}
	});

	it("каждый шаг страницы ссылается на существующий инструмент", () => {
		const ids = new Set(TOOLS.map((tool) => tool.id));
		for (const page of PAGES) {
			expect(page.steps.length, `${page.slug}: шагов`).toBeGreaterThan(0);
			for (const step of page.steps) {
				expect(ids.has(step.id), `${page.slug} → ${step.id}`).toBe(true);
			}
		}
	});

	it("каждый инструмент используется хотя бы одной страницей", () => {
		const used = new Set(PAGES.flatMap((page) => page.steps.map((s) => s.id)));
		const orphans = TOOLS.map((tool) => tool.id).filter((id) => !used.has(id));
		expect(orphans, `инструменты без страниц:\n${orphans.join("\n")}`).toEqual(
			[],
		);
	});

	it("guard: у страницы ровно один шаг", () => {
		// Модель допускает цепочку, но `SchemaToolView` исполняет первый шаг и
		// форма параметров одна на страницу. Исполнение цепочек и общая форма
		// из полей двух инструментов — фаза 11 `docs/roadmap.md`.
		for (const page of PAGES) {
			expect(page.steps.length, `${page.slug}: шагов`).toBe(1);
		}
	});

	it("PREVIEW_GROUPS строится без ошибок", () => {
		expect(PREVIEW_GROUPS.length).toBeGreaterThan(0);
		expect(PREVIEW_GROUPS.reduce((n, g) => n + g.pages.length, 0)).toBe(
			PAGES.length,
		);
	});

	it("guard: у всех инструментов задан валидный input", () => {
		for (const tool of TOOLS) {
			expect(tool.input, tool.id).toMatch(/^(image|text|none)$/);
		}
	});

	it("guard: input=image требует источник, input=text — текст", () => {
		for (const tool of TOOLS) {
			const params = sanitizeSchemaParams(tool.schema, {});
			if (tool.input === "image") {
				expect(() => tool.run({ params }), tool.id).toThrow(
					"errors.sourceRequired",
				);
			} else if (tool.input === "text") {
				expect(() => tool.run({ params }), tool.id).toThrow(
					"errors.textRequired",
				);
			}
		}
	});

	it("guard: input=none работает без источника", async () => {
		const tool = TOOLS.find((t) => t.id === "create-empty")!;
		const img = asImage(
			await tool.run({ params: sanitizeSchemaParams(tool.schema, {}) }),
		);
		expect(img.width).toBe(800);
		expect(img.height).toBe(600);
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

	it("DOM-dependent tools bypass the worker", () => {
		for (const id of [
			"to-base64",
			"to-data-uri",
			"from-base64",
			"from-data-uri",
			"jpeg-artifacts",
			"placeholder",
		]) {
			expect(TOOLS.find((tool) => tool.id === id)?.domOnly, id).toBe(true);
		}
	});

	it("output metadata согласован с MIME и quality-схемой", () => {
		const extensions: Record<OutputMime, string> = {
			"image/png": "png",
			"image/jpeg": "jpg",
			"image/webp": "webp",
			"image/bmp": "bmp",
		};

		for (const tool of TOOLS) {
			const output = tool.output;
			if (!output) continue;
			expect(extensions[output.mime], `${tool.id}: mime`).toBe(output.ext);
			if (output.qualityParamId) {
				const qualityField = tool.schema.fields[output.qualityParamId];
				expect(
					qualityField,
					`${tool.id}.${output.qualityParamId}`,
				).toBeDefined();
				expect(["number", "slider"], `${tool.id}: quality kind`).toContain(
					qualityField?.spec.kind,
				);
			} else if (output.mime === "image/jpeg" || output.mime === "image/webp") {
				expect(output.qualityParamId, `${tool.id}: quality`).toBeTruthy();
			}
			if (output.mime === "image/bmp") {
				expect(
					output.qualityParamId,
					`${tool.id}: bmp quality`,
				).toBeUndefined();
			}
		}
	});

	it("source-aware dimension defaults применяются только к image tools", () => {
		for (const tool of TOOLS) {
			for (const field of Object.values(tool.schema.fields)) {
				if (field.spec.kind === "dimension" && field.spec.defaultFromSource) {
					expect(tool.input, tool.id).toBe("image");
				}
			}
		}
	});

	it("resize и crop получают размеры текущего source", async () => {
		const source = solid(64, 48);
		const resize = TOOLS.find((t) => t.id === "resize")!;
		const resizeDefaults = defaultSchemaParams(resize.schema, { source });
		expect(resizeDefaults.size).toEqual({ width: 64, height: 48 });
		const resized = asImage(
			await resize.run({
				source,
				params: sanitizeSchemaParams(resize.schema, resizeDefaults, { source }),
			}),
		);
		expect([resized.width, resized.height]).toEqual([64, 48]);

		const crop = TOOLS.find((t) => t.id === "crop")!;
		const cropDefaults = defaultSchemaParams(crop.schema, { source });
		expect(cropDefaults).toMatchObject({
			x: 0,
			y: 0,
			size: { width: 64, height: 48 },
		});
		const cropped = asImage(
			await crop.run({
				source,
				params: sanitizeSchemaParams(crop.schema, cropDefaults, { source }),
			}),
		);
		expect([cropped.width, cropped.height]).toEqual([64, 48]);
	});

	it("create-empty: dimension-дефолты корректны", () => {
		const tool = TOOLS.find((t) => t.id === "create-empty")!;
		const d = defaultSchemaParams(tool.schema);
		expect(d.size).toEqual({ width: 800, height: 600 });
		expect(d.opacity).toBe(0);
	});

	it("sanitize клампит dimension к min/max и чинит мусор", () => {
		const tool = TOOLS.find((t) => t.id === "create-empty")!;
		const s = sanitizeSchemaParams(tool.schema, {
			size: { width: 999999, height: -5 },
			opacity: 50,
			color: "#ff0000",
		});
		expect(s.size).toEqual({ width: 20000, height: 1 });
		const bad = sanitizeSchemaParams(tool.schema, {});
		expect(bad.size).toEqual({ width: 800, height: 600 });
	});

	it("executeGenerate для create-empty даёт картинку нужного размера", async () => {
		const tool = TOOLS.find((t) => t.id === "create-empty")!;
		const params = sanitizeSchemaParams(tool.schema, {
			size: { width: 320, height: 200 },
			opacity: 0,
			color: "#ff0000",
		});
		const img = asImage(await tool.run({ params }));
		expect(img.width).toBe(320);
		expect(img.height).toBe(200);
		expect(img.data[3]).toBe(0);
	});

	it.each([
		["single-color", { size: { width: 40, height: 30 }, color: "#00ff00" }],
		["random-noise", { size: { width: 40, height: 30 }, seed: 5 }],
		[
			"linear-gradient",
			{
				size: { width: 40, height: 30 },
				gradient: {
					from: "#000000",
					to: "#ffffff",
					angle: 90,
				},
			},
		],
		[
			"color-spectrum",
			{
				size: { width: 40, height: 30 },
				direction: "horizontal",
				saturation: 100,
				lightness: 50,
			},
		],
		[
			"random-colors",
			{ size: { width: 40, height: 30 }, blockSize: 16, seed: 7 },
		],
		[
			"draw-grid",
			{
				size: { width: 40, height: 30 },
				cols: 4,
				rows: 3,
				lineWidth: 2,
				color: "#000000",
				bgOpacity: 0,
			},
		],
	])("генератор %s даёт картинку по dimension", async (id, params) => {
		const tool = TOOLS.find((t) => t.id === id)!;
		expect(tool.input).toBe("none");
		const sanitized = sanitizeSchemaParams(tool.schema, params);
		const img = asImage(await tool.run({ params: sanitized }));
		expect(img.width).toBe(40);
		expect(img.height).toBe(30);
	});

	it("random-noisе детерминирован по seed", async () => {
		const tool = TOOLS.find((t) => t.id === "random-noise")!;
		const a = asImage(
			await tool.run({
				params: sanitizeSchemaParams(tool.schema, {
					size: { width: 32, height: 32 },
					seed: 1,
				}),
			}),
		);
		const b = asImage(
			await tool.run({
				params: sanitizeSchemaParams(tool.schema, {
					size: { width: 32, height: 32 },
					seed: 1,
				}),
			}),
		);
		expect(a.data).toEqual(b.data);
	});

	it("resize: keepAspect с одной стороной сохраняет пропорции", async () => {
		const tool = TOOLS.find((t) => t.id === "resize")!;
		const img = solid(100, 50);
		const out = asImage(
			await tool.run({
				source: img,
				params: sanitizeSchemaParams(tool.schema, {
					size: { width: 200, height: 0 },
					keepAspect: true,
				}),
			}),
		);
		expect(out.width).toBe(200);
		expect(out.height).toBe(100);
	});

	it("crop вырезает область по x/y", async () => {
		const tool = TOOLS.find((t) => t.id === "crop")!;
		const img = solid(100, 100);
		const out = asImage(
			await tool.run({
				source: img,
				params: sanitizeSchemaParams(tool.schema, {
					x: 10,
					y: 20,
					size: { width: 30, height: 40 },
				}),
			}),
		);
		expect(out.width).toBe(30);
		expect(out.height).toBe(40);
	});

	it("fit-on-background центрирует картинку на канвасе", async () => {
		const tool = TOOLS.find((t) => t.id === "fit-on-background")!;
		const img = solid(20, 10);
		const out = asImage(
			await tool.run({
				source: img,
				params: sanitizeSchemaParams(tool.schema, {
					size: { width: 60, height: 30 },
					opacity: 0,
					color: "#ffffff",
				}),
			}),
		);
		expect(out.width).toBe(60);
		expect(out.height).toBe(30);
		expect(out.data[3]).toBe(0);
	});

	it("crop: resultNote предупреждает, когда результат ужался по границам", () => {
		const tool = TOOLS.find((t) => t.id === "crop")!;
		expect(
			tool.resultNote?.(
				{ x: 700, y: 0, size: { width: 256, height: 256 } },
				solid(132, 256),
			),
		).toEqual({ key: "resultCard.clamped" });
		expect(
			tool.resultNote?.(
				{ x: 0, y: 0, size: { width: 256, height: 256 } },
				solid(256, 256),
			),
		).toBeNull();
	});

	it("resize: resultNote при keepAspect и скорректированной стороне", () => {
		const tool = TOOLS.find((t) => t.id === "resize")!;
		const p = { size: { width: 500, height: 300 }, keepAspect: true };
		expect(tool.resultNote?.(p, solid(300, 300))).toEqual({
			key: "resultCard.aspectAdjusted",
			tone: "info",
		});
		expect(tool.resultNote?.(p, solid(500, 300))).toBeNull();
		// без keepAspect результат всегда как запрошено
		expect(
			tool.resultNote?.(
				{ size: { width: 500, height: 300 }, keepAspect: false },
				solid(500, 300),
			),
		).toBeNull();
	});

	it("fit-on-background: resultNote, когда картинка крупнее канваса", () => {
		const tool = TOOLS.find((t) => t.id === "fit-on-background")!;
		const p = {
			size: { width: 100, height: 100 },
			opacity: 100,
			color: "#ffffff",
		};
		expect(tool.resultNote?.(p, solid(200, 100))).toEqual({
			key: "resultCard.grown",
			tone: "info",
		});
		expect(tool.resultNote?.(p, solid(100, 100))).toBeNull();
	});

	it("change-canvas-size использует anchor для позиции", async () => {
		const tool = TOOLS.find((t) => t.id === "change-canvas-size")!;
		const img = solid(10, 10);
		const out = asImage(
			await tool.run({
				source: img,
				params: sanitizeSchemaParams(tool.schema, {
					size: { width: 20, height: 20 },
					anchor: "top-left",
				}),
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
		const tool = TOOLS.find((t) => t.id === "blend-two")!;
		const d = defaultSchemaParams(tool.schema);
		expect(d.pair).toEqual({ from: "#000000", to: "#ffffff" });
		const img = asImage(
			await tool.run({
				params: sanitizeSchemaParams(tool.schema, {
					pair: { from: "#ff0000", to: "#0000ff" },
					width: 128,
				}),
			}),
		);
		expect(img.width).toBe(128);
	});

	it("step-colors: рендерит steps полос по паре", async () => {
		const tool = TOOLS.find((t) => t.id === "step-colors")!;
		const img = asImage(
			await tool.run({
				params: sanitizeSchemaParams(tool.schema, {
					pair: { from: "#000000", to: "#ffffff" },
					steps: 4,
					width: 128,
					layout: "strip",
				}),
			}),
		);
		expect(img.width).toBe(128);
	});

	it("two-colors: перекрашивает светлые/тёмные пиксели по паре", async () => {
		const tool = TOOLS.find((t) => t.id === "two-colors")!;
		// 50×1, левая половина тёмная, правая светлая
		const data = new Uint8ClampedArray(50 * 4).fill(255);
		const img = { width: 50, height: 1, data };
		for (let x = 0; x < 25; x++) {
			const i = x * 4;
			data[i] = 0;
			data[i + 1] = 0;
			data[i + 2] = 0;
		}
		const out = asImage(
			await tool.run({
				source: img,
				params: sanitizeSchemaParams(tool.schema, {
					pair: { from: "#ffffff", to: "#ff0000" },
					threshold: 50,
				}),
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

	it("linear-gradient: дефолты gradient и направление по углу", async () => {
		const tool = TOOLS.find((t) => t.id === "linear-gradient")!;
		const d = defaultSchemaParams(tool.schema);
		expect(d.gradient).toEqual({
			from: "#000000",
			to: "#ffffff",
			angle: 0,
		});
		// 0° — слева направо: крайний левый пиксель = from, крайний правый = to
		let img = asImage(
			await tool.run({
				params: sanitizeSchemaParams(tool.schema, {
					size: { width: 4, height: 1 },
					gradient: { from: "#000000", to: "#ffffff", angle: 0 },
				}),
			}),
		);
		expect(img.data[0]).toBe(0);
		expect(img.data[12]).toBe(255);
		// 90° — сверху вниз: верхний пиксель = from, нижний = to
		img = asImage(
			await tool.run({
				params: sanitizeSchemaParams(tool.schema, {
					size: { width: 1, height: 4 },
					gradient: { from: "#000000", to: "#ffffff", angle: 90 },
				}),
			}),
		);
		expect(img.data[0]).toBe(0);
		expect(img.data[12]).toBe(255);
		// 180° — разворот: левый пиксель = to
		img = asImage(
			await tool.run({
				params: sanitizeSchemaParams(tool.schema, {
					size: { width: 4, height: 1 },
					gradient: { from: "#000000", to: "#ffffff", angle: 180 },
				}),
			}),
		);
		expect(img.data[0]).toBe(255);
		expect(img.data[12]).toBe(0);
	});

	it("sanitize чинит мусор в gradient и клампит angle в 0..360", () => {
		const tool = TOOLS.find((t) => t.id === "linear-gradient")!;
		const s = sanitizeSchemaParams(tool.schema, {
			size: { width: 10, height: 10 },
			gradient: {
				from: "not-a-color",
				to: "#00ff00",
				angle: 720,
				extra: 1,
			},
		});
		expect(s.gradient).toEqual({
			from: "#000000",
			to: "#00ff00",
			angle: 360,
		});
	});

	it("sanitize чинит мусор в паре и клампит threshold", () => {
		const tool = TOOLS.find((t) => t.id === "two-colors")!;
		const s = sanitizeSchemaParams(tool.schema, {
			pair: { from: "not-a-color", to: "#00ff00", extra: 1 },
			threshold: 999,
		});
		expect(s.pair).toEqual({ from: "#ffffff", to: "#00ff00" });
		expect(s.threshold).toBe(100);
	});

	it("circle-mask: срезает углы и сохраняет центр", async () => {
		const tool = TOOLS.find((t) => t.id === "circle-mask")!;
		const img = asImage(
			await tool.run({
				source: solid(100, 100),
				params: sanitizeSchemaParams(tool.schema, {
					size: 100,
					offset: { x: 0, y: 0 },
				}),
			}),
		);
		// Внешний угол (0,0) — вне круга радиуса 50 → прозрачен
		expect(img.data[3]).toBe(0);
		// Центр (50,50) — внутри
		expect(img.data[(50 * img.width + 50) * 4 + 3]).toBe(255);
	});

	it("circle-mask: offset сдвигает фигуру", async () => {
		const tool = TOOLS.find((t) => t.id === "circle-mask")!;
		const img = asImage(
			await tool.run({
				source: solid(100, 100),
				params: sanitizeSchemaParams(tool.schema, {
					size: 50,
					offset: { x: 50, y: 0 },
				}),
			}),
		);
		// Радиус 25, центр смещён к x=100; пиксель (75,50) внутри, (49,50) снаружи
		expect(img.data[(50 * img.width + 75) * 4 + 3]).toBe(255);
		expect(img.data[(50 * img.width + 49) * 4 + 3]).toBe(0);
	});

	it("star-mask: сохраняет центр, режет углы", async () => {
		const tool = TOOLS.find((t) => t.id === "star-mask")!;
		const img = asImage(
			await tool.run({
				source: solid(100, 100),
				params: sanitizeSchemaParams(tool.schema, {
					points: 5,
					innerRadius: 45,
					size: 100,
					rotation: 0,
					offset: { x: 0, y: 0 },
				}),
			}),
		);
		expect(img.data[(50 * img.width + 50) * 4 + 3]).toBe(255);
		expect(img.data[3]).toBe(0);
	});

	it("sanitize клампит offset к min/max и чинит мусор", () => {
		const tool = TOOLS.find((t) => t.id === "wavy-mask")!;
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

	it("add-text: дефолты position9, font-style, plate и текстовых полей", () => {
		const tool = TOOLS.find((t) => t.id === "add-text")!;
		const d = defaultSchemaParams(tool.schema);
		expect(d.position).toBe("bottom-right");
		expect(d.text).toBe("Hello!");
		expect(d.plate).toEqual({
			enabled: false,
			color: "#000000",
			opacity: 60,
		});
		expect(d.style).toEqual({
			font: "sans",
			size: 48,
			bold: true,
			color: "#ffffff",
		});
	});

	it("sanitize чинит мусор в position9, font-style, plate и оставляет валидные значения", () => {
		const tool = TOOLS.find((t) => t.id === "date-stamp")!;
		const s = sanitizeSchemaParams(tool.schema, {
			format: "YYYY-MM-DD",
			style: {
				font: "comic-sans",
				size: -500,
				bold: "no",
				color: "red",
			},
			position: "somewhere-outside",
			margin: 20,
			plate: {
				enabled: "yes",
				color: "teal",
				opacity: 500,
			},
		});
		expect(s.position).toBe("bottom-right");
		expect(s.style).toEqual({
			font: "mono",
			size: 8,
			bold: false,
			color: "#ffffff",
		});
		expect(s.plate).toEqual({
			enabled: true,
			color: "#000000",
			opacity: 100,
		});
		const valid = sanitizeSchemaParams(tool.schema, {
			...defaultSchemaParams(tool.schema),
			position: "top-center",
			style: { font: "serif", size: 120, bold: true, color: "#00ff00" },
		});
		expect(valid.position).toBe("top-center");
		expect(valid.style).toEqual({
			font: "serif",
			size: 120,
			bold: true,
			color: "#00ff00",
		});
	});

	it("from-text: дефолты font-style и sanitize", () => {
		const tool = TOOLS.find((t) => t.id === "from-text")!;
		const d = defaultSchemaParams(tool.schema);
		expect(d.style).toEqual({
			font: "sans",
			size: 96,
			bold: true,
			color: "#111318",
		});
		expect(d.bgOpacity).toBe(100);
		const s = sanitizeSchemaParams(tool.schema, {
			style: { font: "sans", size: 9999, bold: false, color: "#123abc" },
			padding: 200,
		});
		expect(s.style).toEqual({
			font: "sans",
			size: 300,
			bold: false,
			color: "#123abc",
		});
	});
});

describe("split-into-parts", () => {
	it("объявлен с result=files и дефолтом 2x2", () => {
		const tool = TOOLS.find((t) => t.id === "split-into-parts")!;
		expect(tool).toBeDefined();
		expect(tool.result).toBe("files");
		const defaults = sanitizeSchemaParams(tool.schema, {});
		expect(defaults.columns).toBe(2);
		expect(defaults.rows).toBe(2);
	});

	it("на ровном размере даёт cols*rows частей одинакового размера", async () => {
		const tool = TOOLS.find((t) => t.id === "split-into-parts")!;
		const files = asFiles(
			await tool.run({
				source: solid(100, 100),
				params: sanitizeSchemaParams(tool.schema, {
					columns: 2,
					rows: 2,
				}),
			}),
		).files;
		expect(files).toHaveLength(4);
		for (const file of files) {
			expect(file.image.width).toBe(50);
			expect(file.image.height).toBe(50);
		}
		expect(files.map((f) => f.name)).toEqual([
			"part-1-1.png",
			"part-1-2.png",
			"part-2-1.png",
			"part-2-2.png",
		]);
	});

	it("на неделимом размере части строго равные (канвас дополняется)", async () => {
		const tool = TOOLS.find((t) => t.id === "split-into-parts")!;
		const files = asFiles(
			await tool.run({
				source: solid(101, 77),
				params: sanitizeSchemaParams(tool.schema, {
					columns: 3,
					rows: 2,
				}),
			}),
		).files;
		expect(files).toHaveLength(6);
		for (const file of files) {
			expect(file.image.width).toBe(34);
			expect(file.image.height).toBe(39);
		}
	});

	it("принимает максимальную сетку 32x32 = 1024 части (потолок стража)", async () => {
		const tool = TOOLS.find((t) => t.id === "split-into-parts")!;
		const files = asFiles(
			await tool.run({
				source: solid(120, 120),
				params: sanitizeSchemaParams(tool.schema, {
					columns: 32,
					rows: 32,
				}),
			}),
		).files;
		expect(files).toHaveLength(1024);
	});

	it("режим tile: сетка считается от размера тайла, части точные", async () => {
		const tool = TOOLS.find((t) => t.id === "split-into-parts")!;
		const files = asFiles(
			await tool.run({
				source: solid(100, 70),
				params: sanitizeSchemaParams(tool.schema, {
					mode: "tile",
					tile: { width: 32, height: 32 },
				}),
			}),
		).files;
		// 100/32 → 4 колонки, 70/32 → 3 строки
		expect(files).toHaveLength(12);
		for (const file of files) {
			expect(file.image.width).toBe(32);
			expect(file.image.height).toBe(32);
		}
	});

	it("выбрасывает errors.tooManyParts при переполнении", () => {
		const tool = TOOLS.find((t) => t.id === "split-into-parts")!;
		expect(() =>
			tool.run({
				source: solid(120, 120),
				params: { columns: 1000, rows: 1000 },
			}),
		).toThrow("errors.tooManyParts");
	});
});

function asFiles(result: ToolResult): FileResult {
	if (typeof result === "string" || "key" in result || !("files" in result)) {
		throw new Error("expected a files result");
	}
	return result;
}

function solid(width: number, height: number) {
	const data = new Uint8ClampedArray(width * height * 4).fill(255);
	return { width, height, data };
}
