# План: исправления по аудиту UX/UI

> Статус: **draft** — на ревью.
>
> Находки — `docs/tools-audit.md` (что плохо, с датой прохода). Этот документ
> задаёт **порядок правок** полей и раскладки волнами; сами задачи — в
> `docs/backlog.md`. Проверки и гейты — `docs/quality-gates.md`; точки касания
> при добавлении вида поля — `docs/architecture.md`, раздел 4.
>
> **Идентификаторы шагов — `FA-*` (fields-audit).** Буквы `C*`/`Q*` в других
> документах относятся к архивным волнам редизайна и здесь не используются.
>
> **Как читать волны.** Шаг с пометкой «реализовано» — закрытый, его правку
> можно не повторять; шаг без пометки — работа. Пометка стоит в первом абзаце
> шага, а не в заголовке, чтобы не потерять её при чтении оглавления. Задачи,
> которые в бэклоге, здесь не дублируются: этот документ задаёт **порядок**,
> backlog — **учёт** (`docs/backlog.md`).
>
> **В этом документе инструменты названы по `id`** (`registry/tools/`), а не по
> адресу страницы: поля и раскладка принадлежат схеме инструмента, а страница
> только ссылается на список шагов (`Page.steps`), где сейчас ровно один
> инструмент, а в будущем может быть несколько. Поэтому «у страницы `crop-png`
> есть поля x/y» неверно — поля есть у инструмента `crop`, а страница лишь
> показывает его. `id` не несёт png-интента: страница `crop-png` вызывает
> `id: "crop"`, страница `png-to-hsl` — `id: "to-hsl"` (модель —
> `docs/architecture.md`, раздел 3).
>
> **Как переносить пункты аудита.** `docs/tools-audit.md` назван по страницам,
> потому что это то, что видит пользователь. При переносе пункта в шаг мапить
> slug → `id` через `page.steps[0].id` в `registry/pages/`. Названия аудита вида
> `color-wheel-generator` и `webp-to-png` в реестре отсутствуют (реальная
> страница — `color-wheel-png`, инструмент — `color-wheel`).

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

### FA-A1. Новый тип `buttons` в схеме

Файлы:

- `web/src/lib/registry-schema.ts` — `ButtonsSpec`, фабрика `field.buttons()`,
  кейс в `sanitizeSchemaParams`, кейс в `defaultSchemaParams`
- `web/src/lib/components/fields/schema/ButtonsControl.svelte` — новый компонент
- `web/src/lib/components/SchemaFields.svelte` — импорт + запись в `FIELDS`

### FA-A2. Seed → input + randomize

Для `field.number()` с `kind: "seed"` (или новый подтип `field.seed()`) —
рендерить поле ввода + кнопку «Random» вместо range slider.

Решение: новый вид `field.seed()` (наследует от number, но рендерится иначе).
Или проще: опциональное поле `variant?: "seed"` в `NumberSpec` — тогда
`RangeControl` покажет input + кнопку.

Решение: **`variant: "seed"` в `NumberSpec`** — меньше новых типов.

Файлы:

- `web/src/lib/registry-schema.ts` — `NumberSpec.variant?: "seed"`
- `web/src/lib/components/fields/schema/RangeControl.svelte` — условный рендер
- `web/src/lib/registry/tools/filters.ts` — `randomizePixels`, `addNoiseTool`:
  поле seed → `{ ...field.number(...), spec: { ...spec, variant: "seed" } }`
  (или пересоздать через `field.seed()`)

---

## 2. Волна B — select → buttons (по файлам)

Каждый шаг — один коммит, < 500 строк. Меняем `field.select()` →
`field.buttons()` в перечисленных ниже схемах.

### FA-B1. geometry.ts

| Инструмент          | Поле     | Опции                                     |
| ------------------- | -------- | ----------------------------------------- |
| rotate              | angle    | 90° / 180° / 270°                         |
| flip                | axis     | horizontal / vertical                     |
| swap-orientation    | target   | portrait / landscape                      |
| symmetric-copy      | axis     | vertical / horizontal                     |
| symmetric-copy      | keepSide | left / right / top / bottom               |
| change-aspect-ratio | ratio    | 1:1 / 4:3 / 3:4 / 3:2 / 2:3 / 16:9 / 9:16 |
| change-aspect-ratio | mode     | crop / pad                                |

**Исключение:** `change-canvas-size` (anchor, 9 опций) — оставить
`field.select()`, т.к. 9 кнопок в ряд не поместятся. Аналогично `position9` (уже
отдельный компонент `PositionControl`).

### FA-B2. color.ts

| Инструмент           | Поле      | Опции                                                |
| -------------------- | --------- | ---------------------------------------------------- |
| dithering            | pattern   | floyd-steinberg / bayer                              |
| extract-channel      | channel   | red / green / blue                                   |
| swap-channels        | pair      | r-g / r-b / g-b                                      |
| decrease-color-count | maxColors | 2 / 4 / 8 / 16 / 32 / 44 / 64 / 96 / 128 / 192 / 256 |

