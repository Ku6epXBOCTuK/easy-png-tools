# План: составные типы параметров и полная типизация pipeline

> **СТАТУС: ЗАКРЫТ (2026-09-07).** Типизация pipeline, составные типы
> (dimension/color-pair/offset/position9/font-style/plate/gradient),
> `schema.layout`, изоляция веток и вся миграция инструментов (121/125,
> остальные 4 — отложены решениями) выполнены. Ключевые архитектурные решения
> (параллельная сборка, правило копий, изоляция old↔preview) закреплены в
> `AGENTS.md`.
> **Незакрытое из этого плана:** шаг 37 — физический переезд старых файлов
> в папки `old/` (перенесён в `backlog.md`), и удаление старого кода —
> по `plan-redesign.md` (C17–C21). Отложенные инструменты —
> `watermark-image-png` (overlay), `png-info`, `reduce-to-size` — в `backlog.md`.
> Ниже — полное состояние на момент закрытия.

> Статус: **в реализации.** Фаза 0 (фундамент) ✔, Фаза 1 (рабочий инструмент
> в preview) ✔, Фаза 2 (простые инструменты без составных типов) — переведены
> все одиночные инструменты (18 шт). Фаза 3 — **составной тип `dimension`
> полностью переведён** (12 инструментов: create-empty, single-color,
> random-noise, linear-gradient, color-spectrum, random-colors, draw-grid,
> placeholder, fit-on-background, change-canvas-size, resize, crop); **составной
> тип `color-pair` полностью переведён** (4 инструмента: blend-two,
> step-colors, linear-gradient, two-colors); **составной тип `offset`
> полностью переведён** (4 инструмента: circle-mask, square-mask,
> star-mask, wavy-mask); **составной тип `position9` — переведены
> add-text-png и date-stamp-png** (водяной знак-картинка — отдельный шаг:
> требует overlay-механику в новом превью); **составной тип `font-style`
> полностью переведён** (text-to-png, add-text, date-stamp); **составной тип
> `plate` полностью переведён** (add-text, date-stamp); **составной тип
> `gradient` полностью переведён** (linear-gradient): вместо горизонтального/
> вертикального select — **угол 0..360°** (новый виджет `AngleControl`:
> slider + кнопки-пресеты 0°/90°/180°/270°, переиспользуемый компонент);
> preview
> научен применять **генераторы** (`executeGenerate`, кнопка Generate) и
> рендерить все kinds схемы (slider/number/color/select/checkbox/dimension/
> color-pair/offset/position9/font-style/plate/gradient). **Пер-инструмент
> раскладка `schema.layout` реализована** (шаг 32): тип `ToolSchemaLayout`
> {groups: [{title?, cols?, fields}]}, рендер групп в `SchemaFields.svelte`
> (заголовок группы + сетка колонок, неупомянутые поля — в общей группе),
> пилот — `add-text` (группы Text/Placement/Plate). **UI-макеты расставлены
> по переведённым инструментам** (шаг 33): geometry (fit-on-background,
> change-canvas-size, resize, crop), маски alpha (Shape/Position), generate
> (create-empty, linear-gradient, color-spectrum, random-colors, draw-grid,
> step-colors, placeholder, text-to-png), text (add-text, date-stamp),
> filters (randomize-pixels, add-noise) — везде, где канвас отделён от
> параметров эффекта либо фигура от позиции.
> Следующее закрыто в `archive/plan-migrate-remaining.md` (2026-09-07):
> перевод оставшихся инструментов выполнен (всего 121/125 в preview; 4 хвоста —
> `watermark-image-png`, `png-info`, `reduce-to-size-png`, `compress-png` —
> отложены решениями в `backlog.md`). Незакрытые продолжения: переезд старых
> компонентов в папки `old/` (шаг 37 ниже), закрытие долгов и сбор фидбека —
> см. также `plan-design-fix.md`.
>
> Ключевые файлы нового registry: `web/src/lib/registry-new/{types,index,*}.ts`
> (по файлу на категорию: geometry/alpha/convert/analyze/filters/color/generate)
>
> - `web/src/lib/preview/categories.ts`,
>   `web/src/lib/registry-schema.ts` (kind `dimension`), `kit/fields/DimensionField.svelte`,
>   `preview/executor/index.ts` (`executeGenerate`), `SchemaFields.svelte`
>   (полный рендер kinds). Старый `web/src/lib/registry.ts` разбит по категориям
>   в `web/src/lib/registry/` (см. `registry.ts` — тонкий баррель).

