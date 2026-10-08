import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import svelteParser from "svelte-eslint-parser";
import tseslint from "typescript-eslint";
import designTokens from "./eslint-plugins/index.js";
import conventionsPlugin from "./eslint-plugins/conventions/index.js";
import i18nPlugin from "./eslint-plugins/i18n/index.js";

// Production UI: the full recommended sets apply to it.
const productionCode = ["**/src/lib/components/**", "**/src/routes/**"];

// Lint tooling: the plugins, gate scripts and configs. Not product code,
// but it feeds the gates, so the base JS recommended set applies; the full
// TS/svelte sets do not (.mjs/.js only).
const toolingFiles = [
	"**/eslint-plugins/**/*.js",
	"**/scripts/**/*.mjs",
	"*.config.js",
];

// Full recommended sets apply to production code only (block before prettier).
const jsRecommended = Array.isArray(js.configs.recommended)
	? js.configs.recommended
	: [js.configs.recommended];
const svelteRecommended = Array.isArray(svelte.configs["flat/recommended"])
	? svelte.configs["flat/recommended"]
	: [svelte.configs["flat/recommended"]];
// Svelte recommended targets production .svelte files only, otherwise
// svelte-eslint-parser swallows plain .ts in the same folders (+page.ts).
const productionSvelte = [
	"**/src/lib/components/**/*.svelte",
	"**/src/routes/**/*.svelte",
];

