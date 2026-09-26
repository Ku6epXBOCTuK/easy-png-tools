import postcss from "postcss";
import { describe, expect, it } from "vitest";
import postcssHct from "../postcss-hct.mjs";

async function process(css) {
	const result = await postcss([postcssHct]).process(css, { from: undefined });
	return {
		css: result.css,
		warnings: result.warnings().map((warning) => warning.text),
	};
}

function valueOf(css, token) {
	const match = css.match(new RegExp(`${token}:\\s*([^;]+)`));
	if (!match) throw new Error(`token ${token} not found in:\n${css}`);
	return match[1].trim();
}

function isHexColor(value) {
	return /^#[0-9a-f]{6}$/i.test(value);
}

describe("postcss-hct", () => {
	it("resolves a literal hct() to an sRGB hex color", async () => {
		const { css, warnings } = await process(
			":root { --black: hct(0 0 0); --white: hct(0 0 100); }",
		);

		expect(valueOf(css, "--black")).toBe("#000000");
		expect(valueOf(css, "--white")).toBe("#ffffff");
		expect(warnings).toEqual([]);
	});

	it("keeps tone monotonic for achromatic colors", async () => {
		const { css } = await process(
			":root { --low: hct(0 0 25); --mid: hct(0 0 50); --high: hct(0 0 75); }",
		);
		const tone = (token) => Number.parseInt(valueOf(css, token).slice(1), 16);

		expect(tone("--low")).toBeLessThan(tone("--mid"));
		expect(tone("--mid")).toBeLessThan(tone("--high"));
	});

	it("wraps hue into the 0-360 range", async () => {
		const { css } = await process(
			[
				":root {",
				"  --base: hct(350 40 50);",
				"  --negative: hct(-10 40 50);",
				"  --overflow: hct(370 40 50);",
				"  --ten: hct(10 40 50);",
				"}",
			].join("\n"),
		);

		expect(valueOf(css, "--negative")).toBe(valueOf(css, "--base"));
		expect(valueOf(css, "--overflow")).toBe(valueOf(css, "--ten"));
	});

	it("clamps tone into 0-100", async () => {
		const { css } = await process(
			":root { --over: hct(0 0 150); --under: hct(0 0 -20); }",
		);

		expect(valueOf(css, "--over")).toBe("#ffffff");
		expect(valueOf(css, "--under")).toBe("#000000");
	});

	it("clamps tone derived from a seed into 0-100", async () => {
		const { css } = await process(
			[
				":root {",
				"  --seed: hct(120 40 50);",
				"  --too-light: hct(from var(--seed) h c calc(t + 80));",
				"  --expected-light: hct(120 40 100);",
				"  --too-dark: hct(from var(--seed) h c calc(t - 80));",
				"  --expected-dark: hct(120 40 0);",
				"}",
			].join("\n"),
		);

		expect(valueOf(css, "--too-light")).toBe(valueOf(css, "--expected-light"));
		expect(valueOf(css, "--too-dark")).toBe(valueOf(css, "--expected-dark"));
	});

	it("takes h, c and t from a seed token", async () => {
		const { css } = await process(
			":root { --seed: hct(120 40 50); --copy: hct(from var(--seed) h c t); }",
		);

		expect(valueOf(css, "--copy")).toBe(valueOf(css, "--seed"));
	});

	it("supports channel math through calc()", async () => {
		const { css } = await process(
			[
				":root {",
				"  --seed: hct(120 40 50);",
				"  --lighter: hct(from var(--seed) h c calc(t + 10));",
				"  --expected: hct(120 40 60);",
				"}",
			].join("\n"),
		);

		expect(valueOf(css, "--lighter")).toBe(valueOf(css, "--expected"));
	});

	it("supports min, max and clamp over channels", async () => {
		const { css } = await process(
			[
				":root {",
				"  --seed: hct(120 40 50);",
				"  --capped: hct(from var(--seed) h c clamp(10, t, 45));",
				"  --expected: hct(120 40 45);",
				"  --smallest: hct(from var(--seed) h c min(t, 20));",
				"  --expected-smallest: hct(120 40 20);",
				"}",
			].join("\n"),
		);

		expect(valueOf(css, "--capped")).toBe(valueOf(css, "--expected"));
		expect(valueOf(css, "--smallest")).toBe(
			valueOf(css, "--expected-smallest"),
		);
	});

	it("resolves a hex seed through a variable and inline alike", async () => {
		const { css } = await process(
			[
				":root {",
				"  --seed: #336699;",
				"  --via-var: hct(from var(--seed) h c t);",
				"  --inline: hct(from #336699 h c t);",
				"}",
			].join("\n"),
		);

		expect(isHexColor(valueOf(css, "--via-var"))).toBe(true);
		expect(valueOf(css, "--via-var")).toBe(valueOf(css, "--inline"));
	});

	it("resolves seeds that are themselves hct() tokens", async () => {
		const { css } = await process(
			[
				":root {",
				"  --first: hct(200 30 60);",
				"  --second: hct(from var(--first) h c t);",
				"}",
			].join("\n"),
		);

		expect(valueOf(css, "--second")).toBe(valueOf(css, "--first"));
	});

	it("uses :root seeds inside other selectors", async () => {
		const { css } = await process(
			[
				":root { --seed: hct(90 50 40); }",
				".dark { --from-root: hct(from var(--seed) h c t); }",
			].join("\n"),
		);

		expect(valueOf(css, "--from-root")).toBe(valueOf(css, "--seed"));
	});

	it("resolves every hct() call inside one declaration", async () => {
		const { css } = await process(":root { --pair: hct(0 0 10) hct(0 0 90); }");

		expect(valueOf(css, "--pair")).toBe(
			`${valueOf(css, "--pair").split(" ")[0]} ${valueOf(css, "--pair").split(" ")[1]}`,
		);
		expect(valueOf(css, "--pair").split(" ")).toHaveLength(2);
	});

	it("leaves values without hct() untouched", async () => {
		const source = ":root { --size: 12px; --name: red; --ref: var(--size); }";
		const { css } = await process(source);

		expect(css).toContain("--size: 12px");
		expect(css).toContain("--name: red");
		expect(css).toContain("--ref: var(--size)");
	});

	it("warns and keeps the value when the seed is unknown", async () => {
		const { css, warnings } = await process(
			":root { --orphan: hct(from var(--missing) h c t); }",
		);

		expect(valueOf(css, "--orphan")).toBe("hct(from var(--missing) h c t)");
		expect(warnings).toHaveLength(1);
		expect(warnings[0]).toContain("could not resolve");
	});

	it("warns and keeps the value on a circular reference", async () => {
		const { css, warnings } = await process(
			[
				":root {",
				"  --ping: hct(from var(--pong) h c t);",
				"  --pong: hct(from var(--ping) h c t);",
				"}",
			].join("\n"),
		);

		expect(valueOf(css, "--ping")).toBe("hct(from var(--pong) h c t)");
		expect(warnings).toHaveLength(2);
		expect(warnings.every((text) => text.includes("could not resolve"))).toBe(
			true,
		);
	});

	it("warns and keeps the value for a malformed hct() body", async () => {
		const { css, warnings } = await process(":root { --bad: hct(1 2); }");

		expect(valueOf(css, "--bad")).toBe("hct(1 2)");
		expect(warnings).toHaveLength(1);
	});
});
