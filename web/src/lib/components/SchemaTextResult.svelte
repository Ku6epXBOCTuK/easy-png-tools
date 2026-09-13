<script lang="ts">
	import { Copy, Download, FileText } from "@lucide/svelte";
	import { verdictTone, verdictText } from "$lib/i18n/schema-tool-strings";
	import { t } from "$lib/i18n/t";
	import IconButton from "./ui/IconButton.svelte";

	interface Props {
		value: string;
		kind: "text" | "verdict";
		toolId?: string;
		fileName?: string;
		oncopy: () => void;
		ondownload: () => void;
	}
	let {
		value,
		kind,
		toolId = "",
		fileName = "result.txt",
		oncopy,
		ondownload,
	}: Props = $props();

	const tone = $derived(verdictTone(value));
	const displayValue = $derived(
		kind === "verdict" && toolId ? verdictText(toolId, value) : value,
	);
</script>

{#if kind === "verdict"}
	<div class="verdict">
		<span class="verdict-label">{t("resultCard.result")}</span>
		<div class="badge badge-tone--{tone}" role="status">
			<span class="verdict-text">{displayValue}</span>
			<IconButton icon={Copy} label={t("textResult.copy")} onclick={oncopy} />
		</div>
	</div>
{:else}
	<div class="text-result">
		<div class="result-head">
			<span class="result-label"><FileText size={14} /> {fileName}</span>
			<div class="result-actions">
				<IconButton icon={Copy} label={t("textResult.copy")} onclick={oncopy} />
				<IconButton
					icon={Download}
					label={t("textResult.downloadTxt")}
					onclick={ondownload}
				/>
			</div>
		</div>
		<pre class="result-pre"><code>{value}</code></pre>
	</div>
{/if}

<style>
	.text-result {
		display: grid;
		gap: var(--space-m);
		min-width: 0;
	}
	.result-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-m);
	}
	.result-label {
		display: inline-flex;
		align-items: center;
		gap: var(--space-m);
		color: var(--color-text-muted);
		font: var(--font-size-s) var(--font-mono);
		letter-spacing: var(--space-text-l);
	}
	.result-actions {
		display: flex;
		gap: var(--space-s);
	}
	.result-pre {
		margin: 0;
		box-sizing: border-box;
		max-height: var(--space-xxxl);
		overflow: auto;
		padding: var(--space-l) var(--space-m);
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-m);
		background: var(--color-background);
		color: var(--color-text);
		font: var(--font-size-s) var(--font-mono);
		line-height: 1.5;
		white-space: pre;
	}
	.verdict {
		display: grid;
		gap: var(--space-m);
		justify-items: start;
	}
	.verdict-label {
		color: var(--color-text-muted);
		font: var(--font-size-s) var(--font-mono);
		letter-spacing: var(--space-text-l);
		text-transform: uppercase;
	}
	.badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-l);
		padding: var(--space-m) var(--space-xl);
		border: var(--size-border-thick) solid transparent;
		border-radius: var(--radius-m);
		font: var(--font-size-m) var(--font-mono);
	}
	.badge-tone--success {
		background: var(--color-success-tint);
		border-color: var(--color-success);
		color: var(--color-success);
	}
	.badge-tone--danger {
		background: var(--color-danger-tint);
		border-color: var(--color-danger);
		color: var(--color-danger);
	}
	.badge-tone--info {
		background: var(--color-info-tint);
		border-color: var(--color-info);
		color: var(--color-info);
	}
	.verdict-text {
		line-height: normal;
	}
</style>
