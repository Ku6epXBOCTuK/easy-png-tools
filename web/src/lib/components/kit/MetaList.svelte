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
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}
</style>
