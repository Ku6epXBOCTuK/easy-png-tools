// Фаза B: CSS/визуальный аудит. Для каждого preview-маршрута снимает
// нормализованное дерево элементов с ВЫЧИСЛЕННЫМИ стилями (и геометрией)
// нашей страницы и соответствующего refs-html файла, выравнивает деревья
// по структуре (как в audit-dom — теги нормализованы, классы игнорируются,
// матчинг по ключу), и для совпавших узлов сравнивает стили + rect.
// Дополнительно сравнивает design-токены (CSS-переменные) light/dark.
// Запуск: pnpm refs-audit  (опции: --route <path> --ref <file> --no-serve --ours <url>)
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync, readdirSync } from "node:fs";
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

// Поля вычисленного стиля, которые сравниваем (визуально значимые).
const STYLE_FIELDS = [
	"fontFamily",
	"fontSize",
	"fontWeight",
	"fontStyle",
	"lineHeight",
	"letterSpacing",
	"textAlign",
	"textTransform",
	"color",
	"backgroundColor",
	"display",
	"flexDirection",
	"alignItems",
	"justifyContent",
	"gap",
	"gridTemplateColumns",
	"padding",
	"margin",
	"borderRadius",
	"borderTopWidth",
	"borderTopColor",
	"borderTopStyle",
	"width",
	"height",
	"boxShadow",
	"opacity",
];

// Динамические сегменты: явный список значений + сопоставление id → файл рефа.
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
				parts.pop();
				out.push(parts.length ? `/preview/${parts.join("/")}` : "/preview");
			}
		}
	};
	walk(base);
	return out;
}

function refsList() {
	try {
		return readdirSync(REFS_DIR).filter((f) => f.endsWith(".html"));
	} catch {
		return [];
	}
}
const refExists = (name) => refsList().includes(name);

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
			console.warn(`[css-audit] ref not found, skipped: ${route} -> ${ref}`);
			return;
		}
		seen.add(route);
		targets.push({ route, ref });
	};
	for (const route of discoverRoutes()) {
		if (route.includes("[")) continue;
		if (EXCLUDE.has(route)) {
			console.log(`[css-audit] excluded (no relevant ref): ${route}`);
			continue;
		}
		add(route, refNameFor(route));
	}
	for (const [seg, cfg] of Object.entries(DYNAMIC)) {
		for (const id of cfg.ids) {
			add(`/preview/${seg.replace("[id]", id)}`, cfg.refFor(id));
		}
	}
	const routed = new Set(targets.map((t) => t.ref));
	for (const f of refsList()) {
		if (!routed.has(f)) console.warn(`[css-audit] ref без маршрута: ${f}`);
	}
	return targets;
}

