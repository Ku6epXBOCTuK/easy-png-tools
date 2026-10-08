import { expect, test } from "playwright/test";
import { pixelRow } from "./helpers/fixtures";
import { ruPageTitle } from "./helpers/i18n";
import { openTool, toolLink, useEnglish } from "./helpers/page";

const flipTitleRu = ruPageTitle("flip-png");

test("catalog search finds a tool by a title from another locale", async ({
	page,
}) => {
	await useEnglish(page);
	await page.goto("/list-tools");
	const input = page.getByRole("textbox");
	const flipCard = toolLink(page, "flip-png");
	await input.fill(flipTitleRu.split(" ")[0].toLowerCase());
	await expect(flipCard).toContainText("Flip PNG");
	await page.getByRole("button", { name: "RU", exact: true }).click();
	await expect(flipCard).toContainText(flipTitleRu);
	await input.fill("flip");
	await expect(flipCard).toContainText(flipTitleRu);
});

test("RU/EN: switching the locale translates the tool heading", async ({
	page,
}) => {
	await openTool(page, "resize-png");
	const ruBtn = page.getByRole("button", { name: "RU", exact: true });
	const enBtn = page.getByRole("button", { name: "EN", exact: true });
	const heading = page.getByRole("heading", { level: 1 });
	await ruBtn.click();
	await expect(heading).toHaveText(ruPageTitle("resize-png"));
	await expect(ruBtn).toHaveAttribute("aria-pressed", "true");
	await enBtn.click();
	await expect(heading).toHaveText("Resize PNG");
});

test("run error is localized and translated on language switch", async ({
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
