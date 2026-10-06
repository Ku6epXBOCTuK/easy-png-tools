import type { PixelImage } from "$lib/core/types";
import type { FileResult, InputMode, ResultKind } from "$lib/registry";

export type SchemaPreviewModelInput = {
	inputMode: InputMode;
	resultKind: ResultKind;
	result: PixelImage | null;
	fileResult: FileResult | null;
	textResult: string | null;
};

/** Можно ли скачать результат: он есть и он не пустой. */
export function hasPreviewResult(input: SchemaPreviewModelInput): boolean {
	const { resultKind, result, fileResult, textResult } = input;
	if (resultKind === "image") return Boolean(result);
	if (resultKind === "files") {
		return Boolean(fileResult && fileResult.files.length > 0);
	}
	return Boolean(textResult);
}
