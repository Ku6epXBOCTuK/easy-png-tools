import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [svelte()],
	test: {
		include: ["src/**/*.test.ts", "eslint-plugins/**/*.test.ts"],
		environment: "node",
	},
});
