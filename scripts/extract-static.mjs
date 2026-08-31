import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";

// Usage: node extract-static.mjs <source-out-dir> <dest-dir>
// e.g.   node extract-static.mjs .next\server\app ..\refs-html

const root = process.argv[2];
const dest = process.argv[3];

// --- inject a minimal theme toggle (extraction strips all <script> tags, so the
// ref pages would otherwise have no working dark-mode switch) ---
const THEME_TOGGLE = `
  <script>
    (function () {
      var btn = document.querySelector('button[aria-label="Toggle theme"]');
      var shell = document.querySelector('.app-shell');
      if (!btn || window.__themeToggleInjected) return;
      window.__themeToggleInjected = true;
      btn.addEventListener('click', function () {
        document.documentElement.classList.toggle('dark-mode');
        if (shell) shell.classList.toggle('dark-mode');
      });
    })();
  </script>
`;

function injectThemeToggle(html) {
  if (html.includes("__themeToggleInjected")) return html;
  const tag = "</body>";
  if (html.includes(tag)) return html.replace(tag, THEME_TOGGLE + "\n" + tag);
  if (html.includes("</html>")) return html.replace("</html>", THEME_TOGGLE + "\n</html>");
  return html + "\n" + THEME_TOGGLE;
}

// --- CSS: find the compiled chunk and pretty-print it ---
const cssChunks = join(root, "..", "..", "static", "chunks");

// --- fonts: inline @font-face + copy .woff2 next to the pages ---
// The Next reference never actually loads its `--font-sans/--font-mono`
// ("IBM Plex Sans"/"IBM Plex Mono"), so the extracted snapshots render with
// the system fallback. Self-host the fontsource in a `assets/fonts/` dir next
// to the HTML so the refs show the intended typefaces.

const FONT_ASSETS_DIR = "assets/fonts";

// fontsource packages relative to `web/` — same weights as design2.css imports.
const FONT_SOURCES = [
  "ibm-plex-sans/400.css",
  "ibm-plex-sans/500.css",
  "ibm-plex-sans/600.css",
  "ibm-plex-sans/700.css",
  "ibm-plex-mono/400.css",
  "ibm-plex-mono/500.css",
];

// Resolve `node_modules/@fontsource/<pkg>/<weight>.css`:
//   1. sibling repo dir (root `web/…` or standalone `refs/…` layouts);
//   2. upward walk from this script (monorepo with hoisted root deps).
function findFontsourceRoot() {
  const here = dirname(fileURLToPath(import.meta.url));
  const candidates = [join(here, "..", "web", "node_modules", "@fontsource")];
  for (let dir = here; ; ) {
    candidates.push(join(dir, "node_modules", "@fontsource"));
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  for (const candidate of candidates) {
    if (existsSync(join(candidate, FONT_SOURCES[0]))) return candidate;
  }
  return null;
}

function buildFontFaces(dest) {
  const fontsource = findFontsourceRoot();
  if (!fontsource) {
    console.warn("WARN: @fontsource not found (web/node_modules missing?) — skipping font embedding");
    return { style: "", copied: [] };
  }

  const seen = new Set();
  const raw = [];
  for (const rel of FONT_SOURCES) {
    const pkg = dirname(rel); // e.g. ibm-plex-sans
    const name = basename(rel, extname(rel)); // e.g. 400.css -> 400
    const file = join(fontsource, pkg, `${name}.css`);
    if (!existsSync(file)) continue;
    raw.push([file, readFileSync(file, "utf8"), pkg]);
  }

  // Drop duplicate @font-face blocks (each `<name>.css` repeats across weights).
  let css = raw.map(([, text]) => text.replace(/\/\*[^*]*\*\//g, "").trim()).join("\n");
  css = css.replace(/@font-face\s*\{[\s\S]*?\}/g, (block) =>
    seen.has(block) ? "" : (seen.add(block), block)
  );

  // Copy the woff2 files and point the css at `assets/fonts/`. Drop the woff
  // entries — modern browsers only need woff2 (dev-only static snapshots).
  const copied = [];
  const destFonts = join(dest, FONT_ASSETS_DIR);
  css = css.replace(/url\(\.\/files\/([^)]+\.woff2)\)\s*format\('woff2'\)\s*,\s*url\(\.\/files\/[^)]*\.woff\)\s*format\('woff'\)/g, (_m, f) => {
    const src = (() => {
      for (const [, , pkg] of raw) {
        const candidate = join(fontsource, pkg, "files", f);
        if (existsSync(candidate)) return candidate;
      }
      return null;
    })();
    if (!src) {
      console.warn(`WARN: font file not found: ${f}`);
      return "";
    }
    mkdirSync(destFonts, { recursive: true });
    writeFileSync(join(destFonts, f), readFileSync(src));
    if (!copied.includes(f)) copied.push(f);
    return `url(${FONT_ASSETS_DIR}/${f}) format('woff2')`;
  });

  return { style: "<style>\n" + css.trim() + "\n</style>", copied };
}
const cssFile = readdirSync(cssChunks)
  .filter((f) => f.endsWith(".css"))
  .sort((a, b) => statSync(join(cssChunks, b)).size - statSync(join(cssChunks, a)).size)[0];
const css = readFileSync(join(cssChunks, cssFile), "utf8");

const prettyCss = css
  .replace(/\r/g, "")
  .replace(/\{/g, " {\n  ")
  .replace(/;/g, ";\n  ")
  .replace(/\}/g, "\n}\n")
  .replace(/\n{3,}/g, "\n\n")
  .trim();

// --- conservative html formatter ---

const VOID = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);
const RAW = new Set(["pre", "textarea", "script", "style"]);

