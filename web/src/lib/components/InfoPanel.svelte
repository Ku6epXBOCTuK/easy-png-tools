<script lang="ts">
	import type { ImageInfo } from '$lib/core/analyze';

	let { info }: { info: ImageInfo | null } = $props();
</script>

{#if info}
	<dl>
		<div>
			<dt>Размеры</dt>
			<dd>{info.width} × {info.height} px</dd>
		</div>
		<div>
			<dt>Альфа-канал</dt>
			<dd>{info.hasAlpha ? 'есть — есть полупрозрачные пиксели' : 'нет'}</dd>
		</div>
		<div>
			<dt>Уникальных цветов (RGBA)</dt>
			<dd>{info.colorCount.toLocaleString('ru-RU')}</dd>
		</div>
	</dl>
{/if}

<style>
	dl {
		display: grid;
		gap: var(--space-2);
		margin: var(--space-3) 0;
	}

	dl > div {
		display: flex;
		justify-content: space-between;
		gap: var(--space-3);
		padding: var(--space-2) var(--space-3);
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-s);
	}

	dt {
		color: var(--text-muted);
	}

	dd {
		margin: 0;
		font-family: var(--font-mono);
	}
</style>
