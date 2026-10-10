import { ToolError } from "./core/errors";
import type { OutputMime } from "./core/io";

// Presentation metadata of download formats for the Download button dropdown
// (labels, quality slider ranges). Core keeps only the mime contract
// (core/io.ts); this module is the UI layer's view of the same formats.
export interface OutputFormatOption {
	mime: OutputMime;
	ext: string;
	label: string;
	supportsAlpha: boolean;
	/** Fine-grained format settings in the Download button dropdown (extensible). */
	settings?: {
		quality?: { min: number; max: number; step: number; default: number };
	};
}

const QUALITY_SETTING = { min: 1, max: 100, step: 1, default: 90 } as const;

/** Format options in the Download button (selector next to it). */
export const OUTPUT_FORMATS: readonly OutputFormatOption[] = [
	{ mime: "image/png", ext: "png", label: "PNG", supportsAlpha: true },
	{
		mime: "image/jpeg",
		ext: "jpg",
		label: "JPG",
		supportsAlpha: false,
		settings: { quality: QUALITY_SETTING },
	},
	{
		mime: "image/webp",
		ext: "webp",
		label: "WebP",
		supportsAlpha: true,
		settings: { quality: QUALITY_SETTING },
	},
	{ mime: "image/bmp", ext: "bmp", label: "BMP", supportsAlpha: false },
];

export function outputFormatByMime(mime: OutputMime): OutputFormatOption {
	const found = OUTPUT_FORMATS.find((f) => f.mime === mime);
	if (!found) throw new ToolError("errors.encodeUnsupported", { mime });
	return found;
}
