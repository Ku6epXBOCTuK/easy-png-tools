<script lang="ts">
	interface Props {
		height?: number;
	}

	let { height = 0 }: Props = $props();
</script>

<div
	class="step-drop-indicator"
	style:height={height > 0 ? `${height}px` : null}
></div>

<style>
	.step-drop-indicator {
		border: var(--size-border-thick) dashed var(--color-main);
		background: var(--color-panel);
		opacity: 0.6;
		min-height: var(--space-xxl);
		pointer-events: none;
		flex-shrink: 0;
	}
</style>
