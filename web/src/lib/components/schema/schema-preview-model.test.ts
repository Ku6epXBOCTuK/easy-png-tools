import { describe, expect, it } from "vitest";
import { makeImage } from "../../core/test-helpers";
import {
	buildSchemaPreviewModel,
	type PreviewTranslate,
} from "./schema-preview-model";

const image = makeImage(2, 3, [
	[1, 2, 3, 255],
	[4, 5, 6, 255],
	[7, 8, 9, 255],
	[10, 11, 12, 255],
	[13, 14, 15, 255],
	[16, 17, 18, 255],
]);

const translate: PreviewTranslate = (key) => {
	if (key === "resultCard.parts") return "parts";
	if (key === "textInput.heading") return "Text";
	return key;
};

function input(
	overrides: Partial<Parameters<typeof buildSchemaPreviewModel>[0]> = {},
) {
	return {
		inputMode: "image" as const,
		resultKind: "image" as const,
		source: null,
		result: null,
		fileResult: null,
		textResult: null,
		...overrides,
	};
}

describe("buildSchemaPreviewModel", () => {
	it("formats source values for every input mode", () => {
		expect(
			buildSchemaPreviewModel(input({ inputMode: "none" }), translate),
		).toMatchObject({ sourceValue: "—" });
		expect(
			buildSchemaPreviewModel(input({ inputMode: "text" }), translate),
		).toMatchObject({ sourceValue: "Text" });
		expect(
			buildSchemaPreviewModel(
				input({ inputMode: "image", source: image }),
				translate,
			),
		).toMatchObject({ sourceValue: "2 × 3 px" });
	});

	it("formats image results and enables download only with a result", () => {
		expect(
			buildSchemaPreviewModel(input({ result: image }), translate),
		).toEqual({
			sourceValue: "—",
			resultValue: "2 × 3 px",
			hasResult: true,
		});
		expect(buildSchemaPreviewModel(input(), translate)).toMatchObject({
			resultValue: "—",
			hasResult: false,
		});
	});

	it("formats file results as ZIP and rejects empty file results", () => {
		const fileResult = { files: [{ name: "part.png", image }] };
		expect(
			buildSchemaPreviewModel(
				input({ resultKind: "files", fileResult }),
				translate,
			),
		).toEqual({
			sourceValue: "—",
			resultValue: "1 parts",
			hasResult: true,
		});
		expect(
			buildSchemaPreviewModel(
				input({ resultKind: "files", fileResult: { files: [] } }),
				translate,
			),
		).toMatchObject({ resultValue: "—", hasResult: false });
	});

	it.each(["text", "verdict"] as const)(
		"uses text result presence for %s output",
		(resultKind) => {
			expect(
				buildSchemaPreviewModel(
					input({ resultKind, textResult: "done" }),
					translate,
				),
			).toMatchObject({
				resultValue: "Text",
				hasResult: true,
			});
			expect(
				buildSchemaPreviewModel(input({ resultKind }), translate),
			).toMatchObject({
				resultValue: "—",
				hasResult: false,
			});
		},
	);
});
