// Стиль-аудит: снимает design-токены (light/dark) и дерево вычисленных стилей
// нашей preview-страницы и refs-html страницы, сравнивает и пишет отчёт.
// Запуск: pnpm audit  (опции: --ours <url> --ref <file> --no-serve --route <path>)
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

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
const ROUTE = args.route || "/preview/demo";
const OURS = args.ours || `http://127.0.0.1:${PORT}${ROUTE}`;
const REF = args.ref || resolve(WEB, "../refs-html/demo.html");

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
	"gap"
];

const waitFor = async (url, ms = 60000) => {
	const t = Date.now();
	while (Date.now() - t < ms) {
		try {
			const r = await fetch(url);
			if (r.ok) return;
		} catch {}
		await new Promise((r) => setTimeout(r, 500));
	}
	throw new Error("dev server not up: " + url);
};

const snapshot = (page, url) =>
	page.evaluate((url) => {
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
				"gap"
			])
				o[f] = s[f];
			return o;
		};
		const rect = (el) => {
			const r = el.getBoundingClientRect();
			return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
		};
		const walk = (el, path) => {
			if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(el.tagName)) return [];
			const out = [];
			const kids = [...el.children];
			out.push({
				path,
				tag: el.tagName.toLowerCase(),
				text: el.children.length === 0 ? el.textContent.trim().slice(0, 40) : "",
				rect: rect(el),
				style: sig(el)
			});
			for (let i = 0; i < kids.length; i++)
				out.push(...walk(kids[i], `${path}>${kids[i].tagName.toLowerCase()}:nth-child(${i + 1})`));
			return out;
		};
		return { tokensLight, tokensDark, tree: walk(document.body, "body") };
	}, url);

async function main() {
	let server;
	if (!args.noServe) {
		const bin = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
		server = spawn(bin, ["dev", "--port", String(PORT), "--strictPort"], {
			cwd: WEB,
			stdio: "ignore",
			shell: true,
			detached: process.platform !== "win32"
		});
		await waitFor(OURS);
	}

	const browser = await chromium.launch();
	const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
	try {
		await page.goto(OURS, { waitUntil: "load" });
		await page.evaluate(() => document.fonts.ready);
		await page.waitForTimeout(400);
		const ours = await snapshot(page, OURS);

		await page.goto(pathToFileURL(REF).href, { waitUntil: "load" });
		await page.evaluate(() => document.fonts.ready);
		await page.waitForTimeout(400);
		const ref = await snapshot(page, pathToFileURL(REF).href);

		// token diff (игнорируем служебный мусор Tailwind/lightningcss — он
		// ref-only и не относится к нашим смысловым токенам)
		const TOK_NOISE = /^(--tw-|--lightningcss-|--default-)/;
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
			dark: tokDiff(ours.tokensDark, ref.tokensDark)
		};

		// element diff: совпадающие по тексту элементы (структуры разные,
		// поэтому nth-child-пути не совпадают — матчим по видимому тексту)
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
			if (Math.abs(dr.x - rr.x) > 2 || Math.abs(dr.y - rr.y) > 2 || Math.abs(dr.w - rr.w) > 2 || Math.abs(dr.h - rr.h) > 2)
				deltas.rect = { ours: dr, ref: rr };
			if (Object.keys(deltas).length) elementDiffs.push({ path: o.path, tag: o.tag, text: k, deltas });
		}
		for (const [k] of txtR) if (!txtO.has(k)) onlyRef.push(k);

		const report = {
			generatedAt: new Date().toISOString(),
			ours: OURS,
			ref: REF,
			tokenDiffs,
			elementDiffs,
			onlyOurs: onlyOurs.slice(0, 60),
			onlyRef: onlyRef.slice(0, 60),
			counts: {
				tokenLight: tokenDiffs.light.length,
				tokenDark: tokenDiffs.dark.length,
				elements: elementDiffs.length,
				onlyOurs: onlyOurs.length,
				onlyRef: onlyRef.length
			}
		};

		mkdirSync(resolve(WEB, "audit"), { recursive: true });
		writeFileSync(resolve(WEB, "audit/audit-report.json"), JSON.stringify(report, null, 2));
		writeFileSync(resolve(WEB, "audit/audit-report.md"), toMarkdown(report, ours, ref));
		console.log(
			`audit done: tokens light/dark=${tokenDiffs.light.length}/${tokenDiffs.dark.length}, ` +
				`elements=${elementDiffs.length}, onlyOurs=${onlyOurs.length}, onlyRef=${onlyRef.length}`
		);
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

function toMarkdown(report, ours, ref) {
	const tokTable = (rows, a, b) =>
		rows.length
			? `| token | ours | ref |\n|---|---|---|\n` +
				rows.map((r) => `| \`${r.key}\` | ${r.ours} | ${r.ref} |`).join("\n")
			: "_все совпадают_";
	const sorted = [...report.elementDiffs].sort(
		(x, y) => Object.keys(y.deltas).length - Object.keys(x.deltas).length
	);
	const elRows = sorted
		.slice(0, 100)
		.map((e) => {
		const d = Object.entries(e.deltas)
			.map(([k, v]) => {
				if (k === "rect") {
					const f = (r) => `${r.x},${r.y} ${r.w}x${r.h}`;
					return `    - **rect**: \`${f(v.ours)}\` → \`${f(v.ref)}\``;
				}
				return `    - **${k}**: \`${v.ours}\` → \`${v.ref}\``;
			})
			.join("\n");
			return `### \`${e.path}\`${e.text ? ` — "${e.text}"` : ""}\n${d}`;
		})
		.join("\n\n");
	return `# Style audit: ${report.ours}\n\nvs ${report.ref}\n\n_${report.generatedAt}_\n\n` +
		`## Сводка\n\n- Токены light: **${report.counts.tokenLight}** расх.\n` +
		`- Токены dark: **${report.counts.tokenDark}** расх.\n` +
		`- Элементы (стиль/геометрия): **${report.counts.elements}** расх.\n` +
		`- Только у нас: ${report.counts.onlyOurs}, только в рефе: ${report.counts.onlyRef}\n\n` +
		`## Токены — Light\n\n${tokTable(report.tokenDiffs.light)}\n\n` +
		`## Токены — Dark\n\n${tokTable(report.tokenDiffs.dark)}\n\n` +
		`## Расхождения элементов (топ ${Math.min(100, sorted.length)})\n\n${elRows}\n\n` +
		`## Только у нас (структурно)\n\n` +
		(report.onlyOurs.length ? report.onlyOurs.map((p) => `- \`${p}\``).join("\n") : "_—_") +
		`\n\n## Только в рефе (структурно)\n\n` +
		(report.onlyRef.length ? report.onlyRef.map((p) => `- \`${p}\``).join("\n") : "_—_") +
		`\n`;
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
