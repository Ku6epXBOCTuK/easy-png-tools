import { expect, test } from "playwright/test";
import { expectNoErrors, trackErrors, useEnglish } from "./helpers/page";

const ROUTES = ["/", "/list-tools", "/kit", "/tools/flip-png"];

test.beforeEach(async ({ page }) => {
	await useEnglish(page);
});

for (const route of ROUTES) {
	test(`page ${route} loads without errors`, async ({ page }) => {
		const sink = trackErrors(page);
		const resp = await page.goto(route);
		expect(resp?.status()).toBe(200);
		await expect(page.getByRole("main")).toBeVisible();
		expectNoErrors(sink);
	});
}

test("unknown tool route responds 404 on static build", async ({ page }) => {
	const resp = await page.goto("/tools/definitely-not-a-tool");
	expect(resp?.status()).toBe(404);
});

test("theme toggle persists the selected theme", async ({ page }) => {
	const sink = trackErrors(page);
	await page.goto("/");
	const main = page.getByRole("main");
	const before = await main.getAttribute("data-theme");
	expect(["light", "dark"]).toContain(before);

	await page.getByRole("button", { name: "Toggle theme" }).click();
	await expect(main).not.toHaveAttribute("data-theme", before ?? "");
	const after = await main.getAttribute("data-theme");
	const stored = await page.evaluate(() => localStorage.getItem("theme"));
	expect(["light", "dark"]).toContain(after);
	expect(stored).toBe(after);

	await page.reload();
	await expect(main).toHaveAttribute("data-theme", after ?? "");
	expectNoErrors(sink);
});

test("language toggle marks the active button", async ({ page }) => {
	await page.goto("/");
	const group = page.getByRole("group", { name: "Language" });
	const en = group.getByRole("button", { name: "EN" });
	await en.click();
	await expect(en).toHaveAttribute("aria-pressed", "true");
	await expect(group.getByRole("button", { name: "RU" })).toHaveAttribute(
		"aria-pressed",
		"false",
	);
});
