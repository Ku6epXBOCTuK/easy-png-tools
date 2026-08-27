<script lang="ts">
	import { Copy } from "@lucide/svelte";
	import IconButton from "./IconButton.svelte";

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
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--background);
		padding: 0.6rem 0.8rem;
	}
	.code-lang {
		font-family: var(--font-mono);
		font-size: 10px;
		text-transform: uppercase;
		color: var(--muted);
	}
	.code-pre {
		margin: 0;
		overflow: auto;
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--foreground);
	}
	.code-copy {
		position: absolute;
		top: 0.4rem;
		right: 0.4rem;
	}
</style>
