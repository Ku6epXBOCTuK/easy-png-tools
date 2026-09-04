import type { ToolEntry } from "./types";
import { field, toolSchema } from "../registry-schema";
import { expandCanvas } from "../core/geometry";

interface AddBorderParams {
	thickness: number;
	color: string;
}

export const addBorderSchema = toolSchema<AddBorderParams>({
	thickness: field.number({ min: 1, max: 500, step: 1, default: 5 }),
	color: field.color({ default: "#000000" }),
});

const addBorder: ToolEntry<AddBorderParams> = {
	id: "add-border-png",
	title: "Add border to PNG",
	description:
		"Draws a colored frame of the chosen thickness around the image.",
	category: "geometry",
	schema: addBorderSchema,
	run: (img, p) =>
		expandCanvas(
			img,
			p.thickness,
			p.thickness,
			p.thickness,
			p.thickness,
			p.color,
		),
};

export const geometryEntries = [addBorder];