## Ключевая стратегия: параллельная сборка, старый UI не трогаем

Старый UI (группа `(old)/`, `ParamForm.svelte` + старый pipeline) **продолжает
работать как сейчас, без рефакторинга**. Новый `ToolSchema<P>` строится
рядом и служит источником для **нового UI**. Инструменты переписываются под
новый registry по мере нужды — для нового UI.

Это та же логика, что в `plan-redesign.md` применена к дизайну: параллельная
сборка, изоляция от старого, затем новый становится основным и старый
удаляется вместе со старым дизайном.

**Правило копий (важно!):** если для нового UI/registry нужно внести изменения
в файл, который **прямо или косвенно** уже используется `(old)` веткой, — этот
файл **НЕ трогаем**. Вместо этого делаем **копию** в новом месте (например,
в `lib/preview/`) и правим копию. Это приводит к дублированию, но
**гарантированно не задевает старую ветку сайта**. Пример: категории — новый
`lib/preview/categories.ts` (object as const) копирует и заменяет собой
`../categories` для нового кода, старый `categories.ts` обслуживает `(old)` и
остаётся без изменений. После перехода (Фаза 5) копия становится основной,
а исходник продолжает обслуживать `(old)` UI (он не удаляется — см. шаг 35).

**Разделение схем: две независимые схемы.**

| Схема                 | Источник                                          | Использование                                                    |
| --------------------- | ------------------------------------------------- | ---------------------------------------------------------------- |
| Старый `ParamDef[]`   | В `ToolEntry.params` — **остаётся без изменений** | Старый UI, старый pipeline (`ParamForm.svelte`, executor, chain) |
| Новый `ToolSchema<P>` | Новое поле `ToolEntry.schema` — добавляется рядом | Новый UI (kit/`ParamControl`, новый pipeline)                    |

- Старая и новая схемы **не выводятся друг из друга** — это два независимых
  описания инструмента.
- Пока новый UI не готов — `schema` просто отсутствует у большинства
  инструментов, старый UI ничего не замечает.
- Удаление старого UI (после перехода) попутно удаляет и старый `ParamDef[]`

### Разделение registry по UI (новое решение, Фаза 2+)

Помимо двух схем, registry тоже разделён по UI (по факту миграции):

- **Старый registry** (`web/src/lib/registry.ts` + `registry/` +
  `registry-helpers.ts`) — работает на старом UI, использует `ParamDef[]`.
  **Не трогаем**; остаётся обслуживать `(old)/` маршруты (см. шаг 35).
- **Новый registry** (`web/src/lib/registry-new/`) — строится **с нуля «как надо»**:
  `ToolEntry<P>` с обязательным `schema`, типизированный `run`, **без** `ParamDef[]`
  и **без** связи со старым. Импортирует core-функции (`expandCanvas`,
  `strokeImage`, …) напрямую. Наполняется **по-инструментно** по мере миграции
  (не разовым переводом всех 130). Preview показывает только переведённые
  инструменты.

Preview (`catalog.ts`, маршруты `preview/**`, `SchemaToolView`, `SchemaFields`)
импортируют из `$lib/registry-new`. После удаления старого UI `registry-new/`
переименуется в `registry`.

**Executor/worker для нового UI (осознанное дублирование):** общий
`executor.worker.ts` резолвит инструменты по `id` в **старом** registry — для
новых инструментов их там нет. Поэтому `executor.ts` + `executor.worker.ts`
**скопированы** в `web/src/lib/preview/` и переписаны под `registry-new` +
`sanitizeSchemaParams`. Старый executor/worker под старый UI остаются
нетронутыми; `SchemaToolView` использует `$lib/preview/executor`. Это
дублирование необходимо до ухода старого UI (после — preview-executor заменяет
общий).

## Проблема (текущая)

- `ParamDef` — плоский union из 6 примитивов (`number | slider | select |
checkbox | color | text`). Параметры инструмента — отдельные записи в плоском
  массиве.
- `run()`/`generate()` получают `Record<string, unknown>`; значения достаются
  через `num(p, "fromColor")` — runtime string lookup **без type safety**,
  легко напутать id.
- Поля инструмента **слабо связаны** (например «ширина» и «цвет» рамки — два
  независимых поля без общего контракта) → общий генерализованный рендер, нет
  возможности сделать идеальный пер-инструмент UI.
- Preview-система (`tool-views.ts`) **дублирует** registry (FieldDef vs
  ParamDef) — одни и те же инструменты описаны дважды.

## Решения (принятые в обсуждении)

