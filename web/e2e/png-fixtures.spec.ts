import { expect, test, type Page } from "playwright/test";
import {
	crcBadAncillaryPng,
	crcBadIdatPng,
	garbageTailPng,
	idatCutPng,
	palette4Png,
	palette256Png,
	sixteenBitPng,
	truncatedHeaderPng,
	truncatedNoIendPng,
	type SourceFile,
} from "./helpers/fixtures";
import {
	errorAlert,
	expectNoErrorAlert,
	expectNoErrors,
	openTool,
	resultImage,
	trackErrors,
	uploadImage,
} from "./helpers/page";

async function expectRejected(page: Page, file: SourceFile): Promise<void> {
	const sink = trackErrors(page);
	await openTool(page, "flip-png");
	await uploadImage(page, file);
	await expect(errorAlert(page)).toBeVisible();
	await expect(resultImage(page)).toHaveCount(0);
	expectNoErrors(sink);
}

async function expectAccepted(page: Page, file: SourceFile): Promise<void> {
	const sink = trackErrors(page);
	await openTool(page, "flip-png");
	await uploadImage(page, file);
	await expect(resultImage(page)).toBeVisible();
	await expectNoErrorAlert(page);
	expectNoErrors(sink);
}

const rejectedFixtures = [
	crcBadIdatPng,
	truncatedHeaderPng,
	truncatedNoIendPng,
	idatCutPng,
];

const acceptedFixtures = [
	crcBadAncillaryPng,
	garbageTailPng,
	palette4Png,
	palette256Png,
	sixteenBitPng,
];

test.describe("PNG special fixtures", () => {
	for (const file of rejectedFixtures) {
		test(`${file.name}: shows an error without a result`, async ({ page }) => {
			await expectRejected(page, file);
		});
	}

	for (const file of acceptedFixtures) {
		test(`${file.name}: decodes without an error`, async ({ page }) => {
			await expectAccepted(page, file);
		});
	}
});
