# План: составные типы параметров и полная типизация pipeline

> Статус: **обсуждение завершено, решения приняты. Реализация пока НЕ начата**
> (ждут готовности UI). Док отражает итоговую целевую архитектуру.
>
> Файлы: `web/src/lib/registry.ts` (3918 строк), `web/src/lib/preview/tool-views.ts` (193 строки).

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

### Фаза 0 — фундамент (без инструментов, ещё не мигрируем)

1. **Typed field builders** (`field.slider`, `field.color`, …) + тип `Field<T>`
   — отдельный файл `web/src/lib/registry-schema.ts` (или рядом с registry).
   Diff: новый файл ~60-100 строк. Только типы, без изменения registry.
2. **`toolSchema<P>()`** + тип `ToolSchema<P>` — проверка соответствия схемы
   полям Params. Diff: добавление функции в тот же файл. Без изменений registry.
3. **`ToolEntry<P>` generic + поле `schema`** (рядом с `params`). Diff: правка
   типа `ToolEntry` в registry.ts (~10 строк). Компилируется, поведения не
   меняет — `schema` опционален.
4. **Новые `defaultParams`/`sanitizeParams`** для схемы (старые не трогаем).
   Diff: добавление функций рядом. Никто ещё не вызывает — просто присутствуют.

Результат фазы 0: инфраструктура готова, registry работает как раньше, ни один
инструмент не изменён. Старый UI/тесты не затронуты.

### Фаза 1 — эталонный инструмент (вертикальный срез)

5. **Инструмент «добавить рамку» (`add-border-png`)** — первый пилот:
   - добавить `interface AddBorderParams { thickness: number; color: string }`
   - добавить `const addBorderSchema = toolSchema<AddBorderParams>({...})`
   - добавить `schema: addBorderSchema` в `ToolEntry` (старый `params`/`run` остаются)
     Diff: ~25-35 строк в одном месте. **Ревью макета** здесь решает, как выглядит
     вертикальный срез, перед масштабированием.

### Фаза 2 — простые инструменты без составных типов (1 инструмент = 1 шаг)

Одиночные/небольшие инструменты, где `interface Params` + `schema` не требуют
составных типов. Каждый — отдельный маленький diff (~15-30 строк):

6. add-stroke-png (color + slider)
7. find-contour-png (color + slider)
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

### Фаза 4 — связка с новым UI

31. Новый рендер (`kit/ParamControl`) читает `ToolSchema<P>`; собрать макет
    на пилоте add-border-png из Фазы 1.
32. Составные виджеты (dimension, color-pair, offset, position9, font-style,
    plate, gradient) — по одному, каждый с ревью.
33. Пер-инструмент layout (`schema.layout`): группировка полей рамки и т.п.
34. Для каждого переведённого инструмента — UI-макет, принимается отдельно.

### Фаза 5 — зачистка

35. Поглощение `tool-views.ts` (preview/lede/layout → meta инструмента).
36. После перехода на новый дизайн — удаление старого UI и старого `ParamDef[]`.

### Как ревьюить каждый шаг

- Diff **только один инструмент** (или фундамент без инструментов).
- Старый `params`/`run`/`defaultParams`/`sanitizeParams` — **не изменены** (кроме
  добаление `schema`, если это пилот).
- Старый UI и старые тесты продолжают работать — запустить
  `pnpm --dir web test` и `pnpm --dir web exec svelte-check`.
- Порядок полей в `interface Params` и в `schema` совпадает; дефолты в сeme
  равны старым `default` из `params`.
- После принятия макета — можно делать UI инструмента, не блокируя остальных.

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
- **Новый UI** (kit/`ParamControl.svelte`, новый pipeline) — читает
  `ToolSchema<P>`; поддержка составных типов и пер-инструмент layout
  (`schema.layout`).
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
   новые default/sanitize. Ни одного инструмента не изменено.
2. **Фаза 1** — эталонный пилот «добавить рамку» (вертикальный срез), ревью.
3. **Фаза 2** — простые/одиночные инструменты, 1 инструмент = 1 диф.
4. **Фаза 3** — инструменты с составными типами (dimension → color-pair →
   offset → position9 → font-style → plate → gradient), пилот каждого типа
   отдельно.
5. **Фаза 4** — связка с новым UI: рендер `ToolSchema<P>`, составные виджеты,
   пер-инструмент layout (для каждого инструмента — UI-макет).
6. **Фаза 5** — поглощение `tool-views.ts`, затем удаление старого UI/`ParamDef[]`

## Зависимости

- **UI сперва доделать** — текущая активная работа; типизация params ожидает
  готовности нового дизайна.
- Ветка redesign (`plan-redesign.md`) — параллельная, учесть при миграции
  kit/`ParamControl.svelte` и `overlay-store`.
- Старый pipeline остаётся рабочим и шippable на всём протяжении перехода
  (аналогично стратегии `plan-redesign.md`).
