<script lang="ts">
	import { ArrowUp, Upload } from "@lucide/svelte";
	import Button from "$lib/components/ui/Button.svelte";
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
		aria-label={t("textInput.aria")}
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
			<Button
				icon={Upload}
				label={t("textSource.trySample")}
				variant="outline"
				size="s"
				onclick={onsample}
			/>
		{/if}
		<Button
			icon={ArrowUp}
			label={t("textSource.render")}
			size="s"
			onclick={onrender}
			{disabled}
		/>
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
</style>
