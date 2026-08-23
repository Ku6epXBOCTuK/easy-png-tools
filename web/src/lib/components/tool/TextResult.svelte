<script lang="ts">
	import { downloadBlob } from '$lib/core/io';

	interface Props {
		text: string;
		filename: string;
	}

	let { text, filename }: Props = $props();

	let copied = $state(false);

	async function copy() {
		await navigator.clipboard.writeText(text);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}

	function download() {
		downloadBlob(new Blob([text], { type: 'text/plain' }), `${filename}.txt`);
	}
</script>

<div class="panel text-result">
	<textarea class="output" rows="10" readonly value={text} aria-label="Текстовый результат"></textarea>
	<div class="actions">
		<button type="button" class="secondary" onclick={copy}>
			{copied ? 'Скопировано' : 'Копировать'}
		</button>
		<button type="button" class="primary" onclick={download}>Скачать .txt</button>
	</div>
</div>

<style>
	.text-result {
		padding: var(--space-3);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.output {
		width: 100%;
		resize: vertical;
		padding: var(--space-2);
		border: 1px solid var(--border);
		border-radius: var(--radius-s);
		background: var(--bg);
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		word-break: break-all;
	}

	.actions {
		display: flex;
		gap: var(--space-2);
	}

	.actions button {
		flex: 1;
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-s);
		border: 1px solid transparent;
		font-weight: 600;
		font-size: var(--text-m);
		cursor: pointer;
	}

	.actions .primary {
		background: var(--accent);
		color: var(--accent-contrast);
	}

	.actions .primary:hover {
		background: var(--accent-hover);
	}

	.actions .secondary {
		background: var(--surface);
		color: var(--text);
		border-color: var(--border);
	}

	.actions .secondary:hover {
		border-color: var(--accent);
		color: var(--accent);
	}
</style>
