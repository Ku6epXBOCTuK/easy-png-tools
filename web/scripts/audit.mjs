// Стиль-аудит: для каждого preview-маршрута снимает design-токены (light/dark)
// и дерево вычисленных стилей нашей страницы и соответствующей refs-html
// страницы, сравнивает и пишет сводный отчёт.
// Запуск: pnpm audit  (опции: --route <path> --ref <file> --no-serve --ours <url>)
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve, join } from "node:path";

const args = (() => {
	const a = {};
	for (let i = 0; i < process.argv.length; i++) {
		const v = process.argv[i];
		if (v === "--no-serve") a.noServe = true;
		else if (v === "--ours") a.ours = process.argv[++i];
		else if (v === "--ref") a.ref = process.argv[++i];
		else if (v === "--route") a.route = process.argv[++i];
	}
	return a;
})();

const WEB = process.cwd();
const PORT = 5179;
const REFS_DIR = resolve(WEB, "../refs-html");

const FIELDS = [
	"fontFamily",
	"fontSize",
	"fontWeight",
	"color",
	"backgroundColor",
	"border",
	"padding",
	"margin",
	"letterSpacing",
	"lineHeight",
	"borderRadius",
	"display",
	"gap",
];

// Динамические сегменты: явный список значений + сопоставление id → файл рефа
// (id инструмента в registry.ts не совпадает с именем refs-html-файла).
const DYNAMIC = {
	"tools/[id]": {
		ids: ["linear-gradient-png", "remove-background-png"],
		refFor: (id) =>
			id === "linear-gradient-png"
				? "gradient.html"
				: id === "remove-background-png"
					? "background-remover.html"
					: null,
	},
};

// Маршруты, которые не с чем сравнивать (нет релевантного рефа). Например,
// `/preview` (индекс/воркспейс) в нашем приложении — своя страница, а
// `refs-html/index.html` — это зеркало demo из Next-рефа, не его реф.
const EXCLUDE = new Set(["/preview"]);

const refNameFor = (route) => {
	if (route === "/preview") return "index.html";
	const last = route.split("/").filter(Boolean).pop();
	return `${last}.html`;
};

function discoverRoutes() {
	const base = resolve(WEB, "src/routes/preview");
	const out = [];
	const walk = (dir) => {
		let ents;
		try {
			ents = readdirSync(dir, { withFileTypes: true });
		} catch {
			return;
		}
		for (const e of ents) {
			const p = join(dir, e.name);
			if (e.isDirectory()) walk(p);
			else if (e.name === "+page.svelte") {
				const rel = p.slice(base.length).replace(/\\/g, "/");
				const parts = rel.split("/").filter(Boolean);
				parts.pop(); // +page.svelte
				out.push(parts.length ? `/preview/${parts.join("/")}` : "/preview");
			}
		}
	};
	walk(base);
	return out;
}

function buildTargets() {
	if (args.route) {
		const ref = args.ref || refNameFor(args.route);
		return [{ route: args.route, ref }];
	}
	const targets = [];
	const seen = new Set();
	const add = (route, ref) => {
		if (!ref || seen.has(route)) return;
		if (!refExists(ref)) {
			console.warn(`[audit] ref not found, skipped: ${route} -> ${ref}`);
			return;
		}
		seen.add(route);
		targets.push({ route, ref });
	};
	for (const route of discoverRoutes()) {
		if (route.includes("[")) continue; // динамика — ниже
		if (EXCLUDE.has(route)) {
			console.log(`[audit] excluded (no relevant ref): ${route}`);
			continue;
		}
		add(route, refNameFor(route));
	}
	for (const [seg, cfg] of Object.entries(DYNAMIC)) {
		for (const id of cfg.ids) {
			add(`/preview/${seg.replace("[id]", id)}`, cfg.refFor(id));
		}
	}
	// Рефы без маршрута — просто сообщаем, не падаем.
	const routed = new Set(targets.map((t) => t.ref));
	for (const f of refsList()) {
		if (!routed.has(f)) console.warn(`[audit] ref без маршрута: ${f}`);
	}
	return targets;
}

function refsList() {
	try {
		return readdirSync(REFS_DIR).filter((f) => f.endsWith(".html"));
	} catch {
		return [];
	}
}
function refExists(name) {
	return refsList().includes(name);
}

const waitFor = async (url, ms = 60000) => {
	const t = Date.now();
	while (Date.now() - t < ms) {
		try {
			const r = await fetch(url);
			if (r.ok) return;
			// Сервер уже отвечает, но страница упала (4xx/5xx) — ждать 200
			// бессмысленно: сообщаем явно вместо таймаута "dev server not up".
			if (r.status >= 400) {
				throw new Error(
					`route ${url} returned HTTP ${r.status} (server is up, page failed to render)`,
				);
			}
		} catch (e) {
			if (e instanceof Error && e.message.includes("returned HTTP")) throw e;
		}
		await new Promise((r) => setTimeout(r, 500));
	}
	throw new Error("dev server not up: " + url);
};

