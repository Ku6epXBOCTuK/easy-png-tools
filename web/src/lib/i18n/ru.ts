import type { Dict } from "./dict";

export const ru: Dict = {
	header: {
		workspace: "Рабочая область",
		catalog: "Каталог",
		sectionsAria: "Разделы",
		home: "Главная",
		uiKit: "UI Kit",
		footerNote:
			"Все операции выполняются локально в вашем браузере — файлы никуда не отправляются.",
	},
	categories: {
		all: "Все",
		convert: "Конвертация",
		alpha: "Прозрачность",
		color: "Цвет",
		geometry: "Геометрия",
		filters: "Фильтры",
		text: "Текст",
		analyze: "Анализ",
		generate: "Генерация",
	},
	home: {
		defaultTitle: "easy-png-tools — PNG-утилиты прямо в браузере",
		heroTitle: "Что делаем с изображением?",
		heroLead:
			"Найдите инструмент — все операции выполняются локально в браузере.",
		restoreLast: "↩ Вернуть последний: {title}",
		changeTool: "← Сменить инструмент",
	},
	catalog: {
		pageTitle: "Все инструменты — easy-png-tools",
		metaDescription:
			"Полный каталог PNG-утилит: конвертация, прозрачность, цвет, геометрия, анализ и генерация изображений.",
		heading: "Каталог инструментов",
		lead: "Утилиты для работы с PNG. Анализируйте, преобразуйте и экспортируйте — локально в браузере.",
		toolsAvailable: "Инструментов доступно",
		toolsCount: "Инструментов",
	},
	toolPage: {
		fallbackTitle: "Инструмент",
		legendSource: "Исходник",
		legendSummary: "Сводка",
		legendResult: "Результат",
		legendParams: "Параметры",
		stepHeading: "Шаг {n}",
		removeStepAria: "Убрать шаг",
		stepError: "Шаг {n} ({title}): {msg}",
	},
	chain: {
		stepLabel: "Шаг {n}: {title}",
		inputLegend: "Вход",
		resultLegend: "Результат",
		paramsLegend: "Параметры",
		busyTitle: "Обработка…",
		busyHint: "Выполняется шаг цепочки",
		removeStepAria: "Убрать шаг",
	},
	sourceCard: {
		source: "Источник",
		replaceImage: "Заменить изображение",
		chooseImage: "выберите изображение",
		noSource: "нет источника — настройте параметры",
		alt: "Исходное изображение",
	},
	resultCard: {
		emptyTitle: "Результат появится здесь",
		emptyHint: "Сначала загрузите исходное изображение слева",
		processingTitle: "Обработка…",
		processingHint: "Изображение обрабатывается, это займёт немного времени",
		recalc: "Пересчёт…",
		nextTool: "⛓ Следующий инструмент",
		breakChain: "✂ Оборвать цепочку",
		noResult: "результата пока нет",
		result: "Результат",
		previewPanel: "Предпросмотр",
		parts: "частей",
		format: "Формат",
		alt: "Изображение-результат",
	},
	paramsCard: {
		toolSettings: "Настройки инструмента",
		noParams: "У этого инструмента нет параметров — результат уже готов.",
		configureOutput: "Настроить вывод",
		noSchema: "У этого инструмента пока нет схемы.",
	},
	textInput: {
		heading: "Текст",
		placeholder: "Вставьте данные сюда",
		aria: "Текстовые данные",
		decode: "Декодировать",
	},
	textResult: {
		outputAria: "Текстовый результат",
		copied: "Скопировано",
		copy: "Копировать",
		downloadTxt: "Скачать .txt",
	},
	actions: {
		generate: "Сгенерировать",
		generating: "Генерация…",
		openImage: "Открыть изображение",
		downloadResult: "Скачать результат",
	},
	textSource: {
		placeholder: "Вставьте base64 / hex / байты…",
		trySample: "Попробовать образец",
		render: "Отрисовать текст",
	},
	download: {
		busy: "Готовим файл…",
		file: "Скачать .{ext}",
	},
	infoPanel: {
		dimensions: "Размеры",
		alpha: "Альфа-канал",
		alphaYes: "есть — есть полупрозрачные пиксели",
		alphaNo: "нет",
		colorCount: "Уникальных цветов (RGBA)",
	},
	dropZone: {
		pickDefault: "Перетащите изображение сюда или нажмите, чтобы выбрать файл",
		overlayDefault: "Отпустите файл, чтобы заменить изображение",
		pickTitle: "Перетащите PNG сюда",
		pickHint: "или нажмите, чтобы выбрать — всё локально",
	},
	search: {
		placeholder: "Найдите инструмент…",
		aria: "Поиск инструмента",
		nothingFound: "Ничего не найдено — попробуйте другое слово.",
	},
	ui: {
		showMask: "Показать маску",
		decrease: "Уменьшить",
		increase: "Увеличить",
		reset: "Сбросить",
		pipette: "Пипетка",
		themeLight: "Светлая тема",
		themeDark: "Тёмная тема",
		overlayTitle: "Знак",
		overlayDrop: "Перетащите PNG-знак или нажмите",
		overlayRemove: "Убрать знак",
		autoUpdate: "обновляется автоматически",
		width: "Ширина",
		height: "Высота",
		from: "От",
		to: "До",
		font: "Шрифт",
		size: "Размер",
		color: "Цвет",
		bold: "Жирный",
		fontSans: "Без засечек",
		fontSerif: "С засечками",
		fontMono: "Моноширинный",
		opacity: "Непрозрачность",
		angle: "Угол",
		backingPlate: "Подложка",
		addColor: "+ Добавить цвет",
		removeColor: "Удалить цвет",
		themeToggle: "Переключить тему",
		language: "Язык",
	},
	errors: {
		noImageRun: "Этот инструмент не обрабатывает изображения",
		sourceRequired: "Сначала загрузите изображение",
		textRequired: "Сначала введите текст",
		workerFailed: "Ошибка исполнения в воркере",
		workerUnavailable: "Воркер недоступен",
		notFound: "Инструмент не найден",
		noWatermark: "Сначала выберите картинку-знак",
		badTransform: "Вырожденная матрица трансформации",
		skewAngle: "Углы наклона не могут быть 90° или -90°",
		badHex: 'Некорректный HEX-цвет: "{value}"',
		radiusInt: "Радиус должен быть целым неотрицательным числом",
		kernelSize: "Ядро не совпадает с изображением по размеру",
		sizeInt: "Ширина и высота должны быть целыми числами ≥ 1",
		cropBounds: "Область обрезки не пересекает изображение",
		noCanvasCtx: "Canvas 2D context недоступен в этом окружении",
		badBase64: "Ожидается base64-строка или data-uri изображения",
		qualityRange: "quality должно быть в диапазоне 0..1",
		svgSize: "Не удалось определить размер SVG",
		svgLoad: "Не удалось загрузить SVG — проверьте разметку",
		encodeUnsupported: "Браузер не поддерживает кодирование в {mime}",
		unsupportedFile:
			"Неподдерживаемый формат файла ({type}). Поддерживаются PNG, JPEG, WebP, GIF и BMP.",
		widthInt: "Ширина изображения должна быть целым числом ≥ 1",
		noHexPixels: "Не найдено hex-значений пикселей",
		badPixelToken:
			"Каждый пиксель — 8 hex-символов RRGGBBAA, значения через пробел",
		pixelCountMismatch:
			"Число пикселей ({count}) не делится на ширину {width} без остатка",
		toolNotFound: 'Инструмент "{id}" не найден',
		badJson: "Файл не является корректным JSON",
		badPipelineShape: "Структура файла не похожа на цепочку шагов",
		pipelineVersion: "Неподдерживаемая версия цепочки: {version}",
		noSteps: "В файле нет списка шагов",
		paramNumber: 'Параметр "{id}" должен быть числом',
		paramString: 'Параметр "{id}" должен быть строкой',
		paramBool: 'Параметр "{id}" должен быть значением флажка',
		resizeSize: "Ширина и/или высота должны быть положительными",
		cropSize: "Ширина и высота области обрезки должны быть положительными",
		sizePositive: "Размеры должны быть положительными и конечными",
		tooManyParts: "Слишком много частей ({count}). Ограничение — 1000.",
		toolUnknown: "Инструмента с id «{id}» нет в реестре.",
	},
	fields: {
		alphaThreshold: "Порог альфы",
		amount: "Количество",
		amplitude: "Амплитуда",
		anchor: "Якорь",
		angle: "Угол",
		axis: "Ось",
		background: "Фон",
		backgroundColor: "Цвет фона",
		baseColor: "Базовый цвет",
		blockSize: "Размер блока",
		borderColor: "Цвет рамки",
		brightness: "Яркость",
		canvasSize: "Размер холста",
		channel: "Канал",
		channelPair: "Пара каналов",
		channelTolerance: "Допуск по каналам",
		color: "Цвет",
		colorCount: "Количество цветов",
		colorList: "Список цветов",
		colorPair: "Пара цветов",
		colorTolerance: "Допуск похожести",
		cols: "Колонки",
		columns: "Столбцы",
		component: "Компонент",
		contrast: "Контраст",
		count: "Количество",
		cropAreaSize: "Размер области",
		dateFormat: "Формат даты",
		degrees: "Градусы",
		depth: "Глубина затемнения",
		direction: "Направление",
		display: "Отображение",
		emoji: "Эмодзи",
		fillColor: "Цвет заливки",
		fitMode: "Режим вписывания",
		gamma: "Гамма",
		gradient: "Градиент",
		hexList: "Список hex-цветов",
		highlightColor: "Цвет подсветки",
		imageSize: "Размер изображения",
		innerRadius: "Внутренний радиус",
		keepAspect: "Сохранять пропорции",
		keepSide: "Остающаяся сторона",
		layout: "Раскладка",
		levels: "Уровни",
		lightness: "Светлота",
		lineColor: "Цвет линий",
		lineWidth: "Толщина линий",
		lumaThreshold: "Порог яркости",
		margin: "Отступ",
		maxColors: "Максимум цветов",
		mode: "Режим",
		offset: "Смещение",
		offsetX: "Сдвиг по X",
		offsetY: "Сдвиг по Y",
		opacity: "Непрозрачность",
		order: "Порядок",
		orientation: "Ориентация",
		outerOnly: "Только с краёв",
		padding: "Поля",
		pattern: "Узор",
		percent: "Процент",
		phase: "Фаза",
		plate: "Плашка",
		points: "Количество лучей",
		position: "Позиция",
		quality: "Качество",
		radius: "Радиус",
		range: "Диапазон светлоты",
		rarity: "Максимум повторов",
		ratio: "Соотношение сторон",
		rotation: "Поворот",
		rows: "Строки",
		saturation: "Насыщенность",
		scalePct: "Масштаб, %",
		seed: "Сид",
		shapeHeightPct: "Высота, %",
		shapeSize: "Размер фигуры",
		shapeWidthPct: "Ширина, %",
		showText: "Показывать текст",
		skewX: "Наклон по X",
		skewY: "Наклон по Y",
		smooth: "Сглаживание",
		spread: "Разброс",
		steps: "Шаги",
		stepX: "Шаг по X",
		stepY: "Шаг по Y",
		strength: "Сила",
		strokeColor: "Цвет обводки",
		targetColor: "Целевой цвет",
		text: "Текст",
		textColor: "Цвет текста",
		textStyle: "Стиль текста",
		thickness: "Толщина",
		threshold: "Порог",
		transparent: "Прозрачный",
		transparentBg: "Прозрачный фон",
		waves: "Волны",
		width: "Ширина",
		x: "X",
		y: "Y",
	},
	groups: {
		adjust: "Коррекция",
		anchor: "Привязка",
		background: "Фон",
		baseColor: "Базовый цвет",
		blocks: "Блоки",
		canvas: "Холст",
		colors: "Цвета",
		cropArea: "Область кадрирования",
		fill: "Заливка",
		grid: "Сетка",
		noise: "Шум",
		offset: "Смещение",
		options: "Параметры",
		output: "Вывод",
		padding: "Поля",
		placement: "Размещение",
		plate: "Плашка",
		position: "Положение",
		random: "Случайность",
		scaling: "Масштаб",
		seed: "Сид",
		shape: "Форма",
		spectrum: "Спектр",
		text: "Текст",
		tile: "Плитка",
		watermark: "Водяной знак",
	},
	tools: {
		"png-to-bmp": {
			title: "Конвертировать PNG в BMP",
			description:
				"Сохраняет изображение в 24-битный BMP без альфа-канала: прозрачность заменяется чёрным фоном.",
		},
		"png-to-base64": {
			title: "PNG в Base64",
			description:
				"Кодирует изображение в base64-строку для вставки в код или стили.",
		},
		"base64-to-png": {
			title: "Base64 в PNG",
			description:
				"Декодирует base64-строку или data-uri обратно в картинку. Вставьте строку слева.",
		},
		"png-to-data-uri": {
			title: "PNG в Data URI",
			description:
				"Строит полный data-uri (data:image/png;base64,…) для встраивания в HTML/CSS.",
		},
		"data-uri-to-png": {
			title: "Data URI в PNG",
			description: "Декодирует data:image/…;base64,… обратно в файл картинки.",
		},
		"png-to-hex": {
			title: "PNG в HEX-пиксели",
			description:
				"Показывает все пиксели как hex-значения rrggbbaa — по строкам, через пробел.",
		},
		"hex-to-png": {
			title: "HEX-пиксели в PNG",
			description:
				"Собирает картинку из hex-значений rrggbbaa (через пробел). Укажите ширину — высота рассчитается сама.",
			params: { width: "Ширина изображения" },
		},
		"resize-png": {
			title: "Изменить размер PNG",
			description:
				"Масштабирование изображения с билинейной интерполяцией. При сохранении пропорций одна сторона задаёт масштаб, а если указаны обе — изображение вписывается в эти размеры.",
			params: {
				width: "Ширина (0 — авто)",
				height: "Высота (0 — авто)",
				keepAspect: "Сохранять пропорции",
			},
		},
		"crop-png": {
			title: "Обрезать PNG",
			description:
				"Вырезает прямоугольную область. Координаты и размеры выходят за границы изображения — область усекается до пересечения с картинкой.",
			params: {
				x: "X (слева)",
				y: "Y (сверху)",
				width: "Ширина области",
				height: "Высота области",
			},
		},
		"rotate-png": {
			title: "Повернуть PNG",
			description:
				"Поворот на 90°, 180° или 270° по часовой стрелке без потери качества.",
			params: { angle: "Угол поворота" },
			options: {
				angle: {
					"90": "90° по часовой",
					"180": "180°",
					"270": "270° по часовой",
				},
			},
		},
		"flip-png": {
			title: "Отразить PNG",
			description:
				"Зеркальное отражение по горизонтали или вертикали без потери качества.",
			params: { axis: "Ось отражения" },
			options: {
				axis: {
					horizontal: "По горизонтали (слева направо)",
					vertical: "По вертикали (сверху вниз)",
				},
			},
		},
		"add-padding-png": {
			title: "Добавить поля PNG",
			description:
				"Расширяет холст во все стороны на выбранное число пикселей.",
			params: {
				padding: "Поля, px",
				transparent: "Прозрачные поля",
				color: "Цвет полей",
			},
		},
		"add-border-png": {
			title: "Добавить рамку PNG",
			description: "Рисует цветную рамку вокруг изображения выбранной толщины.",
			params: { thickness: "Толщина рамки, px", color: "Цвет рамки" },
		},
		"fit-on-background-png": {
			title: "Вписать PNG на фон",
			description:
				"Помещает изображение по центру полотна заданного размера с прозрачным или цветным фоном.",
			params: {
				width: "Ширина полотна",
				height: "Высота полотна",
				transparent: "Прозрачный фон",
				color: "Цвет фона",
			},
		},
		"tile-png": {
			title: "Замостить PNG",
			description:
				"Повторяет изображение сеткой из выбранного числа столбцов и строк.",
			params: { columns: "Столбцов", rows: "Строк" },
		},
		"split-into-parts-png": {
			title: "Разрезать PNG на части",
			description:
				"Делит изображение на сетку одинаковых по размеру частей. Холст дополняется прозрачностью, чтобы каждая часть была одного размера.",
		},
		"center-by-alpha-png": {
			title: "Центрировать PNG по содержимому",
			description:
				"Находит непрозрачную часть изображения и размещает её по центру прежнего холста.",
		},
		"blur-png": {
			title: "Размытие PNG",
			description:
				"Гауссово размытие: три прохода разделяемого бокса — быстро при любом радиусе. Прозрачные края не темнеют.",
			params: { radius: "Радиус, px" },
		},
		"sharpen-png": {
			title: "Резкость PNG",
			description:
				"Подчёркивает края ядром резкости; сила задаёт смесь с оригиналом. 0% — без изменений.",
			params: { strength: "Сила, %" },
		},
		"grayscale-png": {
			title: "Чёрно-белый PNG",
			description:
				"Переводит изображение в оттенки серого по яркостной формуле BT.601. Альфа сохраняется.",
		},
		"invert-colors-png": {
			title: "Инвертировать цвета PNG",
			description:
				"Обращает каждый цветовой канал (255 − значение). Альфа не меняется.",
		},
		"adjust-brightness-contrast-png": {
			title: "Яркость и контраст PNG",
			description:
				"Изменяет яркость и контраст в диапазоне от −100 до +100. Значение 0 — без изменений.",
			params: { brightness: "Яркость", contrast: "Контраст" },
		},
		"change-png-opacity": {
			title: "Изменить прозрачность PNG",
			description:
				"Умножает альфа-канал на процент: 0% — полностью прозрачный, 100% — без изменений.",
			params: { percent: "Прозрачность, %" },
		},
		"sepia-png": {
			title: "Эффект сепии",
			description:
				"Тонирует изображение в тёплые коричневые тона классической сепии.",
		},
		"change-png-hue": {
			title: "Сменить оттенок PNG",
			description:
				"Сдвиг цветового тона по кругу. Насыщенность и яркость сохраняются.",
			params: { degrees: "Сдвиг тона, °" },
		},
		"extract-channel-png": {
			title: "Извлечь канал PNG",
			description:
				"Оставляет выбранный канал — красный, зелёный или синий — в оттенках серого.",
			params: { channel: "Канал" },
			options: { channel: { red: "Красный", green: "Зелёный", blue: "Синий" } },
		},
		"swap-channels-png": {
			title: "Переставить каналы PNG",
			description:
				"Меняет местами два цветовых канала — быстрый способ получить необычный окрас.",
			params: { pair: "Пара каналов" },
			options: {
				pair: {
					"r-g": "Красный ↔ Зелёный",
					"r-b": "Красный ↔ Синий",
					"g-b": "Зелёный ↔ Синий",
				},
			},
		},
		"png-to-hsl": {
			options: {
				display: { gray: "Оттенки серого", color: "Пространство как RGB" },
			},
		},
		"png-to-hsv": {
			options: {
				display: { gray: "Оттенки серого", color: "Пространство как RGB" },
			},
		},
		"png-to-hsi": {
			options: {
				display: { gray: "Оттенки серого", color: "Пространство как RGB" },
			},
		},
		"png-to-cmyk": {
			options: {
				display: { gray: "Оттенки серого", color: "Пространство как RGB" },
			},
		},
		"png-to-ycbcr": {
			options: {
				display: { gray: "Оттенки серого", color: "Пространство как RGB" },
			},
		},
		"png-to-lab": {
			options: {
				display: { gray: "Оттенки серого", color: "Пространство как RGB" },
			},
		},
		cmyk: {
			title: "Конвертировать PNG в цвета CMYK",
			description:
				"Раскладывает изображение на печатные компоненты Cyan, Magenta, Yellow и Key (чёрный).",
		},
		hsl: {
			title: "Разбить PNG на HSL",
			description:
				"Раскладывает изображение на компоненты тона, насыщенности и светлоты.",
		},
		hsi: {
			title: "Разбить PNG на HSI",
			description:
				"Раскладывает изображение на компоненты тона, насыщенности и интенсивности.",
		},
		hsv: {
			title: "Разбить PNG на HSV",
			description:
				"Раскладывает изображение на компоненты тона, насыщенности и значения (яркости).",
		},
		lab: {
			title: "Конвертировать PNG в цвета LAB",
			description:
				"Раскладывает изображение на перцепционную светлоту и оппонентные пары зелёный–пурпур / синий–жёлтый.",
		},
		ycbcr: {
			title: "Конвертировать PNG в цвета YCbCr",
			description:
				"Раскладывает изображение на яркость (Y) и цветоразностные компоненты Cb / Cr.",
		},
		"black-and-white-png": {
			title: "Чёрно-белый PNG по порогу",
			description:
				"Жёсткая бинаризация по яркости: каждый пиксель становится чёрным или белым.",
			params: { threshold: "Порог яркости, %" },
		},
		"posterize-png": {
			title: "Постеризация PNG",
			description: "Уменьшает число уровней каждого канала — плакатный эффект.",
			params: { levels: "Уровней на канал" },
		},
		"two-colors-png": {
			title: "Два цвета PNG",
			description:
				"Перекрашивает изображение в два выбранных цвета по порогу яркости.",
			params: {
				lightColor: "Цвет светлых участков",
				darkColor: "Цвет тёмных участков",
				threshold: "Порог яркости, %",
			},
		},
		"convert-png-to-jpg": {
			title: "Конвертировать PNG в JPG",
			description:
				"Прозрачность накладывается на выбранный цвет подложки (по умолчанию белый), результат сохраняется в JPEG.",
			params: { background: "Цвет подложки", quality: "Качество JPEG" },
		},
		"convert-png-to-webp": {
			title: "Конвертировать PNG в WebP",
			description:
				"Перекодирует изображение в WebP с настраиваемым качеством. Прозрачность сохраняется.",
			params: { quality: "Качество WebP" },
		},
		"remove-alpha-channel-png": {
			title: "Убрать альфа-канал PNG",
			description:
				"Накладывает изображение на белый фон и сохраняет без прозрачности.",
		},
		"set-alpha-channel-png": {
			title: "Задать альфа-канал PNG",
			description:
				"Присваивает всем пикселям одинаковую прозрачность, цвета не меняются.",
			params: { percent: "Прозрачность, %" },
		},
		"extract-alpha-mask-png": {
			title: "Извлечь маску альфы PNG",
			description: "Превращает прозрачность в чёрно-белую непрозрачную маску.",
		},
		"round-corners-png": {
			title: "Скруглить углы PNG",
			description:
				"Обрезает углы по радиусу, заданному в процентах от половины меньшей стороны.",
			params: { radius: "Радиус скругления, %" },
		},
		"invert-alpha-png": {
			title: "Инвертировать альфа-канал PNG",
			description: "Непрозрачные области становятся прозрачными и наоборот.",
		},
		"remove-background-png": {
			title: "Удалить фон PNG (умно)",
			description:
				"Убирает однотонный фон: по цвету с допуском, только внешние области от краёв или весь совпадающий цвет. Умеет сглаживать границу.",
			params: {
				color: "Цвет фона",
				tolerance: "Допуск похожести, %",
				outerOnly: "Только внешние области",
				smooth: "Сглаживание границы, проходы",
			},
		},
		"add-stroke-png": {
			title: "Обвести PNG",
			description:
				"Добавляет цветную обводку-кольцо вокруг непрозрачного содержимого заданной толщины.",
			params: { color: "Цвет обводки", thickness: "Толщина, px" },
		},
		"find-contour-png": {
			title: "Найти контур PNG",
			description:
				"Оставляет только линию по границе непрозрачных областей выбранного цвета и толщины.",
			params: { color: "Цвет линии", thickness: "Толщина линии, px" },
		},
		"make-thicker-png": {
			title: "Утолщить PNG",
			description: "Расширяет непрозрачные области на заданное число пикселей.",
			params: { radius: "На сколько px" },
		},
		"make-thinner-png": {
			title: "Утончить PNG",
			description:
				"Сужает непрозрачные области — утоньшает штрихи надписей и деталей.",
			params: { radius: "На сколько px" },
		},
		"harden-alpha-png": {
			title: "Жёсткие края PNG",
			description:
				"Бинаризует альфа-канал по порогу: полупрозрачные пиксели становятся либо полностью прозрачными, либо непрозрачными.",
			params: { threshold: "Порог альфы, %" },
		},
		"despeckle-alpha-png": {
			title: "Убрать мусор PNG",
			description:
				"Открытие: убирает одиночные полупрозрачные пиксели и мелкие крапинки.",
			params: { radius: "Радиус очистки, px" },
		},
		"close-holes-png": {
			title: "Закрыть дыры PNG",
			description:
				"Закрытие: заполняет одиночные прозрачные точки внутри объекта.",
			params: { radius: "Радиус закрытия, px" },
		},
		"remove-color-from-png": {
			title: "Удалить цвет из PNG (прозрачность)",
			description:
				"Делает прозрачными все пиксели, близкие к выбранному цвету. Порог задаёт допустимое отклонение в процентах от максимального цветового расстояния.",
			params: {
				targetColor: "Цвет для удаления",
				tolerance: "Порог похожести, %",
			},
		},
		"create-empty-png": {
			title: "Создать пустой PNG",
			description:
				"Генерирует холст выбранного размера — прозрачный или залитый цветом.",
			params: {
				width: "Ширина",
				height: "Высота",
				transparent: "Прозрачный",
				color: "Цвет",
			},
		},
		"single-color-png": {
			title: "Создать одноцветный PNG",
			description: "Генерирует прямоугольник заданного размера и цвета.",
			params: { width: "Ширина", height: "Высота", color: "Цвет" },
		},
		"random-noise-png": {
			title: "Создать случайный шум PNG",
			description:
				"Генерирует картинку со случайными пикселями. Зерно фиксирует результат: одно зерно — одна картинка.",
			params: { width: "Ширина", height: "Высота", seed: "Зерно" },
		},
		"linear-gradient-png": {
			title: "Создать градиент PNG",
			description:
				"Генерирует плавный переход между двумя цветами по горизонтали или вертикали.",
			params: {
				width: "Ширина",
				height: "Высота",
				fromColor: "Цвет начала",
				toColor: "Цвет конца",
				direction: "Направление",
			},
			options: {
				direction: { horizontal: "По горизонтали", vertical: "По вертикали" },
			},
		},
		"color-wheel-png": {
			title: "Цветовой круг PNG",
			description:
				"Круг HSL: оттенок по окружности, насыщенность от центра к краю, выбранная светлота.",
			params: { width: "Размер", lightness: "Светлота, %" },
		},
		"complementary-png": {
			title: "Комплементарная палитра PNG",
			description:
				"Два противоположных цвета круга — базовый и его дополнение.",
			params: {
				baseColor: "Базовый цвет",
				width: "Ширина",
				layout: "Раскладка",
			},
			options: { layout: { grid: "Сетка", strip: "Полоса" } },
		},
		"triadic-png": {
			title: "Триадная палитра PNG",
			description: "Три цвета через 120° друг от друга на цветовом круге.",
			params: {
				baseColor: "Базовый цвет",
				width: "Ширина",
				layout: "Раскладка",
			},
			options: { layout: { grid: "Сетка", strip: "Полоса" } },
		},
		"tetradic-png": {
			title: "Тетрадная палитра PNG",
			description: "Четыре цвета — две комплементарные пары, шаг 90° по кругу.",
			params: {
				baseColor: "Базовый цвет",
				width: "Ширина",
				layout: "Раскладка",
			},
			options: { layout: { grid: "Сетка", strip: "Полоса" } },
		},
		"analogous-png": {
			title: "Аналоговая палитра PNG",
			description:
				"Соседние оттенки вокруг базового — спокойная родственная гамма.",
			params: {
				baseColor: "Базовый цвет",
				width: "Ширина",
				layout: "Раскладка",
				spread: "Разброс оттенка, °",
				count: "Сколько цветов",
			},
			options: { layout: { grid: "Сетка", strip: "Полоса" } },
		},
		"monochromatic-png": {
			title: "Монохромная палитра PNG",
			description:
				"Тоны одного оттенка: меняется светлота в выбранном диапазоне, тон и насыщенность фиксированы.",
			params: {
				baseColor: "Базовый цвет",
				width: "Ширина",
				layout: "Раскладка",
				count: "Сколько цветов",
				range: "Диапазон светлоты, %",
			},
			options: { layout: { grid: "Сетка", strip: "Полоса" } },
		},
		"shades-png": {
			title: "Градация оттенка PNG",
			description: "Ступени базового цвета от исходного к более тёмному.",
			params: {
				baseColor: "Базовый цвет",
				width: "Ширина",
				layout: "Раскладка",
				count: "Сколько цветов",
				depth: "Глубина затемнения, %",
			},
			options: { layout: { grid: "Сетка", strip: "Полоса" } },
		},
		"mix-colors-png": {
			title: "Смешать цвета PNG",
			description:
				"Усредняет несколько hex-цветов в один свотч. Введите значения через запятую; неверные токены пропускаются.",
			params: { colors: "Цвета (hex через запятую)", width: "Ширина" },
		},
		"blend-two-png": {
			title: "Перелив двух цветов PNG",
			description: "Непрерывный горизонтальный градиент между двумя цветами.",
			params: { colorA: "Цвет A", colorB: "Цвет B", width: "Ширина" },
		},
		"step-colors-png": {
			title: "Ступени между цветами PNG",
			description:
				"Дискретный набор равномерно распределённых ступеней между двумя цветами.",
			params: {
				colorA: "Цвет A",
				colorB: "Цвет B",
				steps: "Сколько ступеней",
				width: "Ширина",
				layout: "Раскладка",
			},
			options: { layout: { grid: "Сетка", strip: "Полоса" } },
		},
		"sort-colors-png": {
			title: "Отсортировать цвета PNG",
			description:
				"Рисует ваш hex-список свотчами, отсортированными по тону, яркости или насыщенности. Неверные токены пропускаются.",
			params: {
				colors: "Цвета (hex через запятую)",
				order: "Сортировка",
				width: "Ширина",
				layout: "Раскладка",
			},
			options: {
				order: { hue: "Оттенок", luma: "Яркость", sat: "Насыщенность" },
				layout: { grid: "Сетка", strip: "Полоса" },
			},
		},
		"png-is-grayscale": {
			title: "Проверить: PNG монохромный?",
			description:
				"Сообщает, состоит ли изображение только из оттенков серого.",
			results: {
				grayscaleYes: "Да — все пиксели являются оттенками серого.",
				grayscaleNo: "Нет — найдены цветные пиксели.",
			},
		},
		"circle-mask-png": {
			title: "Круглая маска PNG",
			description:
				"Вырезает из изображения круг. Диаметр задаётся в процентах от меньшей стороны.",
			params: {
				size: "Диаметр, % меньшей стороны",
				offsetX: "Смещение X, %",
				offsetY: "Смещение Y, %",
			},
		},
		"square-mask-png": {
			title: "Прямоугольная маска PNG",
			description:
				"Вырезает прямоугольник со сторонами в процентах от меньшей стороны изображения.",
			params: {
				widthPct: "Ширина, % меньшей стороны",
				heightPct: "Высота, % меньшей стороны",
				offsetX: "Смещение X, %",
				offsetY: "Смещение Y, %",
			},
		},
		"star-mask-png": {
			title: "Маска-звезда PNG",
			description:
				"Вырезает звезду с настраиваемым числом лучей, глубиной впадин и поворотом.",
			params: {
				points: "Лучи",
				innerRadius: "Радиус впадин, %",
				size: "Внешний радиус, % меньшей стороны",
				rotation: "Поворот, °",
				offsetX: "Смещение X, %",
				offsetY: "Смещение Y, %",
			},
		},
		"wavy-mask-png": {
			title: "Волнистая маска PNG",
			description:
				"Вырезает круг с волнистым краем: радиус модулируется синусом с заданной амплитудой и частотой.",
			params: {
				size: "Базовый радиус, % меньшей стороны",
				amplitude: "Амплитуда волн, %",
				waves: "Количество волн",
				phase: "Фаза, °",
				offsetX: "Смещение X, %",
				offsetY: "Смещение Y, %",
			},
		},
		"trim-empty-space-png": {
			title: "Обрезать пустые поля PNG",
			description:
				"Обрезает прозрачные рамки вокруг содержимого. Пиксели с альфой выше порога считаются содержимым.",
			params: { threshold: "Порог альфы" },
		},
		"change-canvas-size-png": {
			title: "Изменить размер холста PNG",
			description:
				"Задаёт точный размер холста: лишнее обрезается, недостающее дополняется прозрачностью. Якорь выбирает, какая часть изображения остаётся.",
			params: { width: "Ширина", height: "Высота", anchor: "Якорь" },
			options: {
				anchor: {
					"top-left": "Сверху слева",
					"top-center": "Сверху по центру",
					"top-right": "Сверху справа",
					"middle-left": "По центру слева",
					center: "По центру",
					"middle-right": "По центру справа",
					"bottom-left": "Снизу слева",
					"bottom-center": "Снизу по центру",
					"bottom-right": "Снизу справа",
				},
			},
		},
		"change-aspect-ratio-png": {
			title: "Изменить соотношение сторон PNG",
			description:
				"Вписывает изображение в целевое соотношение сторон: обрезать центр до заполнения или дополнить прозрачностью.",
			params: { ratio: "Целевое отношение", mode: "Режим" },
			options: {
				ratio: {
					"1:1": "1:1",
					"4:3": "4:3",
					"3:4": "3:4",
					"3:2": "3:2",
					"2:3": "2:3",
					"16:9": "16:9",
					"9:16": "9:16",
				},
				mode: {
					crop: "Обрезать до заполнения",
					pad: "Дополнить до вписывания",
				},
			},
		},
		"swap-orientation-png": {
			title: "Поменять ориентацию PNG",
			description:
				"Поворачивает изображение на 90°, если ориентация отличается от целевой — ландшафт становится портретом и наоборот. Квадрат не трогается.",
			params: { target: "Целевая ориентация" },
			options: { target: { portrait: "Портрет", landscape: "Ландшафт" } },
		},
		"symmetric-copy-png": {
			title: "Симметричная копия PNG",
			description:
				"Удваивает холст, зеркалируя сохранённую половину на пустую — мгновенный симметричный узор.",
			params: { axis: "Линия зеркала", keepSide: "Какая сторона остаётся" },
			options: {
				axis: {
					vertical: "Вертикальная (ширина ×2)",
					horizontal: "Горизонтальная (высота ×2)",
				},
				keepSide: {
					left: "Левая",
					right: "Правая",
					top: "Верхняя",
					bottom: "Нижняя",
				},
			},
		},
		"feather-edges-png": {
			title: "Растушевать края PNG",
			description:
				"Размывает только альфа-канал: жёсткие края выреза становятся мягкими, цвета не трогаются.",
			params: { radius: "Радиус растушёвки, px" },
		},
		"clean-edges-png": {
			title: "Почистить края PNG (defringe)",
			description:
				"Заменяет цветную кайму полупрозрачных пикселей цветом ближайшего полностью непрозрачного соседа. Альфа остаётся как была.",
			params: { radius: "Радиус поиска, px" },
		},
		"pixelate-png": {
			title: "Пикселизация PNG",
			description:
				"Усредняет каждый блок blockSize×blockSize в один цвет — классическая мозаика.",
			params: { blockSize: "Размер блока, px" },
		},
		"randomize-pixels-png": {
			title: "Перемешать пиксели PNG",
			description:
				"Переставляет блоки изображения между собой. Одинаковый seed даёт одинаковую раскладку.",
			params: { blockSize: "Размер блока, px", seed: "Seed" },
		},
		"add-noise-png": {
			title: "Добавить шум PNG",
			description:
				"Добавляет зерно в стиле плёнки. Детерминировано по seed; монохромный сохраняет баланс оттенков.",
			params: { amount: "Сила, %", mode: "Тип шума", seed: "Seed" },
			options: { mode: { mono: "Монохромное зерно", color: "Цветной шум" } },
		},
		"silhouette-png": {
			title: "Силуэт PNG",
			description:
				"Заливает все видимые пиксели одним цветом, сохраняя их прозрачность — мгновенный силуэт.",
			params: { color: "Цвет силуэта", threshold: "Порог видимости, %" },
		},
		"png-to-bytes": {
			title: "PNG в байты",
			description:
				"Выводит каждый пиксель четырьмя десятичными байтами (R G B A), по строке изображения на строку текста.",
		},
		"bytes-to-png": {
			title: "Байты в PNG",
			description:
				"Собирает изображение из десятичных RGBA-байтов (разделители любые). Укажите ширину — высота рассчитается сама.",
			params: { width: "Ширина изображения" },
		},
		"png-to-rgb-values": {
			title: "PNG в RGB-значения",
			description:
				"Выводит каждый пиксель как rgba(r, g, b, a), ряды через перевод строки.",
		},
		"rgb-values-to-png": {
			title: "RGB-значения в PNG",
			description:
				"Собирает изображение из чисел rgba(r, g, b, a). Укажите ширину — высота рассчитается сама.",
			params: { width: "Ширина изображения" },
		},
		"verify-is-png": {
			title: "Проверить: это PNG?",
			description:
				"Проверяет сигнатуру вставленного base64 / data-uri и сообщает, настоящий ли это PNG.",
			results: {
				verifyYes: "Да — сигнатура настоящего PNG.",
				verifyNo: "Нет — сигнатура не совпадает с PNG-файлом.",
			},
		},
		"text-to-png": {
			title: "Текст в PNG",
			description:
				"Создаёт PNG из текста: холст подгоняется под размер надписи с полями.",
			params: {
				text: "Текст",
				fontSize: "Размер шрифта, px",
				font: "Шрифт",
				bold: "Жирный",
				color: "Цвет текста",
				transparentBg: "Прозрачный фон",
				backgroundColor: "Цвет фона",
				padding: "Отступ, px",
			},
			options: {
				font: {
					sans: "Без засечек",
					serif: "С засечками",
					mono: "Моноширинный",
				},
			},
		},
		"emoji-to-png": {
			title: "Эмодзи в PNG",
			description:
				"Рисует эмодзи или любой Unicode-символ как прозрачный PNG выбранного размера.",
			params: { emoji: "Эмодзи / символ", size: "Размер" },
		},
		"placeholder-png": {
			title: "Заглушка PNG",
			description:
				"Генерирует прямоугольник-заглушку с напечатанными размерами в центре.",
			params: {
				width: "Ширина",
				height: "Высота",
				backgroundColor: "Фон",
				color: "Цвет текста",
				showText: "Печатать размеры",
			},
		},
		"color-spectrum-png": {
			title: "Спектр цветов PNG",
			description:
				"Полный радужный переход 0–360° вдоль выбранной оси с настройкой насыщенности и светлоты.",
			params: {
				width: "Ширина",
				height: "Высота",
				direction: "Направление",
				saturation: "Насыщенность, %",
				lightness: "Светлота, %",
			},
			options: {
				direction: { horizontal: "По горизонтали", vertical: "По вертикали" },
			},
		},
		"random-colors-png": {
			title: "Случайные цветные блоки PNG",
			description:
				"Заполняет холст случайными яркими блоками. Детерминировано по seed.",
			params: {
				width: "Ширина",
				height: "Высота",
				blockSize: "Размер блока, px",
				seed: "Seed",
			},
		},
		"draw-grid-png": {
			title: "Нарисовать сетку PNG",
			description:
				"Рисует сетку с заданными столбцами, строками и толщиной линий на прозрачном или белом фоне.",
			params: {
				width: "Ширина",
				height: "Высота",
				cols: "Столбцы",
				rows: "Строки",
				lineWidth: "Толщина линий, px",
				color: "Цвет линий",
				transparentBg: "Прозрачный фон",
			},
		},
		"quantize-png": {
			title: "Квантовать PNG",
			description:
				"Уменьшает изображение до k цветов через median-cut палитру. Прозрачные пиксели сохраняются.",
			params: { colors: "Цветов (k)" },
		},
		"decrease-color-count-png": {
			title: "Уменьшить число цветов PNG",
			description:
				"Тот же движок median-cut с фиксированными пресетами степеней двойки — быстрый спуск до 2–256 цветов.",
			params: { maxColors: "Максимум цветов" },
			options: {
				maxColors: {
					"2": "2",
					"4": "4",
					"8": "8",
					"16": "16",
					"32": "32",
					"64": "64",
					"128": "128",
					"256": "256",
				},
			},
		},
		"custom-palette-png": {
			title: "Своя палитра PNG",
			description:
				"Сопоставляет каждый пиксель с ближайшим цветом из вашего списка hex через запятую.",
			params: { colors: "Палитра (hex через запятую)" },
		},
		"dithering-png": {
			title: "Дизеринг PNG",
			description:
				"Применяет распространение ошибки Флойда–Стейнберга или упорядоченный Байер при сведении к k цветам.",
			params: { colors: "Цветов (k)", pattern: "Узор" },
			options: {
				pattern: { "floyd-steinberg": "Флойд–Стейнберг", bayer: "Байер 4×4" },
			},
		},
		"png-file-size": {
			title: "Размер файла PNG",
			description:
				"Кодирует изображение в PNG и показывает итоговый размер файла.",
			results: {
				line: "Размер PNG: {kb} КБ",
			},
		},
		"show-transparent-png": {
			title: "Показать прозрачные области PNG",
			description:
				"Подсвечивает выбранным цветом каждый прозрачный или полупрозрачный пиксель — дыры становятся заметными.",
			params: {
				mode: "Режим маски",
				color: "Цвет подсветки",
				opacity: "Непрозрачность подсветки, %",
			},
			options: {
				mode: { binary: "Чёрно-белая маска", highlight: "Цветная подсветка" },
			},
		},
		"show-grayscale-pixels-png": {
			title: "Показать серые пиксели PNG",
			description:
				"Находит пиксели с почти равными каналами и рисует их маску. Допуск — в единицах канала.",
			params: {
				tolerance: "Допуск по каналам",
				mode: "Режим маски",
				color: "Цвет подсветки",
				opacity: "Непрозрачность подсветки, %",
			},
			options: {
				mode: { binary: "Чёрно-белая маска", highlight: "Цветная подсветка" },
			},
		},
		"show-color-pixels-png": {
			title: "Показать цветные пиксели PNG",
			description:
				"Находит цветные (не серые) пиксели за пределами допуска и рисует их маску.",
			params: {
				tolerance: "Допуск по каналам",
				mode: "Режим маски",
				color: "Цвет подсветки",
				opacity: "Непрозрачность подсветки, %",
			},
			options: {
				mode: { binary: "Чёрно-белая маска", highlight: "Цветная подсветка" },
			},
		},
		"light-pixel-mask-png": {
			title: "Маска светлых пикселей PNG",
			description: "Выбирает пиксели ярче порога яркости.",
			params: {
				threshold: "Порог яркости, %",
				mode: "Режим маски",
				color: "Цвет подсветки",
				opacity: "Непрозрачность подсветки, %",
			},
			options: {
				mode: { binary: "Чёрно-белая маска", highlight: "Цветная подсветка" },
			},
		},
		"dark-pixel-mask-png": {
			title: "Маска тёмных пикселей PNG",
			description: "Выбирает пиксели темнее порога яркости.",
			params: {
				threshold: "Порог яркости, %",
				mode: "Режим маски",
				color: "Цвет подсветки",
				opacity: "Непрозрачность подсветки, %",
			},
			options: {
				mode: { binary: "Чёрно-белая маска", highlight: "Цветная подсветка" },
			},
		},
		"unique-color-mask-png": {
			title: "Маска уникальных цветов PNG",
			description:
				"Выбирает цвета, которые встречаются не чаще заданного числа раз, — редкие и одиночные пиксели.",
			params: {
				rarity: "Максимум повторов",
				mode: "Режим маски",
				color: "Цвет подсветки",
				opacity: "Непрозрачность подсветки, %",
			},
			options: {
				mode: { binary: "Чёрно-белая маска", highlight: "Цветная подсветка" },
			},
		},
		"extract-color-from-png": {
			title: "Извлечь цвет из PNG",
			description:
				"Оставляет только пиксели, близкие к выбранному цвету, остальное делает прозрачным — обратное «Удалить цвет».",
			params: {
				color: "Какой цвет оставить",
				tolerance: "Допуск похожести, %",
			},
		},
		"watermark-tile-png": {
			title: "Плитка-водяной знак PNG",
			description:
				"Покрывает изображение повторяющейся диагональной полупрозрачной плиткой текста — защитный водяной знак.",
			params: {
				text: "Текст",
				fontSize: "Размер шрифта, px",
				color: "Цвет текста",
				opacity: "Непрозрачность, %",
				angle: "Угол, °",
				stepX: "Шаг X, px",
				stepY: "Шаг Y, px",
				font: "Шрифт",
				bold: "Жирный",
			},
			options: {
				font: {
					sans: "Без засечек",
					serif: "С засечками",
					mono: "Моноширинный",
				},
			},
		},
		"add-text-png": {
			title: "Надпись на PNG",
			description:
				"Рисует текст на изображении: шрифт, размер, цвет, жирность, позиция на сетке 3×3 и опциональная подложка.",
			params: {
				text: "Текст",
				fontSize: "Размер шрифта, px",
				color: "Цвет текста",
				font: "Шрифт",
				bold: "Жирный",
				position: "Позиция",
				margin: "Отступ, px",
				plate: "Подложка",
				plateColor: "Цвет подложки",
				plateOpacity: "Прозрачность плашки, %",
			},
			options: {
				font: {
					sans: "Без засечек",
					serif: "С засечками",
					mono: "Моноширинный",
				},
				position: {
					"top-left": "Сверху слева",
					"top-center": "Сверху по центру",
					"top-right": "Сверху справа",
					"middle-left": "По центру слева",
					center: "По центру",
					"middle-right": "По центру справа",
					"bottom-left": "Снизу слева",
					"bottom-center": "Снизу по центру",
					"bottom-right": "Снизу справа",
				},
			},
		},
		"date-stamp-png": {
			title: "Дата-штамп PNG",
			description:
				"Ставит текущую дату и время по строке формата (токены YYYY MM DD hh mm ss). Оформление — как у надписи.",
			params: {
				format: "Формат",
				fontSize: "Размер шрифта, px",
				color: "Цвет текста",
				font: "Шрифт",
				bold: "Жирный",
				position: "Позиция",
				margin: "Отступ, px",
				plate: "Подложка",
				plateColor: "Цвет подложки",
				plateOpacity: "Прозрачность плашки, %",
			},
			options: {
				font: {
					sans: "Без засечек",
					serif: "С засечками",
					mono: "Моноширинный",
				},
				position: {
					"top-left": "Сверху слева",
					"top-center": "Сверху по центру",
					"top-right": "Сверху справа",
					"middle-left": "По центру слева",
					center: "По центру",
					"middle-right": "По центру справа",
					"bottom-left": "Снизу слева",
					"bottom-center": "Снизу по центру",
					"bottom-right": "Снизу справа",
				},
			},
		},
		"skew-png": {
			title: "Наклонить PNG",
			description:
				"Сдвигает содержимое по горизонтали и вертикали — эффект перспективы.",
			params: { degX: "Наклон по X, °", degY: "Наклон по Y, °" },
		},
		"rotate-free-png": {
			title: "Повернуть на произвольный угол",
			description:
				"Поворот на любой угол. Холст расширяется под новые габариты, углы остаются прозрачными.",
			params: { angle: "Угол, °" },
		},
		"zoom-png": {
			title: "Приблизить PNG",
			description:
				"Увеличивает содержимое к центру. Холст прежнего размера — края обрезаются.",
			params: { scale: "Масштаб, %" },
		},
		"shift-png": {
			title: "Сдвинуть PNG",
			description: "Перемещает содержимое на заданное смещение по X и Y.",
			params: {
				offsetX: "Смещение X, px",
				offsetY: "Смещение Y, px",
				color: "Цвет фона",
			},
		},
		"vignette-png": {
			title: "Виньетка PNG",
			description: "Плавно затемняет края изображения, центр не затрагивает.",
			params: { strength: "Сила затемнения, %" },
		},
		"jpeg-artifacts-png": {
			title: "Артефакты JPEG",
			description:
				"Имитирует пережатие в JPEG с низким качеством — видимые квадраты и размытие цветов.",
			params: { quality: "Качество JPEG" },
		},
		"gamma-png": {
			title: "Гамма-коррекция PNG",
			description:
				"Корректирует яркость средних тонов. <1 темнее, >1 светлее, 1 — без изменений.",
			params: { value: "Гамма" },
		},
		"auto-contrast-png": {
			title: "Автоконтраст PNG",
			description:
				"Растягивает диапазон каждого канала на весь доступный диапазон яркости.",
		},
		"temperature-png": {
			title: "Температура PNG",
			description:
				"Положительные значения делают изображение теплее (оранжевее), отрицательные — холоднее (синеватее).",
			params: { percent: "Температура" },
		},
		"tint-png": {
			title: "Тонировать PNG",
			description:
				"Умножает цветовые каналы на выбранный оттенок с заданной силой.",
			params: { color: "Цвет тонирования", strength: "Сила, %" },
		},
		"svg-to-png": {
			title: "SVG в PNG",
			description:
				"Декодирует SVG-разметку в растровое изображение. Вставьте SVG-код слева.",
			params: { width: "Ширина результата, px" },
		},
		"png-is-transparent": {
			title: "Проверить: PNG прозрачный?",
			description:
				"Сообщает, есть ли в изображении прозрачные или полупрозрачные пиксели.",
			results: {
				transparentYes: "Да — есть прозрачные или полупрозрачные пиксели.",
				transparentNo: "Нет — все пиксели полностью непрозрачны.",
			},
		},
		"png-orientation": {
			title: "Ориентация PNG",
			description: "Сообщает, портрет это, ландшафт или квадрат.",
			results: {
				orientationPortrait: "Портрет — высота больше ширины.",
				orientationLandscape: "Ландшафт — ширина больше высоты.",
				orientationSquare: "Квадрат — стороны равны.",
			},
		},
	},
};
