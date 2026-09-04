import type { ToolEntry } from "./types";
import { field, toolSchema } from "../registry-schema";
import { strokeImage } from "../core/morphology";

interface AddStrokeParams {
	color: string;
	thickness: number;
}

export const addStrokeSchema = toolSchema<AddStrokeParams>({
	color: field.color({ default: "#ff0000" }),
	thickness: field.slider({ min: 1, max: 10, step: 1, default: 3 }),
});

const addStroke: ToolEntry<AddStrokeParams> = {
	id: "add-stroke-png",
	title: "Outline PNG",
	description:
		"Adds a colored ring outline around the opaque content with the chosen thickness.",
	category: "alpha",
	schema: addStrokeSchema,
	run: (img, p) => strokeImage(img, p.thickness, p.color),
};

export const alphaEntries = [addStroke];
