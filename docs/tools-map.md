# Карта инструментов: реализовано · добавить · идеи

> Статус: **active**. Живой документ для сверки с каталогом.
>
> **Источник правды по id — реестр** `web/src/lib/registry/`. Этот список —
> навигационный: сверять перед использованием. Формат записи:
> `id — параметры через запятую`. Сравнение с каталогом источника (объём,
> нишевые клоны серий Logo*/Icon*/Stamp*/Signature*) — замер в
> `docs/plan-seo.md`, §2; здесь он не дублируется.
>
> Количество инструментов здесь не фиксируется — оно выводится из раздела 1 и из
> `TOOLS` в `registry/index.ts`, и дублировать его цифрой значит заставлять себя
> обновлять документ при каждом добавлении (`AGENTS.md`).

---

## 1. Реализовано

Ids приведены к фактическим в `web/src/lib/registry/`.

**Формат строки (проверяется тестом
`web/src/lib/registry/tools-map-doc.test.ts`):** в буллите всё **до первого
тире** `—` — это id инструментов через `/` или `,`; всё после тире — свободное
описание параметров и не разбирается. Второй id нельзя оставлять после тире,
иначе он не попадёт в разбор и инструмент будет считаться неописанным.

### Конвертация (`convert.ts`)

Отдельных «из формата в PNG» инструментов **нет**: входной формат выбирается
загрузкой файла, любой инструмент принимает PNG/JPG/WebP/GIF/BMP. Все конвертеры
исходят из PNG.

- svg-to-png — width результата (текстовый вход: SVG-код)
- png-to-bmp — 24-бит, фон вместо альфы
- convert-png-to-jpg — background, quality
- convert-png-to-webp — quality
- png-to-base64 / base64-to-png — строка
- png-to-data-uri / data-uri-to-png — строка
- png-to-hex / hex-to-png — rrggbbaa по строкам / tokens + width
- png-to-bytes / bytes-to-png — десятичные RGBA-байты по строкам / tokens +
  width
- png-to-rgb-values / rgb-values-to-png — rgba(r,g,b,a) по пикселям / числа +
  width

### Прозрачность (`alpha.ts`)

- change-png-opacity — percent
- set-alpha-channel-png — percent
- remove-alpha-channel-png — без параметров (фон `#ffffff` захардкожен, см.
  `docs/plan-fields-audit-fixes.md` D1)
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
- despeckle-alpha-png / close-holes-png — radius
- center-by-alpha-png — без параметров
- round-corners-png — radius
- circle-mask-png — size (диаметр, % меньшей стороны), offsetX, offsetY
- square-mask-png — widthPct, heightPct, offsetX, offsetY
- star-mask-png — points, innerRadius, size, rotation, offsetX, offsetY
- wavy-mask-png — size, amplitude, waves, phase, offsetX, offsetY

### Цвет (`color.ts`)

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
- quantize-png — colors (k, median-cut)
- decrease-color-count-png — maxColors (пресеты 2…256)
- custom-palette-png — colors (hex через запятую, ближайший цвет)
- dithering-png — colors (k), pattern (Floyd–Steinberg / Bayer 4×4)

### Разложение каналов (`color.ts`)

- png-to-hsl, png-to-hsv, png-to-hsi, png-to-cmyk, png-to-ycbcr, png-to-lab —
  component (h/s/l и т.п.), display (`gray` | `space-as-rgb`)

### Геометрия (`geometry.ts`)

- resize-png — width/height (размеры source по умолчанию; 0=авто для одной
  стороны), keepAspect
- crop-png — x, y, width/height (полная область source по умолчанию)
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
- split-into-parts-png — columns, rows (мультифайловый вывод, zip)
- trim-empty-space-png — threshold (альфа)
- change-canvas-size-png — width, height, anchor (3×3)
- change-aspect-ratio-png — ratio (пресеты), mode (crop/pad)
- swap-orientation-png — target (portrait/landscape)
- symmetric-copy-png — axis, keepSide

### Фильтры (`filters.ts`)

- blur-png — radius
- sharpen-png — strength
- vignette-png — strength
- jpeg-artifacts-png — quality (имитация пережатия jpg/webp)
- pixelate-png — blockSize (закрывает и их Color Blocks)
- randomize-pixels-png — blockSize, seed
- add-noise-png — amount, mode (mono/color), seed
- silhouette-png — color, threshold

### Анализ и вердикты (`analyze.ts`)

- png-file-size — без параметров (DOM-инструмент: кодирует в PNG и отдаёт
  размер)
