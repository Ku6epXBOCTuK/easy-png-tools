import { expect, test } from "playwright/test";
import {
	corruptPng,
	landscapePng,
	largePng,
	onePixelPng,
	opaquePng,
} from "./helpers/fixtures";
import {
	downloadResult,
	emptyState,
	errorAlert,
	expectNoErrorAlert,
	expectNoErrors,
	openTool,
	rangeInput,
	resultImage,
	sourceImage,
	trackErrors,
	uploadImage,
	useEnglish,
} from "./helpers/page";

test("flip-png: full flow - upload, result, download", async ({ page }) => {
	const sink = trackErrors(page);
	await openTool(page, "flip-png");
	await uploadImage(page, landscapePng);
	await expect(resultImage(page)).toBeVisible();
	expect(await downloadResult(page)).toBe("flip-png.png");
	await expectNoErrorAlert(page);
	expectNoErrors(sink);
});

test("convert-png-to-jpg: produces a downloadable jpg", async ({ page }) => {
	const sink = trackErrors(page);
	await openTool(page, "convert-png-to-jpg");
	await uploadImage(page, opaquePng);
	await expect(resultImage(page)).toBeVisible();
	expect(await downloadResult(page)).toBe("convert-png-to-jpg.jpg");
	await expectNoErrorAlert(page);
	expectNoErrors(sink);
});

test.fixme("reset clears result but keeps source", async ({ page }) => {
	await openTool(page, "flip-png");
	await uploadImage(page, opaquePng);
	await expect(resultImage(page)).toBeVisible();
	await page.getByRole("button", { name: "Reset" }).click();
	await expect(resultImage(page)).toHaveCount(0);
	await expect(emptyState(page)).toBeVisible();
	await expect(sourceImage(page)).toBeVisible();
});

test("blur: changing slider updates result image", async ({ page }) => {
	await openTool(page, "blur-png");
	await uploadImage(page, opaquePng);
	await expect(resultImage(page)).toBeVisible();
	const firstSource = await resultImage(page).getAttribute("src");
	await rangeInput(page, /radius/i).fill("20");
	await expect(resultImage(page)).not.toHaveAttribute("src", firstSource ?? "");
});

test("runs without Web Worker (fallback)", async ({ browser }) => {
	const context = await browser.newContext();
	try {
		await context.addInitScript(() => {
			Object.defineProperty(window, "Worker", {
				value: undefined,
				configurable: true,
			});
		});
		const page = await context.newPage();
		await useEnglish(page);
		const sink = trackErrors(page);
		await openTool(page, "flip-png");
		await uploadImage(page, landscapePng);
		await expect(resultImage(page)).toBeVisible();
		await expectNoErrorAlert(page);
		expectNoErrors(sink);
	} finally {
		await context.close();
	}
});

test("invalid file upload shows error, no crash", async ({ page }) => {
	const sink = trackErrors(page);
	await openTool(page, "flip-png");
	await uploadImage(page, corruptPng);
	await expect(errorAlert(page)).toBeVisible();
	await expect(resultImage(page)).toHaveCount(0);
	expectNoErrors(sink);
});

for (const fixture of [onePixelPng, largePng]) {
	test(`handles ${fixture.name} correctly`, async ({ page }) => {
		const sink = trackErrors(page);
		await openTool(page, "flip-png");
		await uploadImage(page, fixture);
		await expect(resultImage(page)).toBeVisible();
		expectNoErrors(sink);
	});
}
