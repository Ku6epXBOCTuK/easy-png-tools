import { describe, expect, it } from "vitest";
import {
	CHAIN_VERSION,
	chainablePages,
	createChain,
	insertStep,
	isChainable,
	moveStep,
	parseChain,
	removeStep,
} from "./pipeline.svelte";
import { getPageBySlug } from "./registry";

const cropPage = getPageBySlug("crop-png")!;

describe("pipeline: цепочка шагов", () => {
	it("createChain собирает шаги из страницы с дефолтами схемы", () => {
		const chain = createChain(cropPage);
		expect(chain).toHaveLength(1);
		expect(chain[0].id).toBe("crop");
		expect(chain[0].params).toMatchObject({ x: 0, y: 0 });
	});

	it("isChainable: image→image можно, терминальные и text-вход нельзя", () => {
		expect(isChainable("resize")).toBe(true);
		expect(isChainable("to-base64")).toBe(false); // result: text
		expect(isChainable("split-into-parts")).toBe(false); // result: files
		expect(isChainable("from-svg")).toBe(false); // input: text
		expect(isChainable("unknown-tool")).toBe(false);
	});

	it("chainablePages содержит только совместимые страницы", () => {
		const pages = chainablePages();
		expect(pages.some((p) => p.slug === "resize-png")).toBe(true);
		expect(pages.some((p) => p.slug === "png-to-base64")).toBe(false);
	});

	it("insertStep вставляет шаг в произвольную позицию", () => {
		const chain = createChain(cropPage);
		const grown = insertStep(chain, 0, "resize");
		expect(grown.map((s) => s.id)).toEqual(["resize", "crop"]);
		expect(grown[0].params).toHaveProperty("keepAspect");
		// исходная цепочка не мутирует
		expect(chain).toHaveLength(1);
	});

	it("removeStep не удаляет последний шаг", () => {
		const chain = createChain(cropPage);
		expect(removeStep(chain, chain[0].key)).toHaveLength(1);
		const grown = insertStep(chain, 1, "flip");
		const shrunk = removeStep(grown, grown[0].key);
		expect(shrunk.map((s) => s.id)).toEqual(["flip"]);
	});

	it("moveStep меняет порядок, ключи шагов сохраняются", () => {
		let chain = createChain(cropPage);
		chain = insertStep(chain, 1, "flip");
		chain = insertStep(chain, 2, "grayscale");
		const keys = chain.map((s) => s.key);
		const moved = moveStep(chain, 2, 0);
		expect(moved.map((s) => s.id)).toEqual(["grayscale", "crop", "flip"]);
		expect(moved.map((s) => s.key)).toEqual([keys[2], keys[0], keys[1]]);
		expect(moveStep(chain, 0, 5)).toBe(chain);
	});
});

describe("pipeline: parseChain (localStorage/импорт)", () => {
	const valid = {
		version: CHAIN_VERSION,
		steps: [
			{ id: "crop", params: { x: 5 } },
			{ id: "resize", params: {} },
		],
	};

	it("валидная цепочка разбирается, параметры санитизируются", () => {
		const chain = parseChain(valid)!;
		expect(chain.map((s) => s.id)).toEqual(["crop", "resize"]);
		expect(chain[0].params).toMatchObject({ x: 5, y: 0 });
	});

	it.each([
		["нет версии", { steps: [{ id: "crop" }] }],
		["другая версия", { version: 99, steps: [{ id: "crop" }] }],
		["пустой список", { version: CHAIN_VERSION, steps: [] }],
		[
			"неизвестный инструмент",
			{ version: CHAIN_VERSION, steps: [{ id: "nope" }] },
		],
		["мусор", "just a string"],
	])("невалидные данные → null (%s)", (_name, data) => {
		expect(parseChain(data)).toBeNull();
	});
});
