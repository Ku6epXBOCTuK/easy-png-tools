# Аудит архитектуры (2026-10)

> Статус: **draft**. Сырые находки read-only аудита на оценку разработчика.
> Подтверждённые пункты переезжают в `docs/backlog.md` или тематический
> документ, отклонённые удаляются; после разбора файл — в `docs/archive/`.
>
> Примечание: `$effect` с `goto()` в `SchemaToolView.svelte:529-546` намеренно
> исключён — бесшовная смена маршрута при структурном изменении цепочки
> (`docs/architecture.md`, раздел 1) является требованием, не дефектом.

Проверено и чисто (не является находкой):

- Слоистость соблюдена: обратных импортов `core→registry/components`,
  `registry→components/routes/executor` нет.
- Прямых вызовов `tool.run` в обход `executor.execute` нет.
- DOM-API в `core/**` только в санкционированных `io.ts`/`domText.ts`.
- Устаревшего Svelte 4 синтаксиса нет (`export let`, `$:`, `on:`, `<slot>`,
  `$store`, `createEventDispatcher` — 0 совпадений).
- `console.error` в lib/routes отсутствует; worker-протокол кодирует ошибки;
  скачивание/encode — единый источник `core/io.ts`.

## High

### H1. `SchemaToolView.svelte` — god-component — СДЕЛАНО (2026-10)

Компонент уменьшен со 1115 до ~660 строк (оркестратор: derived-связки, init,
handleFiles, эффекты, workspace-разметка). Декомпозиция:

- **H1a:** aligned-раскладка вынесена в `SchemaAlignedLayout.svelte` (view-only:
  разметка + scoped-стили, сниппет `stepCard` передаётся пропсом).
- **H1b:** runner вынесен в `schema-tool-runner.svelte.ts`
  (`createSchemaToolRunner(ctx)`); идиома «`$state`-объект + модульные функции»
  зафиксирована в `docs/architecture.md`, раздел 9.
- **H1c:** стейт шагов вынесен в `schema-tool-state.svelte.ts`
  (`createSchemaToolState(ctx)`: steps, touchedByStep/lastAxis, все мутации,
  DnD; `toolSchemaOf` — модульный экспорт).

### H2. Race condition превью — СДЕЛАНО (2026-10)

`SchemaToolView.svelte`: добавлен generation-counter `runGen`; устаревший прогон
`runChain` после `await` выходит без записи результатов, ошибок и сброса
`running` (`finally` сбрасывает только актуальный); `init()` инкрементом
инвалидирует прогоны прошлого хоста.

### H3. `registry-schema.ts` — 5 ответственностей — СДЕЛАНО (2026-10)

Файл (769 строк) разрезан на директорию `web/src/lib/registry-schema/`:
`specs.ts` (типы полей, `fieldSpecs`, `ToolSchema`), `field.ts` (builder DSL +
`toolSchema`), `layout.ts` (`resolveLayoutGroups`), `aspect.ts` (`effectiveMax`,
`clampSourceAwareMaxes`, `withAspectLock`), `values.ts` (дефолты и санитизация);
`index.ts` — баррель, пути импортов не менялись. `docs/architecture.md` (разделы
1, 4) обновлён. JSDoc в `specs.ts` сжат до однострочников — лимит плотности
комментариев (`conventions/comment-format`, 15%).

## Med

### M1. Маски через `$effect` вместо `$derived.by` — СДЕЛАНО (2026-10)

`SchemaToolView.svelte`: эффект вычисления `maskResults` заменён на
`$derived.by`; ручной сброс `maskResults = {}` в `init()` удалён — derived
пересчитывается сам по смене `steps`/`source`/`maskOnKeys`.

### M2. `init()` не сбрасывал часть состояния — СДЕЛАНО (2026-10)

`SchemaToolView.svelte`: `init()` теперь очищает `touchedByStep` и `lastAxis` —
метки от ключей шагов прошлого хоста больше не протекают в новую цепочку.
Переработка самого паттерна `$effect(() => init())` — часть H1, отдельно не
делалась.

### M3. `SchemaPreview.svelte` — интерфейс из ~40 пропсов — СДЕЛАНО (2026-10)

Пропсы сгруппированы в 4 view-model объекта по внутреннему потребителю: `head`
(SchemaActions), `source` (SchemaSourceTile), `steps` (промежуточные тайлы),
`result` (SchemaResultTile). Интерфейсы — в `schema-preview-model.ts`
(`PreviewHeadModel` и др.); имена полей зеркалят пропсы потребителей, поэтому
внутри работает спред (`<SchemaActions {...head}>`). Плоскими остались 7
идентифицирующих пропсов (inputMode, resultKind, toolId, running, error,
aligned, ontogglealign).

### M4. `runMask` обходил санитизацию параметров — СДЕЛАНО (2026-10)

`SchemaToolView.svelte` (derived `maskResults`): параметры шага теперь проходят
`sanitizeSchemaParams(stepSchema, step.params, { source: input })` — тот же
контракт, что в `executor/executor.ts` (вход шага как source-контекст).

### M5. UI-метаданные дропдауна скачивания в core-слое — СДЕЛАНО (2026-10)

`OutputFormatOption`/`OUTPUT_FORMATS`/`outputFormatByMime` вынесены из
`core/io.ts` в `web/src/lib/output-formats.ts` (UI-слой: label и
`settings.quality` дропдауна кнопки Download). В core остался только
mime-контракт `OutputMime`; сам `io.ts` таблицу не использовал. Потребители (4
файла) переведены на новый путь.

### M6. Доменная политика сжатия в IO-модуле

