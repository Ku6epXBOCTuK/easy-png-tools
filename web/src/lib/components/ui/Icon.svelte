<script lang="ts">
	import type { Component } from "svelte";

	interface Props {
		icon: Component<{ size?: number; class?: string }>;
		size?: number;
	}
	let { icon: IconComp, size = 16 }: Props = $props();
</script>

<IconComp {size} />
