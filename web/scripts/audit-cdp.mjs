// audit-cdp.mjs
// Visual audit over multiple routes comparing SPECIFIED styles (what the CSS
// actually declares, after cascade + var() resolution + inheritance) instead
// of computed layout values — so sizes driven by differing page content don't
// produce false positives. Geometry (box) is only reported where a dimension
// is explicitly locked by CSS, not where it just follows the content flow.
// Replicates the route→ref mapping from audit-css.mjs (the 4 targets that have
// a corresponding ref HTML file), starts a dev server (unless --no-serve),
// captures each pair, diffs, and writes a report to web/audit/cdp-audit.txt.
//
// Usage:
//   node scripts/audit-cdp.mjs            # serve + audit all 4 targets
//   node scripts/audit-cdp.mjs --no-serve # assume a server is already running
//   node scripts/audit-cdp.mjs --ours http://127.0.0.1:5173
//   node scripts/audit-cdp.mjs --route /preview/demo --ref demo.html
import { diffArrays } from "diff";
import { spawn } from "node:child_process";
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { chromium } from "playwright";

// ==== CLI / config =========================================================

const args = parseCli();

function parseCli() {
	const a = { viewports: [] };
	for (let i = 0; i < process.argv.length; i++) {
		const v = process.argv[i];
		if (v === "--no-serve") a.noServe = true;
		else if (v === "--ours") a.ours = process.argv[++i];
		else if (v === "--ref") a.ref = process.argv[++i];
		else if (v === "--route") a.route = process.argv[++i];
		else if (v === "--port") a.port = Number(process.argv[++i]);
		else if (v === "--viewport")
			a.viewports.push(...(process.argv[++i] ?? "").split(",").filter(Boolean));
	}
	return a;
}

const WEB = process.cwd();
const PORT = args.port || 5179;
const REFS_DIR = resolve(WEB, "../refs-html");
const PX_TOL = 1;
// Per-page navigation timeout (ms). Guards against hanging indefinitely when a
// served URL is unreachable (e.g. --no-serve with no server actually running).
const NAV_TIMEOUT = 20_000;

// Requested viewports; repeatable/comma-separated "--viewport WxH".
// Deduplicated, preserves order. Defaults to 1440x900 when the flag is absent.
const viewports = parseViewports();
const vpLabel = (vp) => `${vp.width}x${vp.height}`;

function parseViewports() {
	const raw = args.viewports.length ? args.viewports : ["1440x900"];
	const out = [];
	for (const s of raw) {
		const m = /^(\d+)x(\d+)$/.exec(s.trim());
		if (!m) {
			console.error(`[cdp-audit] invalid viewport: ${s} (expected "WxH")`);
			process.exit(1);
		}
		const vp = { width: +m[1], height: +m[2] };
		if (!out.some((o) => o.width === vp.width && o.height === vp.height))
			out.push(vp);
	}
	return out;
}

// Explicit --viewport means per-resolution files; default run keeps the
// backward-compatible single cdp-audit.txt name.
const perResFile = args.viewports.length > 0;
const reportPath = (vp) =>
	resolve(
		WEB,
		"audit",
		perResFile ? `cdp-audit-${vpLabel(vp)}.txt` : "cdp-audit.txt",
	);

// Properties snapshot for every node, in both specified and computed form.
const PROPS = [
	"display",
	"position",
	"top",
	"right",
	"bottom",
	"left",
	"z-index",
	"float",
	"flex-direction",
	"flex-wrap",
	"justify-content",
	"align-items",
	"align-self",
	"row-gap",
	"column-gap",
	"grid-template-columns",
	"grid-template-rows",
	"margin-top",
	"margin-right",
	"margin-bottom",
	"margin-left",
	"padding-top",
	"padding-right",
	"padding-bottom",
	"padding-left",
	"width",
	"height",
	"min-width",
	"min-height",
	"max-width",
	"max-height",
	"box-sizing",
	"overflow",
	"opacity",
	"visibility",
	"transform",
	"box-shadow",
	"border-top-width",
	"border-top-style",
	"border-top-color",
	"border-radius",
	"background-color",
	"background-image",
	"background-size",
	"background-position",
	"color",
	"font-family",
	"font-size",
	"font-weight",
	"font-style",
	"line-height",
	"letter-spacing",
	"text-align",
	"text-transform",
	"white-space",
	"vertical-align",
];

