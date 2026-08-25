import type { Dict } from './dict';

export const en: Dict = {
	header: {
		workspace: 'Workspace',
		catalog: 'Catalog',
		sectionsAria: 'Sections',
		footerNote:
			'All operations run locally in your browser вЂ” your files are never uploaded anywhere.'
	},
	categories: {
		convert: 'Convert',
		alpha: 'Transparency',
		color: 'Color',
		geometry: 'Geometry',
		filters: 'Filters',
		analyze: 'Analyze',
		generate: 'Generate'
	},
	home: {
		defaultTitle: 'easy-png-tools вЂ” PNG utilities right in your browser',
		heroTitle: 'What do you want to do with the image?',
		heroLead: 'Find a tool вЂ” everything runs locally in your browser.',
		restoreLast: 'в†© Restore last: {title}',
		changeTool: 'в†ђ Change tool'
	},
	catalog: {
		pageTitle: 'All tools вЂ” easy-png-tools',
		metaDescription:
			'Full catalog of PNG utilities: convert, transparency, color, geometry, analysis and image generation.',
		heading: 'Tool catalog',
		lead: '{count} utilities for working with PNG. Everything runs locally in your browser.'
	},
	toolPage: {
		fallbackTitle: 'Tool',
		legendSource: 'Source',
		legendSummary: 'Summary',
		legendResult: 'Result',
		legendParams: 'Parameters',
		stepHeading: 'Step {n}',
		removeStepAria: 'Remove step',
		stepError: 'Step {n} ({title}): {msg}'
	},
	chain: {
		stepLabel: 'Step {n}: {title}',
		inputLegend: 'Input',
		resultLegend: 'Result',
		paramsLegend: 'Parameters',
		busyTitle: 'ProcessingвЂ¦',
		busyHint: 'Running chain step',
		removeStepAria: 'Remove step'
	},
	sourceCard: {
		replaceImage: 'Replace image'
	},
	resultCard: {
		emptyTitle: 'The result will appear here',
		emptyHint: 'First upload a source image on the left',
		processingTitle: 'ProcessingвЂ¦',
		processingHint: 'The image is being processed, this will take a moment',
		recalc: 'RecalculatingвЂ¦',
		nextTool: 'в›“ Next tool',
		breakChain: 'вњ‚ Break the chain'
	},
	paramsCard: {
		noParams: 'This tool has no parameters вЂ” the result is ready as is.'
	},
	textInput: {
		heading: 'Text',
		placeholder: 'Paste data here',
		aria: 'Text data',
		decode: 'Decode'
	},
	textResult: {
		outputAria: 'Text result',
		copied: 'Copied',
		copy: 'Copy',
		downloadTxt: 'Download .txt'
	},
	download: {
		busy: 'Preparing fileвЂ¦',
		file: 'Download .{ext}'
	},
	infoPanel: {
		dimensions: 'Dimensions',
		alpha: 'Alpha channel',
		alphaYes: 'yes вЂ” there are semi-transparent pixels',
		alphaNo: 'no',
		colorCount: 'Unique colors (RGBA)'
	},
	dropZone: {
		pickDefault: 'Drop an image here or click to choose a file',
		overlayDefault: 'Release the file to replace the image'
	},
	search: {
		placeholder: 'Find a toolвЂ¦',
		aria: 'Search tools',
		nothingFound: 'Nothing found вЂ” try another word.'
	},
	ui: {
		showMask: 'Show mask',
		decrease: 'Decrease',
		increase: 'Increase',
		reset: 'Reset',
		pipette: 'Eyedropper'
	},
	errors: {
		noImageRun: 'This tool does not process images',
		workerFailed: 'Worker execution failed',
		workerUnavailable: 'Worker is unavailable',
		notFound: 'Tool not found'
	},
	tools: {
		'png-is-grayscale': {
			results: {
				grayscaleYes: 'Yes — all pixels are shades of gray.',
				grayscaleNo: 'No — colored pixels were found.'
			}
		},
		'png-is-transparent': {
			results: {
				transparentYes: 'Yes — there are transparent or semi-transparent pixels.',
				transparentNo: 'No — all pixels are fully opaque.'
			}
		},
		'png-orientation': {
			results: {
				orientationPortrait: 'Portrait — height is greater than width.',
				orientationLandscape: 'Landscape — width is greater than height.',
				orientationSquare: 'Square — the sides are equal.'
			}
		}
	}
};
