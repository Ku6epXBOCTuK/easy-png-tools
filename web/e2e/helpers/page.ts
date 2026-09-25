import { expect, type Locator, type Page } from "playwright/test";
import type { SourceFile } from "./fixtures";

export const TEST_IDS = {
	source: "source-image",
	result: "result-image",
	verdict: "result-verdict",
	empty: "empty-state",
} as const;

export type ErrorSink = { errors: string[] };

export function trackErrors(page: Page): ErrorSink {
	const errors: string[] = [];
	page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
	page.on("console", (m) => {
		if (m.type() === "error") errors.push(`console: ${m.text()}`);
	});
	return { errors };
}

export async function useEnglish(page: Page): Promise<void> {
	await page.addInitScript(() => {
		window.localStorage.setItem("locale", "en");
	});
}

export async function openTool(page: Page, id: string): Promise<void> {
	await useEnglish(page);
	await page.goto(`/tools/${id}`);
	await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
}

export function toolLink(page: Page, id: string): Locator {
	return page.locator(`a[href="/tools/${id}"]`);
}

export function resultImage(page: Page): Locator {
	return page.getByTestId(TEST_IDS.result);
}

export function sourceImage(page: Page): Locator {
	return page.getByTestId(TEST_IDS.source);
}

export function verdictStatus(page: Page): Locator {
	return page.getByTestId(TEST_IDS.verdict);
}

export function textResult(page: Page): Locator {
	return page.getByLabel("Text result");
}

export function errorAlert(page: Page): Locator {
	return page.getByRole("alert");
}

export function emptyState(page: Page): Locator {
	return page.getByTestId(TEST_IDS.empty);
}

export function rangeInput(page: Page, name: RegExp | string): Locator {
	return page.getByRole("slider", { name });
}

export async function uploadImage(page: Page, file: SourceFile): Promise<void> {
	const input = page.locator('input[type="file"]');
	await expect(input).toHaveCount(1);
	await input.setInputFiles({
		name: file.name,
		mimeType: file.mimeType,
		buffer: file.buffer,
	});
}

export async function downloadResult(page: Page): Promise<string> {
	const button = page.getByRole("button", { name: "Download result" });
	await expect(button).toBeVisible();
	const [download] = await Promise.all([
		page.waitForEvent("download"),
		button.click(),
	]);
	return download.suggestedFilename();
}

export async function expectNoErrorAlert(page: Page): Promise<void> {
	await expect(errorAlert(page)).toHaveCount(0);
}

export async function expectNoErrors(sink: ErrorSink): Promise<void> {
	expect(sink.errors, "нет console/page errors").toEqual([]);
}
