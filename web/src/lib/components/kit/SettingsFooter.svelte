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
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		border-top: 1px solid var(--line);
	}
</style>
