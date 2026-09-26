import postcss from "postcss";
import { describe, expect, it } from "vitest";
import { checkColorAuthorship } from "../token-audit/colors.mjs";
import {
	collectTokens,
	isColorValue,
	isDerived,
} from "../token-audit/helpers.mjs";
import { checkParity } from "../token-audit/parity.mjs";
import { checkUnresolvedRefs } from "../token-audit/refs.mjs";
import { checkUnused } from "../token-audit/unused.mjs";

function themes(css) {
	const root = postcss.parse(css);
	return {
		root,
		light: collectTokens(root, ":root"),
		dark: collectTokens(root, '[data-theme="dark"]'),
	};
}

describe("checkParity", () => {
	it("accepts a color token that has both themes", () => {
		const { light, dark } = themes(
			':root { --color-text: #111; } [data-theme="dark"] { --color-text: #eee; }',
		);

		expect(checkParity({ light, dark })).toEqual([]);
	});

	it("reports a light-only color token", () => {
		const { light, dark } = themes(":root { --color-text: #111; }");

		expect(checkParity({ light, dark })).toEqual([
			'  --color-text in :root has no [data-theme="dark"] override',
		]);
	});

	it("reports a dark-only color token as orphaned", () => {
		const { light, dark } = themes(
			'[data-theme="dark"] { --color-text: #eee; }',
		);

		expect(checkParity({ light, dark })).toEqual([
			'  --color-text in [data-theme="dark"] is missing in :root',
		]);
	});

	it("exempts derived tokens because they follow the theme", () => {
		const { light, dark } = themes(
			":root { --color-text: hct(from var(--brand-main) h c t); }",
		);

		expect(checkParity({ light, dark })).toEqual([]);
	});

	it("exempts non-color tokens", () => {
		const { light, dark } = themes(":root { --space-page-top: 48px; }");

		expect(checkParity({ light, dark })).toEqual([]);
	});
});

describe("checkColorAuthorship", () => {
	it("accepts hct() and color-mix()", () => {
		const { root } = themes(
			[
				":root {",
				"  --color-main: hct(160 80 48);",
				"  --color-mixed: color-mix(in oklch, var(--color-main), #fff);",
				"}",
			].join("\n"),
		);

		expect(checkColorAuthorship(root)).toEqual([]);
	});

	it("accepts seed tokens in any format", () => {
		const { root } = themes(":root { --brand-main: #ff8800; }");

		expect(checkColorAuthorship(root)).toEqual([]);
	});

	it("reports a hardcoded hex color with its location", () => {
		const { root } = themes(":root { --color-text: #112233; }");

		expect(checkColorAuthorship(root)).toEqual([
			"  --color-text (:root): #112233 — colors must be hct(); only --brand-main/--brand-alt may use other formats",
		]);
	});

	it("reports an rgb() color outside hct()", () => {
		const { root } = themes(
			'[data-theme="dark"] { --color-accent: rgb(1 2 3); }',
		);

		expect(checkColorAuthorship(root)[0]).toContain("--color-accent");
	});

	it("ignores non-color values and non-custom properties", () => {
		const { root } = themes(
			":root { --font-size-m: 14px; } .x { color: #ff0000; }",
		);

		expect(checkColorAuthorship(root)).toEqual([]);
	});
});

describe("checkUnused", () => {
	it("reports a token that is never referenced", () => {
		const { root } = themes(":root { --color-dust: #111; }");

		expect(checkUnused(root, new Set())).toEqual(["--color-dust"]);
	});

	it("keeps a token that is referenced somewhere", () => {
		const { root } = themes(
			":root { --color-text: #111; } .x { color: var(--color-text); }",
		);

		expect(checkUnused(root, new Set(["--color-text"]))).toEqual([]);
	});

	it("collects definitions across both themes", () => {
		const { root } = themes(
			[
				":root { --color-text: #111; }",
				'[data-theme="dark"] { --color-text: #eee; --color-dust: #222; }',
			].join("\n"),
		);

		expect(checkUnused(root, new Set(["--color-text"]))).toEqual([
			"--color-dust",
		]);
	});
});

describe("checkUnresolvedRefs", () => {
	it("accepts references to tokens defined in the same file", () => {
		const { root } = themes(
			":root { --color-text: #111; .x { color: var(--color-text); } }",
		);

		expect(checkUnresolvedRefs(root)).toEqual([]);
	});

	it("accepts references defined in the other theme block", () => {
		const { root } = themes(
			[
				":root { --color-text: #111; }",
				'[data-theme="dark"] { --color-text: #eee; }',
				".x { color: var(--color-text); }",
			].join("\n"),
		);

		expect(checkUnresolvedRefs(root)).toEqual([]);
	});

	it("reports a typo in a token name with its location", () => {
		const { root } = themes(
			":root { --color-text: #111; .x { border-color: var(--color-bordr); } }",
		);

		expect(checkUnresolvedRefs(root)).toEqual([
			"  --color-bordr used in .x (border-color) is not defined in app.css",
		]);
	});

	it("exempts a reference that provides a fallback value", () => {
		const { root } = themes(".x { color: var(--color-missing, #fff); }");

		expect(checkUnresolvedRefs(root)).toEqual([]);
	});

	it("reports an undefined reference without a fallback even once", () => {
		const { root } = themes(
			[
				":root { --a: 1px; --b: 1px; }",
				".x { border-color: var(--ghost); outline-color: var(--ghost); }",
			].join("\n"),
		);

		expect(checkUnresolvedRefs(root)).toEqual([
			"  --ghost used in .x (border-color) is not defined in app.css",
		]);
	});

	it("checks references inside token definitions themselves", () => {
		const { root } = themes(
			":root { --color-text: hct(from var(--brand-typo) h c t); }",
		);

		expect(checkUnresolvedRefs(root)).toEqual([
			"  --brand-typo used in :root (--color-text) is not defined in app.css",
		]);
	});

	it("ignores non-custom properties that use var()", () => {
		const { root } = themes(
			".x { --local: 1px; width: calc(var(--local) * 2); }",
		);

		expect(checkUnresolvedRefs(root)).toEqual([]);
	});
});

describe("token predicates", () => {
	it("detects color values in every supported notation", () => {
		for (const value of [
			"#abc",
			"#aabbcc",
			"rgb(1 2 3)",
			"hsl(1 2% 3%)",
			"oklch(0.5 0.1 30)",
			"hct(1 2 3)",
			"color-mix(in oklch, #fff, #000)",
		]) {
			expect(isColorValue(value), value).toBe(true);
		}
	});

	it("does not treat sizes and durations as colors", () => {
		for (const value of ["12px", "0.3s", "1fr", "bold", "var(--size-m)"]) {
			expect(isColorValue(value), value).toBe(false);
		}
	});

	it("treats values referencing tokens as derived", () => {
		expect(isDerived("hct(from var(--brand-main) h c t)")).toBe(true);
		expect(isDerived("hct(160 80 48)")).toBe(false);
	});
});
