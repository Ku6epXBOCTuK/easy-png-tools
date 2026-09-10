<script lang="ts">
	import { Download } from "@lucide/svelte";
	import Button from "./Button.svelte";

	interface Props {
		label: string;
		onclick?: () => void;
	}
	let { label, onclick }: Props = $props();
</script>

<Button icon={Download} {label} {onclick} />
