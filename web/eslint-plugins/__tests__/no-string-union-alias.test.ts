// Tests for the conventions/no-string-union-alias rule
// (web/eslint-plugins/conventions/no-string-union-alias.js).
//
// The rule is a pure AST check (no filesystem), so it runs through the standard
// RuleTester: plain .ts via the tseslint parser, and (because the rule is also
// enabled on new .svelte scripts) .svelte via the svelte tester. No fixtures.
import { RuleTester } from "eslint";
import svelteParser from "svelte-eslint-parser";
import tseslint from "typescript-eslint";
import { describe, it } from "vitest";
import noStringUnionAlias from "../conventions/no-string-union-alias.js";
import { asRuleModule, svelteComponent } from "./helpers.js";

RuleTester.describe = describe;
RuleTester.it = it;

const tsTester = new RuleTester({
	languageOptions: {
		parser: tseslint.parser,
	},
});

const svelteTester = new RuleTester({
	languageOptions: {
		parser: svelteParser,
		parserOptions: { parser: tseslint.parser },
	},
});

const frame = (script: string) => ({
	code: svelteComponent(script),
	filename: "Component.svelte",
});

tsTester.run("no-string-union-alias", asRuleModule(noStringUnionAlias), {
	valid: [
		{ code: "type X = 1 | 2;", filename: "types.ts" },
		{ code: "type X = 'a' | number;", filename: "types.ts" },
		{ code: "type X = string;", filename: "types.ts" },
		{ code: "const KIND = { a: 1, b: 2 } as const;", filename: "types.ts" },
		{ code: "function f(x: 'a' | 'b') {}", filename: "types.ts" },
		{ code: "const x: 'a' | 'b' = 'a';", filename: "types.ts" },
		{ code: "type X = 'a' | TemplateStrings;", filename: "types.ts" },
	],
	invalid: [
		{
			code: "type Kind = 'a' | 'b' | 'c';",
			filename: "types.ts",
			errors: [{ messageId: "stringUnion" }],
		},
		{
			// Nested/parenthesized unions still resolve to string literals.
			code: "type Kind = ('a' | 'b') | 'c';",
			filename: "types.ts",
			errors: [{ messageId: "stringUnion" }],
		},
		{
			code: "type Lang =\n\t'en'\n\t| 'ru';",
			filename: "types.ts",
			errors: [{ messageId: "stringUnion" }],
		},
	],
});

// The rule also runs on new .svelte files (their scripts are TS).
svelteTester.run(
	"no-string-union-alias (svelte script)",
	asRuleModule(noStringUnionAlias),
	{
		valid: [frame("type X = 1 | 2;"), frame("const M = { a: 1 } as const;")],
		invalid: [
			{
				...frame("type Kind = 'a' | 'b' | 'c';"),
				errors: [{ messageId: "stringUnion" }],
			},
		],
	},
);
