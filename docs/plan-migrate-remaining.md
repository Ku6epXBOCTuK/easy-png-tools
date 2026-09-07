# План: дожать перевод инструментов в preview и переезд ветки `old/`

> Статус: **переведено 121 из 125; остальные 4 — отложены/закрыты решениями.**
> Текущее
> состояние: **121 инструмент переведён в `registry-new`**, старый UI уже живёт
> на `(old)/`-маршрутах, линтер-изоляция old↔preview на месте
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

- `registry.ts` + `registry/` — **125 инструментов**; `registry-new/` — **121**.
  Не переведены только: `png-info` (отложен, хвост-фича с exif), `compress-png`
  и `reduce-to-size-png` (закрыто решениями, см. ниже), `watermark-image-png`
  (overlay — единственный реальный остаток).
- Preview (`/preview`) показывает переведённые; старый UI работает
  на `/`-маршрутах (группа `(old)/`): `+page`, `demo`, `list-tools`,
  `tools/[id]`. Переведено всё кроме четырёх хвостов: color 18, filters 3,
  geometry 13, alpha 13 (+watermark-image в остатке), generate 10 (mix/sort),
  analyze 12 (6 масок + verify + 5 вердиктов), convert 14 (jpg/webp/bmp +
  5 png→texт + 6 text→png), text `watermark-tile-png`.
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

## Скоуп перевода: переведено всё переводимое (отложено 4 хвоста)

Каталог дожат до предела текущих решений: переведено 121 из 125. Оставшиеся
4 инструмента **отложены осознанно** (не делаем сейчас):

- **`watermark-image-png` (alpha)** — **отложен**. Нужна overlay-механика
  (второе изображение-знак через `getOverlay`/store + параметры
  scale/opacity/position/margin/aspect); решается отдельно, вместе с вопросом,
  как второй источник изображения вписывается в schema-driven preview.
- **`png-info`** — **отложен осознанно**: будет серьёзно дорабатываться
  отдельным райзом (exif-теги, редактирование, структурированный вывод),
  для него нужен свой отдельный случай в UI, не «ещё один text/verdict».
- **`compress-png`** — **закрыт как дубликат** `decrease-color-count-png`:
  пресеты сжатия 192/96/44 добавлены прямо в схему `decrease-color-count`.
- **`reduce-to-size-png`** — **отложен** до достройки кнопки Download
  (backlog №7, «экспорт с лимитом размера»).

### Переведено в этом проходе (text-механика)

- **Типы:** `ToolEntry.input: "file" | "text" | "none"`,
  `ToolEntry.result: "image" | "text" | "verdict"`, `OutputFormat` (mime/ext/
  qualityParamId) для download.
- **Executor:** `executeFromText` / `executeToText` / `executeTextToText`
  (прямые, без worker), экспорт в `preview/executor/index.ts`.
- **UI:** `SchemaTextSource` (textarea + Render), `SchemaTextResult`
  (кол-блок с Copy/Download .txt или бейдж-вердикт по префиксу Yes/No),
  интеграция в `SchemaPreview`/`SchemaToolView` (режимы file/text/generate,
  рендер image/text/verdict, скрытие image-download для text-результата).
- **Инструменты:** convert 5×png→text (base64/data-uri/hex/bytes/rgb-values),
  6×text→png (base64/data-uri/hex/bytes/rgb-values/svg, +width), analyze
  verify-is-png (text→text) и 5 вердиктов (grayscale/file-size/transparent/
  orientation). Доработка: `base64ToBytes` сужен до `Uint8Array<ArrayBuffer>`
  (совместимость с `decodeBytes`).
- **Гейты:** eslint 0, prettier чист, svelte-check — только предсуществующий
  ToolCard, тесты — только предсуществующий фейл `palette.test.ts`.

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

1. **Простые пачки** — **выполнено**: color (18) → filters (3) → geometry (13)
   → alpha (13/14, кроме watermark-image) → generate (10, включая mix/sort
   через kind `colors`) → analyze-маски (6) → text `watermark-tile-png`.
2. **Text-механика** — **выполнено**: типы `input`/`result` + output-формат,
   executor `executeFromText`/`toText`/`textToText`, UI
   `SchemaTextSource`/`SchemaTextResult` + интеграция в preview, перевод
   конвертеров convert (5 png→text + 6 text→png) и analyze (verify + 5
   вердиктов). `png-info` отложен отдельным райзом (exif).
3. **Шаг про overlay не делается** — `watermark-image-png` **отложен решением**
   (см. «Скоуп перевода» выше), отдельным райзом вместе с вопросом второго
   источника изображения в schema-driven preview.
4. После категории — `schema.layout` для сгруппированных инструментов
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
   всем наборе, text-source, output-формат. (`watermark-image` — позже, после
   overlay-райза.)
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

| Часть                                                                  | Сложность      | Оценка                    |
| ---------------------------------------------------------------------- | -------------- | ------------------------- |
| Простые инструменты (color/filters/geometry/alpha/generate/маски/text) | Низкая-Средняя | **выполнено** (62 шт)     |
| Text-механика + конвертеры/вердикты                                    | Средняя        | **выполнено** (16 шт)     |
| watermark-image / png-info / reduce-to-size (отложены решениями)       | Высокая        | отложено, отдельные райзы |
| Долги (ToolCard, palette.test.ts, lint:all остаток)                    | Средняя        | ~2-4ч                     |
| Переезд в `old/` + конфиг плагина + гейты                              | Средняя-Низкая | ~2-4ч                     |
| Проверка/фидбек + правки                                               | Зависит        | ~3-6ч                     |
| **Итого**                                                              |                | **~9-18ч** по фазам       |

> Оценки ориентировочные; особые случаи — с ревью решения, объём финальных
> правок по фидбеку не предсказуем.
