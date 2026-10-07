// Tests for the conventions/comments-english rule
// (web/eslint-plugins/conventions/comments-english.js).
//
// Pure AST check over comment nodes with an ASCII whitelist; string literals
// are ignored by construction (they are not comments), which the cases below
// pin down.
import { RuleTester } from "eslint";
import tseslint from "typescript-eslint";
import { describe, it } from "vitest";
import commentsEnglish from "../conventions/comments-english.js";
import { asRuleModule } from "./helpers.js";

RuleTester.describe = describe;
RuleTester.it = it;

const tester = new RuleTester({
	languageOptions: {
		parser: tseslint.parser,
	},
});

tester.run("comments-english", asRuleModule(commentsEnglish), {
	valid: [
		{ code: "// resize the canvas\nconst x = 1;", filename: "a.ts" },
		{ code: "/* multi\nline */\nconst x = 1;", filename: "a.ts" },
		{
			// Localized strings are dictionary content, not comments.
			code: "const title = 'Пример';",
			filename: "a.ts",
		},
		{
			// Glyphs listed in allowChars pass.
			code: "// size 512×512\nconst x = 1;",
			filename: "a.ts",
			options: [{ allowChars: ["×"] }],
		},
		{
			// A tab inside a comment is legitimate whitespace.
			code: "//\tnote\nconst x = 1;",
			filename: "a.ts",
		},
	],
	invalid: [
		{
			code: "// ресайз холста\nconst x = 1;",
			filename: "a.ts",
			errors: [{ messageId: "nonAscii" }],
		},
		{
			// Whitelist catches scripts beyond Cyrillic too.
			code: "// 调整画布大小\nconst x = 1;",
			filename: "a.ts",
			errors: [{ messageId: "nonAscii" }],
		},
		{
			code: "// تغيير حجم اللوحة\nconst x = 1;",
			filename: "a.ts",
			errors: [{ messageId: "nonAscii" }],
		},
		{
			// Typography in an otherwise English comment is still non-ASCII.
			code: "// resize — then crop\nconst x = 1;",
			filename: "a.ts",
			errors: [{ messageId: "nonAscii" }],
		},
		{
			code: "/* много\nстрочный */\nconst x = 1;",
			filename: "a.ts",
			errors: [{ messageId: "nonAscii" }],
		},
		{
			code: "const x = 1; // хвостовой комментарий",
			filename: "a.ts",
			errors: [{ messageId: "nonAscii" }],
		},
		{
			// One report per offending comment, not per file.
			code: "// раз\n// два\nconst x = 1;",
			filename: "a.ts",
			errors: [{ messageId: "nonAscii" }, { messageId: "nonAscii" }],
		},
		{
			// allowChars does not whitelist other glyphs in the same comment.
			code: "// 512×512 → done\nconst x = 1;",
			filename: "a.ts",
			options: [{ allowChars: ["×"] }],
			errors: [{ messageId: "nonAscii" }],
		},
		{
			// Control characters (here: vertical tab) are not printable ASCII.
			code: "// \x0B note\nconst x = 1;",
			filename: "a.ts",
			errors: [{ messageId: "nonAscii" }],
		},
	],
});
