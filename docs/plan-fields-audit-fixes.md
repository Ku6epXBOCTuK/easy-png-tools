# План: исправления по аудиту UX/UI

> Статус: **draft** — на ревью.
>
> Источник: `docs/tools-audit.md`. Этот документ разбивает аудит на конкретные
> шаги, группирует по типу работы и фиксирует решения. Порядок и правила
> проверки — `docs/quality-gates.md`; точки касания при добавлении вида поля —
> `docs/architecture.md`, раздел 4.
>
> **Ids инструментов в таблицах волны B сверены с реестром.** Названия из
> `tools-audit.md` вида `png-to-hsl` или `color-wheel-generator` в реестре нет
> (`hsl`, `color-wheel-png`).

## 0. Ключевое решение: select → buttons

Существующий `Segmented.svelte` — компонент с группированными кнопками (общая
рамка, разделители между сегментами). Для параметров инструментов он не
подходит: при 3+ опциях сегменты сжимаются, текст не читается.

**Решение:** новый компонент `ButtonsControl` — раздельные outline-кнопки с
отступами. Каждая опция — отдельная `<button>` со своей рамкой, активная
подсвечивается заливкой (`--color-main`). Не зависит от `Segmented`.

### Компонент `ButtonsControl`

```svelte
<!-- web/src/lib/components/fields/schema/ButtonsControl.svelte -->
<div class="buttons" role="group">
  {#each options as opt}
    <button
      class="btn"
      class:selected={value === opt.value}
      aria-pressed={value === opt.value}
      onclick={() => select(opt.value)}
    >{opt.label}</button>
  {/each}
</div>
```

```css
.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-m);
}
.btn {
  padding: var(--space-m) var(--space-l);
  border: var(--size-border) solid var(--color-border);
  border-radius: var(--radius-s);
  font: var(--font-size-s) var(--font-mono);
  color: var(--color-text-muted);
  background: transparent;
  cursor: pointer;
}
.btn.selected {
  background: var(--color-main);
  color: var(--color-background);
  border-color: var(--color-main);
}
```

### Схема: `field.buttons()`

Новый тип в `registry-schema.ts`:

```ts
export interface ButtonsSpec<V extends string = string> extends FieldSpecBase {
  kind: "buttons";
  default: V;
  options: { value: V; label: string }[];
}
```

Фабрика:

```ts
buttons: <V extends string>(s: Omit<ButtonsSpec<V>, "kind">): Field<V> => ({
  spec: { kind: "buttons", ...s },
}),
```

Регистрация: добавить `"buttons": {} as ButtonsSpec` в `fieldSpecs`, добавить
`ButtonsControl` в `FIELDS` в `SchemaFields.svelte`, добавить дефолт/санитайз в
`sanitizeSchemaParams` и `defaultSchemaParams`.

---

## 1. Волна A — инфраструктура (1 коммит)

### Шаг A1. Новый тип `buttons` в схеме

Файлы:

- `web/src/lib/registry-schema.ts` — `ButtonsSpec`, фабрика `field.buttons()`,
  кейс в `sanitizeSchemaParams`, кейс в `defaultSchemaParams`
- `web/src/lib/components/fields/schema/ButtonsControl.svelte` — новый компонент
- `web/src/lib/components/SchemaFields.svelte` — импорт + запись в `FIELDS`

### Шаг A2. Seed → input + randomize

Для `field.number()` с `kind: "seed"` (или новый подтип `field.seed()`) —
рендерить поле ввода + кнопку «Random» вместо range slider.

Решение: новый вид `field.seed()` (наследует от number, но рендерится иначе).
Или проще: опциональное поле `variant?: "seed"` в `NumberSpec` — тогда
`RangeControl` покажет input + кнопку.

Решение: **`variant: "seed"` в `NumberSpec`** — меньше новых типов.

Файлы:

- `web/src/lib/registry-schema.ts` — `NumberSpec.variant?: "seed"`
- `web/src/lib/components/fields/schema/RangeControl.svelte` — условный рендер
- `web/src/lib/registry/filters.ts` — `randomizePixels`, `addNoise`: поле seed →
  `{ ...field.number(...), spec: { ...spec, variant: "seed" } }` (или
  пересоздать через `field.seed()`)

---

## 2. Волна B — select → buttons (по файлам)

Каждый шаг — один коммит, < 500 строк. Меняем `field.select()` →
`field.buttons()` в перечисленных ниже схемах.

### B1. geometry.ts

| Инструмент              | Поле     | Опции                                     |
| ----------------------- | -------- | ----------------------------------------- |
| rotate-png              | angle    | 90° / 180° / 270°                         |
| flip-png                | axis     | horizontal / vertical                     |
| swap-orientation-png    | target   | portrait / landscape                      |
| symmetric-copy-png      | axis     | vertical / horizontal                     |
| symmetric-copy-png      | keepSide | left / right / top / bottom               |
| change-aspect-ratio-png | ratio    | 1:1 / 4:3 / 3:4 / 3:2 / 2:3 / 16:9 / 9:16 |
| change-aspect-ratio-png | mode     | crop / pad                                |

