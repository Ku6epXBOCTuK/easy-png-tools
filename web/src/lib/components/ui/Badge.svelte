<script lang="ts">
	import { Check } from "@lucide/svelte";

	// TODO: сделать эти типы общими для кнопок \ бейджей \ етц???
	const ToneVariantDefine = {
		DEFAULT: "default",
		ACCENT: "accent",
		SUCCESS: "success",
		WARNING: "warning",
		DANGER: "danger",
		INFO: "info",
	} as const;
	type ToneVariant = (typeof ToneVariantDefine)[keyof typeof ToneVariantDefine];

	const BadgeVariantDefine = {
		DEFAULT: "default",
		OUTLINE: "outline",
		CLEAR: "clear",
	} as const;
	type BadgeVariant =
		(typeof BadgeVariantDefine)[keyof typeof BadgeVariantDefine];

	interface Props {
		tone?: ToneVariant;
		variant?: BadgeVariant;
		check?: boolean;
		label?: string;
	}

	let {
		tone = ToneVariantDefine.DEFAULT,
		variant = BadgeVariantDefine.DEFAULT,
		check = false,
		label = "",
	}: Props = $props();
</script>

<span class="badge badge-tone--{tone} badge-variant--{variant}">
	{#if check}<Check size={12} />{/if}
	{label}
</span>

<style>
	.badge {
		display: flex;
		align-items: center;
		gap: var(--space-s);
		line-height: normal;
		font-family: var(--font-mono);
		font-size: var(--font-size-s);
		font-weight: bold;
		border-width: var(--size-border-thick);
		padding: var(--space-s) var(--space-m);
	}

	.badge-tone--default {
		--color-badge-main: var(--color-main);
		--color-badge-tint: var(--color-main-tint);
	}
	.badge-tone--accent {
		--color-badge-main: var(--color-accent);
		--color-badge-tint: var(--color-accent-tint);
	}
	.badge-tone--success {
		--color-badge-main: var(--color-success);
		--color-badge-tint: var(--color-success-tint);
	}
	.badge-tone--danger {
		--color-badge-main: var(--color-danger);
		--color-badge-tint: var(--color-danger-tint);
	}
	.badge-tone--warning {
		--color-badge-main: var(--color-warning);
		--color-badge-tint: var(--color-warning-tint);
	}
	.badge-tone--info {
		--color-badge-main: var(--color-info);
		--color-badge-tint: var(--color-info-tint);
	}

	.badge-variant--default {
		background-color: var(--color-badge-main);
		border-color: var(--color-badge-main);
		color: var(--color-background);
	}

	.badge-variant--outline {
		background-color: transparent;
		border-color: var(--color-badge-tint);
		color: var(--color-badge-tint);
	}

	.badge-variant--clear {
		background-color: transparent;
		border-color: transparent;
		color: var(--color-badge-tint);
	}
</style>
