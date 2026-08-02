# Анализ: набор PNG-утилит для браузера

Проект: **easy-png-tools** — набор PNG-утилит, работающий полностью в браузере. Вдохновлён идеей онлайн-сервисов «все PNG-операции в одном месте»: никаких загрузок на сервер, всё считается локально.
Стек: **SvelteKit + @sveltejs/adapter-static** (статический экспорт, никакого сервера). Все данные обрабатываются на клиенте, ничего не уходит в сеть.

Источник идеи: типовой перечень утилит, который встречается в онлайн-наборах PNG-инструментов (~296 операций).

---

## 1. Ключевые технологии браузера

| Задача                                    | Средство                                                                                                           |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Декодирование изображений                 | `<img>` / `createImageBitmap()` / `ImageDecoder` — браузер нативно декодирует PNG, JPEG, WebP, GIF, BMP, ICO, AVIF |
| Кодирование PNG/JPEG/WebP                 | `canvas.toBlob()` / `toDataURL()` — нативные кодировщики                                                           |
| Пиксельная обработка                      | `ImageData` + `Uint8ClampedArray` (RGBA), read-only canvas                                                         |
| Чтение/анализ PNG-структуры               | Своя мини-библиотека чанков (IHDR/PLTE/tRNS) или `pngjs`                                                           |
| Сжатие/оптимизация PNG на байтовом уровне | `UPNG.js` (JS) либо `pngquant`/`oxipng` (WASM)                                                                     |
| GIF-анимации (fade/reveal и т.п.)         | `gifenc` / `gif.js` (JS), APNG — `UPNG`                                                                            |
| Кодирование GIF/BMP на байтовом уровне    | `gifenc`, простой ручной BMP-энкодер                                                                               |
| Тяжёлая математика без блокировки UI      | Web Workers, SharedArrayBuffer, WASM (zlib, квантование, ML)                                                       |
| Экономия памяти при больших изображениях  | `ImageBitmap`, работа тайлами, downscale до декорирования                                                          |

**Вывод для архитектуры:** ~90% утилит — это одна и та же связка «декодировать → прогнать через пиксельную функцию → закодировать». Разумно сделать общий ядро (`core/pipeline.ts` + набор операций над `ImageData`) и тонькие страницы-обёртки в SvelteKit. Каждая утилита = отдельный маршрут со своим UI (drag&drop слева, превью, параметры, скачивание справа).

---

## 2. Уровень EASY — canvas + ImageData, простые попиксельные операции и композиция

Реализация: загрузка в canvas → `getImageData()` → цикл по пикселям / перекомпоновка / отрисовка на выходной canvas → `toBlob('image/png')`. Без сложных алгоритмов, каждая утилита — часы работы.

### 2.1 Конвертация форматов и текстовые представления

- **convert-png-to-jpg / convert-jpg-to-png / convert-webp-to-png / convert-png-to-webp / convert-svg-to-png** — рисование на canvas + `toBlob()` нужного типа
- **convert-bmp-to-png / convert-ico-to-png / convert-gif-to-png** (первый кадр) — нативное декодирование браузером
- **convert-png-to-bmp** — BMP-формат простой, ~30 строк энкодера
- **convert-png-to-base64 / convert-base64-to-png / data-uri (в обе стороны)** — `FileReader.readAsDataURL` + строка
- **convert-png-to-bytes / convert-bytes-to-png / convert-png-to-hex / convert-hex-to-png / convert-png-to-rgb-values / convert-rgb-values-to-png** — чтение/запись `ImageData` в текст
- **convert-png-to-gif** (один кадр) — `gifenc`, тривиально

### 2.2 Прозрачность и альфа-канал

- **create-transparent-png, remove-color-from-png(простая версия), transparent-logo-maker, remove-logo/icon-background (по цвету)** — замена цвета на прозрачность по порогу близости
- **remove-alpha-channel-from-png, fill-alpha-channel-in-png, replace-alpha-channel-in-png, extract-alpha-channel-from-png, invert-png-alpha-channel** — манипуляции только с A-компонентой
- **generate-png-alpha-mask, show-transparent-png-areas, fill-transparent-png-pixels, convert-semi-transparent-png-to-opaque** — пороги и заливки по альфе
- **harden-png-edges** — бинаризация альфы по порогу

### 2.3 Цвет: замена, тон, каналы, цветовые пространства

