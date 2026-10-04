<script lang="ts">
	import type { Component } from "svelte";
	import {
		ButtonVariantDefine,
		type ButtonVariant,
		type ButtonSize,
	} from "./define";
	import Button from "./Button.svelte";

	interface Props {
		icon: Component<{ size?: number; class?: string }>;
		label: string;
		onclick?: () => void;
		variant?: ButtonVariant;
		size?: ButtonSize;
		disabled?: boolean;
	}

	let {
		icon,
		label,
		onclick,
		variant = ButtonVariantDefine.PRIMARY,
		size = "m",
		disabled = false,
	}: Props = $props();
</script>

<Button
	label=""
	{onclick}
	{variant}
	{size}
	{disabled}
	{icon}
	ariaLabel={label}
/>