1. **Полная типизация.** `interface Params` (runtime-тип) объявляется явно в
   каждом инструменте. `run`/`generate` типизируются прямо на него, а не на
   `Record<string, unknown>`.
2. **Отдельная типизированная схема для UI/дефолтов/валидации.** Два понятия
   на инструмент: runtime-тип + схема. Схема проверяется компилятором на
   соответствие `Params` (чтобы не рассинхронизировались).
3. **Общий рендер,** но с пер-инструмент layout: общие компоненты рисуют поля
   по схеме; схема инструмента задаёт layout и группировку. Без отдельного
   Svelte-компонента на каждый инструмент.
4. **Составные типы** (`gradient`, `color-pair`, `dimension`, `offset`,
   `position9`, `font-style`, `plate`) остаются в плане — это способ выразить
   в схеме связанную группу полей и переиспользовать её на нескольких
   инструментах и в UI.
5. Рано или поздно `tool-views.ts` поглощается registry (preview/lede/layout
   переезжают в meta инструмента) — но это отдельный шаг, см. ниже.
6. **Старый UI не рефакторим.** Две независимые схемы: старый `ParamDef[]`
   остаётся источником для старого UI без изменений; новый `ToolSchema<P>`
   строится рядом для нового UI (см. «Ключевая стратегия» выше).

## Целевая архитектура (на примере «добавить рамку»)

Цель: «добавить рамку: ширина и цвет» — **один интерфейс**, а не два
слабо связанных поля.

```ts
// 1. Runtime-тип — что получает run/generate
interface AddBorderParams {
  thickness: number;  // рамка: ширина
  color: string;      // рамка: цвет
}

// 2. Типизированная UI-схема, проверяемая компилятором против Params
//    Ключи схемы обязаны совпадать с полями Params; default совместим с типом.
const addBorderSchema = toolSchema<AddBorderParams>({
  thickness: field.slider({ min: 1, max: 500, default: 5 }),
  color:     field.color({ default: "#000000" }),
  layout: { group: "border", cols: 2 },   // пер-инструмент раскладка
});

// 3. Инструмент в registry
const addBorder: ToolEntry<AddBorderParams> = {
  id: "add-border-png",
  title: "Add border to PNG",
  category: "geometry",
  schema: addBorderSchema,
  run: (img, p) => expandCanvas(img, 4x..., p.color),  // p.thickness — type safe
};
```

### Что даёт

- `p.thickness`, `p.color` — IDE autocomplete + compile-time ошибка при ошибке.
- `run()` нельзя передать лишний/чужой ключ.
- Схема — единый источник для дефолтов, валидации и рендера.
- Схема одного инструмента может задавать layout, которого нет в общем рендере.

## Типовая система (набросок)

```ts
// ─── Поле схемы ───
interface NumberField { kind: "number"; default: number; min?: number; max?: number; step?: number }
interface SliderField { kind: "slider"; default: number; min: number; max: number; step?: number }
interface ColorField  { kind: "color";  default: string }
interface SelectField { kind: "select"; default: string; options: { value: string; label: string }[] }
interface TextField   { kind: "text";   default: string; placeholder?: string }
interface CheckboxField { kind: "checkbox"; default: boolean }

type FieldDef =
  | NumberField | SliderField | ColorField | SelectField | TextField | CheckboxField;

// ─── «поле» описывает тип значения + схему вместе, чтобы не рассинхронизировать ───
interface Field<T> {
  schema: FieldDef;
  // T — ожидаемый runtime-тип этого поля (number|string|boolean)
}

// ─── Builder: field.slider({...}) возвращает Field<number> с типизированной схемой ───
const field = {
  slider: (s: SliderField): Field<number> => ({ schema: s }),
  number: (s: NumberField): Field<number> => ({ schema: s }),
  color:  (s: ColorField):  Field<string> => ({ schema: s }),
  select: <V extends string>(s: SelectField & { options: {value: V}[] }): Field<V> => ({ schema: s }),
  text:   (s: TextField):   Field<string> => ({ schema: s }),
  checkbox: (s: CheckboxField): Field<boolean> => ({ schema: s }),
};

// ─── toolSchema<P>: проверяет, что ключи схемы === полям P и типы сходятся ───
type FieldsOf<T> = { [K in keyof T]: Field<T[K]> } & {
  layout?: { group?: string; cols?: number };
};
function toolSchema<P>(fields: FieldsOf<P>): ToolSchema<P> { ... }
// TS выдаст ошибку, если schema содержит ключ, отсутствующий в Params, или
// если type поля не совпадает с типом Params[K].
```

