/**
 * Local ESLint plugin "conventions".
 *
 * Cross-cutting code conventions that the recommended rule sets don't enforce
 * (and plain @typescript-eslint rules cannot express in one shot):
 *
 *   - interface-props: Svelte 5 props always go through a local `interface
 *     Props` + `let { ... }: Props = $props()` (no inline generics, no inline
 *     type imports, no untyped destructuring);
 *   - no-string-union-alias: string-literal union aliases (`type Kind = 'a' |
 *     'b'`) are banned in favor of a single `as const` object + indexed access,
 *     so literal sets live in exactly one place.
 *
 * Rules are AST-only (no filesystem), see the tests in eslint-plugins/__tests__.
 */
import interfaceProps from "./interface-props.js";
import noStringUnionAlias from "./no-string-union-alias.js";

export default {
	meta: {
		name: "conventions",
		version: "0.1.0",
	},
	rules: {
		"interface-props": interfaceProps,
		"no-string-union-alias": noStringUnionAlias,
	},
};
