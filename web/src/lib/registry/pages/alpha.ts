import type { Page } from "../types";

export const alphaPages: Page[] = [
	{
		slug: "add-stroke-png",
		title: "Outline PNG",
		description:
			"Adds a colored ring outline around the opaque content with the chosen thickness.",
		category: "alpha",
		steps: [{ id: "add-stroke" }],
	},
	{
		slug: "find-contour-png",
		title: "Find contour PNG",
		description:
			"Leaves only a line along the boundary of opaque regions in the chosen color and thickness.",
		category: "alpha",
		steps: [{ id: "find-contour" }],
	},
	{
		slug: "remove-color-from-png",
		title: "Remove color from PNG (make transparent)",
		description:
			"Makes all pixels close to the chosen color transparent. The tolerance sets the allowed deviation as a percentage of the maximum color distance.",
		category: "alpha",
		steps: [{ id: "remove-color-from" }],
	},
	{
		slug: "circle-mask-png",
		title: "Circle Mask PNG",
		description:
			"Cuts the image into a circle. Diameter is set as a share of the smaller side.",
		category: "alpha",
		steps: [{ id: "circle-mask" }],
	},
	{
		slug: "square-mask-png",
		title: "Square Mask PNG",
		description:
			"Cuts the image into a rectangle with sides as a share of the smaller side.",
		category: "alpha",
		steps: [{ id: "square-mask" }],
	},
	{
		slug: "star-mask-png",
		title: "Star Mask PNG",
		description:
			"Cuts the image into an n-pointed star with adjustable inner radius and rotation.",
		category: "alpha",
		steps: [{ id: "star-mask" }],
	},
	{
		slug: "wavy-mask-png",
		title: "Wavy Mask PNG",
		description:
			"Cuts the image into a wavy-edged circle: radius is modulated by a sine with chosen amplitude and frequency.",
		category: "alpha",
		steps: [{ id: "wavy-mask" }],
	},
	{
		slug: "remove-alpha-channel-png",
		title: "Remove alpha channel PNG",
		description:
			"Composites the image over a white background and saves without transparency.",
		category: "alpha",
		steps: [{ id: "remove-alpha-channel" }],
	},
	{
		slug: "set-alpha-channel-png",
		title: "Set alpha channel PNG",
		description:
			"Assigns the same opacity to all pixels; colors stay unchanged.",
		category: "alpha",
		steps: [{ id: "set-alpha-channel" }],
	},
	{
		slug: "extract-alpha-mask-png",
		title: "Extract alpha mask PNG",
		description: "Turns transparency into a black-and-white opaque mask.",
		category: "alpha",
		steps: [{ id: "extract-alpha-mask" }],
	},
	{
		slug: "round-corners-png",
		title: "Round corners PNG",
		description:
			"Clips corners by a radius set as a percentage of half the smaller side.",
		category: "alpha",
		steps: [{ id: "round-corners" }],
	},
	{
		slug: "invert-alpha-png",
		title: "Invert alpha PNG",
		description: "Opaque areas become transparent and vice versa.",
		category: "alpha",
		steps: [{ id: "invert-alpha" }],
	},
	{
		slug: "remove-background-png",
		title: "Remove background PNG (smart)",
		description:
			"Removes a solid background: by color with tolerance, outer regions from the edges only, or every matching pixel. Can smooth the boundary.",
		category: "alpha",
		steps: [{ id: "remove-background" }],
	},
	{
		slug: "make-thicker-png",
		title: "Thicken PNG",
		description: "Expands opaque areas by the given number of pixels.",
		category: "alpha",
		steps: [{ id: "make-thicker" }],
	},
	{
		slug: "make-thinner-png",
		title: "Thin PNG",
		description:
			"Shrinks opaque areas — thins the strokes of text and details.",
		category: "alpha",
		steps: [{ id: "make-thinner" }],
	},
	{
		slug: "feather-edges-png",
		title: "Feather Edges PNG",
		description:
			"Blurs only the alpha channel: hard cutout edges become soft and gradual, colors stay untouched.",
		category: "alpha",
		steps: [{ id: "feather-edges" }],
	},
	{
		slug: "clean-edges-png",
		title: "Clean Edges PNG (defringe)",
		description:
			"Replaces edge-halo colors of semi-transparent pixels with the nearest fully opaque color. Alpha stays as is.",
		category: "alpha",
		steps: [{ id: "clean-edges" }],
	},
	{
		slug: "harden-alpha-png",
		title: "Harden edges PNG",
		description:
			"Binarizes the alpha channel by threshold: semi-transparent pixels become either fully transparent or fully opaque.",
		category: "alpha",
		steps: [{ id: "harden-alpha" }],
	},
	{
		slug: "despeckle-alpha-png",
		title: "Despeckle PNG",
		description:
			"Opening: removes lone semi-transparent pixels and small specks.",
		category: "alpha",
		steps: [{ id: "despeckle-alpha" }],
	},
	{
		slug: "close-holes-png",
		title: "Close holes PNG",
		description: "Closing: fills lone transparent dots inside the object.",
		category: "alpha",
		steps: [{ id: "close-holes" }],
	},
];
