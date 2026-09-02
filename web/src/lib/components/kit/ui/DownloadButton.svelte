<script lang="ts">
	import { ArrowDownToLine, Download } from "@lucide/svelte";

	interface Props {
		label: string;
		onclick?: () => void;
	}
	let { label, onclick }: Props = $props();
</script>

<button class="download-btn" type="button" onclick={() => onclick?.()}>
	<Download size={16} />
	{label}
	<ArrowDownToLine size={14} />
</button>

<style>
	.download-btn {
		background: var(--color-main);
		color: var(--color-background);
		width: 100%;
		height: calc(5 * var(--space-m));
		font-size: var(--font-button);
		font-family: var(--font-mono);
		border: 0;
		justify-content: center;
		align-items: center;
		gap: var(--space-m);
		margin-top: var(--space-xl);
		display: flex;
		white-space: nowrap;
	}
	.download-btn:hover {
		background: var(--color-main-tint);
	}
</style>
