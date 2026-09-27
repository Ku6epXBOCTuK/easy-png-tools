# Карта инструментов: реализовано · добавить · идеи

> Статус: **active**. Навигационный список: что уже есть по адресам
> `/tools/<slug>`, что можно добавить, что отложено. Источник правды — реестр
> (`web/src/lib/registry/`), модель страницы и инструмента —
> `docs/architecture.md`, раздел 3; сверяться с реестром перед использованием.
> Количество инструментов здесь не фиксируется — оно выводится из раздела 1 и из
> `PAGES` (`AGENTS.md`).
>
> **Как читать строку.** `slug` — адрес страницы и имя скачиваемого файла;
> страница вызывает инструмент через `steps[0].id`, и у `id` нет png-интента
> (`crop-png` → `id: "crop"`, `png-to-hsl` → `id: "to-hsl"`). Имена полей — это
> id полей из `schema.fields` инструмента; составные поля (`size`, `pair`,
> `offset`, `style`, `plate`, `gradient`) в скобках раскрыты, но не выдуманы как
> отдельные поля. Сравнение с каталогом источника (объём, нишевые клоны серий
> Logo\*/Icon\*/Stamp\*) — замер в `docs/plan-seo.md` §2; здесь он не
> дублируется.
>
> **Формат строки (проверяется `web/src/lib/registry/tools-map-doc.test.ts`):**
> всё **до первого тире** `—` — это slug страниц через `/` или `,`; всё после
> тире — свободное описание параметров и не разбирается. Второй slug нельзя
> оставлять после тире, иначе он не попадёт в разбор и страница будет считаться
> неописанной.

---

## 1. Реализовано

Slugs приведены к фактическим в `web/src/lib/registry/pages/`. Разделы идут по
файлу реестра; поля — по схеме инструмента, который страница вызывает.

### Конвертация (`convert`)

Отдельных «из формата в PNG» инструментов **нет**: входной формат выбирается
загрузкой файла, любой инструмент принимает PNG/JPG/WebP/GIF/BMP. Все конвертеры
исходят из PNG.

- `convert-png-to-jpg` — background, quality
- `convert-png-to-webp` — quality
- `png-to-bmp` — без параметров (24-бит, фон вместо альфы)
- `svg-to-png` — width (ширина результата; вход — SVG-код)
- `png-to-base64`, `base64-to-png` — без параметров (строка)
- `png-to-data-uri`, `data-uri-to-png` — без параметров (строка)
- `png-to-hex`, `hex-to-png` — вход `width`; rrggbbaa по строкам / tokens
- `png-to-bytes`, `bytes-to-png` — вход `width`; десятичные RGBA-байты по
  строкам / tokens
- `png-to-rgb-values`, `rgb-values-to-png` — вход `width`; rgba(r,g,b,a) по
  пикселям / числа

### Прозрачность (`alpha`)

- `add-stroke-png` — color, thickness
- `find-contour-png` — color, thickness
- `remove-color-from-png` — targetColor, tolerance
- `remove-background-png` — color, tolerance, outerOnly, smooth
- `make-thicker-png`, `make-thinner-png` — radius
- `harden-alpha-png` — threshold
- `feather-edges-png` — radius (размытие только альфы)
- `clean-edges-png` — radius (defringe: RGB от ближайшего непрозрачного)
- `despeckle-alpha-png`, `close-holes-png` — radius
- `round-corners-png` — radius (% от половины меньшей стороны)
- `invert-alpha-png` — без параметров
- `extract-alpha-mask-png` — без параметров
- `set-alpha-channel-png` — percent
- `remove-alpha-channel-png` — без параметров (фон `#ffffff` захардкожен,
  `docs/plan-fields-audit-fixes.md` FA-D1)
