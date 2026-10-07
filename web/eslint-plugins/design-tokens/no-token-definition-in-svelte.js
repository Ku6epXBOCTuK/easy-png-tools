// Rule: NO DESIGN PRIMITIVE IN COMPONENT TOKEN DEFINITIONS (variant A).
// A custom property may be DEFINED in a component's <style>, but its value
// must not introduce a design primitive (raw color, absolute size): the
// design surface stays in app.css, while local DERIVED variables (var(),
// calc(), unitless ratios) remain legitimate.

import { COLOR_LITERAL, FORBIDDEN_SIZE_TOKEN } from "./lists.js";
import { getStyleNodeLoc, getStyleRoot } from "./style-context.js";

// Sub-rule: stripe var(...) bodies out of a value, so tokens inside are never
// mistaken for literals.
const stripVars = (value) => value.replace(/var\([^)]*\)/g, "");

export default {
	meta: {
		type: "suggestion",
		docs: {
			description:
				"Ban defining a custom property whose value introduces a raw color or size primitive in a Svelte <style> block; primitives belong in the design CSS file. Derived var()/calc()/unitless values are allowed.",
			category: "Design tokens",
			recommended: true,
		},
		messages: {
			tokenPrimitive:
				"Custom property '{{prop}}' defines a primitive '{{value}}' in a component. Move it to app.css or derive it from tokens via var()/calc().",
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

				// Only inspect custom property DEFINITIONS (--foo: value).
				root.walkDecls((decl) => {
					const prop = decl.prop ?? "";
					if (!prop.startsWith("--")) return;

					const value = decl.value ?? "";
					if (value.trim() === "") return;

					const primitive = stripVars(value);

					// A color literal in the definition is a primitive.
					const colorHit = primitive.match(COLOR_LITERAL);
					if (colorHit) {
						report(decl, "tokenPrimitive", {
							prop,
							value: colorHit[0].trim(),
						});
						return;
					}

					// An absolute size (px/rem/em) in the definition is a primitive.
					const sizeHit = primitive.match(FORBIDDEN_SIZE_TOKEN);
					if (sizeHit) {
						report(decl, "tokenPrimitive", {
							prop,
							value: sizeHit[0],
						});
					}
				});
			},
		};
	},
};
