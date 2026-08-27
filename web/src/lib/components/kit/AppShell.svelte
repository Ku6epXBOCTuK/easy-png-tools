<script lang="ts">
	import BlueprintGrid from './BlueprintGrid.svelte';

	let { children } = $props();
</script>

<div class="app-shell">
	<BlueprintGrid />
	<div class="app-content">
		{@render children()}
	</div>
</div>

<style>
	.app-shell {
		position: relative;
		min-height: 100dvh;
		background: var(--background);
		color: var(--foreground);
		font-family: var(--font-sans);
	}

	.app-content {
		position: relative;
		z-index: 1;
	}
</style>
