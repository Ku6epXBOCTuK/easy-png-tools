<script lang="ts">
	import { Copy } from "@lucide/svelte";
	import IconButton from "./ui/IconButton.svelte";

	interface Props {
		code: string;
		lang?: string;
		copyable?: boolean;
		oncopy?: () => void;
	}
	let { code, lang, copyable = false, oncopy }: Props = $props();
</script>

<div class="code-block">
	{#if lang}<span class="code-lang">{lang}</span>{/if}
	<pre class="code-pre"><code>{code}</code></pre>
	{#if copyable}
		<div class="code-copy">
			<IconButton icon={Copy} label="Copy" onclick={() => oncopy?.()} />
		</div>
	{/if}
</div>

<style>
	.code-block {
		position: relative;
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-m);
		background: var(--color-background);
		padding: var(--space-m) var(--space-l);
	}
	.code-lang {
		font-family: var(--font-mono);
		font-size: var(--font-size-s);
		text-transform: uppercase;
		color: var(--color-text-muted);
	}
	.code-pre {
		margin: 0;
		overflow: auto;
		font-family: var(--font-mono);
		font-size: var(--font-size-s);
		color: var(--color-text);
	}
	.code-copy {
		position: absolute;
		top: var(--space-s);
		right: var(--space-s);
	}
</style>
