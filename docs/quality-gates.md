# Quality gates

> Статус: **active**. Каноническое описание быстрых проверок: команды, coverage,
> warnings, CI. Почему гейт такой, а не иначе, — `docs/decisions.md`.

Команды выполняются из корня репозитория.

## Каноническая команда

```text
pnpm verify
```

`verify` выполняет последовательно:

1. `pnpm --dir web check` — SvelteKit sync и `svelte-check`.
2. `pnpm --dir web test:coverage` — полный Vitest-набор вместе с
   coverage-гейтом.
3. `pnpm --dir web test:rules` — отдельный быстрый прогон тестов ESLint-правил.
4. `pnpm --dir web lint:all` — ESLint, Stylelint и token audit.
5. `pnpm --dir web format:check` — форматирование кода `web/`.
6. `pnpm check:docs` — форматирование Markdown.
7. `pnpm --dir web build` — production build.

Полный `test` уже включает тесты lint-правил; отдельный `test:rules` в `verify`
оставлен как явный быстрый диагностический этап.

## Coverage

`pnpm --dir web test:coverage` считает покрытие только по `src/lib` и падает
ниже порога. Scope и список исключений — в `web/vitest.config.ts`.

| Метрика    | Порог |
| ---------- | ----- |
| statements | 90    |
| branches   | 82    |
| functions  | 72    |
| lines      | 91    |

Порог — нижняя граница, а не оценка качества: он блокирует регрессию и не
требует сначала закрывать весь долг. Актуальные проценты даёт
`pnpm --dir web test:coverage`; здесь они не дублируются, чтобы число не
устарело молча (`AGENTS.md`). Локальный замер занимает единицы секунд, поэтому
отдельного прогона в `verify` нет — `test:coverage` заменяет `test`.

Исключения из scope и их причины:

| Исключение                                  | Причина                                     |
| ------------------------------------------- | ------------------------------------------- |
| `**/*.test.ts`, `**/test-helpers.ts`        | сами тесты                                  |
| `**/*.svelte.ts`                            | runes, не работают в node                   |
| `executor/executor.worker.ts`               | entry worker, исполняется только в браузере |
| `components/define.ts`                      | type-only, нет исполняемого кода            |
| `core/domText.ts`, `core/io.ts`             | canvas, `createImageBitmap`, нужен браузер  |
| `i18n/en.ts`, `i18n/ru.ts`, `tool-icons.ts` | данные, а не логика                         |

`registry/*` из scope НЕ исключены: низкое покрытие там означает непокрытую
логику, а не ограничение окружения. Включение браузерных модулей в scope —
отдельное решение, а не молчаливое расширение списка.

## E2E

E2E не входит в `verify`, потому что Playwright поднимает build и статический
сервер:

```text
pnpm --dir web test:e2e
```

Запускать его обязательно для изменений маршрутов, загрузки файла, результата,
download, темы или локализации. Изменения runtime fixtures/загрузки файла
проверяются отдельным `web/e2e/png-fixtures.spec.ts`; ручные бинарники из
`tests/fixtures/` не входят в `verify`.

Локально прогон идёт с `workers: 1` и заметно медленнее. Правила нагрузки на
машину пользователя и диагностика флаков — `docs/agent-workflow.md`, раздел 3;
матрица проектов и ожидаемое поведение декодеров — `docs/testing-strategy.md`,
раздел 7; статус e2e в CI и порядок чтения прогона — `docs/decisions.md`,
разделы 9–10.

## Быстрые подмножества

Матрица «изменение → минимальный набор проверок»:

| Изменение                                            | Команда                                                 |
| ---------------------------------------------------- | ------------------------------------------------------- |
| Только Markdown                                      | `pnpm check:docs`                                       |
| TypeScript/Svelte                                    | `pnpm --dir web check` и `pnpm --dir web test`          |
| Lint-правило или lint-конфиг                         | `pnpm --dir web test:rules` и `pnpm --dir web lint:all` |
| Маршрут, загрузка, результат, download, тема, локаль | `pnpm --dir web test:e2e`                               |
| Перед ревью или merge                                | `pnpm verify`                                           |

## Errors и warnings

- `errors` завершают соответствующий инструмент ненулевым кодом.
- ESLint запускается с `--max-warnings=0`: новые ESLint warnings блокируют gate.
- Token audit оставляет unused-token сообщение неблокирующим: новый токен
  появляется вместе с потребителем, но стиль не блокирует деплой (решение —
  `docs/decisions.md`, раздел 6).
- Резолв `var()` в `app.css` — ошибка: несуществующий токен молча роняет
  объявление, поэтому этот check failing, в отличие от unused.
- `dict-consistency` использует base-locale fallback для registry metadata и
  pattern-based policy для временно неиспользуемых `tools.*.params`; это не
  молчаливый `allowPaths`-список.

`lint:all` может завершиться успешно при warnings — это не означает чистый
baseline. Агент показывает число errors, warnings и token warnings отдельно.

## CI

`.github/workflows/quality.yml`:

- `verify` блокирует PR при typecheck, unit, rule-test, lint, format, docs или
  build ошибке;
- `e2e` запускается отдельным job после verify и пока не блокирует PR.

`.github/workflows/deploy.yml` перед production build запускает тот же
`pnpm verify`, поэтому deploy не должен проходить при ошибке быстрых проверок.

| Workflow                 | Триггер                                 | Jobs                        |
| ------------------------ | --------------------------------------- | --------------------------- |
| `Deploy to GitHub Pages` | push в `main`, dispatch                 | `verify`, `build`, `deploy` |
| `Quality`                | push в `main`, `pull_request`, dispatch | `verify`, `e2e`             |

Результат после пуша читается **по отдельным job** — процедура в
`docs/decisions.md`, раздел 10.
