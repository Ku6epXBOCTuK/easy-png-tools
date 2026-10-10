<script lang="ts">
	import StepCard from "$lib/components/display/StepCard.svelte";
	import type { ChainStep } from "$lib/pipeline.svelte";
	import { createSortable } from "@dnd-kit/svelte/sortable";
	import type { Snippet } from "svelte";

	interface Props {
		step: ChainStep;
		index: number;
		title: string;
		collapsed?: boolean;
		tools?: Snippet;
		children?: Snippet;
		onremove?: () => void;
		ontoggle?: () => void;
	}

	let {
		step,
		index,
		title,
		collapsed = false,
		tools,
		children,
		onremove,
		ontoggle,
	}: Props = $props();

	// feedback: "none" -- no transform shifting; step-dnd.svelte.ts hides the
	// source and renders a dashed drop indicator instead.
	const sortable = createSortable({
		get id() {
			return step.key;
		},
		get index() {
			return index;
		},
		group: "steps",
		type: "step",
		accept: "step",
		feedback: "none",
		get data() {
			return { title };
		},
	});
</script>

<StepCard
	index={index + 1}
	{title}
	{collapsed}
	{tools}
	{children}
	{onremove}
	{ontoggle}
	elementAttachment={sortable.attach}
	handleAttachment={sortable.attachHandle}
/>
