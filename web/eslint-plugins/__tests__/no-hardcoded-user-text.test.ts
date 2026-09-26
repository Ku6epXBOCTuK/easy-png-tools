// Tests for the i18n/no-hardcoded-user-text rule
// (web/eslint-plugins/i18n/no-hardcoded-user-text.js).
//
// The rule is a pure AST check over the Svelte template, so it runs through the
// standard RuleTester with svelte-eslint-parser + the TS sub-parser. The
// exclusion list (brand, formats, units, registry source strings) is the whole
// point of the pilot, so every exclusion has a case here.
import { RuleTester } from "eslint";
import svelteParser from "svelte-eslint-parser";
import tseslint from "typescript-eslint";
import { describe, expect, it } from "vitest";
import rule, { hasUserWords } from "../i18n/no-hardcoded-user-text.js";
import { asRuleModule } from "./helpers.js";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
	languageOptions: {
		parser: svelteParser,
		parserOptions: { parser: tseslint.parser },
	},
});

const OPTIONS = [{ allowWords: ["easy-png-tools"] }];

ruleTester.run("no-hardcoded-user-text", asRuleModule(rule), {
	valid: [
		// Translated text comes from t(), never from a literal.
		{ code: '<p>{t("ui.reset")}</p>', filename: "Component.svelte" },
		{
			code: '<Button label={t("actions.download")} />',
			filename: "Component.svelte",
		},
		// Formats, units and file names are not copy.
		{ code: "<p>PNG</p>", filename: "Component.svelte" },
		{ code: "<p>result.png</p>", filename: "Component.svelte" },
		{ code: "<p>512×512</p>", filename: "Component.svelte" },
		{ code: '<span class="u">px</span>', filename: "Component.svelte" },
		{ code: "<p>1.0 s</p>", filename: "Component.svelte" },
		{ code: "<p>v0.1.0</p>", filename: "Component.svelte" },
		// Registry source strings and other shouted identifiers.
		{ code: "<p>BACKGROUND</p>", filename: "Component.svelte" },
		{ code: '<StepCard type="TRANSFORM" />', filename: "Component.svelte" },
		// Technical attributes are out of scope.
		{
			code: '<Button variant="outline" tone="danger" size="lg" />',
			filename: "Component.svelte",
		},
		{
			code: '<a href="/tools/resize-png">{t("nav.home")}</a>',
			filename: "x.svelte",
		},
		// Values written as expressions are computed elsewhere.
		{
			code: "<p>{value}</p>",
			filename: "Component.svelte",
		},
		{
			code: "<EmptyState title={copy} description={hint} />",
			filename: "Component.svelte",
		},
		// Brand configured as an allowed word.
		{
			code: "<span>easy-png-tools</span>",
			filename: "Component.svelte",
			options: OPTIONS,
		},
		{
			code: "<footer><span>easy-png-tools</span><span>v0.1.0</span></footer>",
			filename: "Component.svelte",
			options: OPTIONS,
		},
		// <style> and <script> bodies are code, not copy.
		{
			code: '<p>{t("ui.reset")}</p>\n<style>.a { color: red; }</style>',
			filename: "Component.svelte",
			options: OPTIONS,
		},
		{
			code: '<script>const hint = "internal message";</script>\n<p>{t("ui.reset")}</p>',
			filename: "Component.svelte",
			options: OPTIONS,
		},
	],
	invalid: [
		{
			code: "<p>Visible text</p>",
			filename: "Component.svelte",
			errors: [{ messageId: "hardcodedText" }],
		},
		{
			code: '<span class="axis-label">From</span>',
			filename: "Component.svelte",
			errors: [{ messageId: "hardcodedText" }],
		},
		{
			code: '<Button label="Download result" />',
			filename: "Component.svelte",
			errors: [{ messageId: "hardcodedText" }],
		},
		{
			code: '<Button label="outline" variant="outline" />',
			filename: "Component.svelte",
			errors: [{ messageId: "hardcodedText" }],
		},
		{
			code: '<ImageCard alt="Preview of the processed image" />',
			filename: "Component.svelte",
			errors: [{ messageId: "hardcodedText" }],
		},
		{
			// Mixed content: the text part carries copy, the unit part does not.
			code: "<p>Result {value} px</p>",
			filename: "Component.svelte",
			errors: [{ messageId: "hardcodedText" }],
		},
		{
			// Navigation copy is user text too.
			code: '<a href="/tools/resize-png">Home</a>',
			filename: "Component.svelte",
			errors: [{ messageId: "hardcodedText" }],
		},
		{
			// Nested elements are walked too.
			code: "<div><span><b>Delete file</b></span></div>",
			filename: "Component.svelte",
			errors: [{ messageId: "hardcodedText" }],
		},
		{
			// Without the option the brand word is reported: the exclusion is
			// configuration, not a hardcoded constant inside the rule.
			code: "<span>easy-png-tools</span>",
			filename: "Component.svelte",
			errors: [{ messageId: "hardcodedText" }],
		},
	],
});

describe("hasUserWords", () => {
	it("accepts technical fragments", () => {
		for (const value of [
			"",
			"   ",
			"px",
			"512×512",
			"result.png",
			"1.0 s",
			"v0.1.0",
			"× ·",
			"BACKGROUND",
			"·",
		]) {
			expect(hasUserWords(value), value).toBe(false);
		}
	});

	it("accepts configured brand words", () => {
		expect(hasUserWords("easy-png-tools", ["easy-png-tools"])).toBe(false);
		expect(hasUserWords("easy-png-tools")).toBe(true);
	});

	it("accepts formats and units next to real copy", () => {
		expect(hasUserWords("PNG 512×512")).toBe(false);
		expect(hasUserWords("Result PNG")).toBe(true);
	});
});
