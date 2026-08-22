<script lang="ts">
	import { downloadBlob, encode } from '$lib/core/io';
	import type { PixelImage } from '$lib/core/types';
	import type { OutputFormat } from '$lib/registry';

	let {
		image,
		format,
		baseName,
		params,
		onError
	}: {
		image: PixelImage | null;
		format?: OutputFormat;
		baseName: string;
		params: Record<string, unknown>;
		onError?: (e: unknown) => void;
	} = $props();

	let busy = $state(false);

	async function download() {
		if (!image || !format || busy) return;
		busy = true;
		try {
			const raw = format.qualityParamId ? params[format.qualityParamId] : undefined;
			const quality =
				typeof raw === 'number' ? Math.min(Math.max(raw, 1), 100) / 100 : undefined;
			const blob = await encode(image, format.mime, quality);
			downloadBlob(blob, `${baseName}.${format.ext}`);
		} catch (e) {
			onError?.(e);
		} finally {
			busy = false;
		}
	}
</script>

<button class="primary" onclick={download} disabled={!image || !format || busy}>
	{busy ? 'Готовим файл…' : `Скачать .${format?.ext ?? 'png'}`}
</button>
