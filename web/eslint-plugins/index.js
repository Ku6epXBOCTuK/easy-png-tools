/**
 * Local ESLint plugin "design-tokens".
 *
 * Goal: a single source of truth for design. In Svelte components, hardcoded
 * colors and sizes are banned; everything must come from CSS variables (tokens
 * in preview.css). Rules inspect the postcss AST of Svelte <style> blocks
 * exposed by svelte-eslint-parser.
 */
import noCategoryMismatch from "./design-tokens/no-category-mismatch.js";
import noHardcodedInSvelte from "./design-tokens/no-hardcoded-in-svelte.js";
import noTokenDefinitionInSvelte from "./design-tokens/no-token-definition-in-svelte.js";
import noUndefinedInSvelte from "./design-tokens/no-undefined-in-svelte.js";

export default {
	meta: {
		name: "design-tokens",
		version: "0.2.0",
	},
	rules: {
		"no-hardcoded-in-svelte": noHardcodedInSvelte,
		"no-category-mismatch": noCategoryMismatch,
		"no-token-definition-in-svelte": noTokenDefinitionInSvelte,
		"no-undefined-in-svelte": noUndefinedInSvelte,
	},
};
