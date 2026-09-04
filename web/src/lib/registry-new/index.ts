import type { ToolEntry } from "./types";
import { geometryEntries } from "./geometry";
import { alphaEntries } from "./alpha";

export type { ToolEntry } from "./types";

export const TOOLS: ToolEntry[] = [
	...geometryEntries,
	...alphaEntries,
] as unknown as ToolEntry[];

export function getTool(id: string): ToolEntry | undefined {
	return TOOLS.find((tool) => tool.id === id);
}
