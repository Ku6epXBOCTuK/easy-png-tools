import { describe, expect, it } from "vitest";
import { COMPRESSION_LEVELS, findMaxColorsWithin } from "./compress";

describe("COMPRESSION_LEVELS", () => {
	it("presets ordered by descending colors", () => {
		const values = Object.values(COMPRESSION_LEVELS);
		for (let i = 1; i < values.length; i++)
			expect(values[i - 1]).toBeGreaterThan(values[i]);
	});
});

describe("findMaxColorsWithin", () => {
	const sizeOf = (k: number) => 1000 + k * 100; // size grows with k

	it("picks max k fitting the target", async () => {
		// target 5200 -> k<=42 fits -> expect 42 at maxK>=42
		const k = await findMaxColorsWithin(5200, 256, async (kk) => sizeOf(kk));
		expect(k).toBeGreaterThanOrEqual(40);
		expect(sizeOf(k)).toBeLessThanOrEqual(5200);
	});

	it("target unreachable even at minimum - returns 2", async () => {
		const k = await findMaxColorsWithin(50, 256, async (kk) => sizeOf(kk));
		expect(k).toBe(2);
	});

	it("encodeSize null treated as failure", async () => {
		const k = await findMaxColorsWithin(999999, 16, async () => null);
		expect(k).toBe(2);
	});

	it("binary search converges faster than full scan", async () => {
		let calls = 0;
		await findMaxColorsWithin(30000, 256, async (kk) => {
			calls++;
			return sizeOf(kk);
		});
		expect(calls).toBeLessThanOrEqual(12); // log2(254)+probe(2)
	});
});