const snapshot = (page, url) =>
	page.evaluate((url) => {
		const readTokens = () => {
			const s = getComputedStyle(document.documentElement);
			const out = {};
			for (const k of s)
				if (k.startsWith("--")) out[k] = s.getPropertyValue(k).trim();
			return out;
		};
		const tokensLight = readTokens();
		const prev = document.documentElement.getAttribute("data-theme");
		document.documentElement.setAttribute("data-theme", "dark");
		const tokensDark = readTokens();
		if (prev) document.documentElement.setAttribute("data-theme", prev);
		else document.documentElement.removeAttribute("data-theme");

		const sig = (el) => {
			const s = getComputedStyle(el);
			const o = {};
			for (const f of [
				"fontFamily",
				"fontSize",
				"fontWeight",
				"color",
				"backgroundColor",
				"borderTopWidth",
				"borderTopColor",
				"padding",
				"margin",
				"letterSpacing",
				"lineHeight",
				"borderRadius",
				"display",
				"gap",
			])
				o[f] = s[f];
			return o;
		};
		const rect = (el) => {
			const r = el.getBoundingClientRect();
			return {
				x: Math.round(r.x),
				y: Math.round(r.y),
				w: Math.round(r.width),
				h: Math.round(r.height),
			};
		};
		const walk = (el, path) => {
			if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(el.tagName)) return [];
			const out = [];
			const kids = [...el.children];
			out.push({
				path,
				tag: el.tagName.toLowerCase(),
				text:
					el.children.length === 0 ? el.textContent.trim().slice(0, 40) : "",
				rect: rect(el),
				style: sig(el),
			});
			for (let i = 0; i < kids.length; i++)
				out.push(
					...walk(
						kids[i],
						`${path}>${kids[i].tagName.toLowerCase()}:nth-child(${i + 1})`,
					),
				);
			return out;
		};
		return { tokensLight, tokensDark, tree: walk(document.body, "body") };
	}, url);

const TOK_NOISE = /^(--tw-|--lightningcss-|--default-)/;

function diffPair(ours, ref) {
	const tokDiff = (a, b) => {
		const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
		const rows = [];
		for (const k of keys) {
			if (TOK_NOISE.test(k)) continue;
			const av = a[k] ?? "—";
			const bv = b[k] ?? "—";
			if (av !== bv) rows.push({ key: k, ours: av, ref: bv });
		}
		return rows;
	};
	const tokenDiffs = {
		light: tokDiff(ours.tokensLight, ref.tokensLight),
		dark: tokDiff(ours.tokensDark, ref.tokensDark),
	};

	const byText = (tree) => {
		const m = new Map();
		for (const e of tree) if (e.text) if (!m.has(e.text)) m.set(e.text, e);
		return m;
	};
	const txtO = byText(ours.tree);
	const txtR = byText(ref.tree);
	const onlyOurs = [];
	const onlyRef = [];
	const elementDiffs = [];
	for (const [k, o] of txtO) {
		const r = txtR.get(k);
		if (!r) {
			onlyOurs.push(k);
			continue;
		}
		const deltas = {};
		for (const f of FIELDS) {
			const ov = (o.style[f] ?? "").toString();
			const rv = (r.style[f] ?? "").toString();
			if (ov !== rv) deltas[f] = { ours: ov, ref: rv };
		}
		const dr = o.rect;
		const rr = r.rect;
		if (
			Math.abs(dr.x - rr.x) > 2 ||
			Math.abs(dr.y - rr.y) > 2 ||
			Math.abs(dr.w - rr.w) > 2 ||
			Math.abs(dr.h - rr.h) > 2
		)
			deltas.rect = { ours: dr, ref: rr };
		if (Object.keys(deltas).length)
			elementDiffs.push({ path: o.path, tag: o.tag, text: k, deltas });
	}
	for (const [k] of txtR) if (!txtO.has(k)) onlyRef.push(k);

	return {
		tokenDiffs,
		elementDiffs,
		onlyOurs: onlyOurs.slice(0, 60),
		onlyRef: onlyRef.slice(0, 60),
		counts: {
			tokenLight: tokenDiffs.light.length,
			tokenDark: tokenDiffs.dark.length,
			elements: elementDiffs.length,
			onlyOurs: onlyOurs.length,
			onlyRef: onlyRef.length,
		},
	};
}

async function auditOne(page, target) {
	const oursUrl = args.ours || `http://127.0.0.1:${PORT}${target.route}`;
	const refUrl = pathToFileURL(resolve(REFS_DIR, target.ref)).href;

	await page.goto(oursUrl, { waitUntil: "load" });
	await page.evaluate(() => document.fonts.ready);
	await page.waitForTimeout(300);
	const ours = await snapshot(page, oursUrl);

	await page.goto(refUrl, { waitUntil: "load" });
	await page.evaluate(() => document.fonts.ready);
	await page.waitForTimeout(300);
	const ref = await snapshot(page, refUrl);

	const diff = diffPair(ours, ref);
	return { route: target.route, ref: target.ref, ...diff };
}

