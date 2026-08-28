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
