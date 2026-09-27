import type { Page } from "../types";

export const textPages: Page[] = [
	{
		slug: "add-text-png",
		title: "Add text to PNG",
		description:
			"Draws a text label on the image: font, size, color, bold, position on a 3×3 grid and an optional backing plate.",
		category: "text",
		steps: [{ id: "add-text" }],
	},
	{
		slug: "date-stamp-png",
		title: "Date stamp PNG",
		description:
			"Stamps the current date and time using a format string (YYYY MM DD hh mm ss tokens). Same styling options as Add text.",
		category: "text",
		steps: [{ id: "date-stamp" }],
	},
	{
		slug: "watermark-tile-png",
		title: "Watermark Tile PNG",
		description:
			"Covers the image with a repeating diagonal semi-transparent text tile — a protection watermark.",
		category: "text",
		steps: [{ id: "watermark-tile" }],
	},
];
