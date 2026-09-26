import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [svelte()],
	test: {
		include: ["src/**/*.test.ts", "eslint-plugins/**/*.test.ts"],
		environment: "node",
		coverage: {
			provider: "v8",
			reporter: ["text-summary"],
			reportsDirectory: "./coverage",
			include: ["src/lib/**/*.ts"],
			exclude: [
				"src/lib/**/*.test.ts",
				"src/lib/**/test-helpers.ts",
				"src/lib/**/*.svelte.ts",
				"src/lib/executor/executor.worker.ts",
				"src/lib/components/define.ts",
				"src/lib/core/domText.ts",
				"src/lib/core/io.ts",
				"src/lib/i18n/en.ts",
				"src/lib/i18n/ru.ts",
				"src/lib/tool-icons.ts",
			],
			thresholds: {
				statements: 90,
				branches: 82,
				functions: 72,
				lines: 91,
			},
		},
	},
});
