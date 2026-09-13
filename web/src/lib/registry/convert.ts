import { flattenOntoColor } from "../core/alpha";
import { decodeBytes, decodeSvgText, toBase64, toDataUrl } from "../core/io";
import { hexToPixels, pixelsToHex } from "../core/text";
import {
	base64ToBytes,
	bytesToImage,
	imageToByteRows,
	imageToRgbValues,
	rgbValuesToImage,
	stripDataUri,
} from "../core/textio";
import { clonePixelImage } from "../core/types";
import { field, toolSchema } from "../registry-schema";
import { imgTool, textGen, type ToolEntry } from "./types";

const widthProps = (defaultValue: number) =>
	field.number({
		label: "fields.width",
		min: 1,
		max: 10000,
		step: 1,
		default: defaultValue,
	});

interface ConvertToJpgParams {
	background: string;
	quality: number;
}

export const convertToJpgSchema = toolSchema<ConvertToJpgParams>({
	background: field.color({ label: "fields.background", default: "#ffffff" }),
	quality: field.slider({
		label: "fields.quality",
		min: 1,
		max: 100,
		step: 1,
		default: 90,
	}),
});

const convertToJpg: ToolEntry<ConvertToJpgParams> = {
	id: "convert-png-to-jpg",
	title: "Convert PNG to JPG",
	description:
		"Transparency is composited over the chosen backdrop color (white by default) and saved as JPEG.",
	category: "convert",
	schema: convertToJpgSchema,
	input: "image",
	run: imgTool((img, p) => flattenOntoColor(img, p.background)),
	output: { mime: "image/jpeg", ext: "jpg", qualityParamId: "quality" },
};

interface ConvertToWebpParams {
	quality: number;
}

export const convertToWebpSchema = toolSchema<ConvertToWebpParams>({
	quality: field.slider({
		label: "fields.quality",
		min: 1,
		max: 100,
		step: 1,
		default: 90,
	}),
});

const convertToWebp: ToolEntry<ConvertToWebpParams> = {
	id: "convert-png-to-webp",
	title: "Convert PNG to WebP",
	description:
		"Re-encodes the image into WebP with adjustable quality. Transparency is preserved.",
	category: "convert",
	schema: convertToWebpSchema,
	input: "image",
	run: imgTool((img) => clonePixelImage(img)),
	output: { mime: "image/webp", ext: "webp", qualityParamId: "quality" },
};

interface ConvertToBmpParams {}

export const convertToBmpSchema = toolSchema<ConvertToBmpParams>({});

const convertToBmp: ToolEntry<ConvertToBmpParams> = {
	id: "png-to-bmp",
	title: "Convert PNG to BMP",
	description:
		"Saves the image as 24-bit BMP without an alpha channel: transparency is replaced with a black background.",
	category: "convert",
	schema: convertToBmpSchema,
	input: "image",
	run: imgTool((img) => flattenOntoColor(img, "#000000")),
	output: { mime: "image/bmp", ext: "bmp" },
};

interface NoParams {}

const emptySchema = toolSchema<NoParams>({});

const pngToBase64: ToolEntry<NoParams> = {
	id: "png-to-base64",
	title: "PNG to Base64",
	description:
		"Encodes the image into a base64 string for embedding in code or styles.",
	category: "convert",
	schema: emptySchema,
	input: "image",
	result: "text",
	run: imgTool((img) => toBase64(img)),
};

const pngToDataUri: ToolEntry<NoParams> = {
	id: "png-to-data-uri",
	title: "PNG to Data URI",
	description:
		"Builds a full data-uri (data:image/png;base64,…) for embedding in HTML/CSS.",
	category: "convert",
	schema: emptySchema,
	input: "image",
	result: "text",
	run: imgTool((img) => toDataUrl(img)),
};

const pngToHex: ToolEntry<NoParams> = {
	id: "png-to-hex",
	title: "PNG to HEX pixels",
	description:
		"Shows all pixels as rrggbbaa hex values — row by row, space separated.",
	category: "convert",
	schema: emptySchema,
	input: "image",
	result: "text",
	run: imgTool((img) => pixelsToHex(img)),
};

