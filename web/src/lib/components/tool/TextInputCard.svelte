<script lang="ts">
	import Button from "../ui/Button.svelte";
	import { t } from "$lib/i18n/t";

	interface Props {
		onSubmit: (text: string) => void;
	}

	let { onSubmit }: Props = $props();

	let text = $state("");

	function submit() {
		if (text.trim().length === 0) return;
		onSubmit(text);
	}
</script>

<div class="container">
	<h2 class="heading-section">{t("textInput.heading")}</h2>
	<textarea
		class="input"
		rows="8"
		bind:value={text}
		placeholder={t("textInput.placeholder")}
		aria-label={t("textInput.aria")}></textarea>
	<Button
		variant="secondary"
		onclick={submit}
		disabled={text.trim().length === 0}
	>
		{t("textInput.decode")}
	</Button>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		min-width: 0;
		height: 100%;
	}

	h2 {
		margin-bottom: var(--space-1);
	}

	.input {
		flex: 1;
		width: 100%;
		resize: vertical;
		padding: var(--space-2);
		border: 1px solid var(--border);
		border-radius: var(--radius-s);
		background: var(--surface);
		font-family: var(--font-mono);
		font-size: var(--text-s);
		min-height: 12rem;
	}
</style>
