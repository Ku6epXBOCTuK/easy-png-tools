import type { ToolEntry } from "./types";
import { field, toolSchema } from "../registry-schema";
import { extractByColor } from "../core/masks";

interface ExtractColorParams {
	color: string;
	tolerance: number;
}

export const extractColorSchema = toolSchema<ExtractColorParams>({
	color: field.color({ default: "#00ff88" }),
	tolerance: field.slider({ min: 0, max: 50, step: 1, default: 10 }),
});

const extractColor: ToolEntry<ExtractColorParams> = {
	id: "extract-color-from-png",
	title: "Extract Color from PNG",
	description:
		"Keeps only pixels close to the chosen color and makes everything else transparent — the inverse of Remove Color.",
	category: "analyze",
	schema: extractColorSchema,
	run: (img, p) => extractByColor(img, p.color, p.tolerance),
};

export const analyzeEntries = [extractColor];
