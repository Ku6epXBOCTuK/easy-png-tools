import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import svelteParser from "svelte-eslint-parser";
import tseslint from "typescript-eslint";

// Новый код редизайна: к нему применяем полные recommended-наборы уже сейчас.
// Когда старый дизайн удалим (C19), этот scoped-блок убирается и recommended
// включается на весь код (см. план-redesign §10, шаг 6).
const newCode = ["**/src/lib/components/kit/**", "**/src/routes/preview/**"];

// Полные recommended-наборы — только на новый код (см. ниже, блок перед prettier).
const jsRecommended = Array.isArray(js.configs.recommended)
	? js.configs.recommended
	: [js.configs.recommended];
const svelteRecommended = Array.isArray(svelte.configs["flat/recommended"])
	? svelte.configs["flat/recommended"]
	: [svelte.configs["flat/recommended"]];
// Svelte-рекомендации применяем только к .svelte-файлам нового кода, иначе
// svelte-eslint-parser "съедает" обычные .ts в тех же папках (напр. +page.ts).
const svelteFiles = [
	"**/src/lib/components/kit/**/*.svelte",
	"**/src/routes/preview/**/*.svelte",
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
	// Минимально на весь код: парсинг TS/Svelte + запрет инлайн-тип-импортов.
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
						"svelte.config.js",
					],
				},
				extraFileExtensions: [".svelte"],
			},
		},
		plugins: {
			"@typescript-eslint": tseslint.plugin,
		},
		rules: {
			// Инлайн-тип-импорты (import('x').Y) запрещены — только
			// `import type { Y } from 'x'` наверху файла.
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
	},
	// Полные recommended-наборы — только на новый код.
	...[
		...jsRecommended.map((cfg) => ({ ...cfg, files: newCode })),
		...tseslint.configs.recommended.map((cfg) => ({ ...cfg, files: newCode })),
		...svelteRecommended.map((cfg) => ({ ...cfg, files: svelteFiles })),
	],

	// В Svelte 5 пропсы деструктурируются через `let` (конвенция документации и
	// наш AGENTS.md), поэтому prefer-const на них — ложноположительный.
	{
		files: ["**/*.svelte"],
		rules: {
			"prefer-const": "off",
		},
	},
	// prettier — последним, чтобы гасить форматирующие правила из recommended.
	prettier,
);
