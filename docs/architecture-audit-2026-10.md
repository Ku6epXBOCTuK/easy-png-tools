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

### H1. `SchemaToolView.svelte` — god-component, 1064 строки

`web/src/lib/components/schema/SchemaToolView.svelte` — ~10 ответственностей в
одном компоненте: состояние цепочки шагов (`init` :218, `setStepValue` :256,
`resetStep` :304, `replaceStepTool` :337), загрузка файлов (`handleFiles` :355),
оркестрация запуска (`run` :430), политика скачивания с encode/fitWithinBytes
(`download` :467), clipboard (`copyText` :491), paste-listener (`onMount` :548),
вычисление mask-превью (:579), drag&drop шагов (:349), aspect-lock (:272-299),
две большие раскладки в разметке (workspace :739-803, aligned :804-943).

Кандидаты на вынос: `useChainRunner` (run/download/clipboard), `useStepMasks`,
`schema-tool-state.svelte.ts` (стейт шагов), `AlignedLayout.svelte` /
`WorkspaceLayout.svelte`.

### H2. Race condition превью: устаревший ответ worker'а перезаписывает новый

`SchemaToolView.svelte:430-465` (`run()`) + эффект :567-575. Debounce (:199)
отменяет только запланированный запуск; уже летящий `runChain` не отменяется и
нет generation-токена: при смене параметров во время долгого worker-прогона
старый результат перезапишет новый (`assignResult` без проверки актуальности).
Сам executor с request-id корректен (`executor/executor.ts:45-96`) — проблема на
уровне UI. Пользователь видит превью не от своих параметров.

Минимальный фикс:
`let runGen = 0; const gen = ++runGen; ... if (gen !== runGen) return;`.

### H3. `registry-schema.ts` — 723 строки, 45 экспортов, 5 ответственностей

`web/src/lib/registry-schema.ts` смешивает: (а) типы 15 видов полей (:14-233),
(б) builder-DSL `field.*` (:273-360), (в) layout engine `resolveLayoutGroups`
(:380-406), (г) семантику значений `defaultSchemaParams`/`sanitizeSchemaParams`
(:503-770), (д) aspect-lock геометрию `withAspectLock`/`clampSourceAwareMaxes`
(:434-489). Каждая из (в)-(д) — отдельный модуль.

## Med

### M1. Маски через `$effect` вместо `$derived.by`

`SchemaToolView.svelte:579-600`: `$effect` чисто вычисляет `maskResults` из
`steps`/`stepResults`/`source`/`maskOnKeys` и пишет в `$state`. `runMask`
синхронный и чистый — учебниковый случай `$derived.by`, эффект не нужен.

### M2. `init()` в эффекте не сбрасывает часть состояния

`SchemaToolView.svelte:514-516` + :218-254: `$effect(() => init())` —
синхронизация состояния по смене пропсов (анти-паттерн из документации Svelte
5). При этом `touchedByStep` (:105) и `lastAxis` (:107) в `init()` не
сбрасываются — при смене хоста остаются метки от прежних ключей шагов.

### M3. `SchemaPreview.svelte` — интерфейс из ~40 пропсов

`web/src/lib/components/schema/SchemaPreview.svelte:22-103`: весь стейт
оркестратора проброшен вниз по одному (`stepResults`, `stepMaskable`,
`stepMaskOn`, `stepMasks`, `format`, `quality`, `limitKb`, `alphaLoss` + 11
колбэков `on*`). Нужен группирующий view-model-объект или разбиение на
подкомпоненты.

### M4. `runMask` обходит санитизацию параметров

`SchemaToolView.svelte:591`: основной путь `run()` идёт через `execute` →
`sanitizeSchemaParams` (`executor/executor.ts:153`), а mask-превью передаёт
`step.params` как есть. Значения вне диапазона/невалидный hex дойдут до
core-функций без клампинга. (Сам обход executor для `domOnly`-маски каноничен по
`docs/architecture.md`; рассинхрон санитизации — нет.)

### M5. UI-метаданные дропдауна скачивания в core-слое

`web/src/lib/core/io.ts:10-47`: `OUTPUT_FORMATS`/`OutputFormatOption` содержат
`label` и `settings.quality` — конфигурацию презентационного дропдауна кнопки
Download. Core по канону «не знает ни о ком».

### M6. Доменная политика сжатия в IO-модуле

`web/src/lib/core/io.ts:191-210`: `fitWithinBytes` — стратегия «бинарный поиск
по quality / по числу цветов квантизации» поверх `quantizeImage`,
`findMaxColorsWithin`, `findQualityWithin`. Это доменная логика, не ввод-вывод
(у файла 19 экспортов).

### M7. `clamp` продублирован 5 раз

Идентичная локальная функция: `core/alpha.ts:167`, `core/background.ts:136`,
`core/color.ts:239`, `core/convolution.ts:181`, `registry-schema.ts:408`. Плюс
`clampInt` дважды: `convolution.ts:185` и `geometry.ts:288`. Прямое нарушение
инварианта «сначала искать».

### M8. Два параллельных hex-парсера

`parseHex` (`core/alpha.ts:147`, tuple, бросает `ToolError`) и `hexToRgb`
(`core/palette.ts:8`, объект `{r,g,b}`). Половина core-модулей использует первый
(`affine.ts:31`, `geometry.ts:20`, `morphology.ts:123,150`), другая — второй
(`masks.ts:25,98`, `pixel-fx.ts:195`, `registry/tools/generate.ts:36`).

### M9. Гард `localStorage` продублирован 4 раза

Идентичный `typeof localStorage === "undefined" ? null : localStorage`:
`chains.svelte.ts:22-24`, `favorites.svelte.ts:8`, `i18n/locale.svelte.ts:12`,
`theme.svelte.ts:7-9`. Общий `storage()`-хелпер даст одну точку
SSR-безопасности.

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

### L7. `localStorage.setItem` без try/catch вне app.html

`theme.svelte.ts:29`, `chains.svelte.ts`, `favorites.svelte.ts`,
`locale.svelte.ts`: в privacy-режимах `setItem` бросает; только inline-скрипт
`app.html:9-20` обёрнут в try/catch. SSR не ломается (typeof-гарды есть), но
клик по переключателю темы может уронить обработчик.

### L8. Переросшие файлы групп реестра и core

`registry/tools/generate.ts` — 969 строк (~21 инструмент), `geometry.ts` — 753
(~18), `alpha.ts` — 681 (~20): конвенция «один файл на категорию», но навигация
страдает. `core/geometry.ts` — 436 строк, смешаны поддомены (тайлинг, ресайн,
contentBounds, ratio). `core/palette.ts` — 23 экспорта, смешаны color math и
генерация `PixelImage` (`renderSwatches`/`renderWheel`/ `renderBlend`).
