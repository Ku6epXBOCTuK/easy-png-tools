import { readFile } from "node:fs/promises";
import {
	expect,
	type Download,
	type Locator,
	type Page,
} from "playwright/test";
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

export async function openTool(page: Page, slug: string): Promise<void> {
	await useEnglish(page);
	await page.goto(`/tools/${slug}`);
	await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
}

export function toolLink(page: Page, slug: string): Locator {
	return page.locator(`a[href="/tools/${slug}"]`);
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

export async function renderText(page: Page, value: string): Promise<void> {
	const input = page.getByRole("textbox", { name: "Text data" });
	await input.fill(value);
	await page.getByRole("button", { name: "Render text" }).click();
}

export async function uploadImage(page: Page, file: SourceFile): Promise<void> {
	// На странице может быть два input[type=file]: дропзона + кнопка Open image;
	// канонический — первый (кнопка в шапке панели).
	const input = page.locator('input[type="file"]').first();
	await expect(input).toBeAttached();
	await input.setInputFiles({
		name: file.name,
		mimeType: file.mimeType,
		buffer: file.buffer,
	});
}

export async function uploadViaDrop(
	page: Page,
	file: SourceFile,
): Promise<void> {
	const dataTransfer = await page.evaluateHandle(
		({
			bytes,
			name,
			mimeType,
		}: {
			bytes: number[];
			name: string;
			mimeType: string;
		}) => {
			const dt = new DataTransfer();
			dt.items.add(new File([new Uint8Array(bytes)], name, { type: mimeType }));
			return dt;
		},
		{
			bytes: Array.from(file.buffer),
			name: file.name,
			mimeType: file.mimeType,
		},
	);
	await page
		.getByRole("button", { name: /drop a png/i })
		.dispatchEvent("drop", { dataTransfer });
}

export async function downloadResultFile(page: Page): Promise<Download> {
	const button = page.getByRole("button", { name: "Download result" });
	await expect(button).toBeVisible();
	const [download] = await Promise.all([
		page.waitForEvent("download"),
		button.click(),
	]);
	return download;
}

export async function downloadResultBytes(
	page: Page,
): Promise<{ name: string; bytes: Uint8Array }> {
	const download = await downloadResultFile(page);
	const path = await download.path();
	if (!path) throw new Error("download path is unavailable");
	return {
		name: download.suggestedFilename(),
		bytes: new Uint8Array(await readFile(path)),
	};
}

export async function downloadResult(page: Page): Promise<string> {
	return (await downloadResultFile(page)).suggestedFilename();
}

export async function expectNoErrorAlert(page: Page): Promise<void> {
	await expect(errorAlert(page)).toHaveCount(0);
}

export async function expectNoErrors(sink: ErrorSink): Promise<void> {
	expect(sink.errors, "нет console/page errors").toEqual([]);
}
