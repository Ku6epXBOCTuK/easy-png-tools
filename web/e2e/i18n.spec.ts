import { expect, test } from "playwright/test";
import { pixelRow } from "./helpers/fixtures";
import { openTool, toolLink, useEnglish } from "./helpers/page";

test("поиск каталога находит по названию из другой локали", async ({
	page,
}) => {
	await useEnglish(page);
	await page.goto("/list-tools");
	const input = page.getByRole("textbox");
	const flipCard = toolLink(page, "flip-png");
	await input.fill("отразить");
	await expect(flipCard).toContainText("Flip PNG");
	await page.getByRole("button", { name: "RU", exact: true }).click();
	await expect(flipCard).toContainText("Отразить PNG");
	await input.fill("flip");
	await expect(flipCard).toContainText("Отразить PNG");
});

test("RU/EN: переключение переводит заголовок инструмента", async ({
	page,
}) => {
	await openTool(page, "resize-png");
	const ruBtn = page.getByRole("button", { name: "RU", exact: true });
	const enBtn = page.getByRole("button", { name: "EN", exact: true });
	const heading = page.getByRole("heading", { level: 1 });
	await ruBtn.click();
	await expect(heading).toHaveText("Изменить размер PNG");
	await expect(ruBtn).toHaveAttribute("aria-pressed", "true");
	await enBtn.click();
	await expect(heading).toHaveText("Resize PNG");
});

test("ошибка run'а локализуется и переводится при смене языка", async ({
	page,
}) => {
	await openTool(page, "bytes-to-png");
	await page
		.getByRole("textbox", { name: "Text data" })
		.fill(pixelRow(33, [255, 0, 0, 255]));
	await page.getByRole("button", { name: "Render text" }).click();
	const alert = page.getByRole("alert");
	await expect(alert).toBeVisible();
	await expect(alert).toHaveText(/\S/);
	await expect(alert).not.toHaveText(/^errors\./);
	const english = await alert.textContent();

	await page.getByRole("button", { name: "RU", exact: true }).click();
	await expect(alert).not.toHaveText(english ?? "");
	await expect(alert).not.toHaveText(/^errors\./);
});
