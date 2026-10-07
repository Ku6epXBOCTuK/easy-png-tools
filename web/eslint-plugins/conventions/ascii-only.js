// Rule: ASCII-ONLY SOURCE (scoped to test files via eslint.config.js).
// Non-ASCII in test names and expectations hurts grep-ability and hides
// hardcoded localized strings; intentional glyphs go to the allowChars
// option. File-content based (not AST), one report per line.
// Details: web/eslint-plugins/README.md.

const DEFAULT_ALLOW = [];

export default {
	meta: {
		type: "suggestion",
		docs: {
			description:
				"Require ASCII-only source in scoped files (tests); exceptions go to the allowChars option.",
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
				"Non-ASCII character {{chars}} on this line. Tests are written in plain ASCII English; keep intentional glyphs in the rule's allowChars option.",
		},
	},
	create(context) {
		const allowed = new Set(context.options[0]?.allowChars ?? DEFAULT_ALLOW);
		return {
			Program() {
				const sourceCode = context.sourceCode;
				const text = sourceCode.getText();
				const reportedLines = new Set();
				// eslint-disable-next-line no-control-regex -- the printable-ASCII whitelist needs explicit control escapes
				for (const match of text.matchAll(/[^\x09\x0A\x0D\x20-\x7E]/g)) {
					const char = match[0];
					if (allowed.has(char)) continue;
					const loc = sourceCode.getLocFromIndex(match.index);
					if (reportedLines.has(loc.line)) continue;
					reportedLines.add(loc.line);
					context.report({
						loc,
						messageId: "nonAscii",
						data: {
							chars: `'${char}' (U+${char.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")})`,
						},
					});
				}
			},
		};
	},
};