- **change-png-color, change-png-color-tone, change-png-opacity, swap-png-colors, change-png-brightness, change-png-contrast, convert-png-to-grayscale, add-sepia-tone-to-png, change-png-hue, invert-png-colors, reverse-png-colors, convert-png-to-two-colors, convert-png-to-black-and-white, create-monochrome-png, generate-single-color-png** — попиксельные арифметики/преобразования
- **extract-png-color-channels, swap-rgba-color-channels, split-png-into-rgb-components** — перестановка/выделение RGBA-каналов
- **convert-png-to-hsl/hsv/hsi/cmyk/ycbcr/lab-colors** — известные формулы конвертации (Lab — чуть больше математики, но детерминировано)
- **generate-\*-color-palette (complementary/monochromatic/analogous/triadic/tetradic), generate-similar-color-shades, color-wheel-generator, mix-multiple-colors, calculate-average-color, simulate-paint-colors, blend-two-colors, step-between-two-colors, convert-color-names-to-png** — генераторы палитр/смешение без работы с изображением
- **posterize-png, create-color-spectrum-png, create-multi-color-gradient-png, generate-png-gradient-palette** — простые градиенты/квантование уровней

### 2.4 Геометрия, композиция, холст

- **resize-png, zoom-png, crop-png, cut-png, rotate-png, skew-png, shift-png, change-png-canvas-size, change-png-aspect-ratio, fit-png-in-rectangle, convert-landscape/portrait-png-to-portrait/landscape-png** — операции через `CanvasRenderingContext2D` (`drawImage`, `rotate`, `setTransform`)
- **flip-png-horizontally/vertically, mirror-png, reverse-png** — отражение/поворот на 180°
- **center-png, center-logo, center-icon** — центровка по bounding box альфа-канала
- **duplicate-png, clone-png, multiply-png, create-png-tile, create-symmetric-png, split-png-into-parts** — тайлинг/копирование
- **create-round-png, create-square-png, create-star-shaped-png, create-wavy-shaped-png, round-png-corners** — маски-«штампы» на альфе
- **add-png-border, add-padding-to-png, add-space-around-png, remove-padding-from-png, remove-space-around-png, remove-png-padding** — расширение/усадка холста
- **add-png-background, add-signature/logo/icon/stamp-background** — подложка под прозрачность

### 2.5 Текст, рамки, простые эффекты

- **add-text-to-png, convert-text-to-png, create-emoji-png, add-png-watermark, wrap-png-in-polaroid, create-logo-from-text, create-icon-from-text/emoji, create-custom-stamp, create-\*-stamp (round/rect/green/red/number/date-time/monogram/from-text/emoji), create-placeholder-png, create-empty-png, create-custom-png, generate-colorful-png, generate-random-png, generate-white-noise-png, generate-1x1-png, draw-png-grid** — рисование примитивов/случайных данных
- **add-noise-to-png, create-glitch-png, pixelate-png, censor-png, erase-part-of-png, randomize-png-pixels** — шум/порча байтов/блоки/кисть
- **add-shadow-to-png** — смещение + лёгкое размытие + композиция
- **add-artifacts-to-png** — простой вариант: JPEG-раундтрип через canvas

### 2.6 Анализ и проверки

- **analyze-png, find-png-file-size, find-png-dimensions, check-if-png-is-landscape-or-portrait, find-png-color-count, check-if-png-is-grayscale, check-if-png-is-transparent, verify-if-image-is-png, pick-png-color, pick-logo/icon-color, png-viewer, test-png, preview-png-on-colorful-background, test-png-on-multiple-backgrounds** — чтение заголовков/ImageData/гистограмм, «пипетка» по клику
- **sort-colors** — сортировка списка палитры (не изображения)

### 2.7 Семейства signature/logo/icon/stamp — простые вариации

Почти все «-maker/-color/-resize/-crop/-rotate/-bg/-space/-padding/-grayscale/-single-color/-white/-black/-semi-transparent/-shadow» для signature/logo/icon/stamp — это переиспользование операций из разделов выше с одним цветом/боксом. Отдельно перечислены только те, что требуют алгоритмов (см. MEDIUM/HARD).

> Примерный объём: **≈180–190 утилит уровня EASY.**

---

## 3. Уровень MEDIUM — нужен настоящий алгоритм (свёртки, морфология, квантование, анимация)