**Исключение:** `change-canvas-size-png` (anchor, 9 опций) — оставить
`field.select()`, т.к. 9 кнопок в ряд не поместятся. Аналогично `position9` (уже
отдельный компонент `PositionControl`).

### B2. color.ts

| Инструмент               | Поле      | Опции                                |
| ------------------------ | --------- | ------------------------------------ |
| dithering-png            | pattern   | floyd-steinberg / bayer              |
| extract-channel-png      | channel   | red / green / blue                   |
| swap-channels-png        | pair      | r-g / r-b / g-b                      |
| decrease-color-count-png | maxColors | 2 / 4 / 8 / 16 / 32 / 64 / 128 / 256 |

**Исключение:** channel spaces (hsl/hsv/... component) — 3-6 опций, но это
динамические инструменты, оставить `select`.

### B3. analyze.ts

| Инструмент                | Поле | Опции              |
| ------------------------- | ---- | ------------------ |
| show-transparent-png      | mode | binary / highlight |
| show-grayscale-pixels-png | mode | (тот же)           |
| show-color-pixels-png     | mode | (тот же)           |
| light-pixel-mask-png      | mode | (тот же)           |
| dark-pixel-mask-png       | mode | (тот же)           |

Все используют общий `maskBaseFields` — правка в одном месте.

### B4. filters.ts

| Инструмент    | Поле | Опции        |
| ------------- | ---- | ------------ |
| add-noise-png | mode | mono / color |

### B5. generate.ts

| Инструмент         | Поле         | Опции                 |
| ------------------ | ------------ | --------------------- |
| color-spectrum-png | direction    | horizontal / vertical |
| step-colors-png    | layout       | grid / strip          |
| complementary-png  | layout       | grid / strip          |
| triadic-png        | layout       | grid / strip          |
| tetradic-png       | layout       | grid / strip          |
| analogous-png      | layout       | grid / strip          |
| monochromatic-png  | layout       | grid / strip          |
| shades-png         | layout       | grid / strip          |
| sort-colors-png    | layout       | grid / strip          |
| mix-colors-png     | (нет select) | —                     |

---

## 3. Волна C — обязательные фиксы (баги + дефолты)

### C1. Source-aware defaults для dimension-полей

Source-aware defaults реализованы: общий resolver в `registry-schema`
(`applySourceDefaults`). Для `resize-png` и `crop-png` дефолт после загрузки
равен размерам текущего source; до загрузки используется положительный fallback
`1×1`. Один-sided `0` у resize сохраняет режим auto.

### C2. symmetric-copy-png: "keep side" не работает

Баг в `run()`: `keepSide` не учитывает `axis`. При `axis: "vertical"` (удвоение
ширины) работают только `left`/`right`, `top`/`bottom` не имеют смысла. Нужно:
либо фильтровать опции `keepSide` в зависимости от `axis` (reactive schema),
либо нормализовать в `run()`.

**Решение:** reactive — при смене `axis` сбрасывать `keepSide` на допустимое
значение. Пока достаточно в `run()`: если `axis === "vertical"` и `keepSide` ∈
{top, bottom} → заменить на `left`.

### C3. Source-aware bounds (отдельный следующий шаг)

Реализованы только defaults dimension-полей через `SchemaContext` и
`applySourceDefaults`. Динамические min/max для crop x/y, shift и resize
остаются отдельной задачей: bounds не следует смешивать с default resolver.

**Что нужно спроектировать и завести:**

1. **Где берём размер.** `SchemaToolView` уже знает размер после `decodeFile()`
   → `PixelImage` (width/height); для bounds понадобится передать этот context в
   `SchemaFields` и контролы.

2. **Как схеме описать зависимость.** В спеках добавить ссылку на размер
   источника вместо жёстких чисел. Кандидат:

   ```ts
   x: field.slider({
     label: "fields.x",
     bound: "sourceWidth",   // min/max = ±sourceWidth
     default: 0,
   }),
   ```

   `BoundSpec = "sourceWidth" | "sourceHeight" | "minSide" | "maxSide"`,
   применимо к `NumberSpec`, `SliderSpec`, `OffsetSpec`, `DimensionSpec`.

3. **Что делает RangeControl.** При `bound` вычисляет min/max из текущего
   размера источника; при смене картинки диапазон пересчитывается, текущее
   значение пере-клампится.

4. **Первые потребители:** crop (x/y → ±sourceWidth/sourceHeight), shift
   (offsetX/offsetY), resize (max → maxSide).

Это отдельный рефакторинг; source-aware defaults не заменяют bounds.

### C4. verify-is-png: неверное название

Проверяет текст, не PNG-файл. Переименовать:

- `id` → `verify-is-png-data` (или оставить для обратной совместимости)
- `title` → "Verify PNG data"
- `description` → уточнить

**Решение:** поменять title и description, id не трогать (url-dependent).

---

## 4. Волна D — обязательные фиксы (новые параметры)

### D1. remove-alpha-channel-png: выбор цвета фона

Сейчас захардкожен `#ffffff`. Добавить `field.color({ default: "#ffffff" })`.

Файл: `alpha.ts`, схема `removeAlphaChannelSchema`.

