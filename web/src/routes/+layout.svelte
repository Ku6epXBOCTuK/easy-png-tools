<script lang="ts">
	import favicon from "$lib/assets/favicon.svg";
	import { onMount } from "svelte";
	import { initLocale } from "$lib/i18n/locale.svelte";
	import { initTheme } from "$lib/theme.svelte";

	let { children } = $props();

	onMount(() => {
		initLocale();
		initTheme();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<style>
	/* Порядок cascade-слоёв для всего документа (грузится на всех маршрутах):
	   app = старый дизайн ((old)), design = новый (preview/*). design выигрывает
	   у app на совпадающих правилах независимо от порядка <link> / истории
	   SPA-навигации. Содержимое слоёв — в app.css (@layer app) и design2.css
	   (@layer design). */
	@layer app, design;
</style>