function fmtHtml(html) {
  const tokens = html.match(/<!--[\s\S]*?-->|<!doctype[^>]*>|<\/?[a-zA-Z][^>]*>|[^<]+|</gi) || [];
  const out = [];
  let depth = 0;
  let rawTag = null;

  for (const tk of tokens) {
    if (rawTag) {
      out.push(tk);
      if (new RegExp(`</${rawTag}\\s*>`, "i").test(tk)) {
        depth--;
        rawTag = null;
      }
      continue;
    }

    const isOpen = /^<[a-zA-Z]/.test(tk);
    const isClose = /^<\//.test(tk);
    let name = "";
    if (isOpen || isClose) {
      name = (tk.match(/^<\/?([a-zA-Z0-9-]+)/) || [])[1]?.toLowerCase() || "";
    }

    if (isOpen && RAW.has(name)) {
      out.push("\n" + "  ".repeat(depth) + tk);
      if (!/\/>$/.test(tk)) {
        depth++;
        rawTag = name;
      }
    } else if (isOpen && !RAW.has(name)) {
      out.push("\n" + "  ".repeat(depth) + tk);
      if (!/\/>$/.test(tk) && !VOID.has(name)) depth++;
    } else if (isClose) {
      depth = Math.max(0, depth - 1);
      out.push("\n" + "  ".repeat(depth) + tk);
    } else if (/^</.test(tk)) {
      out.push("\n" + "  ".repeat(depth) + tk);
    } else {
      const t = tk.replace(/\s+/g, " ");
      if (t.trim()) out.push(t);
    }
  }
  return out
    .join("")
    .replace(/^\n/, "")
    .replace(/\n{3,}/g, "\n\n");
}

// --- auto-discover pages by walking the export dir for *.html ---
function walk(dir, base = "") {
  const found = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = base ? join(base, entry) : entry;
    if (statSync(full).isDirectory()) {
      found.push(...walk(full, rel));
    } else if (entry.endsWith(".html")) {
      found.push(rel);
    }
  }
  return found;
}

const pages = walk(root)
  // skip Next internals
  .filter((rel) => !basename(rel).startsWith("_") && !basename(rel).startsWith("404"))
  // `index.html` ╨╜╨░╨╝ ╨╜╨╡ ╨╜╤Г╨╢╨╡╨╜ ╨║╨░╨║ ╤А╨╡╤Д, ╨┐╨╛╤Н╤В╨╛╨╝╤Г ╨╜╨╡ ╨│╨╡╨╜╨╡╤А╨╕╤А╤Г╨╡╨╝ ╨╡╨│╨╛.
  .filter((rel) => basename(rel).toLowerCase() !== "index.html")
  .map((rel) => [rel, basename(rel)]);

console.log(`discovered ${pages.length} page(s):`, pages.map((p) => p[1]).join(", "));

const { style: fontFacesStyle, copied: fontFiles } = buildFontFaces(dest);
if (fontFiles.length) {
  console.log(`fonts: ${fontFiles.length} file(s) -> ${join(dest, FONT_ASSETS_DIR)}`);
}

for (const [src, out] of pages) {
  let html = readFileSync(join(root, src), "utf8");

  // strip scripts — pure static snapshot
  html = html.replace(/<script[\s\S]*?<\/script>/g, "");
  html = html.replace(/<link[^>]+rel="preload"[^>]+as="script"[^>]*>/g, "");

  // inline compiled css instead of linking /_next/...
  html = html.replace(/<link[^>]+rel="stylesheet"[^>]*>/g, () => "<style>\n" + prettyCss + "\n</style>");

  // fonts first, so any later @font-face overrides win for the same family
  if (fontFacesStyle) html = html.replace("<head>", "<head>\n  " + fontFacesStyle.trim());

  html = fmtHtml(html);
  html = injectThemeToggle(html);

  const file = join(dest, out);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  console.log("written:", file);
}
