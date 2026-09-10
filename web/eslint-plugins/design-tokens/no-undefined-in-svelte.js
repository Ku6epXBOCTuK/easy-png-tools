// Rule: NO UNDEFINED CSS-TOKEN USAGE IN COMPONENTS.
// A var(--...) referenced in a Svelte <style> block must exist in the design
// token file (src/app.css) or be a local override defined in the same
// component. Catches typos and drop-in tokens that were never added to the
// "single source of truth".

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getStyleNodeLoc, getStyleRoot } from "./style-context.js";

// A custom property DEFINITION: "--x:" followed by a colon.
const DEFINED_RE = /--[\w-]+(?=\s*:)/g;
// A var() REFERENCE (primary argument only — fallbacks are optional overrides).
const VAR_REF_RE = /var\(\s*(--[\w-]+)/g;

const definedCache = new Map();

function getDefinedTokens(cwd) {
	const file = resolve(cwd, "src/app.css");
	if (!existsSync(file)) return null;
	if (definedCache.has(file)) return definedCache.get(file);

	const content = readFileSync(file, "utf-8");
	const tokens = new Set();
	for (const match of content.matchAll(DEFINED_RE)) {
		tokens.add(match[0]);
	}
	definedCache.set(file, tokens);
	return tokens;
}

export default {
	meta: {
		type: "problem",
		docs: {
			description:
				"Disallow referencing a CSS variable that is not defined in app.css (design token file) and not defined locally in the component.",
			category: "Design tokens",
			recommended: true,
		},
		messages: {
			undefinedToken:
				"CSS variable '{{token}}' is not defined in app.css and not locally in this component.",
		},
		schema: [],
	},
	create(context) {
		const root = getStyleRoot(context);
		if (!root) return {};
		const styleNodeLoc = getStyleNodeLoc(context);

		const globalTokens = getDefinedTokens(context.cwd);
		if (!globalTokens) return {};

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

				// Custom properties defined INSIDE this component count as defined.
				const localTokens = new Set();
				root.walkDecls((decl) => {
					if (decl.prop?.startsWith("--")) localTokens.add(decl.prop);
				});

				const checkValue = (node, text) => {
					if (!text) return;
					let match;
					VAR_REF_RE.lastIndex = 0;
					while ((match = VAR_REF_RE.exec(text)) !== null) {
						const token = match[1];
						if (globalTokens.has(token) || localTokens.has(token)) continue;
						report(node, "undefinedToken", { token });
					}
				};

				root.walkDecls((decl) => checkValue(decl, decl.value ?? ""));
				root.walkAtRules((atRule) => checkValue(atRule, atRule.params ?? ""));
			},
		};
	},
};
