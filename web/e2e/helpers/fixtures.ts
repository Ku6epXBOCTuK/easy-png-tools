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

function chunk(type: string, data: Buffer): Buffer {
	const out = Buffer.alloc(8 + data.length + 4);
	out.writeUInt32BE(data.length, 0);
	out.write(type, 4, "ascii");
	data.copy(out, 8);
	out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
	return out;
}

/** Строит валидный RGBA PNG в рантайме (8-bit, фильтр type 0, deflate/zlib). */
export function makePng(
	width: number,
	height: number,
	pixelAt: (x: number, y: number) => [number, number, number, number],
): Buffer {
	const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
	const ihdr = Buffer.alloc(13);
	ihdr.writeUInt32BE(width, 0);
	ihdr.writeUInt32BE(height, 4);
	ihdr[8] = 8;
	ihdr[9] = 6;
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
		sig,
		chunk("IHDR", ihdr),
		chunk("IDAT", deflateSync(raw)),
		chunk("IEND", Buffer.alloc(0)),
	]);
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

export const tinyBase64 = makePng(8, 8, solidRed).toString("base64");

export const svgMarkup =
	'<svg xmlns="http://www.w3.org/2000/svg" width="10" height="6">' +
	'<rect width="10" height="6" fill="#ff0000"/></svg>';

const PIXEL_BYTES = (r: number, g: number, b: number, a: number): string =>
	`${r} ${g} ${b} ${a}`;

/** Строка для bytes-to-png / rgb-values-to-png, ровно 32 пикселя в ширину по умолчанию. */
export function pixelRow(
	count: number,
	rgba: [number, number, number, number],
): string {
	return Array.from({ length: count }, () => PIXEL_BYTES(...rgba)).join(" ");
}
