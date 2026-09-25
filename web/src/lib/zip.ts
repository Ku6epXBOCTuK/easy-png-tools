import { zipSync } from "fflate";
import { downloadBlob, encode } from "./core/io";
import type { PixelImage } from "./core/types";
import type { ToolImageFile } from "./registry";

export type ZipImageEncoder = (image: PixelImage) => Promise<Uint8Array>;

export async function buildZipEntries(
	files: ToolImageFile[],
	encodeImage: ZipImageEncoder,
): Promise<Record<string, Uint8Array>> {
	const entries: Record<string, Uint8Array> = {};
	for (const file of files) {
		entries[file.name] = await encodeImage(file.image);
	}
	return entries;
}

/**
 * Собирает набор картинок (1 → many) в zip-архив и скачивает его.
 * Картинки кодируются как PNG; кодирование требует DOM — вызов из UI-слоя.
 */
export async function downloadZip(
	files: ToolImageFile[],
	zipName: string,
): Promise<void> {
	if (files.length === 0) return;
	const entries = await buildZipEntries(files, async (image) => {
		const blob = await encode(image, "image/png");
		return new Uint8Array(await blob.arrayBuffer());
	});
	const zipped = zipSync(entries);
	downloadBlob(new Blob([zipped], { type: "application/zip" }), zipName);
}
