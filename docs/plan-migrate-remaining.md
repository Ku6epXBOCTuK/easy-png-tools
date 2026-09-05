# План: дожать перевод инструментов в preview и переезд ветки `old/`

> Статус: **план.** Основа — `plan-composite-params.md` (Фазы 1–5). Текущее
> состояние: **40 из 125 инструментов переведены в `registry-new`**, старый UI
> уже живёт на `(old)/`-маршрутах, линтер-изоляция old↔preview на месте
> (плагин `isolation/no-mixed-imports`). Здесь — что сделать, чтобы:
>
> 1. в preview был **весь** каталог инструментов (плюс закрыты известные долги);
> 2. физически перенести старую ветку в папки `old/` (шаг 37 основного плана);
> 3. после переезда провести детальную проверку в реальных условиях и собрать
>    отзывы пользователей (правки поверх — отдельными задачами).
>
> Порядок: перевод остатка → починить известные долги → переезд в `old/` →
> пользовательская проверка/фидбек → (позже, отдельным решением) удаление
> старого кода.

## Текущая картина (факты)

- `registry.ts` + `registry/` — **125 инструментов**; `registry-new/` — **40**;
  остаток — **85**. (Ранний подсчёт «104» был занижен: извлечение суффиксом
  `-png` теряло каналы `png-to-hsl/…`, текстовые вердикты `png-info` и т.п. и
  обратные конвертеры `png-to-base64/…`.)
- Preview (`/preview`) показывает только переведённые 40; старый UI работает
  на `/`-маршрутах (группа `(old)/`): `+page`, `demo`, `list-tools`,
  `tools/[id]`.
- Плагин `isolation/no-mixed-imports` (`web/eslint-plugins/isolation/`)
  полностью разделяет ветки: старый `lib/registry.ts|/registry/**`,
  `lib/registry-helpers.ts`, `lib/categories.ts`, `lib/tools/**`,
  `lib/components/**`(кроме `kit/`) vs новый `routes/preview/**`,
  `lib/registry-new/**`, `lib/preview/**`, `lib/registry-schema.ts`,
  `lib/components/kit/**`. Общее: `core/`, `i18n/`, `theme`, `assets/`,
  корневой `lib`.
- Правило копий (из основного плана): файл, используемый `(old)`, не трогаем —
  делаем копию в `lib/preview/` (пример: `lib/preview/tool-icons.ts`).
- Известные долги (предсуществующие, не создавались нами): ошибка
  `ToolCard.svelte:19:36` (svelte-check), фейл `palette.test.ts` (ENOENT
  `src/app.css` — из-за него `pnpm test` красный при 607 passed), ~335
  design-tokens ошибок `lint:all` в старых kit-компонентах, a11y-warning в
  `ColorField.svelte`, пустой ruleset в `Toggle.svelte`, неиспользуемые токены
  в `preview.css`.

## Скоуп перевода: 85 инструментов осталось

По категориям (в скобках — сколько из категории уже переведено; подсчёт по
`registry/` vs `registry-new/`, без учёта генерируемых `SpaceId` и params):

- **color — 18** (из 25, переведено 7): grayscale-png, invert-colors-png,
  adjust-brightness-contrast-png, auto-contrast-png, sepia-png, posterize-png,
  black-and-white-png, decrease-color-count-png, extract-channel-png,
  swap-channels-png, change-png-opacity, change-png-hue, плюс 6 канальных
  `png-to-{hsl,hsv,hsi,cmyk,ycbcr,lab}` (генерируются из `SPACES`);
  `compress-png`/`reduce-to-size-png` — нет, они в convert. Простое; канальные —
  на `core/channels.ts` (`renderSpace`). Нюанс: `change-png-opacity`/`hue`
  похожи на переведённые, но это отдельные инструменты, не дубли.
- **geometry — 13** (из 18): rotate, flip, skew, zoom, shift, add-padding, tile,
  trim-empty-space, change-aspect-ratio, swap-orientation, symmetric-copy,
  center-by-alpha, rotate-free. В основном простое (slider/select/color/checkbox).
  Нюансы: `rotate-free` — угол 0..360 (посмотреть reuse `AngleControl` или
  slider); `tile` — cols/rows (два числа, можно `dimension` или два slider);
  `shift` — offsetX/Y в px + цвет (не путать с `offset`-процентами).
- **alpha — 14** (из 21): remove-alpha, set-alpha, extract-alpha-mask,
  round-corners, invert-alpha, remove-background, make-thicker, make-thinner,
  feather-edges, clean-edges, harden-alpha, despeckle-alpha, close-holes +
  **`watermark-image-png`** (см. особый случай). Остальное простое.
