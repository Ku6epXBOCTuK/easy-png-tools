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
2. `pnpm --dir web test:coverage` — полный Vitest-набор вместе с
   coverage-гейтом.
3. `pnpm --dir web test:rules` — отдельный быстрый прогон тестов ESLint-правил.
4. `pnpm --dir web lint:all` — ESLint, Stylelint и token audit.
5. `pnpm --dir web exec prettier --check .` — форматирование кода `web/`.
6. `pnpm check:docs` — форматирование Markdown.
7. `pnpm --dir web build` — production build.

Полный `test` уже включает тесты lint-правил; отдельный `test:rules` в `verify`
оставлен как явный быстрый диагностический этап.

## Coverage

`pnpm --dir web test:coverage` считает покрытие только по `src/lib` и падает
ниже порога. Scope и список исключений — в `web/vitest.config.ts`, обоснование —
в `docs/testing-strategy.md`.

| Метрика    | Порог | Baseline |
| ---------- | ----- | -------- |
| statements | 90    | 91.77%   |
| branches   | 82    | 83.3%    |
| functions  | 72    | 74.31%   |
| lines      | 91    | 92.53%   |

Порог — нижняя граница от текущего baseline, а не оценка качества: он блокирует
регрессию и не требует сначала закрывать весь долг. Локальный замер занимает ~30
с, поэтому отдельного прогона в `verify` нет — `test:coverage` заменяет `test`.

## E2E

E2E не входит в `verify`, потому что Playwright поднимает build и статический
сервер. Locator, fixture, i18n и `test.fixme`-политика описаны в
`docs/testing-strategy.md`:

```text
pnpm --dir web test:e2e
```

Запускать его обязательно для изменений маршрутов, загрузки файла, результата,
download, темы или локализации. Изменения runtime fixtures/загрузки файла
проверяются отдельным `web/e2e/png-fixtures.spec.ts`; ручные бинарники из
`tests/fixtures/` не входят в `verify`. В текущем CI это отдельный non-blocking
baseline; после закрытия известных ошибок его можно сделать blocking.

Локально прогон идёт с `workers: 1` и заметно медленнее: это осознанный размен,
экономит память и оставляет компьютер отзывчивым. Playwright не умеет
per-project лимит воркеров, а browser matrix упирается в память, а не CPU.
Тяжёлые прогоны запускаются по команде пользователя — по одному, без фонового
запуска и циклов повторов; детали в `docs/agent-workflow.md`.

## Быстрые подмножества

| Изменение                    | Команда                                                 |
| ---------------------------- | ------------------------------------------------------- |
| Только Markdown              | `pnpm check:docs`                                       |
| TypeScript/Svelte            | `pnpm --dir web check` и `pnpm --dir web test`          |
| Lint-правило или lint-конфиг | `pnpm --dir web test:rules` и `pnpm --dir web lint:all` |
| Пользовательский поток       | `pnpm --dir web test:e2e`                               |
| Fixtures/загрузка файла      | `pnpm --dir web test:e2e`                               |
| Полный локальный gate        | `pnpm verify`                                           |

## Errors и warnings

- `errors` завершают соответствующий инструмент ненулевым кодом.
- После Q2 ESLint запускается с `--max-warnings=0`: новые ESLint warnings
  блокируют gate.
- Token audit оставляет unused-token сообщение неблокирующим: после Q7 пыль
  вычищена, но решение о fail-режиме остаётся открытым.
- `lint:all` сейчас чист: 0 errors, 0 i18n warnings, 0 unused tokens.
- `dict-consistency` использует base-locale fallback для registry metadata и
  pattern-based policy для временно неиспользуемых `tools.*.params`; это не
  молчаливый `allowPaths`-список.

## CI

`.github/workflows/quality.yml`:

- `verify` блокирует PR при typecheck, unit, rule-test, lint, format, docs или
  build ошибке;
- `e2e` запускается отдельным job после verify и пока не блокирует PR.

`.github/workflows/deploy.yml` перед production build запускает тот же
`pnpm verify`, поэтому deploy не должен проходить при ошибке быстрых проверок.

### Что и когда запускается

| Workflow                 | Триггер                                 | Jobs                        |
| ------------------------ | --------------------------------------- | --------------------------- |
| `Deploy to GitHub Pages` | push в `main`, dispatch                 | `verify`, `build`, `deploy` |
| `Quality`                | push в `main`, `pull_request`, dispatch | `verify`, `e2e`             |

Пуш в `main` запускает оба workflow: deploy проверяет быстрый gate и собирает
сайт, `Quality` прогоняет тот же `verify` и browser matrix. Дублирование
`verify` (~1 мин) сознательное: matrix на каждый пуш стоит ~3 мин, и условные
job-и ради минуты не окупаются. Browser matrix проверяется на каждом пуше, а
ручной `gh workflow run quality.yml` нужен только для перепрогона старого
коммита.

### Проверка результатов CI после пуша

Первый реальный прогон browser matrix происходит на runner, а не на локальной
машине: локально Firefox и WebKit проходят на 1 воркере, но состав, скорость и
память Linux-раннера отличаются. Поэтому после пуша разработчика:

1. дождаться завершения workflow и посмотреть, какие job вообще запустились;
2. смотреть статусы **отдельных job**, а не общий conclusion прогона: у `e2e`
   стоит `continue-on-error: true`, поэтому прогон с упавшим e2e целиком
   помечается как `success` — проверено на run `36225579363` (`E2E: failure` при
   `conclusion: success`);
3. если `e2e` запускался и зелёный — сообщить фактические числа passed, failed,
   skipped;
4. если `e2e` не запускался, сказать это прямо: matrix на раннере не проверена,
   и её можно прогнать через `gh workflow run quality.yml`;
5. красный `e2e` только из-за ресурсов раннера фиксируется как ограничение
   окружения: сначала проверяется один проект и один spec, а не увеличиваются
   таймауты под конкретную машину.

### Измеренная стоимость прогона

Замер на ручном запуске `quality.yml` (276 e2e-тестов, 4 проекта,
ubuntu-latest):

| Этап              | Время    |
| ----------------- | -------- |
| `verify` job      | ~1 мин   |
| `e2e` job целиком | ~3.1 мин |
| из них сами тесты | ~2.2 мин |
| весь run          | ~4.2 мин |

Browser matrix стоит около трёх минут, поэтому её дешёво держать на каждом PR.
Полный прогон локально на 1 воркере — заметно дольше (~7 мин), и именно поэтому
локальные правила нагрузки описаны в `docs/agent-workflow.md`.

## Локальная диагностика

При медленном полном прогоне сначала запускай минимальную команду из таблицы, а
перед ревью или merge — `pnpm verify`. После каждого шага плана результат команд
и текущий baseline фиксируются в отчёте агента.
