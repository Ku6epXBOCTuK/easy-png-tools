<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		children: Snippet;
	}
	let { children }: Props = $props();
</script>

<footer class="settings-footer">{@render children()}</footer>

<style>
	.settings-footer {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: var(--space-m);
		padding: var(--space-l) var(--space-xl);
		border-top: var(--size-border) solid var(--color-border);
	}
</style>