Ключевая идея связки: **builder `field.x<T>()` связывает runtime-тип поля с его
схемой на этапе компиляции**, а `toolSchema<P>` заставляет ключи схемы
совпадать с ключами `P`. Это и есть защита от рассинхрона.

## Составные типы (для переиспользования и группировки)

| Тип          | Под-поля                   | Инструментов |
| ------------ | -------------------------- | ------------ |
| `dimension`  | width + height             | 12           |
| `color-pair` | from + to                  | 4            |
| `offset`     | x + y                      | 4            |
| `gradient`   | from + to + dir (+ type?)  | 1            |
| `position9`  | position (3×3 grid)        | 3            |
| `font-style` | font + size + bold + color | 3-4          |
| `plate`      | enabled + color + opacity  | 2-3          |

Составной тип = группы полей, которые в интерфейсе `Params` могут разворачиваться
во вложенный объект или плоские ключи — решается на этапе реализации.
Пример для `gradient`:

```ts
interface GradientParams {
  from: string;
  to: string;
  dir: string;
}
// схема: field.color(from), field.color(to), field.select(dir)
// плюс annotation в схеме: { group: "gradient" } → UI рисует как цветовой переход
```

## Инвентарь: какие инструменты мигрировать

### dimension (12)

resize-png*, crop-png*, fit-on-background-png, create-empty-png,
single-color-png, random-noise-png, linear-gradient-png, color-spectrum-png,
random-colors-png, draw-grid-png, placeholder-png, change-canvas-size-png

(\* у resize/crop — не просто dimension, есть специфика: keepAspect, x/y и т.д.)

### color-pair (4)

blend-two-png, step-colors-png, linear-gradient-png, two-colors-png

### offset (4)

circle-mask-png, square-mask-png, star-mask-png, wavy-mask-png

### position9 (3)

add-text-png, date-stamp-png, watermark-image-png

### font-style (3-4)

text-to-png, add-text-png, date-stamp-png

### plate (2-3)

add-text-png, date-stamp-png

## Пошаговый план перевода инструментов

> Каждый шаг — **атомарное, маленькое изменение** (в идеале 1 инструмент =
> 1 diff, укладывается в правило «коммиты < ~500 строк»). После каждого шага —
> ревью; параллельно можно делать UI нового инструмента.
>
> **Принцип малых шагов:** перевод инструмента не меняет поведение старой
> схемы (`params` остаётся), не ломает старый UI. Инструмент получает ДОПОЛНИТЕЛЬНО
> новое поле `schema` + `interface Params`, старое `run`/`params` не трогаем.
> Это гарантирует, что старый UI продолжает работать без регресса.
>
> **Новый подход (решение пользователя):** сначала делаем **один полноценный
> рабочий инструмент в preview** — не эталон «на бумаге», а реально юзабельный,
> чтобы руками оценить, насколько это рабочее решение и какие возникнут сложности.
> Оцениваем, при необходимости правим инфраструктуру, и только потом переводим
> остальные инструменты тем же проверенным паттерном.

### Фаза 0 — фундамент ✔ (сделано)

Typed field builders + `Field<T>` + `toolSchema<P>()` + `ToolSchema<P>` —
в `web/src/lib/registry-schema.ts`. `ToolEntry<P>` generic + опциональное
поле `schema`. Новые `defaultSchemaParams`/`sanitizeSchemaParams`.
Старый `ParamDef[]`/pipeline не тронуты. Проверено: compile-time-защита
(лишний/неверный/отсутствующий ключ ловит TS), тесты, svelte-check без новых
ошибок.

### Фаза 1 — ОДИН полноценный рабочий инструмент в preview (срез) ✔ (сделано)

Инструмент переехал в `registry-new` и рендерится через `SchemaToolView`
(`SchemaFields`/`SchemaPreview`); применение реально работает end-to-end до
картинки. Паттерн подтверждён. `find-contour-png` — следующий в этой фазе-2.

5. **Инструмент «добавить рамку» (`add-border-png`)** — сделать полностью
   рабочим в preview:
   - `interface AddBorderParams { thickness: number; color: string }`
   - `addBorderSchema = toolSchema<AddBorderParams>(...)` + `schema: ...` в entry
     (старый `params`/`run` остаются — старый UI не регрессит).
   - **Новый рендер в preview** (`kit/ToolView` → `ParamControl` или новый
     компонент схемы): читает `ToolSchema<P>`, рисует поля рамки, применение
     реально работает (end-to-end до картинки).
   - Дефолты/валидация/значения — из схемы (`defaultSchemaParams`,
     `sanitizeSchemaParams`).
   - **Ревью-оценка:** удобно ли это, что сломалось/усложнилось, что поправить
     в инфраструктуре до масштабирования. Принимается макет/решение.