- **generate — 10** (из 21): emoji-to-png (emoji+size); палитровые генераторы
  color-wheel, complementary, analogous, triadic, tetradic, monochromatic,
  shades (baseColor + count/spread — простое); **`mix-colors`** и
  **`sort-colors`** — особые случаи (списки).
- **convert — 14** (из 16): text-source-инструменты
  base64/data-uri/hex/bytes/rgb-values-to-png + обратные
  png-to-base64/data-uri/hex/bytes/rgb-values/bmp — **особый случай** (нужен
  text-источник в preview); `compress-png`/`reduce-to-size-png` — **особый
  случай** (output/формат, связан с backlog №7); `svg-to-png` — width.
- **analyze — 12** (из 13): show-transparent, show-grayscale, show-color,
  light/dark-pixel-mask, unique-color-mask (color+opacity+tolerance+mode) —
  простое, частично переиспользуемый предикат; **`verify-is-png`** — текстовый
  вердикт, особый случай; плюс 5 text-вердиктов `png-info`, `png-is-grayscale`,
  `png-file-size`, `png-is-transparent`, `png-orientation` — тоже текстовый
  вывод (см. text-source/вердикт-механику).
- **filters — 3** (из 8): blur (radius), sharpen (strength), silhouette
  (color+threshold). Простое.
- **text — 1** (из 3): **`watermark-tile-png`** — text+font-style+opacity+angle+
  stepX/stepY. Переиспользует font-style; угол — AngleControl-подобный.

### Особые случаи (требуют достройки фундамента, не просто перевод)

1. **`watermark-image-png`** — нужна overlay-механика: второе изображение-знак
   (`getOverlay`/store), которое загружается на странице инструмента и
   применяется поверх. В новом preview это единственный непереведённый
   инструмент с источником-картинкой помимо основного входа. Учесть связь с
   `overlay-store` (упомянут в `plan-redesign.md`).
2. **Text-source / text-вердикты** (base64/data-uri/hex/bytes/rgb-values-to-png
   и обратные png-to-base64/…; аналитические `png-info`, `png-is-grayscale`,
   `png-file-size`, `png-is-transparent`, `png-orientation`, `verify-is-png`) —
   в старом UI это `text`-параметры, из которых собирается изображение, либо
   текстовый результат вместо картинки. В новом preview нужно решить, как
   подаётся текст-вход (текстовое поле/паста на странице инструмента) и как
   показывается результат для вердиктных инструментов (в конверсиях — не
   картинка, а текст/бейдж).
3. **Output/формат** (`compress-png`, `reduce-to-size-png`; пересекается с
   `convert-png-to-jpg`/`webp`) — по `backlog.md` №7 формат переезжает в
   кнопку Download, а не в отдельный инструмент. Перед переводом решить:
   переводим как инструменты с quality-параметром или дожидаемся достройки
   download-формата.
4. **`mix-colors` / `sort-colors`** — нужен список значений (цвета/веса или
   источник). В схеме нет list-kind: либо новый kind, либо фиксированное
   число слотов, либо отложить до отдельной задачи про списки.

## Известные долги перед переездом (завести tasks и закрыть)

По AGENTS.md техдолг «чинится только по заведённым tasks, не игнорируется»:
`lint:all` (~335 design-tokens в kit), неиспользуемые токены preview.css,
a11y `ColorField`, пустой ruleset `Toggle`. Плюс два, мешающих зелёной
проверке до/после переезда: svelte-check error `ToolCard.svelte:19:36` и фейл
`palette.test.ts` (ENOENT `src/app.css`). После их закрытия целевое состояние
проверок перед переездом: `pnpm --dir web exec svelte-check` → 0 errors,
`pnpm --dir web test` → зелёный, `pnpm --dir web lint:all` → только задокумент.
ированный остаток (или 0).

## Шаги перевода остатка (порядок)

1. **Простые пачки** (основной объём, 1 инструмент = 1 диф, паттерн Фазы 2):
   color (18) → filters (3) → geometry простое → alpha (кроме watermark-image).
2. **Analyze-маски и вердикты** (12): переиспользование предикатов
   `core/masks` в новом `registry-new/analyze.ts`; `show-color-pixels` — аналог
   переведённого `extract-color-from-png` (уже в registry-new); text-вердикты
   (png-info, png-is-grayscale, png-file-size, png-is-transparent,
   png-orientation, verify-is-png) — вместе с text-source-механикой (п. 5).
3. **Generate-палитры** (8 без mix/sort): генераторы с палитрой (как
   `color-spectrum`/`step-colors`, кнопка Generate).
4. **Raw-пакеты** (watermark-tile): font-style + угол + dimension(+),
   сверить с `add-text` (переведён).
