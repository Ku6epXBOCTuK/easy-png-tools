// Rule: NO TOKEN-CATEGORY MISMATCH IN COMPONENTS.
// A size property (padding, gap, font-size ...) must use a SIZE token
// (--space-*, --size-*, --text-*, --radius-*, --bp-*, --z-*). A color property
// (color, background, border-color ...) must use a COLOR token
// (--color-*, --brand-*). Crossing categories (e.g. padding: var(--color-x))
// is a sign the wrong token is being reused.

import { COLOR_PROPS, COLOR_TOKEN, SIZE_PROPS, SIZE_TOKEN } from "./lists.js";
import { getStyleNodeLoc, getStyleRoot } from "./style-context.js";

// Collect the token names referenced by var() in a value.
const collectVars = (value) =>
	Array.from(value.matchAll(/var\(\s*(--[\w-]+)/g), (m) => m[1]);

export default {
	meta: {
		type: "suggestion",
		docs: {
			description:
				"Ban using a color token in size properties and a size token in color properties; each property must use tokens of its own category.",
			category: "Design tokens",
			recommended: true,
		},
		messages: {
			categoryMismatch:
				"Token '{{token}}' in '{{prop}}' belongs to the {{category}} category; expected a {{expected}} token.",
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

				root.walkDecls((decl) => {
					const prop = decl.prop ?? "";
					const value = decl.value ?? "";

					const isSizeProp = SIZE_PROPS.test(prop);
					const isColorProp = COLOR_PROPS.test(prop);
					if (!isSizeProp && !isColorProp) return;

					for (const token of collectVars(value)) {
						// A size property that holds a COLOR token.
						if (isSizeProp && COLOR_TOKEN.test(token)) {
							report(decl, "categoryMismatch", {
								token,
								prop,
								category: "color",
								expected: "size",
							});
						}
						// A color property that holds a SIZE token (z-radius/space/text...).
						if (isColorProp && SIZE_TOKEN.test(token)) {
							report(decl, "categoryMismatch", {
								token,
								prop,
								category: "size",
								expected: "color",
							});
						}
					}
				});
			},
		};
	},
};
