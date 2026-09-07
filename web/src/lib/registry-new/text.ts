import { formatStamp } from "../core/datefmt";
import { drawTextBlock, drawTextTile } from "../core/domText";
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

const addTextSchema = toolSchema<AddTextParams>(
	{
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
	},
	{
		layout: {
			groups: [
				{ title: "Text", fields: ["text", "style"] },
				{ title: "Placement", fields: ["position", "margin"] },
				{ title: "Plate", fields: ["plate"] },
			],
		},
	},
);

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

const dateStampSchema = toolSchema<DateStampParams>(
	{
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
	},
	{
		layout: {
			groups: [
				{ title: "Text", fields: ["format", "style"] },
				{ title: "Placement", fields: ["position", "margin"] },
				{ title: "Plate", fields: ["plate"] },
			],
		},
	},
);

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

interface WatermarkTileParams {
	text: string;
	style: FontStyle;
	opacity: number;
	angle: number;
	stepX: number;
	stepY: number;
}

const watermarkTileSchema = toolSchema<WatermarkTileParams>(
	{
		text: field.text({ default: "DRAFT", placeholder: "Watermark text" }),
		style: field.fontStyle({
			min: 12,
			max: 160,
			size: 56,
			font: "sans",
			bold: true,
			color: "#ffffff",
		}),
		opacity: field.slider({ min: 5, max: 100, step: 5, default: 30 }),
		angle: field.slider({ min: -90, max: 90, step: 1, default: -30 }),
		stepX: field.slider({ min: 40, max: 600, step: 10, default: 220 }),
		stepY: field.slider({ min: 40, max: 600, step: 10, default: 180 }),
	},
	{
		layout: {
			groups: [
				{ title: "Watermark", fields: ["text", "style", "opacity"] },
				{
					title: "Tile",
					cols: 2,
					fields: ["angle", "stepX", "stepY"],
				},
			],
		},
	},
);

const watermarkTile: ToolEntry<WatermarkTileParams> = {
	id: "watermark-tile-png",
	title: "Watermark Tile PNG",
	description:
		"Covers the image with a repeating diagonal semi-transparent text tile — a protection watermark.",
	category: "text",
	domOnly: true,
	schema: watermarkTileSchema,
	run: (img, p) =>
		drawTextTile(img, {
			text: p.text,
			fontSize: p.style.size,
			font: p.style.font,
			bold: p.style.bold,
			color: p.style.color,
			opacityPercent: p.opacity,
			stepX: p.stepX,
			stepY: p.stepY,
			angleDeg: p.angle,
		}),
};

export const textEntries = [addText, dateStamp, watermarkTile];
