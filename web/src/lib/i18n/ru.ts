import type { Dict } from './dict';

export const ru: Dict = {
	header: {
		workspace: 'Рабочая область',
		catalog: 'Каталог',
		sectionsAria: 'Разделы',
		footerNote:
			'Все операции выполняются локально в вашем браузере — файлы никуда не отправляются.'
	},
	categories: {
		convert: 'Конвертация',
		alpha: 'Прозрачность',
		color: 'Цвет',
		geometry: 'Геометрия',
		filters: 'Фильтры',
		text: 'Текст',
		analyze: 'Анализ',
		generate: 'Генерация'
	},
	home: {
		defaultTitle: 'easy-png-tools — PNG-утилиты прямо в браузере',
		heroTitle: 'Что делаем с изображением?',
		heroLead: 'Найдите инструмент — все операции выполняются локально в браузере.',
		restoreLast: '↩ Вернуть последний: {title}',
		changeTool: '← Сменить инструмент'
	},
	catalog: {
		pageTitle: 'Все инструменты — easy-png-tools',
		metaDescription:
			'Полный каталог PNG-утилит: конвертация, прозрачность, цвет, геометрия, анализ и генерация изображений.',
		heading: 'Каталог инструментов',
		lead: '{count} утилит для работы с PNG. Все операции выполняются локально в браузере.'
	},
	toolPage: {
		fallbackTitle: 'Инструмент',
		legendSource: 'Исходник',
		legendSummary: 'Сводка',
		legendResult: 'Результат',
		legendParams: 'Параметры',
		stepHeading: 'Шаг {n}',
		removeStepAria: 'Убрать шаг',
		stepError: 'Шаг {n} ({title}): {msg}'
	},
	chain: {
		stepLabel: 'Шаг {n}: {title}',
		inputLegend: 'Вход',
		resultLegend: 'Результат',
		paramsLegend: 'Параметры',
		busyTitle: 'Обработка…',
		busyHint: 'Выполняется шаг цепочки',
		removeStepAria: 'Убрать шаг'
	},
	sourceCard: {
		replaceImage: 'Заменить изображение'
	},
	resultCard: {
		emptyTitle: 'Результат появится здесь',
		emptyHint: 'Сначала загрузите исходное изображение слева',
		processingTitle: 'Обработка…',
		processingHint: 'Изображение обрабатывается, это займёт немного времени',
		recalc: 'Пересчёт…',
		nextTool: '⛓ Следующий инструмент',
		breakChain: '✂ Оборвать цепочку'
	},
	paramsCard: {
		noParams: 'У этого инструмента нет параметров — результат уже готов.'
	},
	textInput: {
		heading: 'Текст',
		placeholder: 'Вставьте данные сюда',
		aria: 'Текстовые данные',
		decode: 'Декодировать'
	},
	textResult: {
		outputAria: 'Текстовый результат',
		copied: 'Скопировано',
		copy: 'Копировать',
		downloadTxt: 'Скачать .txt'
	},
	download: {
		busy: 'Готовим файл…',
		file: 'Скачать .{ext}'
	},
	infoPanel: {
		dimensions: 'Размеры',
		alpha: 'Альфа-канал',
		alphaYes: 'есть — есть полупрозрачные пиксели',
		alphaNo: 'нет',
		colorCount: 'Уникальных цветов (RGBA)'
	},
	dropZone: {
		pickDefault: 'Перетащите изображение сюда или нажмите, чтобы выбрать файл',
		overlayDefault: 'Отпустите файл, чтобы заменить изображение'
	},
	search: {
		placeholder: 'Найдите инструмент…',
		aria: 'Поиск инструмента',
		nothingFound: 'Ничего не найдено — попробуйте другое слово.'
	},
	ui: {
		showMask: 'Показать маску',
		decrease: 'Уменьшить',
		increase: 'Увеличить',
		reset: 'Сбросить',
		pipette: 'Пипетка',
		themeLight: 'Светлая тема',
		themeDark: 'Тёмная тема'
	},
	errors: {
		noImageRun: 'Этот инструмент не обрабатывает изображения',
		workerFailed: 'Ошибка исполнения в воркере',
		workerUnavailable: 'Воркер недоступен',
		notFound: 'Инструмент не найден',
		badTransform: 'Вырожденная матрица трансформации',
		skewAngle: 'Углы наклона не могут быть 90° или -90°',
		badHex: 'Некорректный HEX-цвет: "{value}"',
		radiusInt: 'Радиус должен быть целым неотрицательным числом',
		kernelSize: 'Ядро не совпадает с изображением по размеру',
		sizeInt: 'Ширина и высота должны быть целыми числами ≥ 1',
		cropBounds: 'Область обрезки не пересекает изображение',
		noCanvasCtx: 'Canvas 2D context недоступен в этом окружении',
		badBase64: 'Ожидается base64-строка или data-uri изображения',
		qualityRange: 'quality должно быть в диапазоне 0..1',
		svgSize: 'Не удалось определить размер SVG',
		svgLoad: 'Не удалось загрузить SVG — проверьте разметку',
		encodeUnsupported: 'Браузер не поддерживает кодирование в {mime}',
		unsupportedFile:
			'Неподдерживаемый формат файла ({type}). Поддерживаются PNG, JPEG, WebP, GIF и BMP.',
		widthInt: 'Ширина изображения должна быть целым числом ≥ 1',
		noHexPixels: 'Не найдено hex-значений пикселей',
		badPixelToken: 'Каждый пиксель — 8 hex-символов RRGGBBAA, значения через пробел',
		pixelCountMismatch: 'Число пикселей ({count}) не делится на ширину {width} без остатка',
		toolNotFound: 'Инструмент "{id}" не найден',
		badJson: 'Файл не является корректным JSON',
		badPipelineShape: 'Структура файла не похожа на цепочку шагов',
		pipelineVersion: 'Неподдерживаемая версия цепочки: {version}',
		noSteps: 'В файле нет списка шагов',
		paramNumber: 'Параметр "{id}" должен быть числом',
		paramString: 'Параметр "{id}" должен быть строкой',
		paramBool: 'Параметр "{id}" должен быть значением флажка',
		resizeSize: 'Ширина и/или высота должны быть положительными',
		cropSize: 'Ширина и высота области обрезки должны быть положительными',
		sizePositive: 'Размеры должны быть положительными и конечными'
	},
	tools: {
		'jpg-to-png': {
			title: 'Конвертировать JPG в PNG',
			description: 'Открывает JPEG и сохраняет его как PNG без потерь. Прозрачность, если была, сохраняется.'
		},
		'webp-to-png': {
			title: 'Конвертировать WebP в PNG',
			description: 'Перекодирует WebP-изображение в универсальный PNG.'
		},
		'gif-to-png': {
			title: 'Конвертировать GIF в PNG',
			description: 'Достаёт первый кадр GIF-анимации и сохраняет его как PNG.'
		},
		'bmp-to-png': {
			title: 'Конвертировать BMP в PNG',
			description: 'Перекодирует BMP в компактный PNG без потерь.'
		},
		'ico-to-png': {
			title: 'Конвертировать ICO в PNG',
			description: 'Превращает иконку .ico в обычный PNG нужного размера.'
		},
		'png-to-bmp': {
			title: 'Конвертировать PNG в BMP',
			description: 'Сохраняет изображение в 24-битный BMP без альфа-канала: прозрачность заменяется чёрным фоном.'
		},
		'png-to-base64': {
			title: 'PNG в Base64',
			description: 'Кодирует изображение в base64-строку для вставки в код или стили.'
		},
		'base64-to-png': {
			title: 'Base64 в PNG',
			description: 'Декодирует base64-строку или data-uri обратно в картинку. Вставьте строку слева.'
		},
		'png-to-data-uri': {
			title: 'PNG в Data URI',
			description: 'Строит полный data-uri (data:image/png;base64,…) для встраивания в HTML/CSS.'
		},
		'data-uri-to-png': {
			title: 'Data URI в PNG',
			description: 'Декодирует data:image/…;base64,… обратно в файл картинки.'
		},
		'png-to-hex': {
			title: 'PNG в HEX-пиксели',
			description: 'Показывает все пиксели как hex-значения rrggbbaa — по строкам, через пробел.'
		},
		'hex-to-png': {
			title: 'HEX-пиксели в PNG',
			description: 'Собирает картинку из hex-значений rrggbbaa (через пробел). Укажите ширину — высота рассчитается сама.',
			params: { width: 'Ширина изображения' }
		},
		'resize-png': {
			title: 'Изменить размер PNG',
			description: 'Масштабирование изображения с билинейной интерполяцией. При сохранении пропорций одна сторона задаёт масштаб, а если указаны обе — изображение вписывается в эти размеры.',
			params: { width: 'Ширина (0 — авто)', height: 'Высота (0 — авто)', keepAspect: 'Сохранять пропорции' }
		},
		'crop-png': {
			title: 'Обрезать PNG',
			description: 'Вырезает прямоугольную область. Координаты и размеры выходят за границы изображения — область усекается до пересечения с картинкой.',
			params: { x: 'X (слева)', y: 'Y (сверху)', width: 'Ширина области', height: 'Высота области' }
		},
		'rotate-png': {
			title: 'Повернуть PNG',
			description: 'Поворот на 90°, 180° или 270° по часовой стрелке без потери качества.',
			params: { angle: 'Угол поворота' },
			options: { angle: { '90': '90° по часовой', '180': '180°', '270': '270° по часовой' } }
		},
		'flip-png': {
			title: 'Отразить PNG',
			description: 'Зеркальное отражение по горизонтали или вертикали без потери качества.',
			params: { axis: 'Ось отражения' },
			options: {
				axis: {
					horizontal: 'По горизонтали (слева направо)',
					vertical: 'По вертикали (сверху вниз)'
				}
			}
		},
		'add-padding-png': {
			title: 'Добавить поля PNG',
			description: 'Расширяет холст во все стороны на выбранное число пикселей.',
			params: { padding: 'Поля, px', transparent: 'Прозрачные поля', color: 'Цвет полей' }
		},
		'add-border-png': {
			title: 'Добавить рамку PNG',
			description: 'Рисует цветную рамку вокруг изображения выбранной толщины.',
			params: { thickness: 'Толщина рамки, px', color: 'Цвет рамки' }
		},
		'fit-on-background-png': {
			title: 'Вписать PNG на фон',
			description: 'Помещает изображение по центру полотна заданного размера с прозрачным или цветным фоном.',
			params: {
				width: 'Ширина полотна',
				height: 'Высота полотна',
				transparent: 'Прозрачный фон',
				color: 'Цвет фона'
			}
		},
		'tile-png': {
			title: 'Замостить PNG',
			description: 'Повторяет изображение сеткой из выбранного числа столбцов и строк.',
			params: { columns: 'Столбцов', rows: 'Строк' }
		},
		'center-by-alpha-png': {
			title: 'Центрировать PNG по содержимому',
			description: 'Находит непрозрачную часть изображения и размещает её по центру прежнего холста.'
		},
		'blur-png': {
			title: 'Размытие PNG',
			description: 'Гауссово размытие: три прохода разделяемого бокса — быстро при любом радиусе. Прозрачные края не темнеют.',
			params: { radius: 'Радиус, px' }
		},
		'sharpen-png': {
			title: 'Резкость PNG',
			description: 'Подчёркивает края ядром резкости; сила задаёт смесь с оригиналом. 0% — без изменений.',
			params: { strength: 'Сила, %' }
		},
		'grayscale-png': {
			title: 'Чёрно-белый PNG',
			description: 'Переводит изображение в оттенки серого по яркостной формуле BT.601. Альфа сохраняется.'
		},
		'invert-colors-png': {
			title: 'Инвертировать цвета PNG',
			description: 'Обращает каждый цветовой канал (255 − значение). Альфа не меняется.'
		},
		'adjust-brightness-contrast-png': {
			title: 'Яркость и контраст PNG',
			description: 'Изменяет яркость и контраст в диапазоне от −100 до +100. Значение 0 — без изменений.',
			params: { brightness: 'Яркость', contrast: 'Контраст' }
		},
		'change-png-opacity': {
			title: 'Изменить прозрачность PNG',
			description: 'Умножает альфа-канал на процент: 0% — полностью прозрачный, 100% — без изменений.',
			params: { percent: 'Прозрачность, %' }
		},
		'sepia-png': {
			title: 'Эффект сепии',
			description: 'Тонирует изображение в тёплые коричневые тона классической сепии.'
		},
		'change-png-hue': {
			title: 'Сменить оттенок PNG',
			description: 'Сдвиг цветового тона по кругу. Насыщенность и яркость сохраняются.',
			params: { degrees: 'Сдвиг тона, °' }
		},
		'extract-channel-png': {
			title: 'Извлечь канал PNG',
			description: 'Оставляет выбранный канал — красный, зелёный или синий — в оттенках серого.',
			params: { channel: 'Канал' },
			options: { channel: { red: 'Красный', green: 'Зелёный', blue: 'Синий' } }
		},
		'swap-channels-png': {
			title: 'Переставить каналы PNG',
			description: 'Меняет местами два цветовых канала — быстрый способ получить необычный окрас.',
			params: { pair: 'Пара каналов' },
			options: {
				pair: { 'r-g': 'Красный ↔ Зелёный', 'r-b': 'Красный ↔ Синий', 'g-b': 'Зелёный ↔ Синий' }
			}
		},
		'black-and-white-png': {
			title: 'Чёрно-белый PNG по порогу',
			description: 'Жёсткая бинаризация по яркости: каждый пиксель становится чёрным или белым.',
			params: { threshold: 'Порог яркости, %' }
		},
		'posterize-png': {
			title: 'Постеризация PNG',
			description: 'Уменьшает число уровней каждого канала — плакатный эффект.',
			params: { levels: 'Уровней на канал' }
		},
		'two-colors-png': {
			title: 'Два цвета PNG',
			description: 'Перекрашивает изображение в два выбранных цвета по порогу яркости.',
			params: {
				lightColor: 'Цвет светлых участков',
				darkColor: 'Цвет тёмных участков',
				threshold: 'Порог яркости, %'
			}
		},
		'convert-png-to-jpg': {
			title: 'Конвертировать PNG в JPG',
			description: 'Прозрачность накладывается на выбранный цвет подложки (по умолчанию белый), результат сохраняется в JPEG.',
			params: { background: 'Цвет подложки', quality: 'Качество JPEG' }
		},
		'convert-png-to-webp': {
			title: 'Конвертировать PNG в WebP',
			description: 'Перекодирует изображение в WebP с настраиваемым качеством. Прозрачность сохраняется.',
			params: { quality: 'Качество WebP' }
		},
		'remove-alpha-channel-png': {
			title: 'Убрать альфа-канал PNG',
			description: 'Накладывает изображение на белый фон и сохраняет без прозрачности.'
		},
		'set-alpha-channel-png': {
			title: 'Задать альфа-канал PNG',
			description: 'Присваивает всем пикселям одинаковую прозрачность, цвета не меняются.',
			params: { percent: 'Прозрачность, %' }
		},
		'extract-alpha-mask-png': {
			title: 'Извлечь маску альфы PNG',
			description: 'Превращает прозрачность в чёрно-белую непрозрачную маску.'
		},
		'round-corners-png': {
			title: 'Скруглить углы PNG',
			description: 'Обрезает углы по радиусу, заданному в процентах от половины меньшей стороны.',
			params: { radius: 'Радиус скругления, %' }
		},
		'invert-alpha-png': {
			title: 'Инвертировать альфа-канал PNG',
			description: 'Непрозрачные области становятся прозрачными и наоборот.'
		},
		'remove-background-png': {
			title: 'Удалить фон PNG (умно)',
			description: 'Убирает однотонный фон: по цвету с допуском, только внешние области от краёв или весь совпадающий цвет. Умеет сглаживать границу.',
			params: {
				color: 'Цвет фона',
				tolerance: 'Допуск похожести, %',
				outerOnly: 'Только внешние области',
				smooth: 'Сглаживание границы, проходы'
			}
		},
		'add-stroke-png': {
			title: 'Обвести PNG',
			description: 'Добавляет цветную обводку-кольцо вокруг непрозрачного содержимого заданной толщины.',
			params: { color: 'Цвет обводки', thickness: 'Толщина, px' }
		},
		'find-contour-png': {
			title: 'Найти контур PNG',
			description: 'Оставляет только линию по границе непрозрачных областей выбранного цвета и толщины.',
			params: { color: 'Цвет линии', thickness: 'Толщина линии, px' }
		},
		'make-thicker-png': {
			title: 'Утолщить PNG',
			description: 'Расширяет непрозрачные области на заданное число пикселей.',
			params: { radius: 'На сколько px' }
		},
		'make-thinner-png': {
			title: 'Утончить PNG',
			description: 'Сужает непрозрачные области — утоньшает штрихи надписей и деталей.',
			params: { radius: 'На сколько px' }
		},
		'harden-alpha-png': {
			title: 'Жёсткие края PNG',
			description: 'Бинаризует альфа-канал по порогу: полупрозрачные пиксели становятся либо полностью прозрачными, либо непрозрачными.',
			params: { threshold: 'Порог альфы, %' }
		},
		'despeckle-alpha-png': {
			title: 'Убрать мусор PNG',
			description: 'Открытие: убирает одиночные полупрозрачные пиксели и мелкие крапинки.',
			params: { radius: 'Радиус очистки, px' }
		},
		'close-holes-png': {
			title: 'Закрыть дыры PNG',
			description: 'Закрытие: заполняет одиночные прозрачные точки внутри объекта.',
			params: { radius: 'Радиус закрытия, px' }
		},
		'remove-color-from-png': {
			title: 'Удалить цвет из PNG (прозрачность)',
			description: 'Делает прозрачными все пиксели, близкие к выбранному цвету. Порог задаёт допустимое отклонение в процентах от максимального цветового расстояния.',
			params: { targetColor: 'Цвет для удаления', tolerance: 'Порог похожести, %' }
		},
		'png-info': {
			title: 'Информация о PNG',
			description: 'Показывает размеры, наличие альфа-канала и количество уникальных цветов загруженного изображения.'
		},
		'create-empty-png': {
			title: 'Создать пустой PNG',
			description: 'Генерирует холст выбранного размера — прозрачный или залитый цветом.',
			params: { width: 'Ширина', height: 'Высота', transparent: 'Прозрачный', color: 'Цвет' }
		},
		'single-color-png': {
			title: 'Создать одноцветный PNG',
			description: 'Генерирует прямоугольник заданного размера и цвета.',
			params: { width: 'Ширина', height: 'Высота', color: 'Цвет' }
		},
		'random-noise-png': {
			title: 'Создать случайный шум PNG',
			description: 'Генерирует картинку со случайными пикселями. Зерно фиксирует результат: одно зерно — одна картинка.',
			params: { width: 'Ширина', height: 'Высота', seed: 'Зерно' }
		},
		'linear-gradient-png': {
			title: 'Создать градиент PNG',
			description: 'Генерирует плавный переход между двумя цветами по горизонтали или вертикали.',
			params: {
				width: 'Ширина',
				height: 'Высота',
				fromColor: 'Цвет начала',
				toColor: 'Цвет конца',
				direction: 'Направление'
			},
			options: { direction: { horizontal: 'По горизонтали', vertical: 'По вертикали' } }
		},
		'png-is-grayscale': {
			title: 'Проверить: PNG монохромный?',
			description: 'Сообщает, состоит ли изображение только из оттенков серого.',
			results: {
				grayscaleYes: 'Да — все пиксели являются оттенками серого.',
				grayscaleNo: 'Нет — найдены цветные пиксели.'
			}
		},
		'add-text-png': {
			title: 'Надпись на PNG',
			description:
				'Рисует текст на изображении: шрифт, размер, цвет, жирность, позиция на сетке 3×3 и опциональная подложка.',
			params: {
				text: 'Текст',
				fontSize: 'Размер шрифта, px',
				color: 'Цвет текста',
				font: 'Шрифт',
				bold: 'Жирный',
				position: 'Позиция',
				margin: 'Отступ, px',
				plate: 'Подложка',
				plateColor: 'Цвет подложки',
				plateOpacity: 'Прозрачность плашки, %'
			},
			options: {
				font: { sans: 'Без засечек', serif: 'С засечками', mono: 'Моноширинный' },
				position: {
					'top-left': 'Сверху слева',
					'top-center': 'Сверху по центру',
					'top-right': 'Сверху справа',
					'middle-left': 'По центру слева',
					center: 'По центру',
					'middle-right': 'По центру справа',
					'bottom-left': 'Снизу слева',
					'bottom-center': 'Снизу по центру',
					'bottom-right': 'Снизу справа'
				}
			}
		},
		'date-stamp-png': {
			title: 'Дата-штамп PNG',
			description:
				'Ставит текущую дату и время по строке формата (токены YYYY MM DD hh mm ss). Оформление — как у надписи.',
			params: {
				format: 'Формат',
				fontSize: 'Размер шрифта, px',
				color: 'Цвет текста',
				font: 'Шрифт',
				bold: 'Жирный',
				position: 'Позиция',
				margin: 'Отступ, px',
				plate: 'Подложка',
				plateColor: 'Цвет подложки',
				plateOpacity: 'Прозрачность плашки, %'
			},
			options: {
				font: { sans: 'Без засечек', serif: 'С засечками', mono: 'Моноширинный' },
				position: {
					'top-left': 'Сверху слева',
					'top-center': 'Сверху по центру',
					'top-right': 'Сверху справа',
					'middle-left': 'По центру слева',
					center: 'По центру',
					'middle-right': 'По центру справа',
					'bottom-left': 'Снизу слева',
					'bottom-center': 'Снизу по центру',
					'bottom-right': 'Снизу справа'
				}
			}
		},
		'skew-png': {
			title: 'Наклонить PNG',
			description: 'Сдвигает содержимое по горизонтали и вертикали — эффект перспективы.',
			params: { degX: 'Наклон по X, °', degY: 'Наклон по Y, °' }
		},
		'rotate-free-png': {
			title: 'Повернуть на произвольный угол',
			description: 'Поворот на любой угол. Холст расширяется под новые габариты, углы остаются прозрачными.',
			params: { angle: 'Угол, °' }
		},
		'zoom-png': {
			title: 'Приблизить PNG',
			description: 'Увеличивает содержимое к центру. Холст прежнего размера — края обрезаются.',
			params: { scale: 'Масштаб, %' }
		},
		'shift-png': {
			title: 'Сдвинуть PNG',
			description: 'Перемещает содержимое на заданное смещение по X и Y.',
			params: { offsetX: 'Смещение X, px', offsetY: 'Смещение Y, px', color: 'Цвет фона' }
		},
		'vignette-png': {
			title: 'Виньетка PNG',
			description: 'Плавно затемняет края изображения, центр не затрагивает.',
			params: { strength: 'Сила затемнения, %' }
		},
		'jpeg-artifacts-png': {
			title: 'Артефакты JPEG',
			description: 'Имитирует пережатие в JPEG с низким качеством — видимые квадраты и размытие цветов.',
			params: { quality: 'Качество JPEG' }
		},
		'gamma-png': {
			title: 'Гамма-коррекция PNG',
			description: 'Корректирует яркость средних тонов. <1 темнее, >1 светлее, 1 — без изменений.',
			params: { value: 'Гамма' }
		},
		'auto-contrast-png': {
			title: 'Автоконтраст PNG',
			description: 'Растягивает диапазон каждого канала на весь доступный диапазон яркости.'
		},
		'temperature-png': {
			title: 'Температура PNG',
			description: 'Положительные значения делают изображение теплее (оранжевее), отрицательные — холоднее (синеватее).',
			params: { percent: 'Температура' }
		},
		'tint-png': {
			title: 'Тонировать PNG',
			description: 'Умножает цветовые каналы на выбранный оттенок с заданной силой.',
			params: { color: 'Цвет тонирования', strength: 'Сила, %' }
		},
		'svg-to-png': {
			title: 'SVG в PNG',
			description: 'Декодирует SVG-разметку в растровое изображение. Вставьте SVG-код слева.',
			params: { width: 'Ширина результата, px' }
		},
		'png-is-transparent': {
			title: 'Проверить: PNG прозрачный?',
			description: 'Сообщает, есть ли в изображении прозрачные или полупрозрачные пиксели.',
			results: {
				transparentYes: 'Да — есть прозрачные или полупрозрачные пиксели.',
				transparentNo: 'Нет — все пиксели полностью непрозрачны.'
			}
		},
		'png-orientation': {
			title: 'Ориентация PNG',
			description: 'Сообщает, портрет это, ландшафт или квадрат.',
			results: {
				orientationPortrait: 'Портрет — высота больше ширины.',
				orientationLandscape: 'Ландшафт — ширина больше высоты.',
				orientationSquare: 'Квадрат — стороны равны.'
			}
		}
	}
};
