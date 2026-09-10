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
