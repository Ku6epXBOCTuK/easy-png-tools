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
		gap: var(--space-m);
		min-height: var(--size-panel-min-height);
		padding: var(--space-xxxl);
		border: var(--size-border) dashed var(--color-border);
		border-radius: var(--radius-m);
		color: var(--color-text-muted);
		background: var(--color-background);
		cursor: pointer;
		text-align: center;
		transition:
			border-color var(--duration-s) ease,
			background var(--duration-s) ease;
	}
	.dropzone:hover,
	.dropzone:focus-visible,
	.dropzone.dragging {
		border-color: var(--color-main);
		color: var(--color-text);
		outline: none;
	}
	.dz-title {
		font: 600 var(--font-size-m) var(--font-mono);
		color: var(--color-text);
	}
	.dz-sub {
		font: var(--font-size-s) var(--font-mono);
		letter-spacing: var(--space-text-m);
	}
</style>