// Tags/elements never included in the snapshot.
const NOISE_TAGS = new Set(["script", "template", "style", "link", "noscript"]);

// Properties that inherit by default — their specified value flows to children.
const INHERITED = new Set([
	"color",
	"cursor",
	"direction",
	"font-family",
	"font-size",
	"font-style",
	"font-variant",
	"font-weight",
	"letter-spacing",
	"line-height",
	"text-align",
	"text-indent",
	"text-shadow",
	"text-transform",
	"visibility",
	"white-space",
	"word-spacing",
]);

// ==== capture: open a page and snapshot its tree via getComputedStyle ======

async function capture(browser, target, viewport) {
	const url = target.startsWith("http")
		? target
		: "file:///" + target.replace(/\\/g, "/");
	const page = await browser.newPage({ viewport });
	await page.goto(url, {
		waitUntil: "networkidle",
		// Fail fast instead of hanging when the served URL is unreachable
		// (e.g. --no-serve but no server actually running).
		timeout: NAV_TIMEOUT,
	});
	await page.evaluate(async () => {
		await document.fonts.ready;
	});
	// Normalize both sides to light theme so we measure real design diffs,
	// not a theme inversion.
	await page.evaluate(() => {
		document.documentElement.dataset.theme = "light";
	});
	// Get deterministic base state: no element under the cursor and no focused
	// element, so pointer/keyboard state pseudo-classes (:hover/:focus/:active)
	// never match. Hover rules are simply not part of a static snapshot.
	await page.mouse.move(-10, -10);
	await page.evaluate(() => document.activeElement?.blur?.());
	await page.waitForTimeout(400);

	// Pass Sets as plain arrays (page.evaluate serializes, losing Set-ness) and
	// rebuild them inside the browser context.
	const tree = await page.evaluate(snapshotDocument, {
		PROPS,
		NOISE_TAGS: [...NOISE_TAGS],
		INHERITED: [...INHERITED],
	});
	await page.close();
	return tree;
}

