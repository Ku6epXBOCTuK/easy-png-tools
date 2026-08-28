<script lang="ts">
	import Field from "./Field.svelte";
	import { t } from "$lib/i18n/t";

	interface Props {
		id: string;
		label: string;
		value?: string;
		hint?: string;
		pipetteActive?: boolean;
		onPipetteToggle?: () => void;
	}

	let {
		id,
		label,
		value = $bindable("#000000"),
		hint,
		pipetteActive = false,
		onPipetteToggle,
	}: Props = $props();
</script>

<Field {id} {label} {hint}>
	<div class="row">
		<input {id} class="control swatch" type="color" bind:value />
		{#if onPipetteToggle}
			<button
				type="button"
				class="pipette"
				aria-label={t("ui.pipette")}
				aria-pressed={pipetteActive}
				title={t("ui.pipette")}
				onclick={onPipetteToggle}
			>
				◎
			</button>
		{/if}
	</div>
</Field>

<style>
	.row {
		display: flex;
		align-items: center;
		gap: var(--space-1);
	}

	.swatch {
		height: var(--control-height);
		width: 3.5rem;
		padding: 2px;
		cursor: pointer;
	}

	.pipette {
		flex: none;
		width: var(--control-height);
		height: var(--control-height);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		border: 1px solid var(--border);
		border-radius: var(--radius-s);
		background: var(--surface);
		color: var(--text-muted);
		font-size: 1.1rem;
		line-height: 1;
		cursor: pointer;
		transition:
			border-color var(--transition-fast),
			color var(--transition-fast),
			background var(--transition-fast);
	}

	.pipette:hover {
		border-color: var(--link);
		color: var(--link);
	}

	.pipette[aria-pressed="true"] {
		border-color: var(--link);
		color: var(--link);
		background: color-mix(in srgb, var(--accent) 10%, var(--surface));
	}
</style>
