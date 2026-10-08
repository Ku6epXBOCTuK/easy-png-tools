import { alphaTools } from "./tools/alpha";
import { analyzeTools } from "./tools/analyze";
import { colorTools } from "./tools/color";
import { convertTools } from "./tools/convert";
import { filtersTools } from "./tools/filters";
import { generateTools } from "./tools/generate";
import { geometryTools } from "./tools/geometry";
import { textTools } from "./tools/text";
import { alphaPages } from "./pages/alpha";
import { analyzePages } from "./pages/analyze";
import { colorPages } from "./pages/color";
import { convertPages } from "./pages/convert";
import { filtersPages } from "./pages/filters";
import { generatePages } from "./pages/generate";
import { geometryPages } from "./pages/geometry";
import { textPages } from "./pages/text";
import type { Page, Tool } from "./types";

export {
	genTool,
	imgTool,
	INPUT_MODES,
	requireSource,
	requireText,
	RESULT_KINDS,
	textGen,
} from "./types";
export type {
	FileResult,
	InputMode,
	Page,
	PageStep,
	ResultKind,
	ResultNote,
	Tool,
	ToolContext,
	ToolImageFile,
	ToolResult,
	VerdictResult,
} from "./types";

export const TOOLS: Tool[] = [
	...geometryTools,
	...alphaTools,
	...convertTools,
	...analyzeTools,
	...filtersTools,
	...colorTools,
	...generateTools,
	...textTools,
] as unknown as Tool[];

export const PAGES: Page[] = [
	...geometryPages,
	...alphaPages,
	...convertPages,
	...analyzePages,
	...filtersPages,
	...colorPages,
	...generatePages,
	...textPages,
] as unknown as Page[];

export function getTool(id: string): Tool | undefined {
	return TOOLS.find((tool) => tool.id === id);
}

/** The only way to get a page: route, crumb, and file name derive from slug. */
export function getPageBySlug(slug: string): Page | undefined {
	return PAGES.find((page) => page.slug === slug);
}
