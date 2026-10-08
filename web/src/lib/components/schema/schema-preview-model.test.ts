import { describe, expect, it } from "vitest";
import {
	hasPreviewResult,
	type SchemaPreviewModelInput,
} from "./schema-preview-model";

const image = { width: 2, height: 3, data: new Uint8ClampedArray(24) };

function input(over: Partial<SchemaPreviewModelInput> = {}) {
	return {
		inputMode: "image",
		resultKind: "image",
		result: null,
		fileResult: null,
		textResult: null,
		...over,
	} satisfies SchemaPreviewModelInput;
}

describe("hasPreviewResult", () => {
	it("image: result only when image present", () => {
		expect(hasPreviewResult(input({ result: image }))).toBe(true);
		expect(hasPreviewResult(input())).toBe(false);
	});

	it("files: result only for non-empty set", () => {
		const fileResult = { files: [{ name: "part.png", image }] };
		expect(hasPreviewResult(input({ resultKind: "files", fileResult }))).toBe(
			true,
		);
		expect(
			hasPreviewResult(
				input({ resultKind: "files", fileResult: { files: [] } }),
			),
		).toBe(false);
	});

	it.each(["text", "verdict"] as const)(
		"%s: result depends on text presence",
		(resultKind) => {
			expect(hasPreviewResult(input({ resultKind, textResult: "done" }))).toBe(
				true,
			);
			expect(hasPreviewResult(input({ resultKind }))).toBe(false);
		},
	);
});
