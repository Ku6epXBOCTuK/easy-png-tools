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
		border-top: 1px solid var(--line);
		grid-template-columns: repeat(3, 1fr);
		gap: 8px;
		padding-top: 14px;
		display: grid;
	}
</style>
