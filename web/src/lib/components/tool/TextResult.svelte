<script lang="ts">
	import { downloadBlob } from "$lib/core/io";
	import { t } from "$lib/i18n/t";
	import { getMergedDict } from "$lib/i18n/locale.svelte";

	interface Props {
		text: string;
		filename: string;
		toolId?: string;
	}

	let { text, filename, toolId }: Props = $props();

	const shown = $derived(
		toolId ? (getMergedDict().tools[toolId]?.results?.[text] ?? text) : text,
	);

	let copied = $state(false);

	async function copy() {
		await navigator.clipboard.writeText(shown);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}

	function download() {
		downloadBlob(new Blob([shown], { type: "text/plain" }), `${filename}.txt`);
	}
</script>

<div class="panel text-result">
	<textarea
		class="output"
		rows="10"
		readonly
		value={shown}
		aria-label={t("textResult.outputAria")}></textarea>
	<div class="actions">
		<button type="button" class="secondary" onclick={copy}>
			{copied ? t("textResult.copied") : t("textResult.copy")}
		</button>
		<button type="button" class="primary" onclick={download}
			>{t("textResult.downloadTxt")}</button
		>
	</div>
</div>

<style>
	.text-result {
		padding: var(--space-3);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.output {
		width: 100%;
		resize: vertical;
		padding: var(--space-2);
		border: 1px solid var(--border);
		border-radius: var(--radius-s);
		background: var(--bg);
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		word-break: break-all;
	}

	.actions {
		display: flex;
		gap: var(--space-2);
	}

	.actions button {
		flex: 1;
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-s);
		border: 1px solid transparent;
		font-weight: 600;
		font-size: var(--text-m);
		cursor: pointer;
	}

	.actions .primary {
		background: var(--accent);
		color: var(--accent-contrast);
	}

	.actions .primary:hover {
		background: var(--accent-hover);
	}

	.actions .secondary {
		background: var(--surface);
		color: var(--text);
		border-color: var(--border);
	}

	.actions .secondary:hover {
		border-color: var(--link);
		color: var(--link);
	}
</style>