5. **Особые случаи** — отдельным переговоренным решением (overlay для
   watermark-image, text-source, output-формат, списки для mix/sort).
6. После категории — `schema.layout` для сгруппированных инструментов
   (шаг 32-33 паттерн) и ручная проверка в `/preview`.

## Переезд в `old/` (шаг 37 основного плана)

> Скоп-сдвиг: «Scoped-пути двигаются вместе с папками» — обновляется
> `eslint.config.js` (isolation-паттерны и design-tokens glob), не код правила.

1. **Что переезжает:** `lib/registry.ts`, `lib/registry/**`,
   `lib/registry-helpers.ts`, `lib/categories.ts`, `lib/tools/**`,
   `lib/components/**` (кроме `kit/`) → папки `old/` (например
   `lib/old/registry …`, `lib/old/tools`, `lib/old/components`) — то есть всё
   старое в одном поддереве. `routes/(old)/` остаётся как есть (уже отделено).
2. **Обновить конфиг плагина** `isolation/no-mixed-imports`: старые glob-ы
   `lib/registry/**…` заменить на `lib/old/**` (+ `lib/old/components/**` и
   т.п.), «новое» и «общее» не меняются. Проверить, что правило по-прежнему
   разделяет (тест фолс-позитивов: временный импорт old↔new ловится).
3. **Импорты внутри старого кода** — относительные пути остаются рабочими
   (папки двигаются целиком); поправить только то, что ссылалось на `$lib/...`
   в другом стиле. Старые тесты (`registry.test.ts` и др.) переезжают вместе с
   исходниками и продолжают проходить.
4. **Гейты переезда:** `svelte-check` 0 errors, `pnpm --dir web test` зелёный,
   `prettier --check .` чистый, `lint:all` = задокументированный остаток,
   обе ветки открываются (старая `/`, новая `/preview`).

## Проверка и сбор отзывов после переезда

1. **Регресс-чеклист по каталогу** — пройти все инструменты в `/preview`:
   дефолты совпадают со старыми, валидация/клампы поведения не меняют,
   результат эквивалентен старому UI (сверить на одинаковых входах).
2. **Тяжёлые кейсы руками:** генераторы, маски, font-style/plate/gradient на
   всем наборе, watermark-image (после overlay), text-source, output-формат.
3. **Сбор фидбека** — отдельные задачи на каждый найденный фикс; чеклист
   зафиксировать в этом документе по мере находок (или ссылкой на tasks).
4. Сверка каталога с `tools-map.md` (покрытие/дедупликация
   `convert-png-to-jpg`/`webp`), при необходимости — обновить cards/мета.
5. **Решение об удалении старого** — после завершения ревью и фидбека,
   отдельным шагом: тогда чистятся `lib/old/**`, `routes/(old)/**`,
   `old.css`, `exports`, изоляционный плагин (glob-ы больше не нужны) и
   открываются «правило копий»-дубли.

## Как ревьюить каждый шаг (гайды)

- Диф на **один инструмент** (или фундамент без инструментов) < ~500 строк.
- Старый `params`/`run`/`defaultParams`/`sanitizeParams` не изменены;
  в `registry-new` копия логики + `schema` (дефолты равны старым).
- Старый UI и старые тесты продолжают работать: `pnpm --dir web test`,
  `pnpm --dir web exec svelte-check`.
- Новый инструмент проверяется **руками в `/preview`** end-to-end (применение +
  сброс дефолтов + смена значений).
- После переезда каждый move-шаг гоняет 4 гейта (см. выше).

## Оценка трудозатрат

| Часть                                                            | Сложность       | Оценка                |
| ---------------------------------------------------------------- | --------------- | --------------------- |
| Простые инструменты (color/filters/geometry/alpha без watermark) | Низкая-Средняя  | ~5-8ч (≈47 шт)        |
| Analyze-маски (12, часть в п.5 с text-source)                    | Средняя         | ~2ч                   |
| Generate-палитры (8)                                             | Средняя         | ~2-3ч                 |
| watermark-tile (text)                                            | Средняя         | ~1ч                   |
| Особые случаи (overlay/text-source/format/списки)                | Средняя-Высокая | ~4-6ч + ревью решения |
| Долги (ToolCard, palette.test.ts, lint:all остаток)              | Средняя         | ~2-4ч                 |
| Переезд в `old/` + конфиг плагина + гейты                        | Средняя-Низкая  | ~2-4ч                 |
| Проверка/фидбек + правки                                         | Зависит         | ~3-6ч                 |
| **Итого**                                                        |                 | **~21-34ч** по фазам  |

> Оценки ориентировочные; особые случаи — с ревью решения, объём финальных
> правок по фидбеку не предсказуем.
