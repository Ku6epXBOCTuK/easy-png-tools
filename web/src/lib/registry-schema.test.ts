import { describe, expect, it } from "vitest";
import {
	applySourceDefaults,
	defaultSchemaParams,
	field,
	resolveLayoutGroups,
	sanitizeSchemaParams,
	toolSchema,
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

describe("registry-schema: дефолты из схемы", () => {
	it("собирает дефолты всех полей", () => {
		expect(defaultSchemaParams(frameSchema)).toEqual({
			thickness: 5,
			color: "#000000",
			enabled: true,
			count: "two",
		});
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

	it("touched-поля не перезаписываются source-дефолтами", () => {
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

describe("registry-schema: раскладка (schema.layout)", () => {
	it("toolSchema сохраняет группы полей", () => {
		expect(frameSchema.layout).toEqual({
			groups: [{ title: "Frame", fields: ["thickness", "color"] }],
		});
	});

	it("обе схемы без layout не добавляют layout", () => {
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

	it("разрешает named-группы и хвост без layout", () => {
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

	it("убирает неизвестные и повторные поля, нормализует cols", () => {
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

	it("складывает все поля без layout в default-группу", () => {
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

describe("registry-schema: санитайз", () => {
	it("пропускает валидные значения", () => {
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

	it("заменяет мусор дефолтами", () => {
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

	it("clamp-ит числовые поля к min/max", () => {
		const out = sanitizeSchemaParams(frameSchema, {
			thickness: 9999,
			color: "#000000",
			enabled: true,
			count: "two",
		});
		expect(out.thickness).toBe(500);
	});
});