- `circle-mask-png` — size (диаметр, % меньшей стороны), offset (x/y)
- `square-mask-png` — widthPct, heightPct, offset (x/y)
- `star-mask-png` — points, innerRadius, size, rotation, offset (x/y)
- `wavy-mask-png` — size, amplitude, waves, phase, offset (x/y)

### Цвет (`color`)

- `grayscale-png`, `invert-colors-png`, `sepia-png`, `auto-contrast-png` — без
  параметров
- `adjust-brightness-contrast-png` — brightness, contrast
- `change-png-opacity` — percent
- `change-png-hue` — degrees
- `temperature-png` — percent
- `gamma-png` — value
- `tint-png` — color, strength
- `two-colors-png` — pair (светлый/тёмный), threshold
- `black-and-white-png` — threshold
- `posterize-png` — levels
- `quantize-png` — colors (k, median-cut)
- `decrease-color-count-png` — maxColors (2…256)
- `custom-palette-png` — colors (hex через запятую, ближайший цвет)
- `dithering-png` — colors (k), pattern (Floyd–Steinberg / Bayer 4×4)
- `extract-channel-png` — channel (r/g/b)
- `swap-channels-png` — pair (r-g/r-b/g-b)

### Разложение каналов (`color`)

- `png-to-hsl`, `png-to-hsv`, `png-to-hsi`, `png-to-cmyk`, `png-to-ycbcr`,
  `png-to-lab` — component (h/s/l и т.п.), display (`gray` | `space-as-rgb`)

### Геометрия (`geometry`)

- `resize-png` — size (по умолчанию размер source, 0 по одной стороне = авто),
  keepAspect
- `crop-png` — x, y, size (по умолчанию вся область source)
- `rotate-png` — angle (90/180/270)
- `rotate-free-png` — angle
- `flip-png` — axis (h/v)
- `skew-png` — degX, degY
- `zoom-png` — scale
- `shift-png` — offsetX, offsetY, color
- `add-padding-png` — padding, transparent, color
- `add-border-png` — thickness, color
- `fit-on-background-png` — size, transparent, color
- `tile-png` — columns, rows
- `split-into-parts-png` — columns, rows (мультифайловый вывод, zip)
- `trim-empty-space-png` — threshold (по альфе)
- `change-canvas-size-png` — size, anchor (3×3)
- `change-aspect-ratio-png` — ratio (пресеты), mode (crop/pad)
- `swap-orientation-png` — target (portrait/landscape)
- `symmetric-copy-png` — axis, keepSide
- `center-by-alpha-png` — без параметров

### Фильтры (`filters`)

- `blur-png` — radius
- `sharpen-png` — strength
- `vignette-png` — strength
- `jpeg-artifacts-png` — quality (имитация пережатия jpg/webp; поле
  функциональное, у инструмента нет `output` — `docs/plan-seo.md` S1f)
- `pixelate-png` — blockSize
- `randomize-pixels-png` — blockSize, seed
- `add-noise-png` — amount, mode (mono/color), seed
- `silhouette-png` — color, threshold

### Анализ и вердикты (`analyze`)

- `png-file-size` — без параметров (DOM-инструмент: кодирует в PNG и отдаёт
  размер)
- `png-is-transparent`, `png-is-grayscale`, `png-orientation` — без параметров,
  текстовый вердикт
- `verify-is-png` — без параметров (вход — текст: base64/data-uri), вердикт по
  сигнатуре

### Маски по свойствам пикселей (`analyze`)

- `show-transparent-png` — mode, color, opacity
- `show-grayscale-pixels-png` — mode, tolerance, color, opacity
- `show-color-pixels-png` — mode, tolerance, color, opacity
- `light-pixel-mask-png` — mode, threshold, color, opacity
- `dark-pixel-mask-png` — mode, threshold, color, opacity
- `unique-color-mask-png` — mode, rarity (макс. повторов), color, opacity
- `extract-color-from-png` — color, tolerance

### Генерация (`generate`)

