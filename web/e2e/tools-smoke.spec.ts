import { expect, test } from "playwright/test";
import { opaquePng, transparentPng } from "./helpers/fixtures";
import type { SourceFile } from "./helpers/fixtures";
import {
	trackErrors,
	openTool,
	uploadImage,
	expectNoErrorAlert,
	expectNoErrors,
} from "./helpers/page";

type Kind = "image" | "text-out" | "verdict";

const CASES: { id: string; kind: Kind; file?: SourceFile }[] = [
	// ── convert ────────────────────────────────────────────────
	{ id: "convert-png-to-jpg", kind: "image" },
	{ id: "convert-png-to-webp", kind: "image" },
	{ id: "png-to-bmp", kind: "image" },
	{ id: "png-to-base64", kind: "text-out" },
	// ── alpha ──────────────────────────────────────────────────
	{ id: "remove-background-png", kind: "image", file: transparentPng },
	{ id: "remove-color-from-png", kind: "image", file: transparentPng },
	{ id: "round-corners-png", kind: "image", file: transparentPng },
	{ id: "add-stroke-png", kind: "image", file: transparentPng },
	{ id: "circle-mask-png", kind: "image", file: transparentPng },
	{ id: "wavy-mask-png", kind: "image", file: transparentPng },
	{ id: "find-contour-png", kind: "image", file: transparentPng },
	{ id: "feather-edges-png", kind: "image", file: transparentPng },
	{ id: "clean-edges-png", kind: "image", file: transparentPng },
	{ id: "make-thicker-png", kind: "image", file: transparentPng },
	{ id: "make-thinner-png", kind: "image", file: transparentPng },
	{ id: "despeckle-alpha-png", kind: "image", file: transparentPng },
	{ id: "close-holes-png", kind: "image", file: transparentPng },
	{ id: "harden-alpha-png", kind: "image", file: transparentPng },
	{ id: "invert-alpha-png", kind: "image", file: transparentPng },
	{ id: "set-alpha-channel-png", kind: "image", file: transparentPng },
	{ id: "extract-alpha-mask-png", kind: "image", file: transparentPng },
	{ id: "remove-alpha-channel-png", kind: "image", file: transparentPng },
	{ id: "square-mask-png", kind: "image", file: transparentPng },
	{ id: "star-mask-png", kind: "image", file: transparentPng },
	// ── color ──────────────────────────────────────────────────
	{ id: "grayscale-png", kind: "image" },
	{ id: "invert-colors-png", kind: "image" },
	{ id: "sepia-png", kind: "image" },
	{ id: "quantize-png", kind: "image" },
	{ id: "dithering-png", kind: "image" },
	{ id: "decrease-color-count-png", kind: "image" },
	{ id: "two-colors-png", kind: "image" },
	{ id: "tint-png", kind: "image" },
	{ id: "auto-contrast-png", kind: "image" },
	{ id: "png-to-hsl", kind: "image" },
	{ id: "png-to-cmyk", kind: "image" },
	// ── geometry ───────────────────────────────────────────────
	{ id: "flip-png", kind: "image" },
	{ id: "rotate-png", kind: "image" },
	{ id: "add-border-png", kind: "image" },
	{ id: "tile-png", kind: "image" },
	{ id: "change-canvas-size-png", kind: "image" },
	{ id: "trim-empty-space-png", kind: "image" },
	{ id: "swap-orientation-png", kind: "image" },
	{ id: "skew-png", kind: "image" },
	{ id: "zoom-png", kind: "image" },
	{ id: "center-by-alpha-png", kind: "image" },
	{ id: "change-aspect-ratio-png", kind: "image" },
	{ id: "symmetric-copy-png", kind: "image" },
	{ id: "shift-png", kind: "image" },
	// ── filters ────────────────────────────────────────────────
	{ id: "blur-png", kind: "image" },
	{ id: "sharpen-png", kind: "image" },
	{ id: "pixelate-png", kind: "image" },
	{ id: "add-noise-png", kind: "image" },
	{ id: "vignette-png", kind: "image" },
	{ id: "silhouette-png", kind: "image" },
	{ id: "randomize-pixels-png", kind: "image" },
	{ id: "jpeg-artifacts-png", kind: "image" },
	// ── text ───────────────────────────────────────────────────
	{ id: "add-text-png", kind: "image" },
	{ id: "date-stamp-png", kind: "image" },
	{ id: "watermark-tile-png", kind: "image" },
	// ── analyze (image output) ─────────────────────────────────
	{ id: "extract-color-from-png", kind: "image", file: transparentPng },
	{ id: "show-transparent-png", kind: "image", file: transparentPng },
	{ id: "light-pixel-mask-png", kind: "image", file: transparentPng },
	{ id: "extract-channel-png", kind: "image", file: transparentPng },
	{ id: "unique-color-mask-png", kind: "image", file: transparentPng },
	{ id: "show-grayscale-pixels-png", kind: "image", file: transparentPng },
	{ id: "show-color-pixels-png", kind: "image", file: transparentPng },
	{ id: "dark-pixel-mask-png", kind: "image", file: transparentPng },
	// ── analyze (verdict output) ───────────────────────────────
	{ id: "png-is-transparent", kind: "verdict" },
	{ id: "png-is-grayscale", kind: "verdict" },
	{ id: "png-orientation", kind: "verdict" },
	{ id: "png-file-size", kind: "verdict" },
];

test.describe("smoke: tools produce output without errors", () => {
	for (const { id, kind, file: fixture } of CASES) {
		test(`tool ${id} (${kind})`, async ({ page }) => {
			const sink = trackErrors(page);

			const outputLocator = (): ReturnType<typeof page.locator> => {
				switch (kind) {
					case "image":
						return page.locator('img[alt="result"]');
					case "text-out":
						return page.locator(".result-pre code");
					case "verdict":
						return page.locator(".verdict-text");
				}
			};

			// toPass: устойчивость к hydration-рейсу (ввод до гидрации SvelteKit
			// может не обработаться с первого раза).
			await expect(async () => {
				await openTool(page, id);
				await uploadImage(page, fixture ?? opaquePng);
				await expect(outputLocator()).toBeVisible({ timeout: 8_000 });
			}).toPass({ timeout: 25_000 });

			await expectNoErrorAlert(page);
			expectNoErrors(sink);
		});
	}
});
