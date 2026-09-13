import { expect, test } from "playwright/test";
import { opaquePng } from "./helpers/fixtures";
import { openTool, uploadImage } from "./helpers/page";

// FIXME: В файле зарегистрированы баги preview (см. docs/checklist-manual-testing.md
// → «Известные баги preview»). Тела assert'ят ОЖИДАЕМОЕ поведение. Статус fixme
// означает «мы знаем, что сейчас падает»; когда баг починят — убрать fixme и
// тест станет зелёным «сам по себе». (Тест про локализацию ошибок переехал в
// i18n.spec.ts — он больше не issue.)

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
});