// Browser-side cascade engine. Snapshot the document tree and, for every node,
// compute the SPECIFIED value of each requested property — what the CSS
// declares after cascade + inheritance + var() resolution — alongside the
// computed value from getComputedStyle. Runs inside the page via
// page.evaluate, so it must stay self-contained (browser globals + the arg).
function snapshotDocument({ PROPS, NOISE_TAGS, INHERITED }) {
	// page.evaluate hand-serialized the Sets to plain arrays — restore them.
	NOISE_TAGS = new Set(NOISE_TAGS);
	INHERITED = new Set(INHERITED);

	// ---- collect author rules (stylesheets) preserving cascade order ----
	// Recurse into container rules AND native CSS nesting (Svelte emits nested
	// "& output:where(.svelte-x)" rules whose declarations would otherwise be
	// invisible), expanding the "&" reference to the parent selector so the
	// rule still matches via el.matches() and parses for specificity.
	function collectRules() {
		const rules = [];
		let ruleOrder = 0;
		const collect = (list, parentSel = "") => {
			for (const r of list || []) {
				if (r == null) continue;
				if (r.type === 1) {
					let sel = r.selectorText;
					if (parentSel && sel?.includes("&"))
						sel = sel.replace(/&/g, parentSel);
					rules.push({ rule: r, effective: sel, order: ruleOrder++ });
					if (r.cssRules?.length) collect(r.cssRules, sel ?? parentSel);
				} else if (r.type === 3 && r.styleSheet) {
					try {
						collect(r.styleSheet.cssRules, parentSel);
					} catch {}
				} else if (r.type === 4) {
					if (r.media?.matches) {
						try {
							collect(r.cssRules, parentSel);
						} catch {}
					}
				} else if (r.type === 12) {
					try {
						if (CSS.supports(r.conditionText)) collect(r.cssRules, parentSel);
					} catch {
						try {
							collect(r.cssRules, parentSel);
						} catch {}
					}
				} else if (r.type === 15) {
					try {
						collect(r.cssRules, parentSel);
					} catch {}
				}
			}
		};
		for (const sheet of document.styleSheets) {
			try {
				collect(sheet.cssRules);
			} catch {}
		}
		return rules;
	}

	// ---- selector specificity (approximation of the CSS algorithm) ----
	// ids, classes, attributes, elements, plus :is/:not/:has (max of args)
	// and :where (zero).
	function splitTop(s, sep) {
		const parts = [];
		let depth = 0,
			cur = "";
		const isSep = (ch) =>
			sep === ","
				? ch === ","
				: ch === ">" || ch === "+" || ch === "~" || /\s/.test(ch);
		for (const ch of s) {
			if (ch === "(" || ch === "[") depth++;
			else if (ch === ")" || ch === "]") depth--;
			if (depth === 0 && isSep(ch)) {
				if (cur.trim()) parts.push(cur.trim());
				cur = "";
			} else cur += ch;
		}
		if (cur.trim()) parts.push(cur.trim());
		return parts;
	}

	function specCompound(full) {
		let [A, B, C] = [0, 0, 0];
		for (const comp of splitTop(full, " ")) {
			const n = comp.length;
			let i = 0;
			const ident = (ch) => /[\w\u00A0-\uFFFF-]/.test(ch);
			const readName = () => {
				let o = "";
				while (i < n && ident(comp[i])) o += comp[i++];
				return o;
			};
			const endParen = () => {
				let d = 1;
				i++;
				while (i < n) {
					if (comp[i] === "(" || comp[i] === "[") d++;
					else if (comp[i] === ")") {
						d--;
						if (!d) return i;
					}
					i++;
				}
				return n;
			};
			while (i < n) {
				const ch = comp[i];
				if (ch === "#") {
					A++;
					i++;
					readName();
				} else if (ch === ".") {
					B++;
					i++;
					readName();
				} else if (ch === "*") i++;
				else if (ch === "[") {
					B++;
					while (i < n && comp[i] !== "]") i++;
					i++;
				} else if (ch === ":") {
					if (comp[i + 1] === ":") {
						C++;
						i += 2;
						readName();
					} else {
						i++;
						const name = readName();
						if (comp[i] === "(") {
							const inner = comp.slice(i + 1, endParen());
							// :is/:not/:has take the most specific argument.
							if (name !== "where") {
								let a = 0,
									b = 0,
									c = 0;
								for (const arg of splitTop(inner, ",")) {
									const [aa, bb, cc] = specCompound(arg);
									a = Math.max(a, aa);
									b = Math.max(b, bb);
									c = Math.max(c, cc);
								}
								A += a;
								B += b;
								C += c;
							}
						} else B++;
					}
				} else if (/[a-zA-Z]/.test(ch)) {
					C++;
					readName();
				} else i++;
			}
		}
		return [A, B, C];
	}

	// ---- cascade resolution ----------------------------------------------
	// All declarations that apply to `el`, in cascade terms.
	function matchedDeclarations(el, rules) {
		const out = [];
		for (const { rule, order, effective } of rules) {
			const sel = effective ?? rule.selectorText;
			if (!sel) continue;
			// Specificity is per complex selector: a comma list like
			// ".a, .b .c" does NOT sum. Match each complex selector on its
			// own and use its specificity; ties are broken by source order.
			for (const cs of splitTop(sel, ",")) {
				let ok = false;
				try {
					ok = el.matches(cs);
				} catch {
					try {
						ok = el.matches(sel);
					} catch {}
				}
				if (!ok) continue;
				const [a, b, c] = specCompound(cs);
				const st = rule.style;
				for (let k = 0; k < st.length; k++) {
					const name = st.item(k);
					out.push({
						name,
						value: st.getPropertyValue(name).trim(),
						important: st.getPropertyPriority(name) === "important",
						a,
						b,
						c,
						order,
					});
				}
			}
		}
		const inline = el.getAttribute("style");
		if (inline) {
			const st = el.style;
			for (let k = 0; k < st.length; k++) {
				const name = st.item(k);
				out.push({
					name,
					value: st.getPropertyValue(name).trim(),
					important: st.getPropertyPriority(name) === "important",
					a: 1e6,
					b: 0,
					c: 0,
					order: 1e6,
				});
			}
		}
		return out;
	}

	const keyOf = (d) => [d.important ? 1 : 0, d.a, d.b, d.c, d.order];
	function betterThan(x, y) {
		const kx = keyOf(x),
			ky = keyOf(y);
		for (let i = 0; i < kx.length; i++)
			if (kx[i] !== ky[i]) return kx[i] > ky[i] ? 1 : -1;
		return 0;
	}
	// Pick the winning declaration per property (inline > !important > cascade).
	function resolve(decls) {
		const map = new Map();
		for (const d of decls) {
			const cur = map.get(d.name);
			if (!cur || betterThan(d, cur) > 0) map.set(d.name, d);
		}
		return map;
	}
	// Inherited entries must always lose against a real declaration.
	// Custom properties inherit too, so they propagate like inherited props.
	function inheritedEntries(m) {
		const out = [];
		for (const [k, v] of m)
			if (
				(INHERITED.has(k) || k.startsWith("--")) &&
				typeof v === "object" &&
				v !== null
			)
				out.push([
					k,
					{
						name: k,
						value: v.value ?? "",
						important: false,
						a: -1,
						b: -1,
						c: -1,
						order: -1,
					},
				]);
		return out;
	}
	// Substitute var(--name[, fallback]) with the resolved custom property value
	// from getComputedStyle (custom props inherit, so per-element lookup works).
	function resolveVars(value, cs, depth = 0) {
		if (depth > 8 || !value.includes("var(")) return value;
		return value.replace(/var\((--[\w-]+)(?:,([^)]*))?\)/g, (_, name, fb) => {
			const v = cs.getPropertyValue(name).trim();
			if (v) return resolveVars(v, cs, depth + 1);
			return fb ? resolveVars(fb, cs, depth + 1).trim() : "";
		});
	}

	// ---- tree building ----------------------------------------------------
	function snap(el, inherited, rules) {
		const tag = el.tagName.toLowerCase();
		if (
			NOISE_TAGS.has(tag) ||
			tag === "vite-error-overlay" ||
			el.id === "svelte-announcer"
		)
			return null;
		const specMap = new Map(inheritedEntries(inherited));
		for (const [name, d] of resolve(matchedDeclarations(el, rules))) {
			const cur = specMap.get(name);
			if (!cur || betterThan(d, cur) > 0) specMap.set(name, d);
		}
		const cs = getComputedStyle(el);
		const styles = {};
		const raw = {};
		const computed = {};
		for (const p of PROPS) {
			const c = cs.getPropertyValue(p);
			computed[p] = c;
			const rv = specMap.get(p)?.value ?? "";
			raw[p] = rv;
			let v = rv;
			if (v.includes("var(")) v = resolveVars(v, cs);
			styles[p] = v;
		}
		const r = el.getBoundingClientRect();
		return {
			tag,
			classes: (el.getAttribute("class") ?? "")
				.split(/\s+/)
				.filter((c) => c && !c.startsWith("svelte-")),
			text: [...el.childNodes]
				.filter((n) => n.nodeType === 3)
				.map((n) => n.textContent.trim())
				.filter(Boolean)
				.join(" "),
			box: {
				x: +r.x.toFixed(1),
				y: +r.y.toFixed(1),
				w: +r.width.toFixed(1),
				h: +r.height.toFixed(1),
			},
			styles,
			raw,
			computed,
			children:
				tag === "svg"
					? []
					: [...el.children]
							.map((ch) => snap(ch, specMap, rules))
							.filter(Boolean),
		};
	}

	const findBody = (n) =>
		n?.tag === "body" ? n : (n?.children ?? []).map(findBody).find(Boolean);

	const htmlNode = snap(document.documentElement, new Map(), collectRules());
	const body = findBody(htmlNode);
	if (!body) throw new Error("capture: body not found");
	return body;
}

