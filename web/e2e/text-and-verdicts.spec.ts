import { expect, test } from "playwright/test";
import {
	opaquePng,
	transparentPng,
	tinyBase64,
	svgMarkup,
	pixelRow,
} from "./helpers/fixtures";
import {
	trackErrors,
	openTool,
	uploadImage,
	expectNoErrorAlert,
	expectNoErrors,
} from "./helpers/page";

for (const [id, input] of [
	["base64-to-png", tinyBase64],
	["hex-to-png", "ff0000ff"],
	["bytes-to-png", pixelRow(32, [255, 0, 0, 255])],
	[
		"rgb-values-to-png",
		Array.from({ length: 32 }, () => "rgba(255,0,0,255)").join(" "),
	],
	["svg-to-png", svgMarkup],
] as const) {
	test(`text input → ${id} produces result image`, async ({ page }) => {
		const sink = trackErrors(page);
		await expect(async () => {
			await openTool(page, id);
			await page.locator(".text-source textarea").fill(input);
			await page.getByRole("button", { name: "Render text" }).click();
			await expect(page.locator('img[alt="result"]')).toBeVisible();
		}).toPass({ timeout: 25_000 });
		await expectNoErrorAlert(page);
		expectNoErrors(sink);
	});
}

test("png-to-base64 shows decoded text result", async ({ page }) => {
	const sink = trackErrors(page);
	await openTool(page, "png-to-base64");
	await uploadImage(page, opaquePng);
	const code = page.locator(".result-pre code");
	await expect(code).toBeVisible();
	const text = (await code.textContent()) ?? "";
	expect(text.length).toBeGreaterThan(20);
	await expectNoErrorAlert(page);
	expectNoErrors(sink);
});

for (const [input, expected] of [
	[tinyBase64, "Yes — valid PNG signature."],
	["aGVsbG8=", "No — the content is not a PNG."],
] as const) {
	test(`verify-is-png verdict: ${expected}`, async ({ page }) => {
		await expect(async () => {
			await openTool(page, "verify-is-png");
			await page.locator(".text-source textarea").fill(input);
			await page.getByRole("button", { name: "Render text" }).click();
			await expect(page.locator(".verdict-text")).toContainText(expected);
		}).toPass({ timeout: 25_000 });
	});
}

test("png-is-transparent: opaque image → 'No'", async ({ page }) => {
	await openTool(page, "png-is-transparent");
	await uploadImage(page, opaquePng);
	await expect(page.locator(".verdict-text")).toContainText(
		"No — fully opaque.",
	);
});

test("png-is-transparent: transparent image → 'Yes'", async ({ page }) => {
	await openTool(page, "png-is-transparent");
	await uploadImage(page, transparentPng);
	await expect(page.locator(".verdict-text")).toContainText(
		"Yes — has transparency.",
	);
});

test("png-is-grayscale: colored image → 'No'", async ({ page }) => {
	await openTool(page, "png-is-grayscale");
	await uploadImage(page, opaquePng);
	await expect(page.locator(".verdict-text")).toContainText(
		"No — contains colors.",
	);
});

test("png-orientation: landscape image → Landscape", async ({ page }) => {
	await openTool(page, "png-orientation");
	await uploadImage(page, opaquePng); // 64×48 → landscape
	await expect(page.locator(".verdict-text")).toContainText("Landscape");
});

test("png-file-size: returns a size in KB", async ({ page }) => {
	await openTool(page, "png-file-size");
	await uploadImage(page, opaquePng);
	const verdict = page.locator(".verdict-text");
	await expect(verdict).toBeVisible();
	await expect(verdict).toContainText("KB");
});
