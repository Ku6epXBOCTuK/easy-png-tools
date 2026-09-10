// Design-token audit, one command: theme parity, hct-only color authorship and
// unused-token warnings over src/app.css.
//
// Usage: pnpm --dir web exec node scripts/check-tokens.mjs
// Exit code 1 when a failing check (parity or color authorship) reports.

import { FILE, parsePreview } from "./token-audit/helpers.mjs";
import { checkParity } from "./token-audit/parity.mjs";
import { checkColorAuthorship } from "./token-audit/colors.mjs";
import { checkUnused } from "./token-audit/unused.mjs";

async function main() {
	const { root, light, dark } = await parsePreview();

	let failed = false;

	const parityErrors = checkParity({ light, dark });
	if (parityErrors.length > 0) {
		console.log(
			`Token parity violations in ${FILE}:\n${parityErrors.join("\n")}`,
		);
		failed = true;
	} else {
		console.log(
			"Token parity: OK — all color tokens have both light/dark forms.",
		);
	}

	const colorErrors = checkColorAuthorship(root);
	if (colorErrors.length > 0) {
		console.log(`Non-hct color values in ${FILE}:\n${colorErrors.join("\n")}`);
		failed = true;
	} else {
		console.log("All colors are authored as hct().");
	}

	const unused = checkUnused(root);
	if (unused.length > 0) {
		console.log("\nUnused tokens (defined in app.css, never used):");
		for (const token of unused) console.log(`  ${token}`);
	} else {
		console.log("All app.css tokens are used somewhere.");
	}

	if (failed) process.exitCode = 1;
}

main().catch((error) => {
	console.log(error);
	process.exitCode = 1;
});
