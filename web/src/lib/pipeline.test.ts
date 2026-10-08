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

describe("pipeline: step chain", () => {
	it("createChain builds steps from page with schema defaults", () => {
		const chain = createChain(cropPage);
		expect(chain).toHaveLength(1);
		expect(chain[0].id).toBe("crop");
		expect(chain[0].params).toMatchObject({ x: 0, y: 0 });
	});

	it("isChainable: image->image allowed, terminal and text-input not", () => {
		expect(isChainable("resize")).toBe(true);
		expect(isChainable("to-base64")).toBe(false); // result: text
		expect(isChainable("split-into-parts")).toBe(false); // result: files
		expect(isChainable("from-svg")).toBe(false); // input: text
		expect(isChainable("unknown-tool")).toBe(false);
	});

	it("chainablePages holds only compatible pages", () => {
		const pages = chainablePages();
		expect(pages.some((p) => p.slug === "resize-png")).toBe(true);
		expect(pages.some((p) => p.slug === "png-to-base64")).toBe(false);
	});

	it("insertStep inserts step at arbitrary position", () => {
		const chain = createChain(cropPage);
		const grown = insertStep(chain, 0, "resize");
		expect(grown.map((s) => s.id)).toEqual(["resize", "crop"]);
		expect(grown[0].params).toHaveProperty("keepAspect");
		// original chain not mutated
		expect(chain).toHaveLength(1);
	});

	it("removeStep does not remove last step", () => {
		const chain = createChain(cropPage);
		expect(removeStep(chain, chain[0].key)).toHaveLength(1);
		const grown = insertStep(chain, 1, "flip");
		const shrunk = removeStep(grown, grown[0].key);
		expect(shrunk.map((s) => s.id)).toEqual(["flip"]);
	});

	it("moveStep reorders, step keys preserved", () => {
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

describe("pipeline: parseChain (localStorage/import)", () => {
	const valid = {
		version: CHAIN_VERSION,
		steps: [
			{ id: "crop", params: { x: 5 } },
			{ id: "resize", params: {} },
		],
	};

	it("valid chain parses, params sanitized", () => {
		const chain = parseChain(valid)!;
		expect(chain.map((s) => s.id)).toEqual(["crop", "resize"]);
		expect(chain[0].params).toMatchObject({ x: 5, y: 0 });
	});

	it("parseChain keeps collapsed, default expanded", () => {
		const chain = parseChain({
			version: CHAIN_VERSION,
			steps: [
				{ id: "crop", params: {}, collapsed: true },
				{ id: "resize", params: {} },
			],
		})!;
		expect(chain[0].collapsed).toBe(true);
		expect(chain[1].collapsed).toBeUndefined();
	});

	it.each([
		["no version", { steps: [{ id: "crop" }] }],
		["other version", { version: 99, steps: [{ id: "crop" }] }],
		["empty list", { version: CHAIN_VERSION, steps: [] }],
		["unknown tool", { version: CHAIN_VERSION, steps: [{ id: "nope" }] }],
		["junk", "just a string"],
	])("invalid data -> null (%s)", (_name, data) => {
		expect(parseChain(data)).toBeNull();
	});
});
