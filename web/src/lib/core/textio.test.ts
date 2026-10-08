import { describe, expect, it } from "vitest";
import {
	base64ToBytes,
	bytesToImage,
	imageToByteRows,
	imageToRgbValues,
	looksLikePng,
	rgbValuesToImage,
	stripDataUri,
} from "./textio";
import { makeImage } from "./test-helpers";

const img = makeImage(2, 1, [
	[255, 0, 0, 255],
	[0, 255, 0, 128],
]);

describe("bytes", () => {
	it("round-trip rows -> image -> rows", () => {
		const rows = imageToByteRows(img);
		expect(rows).toBe("255 0 0 255  0 255 0 128");
		const back = bytesToImage(rows, 2);
		expect([...back.data]).toEqual([...img.data]);
	});

	it("byte count not multiple of four - error", () => {
		expect(() => bytesToImage("1 2 3", 1)).toThrow(/errors\.bytesCount/);
	});

	it("value outside 0..255 - range error", () => {
		expect(() => bytesToImage("10 20 30 256", 1)).toThrow(/errors\.byteRange/);
	});
});

describe("rgb values", () => {
	it("round-trip rgba rows", () => {
		const rows = imageToRgbValues(img);
		expect(rows.split("\n")[0]).toBe(
			"rgba(255, 0, 0, 255)  rgba(0, 255, 0, 128)",
		);
		const back = rgbValuesToImage(rows.replace(/rgba\(|\)/g, ""), 2);
		expect([...back.data]).toEqual([...img.data]);
	});
});

describe("png signature / data-uri", () => {
	it("looksLikePng: real signature and truncated one", () => {
		const good = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 1]);
		const bad = new Uint8Array([137, 80, 78]);
		expect(looksLikePng(good)).toBe(true);
		expect(looksLikePng(bad)).toBe(false);
	});

	it("stripDataUri strips prefix, keeps pure base64", () => {
		expect(stripDataUri("data:image/png;base64,iVBORw==")).toBe("iVBORw==");
		expect(stripDataUri("  iVBORw==")).toBe("iVBORw==");
	});
});

describe("base64ToBytes", () => {
	it("decodes known string", () => {
		const bytes = base64ToBytes("AAECAwQ=");
		expect([...bytes]).toEqual([0, 1, 2, 3, 4]);
	});
});
