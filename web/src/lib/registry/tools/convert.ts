import { flattenOntoColor } from "../../core/alpha";
import { decodeBytes, decodeSvgText, toBase64, toDataUrl } from "../../core/io";
import { hexToPixels, pixelsToHex } from "../../core/text";
import {
	base64ToBytes,
	bytesToImage,
	imageToByteRows,
	imageToRgbValues,
	rgbValuesToImage,
	stripDataUri,
} from "../../core/textio";
import { clonePixelImage } from "../../core/types";
import { field, toolSchema } from "../../registry-schema";
import { imgTool, textGen, type Tool } from "../types";

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

const convertToJpg: Tool<ConvertToJpgParams> = {
	id: "convert-png-to-jpg",
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

const convertToWebp: Tool<ConvertToWebpParams> = {
	id: "convert-png-to-webp",
	schema: convertToWebpSchema,
	input: "image",
	run: imgTool((img) => clonePixelImage(img)),
	output: { mime: "image/webp", ext: "webp", qualityParamId: "quality" },
};

interface ConvertToBmpParams {}

export const convertToBmpSchema = toolSchema<ConvertToBmpParams>({});

const convertToBmp: Tool<ConvertToBmpParams> = {
	id: "png-to-bmp",
	schema: convertToBmpSchema,
	input: "image",
	run: imgTool((img) => flattenOntoColor(img, "#000000")),
	output: { mime: "image/bmp", ext: "bmp" },
};

interface NoParams {}

const emptySchema = toolSchema<NoParams>({});

const pngToBase64: Tool<NoParams> = {
	id: "png-to-base64",
	schema: emptySchema,
	input: "image",
	result: "text",
	domOnly: true,
	run: imgTool((img) => toBase64(img)),
};

const pngToDataUri: Tool<NoParams> = {
	id: "png-to-data-uri",
	schema: emptySchema,
	input: "image",
	result: "text",
	domOnly: true,
	run: imgTool((img) => toDataUrl(img)),
};

const pngToHex: Tool<NoParams> = {
	id: "png-to-hex",
	schema: emptySchema,
	input: "image",
	result: "text",
	run: imgTool((img) => pixelsToHex(img)),
};

const pngToBytes: Tool<NoParams> = {
	id: "png-to-bytes",
	schema: emptySchema,
	input: "image",
	result: "text",
	run: imgTool((img) => imageToByteRows(img)),
};

const pngToRgbValues: Tool<NoParams> = {
	id: "png-to-rgb-values",
	schema: emptySchema,
	input: "image",
	result: "text",
	run: imgTool((img) => imageToRgbValues(img)),
};

const base64ToPng: Tool<NoParams> = {
	id: "base64-to-png",
	schema: emptySchema,
	input: "text",
	domOnly: true,
	run: textGen((text) => decodeBytes(base64ToBytes(stripDataUri(text)))),
};

const dataUriToPng: Tool<NoParams> = {
	id: "data-uri-to-png",
	schema: emptySchema,
	input: "text",
	domOnly: true,
	run: textGen((text) => decodeBytes(base64ToBytes(stripDataUri(text)))),
};

interface HexToPngParams {
	width: number;
}

export const hexToPngSchema = toolSchema<HexToPngParams>({
	width: widthProps(1),
});

const hexToPng: Tool<HexToPngParams> = {
	id: "hex-to-png",
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

const bytesToPng: Tool<BytesToPngParams> = {
	id: "bytes-to-png",
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

const rgbValuesToPng: Tool<RgbValuesToPngParams> = {
	id: "rgb-values-to-png",
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

const svgToPng: Tool<SvgToPngParams> = {
	id: "svg-to-png",
	schema: svgToPngSchema,
	input: "text",
	domOnly: true,
	run: textGen((text, p) => decodeSvgText(text, Math.trunc(p.width))),
};

export const convertTools = [
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
