import { describe, expect, it } from "vitest";
import {
	defaultSchemaParams,
	field,
	sanitizeSchemaParams,
	toolSchema,
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
	{ layout: { group: "frame", cols: 2 }, label: "Frame" },
);

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
