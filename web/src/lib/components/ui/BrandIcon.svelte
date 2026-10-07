<script lang="ts">
	interface Props {
		path: string;
		size?: number;
	}
	let { path, size = 16 }: Props = $props();
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="currentColor"
	aria-hidden="true"
>
	<path d={path} />
</svg>
