import type { ToolEntry } from "./types";
import { field, toolSchema, type Dimension } from "../registry-schema";
import { solidImage } from "../core/generate";
import { hexToRgb } from "../core/palette";

interface CreateEmptyParams {
	size: Dimension;
	transparent: boolean;
	color: string;
}

export const createEmptySchema = toolSchema<CreateEmptyParams>({
	size: field.dimension({ min: 1, max: 20000, width: 800, height: 600 }),
	transparent: field.checkbox({ default: true }),
	color: field.color({ default: "#ffffff" }),
});

const createEmpty: ToolEntry<CreateEmptyParams> = {
	id: "create-empty-png",
	title: "Create empty PNG",
	description:
		"Creates a blank canvas of the chosen dimensions, either transparent or filled with a solid color.",
	category: "generate",
	schema: createEmptySchema,
	generate: (p) => {
		const w = Math.trunc(p.size.width);
		const h = Math.trunc(p.size.height);
		if (p.transparent) {
			return solidImage(w, h, [0, 0, 0, 0]);
		}
		const { r, g, b } = hexToRgb(p.color);
		return solidImage(w, h, [r, g, b, 255]);
	},
};

export const generateEntries = [createEmpty];
