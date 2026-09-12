<script lang="ts">
	import { Download } from "@lucide/svelte";
	import Button from "./Button.svelte";

	interface Props {
		label: string;
		onclick?: () => void;
		disabled?: boolean;
	}
	let { label, onclick, disabled = false }: Props = $props();
</script>

<Button icon={Download} {label} {onclick} {disabled} />
