import { describe, expect, it } from "vitest";
import { formatStamp } from "./datefmt";

const d = new Date(2026, 7, 25, 9, 5, 3);

describe("formatStamp", () => {
	it("expands all base tokens", () => {
		expect(formatStamp(d, "YYYY-MM-DD hh:mm:ss")).toBe("2026-08-25 09:05:03");
	});

	it("arbitrary text between tokens is preserved", () => {
		expect(formatStamp(d, "DD.MM.YYYY")).toBe("25.08.2026");
		expect(formatStamp(d, "YYYY year, MM month")).toBe("2026 year, 08 month");
	});

	it("unknown sequences are left alone", () => {
		expect(formatStamp(d, "YYYYYY MMX")).toBe("2026YY 08X");
	});
});
