// Shared harness for testing the custom ESLint rules in eslint-plugins/.
//
// Two strategies, picked per rule in the test files:
//   - RuleTester (eslint)  — pure string cases, no filesystem. Best fit for the
//     design-tokens rules that only inspect the postcss AST of Svelte `<style>`.
//   - Linter API + fixtures — needed when a rule reads real files. The isolation
//     rule resolves imports via fs (targets must exist on disk) and
//     no-undefined-in-svelte reads <cwd>/src/app.css for the token dictionary.
//     `verifyInFixtures` runs a rule with cwd fixed to `__fixtures__/`, so both
//     work without touching process.cwd() or the real src/ tree.
import { Linter } from "eslint";
import type { Rule } from "eslint";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));

export const FIXTURES_DIR = path.resolve(HERE, "../__fixtures__");
export const FIXTURES_SRC = path.join(FIXTURES_DIR, "src");

/** Flat-config shape the Linter.verify accepts. */
export type FlatConfig = Parameters<Linter["verify"]>[1];

/**
 * Run a rule (or a config) against `code` as if it were the fixture file
 * `relFile` under `__fixtures__/src`. Returns the lint messages.
 */
export function verifyInFixtures(
	config: FlatConfig,
	code: string,
	relFile: string,
) {
	const linter = new Linter({ configType: "flat", cwd: FIXTURES_DIR });
	return linter.verify(code, config, path.join(FIXTURES_SRC, relFile));
}

/** Wrap a script body into a minimal Svelte component (runs in runes mode). */
export function svelteComponent(script: string): string {
	return `<main>Hello</main>\n\n<script lang="ts">\n${script}\n</script>\n`;
}

/**
 * Narrow an inferred JS rule to the typed `Rule.RuleModule`. The plugin rule
 * files are plain JS, so TypeScript infers a widened shape (`meta.type: string`)
 * that `RuleTester.run` rejects; the shape is structurally correct at runtime,
 * which is why existing rules keep their JS inference and only the tests cast.
 */
export function asRuleModule(rule: unknown): Rule.RuleModule {
	return rule as Rule.RuleModule;
}
