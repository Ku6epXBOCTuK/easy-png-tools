<script lang="ts">
	import type { ImageInfo } from '$lib/core/analyze';

	interface Props {
		info: ImageInfo | null;
	}

	let { info }: Props = $props();
</script>

{#if info}
	<dl>
		<div class="panel">
			<dt>Размеры</dt>
			<dd>{info.width} × {info.height} px</dd>
		</div>
		<div class="panel">
			<dt>Альфа-канал</dt>
			<dd>{info.hasAlpha ? 'есть — есть полупрозрачные пиксели' : 'нет'}</dd>
		</div>
		<div class="panel">
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
	}

	dt {
		color: var(--text-muted);
	}

	dd {
		margin: 0;
		font-family: var(--font-mono);
	}
</style>
