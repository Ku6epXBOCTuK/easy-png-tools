# План: составные типы параметров и полная типизация pipeline

> Статус: **в реализации.** Фаза 0 (фундамент) ✔, Фаза 1 (рабочий инструмент
> в preview) ✔, Фаза 2 — начата: построен отдельный **новый registry**
> (`web/src/lib/registry-new/`) с первыми инструментами (`add-border-png`,
> `add-stroke-png`), preview переключён на него. Следующее: продолжить Фазу 2 —
> следующий инструмент `find-contour-png` в новый registry.
>
> Ключевые файлы нового registry: `web/src/lib/registry-new/{types,geometry,alpha,index}.ts`,
> `web/src/lib/registry-schema.ts`. Старый `web/src/lib/registry.ts` разбит по
> категориям в `web/src/lib/registry/` (см. `registry.ts` — тонкий баррель).

## Ключевая стратегия: параллельная сборка, старый UI не трогаем

Старый UI (группа `(old)/`, `ParamForm.svelte` + старый pipeline) **продолжает
работать как сейчас, без рефакторинга**. Новый `ToolSchema<P>` строится
рядом и служит источником для **нового UI**. Инструменты переписываются под
новый registry по мере нужды — для нового UI.

Это та же логика, что в `plan-redesign.md` применена к дизайну: параллельная
сборка, изоляция от старого, затем новый становится основным и старый
удаляется вместе со старым дизайном.

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
  `registry-helpers.ts`) — работает на старом UI, использует `ParamDef[]` и
  `tool-views.ts`. **Не трогаем**; идёт под удаление вместе со старым UI.
- **Новый registry** (`web/src/lib/registry-new/`) — строится **с нуля «как надо»**:
  `ToolEntry<P>` с обязательным `schema`, типизированный `run`, **без** `ParamDef[]`
  и **без** связи со старым. Импортирует core-функции (`expandCanvas`,
  `strokeImage`, …) напрямую. Наполняется **по-инструментно** по мере миграции
  (не разовым переводом всех 130). Preview показывает только переведённые
  инструменты.

Preview (`catalog.ts`, маршруты `preview/**`, `SchemaToolView`, `SchemaFields`)
импортируют из `$lib/registry-new`. После удаления старого UI `registry-new/`
переименуется в `registry`.

**Нюанс по worker:** `executor.worker.ts` резолвит инструменты по `id` в
**старом** registry. Для инструментов, существующих в обоих (сейчас
`add-border/add-stroke`), worker работает. Для новых инструментов, которых нет в
старом registry, worker не найдёт → `executeStep` откатится на `runDirect`
(fallback в `catch`) — это корректно, но стоит поправить worker на новый registry
при дальнейшей миграции.

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

Переведено: `add-border-png` (Фаза 1), `add-stroke-png`. Следующий —
`find-contour-png`.

6. ~~add-stroke-png (color + slider)~~ → переведён в `registry-new` ✔
7. find-contour-png (color + slider) — **следующий**
8. convert-png-to-jpg (color + slider)
9. convert-png-to-webp (slider)
10. remove-color-from-png (color + slider)
11. extract-color-from-png (color + slider)
12. add-noise-png (slider + select + number)
13. randomize-pixels-png (slider + number)
14. pixelate-png (slider)
15. vignette-png (slider)
16. gamma-png (slider)
17. temperature-png (slider)
18. tint-png (color + slider)
19. quantize-png (slider)
20. custom-palette-png (text)
21. dithering-png (slider + select)
22. jpeg-artifacts-png (slider)

(и т.п. — все одиночные инструменты в этом же ключе)

### Фаза 3 — инструменты с составными типами (по типу, затем по инструментам)

24. `dimension` — ввести составной тип + перевести **один** пилот
    (create-empty-png), ревью, затем остальные 11 по 1:
    create-empty → single-color → random-noise → fit-on-background →
    change-canvas-size → placeholder → draw-grid → random-colors →
    color-spectrum → linear-gradient → resize → crop
25. `color-pair` — пилот (blend-two-png), затем two-colors → step-colors →
    linear-gradient (уже переведён в dimension, здесь добавляется к нему)
26. `offset` — пилот (circle-mask-png), затем square-mask → star-mask →
    wavy-mask
27. `position9` — перевести add-text → date-stamp → watermark-image
28. `font-style` — перевести text-to-png → add-text (если ещё не) →
    date-stamp
29. `plate` — перевести add-text → date-stamp
30. `gradient` — собрать из dimension + color-pair + direction на
    linear-gradient (зависит от решения по gradient, см. план)

### Фаза 4 — масштаб UI на остальные инструменты

31. По мере перевода инструментов в Фазе 2-3 — рендер схемы (из Фазы 1)
    покрывает их автоматически; составные виджеты (dimension, color-pair,
    offset, position9, font-style, plate, gradient) — по одному, каждый с ревью.
32. Пер-инструмент layout (`schema.layout`): группировка полей рамки и т.п.
33. Для каждого переведённого инструмента — UI-макет, принимается отдельно.

### Фаза 5 — зачистка

34. Поглощение `tool-views.ts` (preview/lede/layout → meta инструмента).
35. После перехода на новый дизайн — удаление старого UI и старого `ParamDef[]`.

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
- `tool-views.ts` — со временем поглощается registry (preview/lede/layout →
  meta инструмента). Отдельный шаг, НЕ блокирует типизацию params.

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
| **Итого**                                             |                          | **~20-29ч** (поэтапно) |

> Оценка выросла по сравнению с ранней версией плана, потому что принят путь
> «явный interface Params + схема + общий рендер с пер-инструмент layout» —
> это полный рефакторинг pipeline, а не только добавление составных типов.
>
> Старый UI/`ParamDef[]`/старый pipeline в смету **не входят** — они не
> рефакторятся, а продолжают работать до перехода (затем удаляются вместе со
> старым дизайном).

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
6. **Фаза 5** — поглощение `tool-views.ts`, затем удаление старого UI/`ParamDef[]`

## Зависимости

- **UI сперва доделать** — текущая активная работа; типизация params ожидает
  готовности нового дизайна.
- Ветка redesign (`plan-redesign.md`) — параллельная, учесть при миграции
  kit/`ParamControl.svelte` и `overlay-store`.
- Старый pipeline остаётся рабочим и шippable на всём протяжении перехода
  (аналогично стратегии `plan-redesign.md`).
