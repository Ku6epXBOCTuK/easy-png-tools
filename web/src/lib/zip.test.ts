import { unzipSync, zipSync } from "fflate";
import { describe, expect, it, vi } from "vitest";
import type { PixelImage } from "./core/types";
import { buildZipEntries, type ZipImageEncoder } from "./zip";
import type { ToolImageFile } from "./registry";

function image(value: number): PixelImage {
	return {
		width: 1,
		height: 1,
		data: new Uint8ClampedArray([value, value + 1, value + 2, 255]),
	};
}

describe("buildZipEntries", () => {
	it("preserves file order and encoded bytes", async () => {
		const files: ToolImageFile[] = [
			{ name: "part-1-1.png", image: image(10) },
			{ name: "part-1-2.png", image: image(20) },
		];
		const encodeImage = vi.fn(
			async (source: PixelImage) =>
				new Uint8Array([source.data[0], source.data[3]]),
		);

		const entries = await buildZipEntries(files, encodeImage);
		const unzipped = unzipSync(zipSync(entries));

		expect(Object.keys(entries)).toEqual(["part-1-1.png", "part-1-2.png"]);
		expect(Object.keys(unzipped)).toEqual(["part-1-1.png", "part-1-2.png"]);
		expect(unzipped["part-1-1.png"]).toEqual(new Uint8Array([10, 255]));
		expect(unzipped["part-1-2.png"]).toEqual(new Uint8Array([20, 255]));
		expect(encodeImage).toHaveBeenCalledTimes(2);
		expect(encodeImage.mock.calls[0]?.[0]).toBe(files[0]?.image);
		expect(encodeImage.mock.calls[1]?.[0]).toBe(files[1]?.image);
	});

	it("returns an empty entry set without calling the encoder", async () => {
		const encodeImage = vi.fn<ZipImageEncoder>();

		await expect(buildZipEntries([], encodeImage)).resolves.toEqual({});
		expect(encodeImage).not.toHaveBeenCalled();
	});
});
