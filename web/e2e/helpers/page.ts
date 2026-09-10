import { expect, type Page } from "playwright/test";
import type { SourceFile } from "./fixtures";

export type ErrorSink = { errors: string[] };

export function trackErrors(page: Page): ErrorSink {
	const errors: string[] = [];
	page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
	page.on("console", (m) => {
		if (m.type() === "error") errors.push(`console: ${m.text()}`);
	});
	return { errors };
}

export async function openTool(page: Page, id: string): Promise<void> {
	await page.goto(`/tools/${id}`);
	await expect(page.locator(".schema-tool h1")).toBeVisible();
}

export async function uploadImage(page: Page, file: SourceFile): Promise<void> {
	await page.locator('.actions input[type="file"]').setInputFiles({
		name: file.name,
		mimeType: file.mimeType,
		buffer: file.buffer,
	});
}

export async function metaValue(page: Page, caption: string): Promise<string> {
	const row = page.locator(".meta-row", { hasText: caption });
	await expect(row).toBeVisible();
	const value = await row.locator(".meta-value").textContent();
	return value?.trim() ?? "";
}

export async function suggestedDownloadName(
	page: Page,
	selector: string,
): Promise<string> {
	const [download] = await Promise.all([
		page.waitForEvent("download"),
		page.locator(selector).click(),
	]);
	return download.suggestedFilename();
}

export async function expectNoErrorAlert(page: Page): Promise<void> {
	await expect(page.locator('[role="alert"]')).toHaveCount(0);
}

export async function expectNoErrors(sink: ErrorSink): Promise<void> {
	expect(sink.errors, "нет console/page errors").toEqual([]);
}
