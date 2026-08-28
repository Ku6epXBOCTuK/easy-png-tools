<script lang="ts">
	import { Upload } from "@lucide/svelte";

	interface Props {
		accept?: string;
		onfile?: (file: File) => void;
	}
	let { accept = "image/*", onfile }: Props = $props();

	let dragging = $state(false);
	let input = $state<HTMLInputElement | null>(null);

	function handleFiles(files: FileList | null | undefined) {
		const file = files?.[0];
		if (file) onfile?.(file);
	}

	function onDrop(e: DragEvent) {
		e.preventDefault();
		dragging = false;
		handleFiles(e.dataTransfer?.files);
	}

	function open() {
		input?.click();
	}
</script>

<div
	class="dropzone"
	class:dragging
	role="button"
	tabindex="0"
	ondragover={(e) => {
		e.preventDefault();
		dragging = true;
	}}
	ondragleave={() => (dragging = false)}
	ondrop={onDrop}
	onclick={open}
	onkeydown={(e) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			open();
		}
	}}
>
	<input
		bind:this={input}
		type="file"
		{accept}
		hidden
		onchange={(e) => handleFiles((e.target as HTMLInputElement).files)}
	/>
	<Upload size={22} />
	<span class="dz-title">Drop a PNG here</span>
	<span class="dz-sub">or click to browse — processed locally</span>
</div>

<style>
	.dropzone {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		min-height: 220px;
		padding: 2rem;
		border: 1px dashed var(--line);
		border-radius: var(--radius);
		color: var(--muted);
		background: var(--background);
		cursor: pointer;
		text-align: center;
		transition:
			border-color 0.15s ease,
			background 0.15s ease;
	}
	.dropzone:hover,
	.dropzone:focus-visible,
	.dropzone.dragging {
		border-color: var(--blue);
		color: var(--foreground);
		outline: none;
	}
	.dz-title {
		font: 600 0.9rem var(--font-mono);
		color: var(--foreground);
	}
	.dz-sub {
		font: 10px var(--font-mono);
		letter-spacing: 0.04em;
	}
</style>
