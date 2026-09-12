import { describe, expect, it } from "vitest";
import { isChainable, TOOLS } from "../registry";
import { normalizeForSearch, scoreDoc } from "./matching";
import { toolSearchDoc } from "./tool-strings";

function hits(q: string): string[] {
	const nq = normalizeForSearch(q);
	return TOOLS.filter((t) => {
		const s = scoreDoc(toolSearchDoc(t), nq);
		return s !== null && s > 0;
	}).map((t) => t.id);
}

describe("полнота поиска", () => {
	it("генератор (не chainable) находится поиском — раньше отфильтровывался", () => {
		expect(isChainable(TOOLS.find((t) => t.id === "color-wheel-png")!)).toBe(
			false,
		);
		expect(hits("color wheel")).toContain("color-wheel-png");
	});

	it("анализатор-маска тоже ищется", () => {
		expect(hits("уникальных цветов")).toContain("unique-color-mask-png");
	});
});
