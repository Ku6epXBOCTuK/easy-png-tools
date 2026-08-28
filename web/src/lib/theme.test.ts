import { beforeEach, describe, expect, it, vi } from "vitest";
import { getTheme, initTheme, setTheme } from "./theme.svelte";

type Store = Record<string, string>;

function stubEnv(opts: { attr?: string; system?: boolean } = {}) {
	const store: Store = {};
	vi.stubGlobal("localStorage", {
		getItem: (k: string) => (k in store ? store[k] : null),
		setItem: (k: string, v: string) => {
			store[k] = v;
		},
	});
	const doc: {
		documentElement: { dataset: Record<string, string | undefined> };
	} = {
		documentElement: { dataset: {} },
	};
	if (opts.attr !== undefined) doc.documentElement.dataset.theme = opts.attr;
	vi.stubGlobal("document", doc);
	vi.stubGlobal("window", {
		matchMedia: (_q: string) => ({ matches: opts.system ?? false }),
	});
	return { store, doc };
}

beforeEach(() => {
	vi.unstubAllGlobals();
});

describe("initTheme", () => {
	it("доверяет атрибуту от анти-вспышки скрипта", () => {
		stubEnv({ attr: "dark" });
		initTheme();
		expect(getTheme()).toBe("dark");
	});

	it("без атрибута берёт системную тему", () => {
		stubEnv({ system: true });
		initTheme();
		expect(getTheme()).toBe("dark");
		stubEnv({ system: false });
		initTheme();
		expect(getTheme()).toBe("light");
	});

	it("мусорный атрибут игнорируется в пользу системной", () => {
		stubEnv({ attr: "sepia", system: false });
		initTheme();
		expect(getTheme()).toBe("light");
	});
});

describe("setTheme", () => {
	it("сохраняет выбор и применяет атрибут на html", () => {
		const { store, doc } = stubEnv({});
		initTheme();
		setTheme("dark");
		expect(store["theme"]).toBe("dark");
		expect(doc.documentElement.dataset.theme).toBe("dark");
		setTheme("light");
		expect(store["theme"]).toBe("light");
		expect(doc.documentElement.dataset.theme).toBe("light");
	});
});