// ==== capture via CDP DOMSnapshot (alternative path, kept for reference) ===

async function captureCdp(browser, target) {
	const url = target.startsWith("http")
		? target
		: "file:///" + target.replace(/\\/g, "/");
	const page = await browser.newPage({
		viewport: { width: 1440, height: 900 },
	});
	await page.goto(url, { waitUntil: "networkidle" });
	await page.evaluate(async () => {
		await document.fonts.ready;
	});
	const cdp = await page.context().newCDPSession(page);
	const snap = await cdp.send("DOMSnapshot.captureSnapshot", {
		computedStyles: PROPS,
	});
	await page.close();
	if (!snap?.documents?.length)
		throw new Error(
			"captureSnapshot: no documents, keys: " + Object.keys(snap ?? {}),
		);
	return toTree(snap);
}

function toTree(snap) {
	const S = snap.strings;
	const doc = snap.documents[0];
	const nodes = doc.nodes;
	const layout = doc.layout;
	const deref = (v) => (typeof v === "number" ? S[v] : v);

	if (layout.nodeIndex.length !== layout.bounds.length)
		throw new Error("toTree: nodeIndex and bounds are not parallel");

	const tree = buildCdpNode(bodyIndex(snap), snap);
	if (!tree) throw new Error("toTree: body not found");
	// At least one rendered node must have the full set of values.
	if (
		![...stylesByNode(snap, layout).values()].some(
			(s) => Object.keys(s).length === PROPS.length,
		)
	)
		throw new Error(
			"toTree: no node has a full set of styles — whitelist/indexing broken",
		);
	return tree;
}

