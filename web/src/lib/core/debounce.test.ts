import { afterEach, describe, expect, it, vi } from "vitest";
import { debounce } from "./debounce";

afterEach(() => {
	vi.useRealTimers();
});

describe("debounce", () => {
	it("coalesces calls until the deadline", () => {
		vi.useFakeTimers();
		const fn = vi.fn();
		const debounced = debounce(fn, 200);

		debounced();
		vi.advanceTimersByTime(199);
		debounced();
		vi.advanceTimersByTime(199);
		expect(fn).not.toHaveBeenCalled();

		vi.advanceTimersByTime(1);
		expect(fn).toHaveBeenCalledTimes(1);
	});

	it("cancels a pending call and can be scheduled again", () => {
		vi.useFakeTimers();
		const fn = vi.fn();
		const debounced = debounce(fn, 200);

		debounced();
		debounced.cancel();
		vi.advanceTimersByTime(200);
		expect(fn).not.toHaveBeenCalled();

		debounced();
		vi.advanceTimersByTime(200);
		expect(fn).toHaveBeenCalledTimes(1);
	});
});
