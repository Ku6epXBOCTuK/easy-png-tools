import type { PixelImage } from './types';

export function encodeBmpBytes(img: PixelImage): Uint8Array<ArrayBuffer> {
	const rowSize = Math.ceil((img.width * 3) / 4) * 4;
	const pixelArraySize = rowSize * img.height;
	const fileSize = 54 + pixelArraySize;

	const buf = new Uint8Array(fileSize);
	const view = new DataView(buf.buffer);

	buf[0] = 0x42;
	buf[1] = 0x4d;
	view.setUint32(2, fileSize, true);
	view.setUint32(10, 54, true);
	view.setUint32(14, 40, true);
	view.setInt32(18, img.width, true);
	view.setInt32(22, img.height, true);
	view.setUint16(26, 1, true);
	view.setUint16(28, 24, true);
	view.setUint32(30, 0, true);
	view.setUint32(34, pixelArraySize, true);
	view.setInt32(38, 2835, true);
	view.setInt32(42, 2835, true);

	for (let y = 0; y < img.height; y++) {
		const srcY = img.height - 1 - y;
		let off = 54 + y * rowSize;
		for (let x = 0; x < img.width; x++) {
			const i = (srcY * img.width + x) * 4;
			buf[off++] = img.data[i + 2];
			buf[off++] = img.data[i + 1];
			buf[off++] = img.data[i];
		}
	}

	return buf;
}
