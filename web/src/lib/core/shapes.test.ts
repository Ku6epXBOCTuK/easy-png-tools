import { describe, expect, it } from "vitest";
import {
	boxTest,
	circleTest,
	renderShape,
	renderShapeMask,
	starTest,
	wavyTest,
} from "./shapes";
import { makeImage } from "./test-helpers";

describe("shape predicates", () => {
	it("circle: center inside, corner outside", () => {
		const t = circleTest(0.5);
		expect(t(0, 0)).toBe(true);
		expect(t(0.49, 0)).toBe(true);
		expect(t(0.51, 0)).toBe(false);
		expect(t(0.4, 0.4)).toBe(false);
	});

	it("box: semi-axes independent", () => {
		const t = boxTest(0.5, 0.25);
		expect(t(0.45, 0.2)).toBe(true);
		expect(t(0.2, 0.3)).toBe(false);
	});

	it("star: ray inside further than valley", () => {
		const t = starTest(5, 0.5, 1, 0);
		expect(t(0.9, 0)).toBe(true); // along the ray (theta=0)
		const valleyAngle = Math.PI / 5; // midway between rays
		expect(t(Math.cos(valleyAngle) * 0.8, Math.sin(valleyAngle) * 0.8)).toBe(
			false,
		);
		expect(t(0.4, 0)).toBe(true); // valley radius 0.5 - 0.4 always inside
	});

	it("wave: phase moves the edge", () => {
		const a = wavyTest(0.5, 0.1, 6, 0);
		const b = wavyTest(0.5, 0.1, 6, 180);
		const deg = 15; // sin(6*15deg)=1 -> edge 0.6; at phase 180 deg edge 0.4
		const rad = (deg * Math.PI) / 180;
		const px = 0.55;
		expect(a(px * Math.cos(rad), px * Math.sin(rad))).toBe(true); // edge 0.6
		expect(b(px * Math.cos(rad), px * Math.sin(rad))).toBe(false); // edge 0.4
	});
});

describe("renderShape", () => {
	const img = makeImage(4, 2, new Array(8).fill([255, 255, 255, 255]));

	it("inside keeps pixels, outside alpha 0", () => {
		const out = renderShape(img, boxTest(0.5, 0.5));
		let opaque = 0;
		for (let i = 3; i < out.data.length; i += 4)
			if (out.data[i] === 255) opaque++;
		expect(opaque).toBe(4);
		expect(out.data[4]).toBe(255); // RGB inside shape preserved
	});

	it("center offset moves the mask", () => {
		const shifted = renderShape(
			makeImage(2, 2, new Array(4).fill([255, 255, 255, 255])),
			circleTest(0.7),
			0.5,
		);
		expect(shifted.data[3]).toBe(0);
		expect(shifted.data[4 + 3]).toBe(255);
	});

	// Regression of old square-mask bug: full size without offset must
	// keep the whole square image.
	it("100% box without offset keeps whole square image", () => {
		const out = renderShape(
			makeImage(4, 4, new Array(16).fill([255, 255, 255, 255])),
			boxTest(0.5, 0.5),
		);
		for (let i = 3; i < out.data.length; i += 4) expect(out.data[i]).toBe(255);
	});

	// Offset is a fraction of free space: +/-0.5 pins the shape to the edge
	// at any size; the shape never leaves the canvas.
	it("max offset pins shape to edge", () => {
		const out = renderShape(
			makeImage(4, 4, new Array(16).fill([255, 255, 255, 255])),
			boxTest(0.25, 0.25),
			0.5,
			0.5,
			{ x: 0.25, y: 0.25 },
		);
		const opaqueAt = (x: number, y: number) =>
			out.data[(y * 4 + x) * 4 + 3] === 255;
		expect(opaqueAt(3, 3)).toBe(true);
		expect(opaqueAt(2, 2)).toBe(true);
		expect(opaqueAt(1, 1)).toBe(false);
		expect(opaqueAt(2, 1)).toBe(false);
	});
});

describe("renderShapeMask", () => {
	it("white inside the shape, black outside, same geometry as renderShape", () => {
		const shape = renderShape(
			makeImage(5, 5, new Array(25).fill([200, 100, 50, 255])),
			circleTest(0.4),
			0,
			0,
			{ x: 0.4, y: 0.4 },
		);
		const mask = renderShapeMask(5, 5, circleTest(0.4), 0, 0, {
			x: 0.4,
			y: 0.4,
		});
		for (let i = 0; i < 25; i++) {
			const shaped = shape.data[i * 4 + 3] === 255;
			const v = mask.data[i * 4];
			expect(v, `pixel ${i}`).toBe(shaped ? 255 : 0);
			expect(mask.data[i * 4 + 3]).toBe(255);
		}
	});
});