Результат: один реально рабочий инструмент на новой системе = доказываем паттерн,
прежде чем переводить остальных.

### Фаза 2 — простые инструменты без составных типов (1 инструмент = 1 шаг)

Одиночные/небольшие инструменты, где `interface Params` + `schema` не требуют
составных типов. Каждый — отдельный маленький diff (~15-30 строк), тем самым
проверенным в Фазе 1 паттерном. **Переезжают в `registry-new`.**

Переведено: `add-border-png` (Фаза 1), `add-stroke-png`, `find-contour-png`, плюс
весь блок простых инструментов ниже (пункты 8-22). Следующее — Фаза 3.

6. ~~add-stroke-png (color + slider)~~ → переведён в `registry-new` ✔
7. ~~find-contour-png (color + slider)~~ → переведён в `registry-new` ✔
8. ~~convert-png-to-jpg (color + slider)~~ → переведён в `registry-new` ✔
9. ~~convert-png-to-webp (slider)~~ → переведён в `registry-new` ✔
10. ~~remove-color-from-png (color + slider)~~ → переведён в `registry-new` ✔
11. ~~extract-color-from-png (color + slider)~~ → переведён в `registry-new` ✔
12. ~~add-noise-png (slider + select + number)~~ → переведён в `registry-new` ✔
13. ~~randomize-pixels-png (slider + number)~~ → переведён в `registry-new` ✔
14. ~~pixelate-png (slider)~~ → переведён в `registry-new` ✔
15. ~~vignette-png (slider)~~ → переведён в `registry-new` ✔
16. ~~gamma-png (slider)~~ → переведён в `registry-new` ✔
17. ~~temperature-png (slider)~~ → переведён в `registry-new` ✔
18. ~~tint-png (color + slider)~~ → переведён в `registry-new` ✔
19. ~~quantize-png (slider)~~ → переведён в `registry-new` ✔
20. ~~custom-palette-png (text)~~ → переведён в `registry-new` ✔
21. ~~dithering-png (slider + select)~~ → переведён в `registry-new` ✔
22. ~~jpeg-artifacts-png (slider)~~ → переведён в `registry-new` ✔

> **Замечание (конвертеры):** старые `convert-png-to-jpg`/`convert-png-to-webp`
> несли `output`-метаданные (`mime`/`ext`/`qualityParamId`) для выбора формата
> вывода. В новом `ToolEntry<P>` поля `output` пока нет, поэтому при переводе
> эти метаданные не перенесены — preview пока отдаёт результат как PNG.
> Механика выбора формата/качества в новом UI — отдельный шаг (не блокирует Фазу 2).

### Фаза 3 — инструменты с составными типами (по типу, затем по инструментам)

24. `dimension` — **переведены все 12 инструментов** ✔ (`create-empty-png`,
    `single-color-png`, `random-noise-png`, `linear-gradient-png`,
    `color-spectrum-png`, `random-colors-png`, `draw-grid-png`,
    `placeholder-png` — генераторы в `registry-new/generate.ts`;
    `fit-on-background-png`, `change-canvas-size-png`, `resize-png`,
    `crop-png` — в `registry-new/geometry.ts`). Составной тип во всех видах:
    вложенный объект `size: { width, height }` в Params + `field.dimension`,
    виджет `kit/fields/DimensionField.svelte`.
    Preview: генераторы применяются через `executeGenerate` (кнопка Generate),
    `SchemaFields` рендерит все kinds схемы (slider/number/color/select/
    checkbox/dimension). Тесты: 592 passed.
25. `color-pair` — **все 4 инструмента переведены** ✔ (`blend-two-png`,
    `step-colors-png`, `linear-gradient-png` — генераторы в
    `registry-new/generate.ts`, `two-colors-png` — run в `registry-new/color.ts`).
    Составной тип во всех видах: вложенный объект `pair: { from, to }` +
    `field.colorPair`, виджет `kit/fields/schema/ColorPairControl.svelte`,
    kind `color-pair` в схеме (default/sanitize). Тесты: +4 (596 passed).
