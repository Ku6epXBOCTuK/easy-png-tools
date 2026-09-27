import type { Page } from "../types";

export const convertPages: Page[] = [
	{
		slug: "convert-png-to-jpg",
		title: "Convert PNG to JPG",
		description:
			"Transparency is composited over the chosen backdrop color (white by default) and saved as JPEG.",
		category: "convert",
		steps: [{ id: "to-jpg" }],
	},
	{
		slug: "convert-png-to-webp",
		title: "Convert PNG to WebP",
		description:
			"Re-encodes the image into WebP with adjustable quality. Transparency is preserved.",
		category: "convert",
		steps: [{ id: "to-webp" }],
	},
	{
		slug: "png-to-bmp",
		title: "Convert PNG to BMP",
		description:
			"Saves the image as 24-bit BMP without an alpha channel: transparency is replaced with a black background.",
		category: "convert",
		steps: [{ id: "to-bmp" }],
	},
	{
		slug: "png-to-base64",
		title: "PNG to Base64",
		description:
			"Encodes the image into a base64 string for embedding in code or styles.",
		category: "convert",
		steps: [{ id: "to-base64" }],
	},
	{
		slug: "png-to-data-uri",
		title: "PNG to Data URI",
		description:
			"Builds a full data-uri (data:image/png;base64,…) for embedding in HTML/CSS.",
		category: "convert",
		steps: [{ id: "to-data-uri" }],
	},
	{
		slug: "png-to-hex",
		title: "PNG to HEX pixels",
		description:
			"Shows all pixels as rrggbbaa hex values — row by row, space separated.",
		category: "convert",
		steps: [{ id: "to-hex" }],
	},
	{
		slug: "png-to-bytes",
		title: "PNG to Bytes",
		description:
			"Lists every pixel as four decimal bytes (R G B A), one image row per line.",
		category: "convert",
		steps: [{ id: "to-bytes" }],
	},
	{
		slug: "png-to-rgb-values",
		title: "PNG to RGB Values",
		description:
			"Lists every pixel as rgba(r, g, b, a), one image row per line.",
		category: "convert",
		steps: [{ id: "to-rgb-values" }],
	},
	{
		slug: "base64-to-png",
		title: "Base64 to PNG",
		description:
			"Decodes a base64 string or data-uri back into an image. Paste the string on the left.",
		category: "convert",
		steps: [{ id: "from-base64" }],
	},
	{
		slug: "data-uri-to-png",
		title: "Data URI to PNG",
		description: "Decodes data:image/…;base64,… back into an image file.",
		category: "convert",
		steps: [{ id: "from-data-uri" }],
	},
	{
		slug: "hex-to-png",
		title: "HEX pixels to PNG",
		description:
			"Assembles an image from rrggbbaa hex values (space separated). Set the width — the height is computed automatically.",
		category: "convert",
		steps: [{ id: "from-hex" }],
	},
	{
		slug: "bytes-to-png",
		title: "Bytes to PNG",
		description:
			"Assembles an image from decimal RGBA byte numbers (any separators). Set the width — height is computed automatically.",
		category: "convert",
		steps: [{ id: "from-bytes" }],
	},
	{
		slug: "rgb-values-to-png",
		title: "RGB Values to PNG",
		description:
			"Assembles an image from rgba(r, g, b, a) numbers. Set the width — height is computed automatically.",
		category: "convert",
		steps: [{ id: "from-rgb-values" }],
	},
	{
		slug: "svg-to-png",
		title: "SVG to PNG",
		description:
			"Decodes SVG markup into a raster image. Paste the SVG code on the left.",
		category: "convert",
		steps: [{ id: "from-svg" }],
	},
];