// CDP bookkeeping helpers (kept small on purpose — they are only reachable
// through the experimental captureCdp path).
function stylesByNode(snap, layout) {
	const S = snap.strings;
	const m = new Map();
	for (let k = 0; k < layout.nodeIndex.length; k++) {
		const raw = layout.styles[k] ?? [];
		if (raw.length && raw.length !== PROPS.length)
			console.warn(
				`toTree: node ${layout.nodeIndex[k]}: ${raw.length} values ` +
					`for ${PROPS.length} requested — possible shift, node styles unreliable`,
			);
		const styles = {};
		PROPS.forEach((prop, j) => {
			if (raw[j] != null) styles[prop] = S[raw[j]] ?? "";
		});
		m.set(layout.nodeIndex[k], styles);
	}
	return m;
}

function bodyIndex(snap) {
	const nodes = snap.documents[0].nodes;
	const S = snap.strings;
	const kids = new Map();
	for (let i = 0; i < nodes.nodeType.length; i++) {
		const p = nodes.parentIndex?.[i];
		if (p == null || p < 0) continue;
		if (!kids.has(p)) kids.set(p, []);
		kids.get(p).push(i);
	}
	const rootIdx = nodes.nodeType.indexOf(9);
	const htmlIdx = (kids.get(rootIdx) ?? []).find(
		(i) => nodes.nodeType[i] === 1,
	);
	return (kids.get(htmlIdx) ?? []).find(
		(i) => nodes.nodeType[i] === 1 && deref(nodes.nodeName[i]) === "BODY",
	);
}