export default tseslint.config(
	{
		ignores: [
			"**/node_modules/**",
			"**/build/**",
			"**/.svelte-kit/**",
			"**/dist/**",
			"**/static/**",
		],
	},
	// Minimum on all code: TS/Svelte parsing + ban on inline type imports.
	{
		files: ["**/*.ts", "**/*.svelte.ts", "**/*.svelte.js", "**/*.svelte"],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
			parserOptions: {
				projectService: {
					allowDefaultProject: [
						"vitest.config.ts",
						"eslint.config.js",
						"playwright.config.ts",
						// e2e are covered by e2e/tsconfig.json. Lint-rule tests and
						// fixtures live outside src/, so typed parsing resolves them
						// via the default project; tseslint bans `**` here.
						"eslint-plugins/__tests__/design-tokens.test.ts",
						"eslint-plugins/__tests__/interface-props.test.ts",
						"eslint-plugins/__tests__/no-string-union-alias.test.ts",
						"eslint-plugins/__tests__/helpers.ts",
						"eslint-plugins/__tests__/dict-consistency.test.ts",
						"eslint-plugins/__tests__/no-hardcoded-user-text.test.ts",
						"eslint-plugins/__tests__/ascii-only.test.ts",
						"eslint-plugins/__tests__/comments-english.test.ts",
						"eslint-plugins/__tests__/comment-format.test.ts",
						"eslint-plugins/__fixtures__/src/lib/i18n/dict.ts",
						"eslint-plugins/__fixtures__/src/lib/i18n/en.ts",
						"eslint-plugins/__fixtures__/src/lib/i18n/ru.ts",
						"eslint-plugins/__fixtures__/src/lib/i18n/de.ts",
						"eslint-plugins/__fixtures__/src/lib/core/errors.ts",
						"eslint-plugins/__fixtures__/src/lib/i18n/t.ts",
						"eslint-plugins/__fixtures__/src/lib/theme.svelte.ts",
						"eslint-plugins/__fixtures__/src/lib/components/CheckerCanvas.svelte",
						"eslint-plugins/__fixtures__/src/lib/components/ui/Button.svelte",
						"eslint-plugins/__fixtures__/src/routes/+page.svelte",
					],
					maximumDefaultProjectFileMatchCount_THIS_WILL_SLOW_DOWN_LINTING: 40,
				},
				extraFileExtensions: [".svelte"],
			},
		},
		plugins: {
			"@typescript-eslint": tseslint.plugin,
		},
		rules: {
			// Inline type imports (import('x').Y) are banned; only
			// `import type { Y } from 'x'` at the top of the file.
			"@typescript-eslint/consistent-type-imports": [
				"error",
				{ prefer: "type-imports", fixStyle: "separate-type-imports" },
			],
		},
	},
	{
		files: ["**/*.ts", "**/*.svelte.ts", "**/*.svelte.js"],
		languageOptions: {
			parser: tseslint.parser,
		},
	},
	{
		files: ["**/*.svelte"],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tseslint.parser,
			},
		},
		plugins: {
			"design-tokens": designTokens,
		},
	},
	// Design-token rules: no hardcoded colors/sizes in style blocks.
	{
		files: productionSvelte,
		plugins: {
			"design-tokens": designTokens,
		},
		rules: {
			"design-tokens/no-hardcoded-in-svelte": "error",
			"design-tokens/no-category-mismatch": "error",
			"design-tokens/no-token-definition-in-svelte": "error",
			"design-tokens/no-undefined-in-svelte": "error",
		},
	},
	// Svelte 5 convention: props via a local `interface Props` +
	// `let {...}: Props = $props()` (conventions/interface-props).
	{
		files: productionSvelte,
		plugins: {
			conventions: conventionsPlugin,
		},
		rules: {
			"conventions/interface-props": "error",
		},
	},
	// Ban string-literal union aliases in favor of `as const` objects
	// (conventions/no-string-union-alias).
	{
		files: productionCode,
		plugins: {
			conventions: conventionsPlugin,
		},
		rules: {
			"conventions/no-string-union-alias": "error",
		},
	},
	// Cross-locale dictionary linter (i18n/dict-consistency). Reports warn;
	// `lint:all` makes any new warning blocking via --max-warnings=0. The
	// locale list comes from LOCALES in lib/i18n/dict.ts.
	{
		files: ["**/src/lib/i18n/*.ts"],
		plugins: {
			i18n: i18nPlugin,
		},
		rules: {
			"i18n/dict-consistency": [
				"warn",
				{
					baseLocaleFallback: ["pages.*.title", "pages.*.description"],
					ignoreMissingPatterns: ["tools.*.params"],
				},
			],
		},
	},
	{
		// Hardcoded user text is caught in components and routes alike:
		// `+page.svelte` is production UI too, a hardcoded string silently
		// ships in the RU locale.
		files: productionSvelte,
		plugins: {
			i18n: i18nPlugin,
		},
		rules: {
			"i18n/no-hardcoded-user-text": [
				"warn",
				{
					// The product name is a brand, not translatable text.
					allowWords: ["easy-png-tools"],
				},
			],
		},
	},
	{
		// /kit exception: a showcase with intentionally Latin labels. Separate
		// object: negative globs in `files` do not narrow a rule's scope.
		files: ["**/src/routes/kit/**/*.svelte"],
		rules: {
			"i18n/no-hardcoded-user-text": "off",
		},
	},
	// Tests are written in ASCII English: typography and non-English prose in
	// describe/it hurt grep-ability and hide hardcoded localized strings
	// (expected values come from the dictionaries, not literals).
	{
		files: ["**/*.test.ts", "**/*.spec.ts", "**/e2e/**/*.ts"],
		plugins: {
			conventions: conventionsPlugin,
		},
		rules: {
			// allowChars: U+00D7 is intentional - the pipeline emits sizes with
			// it and tests must assert that exact output.
			"conventions/ascii-only": ["error", { allowChars: ["×"] }],
		},
	},
	// Comments in English, in short blocks, without turning a file into an
	// essay (conventions/comments-english + conventions/comment-format).
	// Excess is a cue to refactor code, not squeeze comments.
	{
		files: [
			"**/src/**/*.ts",
			"**/src/**/*.svelte",
			// Dogfooding: lint rules, gate scripts and configs follow the same
			// comment conventions as production code.
			"**/eslint-plugins/**/*.js",
			"**/scripts/**/*.mjs",
			"**/*.config.js",
			"**/*.config.ts",
			"**/*.config.mjs",
		],
		plugins: {
			conventions: conventionsPlugin,
		},
		rules: {
			"conventions/comments-english": "error",
			"conventions/comment-format": [
				"error",
				// minLines: density skips small files (any header would trip it).
				{ maxBlockLines: 5, maxRatio: 0.15, minLines: 100 },
			],
		},
	},
	{
		// Lint-rule fixtures are intentional stubs (including non-ASCII and
		// non-English comments as input cases); the conventions do not apply.
		files: [
			"**/eslint-plugins/__fixtures__/**",
			"**/eslint-plugins/__tests__/**",
		],
		rules: {
			"conventions/ascii-only": "off",
			"conventions/comments-english": "off",
			"conventions/comment-format": "off",
		},
	},
	{
		files: productionCode,
		rules: {
			"max-lines-per-function": [
				"warn",
				{ max: 100, skipBlankLines: true, skipComments: true },
			],
		},
	},
	{
		files: toolingFiles,
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: {
				...globals.node,
			},
		},
	},
	// Full recommended sets: production code only.
	...[
		...jsRecommended.map((cfg) => ({
			...cfg,
			files: productionCode,
		})),
		...jsRecommended.map((cfg) => ({
			...cfg,
			files: toolingFiles,
		})),
		...tseslint.configs.recommended.map((cfg) => ({
			...cfg,
			files: productionCode,
		})),
		...svelteRecommended.map((cfg) => ({
			...cfg,
			files: productionSvelte,
		})),
	],

	// In Svelte 5 props are destructured via `let` (docs convention and our
	// AGENTS.md), so prefer-const is a false positive on them.
	{
		files: ["**/*.svelte"],
		rules: {
			"prefer-const": "off",
		},
	},
	// prettier goes last to silence formatting rules from the recommended sets.
	prettier,
);