26. `offset` — **все 4 инструмента переведены** ✔ (`circle-mask-png`,
    `square-mask-png`, `star-mask-png`, `wavy-mask-png` — run в
    `registry-new/alpha.ts`). Составной тип во всех видах: вложенный объект
    `offset: { x, y }` + `field.offset`, виджет
    `kit/fields/schema/OffsetControl.svelte`, kind `offset` в схеме
    (default/sanitize). Тесты: +4 (600 passed).
27. `position9` — **переведены `add-text-png` и `date-stamp-png`** ✔ (run в
    `registry-new/text.ts`, оба `domOnly`). Составной тип во всех видах:
    значение — строка `Position9`, kind `position9` в схеме (default/sanitize
    по `POSITION9_VALUES`), виджет 3×3 `kit/fields/schema/PositionControl.svelte`.
    В `ToolEntry` добавлен флаг `domOnly` (превью-executor держит такие
    инструменты вне worker). `watermark-image-png` — отдельный под-шаг:
    ему нужен overlay-source (`getOverlay`/store), которого в новом превью пока
    нет. Тесты: +2 (602 passed). `font-style` и `plate` на этих инструментах
    сводятся в шаги 28-29.
28. `font-style` — **все 3 инструмента переведены** ✔ (`text-to-png` —
    генератор в `registry-new/generate.ts` (domOnly), `add-text-png`/
    `date-stamp-png` — рефакторинг в `registry-new/text.ts`). Составной тип
    во всех видах: вложенный объект `style: { font, size, bold, color }` +
    `field.fontStyle`, виджет `kit/fields/schema/FontStyleControl.svelte`,
    kind `font-style` в схеме (default/sanitize, clamp размера к min/max).
    Тесты: +1 (603 passed).
29. `plate` — **все 2 инструмента переведены** ✔ (`add-text-png`,
    `date-stamp-png` — рефакторинг в `registry-new/text.ts`). Составной тип
    во всех видах: вложенный объект `plate: { enabled, color, opacity }` +
    `field.plate`, виджет `kit/fields/schema/PlateControl.svelte` (чекбокс +
    цвет + слайдер непрозрачности, деактивируется при выключенной плашке),
    kind `plate` в схеме (default/sanitize, clamp opacity к 0..100).
    Покрытие тестов расширено (дефолты/sanitize plate в существующих тестах).
30. `gradient` — **переведён** ✔ (linear-gradient-png). Направление градиента
    — не горизонталь/вертикаль, а **произвольный угол**: новый переиспользуемый
    виджет `kit/fields/schema/AngleControl.svelte` (слайдер 0..360° + кнопки
    стандартных углов 0°/90°/180°/270° с активным состоянием). Составной тип
    `gradient: { from, to, angle }` во всех видах (`field.gradient`, kind
    `gradient` в схеме — default/sanitize, clamp угла к 0..360, валидация
    цветов; виджет `kit/fields/schema/GradientControl.svelte` — пара цветов +
    AngleControl). Рендер по углу — локальный `angleGradient` в
    `registry-new/generate.ts` (core-`gradientImage` не трогали: он умеет
    только horizontal/vertical и используется старым UI). Семантика: 0° слева
    направо, 90° сверху вниз, рост угла по часовой (ось Y вниз); нормализация
    по полному диапазону проекции на ось (180°/270° разворачивают градиент).
    Тесты: дефолты, направление по углу (0°/90°/180°), sanitize/кламп.

### Фаза 4 — масштаб UI на остальные инструменты

31. По мере перевода инструментов в Фазе 2-3 — рендер схемы (из Фазы 1)
    покрывает их автоматически; составные виджеты (dimension, color-pair,
    offset, position9, font-style, plate, gradient) — по одному, каждый с ревью.
32. Пер-инструмент layout (`schema.layout`) — **реализован** ✔.
    `ToolSchemaLayout.groups: { title?, cols?, fields[] }` в registry-schema;
    `SchemaFields.svelte` рендерит группы (подпись + сетка `1..n` колонок,
    неупомянутые поля — в общей группе в конце, без заголовка). Пилот —
    `add-text-png` (Text: text+style; Placement: position+margin; Plate).
    Тесты: schema-layout в registry-schema.test.ts; полные запуски чисты.
