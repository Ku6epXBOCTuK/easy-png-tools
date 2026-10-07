// Rule: NO HARDCODED USER TEXT IN SVELTE TEMPLATES. Every user-visible
// string must come from the dictionaries via t(); a literal silently ships
// English to the RU locale. Warn-only report-only pilot. Exclusion list
// (brand, units, registry strings, /kit): web/eslint-plugins/README.md.

import { USER_TEXT_ATTRS } from "./lists.js";

// Formats, units and axis markers that look like words but are not copy.
const TECH_WORDS = new Set([
	"png",
	"webp",
	"jpg",
	"jpeg",
	"bmp",
	"gif",
	"svg",
	"zip",
	"hct",
	"oklch",
	"rgb",
	"rgba",
	"px",
	"em",
	"rem",
	"ms",
	"s",
	"x",
	"y",
	"kb",
	"mb",
	"gb",
	"dpi",
	"bit",
	"bits",
	"i18n",
	"l10n",
	"url",
	"uuid",
	"v1",
	"v2",
]);

// Tokens made only of digits, separators and technical characters.
const TECHNICAL_ONLY_RE = /^[\d\s.,:;·×x/%()[\]{}+\-–—*=<>!?&#@'"`|~^$]*$/i;

// A file name, an extension, a version, a dimension pair, a size with a unit.
const TECH_TOKEN_RE =
	/(\.(png|webp|jpg|jpeg|bmp|gif|svg|zip|json|ts|svelte|css|md)\b)|(\bv?\d+(\.\d+)+\b)|(\d+\s*[×x]\s*\d+)|(\d+(\.\d+)?\s*(px|em|rem|%|px|s\b))/i;

/** Collapse whitespace so mixed content like "Result  px" can be judged. */
function normalize(value) {
	return value.replace(/\s+/g, " ").trim();
}

/**
 * True when the fragment carries a word that a user is meant to read.
 */
export function hasUserWords(raw, allowWords = []) {
	const text = normalize(raw);
	if (text === "") return false;
	if (TECHNICAL_ONLY_RE.test(text)) return false;

	// Registry source strings and other shouted identifiers are not copy.
	if (/^[A-Z0-9_ -]+$/.test(text) && /[A-Z]/.test(text)) return false;

	const allowed = new Set(allowWords.map((word) => word.toLowerCase()));
	const words = text.split(/[\s·×]+/).filter(Boolean);
	const candidates = [];
	for (const word of words) {
		// "512", "64", "0.3" and friends carry no letters at all.
		if (!/[A-Za-z]/.test(word)) continue;
		if (TECH_TOKEN_RE.test(word)) continue;
		if (TECH_WORDS.has(word.toLowerCase())) continue;
		// Brand and product names are configured per repository, not hardcoded here.
		if (allowed.has(word.toLowerCase())) continue;
		candidates.push(word);
	}
	return candidates.length > 0;
}

function reportLiteral(context, node, value, kind) {
	context.report({
		node,
		messageId: "hardcodedText",
		data: { value, kind },
	});
}

// svelte-eslint-parser exposes an attribute value as a LIST of nodes, so a
// quoted literal is `value[0]`. Anything else ({expr}, spread, no value) means
// the text is computed elsewhere and is out of scope.
function literalValue(attr) {
	const parts = Array.isArray(attr.value) ? attr.value : [attr.value];
	const first = parts.find((part) => part && typeof part === "object");
	if (!first || first.type !== "SvelteLiteral") return null;
	return typeof first.value === "string" ? first.value : null;
}

export default {
	meta: {
		type: "suggestion",
		docs: {
			description:
				"Warn on hardcoded user-visible text in Svelte templates; use t() from the dictionaries.",
			category: "i18n",
			recommended: false,
		},
		messages: {
			hardcodedText:
				"Hardcoded user text ({{kind}}): '{{value}}'. Use t() with a key in both locale dictionaries.",
		},
		schema: [
			{
				type: "object",
				properties: {
					allowWords: {
						type: "array",
						items: { type: "string" },
					},
				},
				additionalProperties: false,
			},
		],
	},
	create(context) {
		const { allowWords = [] } = context.options[0] ?? {};
		const program = context.sourceCode?.ast ?? context.parserServices?.ast;

		function visitTemplate(nodes) {
			for (const node of nodes ?? []) {
				// <style> and <script> content is code, not copy. Their raw text
				// arrives as a text child, so the elements are skipped wholesale.
				if (node.type === "SvelteStyleElement") continue;
				if (node.type === "SvelteScriptElement") continue;
				if (node.type === "SvelteText") {
					if (hasUserWords(node.value, allowWords)) {
						reportLiteral(context, node, normalize(node.value), "text");
					}
					continue;
				}
				if (node.type === "SvelteElement") {
					for (const attr of node.startTag?.attributes ?? []) {
						const name = attr.key?.name;
						if (typeof name !== "string") continue;
						if (!USER_TEXT_ATTRS.has(name)) continue;
						const value = literalValue(attr);
						if (value === null) continue;
						if (hasUserWords(value, allowWords)) {
							reportLiteral(
								context,
								attr,
								normalize(value),
								`${name} attribute`,
							);
						}
					}
				}
				visitTemplate(node.children);
			}
		}

		return {
			"Program:exit"() {
				visitTemplate(program?.body);
			},
		};
	},
};
