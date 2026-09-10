<script lang="ts">
	import ToolPage from "$lib/v1/components/ToolPage.svelte";
	import { getTool } from "$lib/v1/registry";

	const base = getTool("linear-gradient-png")!;
</script>

<svelte:head>
	<title>Mockup: цепочка инструментов — easy-png-tools</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<section class="demo">
	<ToolPage
		tool={base}
		stageVariant="inline"
		presetBaseValues={{
			width: 520,
			height: 340,
			fromColor: "#e5484d",
			toColor: "#fbbf24",
			direction: "horizontal",
		}}
		presetChain={[
			{
				toolId: "remove-background-png",
				values: { color: "#fbbf24", tolerance: 10, outerOnly: true, smooth: 2 },
			},
			{ toolId: "add-stroke-png", values: { color: "#2563eb", thickness: 8 } },
			{ toolId: "round-corners-png", values: { radius: 28 } },
		]}
	/>
</section>

<style>
	.demo {
		max-width: 100rem;
		margin: 0 auto;
	}
</style>
