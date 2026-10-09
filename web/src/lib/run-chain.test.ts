import { describe, expect, it } from "vitest";
import { makeImage } from "./core/test-helpers";
import type { PixelImage } from "./core/types";
import type { ExecuteContext } from "./executor";
import { getTool, type Tool, type ToolImageFile } from "./registry";
import { ChainStepError, glueName, runChain, uniqueName } from "./run-chain";

const realExecute = (tool: Tool, ctx: ExecuteContext) =>
	Promise.resolve(tool.run(ctx as never));

function named(name: string, image: PixelImage): ToolImageFile {
	return { name, image };
}

const img4x2 = makeImage(4, 2, new Array(8).fill([100, 100, 100, 255]));
const img2x2 = makeImage(2, 2, new Array(4).fill([200, 50, 0, 255]));

describe("runChain", () => {
	it("single image through an image step returns a plain image", async () => {
		const r = await runChain(
			[{ id: "grayscale", params: {} }],
			[named("photo.png", img2x2)],
			undefined,
			realExecute,
		);
		expect("data" in (r.out as PixelImage)).toBe(true);
		expect(r.stepResults[0]?.width).toBe(2);
		expect(r.warnings).toEqual([]);
	});

	it("split mid-chain fans out: next step applies to every part", async () => {
		const r = await runChain(
			[
				{
					id: "split-into-parts",
					params: { mode: "grid", columns: 2, rows: 1 },
				},
				{ id: "grayscale", params: {} },
			],
			[named("img.png", img4x2)],
			undefined,
			realExecute,
		);
		const files = (r.out as { files: ToolImageFile[] }).files;
		expect(files).toHaveLength(2);
		expect(files.map((f) => f.name)).toEqual([
			"img-part-1-1.png",
			"img-part-1-2.png",
		]);
		// full per-step sets: split -> 2 parts, grayscale -> 2 images
		expect(r.stepFileSets.map((s) => s.length)).toEqual([2, 2]);
		// grayscale is deterministic: part pixels are gray both in R and B
		const px = files[0].image.data;
		expect(px[0]).toBe(px[2]);
	});

	it("batch input: one image step over many files yields a named set", async () => {
		const r = await runChain(
			[{ id: "grayscale", params: {} }],
			[named("a.png", img2x2), named("b.png", img2x2)],
			undefined,
			realExecute,
		);
		const files = (r.out as { files: ToolImageFile[] }).files;
		expect(files.map((f) => f.name)).toEqual(["a.png", "b.png"]);
		expect(r.stepResults[0]).toBe(files[0].image);
	});

	it("partial failure: the step continues, warning reports the count", async () => {
		const flaky = (tool: Tool, ctx: ExecuteContext) => {
			if (ctx.source?.data[0] === 200) return Promise.reject(new Error("bad"));
			return realExecute(tool, ctx);
		};
		const r = await runChain(
			[{ id: "grayscale", params: {} }],
			[named("ok.png", img4x2), named("bad.png", img2x2)],
			undefined,
			flaky,
		);
		// a single survivor degrades to a plain image result
		expect("data" in (r.out as PixelImage)).toBe(true);
		expect(r.warnings).toEqual([{ kind: "partial", step: 1, ok: 1, total: 2 }]);
	});

	it("total failure: ChainStepError with the step index", async () => {
		const failing = () => Promise.reject(new Error("nope"));
		await expect(
			runChain(
				[{ id: "grayscale", params: {} }],
				[named("a.png", img2x2)],
				undefined,
				failing,
			),
		).rejects.toSatisfy(
			(e) => e instanceof ChainStepError && e.stepIndex === 0,
		);
	});

	it("analyze step over a batch sees only the first file", async () => {
		const r = await runChain(
			[{ id: "is-transparent", params: {} }],
			[named("a.png", img2x2), named("b.png", img2x2)],
			undefined,
			realExecute,
		);
		expect(r.warnings).toEqual([{ kind: "firstOnly", step: 1, total: 2 }]);
		expect(r.out).toBe("transparentNo");
	});
});

describe("glueName", () => {
	it("strips the parent extension, keeps the part name", () => {
		expect(glueName("photo.jpeg", "part-1-1.png")).toBe("photo-part-1-1.png");
	});
});

describe("uniqueName", () => {
	it("keeps the first, suffixes duplicates", () => {
		const used = new Set<string>();
		const a = uniqueName("image.png", used);
		used.add(a);
		const b = uniqueName("image.png", used);
		used.add(b);
		const c = uniqueName("image.png", used);
		expect([a, b, c]).toEqual(["image.png", "image-2.png", "image-3.png"]);
	});
});
