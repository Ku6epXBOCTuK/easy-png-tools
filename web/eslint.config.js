import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import svelteParser from "svelte-eslint-parser";
import tseslint from "typescript-eslint";
import designTokens from "./eslint-plugins/index.js";
import conventionsPlugin from "./eslint-plugins/conventions/index.js";
import i18nPlugin from "./eslint-plugins/i18n/index.js";

// Новый код редизайна: к нему применяем полные recommended-наборы уже сейчас.
const newCode = ["**/src/lib/components/**", "**/src/routes/**"];

// Инфраструктура линтинга: сами плагины, скрипты и конфиги. Это не
// продуктовый код, но всё это влияет на гейты, поэтому к нему тоже
// применяется базовый JS recommended. Полные TS/svelte-наборы здесь не
// подключаются: файлы .mjs и .js проверяются только базовым набором.
const toolingFiles = [
	"**/eslint-plugins/**/*.js",
	"**/scripts/**/*.mjs",
	"*.config.js",
];

// Полные recommended-наборы — только на новый код (см. ниже, блок перед prettier).
const jsRecommended = Array.isArray(js.configs.recommended)
	? js.configs.recommended
	: [js.configs.recommended];
const svelteRecommended = Array.isArray(svelte.configs["flat/recommended"])
	? svelte.configs["flat/recommended"]
	: [svelte.configs["flat/recommended"]];
// Svelte-рекомендации применяем только к .svelte-файлам нового кода, иначе
// svelte-eslint-parser "съедает" обычные .ts в тех же папках (напр. +page.ts).
const newSvelteFiles = [
	"**/src/lib/components/**/*.svelte",
	"**/src/routes/**/*.svelte",
];

// FIXME:
// The signature '(...configs: InfiniteDepthConfigWithExtends[]): ConfigArray' of 'tseslint.config' is deprecated.ts
// Migrate to defineConfig(...)
// The core defineConfig(...) helper is a nearly exact clone of tseslint.config(...)

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
						"playwright.config.ts",
						"e2e/helpers/fixtures.ts",
						"e2e/helpers/page.ts",
						"e2e/navigation.spec.ts",
						"e2e/catalog.spec.ts",
						"e2e/pipeline.spec.ts",
						"e2e/text-and-verdicts.spec.ts",
						"e2e/tools-smoke.spec.ts",
						"e2e/generators.spec.ts",
						"e2e/png-fixtures.spec.ts",
						"e2e/i18n.spec.ts",
						// Тесты и фикстуры кастомных линт-правил лежат вне src/ (не в
						// tsconfig), поэтому для типизированного парсинга резолвятся
						// через default-проект. Перечисляются точечно: `**` в
						// allowDefaultProject запрещён tseslint.
						"eslint-plugins/__tests__/design-tokens.test.ts",
						"eslint-plugins/__tests__/interface-props.test.ts",
						"eslint-plugins/__tests__/no-string-union-alias.test.ts",
						"eslint-plugins/__tests__/helpers.ts",
						"eslint-plugins/__tests__/dict-consistency.test.ts",
						"eslint-plugins/__tests__/no-hardcoded-user-text.test.ts",
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
		plugins: {
			"design-tokens": designTokens,
		},
	},
	// Правило дизайн-токенов: запрет хардкода цветов/размеров в style-блоках.
	// Применяется к новому коду редизайна.
	{
		files: newSvelteFiles,
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
	// Конвенция Svelte 5: пропсы через локальный `interface Props` +
	// `let {...}: Props = $props()` (плагин conventions/interface-props).
	{
		files: newSvelteFiles,
		plugins: {
			conventions: conventionsPlugin,
		},
		rules: {
			"conventions/interface-props": "error",
		},
	},
	// Запрет строковых union-алиасов в пользу `as const` объектов
	// (плагин conventions/no-string-union-alias). TS и Svelte-скрипты нового кода.
	{
		files: newCode,
		plugins: {
			conventions: conventionsPlugin,
		},
		rules: {
			"conventions/no-string-union-alias": "error",
		},
	},
	// Кросс-языковой линтер словарей (плагин i18n/dict-consistency) и запрет
	// захардкоженного пользовательского текста (i18n/no-hardcoded-user-text).
	// Правила сообщают warning, а `lint:all` превращает новые warnings в
	// blocking через --max-warnings=0. Список локалей берётся из LOCALES в
	// lib/i18n/dict.ts; новые локали подхватываются автоматически.
	{
		files: ["**/src/lib/i18n/*.ts"],
		plugins: {
			i18n: i18nPlugin,
		},
		rules: {
			"i18n/dict-consistency": [
				"warn",
				{
					baseLocaleFallback: ["tools.*.title", "tools.*.description"],
					ignoreMissingPatterns: ["tools.*.params"],
				},
			],
		},
	},
	{
		// /kit — витрина компонентов с намеренно захардкоженными подписями.
		files: newSvelteFiles.filter((pattern) => !pattern.includes("routes")),
		plugins: {
			i18n: i18nPlugin,
		},
		rules: {
			"i18n/no-hardcoded-user-text": [
				"warn",
				{
					// Название продукта — бренд, а не переводимый текст.
					allowWords: ["easy-png-tools"],
				},
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
	// Полные recommended-наборы — только на новый код.
	...[
		...jsRecommended.map((cfg) => ({
			...cfg,
			files: newCode,
		})),
		...jsRecommended.map((cfg) => ({
			...cfg,
			files: toolingFiles,
		})),
		...tseslint.configs.recommended.map((cfg) => ({
			...cfg,
			files: newCode,
		})),
		...svelteRecommended.map((cfg) => ({
			...cfg,
			files: newSvelteFiles,
		})),
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