33. Для каждого переведённого инструмента — UI-макет **расставлен** ✔.
    Layout-группы заданы там, где группировка содержательна (канвас отдельно
    от параметров эффекта, фигура отдельно от позиции; составные виджеты —
    внутри групп целиком):
    - geometry: fit-on-background (Canvas/Background), change-canvas-size
      (Canvas/Anchor), resize (Canvas/Scaling), crop (Offset/Crop area);
    - alpha-маски: circle/square/star/wavy (Shape — с 2 колонками где плотно,
      Position — offset);
    - generate: create-empty (Canvas/Fill), linear-gradient (Canvas/Colors),
      color-spectrum (Canvas/Spectrum), random-colors (Canvas/Random),
      draw-grid (Canvas/Grid), step-colors (Colors/Output), placeholder
      (Canvas/Colors/Text), text-to-png (Text/Background/Padding);
    - text: add-text, date-stamp (Text/Placement/Plate);
    - filters: randomize-pixels (Blocks), add-noise (Noise/Seed).
      Инструменты с 1–3 простыми полями остались без layout (одна общая группа).

### Фаза 5 — изоляция старого UI

34. Поглощение `tool-views.ts` (preview/lede/layout → meta инструмента) ✔.
    Отдельного `tool-views.ts` в репо нет: preview сразу строился на
    `registry-new`. Meta инструмента живёт в `ToolEntry` (`title`, `description`,
    `category`, `run`/`generate`), layout — в `schema.layout` (шаг 32), рендер —
    `SchemaToolView`/`SchemaFields`/`SchemaPreview`. Дублирующей системы нет.
35. Старый UI **не удаляется**, а выносится в `(old)/`-маршруты и остаётся там
    временно (посмотреть, как работает, сравнить с новым; старые тесты
    продолжают проходить):
    - маршруты `(old)/{+page,demo,list-tools,tools/[id]}` — старый дизайн,
      тянет `old.css` (не `design2.css`), старый header/footer;
    - старый `registry.ts`/`registry/` + `ParamDef[]` обслуживают только
      `(old)/`-инструменты — не удаляются, не рефакторятся;
    - удаление происходит позже, отдельным решением (когда новый UI покроет
      все инструменты и ревью завершено).
36. **Линтер-изоляция веток** (гарантия, что old и preview не смешиваются) ✔.
    Кастомный ESLint-плагин `web/eslint-plugins/isolation/no-mixed-imports`
    Резолвит каждый импорт (и `$lib/...`, и относительные `./`/`../`) до
    реального файла, классифицирует источник и цель по фактическому пути и
    ругается на old→new и new→old. Конфигурация (`old`/`new` glob-паттерны,
    `root`, `alias`) вынесена в настройки правила — единая точка правды:
    - старое: `routes/(old)/**`, `lib/registry.ts`, `lib/registry/**`,
      `lib/registry-helpers.ts`, `lib/categories.ts`, `lib/tools/**`,
      `lib/components/**` (кроме `kit/`);
    - новое: `routes/preview/**`, `lib/registry-new/**`, `lib/preview/**`,
      `lib/registry-schema.ts`, `lib/registry-schema.test.ts`,
      `lib/components/kit/**`;
    - общее (разрешено обоим): всё прочее — `core/`, `i18n/`, `theme`,
      `assets/`, корневой `lib` (`index.ts`, тесты).
    Достигнутая полная изоляция (одиночные пересечения устранены):
    - старые пилоты `registry/geometry.ts` (`add-border`) и `registry/alpha.ts`
      (`add-stroke`) получали `schema` из нового `registry-schema` — убрано;
      оба инструмента работают в старом UI через `params: ParamDef[]`,
      в preview — через свои schema-версии в `registry-new/`;
    - `registry.ts` больше не импортирует `ToolSchema` из `registry-schema`;
    - preview `list-tools` тянул `TOOL_ICONS` из старого `lib/tools/tool-icons`
      → создана копия `lib/preview/tool-icons.ts` (правило копий).
37. Перенос всех старых компонентов/библиотек в папки `old/` (**следующее**):
    переезд не трогает плагин — достаточно дописать один glob-паттерн в
    настройку правила (например `lib/old/**`, `lib/components/old/**`), а сама
    проверка работает по фактическим путям автоматически.

### Как ревьюить каждый шаг

- Diff **только один инструмент** (или фундамент без инструментов).
- Старый `params`/`run`/`defaultParams`/`sanitizeParams` — **не изменены** (кроме
  добаление `schema`, если это пилот).
- Старый UI и старые тесты продолжают работать — запустить
  `pnpm --dir web test` и `pnpm --dir web exec svelte-check`.
- Порядок полей в `interface Params` и в `schema` совпадает; дефолты в сeme
  равны старым `default` из `params`.
- Пилот из Фазы 1 проверяется **руками в preview**: применяется рамка,
  дефолты/валидация/смена значений работают end-to-end.

## Поток данных (runtime)

### Старый pipeline (не трогаем)

