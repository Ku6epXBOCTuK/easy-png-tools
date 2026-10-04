import { readFileSync, writeFileSync } from "node:fs";

const version = process.argv[2];
if (!version) {
	console.error("usage: node scripts/sync-version.mjs <version>");
	process.exit(1);
}

for (const file of ["package.json", "web/package.json"]) {
	const raw = readFileSync(file, "utf8");
	const manifest = JSON.parse(raw);
	manifest.version = version;
	const indent = raw.match(/(?<=\n)([^\S\n]+)"/)?.[1] ?? 2;
	const eol = raw.endsWith("\n") ? "\n" : "";
	writeFileSync(file, JSON.stringify(manifest, null, indent) + eol);
}
