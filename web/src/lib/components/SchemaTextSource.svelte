<script lang="ts">
	import { ArrowUp, Upload } from "@lucide/svelte";
	import { t } from "$lib/i18n/t";

	interface Props {
		value: string;
		placeholder?: string;
		disabled?: boolean;
		oninput: (text: string) => void;
		onrender: () => void;
		onsample?: () => void;
	}
	let {
		value,
		placeholder = t("textSource.placeholder"),
		disabled = false,
		oninput,
		onrender,
		onsample,
	}: Props = $props();
</script>

<div class="text-source">
	<textarea
		spellcheck="false"
		{placeholder}
		rows="6"
		{value}
		oninput={(e) => oninput((e.target as HTMLTextAreaElement).value)}
		onkeydown={(e) => {
			if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
				e.preventDefault();
				onrender();
			}
		}}></textarea>
	<div class="actions">
		{#if onsample}
			<button type="button" class="secondary" onclick={onsample}>
				<Upload size={14} />
				{t("textSource.trySample")}
			</button>
		{/if}
		<button type="button" class="render" onclick={onrender} {disabled}>
			<ArrowUp size={14} />
			{t("textSource.render")}
		</button>
	</div>
</div>

<style>
	.text-source {
		display: grid;
		gap: var(--space-m);
	}
	textarea {
		width: 100%;
		min-height: var(--space-brand);
		max-height: var(--space-xxxl);
		resize: vertical;
		box-sizing: border-box;
		padding: var(--space-m);
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-m);
		background: var(--color-background);
		color: var(--color-text);
		font: var(--font-size-s) var(--font-mono);
		line-height: 1.5;
	}
	textarea:focus {
		outline: none;
		border-color: var(--color-main);
	}
	.actions {
		display: flex;
		gap: var(--space-m);
		justify-content: flex-end;
	}
	.render {
		display: inline-flex;
		align-items: center;
		gap: var(--space-m);
		padding: var(--space-m) var(--space-l);
		border: var(--size-border) solid var(--color-main);
		border-radius: var(--radius-m);
		background: var(--color-main);
		color: var(--color-background);
		font: var(--font-size-s) var(--font-mono);
		cursor: pointer;
	}
	.render:disabled {
		opacity: 0.6;
		cursor: default;
	}
	.secondary {
		display: inline-flex;
		align-items: center;
		gap: var(--space-m);
		padding: var(--space-m) var(--space-l);
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-m);
		background: none;
		color: var(--color-text-muted);
		font: var(--font-size-s) var(--font-mono);
		cursor: pointer;
	}
	.secondary:hover {
		color: var(--color-text);
		border-color: var(--color-text-muted);
	}
</style>
