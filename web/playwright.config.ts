import { defineConfig } from "playwright/test";

export default defineConfig({
	testDir: "./e2e",
	outputDir: "./e2e-results",
	fullyParallel: true,
	timeout: 60_000,
	retries: 0,
	reporter: [["list"], ["html", { open: "never" }]],
	use: {
		baseURL: "http://127.0.0.1:4173",
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "chromium",
			use: {
				browserName: "chromium",
				viewport: { width: 1440, height: 900 },
			},
		},
	],
	webServer: {
		command: "pnpm build && node scripts/serve-static.mjs --port 4173",
		url: "http://127.0.0.1:4173/",
		reuseExistingServer: !process.env.CI,
		timeout: 180_000,
	},
});