- `create-empty-png` — size, transparent, color
- `single-color-png` — size, color
- `random-noise-png` — size, seed
- `linear-gradient-png` — size, gradient (от/к, направление)
- `color-spectrum-png` — size, direction, saturation, lightness
- `random-colors-png` — size, blockSize, seed
- `draw-grid-png` — size, cols, rows, lineWidth, color, transparentBg
- `placeholder-png` — size, backgroundColor, color, showText
- `blend-two-png` — pair (от/к), width
- `step-colors-png` — pair (от/к), steps, width, layout (grid/strip)
- `color-wheel-png` — size, lightness
- `mix-colors-png` — colors, width
- `sort-colors-png` — colors, order (hue/brightness/saturation), width, layout
- `emoji-to-png` — emoji, size
- `text-to-png` — text, style (шрифт/размер/цвет/жирность), transparentBg,
  backgroundColor, padding
- `complementary-png`, `triadic-png`, `tetradic-png`, `analogous-png`,
  `monochromatic-png`, `shades-png` — baseColor, width, layout; у `analogous`
  ещё spread и count, у `monochromatic` — count и range, у `shades` — count и
  depth

### Текст (`text`)

- `add-text-png` — text, style (шрифт/размер/цвет/жирность), position (3×3),
  margin, plate (плашка, её цвет и прозрачность)
- `date-stamp-png` — format, style, position, margin, plate
- `watermark-tile-png` — text, style, opacity, angle, stepX, stepY

---

## 2. Можно добавить — из onlinepngtools

Всё из этого списка **в реестре отсутствует** — это план, а не факт. Список
проверяется `web/src/lib/registry/tools-map-doc.test.ts` в обратную сторону:
реализованный slug, оставшийся здесь, роняет тест.

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
  заведены в `docs/backlog.md`. Сжатие до целевого размера — прежде всего
  селектор формата в Download (S1f, `docs/plan-seo.md` §4): для lossy это
  quality-ручка, а для PNG — квантование палитры. Нужен ли отдельный инструмент
  под этот интент, решается по вордстату, имя страницы пока не выбрано. Пипетка
  для выбора цвета уже есть в превью, отдельная страница не планируется.
  Извлечение штрихкодов — HARD, вне планов.

---

## 3. Идеи на рассмотрение (нужна архитектура или спорная ценность)

Развёрнутые описания этих идей живут в `docs/backlog.md`, раздел «Идеи»; здесь
только список.

Буллиты этого раздела, как и раздела 2, перечисляют **несуществующие** страницы:
уже реализованные в них не называются, иначе тест решит, что slug пора
переносить в раздел 1. Реализованные примеры пишутся прозой между буллитами, как
ниже.

- **Region-инструменты** — нужен selection-компонент на превью: censor-region,
  erase-region, pixelate-area, blur-area, sharpen-area, reverse-colors-area.
  Один раз делаем selection — получаем шесть инструментов.
- **Мультифайловый выход** — остальные потребители механизма «результат = набор
  файлов»: gif-to-frames, separate-colors, multiply-grid-as-files — подключаются
  по мере нужды.

Механизм уже реализован на `split-into-parts-png` (`docs/architecture.md`,
раздел 7), он в разделе 1.

- **Анимационные эффекты** — slow-reveal, fade-in/out, disappearing, scrolling:
  это видео/GIF на выходе, а не PNG. Отдельное решение о формате результата.
- **HARD-хвост** — glitch-art, extract-signature, handwritten→digital,
  extract-barcode.
- **Нишевые серии** (logo/icon/stamp/signature — замер в шапке документа) —
  сознательно не копируем: это обычные операции над конкретным контентом, у нас
  они доступны через базовые инструменты + цепочки.
- **Входные «из формата в PNG»** (jpg-to-png, webp-to-png) — решение и его
  SEO-последствия описаны в `docs/plan-seo.md` §5; отдельные страницы под эти
  интенты — предмет решения там же.
