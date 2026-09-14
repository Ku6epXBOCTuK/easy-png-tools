// Tests for i18n/dict-consistency (web/eslint-plugins/i18n/dict-consistency.js).
//
// The rule reads its own dict dir from disk (LOCALES in dict.ts + sibling
// locale files), so it runs through the Linter API with cwd pinned to the
// fixture tree (see __tests__/helpers.ts). The committed fixtures at
// __fixtures__/src/lib/i18n/ are mutually consistent (zero-warn) — tests feed
// MODIFIED variants of en.ts / ru.ts as the linted code so each check is
// exercised against the on-disk references.
//
// Reporting contract: each file reports only its OWN gaps. A key missing in a
// file produces exactly ONE `missingKey` warning, emitted on the incomplete
// file itself (the union of all keys comes from the on-disk dicts), regardless
// of how many other locales have the key. Placeholder parity is compared
// against the canonical set — the one shared by the most locales (ties by
// LOCALES order) — so a deviation is reported exactly once.
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import tseslint from "typescript-eslint";
import dictConsistency from "../i18n/dict-consistency.js";
import {
	asRuleModule,
	FIXTURES_SRC,
	verifyInFixtures,
	type FlatConfig,
} from "./helpers.js";

const I18N_DIR = path.join(FIXTURES_SRC, "lib", "i18n");

const fixture = (name: string) =>
	fs.readFileSync(path.join(I18N_DIR, name), "utf8");

function lint(code: string, relFile: string, options?: unknown) {
	const rule = options ? ["warn", options] : "warn";
	const config: FlatConfig = [
		{ files: ["**/*.ts"], languageOptions: { parser: tseslint.parser } },
		{
			files: ["**/*.ts"],
			plugins: {
				i18n: {
					rules: { "dict-consistency": asRuleModule(dictConsistency) },
				},
			},
			rules: { "i18n/dict-consistency": rule as "warn" },
		},
	];
	return verifyInFixtures(config, code, relFile);
}

function messageIds(messages: { messageId?: string }[]) {
	return messages.map((m) => m.messageId);
}

describe("i18n/dict-consistency", () => {
	it("stays clean on the consistent fixture dicts", () => {
		expect(messageIds(lint(fixture("en.ts"), "lib/i18n/en.ts"))).toEqual([]);
		expect(messageIds(lint(fixture("ru.ts"), "lib/i18n/ru.ts"))).toEqual([]);
		expect(messageIds(lint(fixture("de.ts"), "lib/i18n/de.ts"))).toEqual([]);
	});

	it("flags a leaf key missing in the current file", () => {
		const enMissing = fixture("en.ts").replace(
			'\t\trestoreLast: "Restore {title}",',
			"",
		);
		const messages = lint(enMissing, "lib/i18n/en.ts");
		expect(messages).toHaveLength(1);
		expect(messageIds(messages)).toEqual(["missingKey"]);
		expect(messages[0].message).toContain('"home.restoreLast"');
		expect(messages[0].message).toContain(" in en");
	});

	it("reports a missing whole section once, not per child key", () => {
		const enNoHeader = fixture("en.ts").replace(/\theader: \{[\s\S]*?\},/, "");
		const messages = lint(enNoHeader, "lib/i18n/en.ts");
		expect(messageIds(messages)).toEqual(["missingKey"]);
		expect(messages[0].message).toContain('"header"');
		expect(messages[0].message).not.toContain("header.workspace");
	});

	it("emits ONE warning per gap even when several locales own the key", () => {
		const enMissing = fixture("en.ts").replace(
			'\t\tsourceRequired: "Source image required",',
			"",
		);
		const messages = lint(enMissing, "lib/i18n/en.ts");
		expect(messages).toHaveLength(1);
		expect(messageIds(messages)).toEqual(["missingKey"]);
		expect(messages[0].message).toContain('"errors.sourceRequired"');
		expect(messages[0].message).toContain(" in en");
	});

	it("flags empty and whitespace-only values", () => {
		const enEmpty = fixture("en.ts")
			.replace('workspace: "Workspace",', 'workspace: "",')
			.replace('catalog: "Catalog",', 'catalog: "   ",');
		const messages = lint(enEmpty, "lib/i18n/en.ts");
		expect(messageIds(messages)).toEqual(["emptyValue", "emptyValue"]);
		expect(messages[0].message).toContain('"header.workspace"');
		expect(messages[0].message).toContain(" in en");
		expect(messages[1].message).toContain('"header.catalog"');
	});

	it("flags a placeholder lost in translation (vs the canonical set)", () => {
		const ruLostPlaceholder = fixture("ru.ts").replace(
			'hero: "Привет, {name}!",',
			'hero: "Привет!",',
		);
		const messages = lint(ruLostPlaceholder, "lib/i18n/ru.ts");
		expect(messages).toHaveLength(1);
		expect(messageIds(messages)).toEqual(["placeholderMismatch"]);
		expect(messages[0].message).toContain('"home.hero"');
		expect(messages[0].message).toContain("{} vs expected {name}");
	});

	it("flags an extra placeholder introduced in one locale", () => {
		const enExtraPlaceholder = fixture("en.ts").replace(
			'description: "Draws a {kind} frame.",',
			'description: "Draws a {kind} frame by {author}.",',
		);
		const messages = lint(enExtraPlaceholder, "lib/i18n/en.ts");
		expect(messages).toHaveLength(1);
		expect(messageIds(messages)).toEqual(["placeholderMismatch"]);
		expect(messages[0].message).toContain('"tools.addBorder.description"');
		expect(messages[0].message).toContain("{author, kind} vs expected {kind}");
	});

	it("honours allowPaths for conscious deviations", () => {
		const enMissing = fixture("en.ts").replace(
			'\t\tsourceRequired: "Source image required",',
			"",
		);
		const messages = lint(enMissing, "lib/i18n/en.ts", {
			allowPaths: ["errors.sourceRequired"],
		});
		expect(messageIds(messages)).toEqual([]);
	});

	it("ignores files that are not locale dicts", () => {
		const notALocale = `
			export const helper = { a: "b" };
		`;
		expect(messageIds(lint(notALocale, "lib/i18n/t.ts"))).toEqual([]);
		expect(messageIds(lint(notALocale, "lib/i18n/misc.ts"))).toEqual([]);
	});
});