Реализация: честные алгоритмы на `ImageData`, часто в Web Worker, при необходимости — обвязка вокруг готовых JS-библиотек.

### 3.1 Фильтры и свёртки

- **blur-png, sharpen-png** — box/gaussian blur, ядро свёртки (упрощённо можно `ctx.filter`, но качественно — своя свёртка)
- **refine-png-edges, feather-png-edges, clean-png-edges** — работа с полупрозрачными краями: размытие альфы, де-контуринг, suppression полупрозрачности
- **add-glow-effect-to-png** — расширение альфы + размытие + цветное наложение

### 3.2 Морфология и контуры (операции над альфа-маской)

- **add-stroke-to-png, add-outline-to-png, remove-stroke-from-png, remove-outline-from-png, find-png-outline** — dilation/erosion по альфе, извлечение контура
- **make-signature-thicker / make-signature-thinner, make-icon-thicker / make-icon-thinner** — dilation/erosion
- **convert-outlined-icon-to-filled-icon** — flood-fill замкнутых областей; **convert-filled-icon-to-outlined-icon** — эрозия
- **remove-png-border, remove-border-around-icon, remove-stamp-border** — детект однотонной/декоративной рамки и вырезание

### 3.3 Квантование и цветовая кластеризация

- **quantize-png, decrease-png-color-count, set-custom-png-color-palette, add-dithering-to-png** — median cut / octree / Wu + Floyd–Steinberg; готовые JS-библиотеки (image-q и т.п.)
- **change-png-quality, create-low-quality-png** — симуляция потери качества через квантование + JPEG-раундтрип
- **convert-png-to-color-blocks** — мультипликативный блок-эффект/квантование по блокам
- **extract-png-color-palette, find-logo-color-scheme, extract-icon-colors** — частотная гистограмма + выбор топ-N / кластеризация
- **create-unique/popular/multi-color/outlier-color-mask** — статистика распределения цветов и выделение по маске

### 3.4 Выделение объектов по цвету / фону

- **remove-png-chroma-key** — порог по цвету + деспилл (убрать зелёную окантовку)
- **remove-color-from-png (качественная версия), extract-color-from-png, separate-png-colors, separate-logo-colors, separate-icon-colors** — сегментация по близости цвета
- **convert-png-to-silhouette, convert-png-to-stencil** — порог + заливка силуэта
- **extract-stamp-from-image (по цвету печати)** — хромакей/частотный фильтр по цвету чернил
- **remove-png-background (вариант без ИИ)** — проверенный цветовой подход, знакомый по популярным онлайн-наборам PNG-утилит. Работает хорошо на однотонном/градиентном фоне и в ряде случаев удобнее ИИ. Опции и алгоритм:
  - **Background Color** — выбор удаляемого цвета: пипеткой по изображению или hex/RGB
  - **Percentage (похожесть цвета)** — slider; 0% = убрать только точный цвет, >0% = убрать соседние оттенки в окрестности цвета (в цветовом пространстве)
  - **Delete Outer Areas (галочка)** — режим «только внешние пиксели»: удаляются только области, связанные с краями изображения (flood-fill/region-growing от границ). Выключена = удалять по всему холсту. Именно эта опция позволяет убрать фон, не задевая «пятна» того же цвета внутри объекта
  - **Smooth Edge Line + Radius** — постобработка: полупрозрачная полоса толщиной N px по границе удаления (сгладить переход)
  - **Preview Deleted Background** — двухцветный предпросмотр маски (что удаляется/что остаётся)
  - Реализация: выбор цвета → порог по цветовому расстоянию → (опц.) flood-fill от краёв → сглаживание краёв → маска поверх превью. Всё на `ImageData`, без ML.

### 3.5 Геометрические искажения и пиксель-сортировка

- **add-whirl-to-png** — свирл/вихрь: обратное отображение координат
- **sort-png-pixels** — pixel sorting (сортировка строк/столбцов по яркости/цвету)
- **upscale-png / downscale-png** — качественный ресемплинг (Lanczos, mipmap) поверх базового canvas-resize
- **remove-signature-background, transparent-png-signature-maker, clean-up-signature-edges, improve-low-quality-signature, clean-logo-edges, clean-icon-edges, fix-low-quality-stamp, convert-rubber-stamp-to-digital-stamp** — комбинация «цвет→прозрачность + де-шум + морфология краёв»
- **convert-image/png/jpg/icon/logo/signature-to-stamp** — стилизация в двухцветную «печать» (порог + зернистость + края)

