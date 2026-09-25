import { expect, test } from "playwright/test";
import {
	expectNoErrorAlert,
	expectNoErrors,
	openTool,
	resultImage,
	trackErrors,
} from "./helpers/page";

const GENERATOR_IDS = [
	"create-empty-png",
	"random-noise-png",
	"linear-gradient-png",
	"color-spectrum-png",
	"random-colors-png",
	"draw-grid-png",
	"placeholder-png",
	"blend-two-png",
	"step-colors-png",
	"emoji-to-png",
	"color-wheel-png",
	"complementary-png",
	"triadic-png",
	"tetradic-png",
	"analogous-png",
	"monochromatic-png",
	"shades-png",
	"mix-colors-png",
	"sort-colors-png",
	"text-to-png",
] as const;

test.describe("generators", () => {
	test("single-color-png auto-runs and reacts to parameters", async ({
		page,
	}) => {
		const sink = trackErrors(page);
		await openTool(page, "single-color-png");
		await expect(resultImage(page)).toBeVisible();
		await expect(page.getByRole("button", { name: "Generate" })).toHaveCount(0);

		await page.getByRole("spinbutton", { name: "Width" }).fill("32");
		await page.getByRole("spinbutton", { name: "Height" }).fill("24");
		await expect(resultImage(page)).toHaveJSProperty("naturalWidth", 32);
		await expect(resultImage(page)).toHaveJSProperty("naturalHeight", 24);
		await expectNoErrorAlert(page);
		expectNoErrors(sink);
	});

	for (const id of GENERATOR_IDS) {
		test(`tool ${id} produces a result image`, async ({ page }) => {
			const sink = trackErrors(page);
			await openTool(page, id);
			await expect(resultImage(page)).toBeVisible();
			await expect(page.getByRole("button", { name: "Generate" })).toHaveCount(
				0,
			);
			await expectNoErrorAlert(page);
			expectNoErrors(sink);
		});
	}
});
