import { zipSync } from "fflate";
import { downloadBlob, encode } from "./core/io";
import type { ToolImageFile } from "./registry";

/**
 * Собирает набор картинок (1 → many) в zip-архив и скачивает его.
 * Картинки кодируются как PNG; кодирование требует DOM — вызов из UI-слоя.
 */
export async function downloadZip(
	files: ToolImageFile[],
	zipName: string,
): Promise<void> {
	if (files.length === 0) return;
	const entries: Record<string, Uint8Array> = {};
	for (const file of files) {
		const blob = await encode(file.image, "image/png");
		entries[file.name] = new Uint8Array(await blob.arrayBuffer());
	}
	const zipped = zipSync(entries);
	downloadBlob(new Blob([zipped], { type: "application/zip" }), zipName);
}
