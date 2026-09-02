import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const WEB_DIR = fileURLToPath(new URL("../", import.meta.url));
const node = process.execPath;

// Every lint layer of the redesign, in one command. Each step runs even if a
// previous one fails; the exit code is nonzero if any did.
//
// Stream wiring: children run with stdio ["ignore", 1, 1] — both stdout and
// stderr are bound to OUR stdout file descriptor (shell `2>&1`). It is real FD
// inheritance, no pipes or buffering, so `> css-lint.txt` catches every byte.
// Color decisions are then the tool's own against the actual destination:
// a terminal gets colors, a redirected file gets plain text.
//
// One quirk: stylelint prints its report to stderr and paints it even when the
// destination is not a TTY. So for a non-TTY destination we pass its official
// --no-color explicitly.
const colorFlag = process.stdout.isTTY ? [] : ["--no-color"];

const bins = {
	eslint: fileURLToPath(
		new URL("../node_modules/eslint/bin/eslint.js", import.meta.url),
	),
	stylelint: fileURLToPath(
		new URL("../node_modules/stylelint/bin/stylelint.mjs", import.meta.url),
	),
	checkTokens: fileURLToPath(new URL("check-tokens.mjs", import.meta.url)),
};

const steps = [
	{
		name: "ESLint (svelte) + design-tokens rules",
		args: [bins.eslint, ...colorFlag, "."],
	},
	{
		name: "Stylelint (css) — design-token style",
		args: [bins.stylelint, ...colorFlag, "./src/**/*.css"],
	},
	{
		name: "Token audit (parity + colors + unused)",
		args: [bins.checkTokens],
	},
];

let failed = false;
for (const [index, step] of steps.entries()) {
	console.log(`\n[${index + 1}/${steps.length}] ${step.name}`);
	const result = spawnSync(node, step.args, {
		cwd: WEB_DIR,
		stdio: ["ignore", 1, 1],
	});
	if (result.status !== 0) failed = true;
}

console.log(
	failed
		? "\nlint-all: FAILED — fix the reported problems and re-run."
		: "\nlint-all: all checks passed.",
);
process.exit(failed ? 1 : 0);
