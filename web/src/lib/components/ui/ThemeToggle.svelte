<script lang="ts">
	import { Moon, Sun } from "@lucide/svelte";
	import IconButton from "../ui/IconButton.svelte";

	interface Props {
		theme: "light" | "dark";
		ontoggle: () => void;
	}

	let { theme, ontoggle }: Props = $props();

	// TODO: change icon animations - custom button instead of IconButton
</script>

<IconButton
	icon={theme === "light" ? Moon : Sun}
	label="Toggle theme"
	variant="clear"
	onclick={ontoggle}
/>
