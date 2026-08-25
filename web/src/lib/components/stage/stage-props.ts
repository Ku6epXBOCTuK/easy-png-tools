import type { ImageInfo } from '$lib/core/analyze';
import type { PixelImage } from '$lib/core/types';
import type { ToolEntry } from '$lib/registry';

export type StageStatus = 'idle' | 'loaded' | 'processing' | 'error';

export interface StageProps {
	tool: ToolEntry;
	source: PixelImage | null;
	result: PixelImage | null;
	displayImage: PixelImage | null;
	info: ImageInfo | null;
	status: StageStatus;
	isInfo: boolean;
	isSourceless: boolean;
	isTextSource: boolean;
	textResult: string | null;
	sanitized: Record<string, any>;
	canChainBase: boolean;
	hasChain: boolean;
	hasMask: boolean;
	showMask: boolean;
	values: Record<string, any>;
	pipetteTargetId: string | null;
	handleFile: (file: File) => Promise<void> | void;
	onTextSubmit: (text: string) => Promise<void> | void;
	onSourceError: (e: unknown) => void;
	reset: () => void;
	toggleChain: () => void;
	handlePipetteToggle: (id: string) => void;
	handlePickColor: (hex: string) => void;
	showError: (e: unknown) => void;
	errorMessage: (e: unknown) => string;
}
