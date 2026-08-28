import { encodeBmpBytes } from "./bmp";
import { ToolError } from "./errors";
import { type PixelImage } from "./types";

export type OutputMime =
	"image/png" | "image/jpeg" | "image/webp" | "image/bmp";

export const ACCEPTED_IMAGE_TYPES =
	"image/png,image/jpeg,image/webp,image/gif,image/bmp,image/x-icon";

const SUPPORTED_MIME_TYPES = new Set(ACCEPTED_IMAGE_TYPES.split(","));

export function isSupportedImage(file: File): boolean {
	return SUPPORTED_MIME_TYPES.has(file.type);
}

export function unsupportedImageError(file: File): ToolError {
	return new ToolError("errors.unsupportedFile", {
		type: file.type || "unknown",
	});
}

async function decodeBitmap(bitmap: ImageBitmap): Promise<PixelImage> {
	const canvas = document.createElement("canvas");
	canvas.width = bitmap.width;
	canvas.height = bitmap.height;
	const ctx = canvas.getContext("2d", { willReadFrequently: true });
	if (!ctx) {
		throw new ToolError("errors.noCanvasCtx");
	}
	ctx.drawImage(bitmap, 0, 0);
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	return {
		width: imageData.width,
		height: imageData.height,
		data: imageData.data,
	};
}

export async function decodeFile(file: File): Promise<PixelImage> {
	const bitmap = await createImageBitmap(file);
	try {
		return await decodeBitmap(bitmap);
	} finally {
		bitmap.close();
	}
}

export async function decodeBytes(
	bytes: Uint8Array<ArrayBuffer>,
): Promise<PixelImage> {
	const blob = new Blob([bytes]);
	const bitmap = await createImageBitmap(blob);
	try {
		return await decodeBitmap(bitmap);
	} finally {
		bitmap.close();
	}
}

export function toDataUrl(img: PixelImage): string {
	const canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;
	const ctx = canvas.getContext("2d");
	if (!ctx) {
		throw new ToolError("errors.noCanvasCtx");
	}
	ctx.putImageData(new ImageData(img.data, img.width, img.height), 0, 0);
	return canvas.toDataURL("image/png");
}

export function toBase64(img: PixelImage): string {
	return toDataUrl(img).slice("data:image/png;base64,".length);
}

export async function decodeTextImage(text: string): Promise<PixelImage> {
	const cleaned = text.trim().replace(/^data:[^,]*,/, "");
	if (cleaned.length === 0) {
		throw new ToolError("errors.badBase64");
	}
	const binary = atob(cleaned);
	const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
	return await decodeBytes(bytes);
}

export async function encode(
	img: PixelImage,
	mime: OutputMime = "image/png",
	quality?: number,
): Promise<Blob> {
	if (mime === "image/bmp") {
		return new Blob([encodeBmpBytes(img)], { type: mime });
	}
	if (mime === "image/jpeg" || mime === "image/webp") {
		if (quality !== undefined && (quality < 0 || quality > 1)) {
			throw new ToolError("errors.qualityRange");
		}
	}
	const canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;
	const ctx = canvas.getContext("2d");
	if (!ctx) {
		throw new ToolError("errors.noCanvasCtx");
	}
	ctx.putImageData(new ImageData(img.data, img.width, img.height), 0, 0);
	return await canvasToBlob(canvas, mime, quality);
}

function canvasToBlob(
	canvas: HTMLCanvasElement,
	mime: OutputMime,
	quality?: number,
): Promise<Blob> {
	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) =>
				blob
					? resolve(blob)
					: reject(new ToolError("errors.encodeUnsupported", { mime })),
			mime,
			quality,
		);
	});
}

export function downloadBlob(blob: Blob, filename: string): void {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.append(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}

export function replaceExtension(filename: string, ext: string): string {
	const base = filename.replace(/\.[^./\\]+$/, "");
	return `${base}.${ext}`;
}

export async function decodeSvgText(
	text: string,
	targetWidth?: number,
): Promise<PixelImage> {
	const trimmed = text.trim();
	if (trimmed.length === 0) {
		throw new ToolError("errors.svgSize");
	}
	const blob = new Blob([trimmed], { type: "image/svg+xml" });
	const url = URL.createObjectURL(blob);
	try {
		const img = new Image();
		await new Promise<void>((resolve, reject) => {
			img.onload = () => resolve();
			img.onerror = () => reject(new ToolError("errors.svgLoad"));
			img.src = url;
		});
		const w = targetWidth ?? img.naturalWidth ?? 300;
		const ratio =
			img.naturalHeight > 0 ? img.naturalHeight / img.naturalWidth : 1;
		const h = Math.max(1, Math.round(w * ratio));
		const canvas = document.createElement("canvas");
		canvas.width = w;
		canvas.height = h;
		const ctx = canvas.getContext("2d", { willReadFrequently: true });
		if (!ctx) throw new ToolError("errors.noCanvasCtx");
		ctx.drawImage(img, 0, 0, w, h);
		const imageData = ctx.getImageData(0, 0, w, h);
		return {
			width: imageData.width,
			height: imageData.height,
			data: imageData.data,
		};
	} finally {
		URL.revokeObjectURL(url);
	}
}

export async function jpegRoundtrip(
	img: PixelImage,
	qualityPercent: number,
): Promise<PixelImage> {
	const quality = Math.min(Math.max(Math.trunc(qualityPercent), 1), 100) / 100;
	const jpegBlob = await encode(img, "image/jpeg", quality);
	const bitmap = await createImageBitmap(jpegBlob);
	try {
		return await decodeBitmap(bitmap);
	} finally {
		bitmap.close();
	}
}
