import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const WEB_DIR = fileURLToPath(new URL("../", import.meta.url));
const node = process.execPath;

// Every lint layer in one command. Each step runs even if a previous one
// fails; the exit code is nonzero if any did. Children inherit our stdout FD
// directly (no pipes), so `> out.txt` catches every byte; stylelint paints
// even to a non-TTY, hence the explicit --no-color there.
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

// Warn-only rules with a non-zero baseline stay out of the gate until the
// cleanup lands (docs/backlog.md, tests-and-lint section): they nag in
// `pnpm lint` and editors, but --max-warnings=0 would make the gate red.
// After the cleanup the overrides are removed and the rules become errors.
const pendingCleanupOverrides = [
	"conventions/ascii-only",
	"conventions/comments-english",
	"conventions/comment-format",
].flatMap((rule) => ["--rule", `${rule}: off`]);

const steps = [
	{
		name: "ESLint (svelte) + design-tokens rules",
		args: [
			bins.eslint,
			...colorFlag,
			"--max-warnings=0",
			...pendingCleanupOverrides,
			".",
		],
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
