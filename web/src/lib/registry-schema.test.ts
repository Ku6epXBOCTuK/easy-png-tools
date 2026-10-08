import { describe, expect, it } from "vitest";
import {
	applySourceDefaults,
	clampSourceAwareMaxes,
	defaultSchemaParams,
	field,
	resolveLayoutGroups,
	sanitizeSchemaParams,
	toolSchema,
	withAspectLock,
	type Dimension,
} from "./registry-schema";

interface FrameParams {
	thickness: number;
	color: string;
	enabled: boolean;
	count: string;
}

const frameSchema = toolSchema<FrameParams>(
	{
		thickness: field.slider({ min: 1, max: 500, default: 5 }),
		color: field.color({ default: "#000000" }),
		enabled: field.checkbox({ default: true }),
		count: field.select({
			default: "two",
			options: [
				{ value: "one", label: "One" },
				{ value: "two", label: "Two" },
			],
		}),
	},
	{
		layout: { groups: [{ title: "Frame", fields: ["thickness", "color"] }] },
		label: "Frame",
	},
);

interface SourceParams {
	size: Dimension;
	fixed: Dimension;
}

const sourceSchema = toolSchema<SourceParams>({
	size: field.dimension({
		min: 1,
		max: 100,
		width: 1,
		height: 1,
		defaultFromSource: true,
	}),
	fixed: field.dimension({ min: 1, max: 100, width: 10, height: 20 }),
});

const source = { width: 64, height: 48 };

describe("registry-schema: schema defaults", () => {
	it("collects defaults of all fields", () => {
		expect(defaultSchemaParams(frameSchema)).toEqual({
			thickness: 5,
			color: "#000000",
			enabled: true,
			count: "two",
		});
	});
});

describe("registry-schema: withAspectLock", () => {
	const aspect = 64 / 48;

	it("leading width - height is recomputed", () => {
		expect(withAspectLock({ width: 32, height: 48 }, "width", aspect)).toEqual({
			width: 32,
			height: 24,
		});
	});

	it("leading height - width is recomputed", () => {
		expect(withAspectLock({ width: 64, height: 96 }, "height", aspect)).toEqual(
			{ width: 128, height: 96 },
		);
	});

	it("result never goes below 1", () => {
		expect(withAspectLock({ width: 1, height: 48 }, "width", aspect)).toEqual({
			width: 1,
			height: 1,
		});
	});
});

describe("registry-schema: maxFromSource", () => {
	const cropLike = toolSchema<{
		x: number;
		size: Dimension;
	}>({
		x: field.number({ min: 0, max: 20000, default: 0, maxFromSource: "width" }),
		size: field.dimension({
			min: 1,
			max: 20000,
			width: 1,
			height: 1,
			maxFromSource: true,
		}),
	});
	const img = { width: 832, height: 1216 };

	it("number clamps to the source size, not the static max", () => {
		const s = sanitizeSchemaParams(cropLike, { x: 5000 }, { source: img });
		expect(s.x).toBe(832);
	});

	it("dimension clamps to the source axes", () => {
		const s = sanitizeSchemaParams(
			cropLike,
			{ size: { width: 5000, height: 5000 } },
			{ source: img },
		);
		expect(s.size).toEqual({ width: 832, height: 1216 });
	});

	it("without a source - static max", () => {
		const s = sanitizeSchemaParams(cropLike, {
			x: 5000,
			size: { width: 5000, height: 5000 },
		});
		expect(s.x).toBe(5000);
		expect(s.size).toEqual({ width: 5000, height: 5000 });
	});

	it("maxMinus: cap = source minus constant (offset up to size-1)", () => {
		const offsetLike = toolSchema<{ x: number }>({
			x: field.number({
				min: 0,
				max: 20000,
				default: 0,
				maxFromSource: "width",
				maxMinus: 1,
			}),
		});
		const s = sanitizeSchemaParams(
			offsetLike,
			{ x: 5000 },
			{ source: { width: 832, height: 1216 } },
		);
		expect(s.x).toBe(831);
	});

	it("effectiveMax: no maxFromSource and no source - static max", () => {
		const plain = toolSchema<{ a: number; b: number }>({
			a: field.number({ min: 0, max: 100, default: 0 }),
			b: field.number({
				min: 0,
				max: 20000,
				default: 0,
				maxFromSource: "width",
			}),
		});
		const s = sanitizeSchemaParams(
			plain,
			{ a: 500, b: 5000 },
			{ source: { width: 832, height: 1216 } },
		);
		expect(s.a).toBe(100);
		const noSource = sanitizeSchemaParams(plain, { b: 5000 });
		expect(noSource.b).toBe(5000);
	});

	it("clampSourceAwareMaxes: no source and no changes - same params", () => {
		const noSource = clampSourceAwareMaxes(cropLike, { x: 5000 });
		expect(noSource).toEqual({ x: 5000 });
		const untouched = clampSourceAwareMaxes(
			cropLike,
			{ x: "garbage", size: { width: 100, height: 100 } },
			img,
		);
		expect(untouched).toEqual({
			x: "garbage",
			size: { width: 100, height: 100 },
		});
	});

	it("clampSourceAwareMaxes: dimension with garbage is passed through", () => {
		const out = clampSourceAwareMaxes(
			cropLike,
			{ size: "not-an-object" as unknown as Dimension },
			img,
		);
		expect(out).toEqual({ size: "not-an-object" });
	});
});

