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
		gap: 5px;
		display: grid;
	}
	.meta-caption {
		font-family: var(--font-mono);
		font-size: 9px;
		color: var(--muted);
		line-height: normal;
	}
	.meta-value {
		margin-top: 5px;
		line-height: normal;
		font: 11px var(--font-mono);
		color: var(--foreground);
	}
</style>