`web/src/lib/core/io.ts:191-210`: `fitWithinBytes` — стратегия «бинарный поиск
по quality / по числу цветов квантизации» поверх `quantizeImage`,
`findMaxColorsWithin`, `findQualityWithin`. Это доменная логика, не ввод-вывод
(у файла 19 экспортов).

### M7. `clamp` продублирован 5 раз — СДЕЛАНО (2026-10)

Создан `web/src/lib/core/math.ts` (`clamp`, `clampInt`, `clamp01`, `clampByte` —
round-семантика `clampByte` и trunc-семантика `clampInt` сохранены раздельно);
локальные копии удалены из `core/alpha.ts`, `core/background.ts`,
`core/color.ts`, `core/convolution.ts`, `core/geometry.ts`, `core/palette.ts`,
`core/pixel-fx.ts`. Вариант с опциональными границами в `registry-schema.ts`
переведён на общий `clamp` через `?? -Infinity / ?? Infinity`. Копия в
`palette.test.ts` оставлена — тесты независимы.

### M8. Два параллельных hex-парсера

`parseHex` (`core/alpha.ts:147`, tuple, бросает `ToolError`) и `hexToRgb`
(`core/palette.ts:8`, объект `{r,g,b}`). Половина core-модулей использует первый
(`affine.ts:31`, `geometry.ts:20`, `morphology.ts:123,150`), другая — второй
(`masks.ts:25,98`, `pixel-fx.ts:195`, `registry/tools/generate.ts:36`).

### M9. Гард `localStorage` продублирован 4 раза — СДЕЛАНО (2026-10)

Создан `web/src/lib/storage.ts` (`storage()` + `safeSetItem`); локальные гарды
удалены из `chains.svelte.ts`, `favorites.svelte.ts`, `i18n/locale.svelte.ts`,
`theme.svelte.ts`.

### M10. Логика темы дублируется между `app.html` и `theme.svelte.ts` — ОТКЛОНЕНО

`web/src/app.html:10-16` повторяет `systemTheme()` (`theme.svelte.ts:11-16`) и
захардкоживает ключ `"theme"` (`theme.svelte.ts:3`).

Решение (2026-10): оставить как есть. Inline-скрипт обязан выполниться синхронно
до парсинга контента, чтобы тема не мигала, — импортировать `theme.svelte.ts` из
него нельзя в принципе (модули async, `app.html` не проходит сборку TS).
Дублирование неизбежно.

Остаточный риск drift'а (принят, без фикса): ключ `"theme"`, значения
`"dark"/"light"` и атрибут `dataset.theme` продублированы; при exception inline
ставит `"light"`, а `initTheme()` при невалидном attr берёт `systemTheme()` (на
практике безразлично — inline всегда выставляет attr). Если риск когда-то
материализуется, дешёвая защита — unit-тест (~20 строк), читающий `app.html` и
пиннющий контракт: ключ `"theme"`, `dataset.theme`, значения `dark`/`light`.

## Low

### L1. Флаг `running` общий для `run()` и `download()`

`SchemaToolView.svelte:124,433,469`: параллельный auto-run и клик по download
гоняют один `$state`; индикация и `disabled` ведут себя некорректно.

### L2. Дублирование dismiss-логики поповеров

`SchemaDownload.svelte:62-76` и `ToolPickerButton.svelte:25-39` — побуквенно
одинаковые ~15 строк: pointerdown-outside + Escape + подписка на `window` в
`$effect`. Кандидат на shared action (`clickOutside`/`popoverDismiss`). Сами
эффекты корректны.

### L3. Несогласованный API `Toggle`

`SchemaToolView.svelte:811` — `bind:checked={aligned}`;
`SchemaPreview.svelte:114-118` тот же компонент — `checked` + `onchange`.
Компонент (`ui/Toggle.svelte:7`) поддерживает оба; стоит выбрать один паттерн.

### L4. Непроверяемые `as`-касты схемы

`SchemaToolView.svelte:97,211`
(`tool.schema as ToolSchema<Record<string, unknown>>`) и паттерн `spec as XSpec`
в 14+ field-компонентах (`CheckboxControl.svelte:13`, `ColorControl.svelte:14`,
`GradientControl.svelte:16` и др.); двойной каст `as unknown as WorkerLike` в
`executor/executor.ts:35`. Касты отключают проверку соответствия spec kind'у.

### L5. Хардкод slug-ов вне registry

`tool-icons.ts:54-142` — карта slug→icon без типизации по slug-union
(переименование slug ломает иконки молча); `kit/+page.svelte:40` — захардкожены
`["linear-gradient-png","resize-png","quantize-png"]` (kit — витрина, не
production).

### L6. Дублирование CSS-значения превью-тайла

`clamp(var(--space-brand), 30vh, 60vh)` в `PreviewTile.svelte:96` и
`SchemaResultTile.svelte:129`; магические `30vh/60vh` не в токенах.

### L7. `localStorage.setItem` без try/catch вне app.html — СДЕЛАНО (2026-10)

Все `setItem` в `theme.svelte.ts`, `chains.svelte.ts`, `favorites.svelte.ts`,
`locale.svelte.ts` переведены на `safeSetItem` из `web/src/lib/storage.ts`
(best-effort persistence: бросок в privacy-режиме проглатывается).

### L8. Переросшие файлы групп реестра и core

`registry/tools/generate.ts` — 969 строк (~21 инструмент), `geometry.ts` — 753
(~18), `alpha.ts` — 681 (~20): конвенция «один файл на категорию», но навигация
страдает. `core/geometry.ts` — 436 строк, смешаны поддомены (тайлинг, ресайн,
contentBounds, ratio). `core/palette.ts` — 23 экспорта, смешаны color math и
генерация `PixelImage` (`renderSwatches`/`renderWheel`/ `renderBlend`).
