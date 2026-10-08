import { deflateSync } from "node:zlib";

export interface SourceFile {
	name: string;
	mimeType: string;
	buffer: Buffer;
}

const CRC_TABLE = (() => {
	const table = new Uint32Array(256);
	for (let n = 0; n < 256; n++) {
		let c = n;
		for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		table[n] = c >>> 0;
	}
	return table;
})();

function crc32(data: Uint8Array): number {
	let c = 0xffffffff;
	for (let i = 0; i < data.length; i++)
		c = CRC_TABLE[(c ^ data[i]) & 0xff] ^ (c >>> 8);
	return (c ^ 0xffffffff) >>> 0;
}

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function makeIhdr(
	width: number,
	height: number,
	bitDepth: number,
	colorType: number,
): Buffer {
	const ihdr = Buffer.alloc(13);
	ihdr.writeUInt32BE(width, 0);
	ihdr.writeUInt32BE(height, 4);
	ihdr[8] = bitDepth;
	ihdr[9] = colorType;
	return ihdr;
}

function chunk(type: string, data: Buffer): Buffer {
	const out = Buffer.alloc(8 + data.length + 4);
	out.writeUInt32BE(data.length, 0);
	out.write(type, 4, "ascii");
	data.copy(out, 8);
	out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
	return out;
}

function findChunk(png: Buffer, type: string): number {
	let offset = PNG_SIGNATURE.length;
	while (offset + 12 <= png.length) {
		const length = png.readUInt32BE(offset);
		const chunkType = png.subarray(offset + 4, offset + 8).toString("ascii");
		if (chunkType === type) return offset;
		offset += 12 + length;
	}
	throw new Error(`PNG chunk ${type} not found`);
}

/** Builds a valid RGBA PNG at runtime (8-bit, filter type 0, deflate/zlib). */
export function makePng(
	width: number,
	height: number,
	pixelAt: (x: number, y: number) => [number, number, number, number],
): Buffer {
	const stride = width * 4 + 1;
	const raw = Buffer.alloc(height * stride);
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const [r, g, b, a] = pixelAt(x, y);
			const p = y * stride + 1 + x * 4;
			raw[p] = r;
			raw[p + 1] = g;
			raw[p + 2] = b;
			raw[p + 3] = a;
		}
	}
	return Buffer.concat([
		PNG_SIGNATURE,
		chunk("IHDR", makeIhdr(width, height, 8, 6)),
		chunk("IDAT", deflateSync(raw)),
		chunk("IEND", Buffer.alloc(0)),
	]);
}

export function makeIndexedPng(
	width: number,
	height: number,
	palette: [number, number, number][],
	pixelAt: (x: number, y: number) => number,
): Buffer {
	const plte = Buffer.alloc(palette.length * 3);
	for (const [index, color] of palette.entries()) {
		plte[index * 3] = color[0];
		plte[index * 3 + 1] = color[1];
		plte[index * 3 + 2] = color[2];
	}
	const stride = width + 1;
	const raw = Buffer.alloc(height * stride);
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			raw[y * stride + 1 + x] = pixelAt(x, y);
		}
	}
	return Buffer.concat([
		PNG_SIGNATURE,
		chunk("IHDR", makeIhdr(width, height, 8, 3)),
		chunk("PLTE", plte),
		chunk("IDAT", deflateSync(raw)),
		chunk("IEND", Buffer.alloc(0)),
	]);
}

export function make16BitPng(
	width: number,
	height: number,
	pixelAt: (x: number, y: number) => [number, number, number, number],
): Buffer {
	const stride = width * 8 + 1;
	const raw = Buffer.alloc(height * stride);
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const [r, g, b, a] = pixelAt(x, y);
			const p = y * stride + 1 + x * 8;
			raw.writeUInt16BE(r, p);
			raw.writeUInt16BE(g, p + 2);
			raw.writeUInt16BE(b, p + 4);
			raw.writeUInt16BE(a, p + 6);
		}
	}
	return Buffer.concat([
		PNG_SIGNATURE,
		chunk("IHDR", makeIhdr(width, height, 16, 6)),
		chunk("IDAT", deflateSync(raw)),
		chunk("IEND", Buffer.alloc(0)),
	]);
}

export function withPngChunk(png: Buffer, type: string, data: Buffer): Buffer {
	const iendOffset = png.length - 12;
	return Buffer.concat([
		png.subarray(0, iendOffset),
		chunk(type, data),
		png.subarray(iendOffset),
	]);
}

export function withBadChunkCrc(png: Buffer, type: string): Buffer {
	const copy = Buffer.from(png);
	const offset = findChunk(copy, type);
	const length = copy.readUInt32BE(offset);
	copy[offset + 8 + length + 3] ^= 0xff;
	return copy;
}

