import type { ToolSchema } from "./specs";

export interface ResolvedLayoutGroup {
	key: string;
	title?: string;
	cols: number;
	fields: string[];
}

export function resolveLayoutGroups<P>(
	schema: ToolSchema<P>,
): ResolvedLayoutGroup[] {
	const all = Object.keys(schema.fields);
	const groups = schema.layout?.groups ?? [];
	const used: Record<string, true> = {};
	const named: ResolvedLayoutGroup[] = groups
		.map((group, index) => {
			const fields = group.fields.filter((fieldId) => {
				if (used[fieldId] || !(fieldId in schema.fields)) return false;
				used[fieldId] = true;
				return true;
			});
			return {
				key: `${group.title ?? "group"}-${index}`,
				title: group.title,
				cols: Math.max(1, Math.trunc(group.cols ?? 1)),
				fields,
			} satisfies ResolvedLayoutGroup;
		})
		.filter((group) => group.fields.length > 0);
	const rest = all.filter((fieldId) => !used[fieldId]);
	if (rest.length > 0) {
		named.push({ key: "__default", cols: 1, fields: rest });
	}
	return named;
}
