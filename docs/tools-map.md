# Карта инструментов: реализовано · добавить · идеи

> Живой документ для сверки с каталогом. Формат записи:
> `id / название — параметры через запятую`. Источник сравнения:
> onlinepngtools.com (311 уникальных; 107 из них — нишевые клоны серий
> Logo*/Icon*/Stamp*/Signature* поверх обычных операций).

---

## 1. Реализовано

### Конвертация

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
- png-to-bytes — десятичные RGBA-байты по строкам / bytes-to-png — tokens +
  width
- png-to-rgb-values — rgba(r,g,b,a) по пикселям / rgb-values-to-png — числа +
  width
- svg-to-png — width результата
- verify-is-png — текстовый источник (base64/data-uri), вердикт по сигнатуре

### Прозрачность

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
- feather-edges-png — radius (размытие только альфы)
- clean-edges-png — radius (defringe: RGB от ближайшего непрозрачного)
- watermark-image-png — вторая картинка-знак (загружается на странице), scale,
  opacity, position, margin
- despeckle-alpha-png / close-holes-png — radius
- center-by-alpha-png — без параметров
- round-corners-png — radius
- circle-mask-png — size (диаметр, % меньшей стороны), offsetX, offsetY
- square-mask-png — widthPct, heightPct, offsetX, offsetY
- star-mask-png — points, innerRadius, size, rotation, offsetX, offsetY
- wavy-mask-png — size, amplitude, waves, phase, offsetX, offsetY

### Цвет

- grayscale-png / invert-colors-png / sepia-png / auto-contrast-png — без
  параметров
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

### Квантование и палитры

- quantize-png — colors (k, median-cut)
- decrease-color-count-png — maxColors (пресеты 2…256)
- custom-palette-png — colors (hex через запятую, ближайший цвет)
- dithering-png — colors (k), pattern (Floyd–Steinberg / Bayer 4×4)

### Разложение каналов

- png-to-hsl / png-to-hsv / png-to-hsi — component (h/s/l и т.п.), display (gray
  | space-as-rgb)
- png-to-cmyk — component (c/m/y/k), display
- png-to-ycbcr — component (y/cb/cr), display
- png-to-lab — component (l/a/b), display

### Геометрия

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
- trim-empty-space-png — threshold (альфа)
- change-canvas-size-png — width, height, anchor (3×3)
- change-aspect-ratio-png — ratio (пресеты), mode (crop/pad)
- swap-orientation-png — target (portrait/landscape)
- symmetric-copy-png — axis, keepSide

### Фильтры

- blur-png — radius
- sharpen-png — strength
- vignette-png — strength
- jpeg-artifacts-png — quality (имитация пережатия jpg/webp)
- pixelate-png — blockSize (закрывает и их Color Blocks)
- randomize-pixels-png — blockSize, seed
- add-noise-png — amount, mode (mono/color), seed
- silhouette-png — color, threshold

### Анализ

- png-info — размеры, альфа, число цветов
- png-is-transparent / png-is-grayscale / png-orientation — текстовый вердикт

### Маски по свойствам пикселей

- show-transparent-png — color, opacity (подсветка прозрачных/полупрозрачных)
- show-grayscale-pixels-png — tolerance, mode (binary/highlight),
  highlightColor, highlightOpacity
- show-color-pixels-png — tolerance, mode, highlightColor, highlightOpacity
- light-pixel-mask-png — threshold, mode, highlightColor, highlightOpacity
- dark-pixel-mask-png — threshold, mode, highlightColor, highlightOpacity
- unique-color-mask-png — rarity (макс. повторов), mode, highlightColor,
  highlightOpacity
- extract-color-from-png — color, tolerance (оставить близкие, остальное
  прозрачным)

### Генерация

- create-empty-png — width, height, transparent, color
- single-color-png — width, height, color
- random-noise-png — width, height, seed
- linear-gradient-png — width, height, fromColor, toColor, direction
- text-to-png — text, fontSize, font, bold, color, transparentBg,
  backgroundColor, padding
