import { expect, test } from "playwright/test";
import { opaquePng } from "./helpers/fixtures";
import { openTool, uploadImage } from "./helpers/page";

// FIXME: Весь файл — зарегистрированные баги preview (см. docs/checklist-manual-testing.md
// → «Известные баги preview»). Тела assert'ят ОЖИДАЕМОЕ поведение. Статус fixme
// означает «мы знаем, что сейчас падает»; когда баг починят — убрать fixme и
// тест станет зелёным «сам по себе».

test.describe("known bugs — documented as fixme", () => {
	test.fixme("resize-png: upload produces a resized result (no alert)", async ({
		page,
	}) => {
		await openTool(page, "resize-png");
		await uploadImage(page, opaquePng);
		await expect(page.locator("[role='alert']")).toHaveCount(0);
		await expect(page.locator('img[alt="result"]')).toBeVisible();
	});

	test.fixme("crop-png: upload produces a cropped result (no alert)", async ({
		page,
	}) => {
		await openTool(page, "crop-png");
		await uploadImage(page, opaquePng);
		await expect(page.locator("[role='alert']")).toHaveCount(0);
		await expect(page.locator('img[alt="result"]')).toBeVisible();
	});

	test.fixme("error message is localized, not a raw i18n key", async ({
		page,
	}) => {
		await openTool(page, "resize-png");
		await uploadImage(page, opaquePng);
		const alert = page.locator("[role='alert']");
		await expect(alert).toBeVisible();
		const text = (await alert.textContent()) ?? "";
		expect(text).not.toMatch(/^errors\./);
		expect(text.length).toBeGreaterThan(3);
	});
});
