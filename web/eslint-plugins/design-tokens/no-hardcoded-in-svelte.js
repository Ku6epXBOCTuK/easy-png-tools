// Rule: NO HARDCODED COLORS / SIZES / DURATIONS / Z-INDEX IN COMPONENTS.
// Everything visual in a Svelte <style> block must come from design tokens
// (var(--...)); direct literals are banned. color-mix() is banned too — its
// result must be tokenized in the design CSS file.

import {
	COLOR_LITERAL,
	COLOR_PROPS,
	DURATION_PROPS,
	FORBIDDEN_DURATION_TOKEN,
	FORBIDDEN_SIZE_TOKEN,
	MIXED_PROPS,
	SIZE_PROPS,
} from "./lists.js";
import { getStyleNodeLoc, getStyleRoot } from "./style-context.js";

// Sub-rule: stripe var(...) bodies out of a value, so tokens inside are never
// mistaken for literals.
const stripVars = (value) => value.replace(/var\([^)]*\)/g, "");

export default {
	meta: {
		type: "suggestion",
		docs: {
			description:
				"Ban hardcoded colors, sizes, durations and z-index in Svelte <style> blocks; use CSS variables (design tokens).",
			category: "Design tokens",
			recommended: true,
		},
		messages: {
			hardcodedColor:
				"Hardcoded color '{{value}}' in '{{prop}}'. Use a var(--...) design token.",
			hardcodedSize:
				"Hardcoded size '{{value}}' in '{{prop}}'. Use a var(--...) design token.",
			hardcodedDuration:
				"Hardcoded duration '{{value}}' in '{{prop}}'. Use a var(--duration-...) token.",
			hardcodedZIndex:
				"Hardcoded z-index '{{value}}'. Use a var(--z-...) token.",
			hardcodedBreakpoint:
				"Hardcoded breakpoint '{{value}}' in @media. Use the @custom-media name instead: declare `@custom-media --bp-* (...)` in preview.css and write `@media (--bp-*)`.",
			varInMedia:
				"var() inside @media '{{value}}'. Custom properties do not resolve in media queries — declare `@custom-media --bp-* (...)` in preview.css and use `@media (--bp-*)`.",
			colorMix:
				"color-mix() in component ({{value}}). Tokenize the result in the design CSS file.",
		},
		schema: [],
	},
	create(context) {
		const root = getStyleRoot(context);
		if (!root) return {};
		const styleNodeLoc = getStyleNodeLoc(context);

		return {
			"Program:exit"(programNode) {
				const report = (node, ruleId, data) => {
					if (!styleNodeLoc) return;
					const loc = styleNodeLoc(node);
					context.report({
						node: programNode,
						loc,
						ruleId,
						messageId: ruleId,
						data,
					});
				};

				// =====================================================================
				// 3) NO HARDCODED BREAKPOINTS IN @media
				//    @media conditions must use --bp-* tokens, not raw lengths.
				//    Regex: (max|min)-width followed by a NON-var(() number.
				// =====================================================================
				const BREAKPOINT_RE =
					/(?:(?:max|min)-width)\s*:\s*(?!var\()(\d+(?:\.\d+)?(?:px|rem|em))/gi;

				// Custom properties do not resolve inside @media conditions, so any
				// var(--bp-*) inside @media is a latent bug — the block never applies.
				const VAR_IN_MEDIA_RE = /var\(\s*(--[a-zA-Z0-9-]+)/g;

				// Sub-rule 6: color-mix() is banned anywhere in a component style.
				const COLOR_MIX_RE = /color-mix\s*\(/gi;

				// --- @media breakpoints --- //
				root.walkAtRules("media", (atRule) => {
					const params = atRule.params ?? "";
					let m;
					BREAKPOINT_RE.lastIndex = 0;
					while ((m = BREAKPOINT_RE.exec(params)) !== null) {
						report(atRule, "hardcodedBreakpoint", { value: m[1] });
					}
					VAR_IN_MEDIA_RE.lastIndex = 0;
					while ((m = VAR_IN_MEDIA_RE.exec(params)) !== null) {
						report(atRule, "varInMedia", { value: m[1] });
					}
				});

				// --- declarations --- //
				root.walkDecls((decl) => {
					const prop = decl.prop ?? "";
					const value = decl.value ?? "";

					// Sub-rule 6: color-mix in any property.
					if (COLOR_MIX_RE.test(value)) {
						report(decl, "colorMix", { value: value.trim() });
					}

					// Sub-rule 4: durations in transition/animation props.
					if (DURATION_PROPS.test(prop)) {
						const withoutVars = stripVars(value);
						const m = withoutVars.match(FORBIDDEN_DURATION_TOKEN);
						if (m) {
							report(decl, "hardcodedDuration", { prop, value: m[0] });
						}
					}

					// Sub-rule 7: z-index must come from a var(--z-...).
					if (prop === "z-index") {
						const withoutVars = stripVars(value).trim();
						if (/^-?\d+$/.test(withoutVars)) {
							report(decl, "hardcodedZIndex", { value: withoutVars });
						}
					}

					// Only inspect known layout properties from here on.
					if (!COLOR_PROPS.test(prop) && !SIZE_PROPS.test(prop)) return;

					// Sub-rule 2: sizes.
					// Fire only on a real remaining px/rem/em token — percentages
					// (width: 80%) and unitless values (line-height: 1.5) stay legal.
					// The only legal absolute length is a 0px reset line.
					// MIXED_PROPS (border/outline shorthands) are checked for their
					// SIZE half too — a border width must come from var(--size-*).
					if (SIZE_PROPS.test(prop) || MIXED_PROPS.test(prop)) {
						const withoutVars = stripVars(value);
						const reported = new Set();
						for (const match of withoutVars.matchAll(FORBIDDEN_SIZE_TOKEN)) {
							const shown = match[0];
							if (shown !== "0px" && !reported.has(shown)) {
								reported.add(shown);
								report(decl, "hardcodedSize", { prop, value: shown });
							}
						}
					}

					// Sub-rule 1: colors.
					// Remaining value must be only allowed keywords
					// (currentColor/transparent/inherit/none/0); otherwise a color
					// literal is reported.
					if (COLOR_PROPS.test(prop)) {
						const withoutVars = stripVars(value);
						const withoutKeywords = withoutVars
							.replace(
								/\b(?:currentcolor|transparent|inherit|none|initial|unset|revert)\b/gi,
								"",
							)
							.trim();
						if (withoutKeywords !== "" && withoutKeywords !== "0") {
							const reported = new Set();
							for (const match of value.matchAll(COLOR_LITERAL)) {
								const shown = match[0].trim();
								if (!reported.has(shown)) {
									reported.add(shown);
									report(decl, "hardcodedColor", { prop, value: shown });
								}
							}
						}
					}
				});
			},
		};
	},
};
