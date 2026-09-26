import type { PixelImage } from "../core/types";
import type { FileResult, InputMode, ResultKind } from "../registry";

export type PreviewTranslate = (key: string) => string;

export type SchemaPreviewModelInput = {
	inputMode: InputMode;
	resultKind: ResultKind;
	source: PixelImage | null;
	result: PixelImage | null;
	fileResult: FileResult | null;
	textResult: string | null;
};

export type SchemaPreviewModel = {
	sourceValue: string;
	resultValue: string;
	formatValue: string;
	hasResult: boolean;
};

export function buildSchemaPreviewModel(
	input: SchemaPreviewModelInput,
	translate: PreviewTranslate,
): SchemaPreviewModel {
	const { inputMode, resultKind, source, result, fileResult, textResult } =
		input;
	const sourceValue =
		inputMode === "none"
			? "—"
			: inputMode === "text"
				? translate("textInput.heading")
				: source
					? `${source.width} × ${source.height} px`
					: "—";
	const hasFiles = Boolean(fileResult && fileResult.files.length > 0);
	const resultValue =
		resultKind === "image"
			? result
				? `${result.width} × ${result.height} px`
				: "—"
			: resultKind === "files"
				? hasFiles
					? `${fileResult?.files.length} ${translate("resultCard.parts")}`
					: "—"
				: textResult
					? translate("textInput.heading")
					: "—";
	return {
		sourceValue,
		resultValue,
		formatValue: resultKind === "files" ? "ZIP (PNG)" : "PNG",
		hasResult:
			resultKind === "image"
				? Boolean(result)
				: resultKind === "files"
					? hasFiles
					: Boolean(textResult),
	};
}
