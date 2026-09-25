# Quality gates

> Статус: **active**. Каноническое описание быстрых проверок репозитория.
> Краткие обязательные команды остаются в `AGENTS.md`.

## Каноническая команда

Запускать из корня репозитория:

```text
pnpm verify
```

`verify` выполняет последовательно:

1. `pnpm --dir web check` — SvelteKit sync и `svelte-check`.
2. `pnpm --dir web test` — полный Vitest-набор.
3. `pnpm --dir web test:rules` — отдельный быстрый прогон тестов ESLint-правил.
4. `pnpm --dir web lint:all` — ESLint, Stylelint и token audit.
5. `pnpm --dir web exec prettier --check .` — форматирование кода `web/`.
6. `pnpm check:docs` — форматирование Markdown.
7. `pnpm --dir web build` — production build.

Полный `test` уже включает тесты lint-правил; отдельный `test:rules` в `verify`
оставлен как явный быстрый диагностический этап.

## E2E

E2E не входит в `verify`, потому что Playwright поднимает build и статический
сервер:

```text
pnpm --dir web test:e2e
```

Запускать его обязательно для изменений маршрутов, загрузки файла, результата,
download, темы или локализации. В текущем CI это отдельный non-blocking
baseline; после закрытия известных ошибок его можно сделать blocking.

## Быстрые подмножества

| Изменение                    | Команда                                                 |
| ---------------------------- | ------------------------------------------------------- |
| Только Markdown              | `pnpm check:docs`                                       |
| TypeScript/Svelte            | `pnpm --dir web check` и `pnpm --dir web test`          |
| Lint-правило или lint-конфиг | `pnpm --dir web test:rules` и `pnpm --dir web lint:all` |
| Пользовательский поток       | `pnpm --dir web test:e2e`                               |
| Полный локальный gate        | `pnpm verify`                                           |

## Errors и warnings

- `errors` завершают соответствующий инструмент ненулевым кодом.
- `warnings` не завершают текущий lint автоматически, пока не включён строгий
  режим.
- На baseline Q0 `lint:all` даёт 0 errors, 188 `i18n/dict-consistency` warnings
  и 4 unused-token warnings. Это известные долги, а не чистый результат.
- После Q2 parity-линтер должен перейти к zero-warning, после чего можно
  включить `--max-warnings=0` без обходных allowlist-ов.

## CI

`.github/workflows/quality.yml`:

- `verify` блокирует PR при typecheck, unit, rule-test, lint, format, docs или
  build ошибке;
- `e2e` запускается отдельным job после verify и пока не блокирует PR.

`.github/workflows/deploy.yml` перед production build запускает тот же
`pnpm verify`, поэтому deploy не должен проходить при ошибке быстрых проверок.

## Локальная диагностика

При медленном полном прогоне сначала запускай минимальную команду из таблицы, а
перед ревью или merge — `pnpm verify`. После каждого шага плана результат команд
и текущий baseline фиксируются в отчёте агента.
