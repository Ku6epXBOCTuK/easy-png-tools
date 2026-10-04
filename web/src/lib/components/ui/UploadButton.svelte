<script lang="ts">
	import { Upload } from "@lucide/svelte";
	import Icon from "./Icon.svelte";

	interface Props {
		label: string;
		accept?: string;
		onfile: (file: File) => void;
	}
	let { label, accept = "image/*", onfile }: Props = $props();
</script>

<label class="upload">
	<Icon icon={Upload} size={14} />
	{label}
	<input
		type="file"
		{accept}
		onchange={(e) => {
			const f = (e.target as HTMLInputElement).files?.[0];
			if (f) onfile(f);
		}}
	/>
</label>

<style>
	.upload {
		display: inline-flex;
		align-items: center;
		gap: var(--space-m);
		padding: var(--space-m) var(--space-l);
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-m);
		font: var(--font-size-s) var(--font-mono);
		color: var(--color-text-muted);
		cursor: pointer;
	}

	.upload:hover {
		color: var(--color-text);
		border-color: var(--color-text-muted);
	}

	.upload input {
		display: none;
	}
</style>
