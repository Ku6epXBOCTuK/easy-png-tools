<script lang="ts">
	interface Props {
		caption: string;
		value: string;
	}
	let { caption, value }: Props = $props();
</script>

<div class="meta-row">
	<span class="meta-caption">{caption}</span>
	<b class="meta-value">{value}</b>
</div>

<style>
	.meta-row {
		gap: var(--space-s);
		display: grid;
	}
	.meta-caption {
		font-family: var(--font-mono);
		font-size: var(--font-size-s);
		color: var(--color-text-muted);
		line-height: normal;
	}
	.meta-value {
		margin-top: var(--space-s);
		line-height: normal;
		font: var(--font-size-s) var(--font-mono);
		color: var(--color-text);
	}
</style>
