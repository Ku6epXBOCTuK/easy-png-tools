# План: единый `run(ctx)` в registry-new (унификация 5 режимов исполнения)

> **СТАТУС: ВЫПОЛНЕН (2026-09-10) — устарел.** Убивал пару багов-классов
> «инструмент с generate показывает загрузку и не выдаёт результат»
> (linear-gradient-png и все генераторы): причина — `input` не задан, диспетч по
> факту наличия методов.

## Исходная проблема

Два бага у `linear-gradient-png` (и у всех генераторов):

1. Показывается загрузка изображения — `SchemaToolView.svelte` считает
   `inputMode = tool.input ?? "file"`, а `tool.input` у генераторов не задан.
2. Результата нет — `SchemaActions` рендерит кнопку «Generate» только при
   `inputMode === "none"`, а он всегда `"file"`. Ui-контур «догадывается» о
   генераторе по эвристике `Boolean(tool.generate && !tool.run)`.

Корневая причина архитектурная: у инструмента 5 режимов исполнения (`run` 79
шт., `generate` 21, `runFromText` 6, `toText` 9, `textToText` 1), и диспетч
«какой метод вызывать» размазан между UI и executor. Способ исполнения
(worker/поток, было `domOnly`) просочился в метод-диспетч. Договорились:
**свести всё к одному методу `run(ctx)`**, а требование входа (`input`) — к
обязательному полю. `domOnly` остаётся только executor-хинтом (уйдёт при
переезде на WASM-ядро).

## Целевой контракт

```ts
export type InputMode = "image" | "text" | "none"; // было "file"
export type ResultKind = "image" | "text" | "verdict";

export interface ToolContext<P> {
  params: P;
  source?: PixelImage; // присутствует ⇔ input === "image"
  text?: string; // присутствует ⇔ input === "text"
}

export type ToolResult = PixelImage | string;

export type ToolEntry<P = Record<string, unknown>> = {
  id: string;
  title: string;
  description: string;
  category: CategoryId;
  schema: ToolSchema<P>;
  input: InputMode; // ОБЯЗАТЕЛЬНОЕ, дефолта нет
  result?: ResultKind; // default "image"
  run(ctx: ToolContext<P>): Promise<ToolResult> | ToolResult;
  output?: OutputFormat;
  icon?: string;
  domOnly?: boolean; // executor-хинт, уйдёт с WASM
};
```

Удаляем: `generate`, `runFromText`, `toText`, `textToText`. Хелперы контракта
(бросают `ToolError`): `requireSource(ctx)`, `requireText(ctx)`. Обёртки для
миграции тел 1:1: `imgTool((img, p) => …)`, `genTool((p) => …)`,
`textGen((t, p) => …)`.

```ts
const imgTool =
  <P>(fn: (img: PixelImage, p: P) => ToolResult) =>
  (ctx: ToolContext<P>) =>
    fn(requireSource(ctx), ctx.params);
const genTool =
  <P>(fn: (p: P) => ToolResult) =>
  (ctx: ToolContext<P>) =>
    fn(ctx.params);
const textGen =
  <P>(fn: (t: string, p: P) => ToolResult) =>
  (ctx: ToolContext<P>) =>
    fn(requireText(ctx), ctx.params);
```

## Executor (единый)

```ts
export async function execute(
  tool: ToolEntry,
  ctx: { params: Record<string, unknown>; source?: PixelImage; text?: string },
): Promise<ToolResult> {
  const params = sanitizeSchemaParams(tool.schema, ctx.params);
  if (tool.input === "image" && !ctx.source)
    throw new ToolError("errors.sourceRequired");
  if (tool.input === "text" && !ctx.text?.trim())
    throw new ToolError("errors.textRequired");
  return route(tool, { params, source: ctx.source, text: ctx.text });
}
```

`route()` — единственное место выбора места исполнения: `domOnly` или нет Worker
→ прямой вызов `tool.run(ctx)`, иначе worker с fallback (логика
`ensureWorker/runInWorker/disableWorker` остаётся). Worker-протокол —
`{ id, toolId, params, source?, text? }`.

## Шаги (ревью после каждого)

Все 11 шагов выполнены; гейт пройден: `svelte-check` → 0 errors,
`pnpm --dir web lint` → чисто, `pnpm --dir web test` → 618/618 зелёный. E2E не
делали.

| #   | Шаг             | Файлы                                                                                                  | Что                                                                                                                                     |
| --- | --------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Типы            | `registry-new/types.ts`                                                                                | новый `ToolEntry`/`ToolContext`/`ToolResult`/`InputMode "image"`, хелперы `requireSource`/`requireText` + `imgTool`/`genTool`/`textGen` |
| 2   | Executor+Worker | `preview/executor/executor.ts`, `executor.worker.ts`, `index.ts`                                       | единый `execute`, `route` по `domOnly`, протокол `source?`/`text?`                                                                      |
| 3   | UI kit          | `kit/SchemaToolView.svelte`, `SchemaPreview.svelte`, `SchemaActions.svelte`, `SchemaSourceTile.svelte` | одна `run()`, без `isGenerator`-эвристики, `inputMode` → `"image"`                                                                      |
| 4   | Генераторы      | `registry-new/generate.ts`                                                                             | 21 `generate(p)` → `run(ctx)` + `input: "none"` (чинит градиент и др.)                                                                  |
| 5   | Текст           | `registry-new/convert.ts`, `analyze.ts`                                                                | `runFromText`/`toText`/`textToText` → `run`; `input: "image"` на run-инструментах                                                       |
| 6   | Текст           | `registry-new/text.ts`                                                                                 | domOnly run-инструменты → `run(ctx)` + `input: "image"`                                                                                 |
| 7   | Геометрия       | `registry-new/geometry.ts`                                                                             | run → `run(ctx)` + `input: "image"`                                                                                                     |
| 8   | Альфа/цвет      | `registry-new/alpha.ts`, `color.ts`                                                                    | run → `run(ctx)` + `input: "image"`                                                                                                     |
| 9   | Фильтры         | `registry-new/filters.ts`                                                                              | run → `run(ctx)` + `input: "image"`                                                                                                     |
| 10  | Тесты           | `registry-new/registry-new.test.ts`                                                                    | `generate!`/`run!` → `run(ctx)`; guard-тест: `input` всегда задан, image-инструменты работают с источником, `none` — без                |
| 11  | Гейт            | —                                                                                                      | `svelte-check` → 0 errors, `pnpm --dir web lint` → чисто, `pnpm --dir web test` → 618/618                                               |

Примечание шага 8: поля `preview:` (маска у remove-color/remove-background)
удалены — новый executor зовёт `run()` напрямую; идея вернуть отображение маски
— в `docs/backlog.md` №17. Prettier-варнинги `prettier --check` по
SchemaToolView.svelte и executor-файлам — предсуществующий долг.

По миграции: `input: "image"` добавлен всем run-инструментам (~80 шт.),
`input: "text"` стоит у 7 text-инструментов, `input: "none"` — у 21 генератора.

## Известные последствия

- **Красная сборка с шага 1 до конца шага 10** — осознанное решение, ревью идёт
  по diff'у шагов.
- Старый контур (`registry/**` + `lib/tools/executor.ts` + `ToolPage.svelte`,
  `sourceMode`) НЕ трогаем — он на удаление (C19).
- `input: "file"` переименован в `input: "image"` — семантика «нужно именно
  изображение», а не «файл» (между инструментами может передаваться не файлом).
