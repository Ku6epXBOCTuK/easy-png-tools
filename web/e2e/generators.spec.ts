import { expect, test } from "playwright/test";
import {
	expectNoErrorAlert,
	expectNoErrors,
	openTool,
	resultImage,
	trackErrors,
} from "./helpers/page";

test.describe("generators", () => {
	test("single-color-png auto-runs and reacts to parameters", async ({
		page,
	}) => {
		const sink = trackErrors(page);
		await openTool(page, "single-color-png");
		await expect(resultImage(page)).toBeVisible();
		await expect(page.getByRole("button", { name: "Generate" })).toHaveCount(0);

		const firstSource = await resultImage(page).getAttribute("src");
		await page.getByRole("spinbutton", { name: "Width" }).fill("32");
		await expect(resultImage(page)).not.toHaveAttribute(
			"src",
			firstSource ?? "",
		);
		await expectNoErrorAlert(page);
		expectNoErrors(sink);
	});

	test("create-empty-png page opens without errors", async ({ page }) => {
		const sink = trackErrors(page);
		await openTool(page, "create-empty-png");
		await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
		expectNoErrors(sink);
	});
});
