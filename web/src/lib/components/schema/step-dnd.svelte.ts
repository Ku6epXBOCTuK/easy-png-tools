import type { Draggable } from "@dnd-kit/dom";
import { isSortable } from "@dnd-kit/dom/sortable";

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

export interface StepDragAnchor {
	left: number;
	width: number;
	// Pointer Y and the source card's top at drag start: the overlay aligns
	// its source row under the cursor.
	startY: number;
	sourceTop: number;
}

// Step-reorder state for SchemaToolView. Dragging a card handle opens a
// compact overlay list (StepReorderOverlay) instead of reshaping the page:
// the page keeps its layout and scroll position, drop targeting is computed
// against the overlay rows.
export function createStepDnd({ onMove }: StepDndOptions) {
	let activeData = $state<StepDragData | null>(null);
	let indicatorSlot = $state<number | null>(null);
	let sourceIndex = $state<number | null>(null);
	let anchor = $state<StepDragAnchor | null>(null);
	let listEl: HTMLElement | null = null;

	// Slot in full-list coordinates: how many overlay rows have their midpoint
	// above the pointer. Rows are uniform single-line height.
	function slotAt(position: { x: number; y: number }): number | null {
		const el = listEl;
		if (!el || el.childElementCount === 0) return null;
		const rect = el.getBoundingClientRect();
		if (position.x < rect.left || position.x > rect.right) return null;
		const count = el.childElementCount;
		const rowH = el.scrollHeight / count;
		if (rowH <= 0) return null;
		const offsetY = position.y - rect.top + el.scrollTop;
		const slot = Math.floor(offsetY / rowH + 0.5);
		return Math.min(Math.max(slot, 0), count);
	}

	function onDragStart(event: DndEvent) {
		const source = event.operation?.source;
		if (!source) return;
		activeData = (source.data as StepDragData | undefined) ?? null;
		if (isSortable(source)) sourceIndex = source.sortable.initialIndex;
		const el = source.element as HTMLElement | undefined;
		const rect = el?.getBoundingClientRect();
		const position = event.operation?.position?.current;
		if (rect) {
			anchor = {
				left: rect.left,
				width: rect.width,
				startY: position?.y ?? rect.top + rect.height / 2,
				sourceTop: rect.top,
			};
		}
	}

	function onDragOver(event: DndEvent) {
		const position = event.operation?.position?.current;
		indicatorSlot = position ? slotAt(position) : null;
	}

	function onDragEnd(event: DndEvent) {
		const position = event.operation?.position?.current;
		const slot = event.canceled || !position ? null : slotAt(position);
		const from = sourceIndex;
		activeData = null;
		indicatorSlot = null;
		sourceIndex = null;
		anchor = null;
		if (from === null || slot === null) return;
		// Slots include the source row; moveStep wants the compressed index.
		const to = slot > from ? slot - 1 : slot;
		if (to === from) return;
		onMove(from, to);
	}

	function registerList(el: HTMLElement | null) {
		listEl = el;
	}

	return {
		get activeData() {
			return activeData;
		},
		get active() {
			return activeData !== null;
		},
		get indicatorSlot() {
			return indicatorSlot;
		},
		get sourceIndex() {
			return sourceIndex;
		},
		get anchor() {
			return anchor;
		},
		onDragStart,
		onDragOver,
		onDragEnd,
		registerList,
	};
}

export type StepDnd = ReturnType<typeof createStepDnd>;