const waitFor = async (url, ms = 60000) => {
	const t = Date.now();
	while (Date.now() - t < ms) {
		try {
			const r = await fetch(url);
			if (r.ok) return;
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

// Теги-обёртки нормализуем к "box", чтобы выравнивать по сути, а не по
// конкретному тегу (наш div/main vs рефовый div/main). Семантические — как есть.
const STRUCT_TAGS = new Set([
	"div",
	"main",
	"section",
	"article",
	"aside",
	"ul",
	"li",
	"form",
	"fieldset",
]);
const normTag = (tag) => (STRUCT_TAGS.has(tag) ? "box" : tag);
const keyOf = (n) =>
	n.children.length === 0 ? `${normTag(n.tag)}|${n.text}` : normTag(n.tag);

const snapshot = (page) =>
	page.evaluate(
		(styleFields) => {
			const sig = (el) => {
				const s = getComputedStyle(el);
				const o = {};
				for (const f of styleFields) o[f] = s[f];
				return o;
			};
			const rectOf = (el) => {
				const r = el.getBoundingClientRect();
				return {
					x: Math.round(r.x),
					y: Math.round(r.y),
					w: Math.round(r.width),
					h: Math.round(r.height),
				};
			};
			const readTokens = () => {
				const s = getComputedStyle(document.documentElement);
				const out = {};
				for (const k of s) if (k.startsWith("--")) out[k] = s.getPropertyValue(k).trim();
				return out;
			};
			const tokensLight = readTokens();
			const prev = document.documentElement.getAttribute("data-theme");
			document.documentElement.setAttribute("data-theme", "dark");
			const tokensDark = readTokens();
			if (prev) document.documentElement.setAttribute("data-theme", prev);
			else document.documentElement.removeAttribute("data-theme");

			const walk = (el) => {
				const tag = el.tagName.toLowerCase();
				if (["script", "style", "noscript", "template"].includes(tag)) return null;
				if (el.id === "svelte-announcer") return null;
				if (el.hasAttribute("hidden")) return null;
				const cs = getComputedStyle(el);
				if (cs.display === "none" || cs.visibility === "hidden") return null;
				let ownText = "";
				for (const c of el.childNodes)
					if (c.nodeType === 3) ownText += c.textContent;
				ownText = ownText.replace(/\s+/g, " ").trim();
				const node = {
					tag,
					text: ownText,
					style: sig(el),
					rect: rectOf(el),
					children: [],
				};
				if (tag === "svg") return node;
				for (const child of el.children) {
					const cn = walk(child);
					if (cn) node.children.push(cn);
				}
				return node;
			};
			return { tokensLight, tokensDark, tree: walk(document.body) };
		},
		STYLE_FIELDS,
	);

const TOK_NOISE = /^(--tw-|--lightningcss-|--default-)/;

function compareStyle(ours, ref, path, out) {
	if (!ours || !ref) return;
	if (ours.tag !== ref.tag) {
		out.push({ path, type: "tagMismatch", ours: ours.tag, ref: ref.tag });
		return;
	}
	if (ours.text && ref.text && ours.text !== ref.text) {
		out.push({ path, type: "textMismatch", ours: ours.text, ref: ref.text });
	}
	const deltas = {};
	for (const f of STYLE_FIELDS) {
		const ov = (ours.style[f] ?? "").toString();
		const rv = (ref.style[f] ?? "").toString();
		if (ov !== rv) deltas[f] = { ours: ov, ref: rv };
	}
	const dr = ours.rect;
	const rr = ref.rect;
	if (
		Math.abs(dr.x - rr.x) > 2 ||
		Math.abs(dr.y - rr.y) > 2 ||
		Math.abs(dr.w - rr.w) > 2 ||
		Math.abs(dr.h - rr.h) > 2
	)
		deltas.rect = { ours: dr, ref: rr };
	if (Object.keys(deltas).length)
		out.push({ path, type: "style", tag: ours.tag, text: ours.text, deltas });

	// Выравниваем детей по ключу (жадно), рекурсивно сравнивая стили.
	const bByKey = new Map();
	ref.children.forEach((c, idx) => {
		const k = keyOf(c);
		if (!bByKey.has(k)) bByKey.set(k, []);
		bByKey.get(k).push(idx);
	});
	const used = new Set();
	for (let i = 0; i < ours.children.length; i++) {
		const aNode = ours.children[i];
		const cands = bByKey.get(keyOf(aNode));
		let bIdx = -1;
		if (cands) for (const ci of cands) if (!used.has(ci)) { bIdx = ci; break; }
		if (bIdx >= 0) {
			used.add(bIdx);
			compareStyle(aNode, ref.children[bIdx], `${path} > ${aNode.tag}:${i + 1}`, out);
		} else {
			out.push({ path: `${path} > ${aNode.tag}:${i + 1}`, type: "added", tag: aNode.tag });
		}
	}
	for (let j = 0; j < ref.children.length; j++) {
		if (used.has(j)) continue;
		out.push({
			path: `${path} > ${ref.children[j].tag}:${j + 1}`,
			type: "removed",
			tag: ref.children[j].tag,
		});
	}
}

function tokDiff(a, b) {
	const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
	const rows = [];
	for (const k of keys) {
		if (TOK_NOISE.test(k)) continue;
		const av = a[k] ?? "—";
		const bv = b[k] ?? "—";
		if (av !== bv) rows.push({ key: k, ours: av, ref: bv });
	}
	return rows;
}

async function auditOne(browser, target) {
	const oursUrl = args.ours || `http://127.0.0.1:${PORT}${target.route}`;

	const page = await browser.newPage({
		viewport: { width: 1440, height: 900 },
		deviceScaleFactor: 1,
	});
	await page.goto(oursUrl, { waitUntil: "load" });
	await page.evaluate(() => document.fonts.ready);
	// Рефы — только светлые; наше приложение по умолчанию может рендерить
	// тёмную тему (app.html смотрит prefers-color-scheme). Нормализуем ОБЕ
	// стороны к light, чтобы аудит мерил реальные расхождения дизайна, а не
	// инверсию темы.
	await page.evaluate(() => {
		document.documentElement.dataset.theme = "light";
	});
	await page.waitForTimeout(500);
	const ours = await snapshot(page);
	await page.close();

	// Реф грузим в ИЗОЛИРОВАННОМ контексте через goto(file://): переход
	// http → file в одной странице уничтожает execution context и роняет прогон.
	const refUrl = "file:///" + resolve(REFS_DIR, target.ref).replace(/\\/g, "/");
	const ctx = await browser.newContext();
	const refPage = await ctx.newPage();
	await refPage.goto(refUrl, { waitUntil: "load" });
	await refPage.evaluate(() => document.fonts.ready);
	await refPage.evaluate(() => {
		document.documentElement.dataset.theme = "light";
	});
	await refPage.waitForTimeout(400);
	const ref = await snapshot(refPage);
	await ctx.close();

	const deltas = [];
	compareStyle(ours.tree, ref.tree, "body", deltas);
	const tokenDiffs = {
		light: tokDiff(ours.tokensLight, ref.tokensLight),
		dark: tokDiff(ours.tokensDark, ref.tokensDark),
	};
	return {
		route: target.route,
		ref: target.ref,
		deltas,
		tokenDiffs,
		counts: tally(deltas, tokenDiffs),
	};
}

function tally(deltas, tokenDiffs) {
	const c = {
		tagMismatch: 0,
		textMismatch: 0,
		added: 0,
		removed: 0,
		styleDiffs: 0,
		rectDiffs: 0,
		fieldDiffs: 0,
	};
	for (const d of deltas) {
		if (d.type === "style") {
			c.styleDiffs++;
			c.fieldDiffs += Object.keys(d.deltas).length;
			if (d.deltas.rect) c.rectDiffs++;
		} else if (d.type in c) c[d.type]++;
	}
	return {
		...c,
		tokenLight: tokenDiffs.light.length,
		tokenDark: tokenDiffs.dark.length,
	};
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
		`# CSS audit (phase B)\n\n_${new Date().toISOString()}_\n\n` +
		`## Сводка\n\n| route | ref | tokL | tokD | style (el) | fields | rect | +struct | -struct | tag | text |\n|---|---|---|---|---|---|---|---|---|---|---|\n` +
		reports
			.map(
				(r) =>
					`| \`${r.route}\` | ${r.ref} | ${r.counts.tokenLight} | ${r.counts.tokenDark} | ${r.counts.styleDiffs} | ${r.counts.fieldDiffs} | ${r.counts.rectDiffs} | ${r.counts.added} | ${r.counts.removed} | ${r.counts.tagMismatch} | ${r.counts.textMismatch} |`,
			)
			.join("\n");
	const sections = reports
		.map((r) => {
			const styleDiffs = r.deltas.filter((d) => d.type === "style");
			const sorted = [...styleDiffs].sort(
				(x, y) => Object.keys(y.deltas).length - Object.keys(x.deltas).length,
			);
			const els = sorted.length
				? sorted.slice(0, 150).map(elBlock).join("\n\n")
				: "_расхождений стилей нет_";
			const struct = r.deltas
				.filter((d) => d.type !== "style")
				.map((d) => `- \`${d.path}\` — **${d.type}**${d.tag ? ` (${d.tag})` : ""}`)
				.join("\n");
			return (
				`\n\n## ${r.route}  (vs ${r.ref})\n\n` +
				`- Токены light: **${r.counts.tokenLight}**, dark: **${r.counts.tokenDark}**\n` +
				`- Стиль-расхождений: **${r.counts.styleDiffs}** элементов / **${r.counts.fieldDiffs}** полей (из них геометрия: ${r.counts.rectDiffs})\n` +
				`- Структурные: +${r.counts.added} / -${r.counts.removed} / tag ${r.counts.tagMismatch} / text ${r.counts.textMismatch}\n\n` +
				`### Токены — Light\n\n${tokTable(r.tokenDiffs.light)}\n\n` +
				`### Токены — Dark\n\n${tokTable(r.tokenDiffs.dark)}\n\n` +
				`### Расхождения стилей (топ ${Math.min(150, sorted.length)})\n\n${els}\n\n` +
				`### Структурные расхождения\n\n` +
				(struct || "_—_")
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
	console.log(`[css-audit] targets: ${targets.map((t) => t.route).join(", ")}`);

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
	const reports = [];
	try {
		for (const target of targets) {
			try {
				const rep = await auditOne(browser, target);
				reports.push(rep);
				console.log(
					`[css-audit] ${rep.route}: tokL=${rep.counts.tokenLight} tokD=${rep.counts.tokenDark} style=${rep.counts.styleDiffs} fields=${rep.counts.fieldDiffs} rect=${rep.counts.rectDiffs} +struct=${rep.counts.added} -struct=${rep.counts.removed}`,
				);
			} catch (e) {
				console.error(`[css-audit] ${target.route} failed: ${e.message}`);
			}
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
					spawn("taskkill", ["/pid", String(server.pid), "/f", "/t"], { stdio: "ignore" });
				else server.kill("SIGTERM");
			} catch {}
		}
	}
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
