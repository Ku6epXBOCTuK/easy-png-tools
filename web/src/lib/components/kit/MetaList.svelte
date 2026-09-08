<script lang="ts">
	import MetaRow from "./MetaRow.svelte";

	interface Props {
		items: { caption: string; value: string }[];
	}
	let { items }: Props = $props();
</script>

<div class="meta-list">
	{#each items as item (item.caption)}
		<MetaRow caption={item.caption} value={item.value} />
	{/each}
</div>

<style>
	.meta-list {
		border-top: 1px solid var(--color-border);
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-m);
		padding-top: var(--space-l);
		display: grid;
	}
</style>
