<script lang="ts">
	import { SITE_URL } from "$lib/seo";

	interface Props {
		title: string;
		description: string;
		/** Путь страницы от корня роутера ("/", "/list-tools", "/tools/…"). */
		path: string;
	}
	let { title, description, path }: Props = $props();

	const url = $derived(`${SITE_URL}${path}`);
	const image = `${SITE_URL}/og/default.png`;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="easy-png-tools" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={image} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
</svelte:head>
