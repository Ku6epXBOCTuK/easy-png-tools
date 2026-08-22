<script lang="ts">
	import { ACCEPTED_IMAGE_TYPES, isSupportedImage, unsupportedImageMessage } from '$lib/core/io';

	interface Props {
		onFile: (file: File) => void;
		onError?: (message: string) => void;
		label?: string;
	}

	let { onFile, onError, label = 'Перетащите изображение сюда или нажмите, чтобы выбрать файл' }: Props =
		$props();

	let input = $state<HTMLInputElement | undefined>();
	let depth = $state(0);
	const dragging = $derived(depth > 0);

	function enter() {
		depth += 1;
	}

	function leave() {
		depth = Math.max(0, depth - 1);
	}

	function over(event: DragEvent) {
		event.preventDefault();
	}

	function end() {
		depth = 0;
	}

	function accept(file: File | undefined | null) {
		if (!file) return;
		if (!isSupportedImage(file)) {
			onError?.(unsupportedImageMessage(file));
			return;
		}
		onFile(file);
	}

	function openPicker() {
		input?.click();
	}
</script>

<div
	class="dropzone panel"
	class:dragging
	role="button"
	tabindex="0"
	aria-label={label}
	onclick={openPicker}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			openPicker();
		}
	}}
	ondragenter={enter}
	ondragleave={leave}
	ondragover={over}
	ondragend={end}
	ondrop={(e) => {
		e.preventDefault();
		depth = 0;
		accept(e.dataTransfer?.files[0]);
	}}
>
	<span aria-hidden="true" class="icon">⬇</span>
	{label}
</div>
<input
	bind:this={input}
	type="file"
	accept={ACCEPTED_IMAGE_TYPES}
	hidden
	onchange={() => {
		accept(input?.files?.[0]);
		if (input) {
			input.value = '';
		}
	}}
/>

<style>
	.dropzone {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		min-height: 14rem;
		padding: var(--space-4);
		border-style: dashed;
		color: var(--text-muted);
		text-align: center;
		cursor: pointer;
		user-select: none;
		transition:
			border-color var(--transition-fast),
			background var(--transition-fast);
	}

	.dropzone:hover,
	.dropzone:focus-visible,
	.dragging {
		border-color: var(--accent);
		background: color-mix(in srgb, var(--accent) 6%, var(--surface));
	}

	.icon {
		font-size: 1.8rem;
		line-height: 1;
	}
</style>
