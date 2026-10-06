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

type DecodeContract = {
	file: SourceFile;
	rejectedIn: readonly string[];
};

const decodeContracts: readonly DecodeContract[] = [
	{ file: crcBadIdatPng, rejectedIn: ["chromium", "firefox"] },
	{ file: truncatedHeaderPng, rejectedIn: ["chromium", "firefox", "webkit"] },
	{ file: truncatedNoIendPng, rejectedIn: ["chromium"] },
	{ file: idatCutPng, rejectedIn: ["chromium"] },
	{ file: crcBadAncillaryPng, rejectedIn: [] },
	{ file: garbageTailPng, rejectedIn: [] },
	{ file: palette4Png, rejectedIn: [] },
	{ file: palette256Png, rejectedIn: [] },
	{ file: sixteenBitPng, rejectedIn: [] },
];

// На этих файлах createImageBitmap в webkit не завершается: ни результата, ни
// ошибки — контракт «accept или reject» проверить нельзя.
const webkitHangs = new Set([
	"truncated-header.png",
	"crc-bad-ancillary.png",
	"palette-256.png",
]);

test.describe("PNG special fixtures", () => {
	for (const { file, rejectedIn } of decodeContracts) {
		test(`${file.name}: matches the engine decode contract`, async ({
			browserName,
			page,
		}) => {
			test.fixme(
				browserName === "webkit" && webkitHangs.has(file.name),
				"webkit createImageBitmap зависает на этом файле",
			);
			if (rejectedIn.includes(browserName)) {
				await expectRejected(page, file);
			} else {
				await expectAccepted(page, file);
			}
		});
	}
});
