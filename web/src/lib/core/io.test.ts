import { describe, expect, it } from "vitest";
import { isSupportedImage, unsupportedImageError } from "./io";

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
