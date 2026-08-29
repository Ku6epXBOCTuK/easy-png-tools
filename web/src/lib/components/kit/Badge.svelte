<script lang="ts">
	import type { Snippet } from "svelte";
	import { Check } from "@lucide/svelte";

	type Tone = "default" | "accent" | "success" | "amber";

	interface Props {
		tone?: Tone;
		check?: boolean;
		children: Snippet;
	}
	let { tone = "default", check = false, children }: Props = $props();
</script>

<span class="badge badge--{tone}">
	{#if check}<Check size={12} />{/if}
	{#if children}{@render children()}{/if}
</span>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-family: var(--font-mono);
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		padding: 0.15rem 0.45rem;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		color: var(--muted);
	}
	.badge--accent {
		color: var(--blue);
		border-color: color-mix(in srgb, var(--blue) 40%, var(--line));
	}
	.badge--success {
		color: var(--success);
		border-color: color-mix(in srgb, var(--success) 40%, var(--line));
	}
	.badge--amber {
		color: var(--amber);
		border-color: color-mix(in srgb, var(--amber) 40%, var(--line));
	}
</style>