function buildCdpNode(bodyIdx, snap) {
	const S = snap.strings;
	const nodes = snap.documents[0].nodes;
	const layout = snap.documents[0].layout;
	const deref = (v) => (typeof v === "number" ? S[v] : v);

	const stylesByNode = stylesByNode(snap, layout);
	const boxByNode = new Map(
		layout.nodeIndex.map((domIdx, k) => {
			const b = layout.bounds[k];
			return [
				domIdx,
				{
					x: +b[0].toFixed(1),
					y: +b[1].toFixed(1),
					w: +b[2].toFixed(1),
					h: +b[3].toFixed(1),
				},
			];
		}),
	);
	const pseudoByNode = new Set(nodes.pseudoType?.index ?? []);
	const kids = new Map();
	for (let i = 0; i < nodes.nodeType.length; i++) {
		const p = nodes.parentIndex?.[i];
		if (p == null || p < 0) continue;
		if (!kids.has(p)) kids.set(p, []);
		kids.get(p).push(i);
	}

	const build = (i) => {
		if (nodes.nodeType[i] !== 1 || pseudoByNode.has(i)) return null;
		const a = nodes.attributes?.[i] ?? [];
		const attrs = {};
		for (let k = 0; k + 1 < a.length; k += 2)
			attrs[deref(a[k])] = deref(a[k + 1]);
		const tag = deref(nodes.nodeName[i]).toLowerCase();
		if (
			NOISE_TAGS.has(tag) ||
			tag === "vite-error-overlay" ||
			attrs.id === "svelte-announcer"
		)
			return null;
		const text = (kids.get(i) ?? [])
			.filter((c) => nodes.nodeType[c] === 3)
			.map((c) => (deref(nodes.nodeValue[c]) ?? "").trim())
			.filter(Boolean)
			.join(" ");
		return {
			tag: deref(nodes.nodeName[i]).toLowerCase(),
			classes: (attrs.class ?? "")
				.split(/\s+/)
				.filter((c) => c && !c.startsWith("svelte-")),
			text,
			box: boxByNode.get(i), // undefined = node not rendered
			styles: stylesByNode.get(i) ?? {},
			children:
				tag === "svg" ? [] : (kids.get(i) ?? []).map(build).filter(Boolean),
		};
	};
	return build(bodyIdx);
}

// ==== diffing / matching helpers ===========================================

// node signature for matching: tag + classes (no svelte suffixes), or text
const sig = (n) =>
	n.tag +
	(n.classes.length
		? "." + [...n.classes].sort().join(".")
		: n.text
			? ":" + n.text.slice(0, 30)
			: "");

function sameNode(x, y) {
	if (x.tag !== y.tag) return false;
	if (x.tag === "svg") return true; // icons: design vs library classes differ
	// Leaf controls (buttons/links/labels) are identified by their text label:
	// the ref and the app may name the same control with different classes
	// (e.g. "selected" vs "segment selected"), so a class-list match alone
	// mis-pairs them (and a classless ref button would otherwise match any
	// sibling). Matching by label keeps the pairings stable.
	if (
		(x.tag === "button" || x.tag === "a" || x.tag === "label") &&
		x.text &&
		y.text
	)
		return x.text === y.text;
	const cx = [...x.classes].sort().join(" ");
	const cy = [...y.classes].sort().join(" ");
	return cx === cy || !x.classes.length || !y.classes.length;
}

// CSS selector segment: nth-of-type only when several such tags under parent
function seg(node, i, siblings) {
	if (siblings.filter((c) => c.tag === node.tag).length < 2) return node.tag;
	const nth = siblings.slice(0, i + 1).filter((c) => c.tag === node.tag).length;
	return `${node.tag}:nth-of-type(${nth})`;
}

// human-readable annotation: classes + text, to make the node easy to find
function annotate(node) {
	if (!node) return "";
	const cls = node.classes.length
		? "  [" + [...node.classes].sort().join(" ") + "]"
		: "";
	const txt = node.text ? `  "${node.text.slice(0, 40)}"` : "";
	return cls + txt;
}

// Layout-sensitive props must never fall back to computed: keeping them
// specified (e.g. "auto") is what makes this audit content-size independent.
const LAYOUT = new Set([
	"width",
	"height",
	"min-width",
	"min-height",
	"max-width",
	"max-height",
	"top",
	"right",
	"bottom",
	"left",
	"margin-top",
	"margin-right",
	"margin-bottom",
	"margin-left",
	"row-gap",
	"column-gap",
]);
const DEFAULTISH = (v) =>
	v === "" ||
	v === "inherit" ||
	v === "initial" ||
	v === "unset" ||
	v === "revert";

// Geometry drift along an axis only matters when that dimension is actually
// locked by CSS; otherwise it is just content flow (text lengths, images).
function flowDriven(node, k) {
	if (!node?.styles) return true;
	if (k === "w") return DEFAULTISH(node.styles.width);
	if (k === "h") return DEFAULTISH(node.styles.height);
	if (k === "x")
		return DEFAULTISH(node.styles.left) && DEFAULTISH(node.styles.right);
	if (k === "y")
		return DEFAULTISH(node.styles.top) && DEFAULTISH(node.styles.bottom);
	return true;
}