- emoji-to-png — emoji, size
- placeholder-png — width, height, backgroundColor, color, showText
- color-spectrum-png — width, height, direction, saturation, lightness
- random-colors-png — width, height, blockSize, seed
- draw-grid-png — width, height, cols, rows, lineWidth, color, transparentBg

### Текст

- add-text-png — text, fontSize, color, font, bold, position (3×3), margin,
  plate, plateColor, plateOpacity
- date-stamp-png — format, fontSize, color, font, bold, position, margin, plate,
  plateColor, plateOpacity
- watermark-tile-png — text, fontSize, color, opacity, angle, stepX, stepY,
  font, bold

### Палитры и цветовые утилиты

- color-wheel-generator — size, кольца/сектора, показ hex при клике (у нас —
  статичный свотч-полотно)
- complementary-palette — baseColor
- monochromatic-palette — baseColor, count
- analogous-palette — baseColor, spread
- triadic-palette — baseColor
- tetradic-palette — baseColor
- similar-shades-palette — baseColor, count, range
- sort-colors — источник (палитра-картинка или список), порядок (hsl/luma)
- mix-colors — colors[], веса?
- average-color — colors[]; blend-two — a, b, steps; step-between — a, b, steps
  (три частных случая одного движка)

---

## 2. Можно добавить — из onlinepngtools

### Разложение каналов — остаток

- separate-colors — minShare слоя (MEDIUM, мультифайловый вывод → пока идея)

### Края и силуэт — остаток

- glow — radius, color, intensity
- shadow — offsetX, offsetY, blur, color, alpha

### Эффекты — остаток

- censor-region / erase-region — область (MEDIUM: нужен UI выделения → см. идеи)
- whirl — угол, центр, радиус (MEDIUM)

### Сортировка/блоки пикселей

- sort-pixels — blockSize, ключ (яркость/канал), направление (MEDIUM)
- slow-reveal / fade-in / fade-out / disappear — анимационные (→ идеи)

### Сжатие и качество — реализовано (см. Конвертация: compress, reduce-to-size; jpeg-artifacts; W8 quantize)

### Генераторы — остаток

- multi-color-gradient — список стопов (нужен новый тип параметра → MEDIUM-UI)

### Конвертеры — остаток

- png-to-gif — MEDIUM (однокадровый GIF-энкодер руками)
- gif-to-frames — MEDIUM (мультифайловый вывод → идея)
- change-bit-depth — MEDIUM (пересборка PNG)

### Прочее единичное

- pick-a-color — пипетка уже есть в превью; отдельная страница не планируется
  (покрыто)
- preview/test на цветных фонах — фича превью, не инструмент (решить позже)
- extract-barcode — HARD, вне планов

---

## 3. Идеи на рассмотрение (нужна архитектура или спорная ценность)

- **Region-инструменты** — требуется UI выделения прямоугольника/ластика на
  превью: censor-region, erase-region, pixelate-area, blur-area, sharpen-area,
  reverse-colors-area. Один раз делаем selection-компонент — получаем сразу
  шесть инструментов.
- **Мультифайловый вывод** — сейчас инструмент отдаёт одну картинку:
  split-into-parts, gif-to-frames, separate-colors, multiply-grid-as-files.
  Нужен механизм «результат = набор файлов» (zip?).
- **Анимационные эффекты** — slow-reveal, fade-in/out, disappearing, scrolling:
  это видео/GIF на выходе, а не PNG. Отдельное решение о формате результата.
- **HARD-хвост** — glitch-art, extract-signature, handwritten→digital,
  extract-barcode.
- **Нишевые серии** (logo/icon/stamp/signature — 107 клонов у источника) —
  сознательно не копируем: это обычные операции над конкретным контентом, у нас
  они доступны через базовые инструменты + цепочки.
