// Статический сервер для e2e (Playwright webServer). Раздаёт web/build
// (adapter-static): /foo -> foo.html | foo/index.html, MIME по расширению.
// Запуск: pnpm build && node scripts/serve-static.mjs --port 4173
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const portIndex = process.argv.indexOf("--port");
const PORT =
	portIndex >= 0 ? Number(process.argv[portIndex + 1]) || 4173 : 4173;
const ROOT = fileURLToPath(new URL("../build", import.meta.url));

const MIME = {
	".html": "text/html; charset=utf-8",
	".js": "text/javascript",
	".mjs": "text/javascript",
	".css": "text/css",
	".json": "application/json",
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".webp": "image/webp",
	".svg": "image/svg+xml",
	".ico": "image/x-icon",
	".woff2": "font/woff2",
	".woff": "font/woff",
	".ttf": "font/ttf",
	".txt": "text/plain; charset=utf-8",
	".xml": "application/xml",
	".map": "application/json",
};

function candidates(pathname) {
	const rel = pathname.replace(/\\/g, "/").replace(/^\/+/, "");
	const base = rel ? join(ROOT, ...rel.split("/")) : ROOT;
	const out = [base];
	if (!extname(base)) {
		out.push(`${base}.html`);
		out.push(join(base, "index.html"));
	}
	return out;
}

function serve(req, res) {
	const url = new URL(req.url, `http://${req.headers.host}`);
	const path = decodeURIComponent(url.pathname);
	for (const file of candidates(path)) {
		try {
			if (!statSync(file).isFile()) continue;
			const body = readFileSync(file);
			res.writeHead(200, {
				"Content-Type": MIME[extname(file)] ?? "application/octet-stream",
				"Cache-Control": "no-store",
			});
			res.end(body);
			return;
		} catch {
			/* not found — try next candidate */
		}
	}
	res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
	res.end("Not found: " + path);
}

createServer(serve).listen(PORT, "127.0.0.1", () => {
	console.log(`[serve-static] serving ${ROOT} on http://127.0.0.1:${PORT}`);
});
