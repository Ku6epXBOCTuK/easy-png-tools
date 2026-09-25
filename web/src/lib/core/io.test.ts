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
	])("принимает %s", (type) => {
		expect(isSupportedImage(new File([], "x", { type }))).toBe(true);
	});

	it("отклоняет неподдерживаемый тип", () => {
		expect(
			isSupportedImage(new File([], "a.txt", { type: "text/plain" })),
		).toBe(false);
	});

	it("отклоняет файл без типа", () => {
		expect(isSupportedImage(new File([], "x"))).toBe(false);
	});
});

describe("unsupportedImageError", () => {
	it("ключ ошибки и тип файла в vars", () => {
		const err = unsupportedImageError(
			new File([], "a.txt", { type: "text/plain" }),
		);
		expect(err.key).toBe("errors.unsupportedFile");
		expect(err.vars?.type).toBe("text/plain");
	});

	it("пустой тип передаётся как unknown", () => {
		const err = unsupportedImageError(new File([], "x"));
		expect(err.vars?.type).toBe("unknown");
	});
});

describe("validateOutputQuality", () => {
	it.each(["image/jpeg", "image/webp"] as const)(
		"принимает границы 0 и 1 для %s",
		(mime) => {
			expect(() => validateOutputQuality(mime, 0)).not.toThrow();
			expect(() => validateOutputQuality(mime, 1)).not.toThrow();
		},
	);

	it.each(["image/jpeg", "image/webp"] as const)(
		"отклоняет значение вне 0..1 для %s",
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

	it("не применяет quality к PNG и BMP", () => {
		expect(() => validateOutputQuality("image/png", 2)).not.toThrow();
		expect(() => validateOutputQuality("image/bmp", 2)).not.toThrow();
	});
});
