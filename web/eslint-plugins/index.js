/**
 * Local ESLint plugin "design-tokens": hardcoded colors/sizes are banned in
 * Svelte <style> blocks, everything comes from CSS tokens in app.css.
 * Rule details: web/eslint-plugins/README.md.
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
