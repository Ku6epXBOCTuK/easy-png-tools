import { formatStamp } from "../core/datefmt";
import { drawTextBlock } from "../core/domText";
import type { Position9 } from "../core/textdraw";
import type { FontStyle, Plate } from "../registry-schema";
import { field, toolSchema } from "../registry-schema";
import type { ToolEntry } from "./types";

interface AddTextParams {
	text: string;
	style: FontStyle;
	position: Position9;
	margin: number;
	plate: Plate;
}

const addTextSchema = toolSchema<AddTextParams>({
	text: field.text({ default: "Hello!", placeholder: "Your text" }),
	style: field.fontStyle({
		min: 8,
		max: 200,
		size: 48,
		font: "sans",
		bold: true,
		color: "#ffffff",
	}),
	position: field.position9({ default: "bottom-right" }),
	margin: field.slider({ min: 0, max: 200, step: 1, default: 24 }),
	plate: field.plate({ enabled: false, color: "#000000", opacity: 60 }),
});

const addText: ToolEntry<AddTextParams> = {
	id: "add-text-png",
	title: "Add text to PNG",
	description:
		"Draws a text label on the image: font, size, color, bold, position on a 3×3 grid and an optional backing plate.",
	category: "text",
	domOnly: true,
	schema: addTextSchema,
	run: (img, p) =>
		drawTextBlock(img, {
			text: p.text,
			fontSize: p.style.size,
			font: p.style.font,
			bold: p.style.bold,
			color: p.style.color,
			opacityPercent: 100,
			position: p.position,
			margin: p.margin,
			plateColor: p.plate.enabled ? p.plate.color : undefined,
			plateOpacityPercent: p.plate.opacity,
		}),
};

interface DateStampParams {
	format: string;
	style: FontStyle;
	position: Position9;
	margin: number;
	plate: Plate;
}

const dateStampSchema = toolSchema<DateStampParams>({
	format: field.text({
		default: "YYYY-MM-DD",
		placeholder: "YYYY-MM-DD hh:mm",
	}),
	style: field.fontStyle({
		min: 8,
		max: 200,
		size: 32,
		font: "mono",
		bold: false,
		color: "#ffffff",
	}),
	position: field.position9({ default: "bottom-right" }),
	margin: field.slider({ min: 0, max: 200, step: 1, default: 20 }),
	plate: field.plate({ enabled: true, color: "#000000", opacity: 55 }),
});

const dateStamp: ToolEntry<DateStampParams> = {
	id: "date-stamp-png",
	title: "Date stamp PNG",
	description:
		"Stamps the current date and time using a format string (YYYY MM DD hh mm ss tokens). Same styling options as Add text.",
	category: "text",
	domOnly: true,
	schema: dateStampSchema,
	run: (img, p) =>
		drawTextBlock(img, {
			text: formatStamp(new Date(), p.format),
			fontSize: p.style.size,
			font: p.style.font,
			bold: p.style.bold,
			color: p.style.color,
			opacityPercent: 100,
			position: p.position,
			margin: p.margin,
			plateColor: p.plate.enabled ? p.plate.color : undefined,
			plateOpacityPercent: p.plate.opacity,
		}),
};

export const textEntries = [addText, dateStamp];
