import { describe, expect, it } from "vitest";
import { PAGES } from "./registry";
import { TOOL_ICONS } from "./tool-icons";

describe("tool-icons", () => {
	it("every icon key is an existing page slug", () => {
		const slugs = new Set<string>(PAGES.map((page) => page.slug));
		const orphans = Object.keys(TOOL_ICONS).filter((key) => !slugs.has(key));
		expect(orphans).toEqual([]);
	});

	it("every page has an icon", () => {
		const missing = PAGES.map((page) => page.slug).filter(
			(slug) => !(slug in TOOL_ICONS),
		);
		expect(missing).toEqual([]);
	});
});
