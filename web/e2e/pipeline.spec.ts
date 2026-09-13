import { expect, test } from "playwright/test";
import {
	corruptPng,
	landscapePng,
	largePng,
	onePixelPng,
	opaquePng,
} from "./helpers/fixtures";
import {
	expectNoErrorAlert,
	expectNoErrors,
	metaValue,
	openTool,
	suggestedDownloadName,
	trackErrors,
	uploadImage,
} from "./helpers/page";

test("flip-png: full flow - upload, result, meta, download", async ({
	page,
}) => {
	const sink = trackErrors(page);
	await openTool(page, "flip-png");
	await uploadImage(page, landscapePng);
	await expect(page.locator('img[alt="Result image"]')).toBeVisible();
	await expect(page.locator('img[alt="Result image"]')).toHaveAttribute(
		"src",
		/^(blob:|data:image\/png;base64,)/,
	);
	const resultMeta = await metaValue(page, "RESULT");
	expect(resultMeta).toBe("64 × 16 px");
	const downloadName = await suggestedDownloadName(
		page,
		'button[aria-label="Download result"]',
	);
	expect(downloadName).toBe("flip-png.png");
	await expectNoErrorAlert(page);
	expectNoErrors(sink);
});

test("convert-png-to-jpg: produces a downloadable jpg", async ({ page }) => {
	const sink = trackErrors(page);
	await openTool(page, "convert-png-to-jpg");
	await uploadImage(page, opaquePng);
	await expect(page.locator('img[alt="Result image"]')).toBeVisible();
	const downloadName = await suggestedDownloadName(
		page,
		'button[aria-label="Download result"]',
	);
	expect(downloadName).toBe("convert-png-to-jpg.jpg");
	await expectNoErrorAlert(page);
	expectNoErrors(sink);
});

test.fixme("reset clears result but keeps source", async ({ page }) => {
	await openTool(page, "flip-png");
	await uploadImage(page, opaquePng);
	await expect(page.locator('img[alt="Result image"]')).toBeVisible();
	await page.getByRole("button", { name: "Reset" }).click();
	await expect(page.locator('img[alt="Result image"]')).toHaveCount(0);
	await expect(page.locator(".empty")).toContainText("no result yet");
	await expect(page.locator('img[alt="source"]')).toBeVisible();
});

test("blur: changing slider updates result image", async ({ page }) => {
	await openTool(page, "blur-png");
	await uploadImage(page, opaquePng);
	await expect(page.locator('img[alt="Result image"]')).toBeVisible();
	const src1 = await page
		.locator('img[alt="Result image"]')
		.getAttribute("src");
	await expect(async () => {
		await page.locator('input[type="range"]').fill("20");
		await expect(page.locator('img[alt="Result image"]')).not.toHaveAttribute(
			"src",
			src1 ?? "",
		);
	}).toPass();
});

test("runs without Web Worker (fallback)", async ({ browser }) => {
	const context = await browser.newContext();
	await context.addInitScript(() => {
		Object.defineProperty(window, "Worker", {
			value: undefined,
			configurable: true,
		});
	});
	const page = await context.newPage();
	const sink = trackErrors(page);
	await openTool(page, "flip-png");
	await uploadImage(page, landscapePng);
	await expect(page.locator('img[alt="Result image"]')).toBeVisible();
	await expectNoErrorAlert(page);
	expectNoErrors(sink);
	await context.close();
});

test("invalid file upload shows error, no crash", async ({ page }) => {
	const sink = trackErrors(page);
	await openTool(page, "flip-png");
	await uploadImage(page, corruptPng);
	await expect(page.locator('[role="alert"]')).toBeVisible();
	await expect(page.locator('img[alt="Result image"]')).toHaveCount(0);
	expectNoErrors(sink);
});

for (const fixture of [onePixelPng, largePng]) {
	test(`handles ${fixture.name} correctly`, async ({ page }) => {
		const sink = trackErrors(page);
		await openTool(page, "flip-png");
		await uploadImage(page, fixture);
		await expect(page.locator('img[alt="Result image"]')).toBeVisible();
		expectNoErrors(sink);
	});
}
