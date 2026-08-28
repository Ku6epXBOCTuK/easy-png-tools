import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';

// Usage: node extract-static.mjs <source-out-dir> <dest-dir>
// e.g.   node extract-static.mjs .next\server\app ..\refs-html

const root = process.argv[2];
const dest = process.argv[3];

// --- CSS: find the compiled chunk and pretty-print it ---
const cssChunks = join(root, '..', '..', 'static', 'chunks');
const cssFile = readdirSync(cssChunks)
  .filter(f => f.endsWith('.css'))
  .sort((a, b) => statSync(join(cssChunks, b)).size - statSync(join(cssChunks, a)).size)[0];
const css = readFileSync(join(cssChunks, cssFile), 'utf8');

const prettyCss = css
  .replace(/\r/g, '')
  .replace(/\{/g, ' {\n  ')
  .replace(/;/g, ';\n  ')
  .replace(/\}/g, '\n}\n')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

// --- conservative html formatter ---

const VOID = new Set([
  'area','base','br','col','embed','hr','img','input',
  'link','meta','param','source','track','wbr',
]);
const RAW = new Set(['pre','textarea','script','style']);

function fmtHtml(html) {
  const tokens = html.match(
    /<!--[\s\S]*?-->|<!doctype[^>]*>|<\/?[a-zA-Z][^>]*>|[^<]+|</gi
  ) || [];
  const out = [];
  let depth = 0;
  let rawTag = null;

  for (const tk of tokens) {
    if (rawTag) {
      out.push(tk);
      if (new RegExp(`</${rawTag}\\s*>`, 'i').test(tk)) {
        depth--;
        rawTag = null;
      }
      continue;
    }

    const isOpen = /^<[a-zA-Z]/.test(tk);
    const isClose = /^<\//.test(tk);
    let name = '';
    if (isOpen || isClose) {
      name = (tk.match(/^<\/?([a-zA-Z0-9-]+)/) || [])[1]?.toLowerCase() || '';
    }

    if (isOpen && RAW.has(name)) {
      out.push('\n' + '  '.repeat(depth) + tk);
      if (!/\/>$/.test(tk)) { depth++; rawTag = name; }
    } else if (isOpen && !RAW.has(name)) {
      out.push('\n' + '  '.repeat(depth) + tk);
      if (!/\/>$/.test(tk) && !VOID.has(name)) depth++;
    } else if (isClose) {
      depth = Math.max(0, depth - 1);
      out.push('\n' + '  '.repeat(depth) + tk);
    } else if (/^</.test(tk)) {
      out.push('\n' + '  '.repeat(depth) + tk);
    } else {
      const t = tk.replace(/\s+/g, ' ');
      if (t.trim()) out.push(t);
    }
  }
  return out.join('').replace(/^\n/, '').replace(/\n{3,}/g, '\n\n');
}

// --- auto-discover pages by walking the export dir for *.html ---
function walk(dir, base = '') {
  const found = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = base ? join(base, entry) : entry;
    if (statSync(full).isDirectory()) {
      found.push(...walk(full, rel));
    } else if (entry.endsWith('.html')) {
      found.push(rel);
    }
  }
  return found;
}

const pages = walk(root)
  // skip Next internals
  .filter((rel) => !basename(rel).startsWith('_') && !basename(rel).startsWith('404'))
  .map((rel) => [rel, basename(rel)]);

console.log(`discovered ${pages.length} page(s):`, pages.map((p) => p[1]).join(', '));

for (const [src, out] of pages) {
  let html = readFileSync(join(root, src), 'utf8');

  // strip scripts — pure static snapshot
  html = html.replace(/<script[\s\S]*?<\/script>/g, '');
  html = html.replace(/<link[^>]+rel="preload"[^>]+as="script"[^>]*>/g, '');

  // inline compiled css instead of linking /_next/...
  html = html.replace(
    /<link[^>]+rel="stylesheet"[^>]*>/g,
    () => '<style>\n' + prettyCss + '\n</style>',
  );

  html = fmtHtml(html);

  const file = join(dest, out);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  console.log('written:', file);
}
