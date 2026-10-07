import { defineConfig } from "playwright/test";

const browserContractTests = [
	"**/tool-flows.spec.ts",
	"**/png-fixtures.spec.ts",
	"**/text-and-verdicts.spec.ts",
];

const mobileTests = [
	"**/navigation.spec.ts",
	"**/catalog.spec.ts",
	"**/generators.spec.ts",
	"**/tool-flows.spec.ts",
];

export default defineConfig({
	testDir: "./e2e",
	outputDir: "./e2e-results",
	fullyParallel: true,
	timeout: 60_000,
	retries: 0,
	workers: process.env.CI ? 2 : 1,
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
		{
			name: "firefox",
			testMatch: browserContractTests,
			use: {
				browserName: "firefox",
				viewport: { width: 1440, height: 900 },
			},
		},
		{
			name: "webkit",
			testMatch: browserContractTests,
			// WebKit on Windows is noticeably slower and under load randomly
			// exceeds any timeout (different tests each run): timeout headroom
			// plus retries against flakiness.
			timeout: 120_000,
			expect: { timeout: 30_000 },
			retries: 2,
			use: {
				browserName: "webkit",
				viewport: { width: 1440, height: 900 },
			},
		},
		{
			name: "mobile-chromium",
			testMatch: mobileTests,
			use: {
				browserName: "chromium",
				viewport: { width: 390, height: 844 },
				hasTouch: true,
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