const pngToBytes: ToolEntry<NoParams> = {
	id: "png-to-bytes",
	title: "PNG to Bytes",
	description:
		"Lists every pixel as four decimal bytes (R G B A), one image row per line.",
	category: "convert",
	schema: emptySchema,
	input: "image",
	result: "text",
	run: imgTool((img) => imageToByteRows(img)),
};

const pngToRgbValues: ToolEntry<NoParams> = {
	id: "png-to-rgb-values",
	title: "PNG to RGB Values",
	description: "Lists every pixel as rgba(r, g, b, a), one image row per line.",
	category: "convert",
	schema: emptySchema,
	input: "image",
	result: "text",
	run: imgTool((img) => imageToRgbValues(img)),
};

const base64ToPng: ToolEntry<NoParams> = {
	id: "base64-to-png",
	title: "Base64 to PNG",
	description:
		"Decodes a base64 string or data-uri back into an image. Paste the string on the left.",
	category: "convert",
	schema: emptySchema,
	input: "text",
	run: textGen((text) => decodeBytes(base64ToBytes(stripDataUri(text)))),
};

const dataUriToPng: ToolEntry<NoParams> = {
	id: "data-uri-to-png",
	title: "Data URI to PNG",
	description: "Decodes data:image/…;base64,… back into an image file.",
	category: "convert",
	schema: emptySchema,
	input: "text",
	run: textGen((text) => decodeBytes(base64ToBytes(stripDataUri(text)))),
};

interface HexToPngParams {
	width: number;
}

export const hexToPngSchema = toolSchema<HexToPngParams>({
	width: widthProps(1),
});

const hexToPng: ToolEntry<HexToPngParams> = {
	id: "hex-to-png",
	title: "HEX pixels to PNG",
	description:
		"Assembles an image from rrggbbaa hex values (space separated). Set the width — the height is computed automatically.",
	category: "convert",
	schema: hexToPngSchema,
	input: "text",
	run: textGen((text, p) => hexToPixels(text, Math.trunc(p.width))),
};

interface BytesToPngParams {
	width: number;
}

export const bytesToPngSchema = toolSchema<BytesToPngParams>({
	width: widthProps(32),
});

const bytesToPng: ToolEntry<BytesToPngParams> = {
	id: "bytes-to-png",
	title: "Bytes to PNG",
	description:
		"Assembles an image from decimal RGBA byte numbers (any separators). Set the width — height is computed automatically.",
	category: "convert",
	schema: bytesToPngSchema,
	input: "text",
	run: textGen((text, p) => bytesToImage(text, Math.trunc(p.width))),
};

interface RgbValuesToPngParams {
	width: number;
}

export const rgbValuesToPngSchema = toolSchema<RgbValuesToPngParams>({
	width: widthProps(32),
});

const rgbValuesToPng: ToolEntry<RgbValuesToPngParams> = {
	id: "rgb-values-to-png",
	title: "RGB Values to PNG",
	description:
		"Assembles an image from rgba(r, g, b, a) numbers. Set the width — height is computed automatically.",
	category: "convert",
	schema: rgbValuesToPngSchema,
	input: "text",
	run: textGen((text, p) => rgbValuesToImage(text, Math.trunc(p.width))),
};

interface SvgToPngParams {
	width: number;
}

export const svgToPngSchema = toolSchema<SvgToPngParams>({
	width: widthProps(512),
});

const svgToPng: ToolEntry<SvgToPngParams> = {
	id: "svg-to-png",
	title: "SVG to PNG",
	description:
		"Decodes SVG markup into a raster image. Paste the SVG code on the left.",
	category: "convert",
	schema: svgToPngSchema,
	input: "text",
	domOnly: true,
	run: textGen((text, p) => decodeSvgText(text, Math.trunc(p.width))),
};

export const convertEntries = [
	convertToJpg,
	convertToWebp,
	convertToBmp,
	pngToBase64,
	pngToDataUri,
	pngToHex,
	pngToBytes,
	pngToRgbValues,
	base64ToPng,
	dataUriToPng,
	hexToPng,
	bytesToPng,
	rgbValuesToPng,
	svgToPng,
];
