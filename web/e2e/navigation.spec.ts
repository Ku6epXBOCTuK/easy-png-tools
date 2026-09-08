import { expect, test } from "playwright/test";
import { trackErrors, expectNoErrors } from "./helpers/page";

const ROUTES = [
	"/preview",
	"/preview/list-tools",
	"/preview/kit",
	"/preview/tools/flip-png",
];

for (const route of ROUTES) {
	test(`page ${route} loads without errors`, async ({ page }) => {
		const sink = trackErrors(page);
		const resp = await page.goto(route);
		expect(resp?.status()).toBe(200);
		await page.waitForLoadState("networkidle");
		expectNoErrors(sink);
	});
}

test("unknown tool route responds 404 on static build", async ({ page }) => {
	const resp = await page.goto("/preview/tools/definitely-not-a-tool");
	expect(resp?.status()).toBe(404);
});

test("theme toggle flips preview theme and persists to localStorage", async ({
	page,
}) => {
	await page.goto("/preview");
	const root = page.locator("main.preview-root");
	const before = await root.getAttribute("data-theme");
	await expect(async () => {
		await page.getByRole("button", { name: "Toggle theme" }).click();
		const after = await root.getAttribute("data-theme");
		expect(after).not.toBe(before);
	}).toPass();
	const after = await root.getAttribute("data-theme");
	const stored = await page.evaluate(() =>
		localStorage.getItem("easy-png-tools:theme"),
	);
	expect(["light", "dark"]).toContain(before);
	expect(["light", "dark"]).toContain(after);
	expect(stored).toBe(after);
});

test("language toggle marks the active button", async ({ page }) => {
	await page.goto("/preview");
	const group = page.getByRole("group", { name: "Language" });
	await expect(async () => {
		await group.getByRole("button", { name: "EN" }).click();
		await expect(page.locator(".lang-btn.active")).toHaveText("EN");
	}).toPass();
});
