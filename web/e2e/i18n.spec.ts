import { expect, test } from "playwright/test";
import { opaquePng } from "./helpers/fixtures";
import { openTool, uploadImage } from "./helpers/page";

test("поиск каталога находит по названию из другой локали", async ({
	page,
}) => {
	await page.goto("/list-tools");
	const input = page.locator(".catalog-search input");
	const flipCard = page.locator('a.tool-card[href*="flip-png"]');
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
	await expect(async () => {
		await ruBtn.click();
		await expect(page.locator(".schema-tool h1")).toHaveText(
			"Изменить размер PNG",
		);
	}).toPass();
	await expect(ruBtn).toHaveAttribute("aria-pressed", "true");
	await enBtn.click();
	await expect(page.locator(".schema-tool h1")).toHaveText("Resize PNG");
});

// Валится на известном баге resize-png (дефолтные 0-параметры дают ошибку при
// аплоаде, см. known-issues.spec.ts). Здесь он используется как детерминированная
// ошибка: важно, что её текст локализован, а не сырой ключ.
// TODO: найти другую ошибку, эта будет исправлена при фиксе resize-png
test("ошибка run'а локализуется, не сырой i18n-ключ", async ({ page }) => {
	await openTool(page, "resize-png");
	await uploadImage(page, opaquePng);
	const alert = page.locator("[role='alert']");
	await expect(alert).toBeVisible();
	const text = (await alert.textContent()) ?? "";
	expect(text).not.toMatch(/^errors\./);
	expect(text.length).toBeGreaterThan(3);
});
