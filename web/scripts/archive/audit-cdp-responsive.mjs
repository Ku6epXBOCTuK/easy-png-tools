// Runs audit-cdp.mjs across the commonly used desktop / tablet / phone
// resolutions. Same CLI options pass through, e.g.:
//   node scripts/audit-cdp-responsive.mjs --route /preview/demo --viewport 390x844
import { spawnSync } from "node:child_process";

const VIEWPORTS = ["2560x1440", "1920x1080", "1440x900", "768x1024", "390x844"];

const args = [];
let viewportSeen = false;
for (let i = 0; i < process.argv.length; i++) {
	const v = process.argv[i];
	if (v === "--viewport") {
		viewportSeen = true;
		i++;
	} else args.push(v);
}
if (!viewportSeen) args.push("--viewport", VIEWPORTS.join(","));

const r = spawnSync(
	process.execPath,
	["scripts/audit-cdp.mjs", ...args.slice(2)],
	{
		stdio: "inherit",
	},
);
if (r.error) {
	console.error(r.error.message);
	process.exit(1);
}
process.exit(r.status ?? 1);