**Исключение:** инструменты разложения каналов (`to-hsl`, `to-hsv`, `to-hsi`,
`to-cmyk`, `to-ycbcr`, `to-lab`, поле `component`) — 3-6 опций, но это
динамические инструменты, оставить `select`.

### FA-B3. analyze.ts

| Инструмент            | Поле | Опции              |
| --------------------- | ---- | ------------------ |
| show-transparent      | mode | binary / highlight |
| show-grayscale-pixels | mode | (тот же)           |
| show-color-pixels     | mode | (тот же)           |
| light-pixel-mask      | mode | (тот же)           |
| dark-pixel-mask       | mode | (тот же)           |
| unique-color-mask     | mode | (тот же)           |

Пять инструментов из шести берут `mode` из общего `maskBaseFields` — правка в
одном месте. Исключение — `show-transparent`: он переопределяет `mode` своими
опциями и дефолтом `highlight`, поэтому его `mode` правится отдельно.

### FA-B4. filters.ts

| Инструмент | Поле | Опции        |
| ---------- | ---- | ------------ |
| add-noise  | mode | mono / color |

### FA-B5. generate.ts

| Инструмент     | Поле         | Опции                 |
| -------------- | ------------ | --------------------- |
| color-spectrum | direction    | horizontal / vertical |
| step-colors    | layout       | grid / strip          |
| complementary  | layout       | grid / strip          |
| triadic        | layout       | grid / strip          |
| tetradic       | layout       | grid / strip          |
| analogous      | layout       | grid / strip          |
| monochromatic  | layout       | grid / strip          |
| shades         | layout       | grid / strip          |
| sort-colors    | layout       | grid / strip          |
| mix-colors     | (нет select) | —                     |

---

## 3. Волна C — обязательные фиксы (баги + дефолты)

### FA-C1. Source-aware defaults для dimension-полей — реализовано

Source-aware defaults реализованы: общий resolver в `registry-schema`
(`applySourceDefaults`). Для `resize` и `crop` дефолт после загрузки равен
размерам текущего source; до загрузки используется положительный fallback `1×1`.
Один-sided `0` у resize сохраняет режим auto. Проверено тестом
`registry.test.ts` («resize и crop получают размеры текущего source»).

### FA-C2. symmetric-copy: "keep side" не работает

Баг в `run()`: `keepSide` не учитывает `axis`. При `axis: "vertical"` (удвоение
ширины) работают только `left`/`right`, `top`/`bottom` не имеют смысла. Нужно:
либо фильтровать опции `keepSide` в зависимости от `axis` (reactive schema),
либо нормализовать в `run()`.

**Решение:** reactive — при смене `axis` сбрасывать `keepSide` на допустимое
значение. Пока достаточно в `run()`: если `axis === "vertical"` и `keepSide` ∈
{top, bottom} → заменить на `left`.

### FA-C3. Source-aware bounds (отдельный следующий шаг) — не начат

Source-aware **defaults** реализованы через `SchemaContext` и
`applySourceDefaults`. Динамические min/max для crop x/y, shift и resize не
реализованы и остаются отдельной задачей: bounds не следует смешивать с default
resolver.

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

### FA-C4. verify-is-png: неверное название — решение принято, шаг не выполнен

Находка про **страницу**, а не про инструмент: страница `verify-is-png` обещает
проверку PNG-файла, а проверяет текст (base64 / data-uri). Сам инструмент назван
честно — `id: "verify-png"`, png-интент в нём означает входные данные. Адрес
страницы — `slug` `verify-is-png` (`docs/architecture.md`, раздел 3), поэтому
«неверное название» относится к `slug`, а не к `id`.

Варианты:

- `title` → «Verify PNG data», `description` → уточнить; `slug` и `id` не
  трогать
- либо переименовать `slug` → `verify-png-data` с редиректом со старого URL
  (нужен вордстат, иначе страница выпадает из индекса)

**Решение:** поменять title и description, имя страницы не трогать.
Переименование `slug` меняет адрес, имя файла, ключи `pages.*` и иконку, то есть
это операция с SEO-последствиями, а не строчка в реестре — она не делается в
одиночку, вместе с решением по `docs/plan-seo.md` §5.

---

## 4. Волна D — обязательные фиксы (новые параметры)

### FA-D1. remove-alpha-channel: выбор цвета фона

Сейчас захардкожен `#ffffff`. Добавить `field.color({ default: "#ffffff" })`.

Файл: `alpha.ts`, схема `removeAlphaChannelSchema`.

### FA-D2. extract-alpha-mask: галочка «инвертировать»

Добавить `field.checkbox({ label: "fields.invertMask", default: false })`. В
`run()`: если `invert`, вызвать `invertAlpha()` после `extractAlphaMask()`.

Файл: `alpha.ts`.

### FA-D3. change-canvas-size: position9 вместо select

`anchor` сейчас `field.select()` с 9 опциями → `field.position9()`.

