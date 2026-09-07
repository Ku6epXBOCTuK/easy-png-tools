# План: закрытие EASY/MEDIUM-пробелов из сравнения с onlinepngtools

> **СТАТУС: ВЫПОЛНЕН (2026-09-07) — устарел.** Все волны W1–W9 закрыты.
> Идеи из раздела «Вне очереди» (region-инструменты, мультифайловый вывод,
> анимационные, HARD-серия) перенесены в `backlog.md`.

> Статус: черновик на ревью

## Принципы

- Волны собираются вокруг общего математического ядра: одна волна = один движок + N инструментов на нём.
- Каждая волна оформляется отдельным планом при старте; здесь — очередь и состав.
- Порядок: сначала кластеры, дающие много инструментов малой кровью, затем одиночные эффекты, MEDIUM-пакеты в конце.
- Полный список параметров каждого инструмента живёт в карте инструментов (tools-map.md); здесь только состав и ядро.

## Очередь волн

### W1. Палитры — ВЫПОЛНЕНА (11 инструментов)

Ядро: RGB↔HSL + гармонии цветового круга. Вывод: свотч-полотно (генератор).
Состав: color-wheel, complementary, monochromatic, analogous, triadic, tetradic, similar-shades, sort-colors.
Плюс утилиты смешения тем же ядром: mix-colors, average-color, blend-two, step-between (+4, итого 12).

### W2. Каналы и пространства — ВЫПОЛНЕНА (6 инструментов)

Ядро: матрицы преобразования RGB→(HSL/HSV/HSI/CMYK/YCbCr/LAB) + визуализация выбранного компонента серым или окрашенно.
Общий select «компонент» + select «режим отображения».

### W3. Маски по свойствам пикселей — ВЫПОЛНЕНА (7 инструментов)

Ядро: предикат над пикселем → бинарная маска (с инверсией и подсветкой цветом).
Состав: show-transparent, show-grayscale, show-color, light-mask, dark-mask, unique-color-mask, extract-by-color.

### W4. Фигурные маски — ВЫПОЛНЕНА (4 инструмента)

Ядро: SDF фигуры (круг/квадрат/звезда/волна) → альфа-маска с fit-режимами.
Состав: circle-mask, square-mask, star-mask, wavy-mask.

### W5. Геометрия-добивки — ВЫПОЛНЕНА (5 инструментов)

Ядро: bbox по альфе (trim) переиспользуется тремя инструментами источника.
Состав: trim-empty-space (закрывает remove border/space), change-canvas-size, change-aspect-ratio, landscape↔portrait, symmetric-copy.

### W6. Эффекты лёгкие — ВЫПОЛНЕНА (6 инструментов; color-blocks покрыт pixelate)

Состав: pixelate, color-blocks, randomize-pixels (seed), add-noise, feather-edges, clean-edges, silhouette.
Shadow/glow — сюда же, если потянет этап: оба = размытая альфа + смещение + цвет (ядро blur уже есть).

### W7. Конвертеры и генераторы — ВЫПОЛНЕНА (11 инструментов)

PNG↔bytes, PNG↔rgb-values (текстовые результаты), verify-is-png (анализ сигнатуры),
text-to-png (domText без входной картинки), emoji-to-png, placeholder-png,
color-spectrum, colorful-random (seed), draw-grid.
multi-color-gradient — если успеем новый тип параметра «список цветов», иначе перенос.

### W8. Цветовые MEDIUM — ВЫПОЛНЕНА (4 инструмента; median-cut + Floyd–Steinberg/Bayer, custom-palette через text-параметр)

Ядро: квантование (median-cut или k-means).
Состав: quantize (k), decrease-color-count (=quantize с пресетами), custom-palette (маппинг на список цветов — нужен тип параметра «список»), dithering (Floyd–Steinberg/Bayer поверх квантования).

### W9. Сжатие — ВЫПОЛНЕНА (3 инструмента; optimize/change-quality осознанно не выделены — покрыты пресетами compress и W8)

Без wasm честное управление размером PNG ограничено: реальный рычаг — квантование (W8) + обрезка метаданных + итеративный подбор под целевой KB.
Состав: compress (пресеты усилий), reduce-to-size (целевой KB, бинарный поиск по k), optimize (re-encode), change-quality/low-quality — переосмыслить как пресеты W8; jpeg-artifacts уже покрывает «испортить».

## Вне очереди

- Region-инструменты (censor/erase/pixelate-area/blur-area/sharpen-area/reverse-area) — ждут UI выделения области на превью; отдельное решение.
- Мультифайловый вывод (split-parts, gif-frames, separate-colors) — ждут механизм «результат = набор файлов».
- Анимационные (slow-reveal/fade/scrolling) — выход не PNG; отдельное решение о формате.
- HARD: glitch, barcode, signature-extract, handwritten-digital.
- Нишевые серии logo/icon/stamp/signature — не копируем.

## Оценка масштаба

W1–W7 дают **~47 новых инструментов**, почти все EASY. W8 добавляет ядро квантования (открывает custom-palette/dithering и улучшает W9). Суммарно каталог достигает ~120+ при текущих 71.
