<script lang="ts">
	interface Props {
		caption: string;
		value: string;
	}
	let { caption, value }: Props = $props();
</script>

<div class="meta-row">
	<span class="meta-caption">{caption}</span>
	<span class="meta-value">{value}</span>
</div>

<style>
	.meta-row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.25rem 0;
	}
	.meta-caption {
		font-family: var(--font-mono);
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--muted);
	}
	.meta-value {
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--foreground);
	}
</style>