describe("registry-schema: source-aware dimension defaults", () => {
	it("uses static fallback before a source exists", () => {
		expect(defaultSchemaParams(sourceSchema)).toEqual({
			size: { width: 1, height: 1 },
			fixed: { width: 10, height: 20 },
		});
	});

	it("uses source dimensions for opted-in fields only", () => {
		expect(defaultSchemaParams(sourceSchema, { source })).toEqual({
			size: source,
			fixed: { width: 10, height: 20 },
		});
		expect(
			applySourceDefaults(
				sourceSchema,
				{ size: { width: 2, height: 3 }, fixed: { width: 30, height: 40 } },
				{ source },
			),
		).toEqual({
			size: source,
			fixed: { width: 30, height: 40 },
		});
	});

	it("touched fields are not overwritten by source defaults", () => {
		const manual = { size: { width: 5, height: 6 } };
		expect(
			applySourceDefaults(sourceSchema, manual, { source }, new Set(["size"])),
		).toEqual({
			size: { width: 5, height: 6 },
			fixed: { width: 10, height: 20 },
		});
	});

	it("uses source dimensions when sanitizing missing values", () => {
		expect(sanitizeSchemaParams(sourceSchema, {}, { source })).toEqual({
			size: source,
			fixed: { width: 10, height: 20 },
		});
		const manual = sanitizeSchemaParams(
			sourceSchema,
			{ size: { width: 12, height: 13 } },
			{ source },
		);
		expect(manual.size).toEqual({ width: 12, height: 13 });
		const sentinel = sanitizeSchemaParams(
			sourceSchema,
			{ size: { width: 0, height: 0 } },
			{ source },
		);
		expect(sentinel.size).toEqual(source);
	});
});

describe("registry-schema: layout (schema.layout)", () => {
	it("toolSchema keeps field groups", () => {
		expect(frameSchema.layout).toEqual({
			groups: [{ title: "Frame", fields: ["thickness", "color"] }],
		});
	});

	it("schemas without layout do not add layout", () => {
		const plain = toolSchema<FrameParams>({
			thickness: field.slider({ min: 1, max: 500, default: 5 }),
			color: field.color({ default: "#000000" }),
			enabled: field.checkbox({ default: true }),
			count: field.select({
				default: "two",
				options: [
					{ value: "one", label: "One" },
					{ value: "two", label: "Two" },
				],
			}),
		});
		expect(plain.layout).toBeUndefined();
	});

	it("resolves named groups and the ungrouped tail", () => {
		expect(resolveLayoutGroups(frameSchema)).toEqual([
			{
				key: "Frame-0",
				title: "Frame",
				cols: 1,
				fields: ["thickness", "color"],
			},
			{ key: "__default", cols: 1, fields: ["enabled", "count"] },
		]);
	});

	it("drops unknown and duplicate fields, normalizes cols", () => {
		const schema = toolSchema<FrameParams>(
			{
				thickness: field.slider({ min: 1, max: 500, default: 5 }),
				color: field.color({ default: "#000000" }),
				enabled: field.checkbox({ default: true }),
				count: field.select({
					default: "two",
					options: [
						{ value: "one", label: "One" },
						{ value: "two", label: "Two" },
					],
				}),
			},
			{
				layout: {
					groups: [
						{
							title: "Duplicate",
							cols: 0,
							fields: ["thickness", "thickness", "missing"],
						},
						{ title: "Empty", fields: ["missing"] },
						{ cols: 3, fields: ["color"] },
					],
				},
			},
		);

		expect(resolveLayoutGroups(schema)).toEqual([
			{
				key: "Duplicate-0",
				title: "Duplicate",
				cols: 1,
				fields: ["thickness"],
			},
			{ key: "group-2", title: undefined, cols: 3, fields: ["color"] },
			{ key: "__default", cols: 1, fields: ["enabled", "count"] },
		]);
	});

	it("puts all fields without layout into the default group", () => {
		const plain = toolSchema<FrameParams>({
			thickness: field.slider({ min: 1, max: 500, default: 5 }),
			color: field.color({ default: "#000000" }),
			enabled: field.checkbox({ default: true }),
			count: field.select({
				default: "two",
				options: [
					{ value: "one", label: "One" },
					{ value: "two", label: "Two" },
				],
			}),
		});

		expect(resolveLayoutGroups(plain)).toEqual([
			{
				key: "__default",
				cols: 1,
				fields: ["thickness", "color", "enabled", "count"],
			},
		]);
	});
});

describe("registry-schema: sanitize", () => {
	it("passes valid values through", () => {
		const out = sanitizeSchemaParams(frameSchema, {
			thickness: 40,
			color: "#ff0000",
			enabled: false,
			count: "one",
		});
		expect(out).toEqual({
			thickness: 40,
			color: "#ff0000",
			enabled: false,
			count: "one",
		});
	});

	it("replaces garbage with defaults", () => {
		const out = sanitizeSchemaParams(frameSchema, {
			thickness: "abc",
			color: "not-a-color",
			enabled: "yes",
			count: "wat",
			extra: 123,
		});
		expect(out).toEqual({
			thickness: 5,
			color: "#000000",
			enabled: true,
			count: "two",
		});
	});

	it("clamps numeric fields to min/max", () => {
		const out = sanitizeSchemaParams(frameSchema, {
			thickness: 9999,
			color: "#000000",
			enabled: true,
			count: "two",
		});
		expect(out.thickness).toBe(500);
	});
});