// If a side is declared via CSS variables, append the raw declaration so the
// defining rule is easy to find (e.g. "color: var(--accent)").
function fmtSide(n, k) {
	const res = n?.styles?.[k] ?? "";
	const r = n?.raw?.[k] ?? "";
	if (r && r.includes("var(") && r !== res) return `${res || "—"} [${r}]`;
	return res;
}

function diffStyles(a, b) {
	const out = [];
	if (!a?.styles || !b?.styles)
		return [
			`⚠ node without styles (a.tag=${a?.tag}, b.tag=${b?.tag}) — matching bug, inspect manually`,
		];

	if (!!a.box !== !!b.box)
		out.push(
			`render: node is rendered only on one side ` +
				`(no layout box — usually display:none on one side)`,
		);

	// Which style props were already reported as diffs — box axes governed by
	// them are redundant then.
	const styleDiffKeys = new Set();
	for (const k of new Set([
		...Object.keys(a.styles),
		...Object.keys(b.styles),
	])) {
		const va = a.styles[k] ?? "",
			vb = b.styles[k] ?? "";
		if (va !== vb) {
			// One side relied on a default (UA/inherit) while the other spelled it
			// out, but they render identically — not a real difference. Skip for
			// content-independent props by comparing the computed values.
			if (
				!LAYOUT.has(k) &&
				(DEFAULTISH(va) || DEFAULTISH(vb)) &&
				a.computed?.[k] === b.computed?.[k]
			)
				continue;
			out.push(`${k}:  ${fmtSide(a, k) || "—"}  →  ${fmtSide(b, k) || "—"}`);
			styleDiffKeys.add(k);
		}
	}

	// Box axes map to style props: w→width, h→height, x→left/right, y→top/bottom.
	// If the corresponding style diff is already above, the geometry line is a
	// duplicate — drop it. Keep geometry only for changes the styles don't
	// explain (e.g. different border/padding with the same declared width).
	if (a.box && b.box)
		for (const k of ["x", "y", "w", "h"]) {
			const gov =
				k === "w"
					? ["width"]
					: k === "h"
						? ["height"]
						: k === "x"
							? ["left", "right"]
							: ["top", "bottom"];
			if (gov.some((p) => styleDiffKeys.has(p))) continue;
			const d = +(b.box[k] - a.box[k]).toFixed(1);
			if (Math.abs(d) > PX_TOL && !(flowDriven(a, k) && flowDriven(b, k)))
				out.push(
					`${k}:  ${a.box[k]}  →  ${b.box[k]}  (${d > 0 ? "+" : ""}${d}px)`,
				);
		}
	return out;
}

function compare(a, b, path, report) {
	const sel = path.join(" > ");
	const changes = diffStyles(a, b);
	if (changes.length)
		report.push(
			sel + annotate(b ?? a) + "\n" + changes.map((c) => "    " + c).join("\n"),
		);

	const removed = [],
		added = [];
	let ai = 0,
		bi = 0;
	for (const g of diffArrays(a.children, b.children, {
		comparator: sameNode,
	})) {
		if (g.removed)
			for (let k = 0; k < g.count; k++, ai++)
				removed.push([a.children[ai], ai]);
		else if (g.added)
			for (let k = 0; k < g.count; k++, bi++) added.push([b.children[bi], bi]);
		else
			for (let k = 0; k < g.count; k++, ai++, bi++)
				compare(
					a.children[ai],
					b.children[bi],
					[...path, seg(a.children[ai], ai, a.children)],
					report,
				);
	}

	// rescue: pair leftovers by tag instead of reporting ✗/+
	const rest = [];
	for (const [node, i] of removed) {
		const j = added.findIndex(([n]) => n.tag === node.tag);
		if (j < 0) {
			rest.push([node, i]);
			continue;
		}
		const [[bNode]] = added.splice(j, 1);
		compare(node, bNode, [...path, seg(node, i, a.children)], report);
	}
	for (const [node, i] of rest)
		report.push(
			`${[...path, seg(node, i, a.children)].join(" >")}${annotate(node)}\n    ✗ present in reference, absent in project`,
		);
	for (const [node, i] of added)
		report.push(
			`${[...path, seg(node, i, b.children)].join(" >")}${annotate(node)}\n    + present in project, absent in reference`,
		);
}

