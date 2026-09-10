<script lang="ts">
	import type { Snippet } from "svelte";
	import MonoLabel from "./MonoLabel.svelte";

	interface Props {
		label: string;
		children: Snippet;
	}
	let { label, children }: Props = $props();
</script>

<div class="setting-group">
	<MonoLabel>{label}</MonoLabel>
	<div class="setting-control">{@render children()}</div>
</div>

<style>
	.setting-group {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-xl);
		padding: var(--space-m) var(--space-xl);
		border-bottom: var(--size-border) solid var(--color-border);
	}
	.setting-control {
		display: flex;
		align-items: center;
		gap: var(--space-m);
	}
</style>