Файл: `geometry.ts`. Уже есть `PositionControl`.

### FA-D4. Generate: добавить height

Инструменты без `size`/`height`:

- blend-two — добавить
  `height: field.slider({ min: 1, max: 1024, default: 512 })`
- step-colors — аналогично
- complementary, triadic, tetradic, analogous, monochromatic, shades — все
  используют `paletteBaseSchema` (общий объект), добавить `height` туда
- `sort-colors` — своя схема, `paletteBaseSchema` не использует, `height`
  добавлять вручную
- mix-colors — добавить height

Файл: `generate.ts`.

### FA-D5. add-border: прозрачность цвета

Текущий `field.color()` не поддерживает alpha. Пока что: оставить как есть
(прозрачность не поддерживается нативным color picker). Отметить в аудите как
blocked.

---

## 5. Волна E — полировка (некритично)

### FA-E1. Плейсхолдер "нет параметров"

Инструменты с пустой схемой (`EmptyParams`) выглядят странно. Добавить
`EmptyState` или подсказку "No parameters — click Run".

Файл: `SchemaToolView.svelte` — показать подсказку если `schema.fields` пуст.

### FA-E2. quantize: пресеты

`field.slider` с max 64 → добавить пресеты (8, 16, 32, 64) как кнопки под
слайдером. Либо `field.buttons()` с 4 опциями вместо слайдера.

### FA-E3. trim-empty-space: 0-254 → проценты

Текущий `min: 0, max: 254` — нестандартно. Добавить переключатель px/% (аналог
шага FA-A1 — `variant: "alpha-threshold"` в NumberSpec).

### FA-E4. add-text: plate offset

Plate снизу имеет большой отступ — добавить галочку "compact plate" или
уменьшить дефолтный padding.

### FA-E5. from-emoji: выбор эмодзи

Поле `emoji` → добавить группу часто используемых эмодзи как кнопки-пресеты над
полем ввода.

---

## 6. Верификация

Проверки и их минимальный набор — `docs/quality-gates.md`, раздел «Быстрые
подмножества»; правила e2e — `docs/testing-strategy.md`. Для волн с изменением
пользовательского потока (новый контрол, новая раскладка) обязателен ручной
смоук в браузере: часть находок — про воспринимаемость, которую не ловит ни один
гейт. `pnpm verify` — перед ревью волны.

---

## 7. Не покрыто / требует решения

Эти пункты из аудита не попали в волны A–E. Требуют либо дополнительного
исследования, либо нормативного решения, либо отложены.

### 7.1 Требуют normative решения

- **Pixel ↔ Percent** (circle-mask, square-mask, star-mask, wavy-mask — %→px,
  round-corners — px→%): нужен компонент переключателя единиц в слайдере.
  Требует правки `RangeControl` + всех схем — в волны A–E не входит, нужен
  отдельный этап.
- **Smoothing checkbox** для масок (circle-mask, square-mask, star-mask,
  wavy-mask, round-corners, invert-alpha): нужен `field.checkbox("smoothing")` +
  правка core (shapes.ts, alpha). Отложен — требует визуального тестирования.
- **Vignette**: выбор центра + цвет + feather — 3 новых параметра. Требует
  normative решения по UI.
- **Remove-background**: выбор точки удаления — либо параметр, либо отдельный
  инструмент.
- **Метод масштабирования в `resize`**: поля в схеме нет (только `size` и
  `keepAspect`), поэтому это уже не правка селекта, а новое поле — нужен ли
  выбор алгоритма (bilinear/bicubic/nearest)?
- **Placeholders**: "нет параметров" — какой текст/компонент показывать.

### 7.2 Операционные (тест-кейсы, описания)

- find-contour: расширять на толщину линии (требует правки core)
- make-thicker: расширять картинку на толщину линии
- make-thinner: уменьшать от краев, fix выступа
- feather-edges: расширять картинку на толщину линии
- clean-edges: найти тест-кейс, возможно увеличить максимум
- despeckle-alpha: найти более заметный тест-кейс
- close-holes: проверить поведение на больших полупрозрачных областях
- auto-contrast: найти тестовый кейс
- sharpen: добавить тест-кейс
- center-by-alpha: найти тест-кейс
- is-grayscale: улучшить видимость результата

### 7.3 Дизайн-вопросы

- add-padding vs add-border: разница неочевидна, нужен review
- change-aspect-ratio: не видно что меняется — рамка результата
- watermark-tile: заполняет не полностью
- sepia: нужна ли настройка силы эффекта?
- posterize: настройка для каждого канала отдельно?
- pixelate: разные алгоритмы?
- swap-channels: обдумать flow через более простые инструменты

### 7.4 Аудит полей (компоненты)

- Range slider: поле ввода + кнопки +/- + кнопка сброса
- Color picker: пипетка с картинки, прозрачность
- Width/height с keep-aspect-ratio: единый компонент
- Position offset: отдельные числовые поля X/Y (уже сделано в
  `fields/schema/OffsetControl.svelte`)