// ==== target discovery (mirrors audit-css.mjs) =============================

// Dynamic segments: explicit id values + id→ref-file mapping.
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
			console.warn(`[cdp-audit] ref not found, skipped: ${route} -> ${ref}`);
			return;
		}
		seen.add(route);
		targets.push({ route, ref });
	};
	for (const route of discoverRoutes()) {
		if (route.includes("[")) continue;
		if (EXCLUDE.has(route)) {
			console.log(`[cdp-audit] excluded (no relevant ref): ${route}`);
			continue;
		}
		add(route, refNameFor(route));
	}
	for (const [seg, cfg] of Object.entries(DYNAMIC)) {
		for (const id of cfg.ids) {
			add(`/preview/${seg.replace("[id]", id)}`, cfg.refFor(id));
		}
	}
	return targets;
}

// ==== orchestration ========================================================

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

async function auditOne(browser, target, viewport) {
	const oursUrl = args.ours || `http://127.0.0.1:${PORT}${target.route}`;
	const refUrl = resolve(REFS_DIR, target.ref);

	const ours = await capture(browser, oursUrl, viewport);
	const ref = await capture(browser, refUrl, viewport);

	const report = [];
	compare(ref, ours, ["body"], report);
	return { route: target.route, ref: target.ref, viewport, lines: report };
}

function startServer() {
	const bin = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
	return spawn(bin, ["dev", "--port", String(PORT), "--strictPort"], {
		cwd: WEB,
		stdio: "ignore",
		shell: true,
		detached: process.platform !== "win32",
	});
}

function stopServer(server) {
	if (!server) return;
	try {
		if (process.platform === "win32")
			spawn("taskkill", ["/pid", String(server.pid), "/f", "/t"], {
				stdio: "ignore",
			});
		else server.kill("SIGTERM");
	} catch {}
}

async function main() {
	const targets = buildTargets();
	if (!targets.length) {
		console.error("no audit targets (refs-html/*.html missing?)");
		process.exit(1);
	}
	console.log(`[cdp-audit] targets: ${targets.map((t) => t.route).join(", ")}`);

	let server;
	if (!args.noServe) {
		server = startServer();
		await waitFor(args.ours || `http://127.0.0.1:${PORT}${targets[0].route}`);
	}

	const browser = await chromium.launch();
	const reports = [];
	try {
		for (const vp of viewports) {
			for (const target of targets) {
				try {
					const rep = await auditOne(browser, target, vp);
					reports.push(rep);
					console.log(
						`[cdp-audit] [${vpLabel(vp)}] ${rep.route} (vs ${rep.ref}): ${rep.lines.length} differences`,
					);
				} catch (e) {
					console.error(
						`[cdp-audit] [${vpLabel(vp)}] ${target.route} failed: ${e.message}`,
					);
				}
			}
		}
	} finally {
		await browser.close();
		stopServer(server);
	}

	writeReports(reports);
}

function writeReports(reports) {
	const outDir = resolve(WEB, "audit");
	mkdirSync(outDir, { recursive: true });
	for (const vp of viewports) {
		const vReps = reports.filter(
			(r) => r.viewport.width === vp.width && r.viewport.height === vp.height,
		);
		const header =
			`CDP visual audit\n${new Date().toISOString()}\n` +
			`viewport ${vpLabel(vp)}, tolerance ${PX_TOL}px, theme light\n\n`;
		const body = vReps
			.map((r) => {
				const title = `=== [${vpLabel(vp)}] ${r.route}  (vs ${r.ref})  —  ${r.lines.length} differences ===`;
				if (!r.lines.length) return title + "\n  ✅ no differences found";
				return title + "\n\n" + r.lines.join("\n\n");
			})
			.join("\n\n\n");
		const outPath = reportPath(vp);
		writeFileSync(outPath, header + body + "\n", "utf8");
		console.log(`report: ${outPath}`);
	}
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