Всё как сейчас: старое `defaultParams`/`sanitizeParams`/executor/chain работают
на `ParamDef[]` и `Record<string, unknown>`. Никаких изменений.

### Новый pipeline (строим рядом)

- **Хранилище значений** — типизировано на схему; у нового UI значения полей
  собираются в `Params` по `ToolSchema<P>`.
- **defaultParams / sanitizeParams (новые)** — выводятся из `ToolSchema<P>`,
  дефолты лежат в схеме. Старые функции не трогаем, добавляем новые рядом.
- **Executor/worker (новые)** — получает `Record<string, unknown>`, собирает
  `Params` по схеме, вызывает `run`. Остаётся serializable.
- **Pipeline/chain (новый)** — шаги хранят значения, типизируются по схеме.

## Изменения в UI-компонентах

- **Старый UI** (`ParamForm.svelte`, группа `(old)/`) — **не трогаем.** Работает
  на `ParamDef[]` как раньше.
- **Новый UI** (kit/`SchemaToolView` + `SchemaFields` + `SchemaPreview`, читает
  `ToolSchema<P>`) — сейчас рендерит поля по схеме (number/slider/color).
- `tool-views.ts` отсутствует — preview/lede/layout уже живут в meta
  инструмента (`ToolEntry` + `schema.layout`), дублирования нет.

## Оценка трудозатрат

| Часть                                                 | Сложность                | Время                  |
| ----------------------------------------------------- | ------------------------ | ---------------------- |
| Typed field builders + toolSchema\<P\>                | Средняя                  | ~2ч                    |
| Новые defaultParams/sanitizeParams под схему          | Средняя                  | ~2-3ч                  |
| ToolEntry\<P\> generic + поле schema (рядом с params) | Низкая-Средняя           | ~1-2ч                  |
| Новый executor/worker/pipeline под схему              | Средняя                  | ~2-3ч                  |
| Миграция инструментов на interface Params + схемы     | Механическая, но крупная | ~8-12ч                 |
| Новый рендер (kit/ParamControl) + составные виджеты   | Средняя                  | ~4-5ч                  |
| Поглощение tool-views.ts                              | Средняя                  | ~1-2ч                  |
| Вынос старого UI в (old)/ + адаптация маршрутов       | Средняя-Низкая           | ~2-3ч                  |
| **Итого**                                             |                          | **~22-32ч** (поэтапно) |

> Оценка выросла по сравнению с ранней версией плана, потому что принят путь
> «явный interface Params + схема + общий рендер с пер-инструмент layout» —
> это полный рефакторинг pipeline, а не только добавление составных типов.
>
> Старый UI/`ParamDef[]`/старый pipeline в смету **не входят** — они не
> рефакторятся, а продолжают работать на `(old)/`-маршрутах до перехода
> (затем убираются отдельным решением — см. шаг 35).

## Порядок реализации (кратко)

Детальный пошаговый план с атомарными изменениями и порядком ревью — в разделе
«Пошаговый план перевода инструментов» выше. Здесь краткая сводка фаз:

1. **Фаза 0** — фундамент: builders + `toolSchema<P>` + `ToolEntry<P>.schema` +
   новые default/sanitize. Ни одного инструмента не изменено. ✔
2. **Фаза 1** — **один полноценный рабочий инструмент в preview**
   («добавить рамку»): schema + рендер + end-to-end применение. Ручная оценка
   работоспособности решения/сложностей.
3. **Фаза 2** — простые/одиночные инструменты (проверенный паттерн Фазы 1),
   1 инструмент = 1 диф.
4. **Фаза 3** — инструменты с составными типами (dimension → color-pair →
   offset → position9 → font-style → plate → gradient), пилот каждого типа
   отдельно.
5. **Фаза 4** — масштаб UI на остальные: составные виджеты, пер-инструмент
   layout (для каждого инструмента — UI-макет).
6. **Фаза 5** — изоляция: старый UI на `(old)/`-маршруты (не удаляется,
   остаётся для ревью); preview на `registry-new` полностью;
   линтер-изоляция веток (плагин `isolation`), затем перенос старых
   компонентов/библиотек в папки `old/`.

## Зависимости

- **UI сперва доделать** — текущая активная работа; типизация params ожидает
  готовности нового дизайна.
- Ветка redesign (`plan-redesign.md`) — параллельная, учесть при миграции
  kit/`ParamControl.svelte` и `overlay-store`.
- Старый pipeline остаётся рабочим и шippable на всём протяжении перехода
  (аналогично стратегии `plan-redesign.md`).
