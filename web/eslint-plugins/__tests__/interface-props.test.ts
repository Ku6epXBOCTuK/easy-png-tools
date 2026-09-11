// Tests for the conventions/interface-props rule
// (web/eslint-plugins/conventions/interface-props.js).
//
// The rule is a pure AST check (no filesystem), so it runs through the standard
// RuleTester with svelte-eslint-parser + the TS sub-parser. No fixtures needed.
import { RuleTester } from "eslint";
import svelteParser from "svelte-eslint-parser";
import tseslint from "typescript-eslint";
import { describe, it } from "vitest";
import interfaceProps from "../conventions/interface-props.js";
import { asRuleModule, svelteComponent } from "./helpers.js";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
	languageOptions: {
		parser: svelteParser,
		parserOptions: { parser: tseslint.parser },
	},
});

const frame = (script: string) => ({
	code: svelteComponent(script),
	filename: "Component.svelte",
});

ruleTester.run("interface-props", asRuleModule(interfaceProps), {
	valid: [
		{ code: "<main>Hello</main>", filename: "Component.svelte" },
		frame("let x = 1;"),
		// $state / $derived calls are unrelated, not props.
		frame("const s = $state(0);"),
		frame("const doubled = $derived(s * 2);"),
		frame(
			"interface Props { label: string }\nlet { label }: Props = $props();",
		),
		frame(
			"interface Props { label: string }\nlet { label = 'x' }: Props = $props();",
		),
		frame(
			"interface Props { value: string }\nlet { value = $bindable() }: Props = $props();",
		),
		// Interface declared after the destructuring is still fine.
		frame(
			"let { label }: Props = $props();\ninterface Props { label: string }",
		),
		frame(
			"interface Props { id: string; rest?: unknown }\nlet { id, ...rest }: Props = $props();",
		),
		frame(
			"import type { Snippet } from 'svelte';\n" +
				"interface Props { children?: Snippet }\n" +
				"let { children }: Props = $props();",
		),
	],
	invalid: [
		{
			// Untyped destructuring with a local interface -> autofixable.
			...frame("interface Props { label: string }\nlet { label } = $props();"),
			output: svelteComponent(
				"interface Props { label: string }\nlet { label }: Props = $props();",
			),
			errors: [{ messageId: "untypedDestructure" }],
		},
		{
			// Untyped destructuring without an interface -> report, no fix.
			...frame("let { label } = $props();"),
			errors: [{ messageId: "untypedDestructure" }],
		},
		{
			// Binding the whole props object instead of destructuring.
			...frame("let props = $props();"),
			errors: [{ messageId: "noDestructure" }],
		},
		{
			// Inline generic is banned outright.
			...frame("const props = $props<{ a: string }>();"),
			errors: [{ messageId: "inlineGeneric" }],
		},
		{
			// A different type name than the local interface Props.
			...frame(
				"interface Props { a: string }\nlet { a }: StageProps = $props();",
			),
			errors: [{ messageId: "notNamedProps" }],
		},
		{
			// Inline object props type instead of interface Props.
			...frame("let { a }: { a: string } = $props();"),
			errors: [{ messageId: "inlineObjectType" }],
		},
		{
			// Reference to Props without any local declaration.
			...frame("let { a }: Props = $props();"),
			errors: [{ messageId: "missingInterface" }],
		},
	],
});