### 3.6 Анимации и GIF-энкодинг

- **convert-png-to-gif, slowly-reveal-png, create-disappearing-png, fade-in-png, fade-out-png, create-scrolling-png, create-png-sequence-from-gif** — декомпозиция кадров GIF / генерация последовательности кадров + `gifenc`/`UPNG` (APNG)

> Примерный объём: **≈71 утилита уровня MEDIUM.**

---

## 4. Уровень HARD — WASM, ML, длительная обработка, тонкая подгонка алгоритма

Реализация: WASM-модули, ML-модели в браузере, длительная обработка с прогресс-барами.

- **compress-png / reduce-png-file-size / optimize-png** — сжатие на уровне формата: нужен качественный PNG-энкодер с контролем zlib-фильтров/битовой глубины и оптимизаторы. Решение: **pngquant / oxipng / zopfli (WASM)** + подгонка под «качество→размер» (это главный кандидат на HARD — именно здесь тюнинг бесконечен)
- **remove-png-background (вариант с ИИ)** — опциональное улучшение к MEDIUM-версии: ML-сегментация (Rembg/DeepLab в WASM или ONNX) для произвольных фото, где цветовой матчинг бессилен. Начинать можно без него — не-ИИ версия уже даёт рабочий инструмент
- **extract-signature-from-image** — детект подписи на скане/фото с произвольным фоном: де-шум, контраст, ML-детекция
- **convert-handwritten-signature-to-digital-signature** — очистка и «оцифровка» почерка (ML, денойзинг, выравнивание)
- **extract-barcode-from-image** — декодирование штрих-кодов/QR: готовая библиотека **zxing-wasm**, сопряжение с камерой/фото

> Итого **6 утилит уровня HARD** (все — опциональные улучшения/надстройки). Всё остальное (≈290) — EASY/MEDIUM.

---

## 5. Итоговая сводка

**EASY — ~185 утилит.** canvas + ImageData.
Примеры: crop, resize, rotate, конвертации, альфа-канал, палитры, текст, рамки, анализ.

**MEDIUM — ~71 утилита.** Алгоритмы, Web Workers, gifenc.
Примеры: blur, sharpen, морфология, квантование, дизеринг, pixel sorting, анимации GIF, remove-background (без ИИ).

**HARD — 6 утилит.** WASM (pngquant/oxipng/zxing), ML (ONNX/Rembg).
Примеры: compress/optimize, remove-background (ИИ), extract-signature, barcode.

---

## 6. Рекомендации по реализации

1. **Единое ядро обработки** — `src/lib/core/`: загрузка файла → `ImageData`, библиотека операций (`color.ts`, `alpha.ts`, `geometry.ts`, `filters.ts`, `morphology.ts`, `quantize.ts`, `channels.ts`), экспорт через `toBlob`. Каждая утилита — тонкая SvelteKit-страница + общие компоненты (DropZone, Preview, Download).
2. **Порядок внедрения:** MVP = ~40 топовых EASY (crop, resize, rotate, convert, alpha, grayscale, brightness, палитры, watermark, add-text, add-background, pick-color, analyze). Затем остальные EASY → MEDIUM пакетами по темам (фильтры, морфология, квантование, анимации). `remove-png-background` (без ИИ) — отличная «витринная» MEDIUM-фича ранних этапов: не требует ML и переиспользует `remove-color` + flood-fill + сглаживание краёв. HARD — в последнюю очередь.
3. **Производительность:** вся пиксельная работа и тяжёлые алгоритмы — в Web Worker; большие изображения декодировать сразу в downscale для превью; прогресс-бары для MEDIUM/HARD.
4. **SEO/структура:** SvelteKit + static adapter — каждая утилита отдельный маршрут (`/crop-png`, `/rotate-png`), что даёт удобные адреса и повторяет распространённую структуру наборов PNG-инструментов.
5. **Семейства logo/icon/stamp/signature** — переиспользуют общие операции; в коде это конфиг-опции той же страницы (например `/resize-png` и `/resize-icon` = один компонент с разными подписями/дефолтами). Не плодить дублирующий код.
