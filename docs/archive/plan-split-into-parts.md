# План: инструмент «Разрезать PNG на части» (split-into-parts-png)

> Статус: **выполнено и в архиве** (2026-09). Инструмент и механизм «результат =
> набор файлов» (1 → many) реализованы; первый потребитель — `split-into-parts-png`.
> Общий процесс таких инструментов — задача 18 в `docs/backlog.md`.

## Цель

Пользователь загружает одну картинку, выбирает число столбцов и строк, картинка
разрезается на равномерные части. Результат — набор PNG-файлов, скачивается
ZIP-архивом.

## Решения

- **Неравномерное деление:** канвас дополняется прозрачным до кратного размера
  (`pieceW = ceil(w / cols)`, `newW = pieceW * cols`), все части строго равные,
  картинка покрывается целиком.
- **Дефолт схемы:** 2 × 2.
- **Zip-библиотека:** `fflate` (zero deps, малый размер), скачивание из UI-слоя
  (`encode()` требует DOM).
- **Результат инструмента:** `result: "files"` — терминальный тип, в пайплайн
  (следующий шаг) не передаётся.

## Шаги

1. **Зависимость:** `fflate` в `web/package.json`.
2. **`registry/types.ts`:** `RESULT_KINDS.files`, тип `ToolImageFile`,
   `FileResult`, расширение `ToolResult = PixelImage | string | FileResult`.
3. **`core/geometry.ts`:** `splitToParts(img, columns, rows)` — padding + сетка
   через `crop`.
4. **`web/src/lib/zip.ts` (новый):** `downloadZip(files, zipName)` через
   `zipSync`.
5. **`core/errors.ts`:** ключ `errors.tooManyParts` (страховочный лимит
   cols·rows ≤ 1000; при максимуме 6×6 недостижим).
6. **`registry/geometry.ts`:** схема (`columns`, `rows`, дефолт 2×2, min 1, max
   6 — максимум 36 частей) + entry `split-into-parts-png` в `geometryEntries`.
7. **Executor:** сериализация/десериализация `FileResult` в `executor.worker.ts`
   и тип ветки в `executor.ts`.
8. **UI:** `SchemaToolView.svelte` (`fileResult`, Download → zip),
   `SchemaPreview.svelte` (canDownload для files), `SchemaResultTile.svelte`
   (сетка-превью частей, мета «N parts / ZIP»).
9. **i18n:** переводы в `ru.ts`/`en.ts` **не добавляем** — словари `tools`
   привязаны к v1-реестру (тест «нет лишних ключей»), а preview берёт заголовки
   из registry (EN). Перевод придёт вместе с беклог-задачей «i18n в preview».
   Поиск по id/заголовку работает из registry.
10. **Тесты:** юнит `splitToParts`, registry (result: "files"), i18n coverage.
11. **Docs:** `docs/backlog.md` (задача «процесс 1 → many и many → 1», отметить
    пункт 11 «Мультифайловый вывод»), `docs/tools-map.md` (перенос из идей).

## Файлы

| Файл                                             | Изменение                                                         |
| ------------------------------------------------ | ----------------------------------------------------------------- |
| `web/package.json`                               | `+ fflate` (dependencies)                                         |
| `web/src/lib/registry/types.ts`                  | `RESULT_KINDS.files`, `ToolImageFile`, `FileResult`, `ToolResult` |
| `web/src/lib/core/geometry.ts`                   | `splitToParts()`                                                  |
| `web/src/lib/zip.ts`                             | **новый** — `downloadZip()`                                       |
| `web/src/lib/core/errors.ts`                     | `errors.tooManyParts`                                             |
| `web/src/lib/registry/geometry.ts`               | schema + `splitPartsTool`                                         |
| `web/src/lib/executor/executor.worker.ts`        | ветка `FileResult`                                                |
| `web/src/lib/executor/executor.ts`               | тип ветки `FileResult`                                            |
| `web/src/lib/components/SchemaToolView.svelte`   | `fileResult`, download → zip                                      |
| `web/src/lib/components/SchemaPreview.svelte`    | props `fileResult`, `canDownload`                                 |
| `web/src/lib/components/SchemaResultTile.svelte` | сетка частей, «N parts»                                           |
| `web/src/lib/i18n/ru.ts`, `en.ts`                | записи инструмента                                                |

## Нейминг файлов в ZIP

`part-<row>-<col>.png` (row, col нумеруются с 1, при 2×2 — `part-1-1.png`).

## Верификация

```bash
pnpm --dir web exec svelte-check --tsconfig ./tsconfig.json
pnpm --dir web test
pnpm --dir web lint
```

Ручная проверка: PNG не кратного размера (например 101×77), 3×2 → 6 частей
одинакового размера, скачивается ZIP; на кратном размере (100×80, 3×2) padding
= 0.
