# Карта инструментов: реализовано · добавить · идеи

> Живой документ для сверки с каталогом. Формат записи: `id / название — параметры через запятую`.
> Источник сравнения: onlinepngtools.com (311 уникальных; 107 из них — нишевые клоны серий Logo*/Icon*/Stamp*/Signature* поверх обычных операций).

Итого: реализовано **71**, отсутствует **~110** (из них EASY **71**, MEDIUM 35, HARD 4).

---

## 1. Реализовано (71)

### Конвертация (15)

- jpg-to-png — без параметров
- webp-to-png — без параметров
- gif-to-png — первый кадр
- bmp-to-png — без параметров
- ico-to-png — выбор размера кадра
- png-to-bmp — 24-бит, фон вместо альфы
- convert-png-to-jpg — background, quality
- convert-png-to-webp — quality
- svg-to-png — width результата
- png-to-base64 / base64-to-png — строка
- png-to-data-uri / data-uri-to-png — строка
- png-to-hex — rrggbbaa по строкам / hex-to-png — tokens + width

### Прозрачность (15)

- change-png-opacity — percent
- set-alpha-channel-png — percent
- remove-alpha-channel-png — без параметров
- extract-alpha-mask-png — без параметров
- invert-alpha-png — без параметров
- remove-background-png — color, tolerance, outerOnly, smooth
- remove-color-from-png — targetColor, tolerance
- add-stroke-png — color, thickness
- find-contour-png — color, thickness
- make-thicker-png / make-thinner-png — radius
- harden-alpha-png — threshold
- despeckle-alpha-png / close-holes-png — radius
- center-by-alpha-png — без параметров

### Цвет (14)

- grayscale-png / invert-colors-png / sepia-png / auto-contrast-png — без параметров
- adjust-brightness-contrast-png — brightness, contrast
- change-png-hue — degrees
- extract-channel-png — channel (r/g/b)
- swap-channels-png — pair (r-g/r-b/g-b)
- black-and-white-png — threshold
- posterize-png — levels
- two-colors-png — lightColor, darkColor, threshold
- temperature-png — percent
- gamma-png — value
- tint-png — color, strength

### Геометрия (12)

- resize-png — width (0=авто), height (0=авто), keepAspect
- crop-png — x, y, width, height
- rotate-png — angle (90/180/270)
- flip-png — axis (h/v)
- skew-png — degX, degY
- rotate-free-png — angle
- zoom-png — scale
- shift-png — offsetX, offsetY, color фона
- add-padding-png — padding, transparent, color
- add-border-png — thickness, color
- fit-on-background-png — width, height, transparent, color
- tile-png — columns, rows

### Фильтры (4)

- blur-png — radius
- sharpen-png — strength
- vignette-png — strength
- jpeg-artifacts-png — quality (имитация пережатия jpg/webp)

### Анализ (4)

- png-info — размеры, альфа, число цветов
- png-is-transparent / png-is-grayscale / png-orientation — текстовый вердикт

### Генерация (4)

- create-empty-png — width, height, transparent, color
- single-color-png — width, height, color
- random-noise-png — width, height, seed
- linear-gradient-png — width, height, fromColor, toColor, direction

### Текст (2)

- add-text-png — text, fontSize, color, font, bold, position (3×3), margin, plate, plateColor, plateOpacity
- date-stamp-png — format, fontSize, color, font, bold, position, margin, plate, plateColor, plateOpacity

---

## 2. Можно добавить — из onlinepngtools

### Палитры и цветовые утилиты (10)

- color-wheel-generator — size, кольца/сектора, показ hex при клике (у нас — статичный свотч-полотно)
- complementary-palette — baseColor
- monochromatic-palette — baseColor, count
- analogous-palette — baseColor, spread
- triadic-palette — baseColor
- tetradic-palette — baseColor
- similar-shades-palette — baseColor, count, range
- sort-colors — источник (палитра-картинка или список), порядок (hsl/luma)
- mix-colors — colors[], веса?
- average-color — colors[]; blend-two — a, b, steps; step-between — a, b, steps (три частных случая одного движка)

### Разложение каналов (7)

- png-to-hsl / hsv / hsi / cmyk / ycbcr / lab — channel (какой компонент показать), режим отображения (серый/окрашенный)
- separate-colors — minShare слоя (MEDIUM, мультифайловый вывод → пока идея)

### Маски по свойствам пикселей (7)

