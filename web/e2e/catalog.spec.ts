import { expect, test } from "playwright/test";
import { expectNoErrors, trackErrors } from "./helpers/page";

const TOTAL = 122;
const GROUPS = 8;

test("catalog shows total and all groups", async ({ page }) => {
	const sink = trackErrors(page);
	await page.goto("/list-tools");
	await expect(page.locator(".catalog-total b")).toHaveText(String(TOTAL));
	await expect(page.locator(".catalog-group")).toHaveCount(GROUPS);
	expectNoErrors(sink);
});

test("catalog search narrows results", async ({ page }) => {
	await page.goto("/list-tools");
	await expect(async () => {
		await page.getByRole("textbox", { name: "Search tools" }).fill("resize");
		await expect(page.locator(".tool-card")).toHaveCount(1);
	}).toPass();
	await expect(page.locator(".tool-card").first()).toContainText("Resize PNG");
});

test("category filter shows only matching group and resets on ALL", async ({
	page,
}) => {
	await page.goto("/list-tools");
	const allButtons = page.locator(".tool-card");
	const allCount = await allButtons.count();
	expect(allCount).toBe(TOTAL);

	await expect(async () => {
		await page.getByRole("button", { name: "CONVERT" }).click();
		await expect(page.locator(".catalog-group")).toHaveCount(1);
	}).toPass();
	await expect(page.locator(".catalog-group")).toContainText("Convert");
	const convertCards = await page.locator(".tool-card").count();
	expect(convertCards).toBeGreaterThan(0);
	expect(convertCards).toBeLessThan(allCount);

	await expect(async () => {
		await page.getByRole("button", { name: "ALL" }).click();
		await expect(page.locator(".catalog-group")).toHaveCount(GROUPS);
	}).toPass();
	await expect(page.locator(".tool-card")).toHaveCount(allCount);
});

test("workspace search matches a tool by title", async ({ page }) => {
	await page.goto("/");
	await expect(async () => {
		await page.getByRole("textbox", { name: "Search tools" }).fill("flip");
		await expect(page.locator(".tool-card")).toHaveCount(1);
	}).toPass();
	await expect(page.locator(".tool-card").first()).toContainText("Flip PNG");
});
