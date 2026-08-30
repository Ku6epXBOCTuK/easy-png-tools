<script lang="ts">
	import FileChip from "$lib/components/kit/FileChip.svelte";

	interface FileInfo {
		name: string;
		size?: string;
	}

	interface Props {
		eyebrowA: string;
		eyebrowB?: string;
		title: string;
		lede?: string;
		file?: FileInfo;
	}

	let { eyebrowA, eyebrowB, title, lede, file }: Props = $props();
</script>

<div class="eyebrow">
	{eyebrowA} <span>/</span>
	{eyebrowB}
</div>
<div class="title-row">
	<div>
		<h1>{title}</h1>
		{#if lede}<p class="lede">{lede}</p>{/if}
	</div>
	{#if file}
		<FileChip name={file.name} size={file.size} />
	{/if}
</div>

<style>
	.eyebrow {
		font: 10px var(--font-mono);
		letter-spacing: 0.12em;
		color: var(--blue);
		margin-bottom: 18px;
	}
	.eyebrow span {
		margin: 0 7px;
		color: var(--muted);
	}
	.title-row {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 30px;
		margin-bottom: 56px;
	}
	h1 {
		margin: 0 0 16px;
		font-size: clamp(36px, 4vw, 64px);
		font-weight: 650;
		line-height: 1;
		letter-spacing: -0.06em;
		color: var(--foreground);
		max-width: 700px;
	}
	.lede {
		margin: 0;
		max-width: 550px;
		color: var(--muted);
		line-height: 1.6;
	}
	@media (max-width: 800px) {
		.title-row {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
