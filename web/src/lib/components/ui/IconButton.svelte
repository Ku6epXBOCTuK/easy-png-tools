<script lang="ts">
	import type { Component } from "svelte";
	import { ButtonVariantDefine, type ButtonVariant } from "../define";
	import Button from "./Button.svelte";

	interface Props {
		icon: Component<{ size?: number; class?: string }>;
		label: string;
		onclick?: () => void;
		variant?: ButtonVariant;
		disabled?: boolean;
	}

	let {
		icon,
		label,
		onclick,
		variant = ButtonVariantDefine.PRIMARY,
		disabled = false,
	}: Props = $props();
</script>

<Button label="" {onclick} {variant} {disabled} {icon} ariaLabel={label} />
