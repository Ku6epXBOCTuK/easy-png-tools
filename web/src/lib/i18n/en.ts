import type { Dict } from './dict';

export const en: Dict = {
	header: {
		workspace: 'Workspace',
		catalog: 'Catalog',
		sectionsAria: 'Sections',
		footerNote:
			'All operations run locally in your browser — your files are never uploaded anywhere.'
	},
	categories: {
		convert: 'Convert',
		alpha: 'Transparency',
		color: 'Color',
		geometry: 'Geometry',
		filters: 'Filters',
		text: 'Text',
		analyze: 'Analyze',
		generate: 'Generate'
	},
	home: {
		defaultTitle: 'easy-png-tools — PNG utilities right in your browser',
		heroTitle: 'What do you want to do with the image?',
		heroLead: 'Find a tool — everything runs locally in your browser.',
		restoreLast: '↩ Restore last: {title}',
		changeTool: '← Change tool'
	},
	catalog: {
		pageTitle: 'All tools — easy-png-tools',
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
		busyTitle: 'Processing…',
		busyHint: 'Running chain step',
		removeStepAria: 'Remove step'
	},
	sourceCard: {
		replaceImage: 'Replace image'
	},
	resultCard: {
		emptyTitle: 'The result will appear here',
		emptyHint: 'First upload a source image on the left',
		processingTitle: 'Processing…',
		processingHint: 'The image is being processed, this will take a moment',
		recalc: 'Recalculating…',
		nextTool: '⛓ Next tool',
		breakChain: '✂ Break the chain'
	},
	paramsCard: {
		noParams: 'This tool has no parameters — the result is ready as is.'
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
		busy: 'Preparing file…',
		file: 'Download .{ext}'
	},
	infoPanel: {
		dimensions: 'Dimensions',
		alpha: 'Alpha channel',
		alphaYes: 'yes — there are semi-transparent pixels',
		alphaNo: 'no',
		colorCount: 'Unique colors (RGBA)'
	},
	dropZone: {
		pickDefault: 'Drop an image here or click to choose a file',
		overlayDefault: 'Release the file to replace the image'
	},
	search: {
		placeholder: 'Find a tool…',
		aria: 'Search tools',
		nothingFound: 'Nothing found — try another word.'
	},
	ui: {
		showMask: 'Show mask',
		decrease: 'Decrease',
		increase: 'Increase',
		reset: 'Reset',
		pipette: 'Eyedropper',
		themeLight: 'Light theme',
		themeDark: 'Dark theme',
		overlayTitle: 'Watermark',
		overlayDrop: 'Drop a watermark PNG or click',
		overlayRemove: 'Remove watermark'
	},
	errors: {
		noImageRun: 'This tool does not process images',
		workerFailed: 'Worker execution failed',
		workerUnavailable: 'Worker is unavailable',
		notFound: 'Tool not found',
		noWatermark: 'Pick a watermark image first',
		badTransform: 'Degenerate transformation matrix',
		skewAngle: 'Skew angles cannot be 90° or -90°',
		badHex: 'Invalid HEX color: "{value}"',
		radiusInt: 'Radius must be a non-negative integer',
		kernelSize: 'Kernel does not match the image dimensions',
		sizeInt: 'Width and height must be integers ≥ 1',
		cropBounds: 'Crop area does not intersect the image',
		noCanvasCtx: 'Canvas 2D context is unavailable in this environment',
		badBase64: 'Expected a base64 string or a data-uri of an image',
		qualityRange: 'quality must be within 0..1',
		svgSize: 'Could not determine SVG dimensions',
		svgLoad: 'Failed to load SVG — check the markup',
		encodeUnsupported: 'The browser does not support encoding to {mime}',
		unsupportedFile:
			'Unsupported file format ({type}). Supported formats are PNG, JPEG, WebP, GIF and BMP.',
		widthInt: 'Image width must be an integer ≥ 1',
		noHexPixels: 'No hex pixel values found',
		badPixelToken: 'Each pixel must be 8 hex characters RRGGBBAA, separated by spaces',
		pixelCountMismatch: 'Pixel count ({count}) is not divisible by width {width} without a remainder',
		toolNotFound: 'Tool "{id}" not found',
		badJson: 'The file is not valid JSON',
		badPipelineShape: 'The file structure does not look like a chain of steps',
		pipelineVersion: 'Unsupported chain version: {version}',
		noSteps: 'The file has no list of steps',
		paramNumber: 'Parameter "{id}" must be a number',
		paramString: 'Parameter "{id}" must be a string',
		paramBool: 'Parameter "{id}" must be a checkbox value',
		resizeSize: 'Width and/or height must be positive',
		cropSize: 'Crop width and height must be positive',
		sizePositive: 'Dimensions must be positive and finite'
	},
	tools: {
		'verify-is-png': {
			results: {
				verifyYes: 'Yes — this is a valid PNG signature.',
				verifyNo: 'No — the signature does not match a PNG file.'
			}
		},
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
