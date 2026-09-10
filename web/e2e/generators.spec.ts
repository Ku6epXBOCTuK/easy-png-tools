import { expect, test } from "playwright/test";
import { expectNoErrors, openTool, trackErrors } from "./helpers/page";

test.describe("generators — known UI gap (#checklist, п.1)", () => {
	// FIXME: Генераторы (21/121) открываются, но в UI нет ни полей схемы, ни кнопки
	// «Generate» — только RU/EN/Reset. Пока баг открыт — fixme с ожидаемым
	// сценарием; после фикса убрать fixme.
	test.fixme("single-color-png renders Generate controls and produces a result", async ({
		page,
	}) => {
		await openTool(page, "single-color-png");
		const generate = page.getByRole("button", { name: "Generate" });
		await expect(generate).toBeVisible();
		await generate.click();
		await expect(page.locator('img[alt="result"]')).toBeVisible();
	});

	test("create-empty-png page opens without errors", async ({ page }) => {
		const sink = trackErrors(page);
		await openTool(page, "create-empty-png");
		await expect(page.locator("h1")).toContainText("Create");
		expectNoErrors(sink);
	});
});
