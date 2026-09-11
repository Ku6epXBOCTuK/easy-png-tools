// Tests for the isolation rule (web/eslint-plugins/isolation/no-mixed-imports.js).
//
// The rule RESOLVES import specifiers to real files (via $lib alias and
// relative ../ paths), so every import target must exist on disk. It therefore
// runs through the Linter API with cwd pinned to the committed fixture tree
// (__fixtures__/src) — see __tests__/helpers.ts.
//
// Side map (mirrors the defaults in no-mixed-imports.js):
//   old   -> routes/v1/**, lib/v1/**
//   new   -> routes/** (minus v1), lib/components/**, lib/registry/** + a few
//   shared-> everything else: core/, i18n/, theme, ...
import { describe, expect, it } from "vitest";
import noMixedImports from "../isolation/no-mixed-imports.js";
import { asRuleModule, verifyInFixtures, type FlatConfig } from "./helpers.js";

const isolationConfig: FlatConfig = [
	{
		files: ["**/*.{ts,svelte}"],
		plugins: {
			isolation: {
				rules: { "no-mixed-imports": asRuleModule(noMixedImports) },
			},
		},
		rules: { "isolation/no-mixed-imports": "error" },
	},
];

const messagesFor = (relFile: string, code: string) =>
	verifyInFixtures(isolationConfig, code, relFile);

/** Assert a single "noMixed" violation with the given sides. */
function expectViolation(
	relFile: string,
	code: string,
	side: string,
	target: string,
) {
	const messages = messagesFor(relFile, code);
	expect(messages).toHaveLength(1);
	expect(messages[0].messageId).toBe("noMixed");
	// ESLint interpolates `data` into the message text (no `data` field on the
	// returned message), so assert on the rendered message instead.
	expect(messages[0].message).toContain(`"${side}" file imports "${target}"`);
}

/** Assert the import is allowed (no violations). */
function expectClean(relFile: string, code: string) {
	expect(messagesFor(relFile, code)).toEqual([]);
}

describe("isolation/no-mixed-imports", () => {
	it("flags an old file importing a new component", () => {
		expectViolation(
			"lib/v1/old.ts",
			'import { c } from "../components/CheckerCanvas.svelte";',
			"old",
			"new",
		);
	});

	it("flags a new route importing an old module through the $lib alias", () => {
		expectViolation(
			"routes/+page.svelte",
			'import { o } from "$lib/v1/old";',
			"new",
			"old",
		);
	});

	it("flags a new component importing old code via a relative path", () => {
		expectViolation(
			"lib/components/CheckerCanvas.svelte",
			'import { o } from "../v1/old.ts";',
			"new",
			"old",
		);
	});

	it("allows old -> shared (core via relative path)", () => {
		expectClean("lib/v1/old.ts", 'import { e } from "../core/errors";');
	});

	it("allows old -> shared (i18n and theme via $lib)", () => {
		expectClean("routes/v1/+layout.svelte", 'import { t } from "$lib/i18n/t";');
		expectClean(
			"routes/v1/+layout.svelte",
			'import { g } from "$lib/theme.svelte";',
		);
	});

	it("allows new -> shared and new -> new", () => {
		expectClean("routes/+page.svelte", 'import { t } from "$lib/i18n/t";');
		expectClean(
			"routes/+page.svelte",
			'import { b } from "$lib/components/ui/Button.svelte";',
		);
	});

	it("leaves shared files unrestricted in both directions", () => {
		expectClean("lib/i18n/t.ts", 'import { o } from "$lib/v1/old";');
		expectClean(
			"lib/core/errors.ts",
			'import { c } from "$lib/components/CheckerCanvas.svelte";',
		);
	});
});
