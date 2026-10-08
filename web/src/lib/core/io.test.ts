import { describe, expect, it } from "vitest";
import {
	isSupportedImage,
	unsupportedImageError,
	validateOutputQuality,
} from "./io";

describe("isSupportedImage", () => {
	it.each([
		"image/png",
		"image/jpeg",
		"image/webp",
		"image/gif",
		"image/bmp",
		"image/x-icon",
	])("accepts %s", (type) => {
		expect(isSupportedImage(new File([], "x", { type }))).toBe(true);
	});

	it("rejects unsupported type", () => {
		expect(
			isSupportedImage(new File([], "a.txt", { type: "text/plain" })),
		).toBe(false);
	});

	it("rejects file without type", () => {
		expect(isSupportedImage(new File([], "x"))).toBe(false);
	});
});

describe("unsupportedImageError", () => {
	it("error key and file type in vars", () => {
		const err = unsupportedImageError(
			new File([], "a.txt", { type: "text/plain" }),
		);
		expect(err.key).toBe("errors.unsupportedFile");
		expect(err.vars?.type).toBe("text/plain");
	});

	it("empty type passed as unknown", () => {
		const err = unsupportedImageError(new File([], "x"));
		expect(err.vars?.type).toBe("unknown");
	});
});

describe("validateOutputQuality", () => {
	it.each(["image/jpeg", "image/webp"] as const)(
		"accepts bounds 0 and 1 for %s",
		(mime) => {
			expect(() => validateOutputQuality(mime, 0)).not.toThrow();
			expect(() => validateOutputQuality(mime, 1)).not.toThrow();
		},
	);

	it.each(["image/jpeg", "image/webp"] as const)(
		"rejects value outside 0..1 for %s",
		(mime) => {
			expect(() => validateOutputQuality(mime, -0.01)).toThrow(
				"errors.qualityRange",
			);
			expect(() => validateOutputQuality(mime, 1.01)).toThrow(
				"errors.qualityRange",
			);
			expect(() => validateOutputQuality(mime, Number.NaN)).toThrow(
				"errors.qualityRange",
			);
		},
	);

	it("ignores quality for PNG and BMP", () => {
		expect(() => validateOutputQuality("image/png", 2)).not.toThrow();
		expect(() => validateOutputQuality("image/bmp", 2)).not.toThrow();
	});
});
