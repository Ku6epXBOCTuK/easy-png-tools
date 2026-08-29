// Фаза A: структурный (DOM) аудит. Для каждого preview-маршрута снимает
// нормализованное дерево элементов нашей страницы и соответствующего refs-html
// файла, сравнивает по структурному пути (без IGNORE) и пишет отчёт о
// расхождениях (added / removed / tagMismatch / textMismatch).
// Запуск: pnpm refs-dom-audit  (опции: --route <path> --ref <file> --no-serve --ours <url>)
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
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

// Маршруты без релевантного рефа (refs-html/index.html — зеркало demo из Next, не реф).
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
function refExists(name) {
	return refsList().includes(name);
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
			console.warn(`[dom-audit] ref not found, skipped: ${route} -> ${ref}`);
			return;
		}
		seen.add(route);
		targets.push({ route, ref });
	};
	for (const route of discoverRoutes()) {
		if (route.includes("[")) continue;
		if (EXCLUDE.has(route)) {
			console.log(`[dom-audit] excluded (no relevant ref): ${route}`);
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
		if (!routed.has(f)) console.warn(`[dom-audit] ref без маршрута: ${f}`);
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

// Нормализованное дерево элементов: тег, отсортированные классы, собственный
// текст (без SVG-иконок), дети. Пропускаем служебное; SVG не спускаемся внутрь.
const snapshot = (page) =>
	page.evaluate(() => {
		const walk = (el) => {
			const tag = el.tagName.toLowerCase();
			if (["script", "style", "noscript", "template"].includes(tag)) return null;
			// SvelteKit ін'єктить #svelte-announcer (aria-live) прямо в <body>;
			// у рефа (Next.js) його немає — це фреймворк-шум, не збіг дизайну.
			if (el.id === "svelte-announcer") return null;
			// Пропускаем не отображаемые узлы (Next-боилерплейт: <div hidden>,
			// оверлеи), чтобы они не конкурировали за матчинг с реальным контентом.
			if (el.hasAttribute("hidden")) return null;
			const cs = getComputedStyle(el);
			if (cs.display === "none" || cs.visibility === "hidden") return null;
			const classes = [...el.classList].sort();
			let ownText = "";
			for (const c of el.childNodes)
				if (c.nodeType === 3) ownText += c.textContent;
			ownText = ownText.replace(/\s+/g, " ").trim();
			const node = { tag, classes, ownText, children: [] };
			if (tag === "svg") return node;
			for (const child of el.children) {
				const cn = walk(child);
				if (cn) node.children.push(cn);
			}
			return node;
		};
		return walk(document.body);
	});

// Ключ сопоставления: тег + собственный текст (классы НЕ входят — у нас свои
// имена по решению №2). Чисто-структурные обёртки (div/main/section/…)
// нормализуем к общему токену, чтобы выравнивать дерево по сути, а не по
// конкретному тегу оболочки (наш `.preview-root`/div vs рефовый `main`/`.app-shell`).
// Семантические теги (header/footer/nav/span/button…) оставляем как есть.
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
// Контейнеры (есть дочерние элементы) матчим по тегу, игнорируя собственный
// текст — иначе малейшее отличие текста в обёртке каскадом роняет всё поддерево.
// Листья (нет дочерних элементов) матчим по тегу + тексту.
const keyOf = (n) =>
	n.children.length === 0
		? `${normTag(n.tag)}|${n.ownText}`
		: normTag(n.tag);

function subtreeCount(node) {
	let c = 1;
	for (const c0 of node.children) c += subtreeCount(c0);
	return c;
}
// Несовпавшее поддерево — одна запись с числом узлов, без рекурсивного
// засорения отчёта. (Каскад внутри уже учтён как один факт расхождения.)
function reportUnmatched(node, path, type, out) {
	out.push({
		path,
		type,
		tag: node.tag,
		text: node.ownText,
		nodes: subtreeCount(node),
	});
}

function diffNodes(a, b, path, out) {
	if (a.tag !== b.tag)
		out.push({ path, type: "tagMismatch", ours: a.tag, ref: b.tag });
	if (a.ownText !== b.ownText)
		out.push({ path, type: "textMismatch", ours: a.ownText, ref: b.ownText });
	matchChildren(a.children, b.children, path, out);
}

// Выравниваем детей по ключу (жадно, в порядке), чтобы одно расхождение не
// каскадировало на всех потомков. Несовпавшие — added/removed целиком поддеревом.
function matchChildren(ac, bc, path, out) {
	const bByKey = new Map();
	bc.forEach((c, idx) => {
		const k = keyOf(c);
		if (!bByKey.has(k)) bByKey.set(k, []);
		bByKey.get(k).push(idx);
	});
	const used = new Set();
	for (let i = 0; i < ac.length; i++) {
		const aNode = ac[i];
		const k = keyOf(aNode);
		const cands = bByKey.get(k);
		let bIdx = -1;
		if (cands) for (const ci of cands) if (!used.has(ci)) { bIdx = ci; break; }
		if (bIdx >= 0) {
			used.add(bIdx);
			diffNodes(aNode, bc[bIdx], `${path} > ${aNode.tag}:${i + 1}`, out);
		} else {
			reportUnmatched(aNode, `${path} > ${aNode.tag}:${i + 1}`, "added", out);
		}
	}
	for (let j = 0; j < bc.length; j++) {
		if (used.has(j)) continue;
		reportUnmatched(bc[j], `${path} > ${bc[j].tag}:${j + 1}`, "removed", out);
	}
}

// Точка входа: сравниваем деревья от body.
function diff(ours, ref, path, out) {
	if (!ours || !ref) return;
	diffNodes(ours, ref, path, out);
}

function tally(deltas) {
	const c = { added: 0, removed: 0, tagMismatch: 0, textMismatch: 0, nodesAdded: 0, nodesRemoved: 0 };
	for (const d of deltas) {
		if (d.type in c) c[d.type]++;
		if (d.type === "added") c.nodesAdded += d.nodes ?? 1;
		if (d.type === "removed") c.nodesRemoved += d.nodes ?? 1;
	}
	return c;
}

async function auditOne(browser, target) {
	const oursUrl = args.ours || `http://127.0.0.1:${PORT}${target.route}`;

	const page = await browser.newPage({
		viewport: { width: 1440, height: 900 },
		deviceScaleFactor: 1,
	});
	await page.goto(oursUrl, { waitUntil: "load" });
	await page.waitForTimeout(600);
	const ours = await snapshot(page);
	await page.close();

	// Реф грузим через goto(file://) в ИЗОЛИРОВАННОМ контексте: так http-страница
	// и статический реф не делят один execution context (переход http → file в
	// одной странице уничтожал контекст и ронял прогон). setContent не годится —
	// он не воспроизводит DOM рефа (губит 1 узел), поэтому используем goto.
	const refUrl = "file:///" + resolve(REFS_DIR, target.ref).replace(/\\/g, "/");
	const ctx = await browser.newContext();
	const refPage = await ctx.newPage();
	await refPage.goto(refUrl, { waitUntil: "load" });
	await refPage.waitForTimeout(400);
	const ref = await snapshot(refPage);
	await ctx.close();

	const deltas = [];
	diff(ours, ref, "body", deltas);
	return {
		route: target.route,
		ref: target.ref,
		deltas,
		counts: tally(deltas),
	};
}

function toMarkdown(reports) {
	const summary =
		`# DOM audit (phase A)\n\n_${new Date().toISOString()}_\n\n` +
		`## Сводка\n\n| route | ref | added | removed | tag | text |\n|---|---|---|---|---|---|\n` +
		reports
			.map(
				(r) =>
					`| \`${r.route}\` | ${r.ref} | ${r.counts.added} | ${r.counts.removed} | ${r.counts.tagMismatch} | ${r.counts.textMismatch} |`,
			)
			.join("\n");
	const sections = reports
		.map((r) => {
			const deltas = r.deltas.slice(0, 150);
			const body = deltas.length
				? deltas
						.map((d) => {
							if (d.type === "textMismatch")
								return `- \`${d.path}\` **text**: ours \`${d.ours}\` → ref \`${d.ref}\``;
							if (d.type === "tagMismatch")
								return `- \`${d.path}\` **tag**: ours \`${d.ours}\` → ref \`${d.ref}\``;
						if (d.type === "added")
							return `- \`${d.path}\` **added** (\`${d.tag}\`${d.text ? ` "${d.text}"` : ""} · ${d.nodes} узл.)`;
						if (d.type === "removed")
							return `- \`${d.path}\` **removed** (\`${d.tag}\`${d.text ? ` "${d.text}"` : ""} · ${d.nodes} узл.)`;
							return "";
						})
						.join("\n")
				: "_расхождений нет_";
			const more =
				r.deltas.length > deltas.length
					? `\n\n_…и ещё ${r.deltas.length - deltas.length} (см. json)_`
					: "";
			return (
				`\n\n## ${r.route}  (vs ${r.ref})\n\n` +
				`- added: **${r.counts.added}** (≈${r.counts.nodesAdded} узл.), removed: **${r.counts.removed}** (≈${r.counts.nodesRemoved} узл.), tag: **${r.counts.tagMismatch}**, text: **${r.counts.textMismatch}**\n\n` +
				`### Расхождения (топ ${Math.min(150, r.deltas.length)})\n\n${body}${more}`
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
	console.log(`[dom-audit] targets: ${targets.map((t) => t.route).join(", ")}`);

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
					`[dom-audit] ${rep.route}: added=${rep.counts.added} removed=${rep.counts.removed} tag=${rep.counts.tagMismatch} text=${rep.counts.textMismatch}`,
				);
			} catch (e) {
				console.error(`[dom-audit] ${target.route} failed: ${e.message}`);
			}
		}
		mkdirSync(resolve(WEB, "audit"), { recursive: true });
		writeFileSync(
			resolve(WEB, "audit/dom-report.json"),
			JSON.stringify({ generatedAt: new Date().toISOString(), reports }, null, 2),
		);
		writeFileSync(resolve(WEB, "audit/dom-report.md"), toMarkdown(reports));
		console.log(`report: web/audit/dom-report.md`);
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