export function truncatePng(png: Buffer, length: number): Buffer {
	return Buffer.from(png.subarray(0, length));
}

export function truncateChunkData(
	png: Buffer,
	type: string,
	length: number,
): Buffer {
	const offset = findChunk(png, type);
	return truncatePng(png, offset + 8 + length);
}

export function withTrailingBytes(png: Buffer, tail: Buffer): Buffer {
	return Buffer.concat([png, Buffer.from(tail)]);
}

const checker = (x: number, y: number): [number, number, number, number] =>
	x % 2 === y % 2 ? [255, 0, 0, 255] : [255, 255, 255, 255];

const alphaGrid = (x: number, y: number): [number, number, number, number] =>
	(x + y) % 3 === 0 ? [0, 0, 0, 0] : [0, 128, 255, 255];

const solidRed = (): [number, number, number, number] => [255, 0, 0, 255];

export function asSourceFile(buffer: Buffer, name: string): SourceFile {
	return { name, mimeType: "image/png", buffer };
}

export const opaquePng: SourceFile = asSourceFile(
	makePng(64, 48, checker),
	"opaque.png",
);
export const transparentPng: SourceFile = asSourceFile(
	makePng(64, 64, alphaGrid),
	"transparent.png",
);
export const onePixelPng: SourceFile = asSourceFile(
	makePng(1, 1, solidRed),
	"1px.png",
);
export const landscapePng: SourceFile = asSourceFile(
	makePng(64, 16, checker),
	"landscape.png",
);
export const largePng: SourceFile = asSourceFile(
	makePng(256, 256, checker),
	"large.png",
);
export const corruptPng: SourceFile = {
	name: "corrupt.png",
	mimeType: "image/png",
	buffer: Buffer.from("this is definitely not a png file", "utf8"),
};

const specialPng = makePng(8, 8, checker);
const specialWithText = withPngChunk(
	specialPng,
	"tEXt",
	Buffer.from("Comment\0q6d", "ascii"),
);
const palette4 = [
	[255, 0, 0],
	[0, 255, 0],
	[0, 0, 255],
	[255, 255, 255],
] as [number, number, number][];
const palette256 = Array.from({ length: 256 }, (_, index) => [
	index,
	(index * 3) % 256,
	(index * 7) % 256,
]) as [number, number, number][];

export const crcBadIdatPng = asSourceFile(
	withBadChunkCrc(specialPng, "IDAT"),
	"crc-bad-idat.png",
);
export const crcBadAncillaryPng = asSourceFile(
	withBadChunkCrc(specialWithText, "tEXt"),
	"crc-bad-ancillary.png",
);
export const truncatedHeaderPng = asSourceFile(
	truncatePng(specialPng, PNG_SIGNATURE.length + 12 + 13),
	"truncated-header.png",
);
export const truncatedNoIendPng = asSourceFile(
	truncatePng(specialPng, specialPng.length - 12),
	"truncated-no-iend.png",
);
export const idatCutPng = asSourceFile(
	truncateChunkData(specialPng, "IDAT", 4),
	"idat-cut.png",
);
export const garbageTailPng = asSourceFile(
	withTrailingBytes(specialPng, Buffer.from("trailing-garbage", "ascii")),
	"garbage-tail.png",
);
export const palette4Png = asSourceFile(
	makeIndexedPng(
		8,
		8,
		palette4,
		(x, y) => (Math.floor(x / 2) + Math.floor(y / 2)) % palette4.length,
	),
	"palette-4.png",
);
export const palette256Png = asSourceFile(
	makeIndexedPng(16, 16, palette256, (x, y) => (x + y * 16) % 256),
	"palette-256.png",
);
export const sixteenBitPng = asSourceFile(
	make16BitPng(8, 8, (x, y) => [x * 8000, y * 8000, 32768, 65535]),
	"16bit.png",
);

export const tinyBase64 = makePng(8, 8, solidRed).toString("base64");

export const svgMarkup =
	'<svg xmlns="http://www.w3.org/2000/svg" width="10" height="6">' +
	'<rect width="10" height="6" fill="#ff0000"/></svg>';

const PIXEL_BYTES = (r: number, g: number, b: number, a: number): string =>
	`${r} ${g} ${b} ${a}`;

/** Input row for bytes-to-png / rgb-values-to-png, 32 pixels per line by default. */
export function pixelRow(
	count: number,
	rgba: [number, number, number, number],
): string {
	return Array.from({ length: count }, () => PIXEL_BYTES(...rgba)).join(" ");
}
