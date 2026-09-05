import type { ToolEntry } from "./types";
import type { Position9 } from "../core/textdraw";
import { drawTextBlock, type TextFont } from "../core/domText";
import { formatStamp } from "../core/datefmt";
import { field, toolSchema } from "../registry-schema";

const FONT_OPTIONS = [
	{ value: "sans", label: "Sans-serif" },
	{ value: "serif", label: "Serif" },
	{ value: "mono", label: "Monospace" },
] satisfies { value: TextFont; label: string }[];

interface AddTextParams {
	text: string;
	fontSize: number;
	color: string;
	font: TextFont;
	bold: boolean;
	position: Position9;
	margin: number;
	plate: boolean;
	plateColor: string;
	plateOpacity: number;
}

const addTextSchema = toolSchema<AddTextParams>({
	text: field.text({ default: "Hello!", placeholder: "Your text" }),
	fontSize: field.slider({ min: 8, max: 200, step: 1, default: 48 }),
	color: field.color({ default: "#ffffff" }),
	font: field.select<TextFont>({ default: "sans", options: FONT_OPTIONS }),
	bold: field.checkbox({ default: true }),
	position: field.position9({ default: "bottom-right" }),
	margin: field.slider({ min: 0, max: 200, step: 1, default: 24 }),
	plate: field.checkbox({ default: false }),
	plateColor: field.color({ default: "#000000" }),
	plateOpacity: field.slider({ min: 0, max: 100, step: 5, default: 60 }),
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
			fontSize: p.fontSize,
			font: p.font,
			bold: p.bold,
			color: p.color,
			opacityPercent: 100,
			position: p.position,
			margin: p.margin,
			plateColor: p.plate ? p.plateColor : undefined,
			plateOpacityPercent: p.plateOpacity,
		}),
};

interface DateStampParams {
	format: string;
	fontSize: number;
	color: string;
	font: TextFont;
	bold: boolean;
	position: Position9;
	margin: number;
	plate: boolean;
	plateColor: string;
	plateOpacity: number;
}

const dateStampSchema = toolSchema<DateStampParams>({
	format: field.text({
		default: "YYYY-MM-DD",
		placeholder: "YYYY-MM-DD hh:mm",
	}),
	fontSize: field.slider({ min: 8, max: 200, step: 1, default: 32 }),
	color: field.color({ default: "#ffffff" }),
	font: field.select<TextFont>({ default: "mono", options: FONT_OPTIONS }),
	bold: field.checkbox({ default: false }),
	position: field.position9({ default: "bottom-right" }),
	margin: field.slider({ min: 0, max: 200, step: 1, default: 20 }),
	plate: field.checkbox({ default: true }),
	plateColor: field.color({ default: "#000000" }),
	plateOpacity: field.slider({ min: 0, max: 100, step: 5, default: 55 }),
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
			fontSize: p.fontSize,
			font: p.font,
			bold: p.bold,
			color: p.color,
			opacityPercent: 100,
			position: p.position,
			margin: p.margin,
			plateColor: p.plate ? p.plateColor : undefined,
			plateOpacityPercent: p.plateOpacity,
		}),
};

export const textEntries = [addText, dateStamp];