- png-is-transparent / png-is-grayscale / png-orientation — текстовый вердикт
- verify-is-png — текстовый источник (base64/data-uri), вердикт по сигнатуре

### Маски по свойствам пикселей (`analyze.ts`)

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

### Генерация (`generate.ts`)

- create-empty-png — width, height, transparent, color
- single-color-png — width, height, color
- random-noise-png — width, height, seed
- linear-gradient-png — width, height, fromColor, toColor, direction
- color-spectrum-png — width, height, direction, saturation, lightness
- random-colors-png — width, height, blockSize, seed
- draw-grid-png — width, height, cols, rows, lineWidth, color, transparentBg
- placeholder-png — width, height, backgroundColor, color, showText
- blend-two-png — pair (from/to), width
- step-colors-png — pair (from/to), steps, width
- emoji-to-png — emoji, size
- text-to-png — text, fontSize, font, bold, color, transparentBg,
  backgroundColor, padding
- color-wheel-png — size, lightness
- complementary-png / triadic-png / tetradic-png / analogous-png /
  monochromatic-png / shades-png — общая база палитры: baseColor, width, layout;
  `shades-png` дополнительно count, depth
- mix-colors-png — colors, width
- sort-colors-png — colors, порядок (hue/brightness/saturation), width

### Текст (`text.ts`)

- add-text-png — text, fontSize, color, font, bold, position (3×3), margin,
  plate, plateColor, plateOpacity
- date-stamp-png — format, fontSize, color, font, bold, position, margin, plate,
  plateColor, plateOpacity
- watermark-tile-png — text, fontSize, color, opacity, angle, stepX, stepY,
  font, bold

---

## 2. Можно добавить — из onlinepngtools

Всё из этого списка **в реестре отсутствует**.

### Разложение каналов — остаток

- separate-colors — minShare слоя (MEDIUM, мультифайловый вывод → см. идеи в
  `docs/backlog.md`)

### Края и силуэт — остаток

- glow — radius, color, intensity
- shadow — offsetX, offsetY, blur, color, alpha

### Эффекты — остаток

- censor-region / erase-region — область (MEDIUM: нужен UI выделения → см. идеи)
- whirl — угол, центр, радиус (MEDIUM)

### Сортировка/блоки пикселей

- sort-pixels — blockSize, ключ (яркость/канал), направление (MEDIUM)
- slow-reveal / fade-in / fade-out / disappear — анимационные (→ идеи)

### Генераторы — остаток

- multi-color-gradient — список стопов (нужен новый тип параметра → MEDIUM-UI)

### Конвертеры — остаток

- png-to-gif — MEDIUM (однокадровый GIF-энкодер руками)
- gif-to-frames — MEDIUM (мультифайловый вывод → идеи)
- change-bit-depth — MEDIUM (пересборка PNG)

### Сжатие и качество

- compress, reduce-to-size, pick-a-color, extract-barcode — **не реализованы**;
  заведены в `docs/backlog.md` (reduce-to-size зависит от UX-райза «Download»).
  Пипетка для выбора цвета уже есть в превью, отдельная страница не планируется.
  Извлечение штрихкодов — HARD, вне планов.

---

## 3. Идеи на рассмотрение (нужна архитектура или спорная ценность)

Развёрнутые описания этих идей живут в `docs/backlog.md`, раздел «Идеи»; здесь
только список.

- **Region-инструменты** — нужен selection-компонент на превью: censor-region,
  erase-region, pixelate-area, blur-area, sharpen-area, reverse-colors-area.
  Один раз делаем selection — получаем шесть инструментов.
- **Мультифайловый выход** — механизм «результат = набор файлов» (zip)
  реализован на `split-into-parts-png`. Остальные 1→many: gif-to-frames,
  separate-colors, multiply-grid-as-files — подключаются по мере нужды.
- **Анимационные эффекты** — slow-reveal, fade-in/out, disappearing, scrolling:
  это видео/GIF на выходе, а не PNG. Отдельное решение о формате результата.
- **HARD-хвост** — glitch-art, extract-signature, handwritten→digital,
  extract-barcode.
- **Нишевые серии** (logo/icon/stamp/signature — замер в шапке документа) —
  сознательно не копируем: это обычные операции над конкретным контентом, у нас
  они доступны через базовые инструменты + цепочки.
- **Входные «из формата в PNG»** (jpg-to-png, webp-to-png) сознательно не
  заведены: загрузка файла уже принимает любой поддержанный формат, а
  инструмент-конвертер добавил бы лишнее звено цепочки. Отдельные страницы под
  эти интенты — предмет решения в `docs/plan-seo.md` §5.
