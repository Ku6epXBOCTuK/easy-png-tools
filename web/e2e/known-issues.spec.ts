import { expect, test } from "playwright/test";
import { opaquePng } from "./helpers/fixtures";
import { openTool, resultImage, uploadImage } from "./helpers/page";

// FIXME: В файле зарегистрированы баги production UI (см.
// `docs/backlog.md` и `docs/checklist-manual-testing.md`, раздел G). Тела
// assert'ят ОЖИДАЕМОЕ поведение. Статус fixme означает «мы знаем, что сейчас
// падает»; когда баг починят — убрать fixme и тест станет зелёным «сам по
// себе».

test.describe("known bugs — documented as fixme", () => {
	test.fixme("resize-png: upload produces a resized result (no alert)", async ({
		page,
	}) => {
		await openTool(page, "resize-png");
		await uploadImage(page, opaquePng);
		await expect(page.getByRole("alert")).toHaveCount(0);
		await expect(resultImage(page)).toBeVisible();
	});

	test.fixme("crop-png: upload produces a cropped result (no alert)", async ({
		page,
	}) => {
		await openTool(page, "crop-png");
		await uploadImage(page, opaquePng);
		await expect(page.getByRole("alert")).toHaveCount(0);
		await expect(resultImage(page)).toBeVisible();
	});
});
