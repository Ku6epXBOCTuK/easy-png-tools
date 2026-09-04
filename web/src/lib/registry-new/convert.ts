import type { ToolEntry } from "./types";
import { field, toolSchema } from "../registry-schema";
import { flattenOntoColor } from "../core/alpha";
import { clonePixelImage } from "../core/types";

interface ConvertToJpgParams {
	background: string;
	quality: number;
}

export const convertToJpgSchema = toolSchema<ConvertToJpgParams>({
	background: field.color({ default: "#ffffff" }),
	quality: field.slider({ min: 1, max: 100, step: 1, default: 90 }),
});

const convertToJpg: ToolEntry<ConvertToJpgParams> = {
	id: "convert-png-to-jpg",
	title: "Convert PNG to JPG",
	description:
		"Transparency is composited over the chosen backdrop color (white by default) and saved as JPEG.",
	category: "convert",
	schema: convertToJpgSchema,
	run: (img, p) => flattenOntoColor(img, p.background),
};

interface ConvertToWebpParams {
	quality: number;
}

export const convertToWebpSchema = toolSchema<ConvertToWebpParams>({
	quality: field.slider({ min: 1, max: 100, step: 1, default: 90 }),
});

const convertToWebp: ToolEntry<ConvertToWebpParams> = {
	id: "convert-png-to-webp",
	title: "Convert PNG to WebP",
	description:
		"Re-encodes the image into WebP with adjustable quality. Transparency is preserved.",
	category: "convert",
	schema: convertToWebpSchema,
	run: (img) => clonePixelImage(img),
};

export const convertEntries = [convertToJpg, convertToWebp];
