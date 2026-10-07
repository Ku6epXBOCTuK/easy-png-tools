// Rule: COMMENTS IN ENGLISH ONLY. Whitelist, not blacklist: a comment must
// be plain ASCII, so Arabic/CJK/Korean are caught just like Cyrillic.
// Intentional glyphs go to the allowChars option. String literals are NOT
// checked: localized dictionary values legitimately contain other scripts.
// Details: web/eslint-plugins/README.md.

export default {
	meta: {
		type: "suggestion",
		docs: {
			description:
				"Require comments to be written in English (ASCII whitelist; exceptions via allowChars).",
			category: "Conventions",
			recommended: false,
		},
		schema: [
			{
				type: "object",
				properties: {
					allowChars: {
						type: "array",
						items: { type: "string", minLength: 1, maxLength: 1 },
						uniqueItems: true,
					},
				},
				additionalProperties: false,
			},
		],
		messages: {
			nonAscii:
				"Comment contains non-ASCII text ({{chars}}). Write comments in English; localized user-facing strings belong in lib/i18n dictionaries.",
		},
	},
	create(context) {
		const allowed = new Set(context.options[0]?.allowChars ?? []);
		return {
			Program() {
				for (const comment of context.sourceCode.getAllComments()) {
					const offenders = new Set();
					for (const match of comment.value.matchAll(
						// eslint-disable-next-line no-control-regex -- the printable-ASCII whitelist needs explicit control escapes
						/[^\x09\x0A\x0D\x20-\x7E]/g,
					)) {
						if (!allowed.has(match[0])) offenders.add(match[0]);
					}
					if (offenders.size === 0) continue;
					context.report({
						loc: comment.loc,
						messageId: "nonAscii",
						data: {
							chars: [...offenders]
								.map(
									(c) =>
										`'${c}' (U+${c.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")})`,
								)
								.join(", "),
						},
					});
				}
			},
		};
	},
};
