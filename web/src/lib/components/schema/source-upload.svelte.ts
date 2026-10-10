import { ToolError } from "$lib/core/errors";
import { decodeFile } from "$lib/core/io";
import type { PixelImage } from "$lib/core/types";
import type { ChainStep } from "$lib/pipeline.svelte";
import type { InputMode, ToolImageFile } from "$lib/registry";
import {
	applySourceDefaults,
	clampSourceAwareMaxes,
} from "$lib/registry-schema";
import { baseName, uniqueName, type ChainWarning } from "$lib/run-chain";
import { onMount } from "svelte";
import type { SvelteSet } from "svelte/reactivity";
import { toolSchemaOf } from "./schema-tool-state.svelte";

export interface SourceUploadCtx {
	inputMode: () => InputMode;
	steps: () => ChainStep[];
	setSteps: (steps: ChainStep[]) => void;
	touchedFor: (key: string) => SvelteSet<string>;
	reportError: (e: unknown) => void;
	clearError: () => void;
}

// Source state of SchemaToolView: image files / text input, decode warnings,
// paste-to-load. `source` is the first image for preview/defaults;
// `sourceFiles` is the full named input set (single upload = one element).
export function createSourceUpload(ctx: SourceUploadCtx) {
	let source = $state<PixelImage | null>(null);
	let sourceFiles = $state<ToolImageFile[]>([]);
	let textSource = $state("");
	let sourceWarnings = $state<ChainWarning[]>([]);

	async function handleFiles(files: File[]) {
		ctx.clearError();
		sourceWarnings = [];
		const decoded: ToolImageFile[] = [];
		const usedNames = new Set<string>();
		let skipped = 0;
		for (const file of files) {
			try {
				const name = uniqueName(`${baseName(file.name)}.png`, usedNames);
				usedNames.add(name);
				decoded.push({ name, image: await decodeFile(file) });
			} catch {
				skipped++;
			}
		}
		if (decoded.length === 0) {
			ctx.reportError(new ToolError("errors.imageDecode"));
			return;
		}
		if (skipped > 0) {
			sourceWarnings = [{ kind: "sourceSkip", skipped, total: files.length }];
		}
		const firstImage = decoded[0].image;
		source = firstImage;
		sourceFiles = decoded;
		const first = ctx.steps()[0];
		const firstSchema = first ? toolSchemaOf(first) : undefined;
		if (first && firstSchema) {
			ctx.setSteps(
				ctx.steps().with(0, {
					...first,
					params: clampSourceAwareMaxes(
						firstSchema,
						applySourceDefaults(
							firstSchema,
							first.params,
							{ source: firstImage },
							ctx.touchedFor(first.key),
						),
						firstImage,
					),
				}),
			);
		}
	}

	async function handleFile(file: File) {
		await handleFiles([file]);
	}

	onMount(() => {
		if (ctx.inputMode() !== "image") return;
		function onPaste(e: ClipboardEvent) {
			const target = e.target as HTMLElement | null;
			if (target?.closest("input, textarea, [contenteditable]")) return;
			for (const item of e.clipboardData?.items ?? []) {
				if (item.kind !== "file" || !item.type.startsWith("image/")) continue;
				const file = item.getAsFile();
				if (file) {
					e.preventDefault();
					void handleFile(file);
				}
				return;
			}
		}
		window.addEventListener("paste", onPaste);
		return () => window.removeEventListener("paste", onPaste);
	});

	return {
		get source() {
			return source;
		},
		set source(v: PixelImage | null) {
			source = v;
		},
		get sourceFiles() {
			return sourceFiles;
		},
		set sourceFiles(v: ToolImageFile[]) {
			sourceFiles = v;
		},
		get textSource() {
			return textSource;
		},
		set textSource(v: string) {
			textSource = v;
		},
		get sourceWarnings() {
			return sourceWarnings;
		},
		clearWarnings: () => {
			sourceWarnings = [];
		},
		handleFile,
		handleFiles,
	};
}