- show-transparent-areas — подсветка цветом, полупрозрачность подсветки
- show-grayscale-pixels / show-color-pixels — маска серых/цветных
- light-pixel-mask / dark-pixel-mask — threshold яркости
- unique-color-mask — порог редкости
- extract-color-from-png — color, tolerance (обратное remove-color: оставить только цвет)

### Фигурные маски (4)

- circle-mask — diameter/fit, позиция
- square-mask — side, fit
- star-mask — rays, innerRadius, rotation
- wavy-mask — amplitude, frequency, направление края

### Края и силуэт (5)

- feather-edges — radius (размытие только альфы)
- clean-edges-defringe — tolerance, радиус подбора цвета края
- silhouette — color силуэта
- glow — radius, color, intensity
- shadow — offsetX, offsetY, blur, color, alpha

### Эффекты (5)

- pixelate — blockSize (! обещан в роадмапе)
- randomize-pixels — blockSize, seed
- add-noise — amount, моно/цветной (их Add Noise; наш noise только генератор)
- censor-region / erase-region — область (MEDIUM: нужен UI выделения → см. идеи)
- whirl — угол, центр, радиус (MEDIUM)

### Сортировка/блоки пикселей (3)

- sort-pixels — blockSize, ключ (яркость/канал), направление (MEDIUM)
- color-blocks — blockSize (усреднение блоков) — EASY, родственник pixelate
- slow-reveal / fade-in / fade-out / disappear — анимационные (→ идеи)

### Сжатие и качество (5, все MEDIUM)

- compress-png — уровень усилий
- reduce-file-size — целевой размер KB (итеративный поиск)
- optimize-png — пресеты
- change-quality — честная семантика для lossless (см. план-гапы §риск)
- low-quality-png — частично покрыт jpeg-artifacts; остаток = сильный quantize

### Генераторы (7)

- text-to-png — text, font, size, textColor, bgColor, padding (движок domText уже есть)
- emoji-to-png — emoji, size, шрифт эмодзи
- placeholder-png — w, h, text?, bg, fg
- color-spectrum — w, h, пространство (hsv-радуга)
- multi-color-gradient — список стопов (нужен новый тип параметра → MEDIUM-UI)
- colorful-random — блоки случайных цветов, размер блока, seed
- draw-grid — cols, rows, lineWidth, color, прозрачный фон

### Конвертеры (6)

- png-to-bytes / bytes-to-png — формат строки (dec/hex), порядок каналов
- png-to-rgb-values / rgb-values-to-png — аналогично
- verify-is-png — анализ сигнатуры файла (текстовый вердикт)
- png-to-gif — MEDIUM (однокадровый GIF-энкодер руками)
- gif-to-frames — MEDIUM (мультифайловый вывод → идея)
- change-bit-depth — MEDIUM (пересборка PNG)

### Геометрия-добивки (5)

- trim-empty-space — порог альфы (закрывает их Remove Border/Padding/Space одной операцией)
- change-canvas-size — w, h, якорь 3×3
- change-aspect-ratio — целевое отношение, режим (обрезать/вписать)
- landscape-to-portrait / portrait-to-landscape — авто-поворот 90° по ориентации
- symmetric-copy — ось (h/v), сторона

### Прочее единичное

- pick-a-color — пипетка уже есть в превью; отдельная страница не планируется (покрыто)
- watermark-image — в плане волны 4 (этап D)
- preview/test на цветных фонах — фича превью, не инструмент (решить позже)
- extract-barcode — HARD, вне планов

---

## 3. Идеи на рассмотрение (нужна архитектура или спорная ценность)

- **Region-инструменты** — требуется UI выделения прямоугольника/ластика на превью: censor-region, erase-region, pixelate-area, blur-area, sharpen-area, reverse-colors-area. Один раз делаем selection-компонент — получаем сразу шесть инструментов.
- **Мультифайловый вывод** — сейчас инструмент отдаёт одну картинку: split-into-parts, gif-to-frames, separate-colors, multiply-grid-as-files. Нужен механизм «результат = набор файлов» (zip?).
- **Анимационные эффекты** — slow-reveal, fade-in/out, disappearing, scrolling: это видео/GIF на выходе, а не PNG. Отдельное решение о формате результата.
- **HARD-хвост** — glitch-art, extract-signature, handwritten→digital, extract-barcode.
- **Нишевые серии** (logo/icon/stamp/signature — 107 клонов у источника) — сознательно не копируем: это обычные операции над конкретным контентом, у нас они доступны через базовые инструменты + цепочки.
