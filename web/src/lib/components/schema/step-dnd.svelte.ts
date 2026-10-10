import type { Draggable, Droppable } from "@dnd-kit/dom";
import { isSortable, type SortableDraggable } from "@dnd-kit/dom/sortable";

export interface StepDragData {
	title: string;
}

interface StepDndOptions {
	// Compressed-index semantics: `to` counts items with the source excluded,
	// matching moveStep's remove-then-insert.
	onMove: (from: number, to: number) => void;
}

interface DndEvent {
	operation?: {
		source?: Draggable | null;
		position?: { current?: { x: number; y: number } } | null;
	};
	canceled?: boolean;
}

// Count the slot the pointer is over: how many non-source cards have their
// vertical midpoint above the pointer.
function indexAtPosition(
	source: SortableDraggable<StepDragData>,
	pointerY: number,
): number {
	const manager = source.sortable.manager;
	let index = 0;
	if (!manager) return index;
	for (const droppable of manager.registry.droppables) {
		if (!isSortable(droppable)) continue;
		if (droppable.sortable.id === source.id) continue;
		const el = (droppable as Droppable).element;
		if (!el) continue;
		const rect = el.getBoundingClientRect();
		if (rect.height === 0) continue;
		if (pointerY > rect.top + rect.height / 2) index++;
	}
	return index;
}

// Step-reorder state for SchemaToolView, single list. The dragged card is
// hidden (DragOverlay renders the ghost) and a dashed indicator of the
// dragged height marks the insertion slot between the remaining cards.
export function createStepDnd({ onMove }: StepDndOptions) {
	let activeData = $state<StepDragData | null>(null);
	let indicatorIndex = $state<number | null>(null);
	let dragHeight = $state(0);
	let sourceIndex = $state<number | null>(null);
	let sourceElement: HTMLElement | null = null;
	// Ghost positioning: current pointer, grab offset inside the card and the
	// card width. DragOverlay is not used -- the Feedback plugin skips
	// draggables with feedback: "none", so the ghost follows the pointer here.
	let pointer = $state<{ x: number; y: number } | null>(null);
	let grabOffset = $state<{ x: number; y: number }>({ x: 0, y: 0 });
	let ghostWidth = $state(0);
	// X-range of the source card: dragging sideways over the preview panel
	// must not light up the indicator.
	let sourceX: { left: number; right: number } | null = null;

	function computeIndicator(event: DndEvent): number | null {
		const source = event.operation?.source;
		if (!source || !isSortable(source)) return null;
		const position = event.operation?.position?.current;
		if (!position || !sourceX) return null;
		if (position.x < sourceX.left || position.x > sourceX.right) return null;
		return indexAtPosition(
			source as SortableDraggable<StepDragData>,
			position.y,
		);
	}

	function onDragStart(event: DndEvent) {
		const source = event.operation?.source;
		if (!source) return;
		activeData = (source.data as StepDragData | undefined) ?? null;
		sourceElement = (source.element as HTMLElement | undefined) ?? null;
		const rect = sourceElement?.getBoundingClientRect();
		dragHeight = rect?.height ?? 0;
		ghostWidth = rect?.width ?? 0;
		sourceX = rect ? { left: rect.left, right: rect.right } : null;
		const start = event.operation?.position?.current;
		grabOffset =
			start && rect
				? { x: start.x - rect.left, y: start.y - rect.top }
				: { x: 0, y: 0 };
		pointer = start ?? null;
		if (isSortable(source)) sourceIndex = source.sortable.initialIndex;
		if (sourceElement) sourceElement.style.display = "none";
	}

	function onDragOver(event: DndEvent) {
		pointer = event.operation?.position?.current ?? pointer;
		indicatorIndex = computeIndicator(event);
	}

	function onDragEnd(event: DndEvent) {
		const drop = event.canceled ? null : computeIndicator(event);
		if (sourceElement) {
			sourceElement.style.display = "";
			sourceElement = null;
		}
		const from = sourceIndex;
		activeData = null;
		indicatorIndex = null;
		dragHeight = 0;
		sourceIndex = null;
		sourceX = null;
		pointer = null;
		if (from === null || drop === null || drop === from) return;
		onMove(from, drop);
	}

	// Slots render in the full list where the hidden source still occupies
	// its DOM position: a compressed index at/past the source shifts by 1.
	function isIndicatorAt(slot: number): boolean {
		if (indicatorIndex === null) return false;
		let renderIndex = indicatorIndex;
		if (sourceIndex !== null && indicatorIndex >= sourceIndex) {
			renderIndex += 1;
		}
		return renderIndex === slot;
	}

	return {
		get activeData() {
			return activeData;
		},
		get dragHeight() {
			return dragHeight;
		},
		get pointer() {
			return pointer;
		},
		get grabOffset() {
			return grabOffset;
		},
		get ghostWidth() {
			return ghostWidth;
		},
		get active() {
			return activeData !== null;
		},
		onDragStart,
		onDragOver,
		onDragEnd,
		isIndicatorAt,
	};
}

export type StepDnd = ReturnType<typeof createStepDnd>;
