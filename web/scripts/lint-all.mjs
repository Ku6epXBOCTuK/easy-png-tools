import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const WEB_DIR = fileURLToPath(new URL("../", import.meta.url));
const node = process.execPath;

// (eslint, [args]) — every lint layer of the redesign, in one command.
// Each step runs even if a previous one fails; exit code is nonzero if any.
const steps = [
	{
		name: "ESLint (svelte) + design-tokens rules",
		args: [
			fileURLToPath(
				new URL("../node_modules/eslint/bin/eslint.js", import.meta.url),
			),
			".",
		],
	},
	{
		name: "Stylelint (css) — design-token style",
		args: [
			fileURLToPath(
				new URL("../node_modules/stylelint/bin/stylelint.mjs", import.meta.url),
			),
			"./src/**/*.css",
		],
	},
	{
		name: "Token audit (parity + unused)",
		args: [fileURLToPath(new URL("check-token-parity.mjs", import.meta.url))],
	},
];

let failed = false;
for (const [index, step] of steps.entries()) {
	console.log(`\n[${index + 1}/${steps.length}] ${step.name}`);
	const result = spawnSync(node, step.args, {
		cwd: WEB_DIR,
		stdio: "inherit",
	});
	if (result.status !== 0) failed = true;
}

console.log(
	failed
		? "\nlint-all: FAILED — fix the reported problems and re-run."
		: "\nlint-all: all checks passed.",
);
process.exit(failed ? 1 : 0);
