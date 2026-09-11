// Shared helpers for the conventions plugin (web/eslint-plugins/conventions).

/**
 * True when the node sits somewhere under a Svelte <script> block
 * (SvelteScriptElement). Used to limit $props() checks to script code.
 * @param {any} node
 */
export function isInsideScriptElement(node) {
	let cursor = node.parent;
	while (cursor && cursor.type !== "Program") {
		if (cursor.type === "SvelteScriptElement") return true;
		cursor = cursor.parent;
	}
	return false;
}
