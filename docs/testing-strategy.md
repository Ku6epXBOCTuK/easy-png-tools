# Стратегия e2e-тестирования

> Статус: **active**. Канонические правила для `web/e2e/`; продуктовые решения и
> известные баги остаются в `docs/backlog.md` и
> `docs/checklist-manual-testing.md`.

## 1. Что проверяем

E2E проверяет пользовательский контракт production UI: открытие маршрута,
доступность элемента, загрузку или ввод данных, появление результата, ошибку,
скачивание и переключение локали. Внутренняя реализация, порядок карточек,
CSS-классы и конкретный формат временного URL не являются контрактом.

Точные переводы проверяются в unit-тестах i18n. В e2e проверяется поведение и
отдельный RU/EN smoke, а не полный локализованный текст каждого verdict.

## 2. Приоритет locator-ов

1. `getByRole()` с доступным именем и `getByLabel()`.
2. Стабильные `href` или `id`, если семантического API нет.
3. Разрешённые `data-testid` только для визуальных границ, которые нельзя
   надёжно назвать через accessibility API:
   - `source-image`;
   - `result-image`;
   - `result-verdict`;
   - `empty-state`.
4. `input[type="file"]` и download-button допускаются только внутри
   `web/e2e/helpers/page.ts`.

Нельзя добавлять `data-testid` для счётчиков, групп, metadata, verdict текста,
кнопок темы или переключателя языка без отдельного обоснования.

## 3. Запрещённые зависимости

В e2e не фиксируются:

- абсолютные `TOTAL`, `GROUPS` и другие snapshot-числа каталога;
- точное число fuzzy-search результатов или порядок карточек;
- внутренние CSS-классы и HTML-структура, если есть role/label/href;
- `alt` как способ найти результат или источник;
- полные локализованные предложения и длинные тире в ожиданиях;
- локализованные имена контролов в общих сценариях без явной установки `en`.

Поведенческий тест может проверять, что известный инструмент видим или скрыт,
ошибка имеет текст и не является сырым i18n-ключом, результат доступен для
скачивания. Это не требует повторять словарь в e2e.

## 4. Локаль и fixtures

Обычные сценарии запускаются с `en` через `useEnglish()` или `openTool()`. RU/EN
проверяется отдельным `i18n.spec.ts`; после смены локали locator не должен
зависеть от старого accessible name.

Изображения создаются воспроизводимыми helpers в `web/e2e/helpers/fixtures.ts`.
Тесты не добавляют большие бинарные файлы и не зависят от локальных
пользовательских файлов. Runtime-fixtures для malformed/special PNG проверяют
browser-контракт: critical CRC и truncated отклоняются движком, ancillary CRC и
хвост после `IEND` допускаются, palette/16-bit декодируются. Отказ декодера —
свойство движка, поэтому ожидание задаётся per-engine в
`web/e2e/png-fixtures.spec.ts`, а не через skip. Общее требование для всех
движков: битый файл не роняет страницу, отказ показывается alert-ом, а успешный
декод даёт результат без ошибки. `toPass()` допускается только для ограниченного
ожидания hydration или асинхронного результата; он не должен превращать проверку
продукта в бесконечный retry.

Чистая логика схемы, layout и preview-модели (defaults, sanitization,
`resolveLayoutGroups`, `buildSchemaPreviewModel`) проверяется в
`src/**/*.test.ts`; DOM, hydration и пользовательские потоки — в Playwright.
Component-тесты не дублируют e2e-контракт.

## 5. Helpers и `test.fixme`

`web/e2e/helpers/page.ts` владеет общими операциями `openTool`, `uploadImage`,
`renderText`, `resultImage`, `sourceImage`, `verdictStatus`, `textResult`,
`errorAlert`, `emptyState`, `rangeInput`, `downloadResult`, `downloadResultFile`
и `downloadResultBytes`. Специфика должна вызывать эти helpers, а не повторять
raw-селекторы. Harness выбирается по контракту: image — upload + `resultImage`,
text — `renderText` + результат, generator — auto-run без upload, verdict —
`verdictStatus`, files — отдельный ZIP-сценарий.

`test.fixme` допускается только для зарегистрированной проблемы в backlog или
checklist. В комментарии указывается ссылка на неё. После исправления тест и
ссылка обновляются вместе; в текущем Q6e baseline активных fixme нет.

Если тест сравнивает два состояния одного элемента, он ждёт изменения значения
(`not.toHaveText`, `not.toHaveAttribute`), а не его видимости. Пересчёт идёт
через debounce, поэтому `toBeVisible()` после второго ввода проходит на старом
значении. Такой тест флакает по таймингу и обычно ловится на CI, а не локально.

## 6. Проверки

Для изменений e2e выполняются:

```text
pnpm --dir web check
pnpm --dir web test:rules
pnpm --dir web lint:all
pnpm --dir web exec prettier --check .
pnpm check:docs
pnpm --dir web test:e2e
pnpm verify
```

`verify` не включает Playwright: E2E остаётся отдельным тяжёлым gate. В CI
non-blocking E2E не считается заменой локальному smoke; перед ревью фиксируются
число passed, skipped и известные fixme.

## 7. Browser matrix

`web/playwright.config.ts` запускает четыре проекта:

| Проект            | Движок   | Спецификации                                                           |
| ----------------- | -------- | ---------------------------------------------------------------------- |
| `chromium`        | Chromium | все e2e                                                                |
| `firefox`         | Firefox  | `pipeline`, `png-fixtures`, `text-and-verdicts`                        |
| `webkit`          | WebKit   | `pipeline`, `png-fixtures`, `text-and-verdicts`                        |
| `mobile-chromium` | Chromium | `navigation`, `catalog`, `generators`, `pipeline`, 390×844, `hasTouch` |

- Новые engine-специфичные фичи сначала добавляются в `chromium`, потом
  решается, попадает ли spec в `browserContractTests`.
- Расхождения декодеров не ужесточаются и не скрываются skip-ом: они описаны в
  тесте как ожидаемое поведение движка.

  | Fixture                              | Отклоняют                 |
  | ------------------------------------ | ------------------------- |
  | `crc-bad-idat.png`                   | Chromium, Firefox         |
  | `truncated-header.png`               | Chromium, Firefox, WebKit |
  | `truncated-no-iend.png`              | Chromium                  |
  | `idat-cut.png`                       | Chromium                  |
  | ancillary CRC, tail, palette, 16-bit | ни один движок            |

- Firefox и WebKit работают с теми же таймаутами, что и Chromium: движок не
  причина расхождений, поэтому per-project `expect.timeout` не задаётся.
- `workers` — 1 локально и 2 в CI. Playwright не умеет per-project лимит
  воркеров, а browser matrix ограничена памятью, а не CPU: при высокой
  параллельности браузеры на машине с 16 GB RAM не успевают поднять worker, и
  тесты падают без ошибок. Локальный matrix поэтому медленный, но не нагружает
  компьютер.
- Локальный baseline: 276 тестов, 276 passed, 0 skipped, 0 failed.
- Visual snapshots и coverage thresholds не часть matrix; они вынесены в
  `docs/plan-codebase-quality.md` (Q6f.4).
