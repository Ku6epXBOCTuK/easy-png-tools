import { expect, test } from "playwright/test";
import {
	expectNoErrors,
	toolLink,
	trackErrors,
	useEnglish,
} from "./helpers/page";

test.beforeEach(async ({ page }) => {
	await useEnglish(page);
});

test("catalog exposes a total and category headings", async ({ page }) => {
	const sink = trackErrors(page);
	await page.goto("/list-tools");
	const total = page.getByRole("status", { name: /tools available/i });
	await expect(total).toBeVisible();
	await expect(total).toHaveAttribute("aria-label", /^\d+ /);
	await expect(page.getByRole("heading", { level: 2 }).first()).toBeVisible();
	expectNoErrors(sink);
});

test("catalog search narrows results", async ({ page }) => {
	await page.goto("/list-tools");
	await page.getByRole("textbox", { name: "Search tools" }).fill("resize");
	await expect(toolLink(page, "resize-png")).toBeVisible();
	await expect(toolLink(page, "flip-png")).toBeHidden();
});

test("category filter narrows the catalog and resets", async ({ page }) => {
	await page.goto("/list-tools");
	const convert = page.getByRole("button", { name: /convert/i, exact: true });
	const all = page.getByRole("button", { name: /^all$/i });

	await convert.click();
	await expect(convert).toHaveAttribute("aria-pressed", "true");
	await expect(toolLink(page, "convert-png-to-jpg")).toBeVisible();
	await expect(toolLink(page, "flip-png")).toBeHidden();

	await all.click();
	await expect(all).toHaveAttribute("aria-pressed", "true");
	await expect(toolLink(page, "flip-png")).toBeVisible();
});

test("workspace search matches a tool by title", async ({ page }) => {
	await page.goto("/");
	await page.getByRole("textbox", { name: "Search tools" }).fill("flip");
	await expect(toolLink(page, "flip-png")).toBeVisible();
	await expect(toolLink(page, "resize-png")).toBeHidden();
});
