import type { ToolEntry } from "../registry";
import { clonePixelImage } from "../../core/types";
import { flattenOntoColor } from "../../core/alpha";
import { toBase64, toDataUrl, decodeSvgText, encode } from "../../core/io";
import { pixelsToHex, hexToPixels } from "../../core/text";
import {
	imageToByteRows,
	bytesToImage,
	imageToRgbValues,
	rgbValuesToImage,
} from "../../core/textio";
import {
	COMPRESSION_LEVELS,
	findMaxColorsWithin,
	type CompressionLevel,
} from "../../core/compress";
import { quantizeImage } from "../../core/quantize";
import { num, str } from "../registry-helpers";

function decodeToPng(
	id: string,
	title: string,
	description: string,
): ToolEntry {
	return {
		id,
		title,
		description,
		category: "convert",
		params: [],
		run: (img) => clonePixelImage(img),
	};
}

export function convertEntries(): ToolEntry[] {
	return [
		decodeToPng(
			"jpg-to-png",
			"Convert JPG to PNG",
			"Opens a JPEG and saves it as lossless PNG. Transparency, if present, is preserved.",
		),
		decodeToPng(
			"webp-to-png",
			"Convert WebP to PNG",
			"Re-encodes a WebP image into universal PNG.",
		),
		decodeToPng(
			"gif-to-png",
			"Convert GIF to PNG",
			"Extracts the first frame of a GIF animation and saves it as PNG.",
		),
		decodeToPng(
			"bmp-to-png",
			"Convert BMP to PNG",
			"Re-encodes BMP into compact lossless PNG.",
		),
		decodeToPng(
			"ico-to-png",
			"Convert ICO to PNG",
			"Turns an .ico icon into a regular PNG of the chosen size.",
		),
		{
			id: "png-to-bmp",
			title: "Convert PNG to BMP",
			description:
				"Saves the image as 24-bit BMP without an alpha channel: transparency is replaced with a black background.",
			category: "convert",
			params: [],
			run: (img) => flattenOntoColor(img, "#000000"),
			output: { mime: "image/bmp", ext: "bmp" },
		},
		{
			id: "png-to-base64",
			title: "PNG to Base64",
			description:
				"Encodes the image into a base64 string for embedding in code or styles.",
			category: "convert",
			params: [],
			resultType: "text",
			toText: (img) => toBase64(img),
		},
		{
			id: "base64-to-png",
			title: "Base64 to PNG",
			description:
				"Decodes a base64 string or data-uri back into an image. Paste the string on the left.",
			category: "convert",
			sourceMode: "text",
			params: [],
			run: (img) => clonePixelImage(img),
		},
		{
			id: "png-to-data-uri",
			title: "PNG to Data URI",
			description:
				"Builds a full data-uri (data:image/png;base64,…) for embedding in HTML/CSS.",
			category: "convert",
			params: [],
			resultType: "text",
			toText: (img) => toDataUrl(img),
		},
		{
			id: "data-uri-to-png",
			title: "Data URI to PNG",
			description: "Decodes data:image/…;base64,… back into an image file.",
			category: "convert",
			sourceMode: "text",
			params: [],
			run: (img) => clonePixelImage(img),
		},
		{
			id: "png-to-hex",
			title: "PNG to HEX pixels",
			description:
				"Shows all pixels as rrggbbaa hex values — row by row, space separated.",
			category: "convert",
			params: [],
			resultType: "text",
			toText: (img) => pixelsToHex(img),
		},
		{
			id: "hex-to-png",
			title: "HEX pixels to PNG",
			description:
				"Assembles an image from rrggbbaa hex values (space separated). Set the width — the height is computed automatically.",
			category: "convert",
			sourceMode: "text",
			params: [
				{
					id: "width",
					label: "Image width",
					type: "number",
					min: 1,
					max: 10000,
					step: 1,
					default: 1,
				},
			],
			runFromText: (text, p) =>
				hexToPixels(text, Math.trunc(Number(p["width"]))),
			run: (img) => clonePixelImage(img),
		},
		{
			id: "png-to-bytes",
			title: "PNG to Bytes",
			description:
				"Lists every pixel as four decimal bytes (R G B A), one image row per line.",
			category: "convert",
			params: [],
			resultType: "text",
			toText: (img) => imageToByteRows(img),
		},
		{
			id: "bytes-to-png",
			title: "Bytes to PNG",
			description:
				"Assembles an image from decimal RGBA byte numbers (any separators). Set the width — height is computed automatically.",
			category: "convert",
			sourceMode: "text",
			params: [
				{
					id: "width",
					label: "Image width",
					type: "number",
					min: 1,
					max: 10000,
					step: 1,
					default: 32,
				},
			],
			runFromText: (text, p) =>
				bytesToImage(
					text,
					Math.trunc(num(p as Record<string, unknown>, "width")),
				),
			run: (img) => clonePixelImage(img),
		},
		{
			id: "png-to-rgb-values",
			title: "PNG to RGB Values",
			description:
				"Lists every pixel as rgba(r, g, b, a), one image row per line.",
			category: "convert",
			params: [],
			resultType: "text",
			toText: (img) => imageToRgbValues(img),
		},
		{
			id: "rgb-values-to-png",
			title: "RGB Values to PNG",
			description:
				"Assembles an image from rgba(r, g, b, a) numbers. Set the width — height is computed automatically.",
			category: "convert",
			sourceMode: "text",
			params: [
				{
					id: "width",
					label: "Image width",
					type: "number",
					min: 1,
					max: 10000,
					step: 1,
					default: 32,
				},
			],
			runFromText: (text, p) =>
				rgbValuesToImage(
					text,
					Math.trunc(num(p as Record<string, unknown>, "width")),
				),
			run: (img) => clonePixelImage(img),
		},
		{
			id: "convert-png-to-jpg",
			title: "Convert PNG to JPG",
			description:
				"Transparency is composited over the chosen backdrop color (white by default) and saved as JPEG.",
			category: "convert",
			params: [
				{
					id: "background",
					label: "Backdrop color",
					type: "color",
					default: "#ffffff",
				},
				{
					id: "quality",
					label: "JPEG quality",
					type: "slider",
					min: 1,
					max: 100,
					step: 1,
					default: 90,
				},
			],
			output: {
				mime: "image/jpeg",
				ext: "jpg",
				qualityParamId: "quality",
			},
			run: (img, p) => flattenOntoColor(img, str(p, "background")),
		},
		{
			id: "convert-png-to-webp",
			title: "Convert PNG to WebP",
			description:
				"Re-encodes the image into WebP with adjustable quality. Transparency is preserved.",
			category: "convert",
			params: [
				{
					id: "quality",
					label: "WebP quality",
					type: "slider",
					min: 1,
					max: 100,
					step: 1,
					default: 90,
				},
			],
			output: {
				mime: "image/webp",
				ext: "webp",
				qualityParamId: "quality",
			},
			run: (img) => clonePixelImage(img),
		},
		{
			id: "compress-png",
			title: "Compress PNG",
			description:
				"Shrinks the PNG by reducing its palette to a preset level. Honest trade-off: fewer colors = smaller file.",
			category: "convert",
			params: [
				{
					id: "level",
					label: "Compression level",
					type: "select",
					default: "balanced",
					options: [
						{ value: "light", label: "Light (192 colors)" },
						{ value: "balanced", label: "Balanced (96 colors)" },
						{ value: "strong", label: "Strong (44 colors)" },
						{ value: "extreme", label: "Extreme (16 colors)" },
					],
				},
			],
			run: (img, p) => {
				const level = str(p, "level") as CompressionLevel;
				const k = COMPRESSION_LEVELS[level] ?? COMPRESSION_LEVELS.balanced;
				return quantizeImage(img, k).image;
			},
		},
		{
			id: "reduce-to-size-png",
			title: "Reduce PNG to Size",
			description:
				"Binary-searches the palette size until the encoded PNG fits the target KB. Best effort: if even 2 colors exceed the target, returns the 2-color version.",
			category: "convert",
			domOnly: true,
			params: [
				{
					id: "targetKB",
					label: "Target size, KB",
					type: "slider",
					min: 5,
					max: 2000,
					step: 5,
					default: 100,
				},
				{
					id: "maxColors",
					label: "Max colors to try",
					type: "slider",
					min: 2,
					max: 256,
					step: 1,
					default: 256,
				},
			],
			run: async (img, p) => {
				const targetBytes = num(p, "targetKB") * 1024;
				const maxK = num(p, "maxColors");
				const encodeSize = async (k: number): Promise<number | null> => {
					const blob = await encode(quantizeImage(img, k).image, "image/png");
					return blob.size;
				};
				const k = await findMaxColorsWithin(targetBytes, maxK, encodeSize);
				return quantizeImage(img, k).image;
			},
		},
		{
			id: "svg-to-png",
			title: "SVG to PNG",
			description:
				"Decodes SVG markup into a raster image. Paste the SVG code on the left.",
			category: "convert",
			sourceMode: "text",
			params: [
				{
					id: "width",
					label: "Result width, px",
					type: "number",
					min: 1,
					max: 10000,
					step: 1,
					default: 512,
				},
			],
			runFromText: (text, p) =>
				decodeSvgText(text, Math.trunc(num(p, "width"))),
			run: (img) => clonePixelImage(img),
		},
	];
}
