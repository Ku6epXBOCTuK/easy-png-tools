// Rule: COMMENT FORMAT: bounded blocks and bounded density.
// maxBlockLines caps one comment block; maxRatio caps the share of comment
// lines in files with minLines+ non-blank lines. Warn-only tripwires:
// excess means refactor the code, not squeeze the comment.
// Details: web/eslint-plugins/README.md.

function lineSpan(comment) {
	return comment.loc.end.line - comment.loc.start.line + 1;
}

export default {
	meta: {
		type: "suggestion",
		docs: {
			description:
				"Cap comment block length and overall comment density per file.",
			category: "Conventions",
			recommended: false,
		},
		schema: [
			{
				type: "object",
				properties: {
					maxBlockLines: { type: "integer", minimum: 1 },
					maxRatio: { type: "number", minimum: 0, maximum: 1 },
					minLines: { type: "integer", minimum: 0 },
				},
				additionalProperties: false,
			},
		],
		messages: {
			blockTooLong:
				"Comment block is {{lines}} lines (limit {{max}}). Explain 'why' briefly; move 'what' into names, structure, or a linked doc.",
			tooDense:
				"Comments take {{percent}}% of this file (limit {{max}}%). Prefer extracting functions/modules over narrating the code.",
		},
	},
	create(context) {
		const maxBlockLines = context.options[0]?.maxBlockLines ?? 5;
		const maxRatio = context.options[0]?.maxRatio ?? 0.15;
		const minLines = context.options[0]?.minLines ?? 0;

		return {
			Program(node) {
				const sourceCode = context.sourceCode;
				const comments = sourceCode.getAllComments();
				if (comments.length === 0) return;

				const commentLines = new Set();
				let blockStart = comments[0];
				let blockEndLine = comments[0].loc.end.line;
				let blockLines = lineSpan(comments[0]);

				const flushBlock = () => {
					if (blockLines > maxBlockLines) {
						context.report({
							loc: blockStart.loc,
							messageId: "blockTooLong",
							data: { lines: String(blockLines), max: String(maxBlockLines) },
						});
					}
				};

				for (let i = 0; i < comments.length; i++) {
					const comment = comments[i];
					for (let l = comment.loc.start.line; l <= comment.loc.end.line; l++) {
						commentLines.add(l);
					}
					if (i === 0) continue;
					// Adjacent `//` lines form one block; anything else starts a new one.
					if (
						comment.type === "Line" &&
						comments[i - 1].type === "Line" &&
						comment.loc.start.line === blockEndLine + 1
					) {
						blockEndLine = comment.loc.end.line;
						blockLines += 1;
					} else {
						flushBlock();
						blockStart = comment;
						blockEndLine = comment.loc.end.line;
						blockLines = lineSpan(comment);
					}
				}
				flushBlock();

				const totalLines = sourceCode.lines.filter(
					(l) => l.trim() !== "",
				).length;
				const ratio = commentLines.size / totalLines;
				if (totalLines >= minLines && ratio > maxRatio) {
					context.report({
						loc: node.loc,
						messageId: "tooDense",
						data: {
							percent: (ratio * 100).toFixed(1),
							max: (maxRatio * 100).toFixed(1),
						},
					});
				}
			},
		};
	},
};
