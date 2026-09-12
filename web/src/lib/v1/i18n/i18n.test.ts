import { beforeEach, describe, expect, it, vi } from "vitest";
import { getLocale, initLocale, setLocale } from "./locale.svelte";
import { interpolate, t } from "./t";
import { en } from "./en";

type Store = Record<string, string>;

function stubStorage(): { store: Store } {
	const store: Store = {};
	vi.stubGlobal("localStorage", {
		getItem: (k: string) => (k in store ? store[k] : null),
		setItem: (k: string, v: string) => {
			store[k] = v;
		},
	});
	vi.stubGlobal("window", {});
	return { store };
}

beforeEach(() => {
	setLocale("ru");
	delete (en.home as Record<string, string>).onlyEnKey;
	vi.unstubAllGlobals();
});

describe("t", () => {
	it("возвращает строку по точечному пути активной локали", () => {
		expect(t("header.workspace")).toBe("Рабочая область");
		setLocale("en");
		expect(t("header.catalog")).toBe("Catalog");
	});

	it("фолбэк на английскую базу, если в активной локали нет ключа", () => {
		(en.home as Record<string, string>).onlyEnKey = "Only English string";
		setLocale("ru");
		expect(t("home.onlyEnKey")).toBe("Only English string");
	});

	it("неизвестный путь возвращает сам путь", () => {
		expect(t("no.such.key")).toBe("no.such.key");
	});
});

describe("interpolate", () => {
	it("подставляет переменные в шаблон", () => {
		expect(interpolate("Шаг {n} из {total}", { n: 2, total: 5 })).toBe(
			"Шаг 2 из 5",
		);
	});

	it("оставляет плейсхолдер без переменной как есть", () => {
		expect(interpolate("Привет, {name}!", {})).toBe("Привет, {name}!");
	});

	it("без переменных возвращает строку без изменений", () => {
		expect(interpolate("Просто текст")).toBe("Просто текст");
	});
});

describe("персист локали", () => {
	it("initLocale читает сохранённый выбор", () => {
		const { store } = stubStorage();
		store["locale"] = "en";
		initLocale();
		expect(getLocale()).toBe("en");
	});

	it("initLocale игнорирует мусор в хранилище", () => {
		const { store } = stubStorage();
		store["locale"] = "fr";
		initLocale();
		expect(getLocale()).toBe("ru");
	});

	it("setLocale сохраняет выбор в localStorage", () => {
		const { store } = stubStorage();
		initLocale();
		setLocale("en");
		expect(store["locale"]).toBe("en");
		expect(getLocale()).toBe("en");
	});
});
