// Tests for the conventions/comment-format rule
// (web/eslint-plugins/conventions/comment-format.js).
//
// Pure AST check (comment nodes + line counts), standard RuleTester.
import { RuleTester } from "eslint";
import tseslint from "typescript-eslint";
import { describe, it } from "vitest";
import commentFormat from "../conventions/comment-format.js";
import { asRuleModule } from "./helpers.js";

RuleTester.describe = describe;
RuleTester.it = it;

const tester = new RuleTester({
	languageOptions: {
		parser: tseslint.parser,
	},
});

const longBlock = [
	"// one",
	"// two",
	"// three",
	"// four",
	"// five",
	"// six",
	"const x = 1;",
].join("\n");

tester.run("comment-format", asRuleModule(commentFormat), {
	// Density is off (maxRatio: 1) in the block-focused cases: tiny snippets
	// are comment-dominated by construction.
	valid: [
		{
			code: "// why\nconst x = 1;",
			filename: "a.ts",
			options: [{ maxRatio: 1 }],
		},
		{
			code: "// a\n// b\n// c\n// d\n// e\nconst x = 1;",
			filename: "a.ts",
			options: [{ maxRatio: 1 }],
		},
		{
			// Blank line breaks the run: two 3-line blocks, both under the cap.
			code: "// a\n// b\n// c\n\n// d\n// e\n// f\nconst x = 1;",
			filename: "a.ts",
			options: [{ maxRatio: 1 }],
		},
		{
			// Trailing inline comment does not extend the block above it.
			code: "// a\n// b\nconst x = 1; // tail",
			filename: "a.ts",
			options: [{ maxRatio: 1 }],
		},
		{
			// A wider block cap admits the same comment.
			code: longBlock,
			filename: "a.ts",
			options: [{ maxBlockLines: 6, maxRatio: 1 }],
		},
		{
			// Density is skipped below minLines: small files are exempt.
			code: "// a\n// b\nconst x = 1;\nconst y = 2;",
			filename: "a.ts",
			options: [{ maxBlockLines: 5, maxRatio: 0.4, minLines: 10 }],
		},
	],
	invalid: [
		{
			code: longBlock,
			filename: "a.ts",
			options: [{ maxRatio: 1 }],
			errors: [{ messageId: "blockTooLong" }],
		},
		{
			// A single block comment counts its full line span.
			code: "/*\n1\n2\n3\n4\n5\n6\n*/\nconst x = 1;",
			filename: "a.ts",
			options: [{ maxRatio: 1 }],
			errors: [{ messageId: "blockTooLong" }],
		},
		{
			// Density: 2 comment lines against 2 code lines is 50%.
			code: "// a\n// b\nconst x = 1;\nconst y = 2;",
			filename: "a.ts",
			options: [{ maxBlockLines: 5, maxRatio: 0.4 }],
			errors: [{ messageId: "tooDense" }],
		},
		{
			// Both violations in one file produce two reports.
			code: longBlock + "\n// extra",
			filename: "a.ts",
			options: [{ maxBlockLines: 5, maxRatio: 0.5 }],
			errors: [{ messageId: "blockTooLong" }, { messageId: "tooDense" }],
		},
	],
});
