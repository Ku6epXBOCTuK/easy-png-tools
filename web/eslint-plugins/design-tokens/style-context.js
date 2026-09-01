// Shared helpers to talk to the postcss AST of Svelte <style> blocks that
// svelte-eslint-parser exposes. All rules use the same plumbing.

// Returns the postcss Root of the <style> block, or null when the file is not
// a Svelte component (or its style failed to parse).
export function getStyleRoot(context) {
	const parserServices = context.sourceCode?.parserServices;
	if (!parserServices || typeof parserServices.getStyleContext !== "function") {
		return null;
	}
	const styleContext = parserServices.getStyleContext();
	return styleContext?.status === "success" ? styleContext.sourceAst : null;
}

// Returns a converter from a postcss node to an ESLint loc, or null if the
// parser doesn't expose it.
export function getStyleNodeLoc(context) {
	return context.sourceCode?.parserServices?.styleNodeLoc ?? null;
}
