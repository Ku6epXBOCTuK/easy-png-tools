import { expect, test } from "playwright/test";
import {
	opaquePng,
	pixelRow,
	svgMarkup,
	tinyBase64,
	transparentPng,
} from "./helpers/fixtures";
import {
	expectNoErrorAlert,
	expectNoErrors,
	openTool,
	renderText,
	resultImage,
	trackErrors,
	uploadImage,
	verdictStatus,
} from "./helpers/page";

async function expectVerdict(page: Parameters<typeof verdictStatus>[0]) {
	const verdict = verdictStatus(page);
	await expect(verdict).toBeVisible();
	await expect(verdict).toHaveText(/\S/);
}

for (const [id, input] of [
	["base64-to-png", tinyBase64],
	["hex-to-png", "ff0000ff"],
	["bytes-to-png", pixelRow(32, [255, 0, 0, 255])],
	[
		"rgb-values-to-png",
		Array.from({ length: 32 }, () => "rgba(255,0,0,255)").join(" "),
	],
	["data-uri-to-png", `data:image/png;base64,${tinyBase64}`],
	["svg-to-png", svgMarkup],
] as const) {
	test(`text input → ${id} produces result image`, async ({ page }) => {
		const sink = trackErrors(page);
		await openTool(page, id);
		await expect(async () => {
			await renderText(page, input);
			await expect(resultImage(page)).toBeVisible();
		}).toPass({ timeout: 25_000 });
		await expectNoErrorAlert(page);
		expectNoErrors(sink);
	});
}

test("png-to-base64 shows decoded text result", async ({ page }) => {
	const sink = trackErrors(page);
	await openTool(page, "png-to-base64");
	await uploadImage(page, opaquePng);
	const output = page.getByLabel("Text result");
	await expect(output).toBeVisible();
	await expect(output).toHaveText(/\S/);
	await expectNoErrorAlert(page);
	expectNoErrors(sink);
});

test("verify-is-png renders different verdicts for valid and invalid input", async ({
	page,
}) => {
	await openTool(page, "verify-is-png");
	const verdict = verdictStatus(page);

	await renderText(page, tinyBase64);
	await expect(verdict).toBeVisible();
	const validText = await verdict.textContent();

	await renderText(page, "aGVsbG8=");
	await expect(verdict).toBeVisible();
	const invalidText = await verdict.textContent();
	expect(invalidText).not.toBe(validText);
});

test("png-is-transparent: opaque image renders a verdict", async ({ page }) => {
	await openTool(page, "png-is-transparent");
	await uploadImage(page, opaquePng);
	await expectVerdict(page);
});

test("png-is-transparent: transparent image renders a verdict", async ({
	page,
}) => {
	await openTool(page, "png-is-transparent");
	await uploadImage(page, transparentPng);
	await expectVerdict(page);
});

test("png-is-grayscale: colored image renders a verdict", async ({ page }) => {
	await openTool(page, "png-is-grayscale");
	await uploadImage(page, opaquePng);
	await expectVerdict(page);
});

test("png-orientation: landscape image renders a verdict", async ({ page }) => {
	await openTool(page, "png-orientation");
	await uploadImage(page, opaquePng);
	await expectVerdict(page);
});

test("png-file-size: renders a verdict", async ({ page }) => {
	await openTool(page, "png-file-size");
	await uploadImage(page, opaquePng);
	await expectVerdict(page);
});