### D2. extract-alpha-mask-png: галочка «инвертировать»

Добавить `field.checkbox({ label: "fields.invertMask", default: false })`. В
`run()`: если `invert`, вызвать `invertAlpha()` после `extractAlphaMask()`.

Файл: `alpha.ts`.

### D3. change-canvas-size-png: position9 вместо select

`anchor` сейчас `field.select()` с 9 опциями → `field.position9()`.

Файл: `geometry.ts`. Уже есть `PositionControl`.

### D4. Generators: добавить height

Инструменты без `size`/`height`:

- blend-two-png — добавить
  `height: field.slider({ min: 1, max: 1024, default: 512 })`
- step-colors-png — аналогично
- complementary, triadic, tetradic, analogous, monochromatic, shades,
  sort-colors — все используют `paletteBaseSchema` (общий объект), добавить
  `height` туда
- mix-colors-png — добавить height

Файл: `generate.ts`.

### D5. add-border-png: прозрачность цвета

Текущий `field.color()` не поддерживает alpha. Пока что: оставить как есть
(прозрачность не поддерживается нативным color picker). Отметить в аудите как
blocked.

---

## 5. Волна E — полировка (некритично)

### E1. Плейсхолдер "нет параметров"

Инструменты с пустой схемой (`EmptyParams`) выглядят странно. Добавить
`EmptyState` или подсказку "No parameters — click Run".

Файл: `SchemaToolView.svelte` — показать подсказку если `schema.fields` пуст.

### E2. quantize-png: пресеты

`field.slider` с max 64 → добавить пресеты (8, 16, 32, 64) как кнопки под
слайдером. Либо `field.buttons()` с 4 опциями вместо слайдера.

### E3. trim-empty-space-png: 0-254 → проценты

Текущий `min: 0, max: 254` — нестандартно. Добавить переключатель px/% (аналог
шага A1 — `variant: "alpha-threshold"` в NumberSpec).

### E4. add-text-png: plate offset

Plate снизу имеет большой отступ — добавить галочку "compact plate" или
уменьшить дефолтный padding.

### E5. emoji-to-png: выбор эмодзи

Поле `text` → добавить группу часто используемых эмодзи как кнопки- пресеты над
полем ввода.

---

## 6. Верификация

После каждой волны:

1. `pnpm --dir web build` — без ошибок
2. `pnpm --dir web exec svelte-check --tsconfig ./tsconfig.json` — без ошибок
3. `pnpm --dir web lint` — без ошибок (кроме ожидаемых долгов)
4. Ручная проверка в браузере: параметры рендерятся, инструменты работают

---

## 7. Не покрыто / требует решения

Эти пункты из аудита не попали в волны A–E. Требуют либо дополнительного
исследования, либо нормативного решения, либо отложены.

### 7.1 Требуют normative решения

- **Pixel ↔ Percent** (circle-mask, square-mask, star-mask, wavy-mask — %→px,
  round-corners — px→%): нужен компонент переключателя единиц в слайдере.
  Отложен до волны E, т.к. требует правки `RangeControl` + всех схем.
- **Smoothing checkbox** для масок (circle, square, star, wavy, round-corners,
  invert-alpha): нужен `field.checkbox("smoothing")` + правка core (shapes.ts,
  alpha). Отложен — требует визуального тестирования.
- **Vignette**: выбор центра + цвет + feather — 3 новых параметра. Требует
  normative решения по UI.
- **Remove-background**: выбор точки удаления — либо параметр, либо отдельный
  инструмент.
- **Precision/quality**: select в resize (bilinear/bicubic/nearest) — нужен ли
  выбор алгоритма?
- **Placeholders**: "нет параметров" — какой текст/компонент показывать.

### 7.2 Операционные (тест-кейсы, описания)

- find-contour-png: расширять на толщину линии (требует правки core)
- make-thicker-png: расширять картинку на толщину линии
- make-thinner-png: уменьшать от краев, fix выступа
- feather-edges-png: расширять картинку на толщину линии
- clean-edges-png: найти тест-кейс, возможно увеличить максимум
- despeckle-alpha-png: найти более заметный тест-кейс
- close-holes-png: проверить поведение на больших полупрозрачных областях
- auto-contrast-png: найти тестовый кейс
- sharpen-png: добавить тест-кейс
- center-by-alpha-png: найти тест-кейс
- png-is-grayscale: улучшить видимость результата

### 7.3 Дизайн-вопросы

- add-padding-png vs add-border-png: разница неочевидна, нужен review
- change-aspect-ratio-png: не видно что меняется — рамка результата
- watermark-tile-png: заполняет не полностью
- sepia-png: нужна ли настройка силы эффекта?
- posterize-png: настройка для каждого канала отдельно?
- pixelate-png: разные алгоритмы?
- swap-channels-png: обдумать flow через более простые инструменты

### 7.4 Аудит полей (компоненты)

- Range slider: поле ввода + кнопки +/- + кнопка сброса
- Color picker: пипетка с картинки, прозрачность
- Width/height с keep-aspect-ratio: единый компонент
- Position offset: отдельные слайдеры x/y (уже сделано в `OffsetControl`)