function toMarkdown(reports) {
	const tokTable = (rows) =>
		rows.length
			? `| token | ours | ref |\n|---|---|---|\n` +
				rows.map((r) => `| \`${r.key}\` | ${r.ours} | ${r.ref} |`).join("\n")
			: "_все совпадают_";
	const elBlock = (el) => {
		const d = Object.entries(el.deltas)
			.map(([k, v]) => {
				if (k === "rect") {
					const f = (r) => `${r.x},${r.y} ${r.w}x${r.h}`;
					return `    - **rect**: \`${f(v.ours)}\` → \`${f(v.ref)}\``;
				}
				return `    - **${k}**: \`${v.ours}\` → \`${v.ref}\``;
			})
			.join("\n");
		return `### \`${el.path}\`${el.text ? ` — "${el.text}"` : ""}\n${d}`;
	};
	const summary =
		`# Style audit (multi-route)\n\n_${new Date().toISOString()}_\n\n` +
		`## Сводка\n\n| route | ref | tokL | tokD | els | onlyOurs | onlyRef |\n|---|---|---|---|---|---|---|\n` +
		reports
			.map(
				(r) =>
					`| \`${r.route}\` | ${r.ref} | ${r.counts.tokenLight} | ${r.counts.tokenDark} | ${r.counts.elements} | ${r.counts.onlyOurs} | ${r.counts.onlyRef} |`,
			)
			.join("\n");
	const sections = reports
		.map((r) => {
			const sorted = [...r.elementDiffs].sort(
				(x, y) => Object.keys(y.deltas).length - Object.keys(x.deltas).length,
			);
			const els = sorted.length
				? sorted.slice(0, 100).map(elBlock).join("\n\n")
				: "_расхождений нет_";
			return (
				`\n\n## ${r.route}  (vs ${r.ref})\n\n` +
				`- Токены light: **${r.counts.tokenLight}**, dark: **${r.counts.tokenDark}**\n` +
				`- Элементы: **${r.counts.elements}**, только у нас: ${r.counts.onlyOurs}, только в рефе: ${r.counts.onlyRef}\n\n` +
				`### Токены — Light\n\n${tokTable(r.tokenDiffs.light)}\n\n` +
				`### Токены — Dark\n\n${tokTable(r.tokenDiffs.dark)}\n\n` +
				`### Расхождения элементов (топ ${Math.min(100, sorted.length)})\n\n${els}\n\n` +
				`### Только у нас\n\n` +
				(r.onlyOurs.length ? r.onlyOurs.map((p) => `- \`${p}\``).join("\n") : "_—_") +
				`\n\n### Только в рефе\n\n` +
				(r.onlyRef.length ? r.onlyRef.map((p) => `- \`${p}\``).join("\n") : "_—_")
			);
		})
		.join("\n");
	return summary + sections + "\n";
}

async function main() {
	const targets = buildTargets();
	if (!targets.length) {
		console.error("no audit targets (refs-html/*.html missing?)");
		process.exit(1);
	}
	console.log(
		`[audit] targets: ${targets.map((t) => t.route).join(", ")}`,
	);

	let server;
	if (!args.noServe) {
		const bin = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
		server = spawn(bin, ["dev", "--port", String(PORT), "--strictPort"], {
			cwd: WEB,
			stdio: "ignore",
			shell: true,
			detached: process.platform !== "win32",
		});
		await waitFor(args.ours || `http://127.0.0.1:${PORT}${targets[0].route}`);
	}

	const browser = await chromium.launch();
	const page = await browser.newPage({
		viewport: { width: 1440, height: 900 },
		deviceScaleFactor: 1,
	});
	const reports = [];
	try {
		for (const target of targets) {
			const rep = await auditOne(page, target);
			reports.push(rep);
			console.log(
				`[audit] ${rep.route}: tokL=${rep.counts.tokenLight} tokD=${rep.counts.tokenDark} els=${rep.counts.elements} onlyOurs=${rep.counts.onlyOurs} onlyRef=${rep.counts.onlyRef}`,
			);
		}
		mkdirSync(resolve(WEB, "audit"), { recursive: true });
		writeFileSync(
			resolve(WEB, "audit/audit-report.json"),
			JSON.stringify({ generatedAt: new Date().toISOString(), reports }, null, 2),
		);
		writeFileSync(resolve(WEB, "audit/audit-report.md"), toMarkdown(reports));
		console.log(`report: web/audit/audit-report.md`);
	} finally {
		await browser.close();
		if (server) {
			try {
				if (process.platform === "win32")
					spawn("taskkill", ["/pid", String(server.pid), "/f", "/t"], {
						stdio: "ignore",
					});
				else server.kill("SIGTERM");
			} catch {}
		}
	}
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
