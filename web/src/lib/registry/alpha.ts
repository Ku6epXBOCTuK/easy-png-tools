import type { ToolEntry } from "../registry";
import { ToolError } from "../core/errors";
import {
	colorMask,
	extractAlphaMask,
	flattenOntoColor,
	hardenAlpha,
	invertAlpha,
	removeColorToAlpha,
	roundCorners,
	setAlphaChannel,
} from "../core/alpha";
import { backgroundMaskPreview, removeBackground } from "../core/background";
import {
	closingImage,
	contourImage,
	dilateImage,
	erodeImage,
	openingImage,
	strokeImage,
} from "../core/morphology";
import { featherAlpha, defringe } from "../core/pixel-fx";
import { drawImageWatermark } from "../core/domText";
import { getOverlay } from "../tools/overlay-store.svelte";
import {
	renderShape,
	circleTest,
	boxTest,
	starTest,
	wavyTest,
} from "../core/shapes";
import type { Position9 } from "../core/textdraw";
import { num, str } from "../registry-helpers";

export function alphaEntries(): ToolEntry[] {
	return [
		{
			id: "circle-mask-png",
			title: "Circle Mask PNG",
			description:
				"Cuts the image into a circle. Diameter is set as a share of the smaller side.",
			category: "alpha",
			params: [
				{
					id: "size",
					label: "Diameter, % of smaller side",
					type: "slider",
					min: 20,
					max: 100,
					step: 1,
					default: 100,
				},
				{
					id: "offsetX",
					label: "Offset X, %",
					type: "slider",
					min: -50,
					max: 50,
					step: 1,
					default: 0,
				},
				{
					id: "offsetY",
					label: "Offset Y, %",
					type: "slider",
					min: -50,
					max: 50,
					step: 1,
					default: 0,
				},
			],
			run: (img, p) =>
				renderShape(
					img,
					circleTest(num(p, "size") / 200),
					num(p, "offsetX") / 100,
					num(p, "offsetY") / 100,
				),
		},
		{
			id: "square-mask-png",
			title: "Square Mask PNG",
			description:
				"Cuts the image into a rectangle with sides as a share of the smaller side.",
			category: "alpha",
			params: [
				{
					id: "widthPct",
					label: "Width, % of smaller side",
					type: "slider",
					min: 10,
					max: 100,
					step: 1,
					default: 100,
				},
				{
					id: "heightPct",
					label: "Height, % of smaller side",
					type: "slider",
					min: 10,
					max: 100,
					step: 1,
					default: 100,
				},
				{
					id: "offsetX",
					label: "Offset X, %",
					type: "slider",
					min: -50,
					max: 50,
					step: 1,
					default: 0,
				},
				{
					id: "offsetY",
					label: "Offset Y, %",
					type: "slider",
					min: -50,
					max: 50,
					step: 1,
					default: 0,
				},
			],
			run: (img, p) =>
				renderShape(
					img,
					boxTest(num(p, "widthPct") / 200, num(p, "heightPct") / 200),
					num(p, "offsetX") / 100,
					num(p, "offsetY") / 100,
				),
		},
		{
			id: "star-mask-png",
			title: "Star Mask PNG",
			description:
				"Cuts the image into an n-pointed star with adjustable inner radius and rotation.",
			category: "alpha",
			params: [
				{
					id: "points",
					label: "Points",
					type: "slider",
					min: 3,
					max: 12,
					step: 1,
					default: 5,
				},
				{
					id: "innerRadius",
					label: "Inner radius, %",
					type: "slider",
					min: 10,
					max: 90,
					step: 1,
					default: 45,
				},
				{
					id: "size",
					label: "Outer radius, % of smaller side",
					type: "slider",
					min: 20,
					max: 100,
					step: 1,
					default: 100,
				},
				{
					id: "rotation",
					label: "Rotation, °",
					type: "slider",
					min: -180,
					max: 180,
					step: 1,
					default: 0,
				},
				{
					id: "offsetX",
					label: "Offset X, %",
					type: "slider",
					min: -50,
					max: 50,
					step: 1,
					default: 0,
				},
				{
					id: "offsetY",
					label: "Offset Y, %",
					type: "slider",
					min: -50,
					max: 50,
					step: 1,
					default: 0,
				},
			],
			run: (img, p) =>
				renderShape(
					img,
					starTest(
						num(p, "points"),
						num(p, "innerRadius") / 100,
						num(p, "size") / 200,
						num(p, "rotation"),
					),
					num(p, "offsetX") / 100,
					num(p, "offsetY") / 100,
				),
		},
		{
			id: "wavy-mask-png",
			title: "Wavy Mask PNG",
			description:
				"Cuts the image into a wavy-edged circle: radius is modulated by a sine with chosen amplitude and frequency.",
			category: "alpha",
			params: [
				{
					id: "size",
					label: "Base radius, % of smaller side",
					type: "slider",
					min: 20,
					max: 100,
					step: 1,
					default: 90,
				},
				{
					id: "amplitude",
					label: "Wave amplitude, %",
					type: "slider",
					min: 2,
					max: 30,
					step: 1,
					default: 8,
				},
				{
					id: "waves",
					label: "Waves count",
					type: "slider",
					min: 3,
					max: 24,
					step: 1,
					default: 8,
				},
				{
					id: "phase",
					label: "Phase, °",
					type: "slider",
					min: 0,
					max: 360,
					step: 1,
					default: 0,
				},
				{
					id: "offsetX",
					label: "Offset X, %",
					type: "slider",
					min: -50,
					max: 50,
					step: 1,
					default: 0,
				},
				{
					id: "offsetY",
					label: "Offset Y, %",
					type: "slider",
					min: -50,
					max: 50,
					step: 1,
					default: 0,
				},
			],
			run: (img, p) =>
				renderShape(
					img,
					wavyTest(
						num(p, "size") / 200,
						num(p, "amplitude") / 200,
						num(p, "waves"),
						num(p, "phase"),
					),
					num(p, "offsetX") / 100,
					num(p, "offsetY") / 100,
				),
		},
		{
			id: "remove-alpha-channel-png",
			title: "Remove alpha channel PNG",
			description:
				"Composites the image over a white background and saves without transparency.",
			category: "alpha",
			params: [],
			run: (img) => flattenOntoColor(img, "#ffffff"),
		},
		{
			id: "set-alpha-channel-png",
			title: "Set alpha channel PNG",
			description:
				"Assigns the same opacity to all pixels; colors stay unchanged.",
			category: "alpha",
			params: [
				{
					id: "percent",
					label: "Opacity, %",
					type: "slider",
					min: 0,
					max: 100,
					step: 1,
					default: 100,
				},
			],
			run: (img, p) => setAlphaChannel(img, num(p, "percent")),
		},
		{
			id: "extract-alpha-mask-png",
			title: "Extract alpha mask PNG",
			description: "Turns transparency into a black-and-white opaque mask.",
			category: "alpha",
			params: [],
			run: (img) => extractAlphaMask(img),
		},
		{
			id: "round-corners-png",
			title: "Round corners PNG",
			description:
				"Clips corners by a radius set as a percentage of half the smaller side.",
			category: "alpha",
			params: [
				{
					id: "radius",
					label: "Corner radius, %",
					type: "slider",
					min: 0,
					max: 50,
					step: 1,
					default: 10,
				},
			],
			run: (img, p) => roundCorners(img, num(p, "radius")),
		},
		{
			id: "invert-alpha-png",
			title: "Invert alpha PNG",
			description: "Opaque areas become transparent and vice versa.",
			category: "alpha",
			params: [],
			run: (img) => invertAlpha(img),
		},
		{
			id: "remove-background-png",
			title: "Remove background PNG (smart)",
			description:
				"Removes a solid background: by color with tolerance, outer regions from the edges only, or every matching pixel. Can smooth the boundary.",
			category: "alpha",
			params: [
				{
					id: "color",
					label: "Background color",
					type: "color",
					default: "#ffffff",
				},
				{
					id: "tolerance",
					label: "Similarity tolerance, %",
					type: "slider",
					min: 0,
					max: 100,
					step: 1,
					default: 10,
				},
				{
					id: "outerOnly",
					label: "Outer regions only",
					type: "checkbox",
					default: true,
				},
				{
					id: "smooth",
					label: "Edge smoothing, passes",
					type: "slider",
					min: 0,
					max: 8,
					step: 1,
					default: 1,
				},
			],
			run: (img, p) =>
				removeBackground(img, {
					color: str(p, "color"),
					tolerancePercent: num(p, "tolerance"),
					outerOnly: p["outerOnly"] === true,
					smoothPasses: num(p, "smooth"),
				}),
			preview: (img, p) =>
				backgroundMaskPreview(img, {
					color: str(p, "color"),
					tolerancePercent: num(p, "tolerance"),
					outerOnly: p["outerOnly"] === true,
					smoothPasses: num(p, "smooth"),
				}),
		},
		{
			id: "add-stroke-png",
			title: "Outline PNG",
			description:
				"Adds a colored ring outline around the opaque content with the chosen thickness.",
			category: "alpha",
			params: [
				{
					id: "color",
					label: "Outline color",
					type: "color",
					default: "#ff0000",
				},
				{
					id: "thickness",
					label: "Thickness, px",
					type: "slider",
					min: 1,
					max: 10,
					step: 1,
					default: 3,
				},
			],
			run: (img, p) => strokeImage(img, num(p, "thickness"), str(p, "color")),
		},
		{
			id: "find-contour-png",
			title: "Find contour PNG",
			description:
				"Leaves only a line along the boundary of opaque regions in the chosen color and thickness.",
			category: "alpha",
			params: [
				{
					id: "color",
					label: "Line color",
					type: "color",
					default: "#000000",
				},
				{
					id: "thickness",
					label: "Line thickness, px",
					type: "slider",
					min: 1,
					max: 5,
					step: 1,
					default: 1,
				},
			],
			run: (img, p) => contourImage(img, num(p, "thickness"), str(p, "color")),
		},
		{
			id: "make-thicker-png",
			title: "Thicken PNG",
			description: "Expands opaque areas by the given number of pixels.",
			category: "alpha",
			params: [
				{
					id: "radius",
					label: "Amount, px",
					type: "slider",
					min: 1,
					max: 10,
					step: 1,
					default: 2,
				},
			],
			run: (img, p) => dilateImage(img, num(p, "radius")),
		},
		{
			id: "make-thinner-png",
			title: "Thin PNG",
			description:
				"Shrinks opaque areas — thins the strokes of text and details.",
			category: "alpha",
			params: [
				{
					id: "radius",
					label: "Amount, px",
					type: "slider",
					min: 1,
					max: 10,
					step: 1,
					default: 1,
				},
			],
			run: (img, p) => erodeImage(img, num(p, "radius")),
		},
		{
			id: "feather-edges-png",
			title: "Feather Edges PNG",
			description:
				"Blurs only the alpha channel: hard cutout edges become soft and gradual, colors stay untouched.",
			category: "alpha",
			params: [
				{
					id: "radius",
					label: "Feather radius, px",
					type: "slider",
					min: 1,
					max: 20,
					step: 1,
					default: 3,
				},
			],
			run: (img, p) => featherAlpha(img, num(p, "radius")),
		},
		{
			id: "clean-edges-png",
			title: "Clean Edges PNG (defringe)",
			description:
				"Replaces edge-halo colors of semi-transparent pixels with the nearest fully opaque color. Alpha stays as is.",
			category: "alpha",
			params: [
				{
					id: "radius",
					label: "Search radius, px",
					type: "slider",
					min: 1,
					max: 10,
					step: 1,
					default: 3,
				},
			],
			run: (img, p) => defringe(img, num(p, "radius")),
		},
		{
			id: "harden-alpha-png",
			title: "Harden edges PNG",
			description:
				"Binarizes the alpha channel by threshold: semi-transparent pixels become either fully transparent or fully opaque.",
			category: "alpha",
			params: [
				{
					id: "threshold",
					label: "Alpha threshold, %",
					type: "slider",
					min: 0,
					max: 100,
					step: 1,
					default: 50,
				},
			],
			run: (img, p) => hardenAlpha(img, num(p, "threshold")),
		},
		{
			id: "despeckle-alpha-png",
			title: "Despeckle PNG",
			description:
				"Opening: removes lone semi-transparent pixels and small specks.",
			category: "alpha",
			params: [
				{
					id: "radius",
					label: "Cleanup radius, px",
					type: "slider",
					min: 1,
					max: 3,
					step: 1,
					default: 1,
				},
			],
			run: (img, p) => openingImage(img, num(p, "radius")),
		},
		{
			id: "close-holes-png",
			title: "Close holes PNG",
			description: "Closing: fills lone transparent dots inside the object.",
			category: "alpha",
			params: [
				{
					id: "radius",
					label: "Closing radius, px",
					type: "slider",
					min: 1,
					max: 3,
					step: 1,
					default: 1,
				},
			],
			run: (img, p) => closingImage(img, num(p, "radius")),
		},
		{
			id: "remove-color-from-png",
			title: "Remove color from PNG (make transparent)",
			description:
				"Makes all pixels close to the chosen color transparent. The tolerance sets the allowed deviation as a percentage of the maximum color distance.",
			category: "alpha",
			params: [
				{
					id: "targetColor",
					label: "Color to remove",
					type: "color",
					default: "#00ff00",
				},
				{
					id: "tolerance",
					label: "Similarity threshold, %",
					type: "slider",
					min: 0,
					max: 100,
					step: 1,
					default: 10,
				},
			],
			run: (img, p) =>
				removeColorToAlpha(img, str(p, "targetColor"), num(p, "tolerance")),
			preview: (img, p) =>
				colorMask(img, str(p, "targetColor"), num(p, "tolerance")),
		},
		{
			id: "watermark-image-png",
			title: "Watermark Image PNG",
			description:
				"Overlays another PNG (logo/signature) on top: scale from canvas width, opacity, 3×3 position. The mark lives only while the page is open — after restoring a chain, pick it again.",
			category: "alpha",
			domOnly: true,
			needsOverlaySource: true,
			params: [
				{
					id: "scale",
					label: "Mark width, % of canvas",
					type: "slider",
					min: 5,
					max: 100,
					step: 1,
					default: 30,
				},
				{
					id: "opacity",
					label: "Opacity, %",
					type: "slider",
					min: 5,
					max: 100,
					step: 5,
					default: 60,
				},
				{
					id: "position",
					label: "Position",
					type: "select",
					default: "bottom-right",
					options: [
						{ value: "top-left", label: "Top left" },
						{ value: "top-center", label: "Top center" },
						{ value: "top-right", label: "Top right" },
						{ value: "middle-left", label: "Middle left" },
						{ value: "center", label: "Center" },
						{ value: "middle-right", label: "Middle right" },
						{ value: "bottom-left", label: "Bottom left" },
						{ value: "bottom-center", label: "Bottom center" },
						{ value: "bottom-right", label: "Bottom right" },
					],
				},
				{
					id: "margin",
					label: "Margin, px",
					type: "slider",
					min: 0,
					max: 200,
					step: 1,
					default: 24,
				},
			],
			run: (img, p) => {
				const mark = getOverlay();
				if (!mark) throw new ToolError("errors.noWatermark");
				return drawImageWatermark(img, {
					mark,
					scalePercent: num(p, "scale"),
					opacityPercent: num(p, "opacity"),
					position: str(p, "position") as Position9,
					margin: num(p, "margin"),
				});
			},
		},
	];
}
