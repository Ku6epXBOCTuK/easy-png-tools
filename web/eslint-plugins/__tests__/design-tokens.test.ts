// Tests for the design-tokens plugin rules (web/eslint-plugins/design-tokens).
//
// Strategy:
//   - no-hardcoded-in-svelte, no-category-mismatch, no-token-definition-in-svelte
//     are pure AST checks -> standard RuleTester with string cases.
//   - no-undefined-in-svelte reads the token dictionary from <cwd>/src/app.css,
//     so it runs through the Linter API with cwd pinned to the fixtures dir
//     (see __tests__/helpers.ts). The fixture dictionary has exactly five
//     tokens; anything else must be reported even if it exists in the REAL
//     web/src/app.css.
import { RuleTester } from "eslint";
import svelteParser from "svelte-eslint-parser";
import tseslint from "typescript-eslint";
import { describe, expect, it } from "vitest";
import noCategoryMismatch from "../design-tokens/no-category-mismatch.js";
import noHardcoded from "../design-tokens/no-hardcoded-in-svelte.js";
import noTokenDefinition from "../design-tokens/no-token-definition-in-svelte.js";
import noUndefined from "../design-tokens/no-undefined-in-svelte.js";
import { asRuleModule, verifyInFixtures, type FlatConfig } from "./helpers.js";

const parserOptions = {
	parser: tseslint.parser,
};

// Vitest doesn't expose describe/it as globals (no `globals: true` in the
// config), so RuleTester would fall back to its synchronous default handler.
// Register the real ones so each case becomes a proper vitest test.
RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
	languageOptions: {
		parser: svelteParser,
		parserOptions,
	},
});

/** Wrap CSS from a <style> block into a minimal Svelte component. */
const component = (style: string): string =>
	`<div class="box">x</div>\n\n<style>\n${style}\n</style>\n`;

const frame = (style: string) => ({
	code: component(style),
	filename: "Component.svelte",
});

describe("design-tokens/no-hardcoded-in-svelte", () => {
	ruleTester.run("no-hardcoded-in-svelte", asRuleModule(noHardcoded), {
		valid: [
			frame(".box { color: var(--color-fg); }"),
			frame(".box { padding: var(--space-3); }"),
			frame(".box { background-color: transparent; }"),
			frame(".box { width: 100%; }"),
			frame(".box { line-height: 1.5; }"),
			frame(".box { transition: var(--duration-fast); }"),
			frame(".box { z-index: var(--z-nav); }"),
			frame(".box { font-size: var(--text-md); }"),
			frame("<div>no style block at all</div>"),
		],
		invalid: [
			{
				...frame(".box { color: #ff0000; }"),
				errors: [{ messageId: "hardcodedColor" }],
			},
			{
				...frame(".box { padding: 16px; }"),
				errors: [{ messageId: "hardcodedSize" }],
			},
			{
				...frame(".box { transition: 200ms; }"),
				errors: [{ messageId: "hardcodedDuration" }],
			},
			{
				...frame(".box { z-index: 100; }"),
				errors: [{ messageId: "hardcodedZIndex" }],
			},
			{
				...frame(
					"@media (max-width: 640px) { .box { width: var(--text-md); } }",
				),
				errors: [{ messageId: "hardcodedBreakpoint" }],
			},
			{
				...frame(
					"@media (min-width: var(--bp-m)) { .box { width: var(--text-md); } }",
				),
				errors: [{ messageId: "varInMedia" }],
			},
			{
				...frame(
					".box { color: color-mix(in srgb, var(--color-a), var(--color-b)); }",
				),
				errors: [{ messageId: "colorMix" }],
			},
		],
	});
});

describe("design-tokens/no-category-mismatch", () => {
	ruleTester.run("no-category-mismatch", asRuleModule(noCategoryMismatch), {
		valid: [
			frame(".box { padding: var(--space-1); }"),
			frame(".box { color: var(--color-fg); }"),
			frame(".box { border: 1px solid var(--color-border); }"),
		],
		invalid: [
			{
				...frame(".box { padding: var(--color-fg); }"),
				errors: [{ messageId: "categoryMismatch" }],
			},
			{
				...frame(".box { color: var(--space-1); }"),
				errors: [{ messageId: "categoryMismatch" }],
			},
		],
	});
});

describe("design-tokens/no-token-definition-in-svelte", () => {
	ruleTester.run(
		"no-token-definition-in-svelte",
		asRuleModule(noTokenDefinition),
		{
			valid: [
				frame(".box { --local: var(--color-fg); }"),
				frame(".box { --local: calc(var(--space-1) * 2); }"),
				frame(".box { --ratio: 1.5; }"),
			],
			invalid: [
				{
					...frame(".box { --local: #ff0000; }"),
					errors: [{ messageId: "tokenPrimitive" }],
				},
				{
					...frame(".box { --local: 12px; }"),
					errors: [{ messageId: "tokenPrimitive" }],
				},
				{
					...frame(".box { --local: oklch(0.5 0.1 240); }"),
					errors: [{ messageId: "tokenPrimitive" }],
				},
			],
		},
	);
});

describe("design-tokens/no-undefined-in-svelte", () => {
	const undefinedConfig: FlatConfig = [
		{
			files: ["**/*.svelte"],
			plugins: {
				"design-tokens": {
					rules: { "no-undefined-in-svelte": asRuleModule(noUndefined) },
				},
			},
			rules: { "design-tokens/no-undefined-in-svelte": "error" },
			languageOptions: {
				parser: svelteParser,
				parserOptions,
			},
		},
	];

	it("accepts tokens defined in the fixture app.css", () => {
		const messages = verifyInFixtures(
			undefinedConfig,
			component(".box { color: var(--color-fg); }"),
			"lib/components/Foo.svelte",
		);
		expect(messages).toEqual([]);
	});

	it("accepts component-local overrides", () => {
		const messages = verifyInFixtures(
			undefinedConfig,
			component(".box { --local-x: var(--color-fg); color: var(--local-x); }"),
			"lib/components/Foo.svelte",
		);
		expect(messages).toEqual([]);
	});

	it("flags an unknown token even if it exists in the real web/src/app.css", () => {
		const messages = verifyInFixtures(
			undefinedConfig,
			component(".box { color: var(--color-love); }"),
			"lib/components/Foo.svelte",
		);
		expect(messages).toHaveLength(1);
		expect(messages[0].messageId).toBe("undefinedToken");
		expect(messages[0].message).toContain("--color-love");
	});

	it("flags unknown tokens referenced inside @media params", () => {
		const messages = verifyInFixtures(
			undefinedConfig,
			component(
				"@media (width >= var(--bp-xs)) { .box { width: var(--text-md); } }",
			),
			"lib/components/Foo.svelte",
		);
		expect(messages).toHaveLength(1);
		expect(messages[0].messageId).toBe("undefinedToken");
		expect(messages[0].message).toContain("--bp-xs");
	});
});
