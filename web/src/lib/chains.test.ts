import { describe, expect, it } from "vitest";
import {
	autoChainName,
	parseNamedChains,
	serializeNamedChains,
} from "./chains.svelte";
import {
	CHAIN_VERSION,
	createChain,
	isStructuralDefault,
} from "./pipeline.svelte";
import { getPageBySlug } from "./registry";

const cropPage = getPageBySlug("crop-png")!;

describe("named chains: parse/serialize round-trip", () => {
	const chain = {
		id: "c1",
		name: "My chain",
		updatedAt: 123,
		steps: createChain(cropPage),
	};

	it("round-trips a valid chain", () => {
		const data = serializeNamedChains([chain]);
		const parsed = parseNamedChains(JSON.parse(JSON.stringify(data)));
		expect(parsed).toHaveLength(1);
		expect(parsed[0]).toMatchObject({ id: "c1", name: "My chain" });
		expect(parsed[0].steps[0].id).toBe("crop");
	});

	it("drops a broken entry, keeps the rest", () => {
		const good = JSON.parse(JSON.stringify(serializeNamedChains([chain]))) as {
			chains: unknown[];
		};
		const data = {
			version: CHAIN_VERSION,
			chains: [
				good.chains[0],
				{ id: "bad", name: "Broken", steps: [{ id: "nope" }] },
				{ nope: true },
			],
		};
		const parsed = parseNamedChains(data);
		expect(parsed.map((c) => c.id)).toEqual(["c1"]);
	});

	it.each([
		["junk", "just a string"],
		["no version", { chains: [] }],
		["other version", { version: 99, chains: [] }],
	])("invalid store -> empty list (%s)", (_name, data) => {
		expect(parseNamedChains(data)).toEqual([]);
	});
});

describe("isStructuralDefault", () => {
	it("true for the untouched page chain", () => {
		expect(isStructuralDefault(cropPage, createChain(cropPage))).toBe(true);
	});

	it("false when a step is added or the first tool is swapped", () => {
		const grown = [...createChain(cropPage), ...createChain(cropPage)];
		expect(isStructuralDefault(cropPage, grown)).toBe(false);
		const swapped = createChain(cropPage);
		swapped[0] = { ...swapped[0], id: "resize" };
		expect(isStructuralDefault(cropPage, swapped)).toBe(false);
	});
});

describe("autoChainName", () => {
	it("embeds the formatted stamp", () => {
		const name = autoChainName(new Date(2026, 9, 8, 14, 35));
		expect(name).toContain("2026-10-08 14:35");
	});
});
