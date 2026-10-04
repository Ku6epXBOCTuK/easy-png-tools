import { unzipSync } from "fflate";
import { expect, test } from "playwright/test";
import {
	corruptPng,
	landscapePng,
	largePng,
	onePixelPng,
	opaquePng,
} from "./helpers/fixtures";
import {
	downloadResultBytes,
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

test("resize-png uses the source dimensions by default", async ({ page }) => {
	const sink = trackErrors(page);
	await openTool(page, "resize-png");
	await uploadImage(page, opaquePng);
	await expect(page.getByRole("spinbutton", { name: "Width" })).toHaveValue(
		"64",
	);
	await expect(page.getByRole("spinbutton", { name: "Height" })).toHaveValue(
		"48",
	);
	await expect(resultImage(page)).toBeVisible();
	await expectNoErrorAlert(page);
	expectNoErrors(sink);
});

test("resize-png keeps user-set size when another image is uploaded", async ({
	page,
}) => {
	await openTool(page, "resize-png");
	await uploadImage(page, opaquePng);
	const width = page.getByRole("spinbutton", { name: "Width" });
	await width.fill("25");
	await uploadImage(page, landscapePng);
	await expect(width).toHaveValue("25");
	await expect(page.getByRole("spinbutton", { name: "Height" })).toHaveValue(
		"48",
	);
});

test("crop-png starts with the full source area", async ({ page }) => {
	const sink = trackErrors(page);
	await openTool(page, "crop-png");
	await uploadImage(page, opaquePng);
	await expect(page.getByRole("spinbutton", { name: "Width" })).toHaveValue(
		"64",
	);
	await expect(page.getByRole("spinbutton", { name: "Height" })).toHaveValue(
		"48",
	);
	await expect(resultImage(page)).toBeVisible();
	await expectNoErrorAlert(page);
	expectNoErrors(sink);
});

test("flip-png: full flow - upload, result, download", async ({ page }) => {
	const sink = trackErrors(page);
	await openTool(page, "flip-png");
	await uploadImage(page, landscapePng);
	await expect(resultImage(page)).toBeVisible();
	const { name, bytes } = await downloadResultBytes(page);
	expect(name).toBe("flip-png.png");
	expect(Array.from(bytes.subarray(0, 8))).toEqual([
		137, 80, 78, 71, 13, 10, 26, 10,
	]);
	await expectNoErrorAlert(page);
	expectNoErrors(sink);
});

test("convert-png-to-jpg: produces JPEG and quality affects size", async ({
	page,
}) => {
	const sink = trackErrors(page);
	await openTool(page, "convert-png-to-jpg");
	await uploadImage(page, largePng);
	await expect(resultImage(page)).toBeVisible();
	const quality = rangeInput(page, "Quality");
	await quality.fill("10");
	const low = await downloadResultBytes(page);
	expect(low.name).toBe("convert-png-to-jpg.jpg");
	expect(Array.from(low.bytes.subarray(0, 3))).toEqual([255, 216, 255]);
	await quality.fill("90");
	const high = await downloadResultBytes(page);
	expect(high.bytes.length).toBeGreaterThan(low.bytes.length);
	await expectNoErrorAlert(page);
	expectNoErrors(sink);
});

test("convert-png-to-webp: produces WebP and quality affects size", async ({
	page,
}) => {
	const sink = trackErrors(page);
	await openTool(page, "convert-png-to-webp");
	await uploadImage(page, largePng);
	await expect(resultImage(page)).toBeVisible();
	const quality = rangeInput(page, "Quality");
	await quality.fill("10");
	const low = await downloadResultBytes(page);
	expect(low.name).toBe("convert-png-to-webp.webp");
	expect(Array.from(low.bytes.subarray(0, 4))).toEqual([82, 73, 70, 70]);
	expect(Array.from(low.bytes.subarray(8, 12))).toEqual([87, 69, 66, 80]);
	await quality.fill("90");
	const high = await downloadResultBytes(page);
	expect(high.bytes.length).toBeGreaterThan(low.bytes.length);
	await expectNoErrorAlert(page);
	expectNoErrors(sink);
});

test("png-to-bmp: produces a BMP download", async ({ page }) => {
	const sink = trackErrors(page);
	await openTool(page, "png-to-bmp");
	await uploadImage(page, opaquePng);
	await expect(resultImage(page)).toBeVisible();
	const { name, bytes } = await downloadResultBytes(page);
	expect(name).toBe("png-to-bmp.bmp");
	expect(Array.from(bytes.subarray(0, 2))).toEqual([66, 77]);
	await expectNoErrorAlert(page);
	expectNoErrors(sink);
});

test("reset restores defaults and re-runs with the source", async ({
	page,
}) => {
	const sink = trackErrors(page);
	await openTool(page, "blur-png");
	await uploadImage(page, opaquePng);
	await expect(resultImage(page)).toBeVisible();
	const radius = rangeInput(page, /radius/i);
	await radius.fill("20");
	await expect(radius).toHaveValue("20");

	await page.getByRole("button", { name: "Reset" }).click();
	await expect(radius).toHaveValue("4");
	await expect(sourceImage(page)).toBeVisible();
	await expect(resultImage(page)).toBeVisible();
	await expectNoErrorAlert(page);
	expectNoErrors(sink);
});

test("split-into-parts-png downloads a zip with named PNG parts", async ({
	page,
}) => {
	const sink = trackErrors(page);
	await openTool(page, "split-into-parts-png");
	await uploadImage(page, landscapePng);
	await rangeInput(page, "Columns").fill("3");
	await rangeInput(page, "Rows").fill("2");
	await expect(page.getByText("part-1-3.png")).toBeVisible();

	const { name, bytes } = await downloadResultBytes(page);
	expect(name).toBe("split-into-parts-png.zip");
	const entries = unzipSync(bytes);

	expect(Object.keys(entries)).toEqual([
		"part-1-1.png",
		"part-1-2.png",
		"part-1-3.png",
		"part-2-1.png",
		"part-2-2.png",
		"part-2-3.png",
	]);
	for (const bytes of Object.values(entries)) {
		expect(Array.from(bytes.subarray(0, 8))).toEqual([
			137, 80, 78, 71, 13, 10, 26, 10,
		]);
	}
	await expectNoErrorAlert(page);
	expectNoErrors(sink);
});

test("blur: changing slider updates result image", async ({ page }) => {
	await openTool(page, "blur-png");
	await uploadImage(page, opaquePng);
	await expect(resultImage(page)).toBeVisible();
	const firstSource = await resultImage(page).getAttribute("src");
	await rangeInput(page, /radius/i).fill("20");
	await expect(resultImage(page)).not.toHaveAttribute("src", firstSource ?? "");
});

test("runs without Web Worker (fallback)", async ({ browser }, testInfo) => {
	// newContext() не наследует use.baseURL из конфига — пробрасываем явно,
	// иначе относительный goto() в helpers не резолвится.
	const context = await browser.newContext({
		baseURL: testInfo.project.use.baseURL,
	});
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
