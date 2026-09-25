# План: линтеры, тесты и качество кодовой базы

> Статус: **draft — Q0–Q5 и Q6a–Q6c готовы к ревью; Q6d — следующий этап**.
>
> Источник: `docs/backlog.md`, аудит конфигурации `web/`, e2e-тестов и
> инфраструктурных скриптов. Q0–Q5 и Q6a–Q6c выполнены; Q6d–Q8 выполняются
> отдельными атомарными шагами.
>
> Цель: сделать качество кодовой базы воспроизводимым, убрать ложную «зелёность»
> проверок, стабилизировать тестовые контракты и только после этого расширять
> автоматические правила.

## 1. Границы и принципы

1. Сначала stabilизировать существующие проверки и тестовые контракты, а не
   добавлять новые сложные lint-правила.
2. Старый UI удалён: production работает на корневых маршрутах, а `/v1/**` и
   v1-specific код больше не являются частью приложения.
3. Не добавлять новые v1-фичи, не чинить v1-баги и не расширять v1-тесты.
4. `core/` и `theme/` — общие модули. Их изменения проверяются unit-тестами и
   smoke-сценариями production-потребителей.
5. Изменения делаются небольшими атомарными частями, в соответствии с
   `AGENTS.md`.
6. Каждый новый lint-rule сначала появляется в report-only/warn-only режиме,
   получает fixtures и тесты, и только после очистки baseline становится
   blocking.
7. Детали реализации правил остаются в `web/eslint-plugins/README.md`;
   `AGENTS.md` содержит краткие обязательные политики, понятные агенту без
   дополнительных поисков, и ссылки на подробные документы.

### Политика удаления legacy v1

- Q3 — отдельная атомарная cleanup-задача; поддержка v1 не возвращается.
- Старые маршруты и UI-файлы удаляются без redirects и без совместимого
  maintenance-режима.
- В рабочей кодовой базе не оставлять UI-v1-пути, исключения или документацию,
  которые выглядят как действующий источник совместимости.
- Исторические упоминания допустимы только в `docs/archive/`.
- Будущий API-контракт `POST /v1/process` из `docs/plan-platform.md` не связан с
  удалённым UI-v1 и остаётся в планах.

## 2. Текущее состояние quality-контура

- `pnpm verify` объединяет typecheck, unit, rule-тесты, lint, форматирование,
  docs и production build; deploy выполняет его перед сборкой.
- `i18n/dict-consistency` даёт 0 warnings на текущем baseline; отдельный debt —
  4 unused design tokens от token audit.
- E2E-контракт использует semantic locators и общий source-aware schema
  resolver; активных known-issue `test.fixme` нет.
- `ToolError` хранится как key/vars и переводится только при выводе; смена
  локали обновляет уже видимый alert.

## 3. Этапы выполнения

### Q0. Зафиксировать baseline и синхронизировать документацию

**Статус:** готов к ревью. **Оценка:** S. **Зависимости:** нет.

- Проверить фактические команды и зафиксировать их в quality-gate документации.
- Вынести расширенный workflow агента в `docs/agent-workflow.md`, оставив в
  `AGENTS.md` только обязательные инварианты и ссылки.
- Обновить `docs/backlog.md`:
  - отметить dictionary linter как реализованный, но не доведённый до
    zero-warning;
  - убрать противоречие по кнопке Generate;
  - синхронизировать числа инструментов и тестовых сценариев.
- Восстановить или исправить ссылку на раздел G в
  `docs/checklist-manual-testing.md`.
- Убрать устаревшее утверждение про hardcoded debt в `kit` из `AGENTS.md`, если
  оно больше не соответствует коду.
- Перенести явно устаревшие `docs/analysis.md` и `docs/sorting-backend.md` в
  `docs/archive/`, добавить даты архивирования и удаления через 30 дней.
- Создать `docs/README.md` как индекс активных документов и карту источников
  истины; подробные правила не дублировать в корневых файлах.

**Готово, когда:** один документ описывает текущие команды, актуальный baseline
и все известные `test.fixme` имеют ссылки на зарегистрированный баг.

### Q1. Единый quality gate и CI

**Статус:** готов к ревью. **Проверено:** `pnpm verify` проходит; E2E оставлен
отдельным non-blocking job. **Оценка:** S–M. **Зависимости:** Q0.

Добавить read-only `verify`-команду, которая запускает:

```text
pnpm --dir web check
pnpm --dir web test
pnpm --dir web test:rules
pnpm --dir web lint:all
pnpm --dir web exec prettier --check .
pnpm check:docs
pnpm --dir web build
```

E2E оставить отдельным тяжёлым гейтом:

```text
pnpm --dir web test:e2e
```

- Не дублировать вручную аргументы ESLint/Stylelint в нескольких скриптах;
  оркестратор должен вызывать package scripts или единый общий модуль.
- Описать фактические команды и semantics ошибок/warnings в
  `docs/quality-gates.md`; здесь нужна точная процедура, а не длинный дубль в
  `AGENTS.md`.
- На первом этапе явно разделить `errors` и `warnings`.
- После очистки i18n baseline добавить строгий режим `--max-warnings=0`.
- Добавить отдельный workflow для pull request: typecheck, unit, rule-тесты,
  lint, format и build.
- E2E сначала запускать отдельным job; сделать его blocking после закрытия
  известных ошибок и стабилизации baseline.

**Готово, когда:** одна команда воспроизводит все быстрые проверки, а deploy не
может пройти при type/unit/lint/build-ошибке.

### Q2. Политика i18n и zero-warning baseline

**Статус:** готов к ревью. **Проверено:** i18n lint даёт 0 warnings, rule-тесты
и полный `pnpm verify` проходят. **Оценка:** M. **Зависимости:** Q0, Q1.

- `BASE_LOCALE` — единственный источник registry-English fallback для
  `tools.*.title` и `tools.*.description`; остальные локали требуют физические
  ключи.
- Временно неиспользуемые `tools.*.params` исключены pattern-based policy до
  отдельной очистки мёртвого словаря; пустые значения и placeholders не
  подавляются.
- Исправлены три реальных RU option-label gaps и удалены неиспользуемые
  option-группы из `ru.ts`.
- Исправлен tie-break placeholder parity: при равенстве голосов выбирается
  `BASE_LOCALE`.
- `lint-all` запускает ESLint с `--max-warnings=0`; token audit пока оставляет 4
  unused-token warnings отдельным debt.
- Plural-формы остаются отдельной задачей после Q2 и не смешиваются с этим
  этапом.

### Q3. Удалить UI-v1 (cleanup завершён)

**Статус:** выполнен. **Проверено:** `pnpm verify` и production E2E smoke
проходят; после проверки обновлены конфиги и активные документы. **Оценка:** M.
**Зависимости:** Q0, Q1, Q2.

- Удалены `web/src/routes/v1/**`, `web/src/lib/v1/**`, `app_v1.css`, v1-specific
  i18n/tests и fixtures.
- Удалены isolation plugin, его тест и все v1-исключения из lint-конфигураций.
- Убраны v1-ссылки из production-кода и активных документов; исторические
  упоминания остаются в `docs/archive/`.
- Проверены production build, verify и отдельный E2E smoke production-маршрутов.

**Результат:** `/v1/**`, UI-v1-файлы и legacy-конфигурация отсутствуют;
следующий этап — Q5.

### Q4. Тестовый контракт e2e

**Статус:** выполнен. **Проверено:** `pnpm verify` и полный Playwright smoke
проходят; 105 тестов passed, 4 known-issue теста skipped. **Оценка:** M.
**Зависимости:** Q0–Q3.

- Добавлен `docs/testing-strategy.md` с locator, fixture, i18n и `test.fixme`
  policy.
- В production markup добавлены только разрешённые hooks для source/result/
  verdict/empty-state; текстовые элементы получили accessible labels, фильтры —
  `aria-pressed`, а каталог — семантические heading/status landmarks.
- E2E переведён на `role`, label и stable `href`; удалены `TOTAL`/`GROUPS`,
  exact fuzzy counts, internal CSS selectors, `alt`-locators и полные verdict
  strings. Точные verdict-переводы перенесены в unit-тесты.
- Helpers централизованы в `web/e2e/helpers/page.ts`; исправлены stale
  theme/source/locale checks. Theme fixme снят.
- Q5-фиксы resize/crop, generator, Reset и error-сценария не смешивались с этим
  этапом.

**Результат:** изменение формулировки, класса или порядка элементов не ломает
поведенческий тест без изменения пользовательского контракта; следующий этап —
Q6.

### Q5. Закрыть известные preview-баги

**Статус:** выполнен. **Проверено:** unit, Q5 E2E smoke и полный `pnpm verify`
проходят; активных known-issue `test.fixme` нет. **Оценка:** M–L.
**Зависимости:** Q4.

- Добавлен общий opt-in `defaultFromSource` resolver в `registry-schema`: он
  принимает source dimensions, обновляет только source-aware поля при upload и
  используется в UI, executor и worker. `resize-png` и `crop-png` получают
  размеры текущего source; static/generator/text schemas не затронуты.
- Reset сохраняет source/text, восстанавливает source-aware defaults и запускает
  deferred auto-run через debounce.
- Генераторы проверены в auto-run без кнопки Generate; кнопка не добавляется.
- `ToolError` хранится как key/vars, переводится derived-значением при выводе и
  обновляется при смене локали. E2E использует независимый invalid pixel-count
  сценарий.
- Resize/crop, generator, Reset и localization fixme сняты; Q6a расширяет
  покрытие, не смешиваясь с исправлением этих контрактов.

**Результат:** Q5 known issues закрыты и отражены в `docs/backlog.md` и
`docs/checklist-manual-testing.md`; Q6a выполнен, следующий этап — Q6b.

### Q6. Расширение unit и browser-покрытия

**Оценка:** M–L. **Зависимости:** Q4, Q5.

#### Q6a. Executor protocol, fallback и debounce

**Статус:** выполнен. Unit-тесты покрывают debounce, worker image/string/
verdict/files protocol, `ToolError` transport, constructor/postMessage/onerror/
malformed fallback, source-aware sanitization и DOM metadata. Browser smoke
проверяет rapid auto-run и no-worker fallback; deferred transport fallback
покрыт unit-тестами.

- `execute(tool, ctx)` сохраняет публичный API; `createExecutor` и protocol
  handler являются внутренними test seams.
- `ToolError` не запускает direct retry повторно; transport/protocol failures
  отключают worker и переходят в direct fallback.
- DOM-зависимые registry entries помечены `domOnly`, поэтому зелёный smoke не
  скрывает нормальный worker fallback.
- `debounce` покрыт fake timers; E2E подтверждает последние значения при быстрых
  последовательных изменениях генератора.

#### Q6b. FileResult → ZIP → download

**Статус:** выполнен. Q6a закрыл worker-транспорт; Q6b добавил проверяемый ZIP
seam, unit round-trip для `FileResult`, защиту пустого результата и error/busy
контракт download. Отдельный browser-сценарий скачивает архив и проверяет имена
частей и PNG-сигнатуры.

- `buildZipEntries` не зависит от DOM; `downloadZip` остаётся UI-обёрткой.
- `SchemaToolView` переиспользует `downloadBlob`, ловит ошибки кодирования и
  блокирует повторный download на время сборки.
- E2E использует `downloadResultFile` и `unzipSync`, не добавляя новые
  `data-testid`; files-инструменты не проходят через image-smoke.

#### Q6c. Output MIME/quality

**Статус:** выполнен. Q6c покрывает текущий фиксированный output-контракт
JPG/WebP/BMP, не превращаясь в UX-райз кнопки Download. Registry проверяет
согласованность MIME/extension/quality-поля, unit — границы quality, browser —
реальные сигнатуры файлов и разницу размера при изменении quality.

- `ToolEntry.output` остаётся декларативным описанием формата; новый селектор
  форматов не добавляется.
- `validateOutputQuality` отделяет проверку 0..1 от DOM-рендеринга; JPEG/WebP
  используют quality `1..100` из schema, BMP не имеет quality-параметра.
- E2E проверяет JPEG `FF D8 FF`, WebP `RIFF/WEBP`, BMP `BM` и PNG-фолбэк.
- Ошибки кодирования и unsupported MIME используют существующие i18n-ключи.

#### Q6d–Q6f. Оставшиеся направления

- malformed и special PNG fixtures: CRC, truncated, palette, 16-bit;
- smoke всех типов инструментов из registry;
- component-тесты `SchemaToolView`, `SchemaPreview` и schema fields;
- browser matrix, mobile viewport, visual snapshots и coverage thresholds.

Не применять один одинаковый smoke-сценарий к image-, text-, generator- и
file-result-инструментам.

### Q7. Укрепление lint-инфраструктуры

**Оценка:** M. **Зависимости:** Q1, Q2, Q3.

- Очистить или использовать unused design tokens; после очистки решить, должен
  ли unused audit быть fail-режимом.
- Добавить тесты для token audit и PostCSS HCT-плагина.
- Покрыть базовым JS recommended сам код ESLint-плагинов и lint-скриптов.
- Отдельно решить, должен ли обычный CSS проходить проверку undefined tokens и
  hardcoded colors наравне со Svelte styles.
- Новые правила подключать только после fixtures, `test:rules` и baseline.

### Q8. Новые автоматические правила

**Оценка:** L. **Зависимости:** Q4, Q7.

#### Дублирование HTML/Svelte-разметки

Сначала провести report-only аудит новых `components/**` и `routes/**`.
Определить:

- минимальный размер клона;
- нормализацию Svelte blocks и динамических классов;
- список допустимых fixture/allowlist-случаев.

Только после оценки false positives выбирать между готовым detector и
собственным AST-правилом. Не включать detector в blocking gate сразу.

#### Пользовательские тексты вне i18n

Сделать warn-only пилот с исключениями для:

- бренда и версии;
- форматов и имён файлов;
- `X`/`Y` и технических значений;
- registry source strings;
- `/kit`;
- тестовых данных и внутренних сообщений.

Blanket-запрет всех string literals не использовать.

#### Согласованность комментариев

Автоматический lint не делать. Это review/process policy: комментарий должен
объяснять причину исключения, а `TODO`/`FIXME` — ссылаться на backlog или issue
и иметь критерий закрытия.

## 4. Что описать в `AGENTS.md`

В `AGENTS.md` добавить только следующие неочевидные правила:

1. Какой набор команд считается полным quality gate и что означает успешный
   результат при warnings.
2. Production-scope и политику удаления v1: новые изменения относятся только к
   production UI; исторические UI-v1-упоминания остаются в архиве.
3. Политику e2e: semantic locators, допустимый `data-testid`, запрет
   бессмысленных counts/classes/alt/exact prose.
4. Политику i18n: новые пользовательские тексты через i18n; registry source,
   brand, formats и `/kit` — явные исключения.
5. Жизненный цикл `test.fixme`: только для зарегистрированного бага, с ссылкой;
   исправление и удаление теста происходят вместе.
6. Комментарии и `TODO`/`FIXME` должны объяснять «почему» и иметь ссылку на
   работу.
7. Shared-модули `core`/`theme` требуют проверки production-потребителей.

Синтаксические списки ESLint-правил и подробные токены остаются в
`web/eslint-plugins/README.md`.

### Политика документации для агентов

`AGENTS.md` не должен превращаться в полный справочник проекта. В нём оставляем
только обязательный рабочий контракт: команды, production-scope, ключевые
инварианты, исключения и ссылки на подробные документы. Если агенту нужно понять
причину или workflow, в `AGENTS.md` должна быть короткая понятная формулировка;
длинные примеры, точные процедуры, таблицы и критерии проверки переносятся в
`docs/` или в README рядом с соответствующей подсистемой.

Принцип выбора места документа:

1. **Поведение агента, которое нельзя пропустить** — кратко в `AGENTS.md`.
2. **Точная команда, скрипт, параметр или критерий качества** — в
   `docs/quality-gates.md` или в README соответствующей подсистемы.
3. **Архитектурное решение, поток данных и границы модулей** — в
   `docs/architecture-overview.md` или существующем плане.
4. **Реализация конкретного lint-правила и его fixtures** — только в
   `web/eslint-plugins/README.md` и исходниках правила.
5. **Продуктовая задача, backlog и ручная приёмка** — в `docs/backlog.md`,
   активном плане или `docs/checklist-manual-testing.md`.

Подробные документы не дублируются в нескольких местах: у документа должен быть
один источник истины, а остальные файлы ссылаются на него. Все подробные
материалы хранятся в `docs/`, чтобы не засорять корень репозитория.

Активный документ должен иметь статус (`draft`, `active`, `completed` или
`archived`) и понятную область применения. Архивные планы не используются как
текущие критерии приёмки без отдельной сверки с кодом. Новый документ создаётся
только когда темы нет в существующем файле; иначе обновляется существующий.

### Архивирование и срок хранения

Завершённые, отменённые или явно устаревшие документы переносятся в
`docs/archive/`, а не остаются в корне `docs/` как рабочие планы. При переносе
добавляются дата архивирования, дата удаления и причина. Архивный документ —
временная справка для быстрого просмотра прошлых решений, но не источник текущих
требований.

Срок хранения после архивирования — 30 дней. После этой даты документ можно
удалить после проверки ссылок; если он снова нужен, его восстанавливают из git
history или пересоздают как новый активный документ. Подробная процедура и
шаблон метаданных находятся в `docs/archive/README.md`.

### Какие документы подготовить

| Документ                        | Назначение                                                                              | Когда создавать/обновлять                                             |
| ------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `docs/README.md`                | Индекс активных документов, карта источников истины и краткий порядок чтения для агента | Q0; при добавлении нового активного документа                         |
| `docs/agent-workflow.md`        | Подробный workflow: исследование, изменение, проверка и обновление документации         | Q0–Q1; только для процессов, не описанных кратко в `AGENTS.md`        |
| `docs/quality-gates.md`         | Команды проверки, semantics errors/warnings, порядок запуска и требования CI            | Q1; при изменении scripts/config/CI                                   |
| `docs/testing-strategy.md`      | Слои тестов, locator policy, i18n assertions, fixtures, `test.fixme` и правила e2e      | Q4; при изменении тестовой архитектуры                                |
| `docs/architecture-overview.md` | Карта `core`, registry, executor, production UI и shared-модулей                        | Q5 или перед крупным рефакторингом; не дублировать существующие планы |
| `web/eslint-plugins/README.md`  | Детали custom lint rules, token policy и fixtures                                       | Уже существует; менять только вместе с правилами                      |
| `docs/archive/README.md`        | Политика временного архива, даты и удаления через 30 дней                               | Q0; обновлять при изменении архивной политики                         |

Не создавать отдельные `docs/commands.md`, `docs/known-issues.md` или копию
backlog: команды принадлежат `quality-gates`, известные проблемы — backlog и
checklist. `README.md` в корне остаётся кратким обзором продукта, а не вторым
руководством агента.

## 5. Порядок PR

1. **Q0** — синхронизация backlog/checklist/AGENTS.
2. **Q1** — `verify` и PR quality gate.
3. **Q2** — i18n parity и strict warning gate.
4. **Q3** — удалить v1 отдельной атомарной задачей.
5. **Q4** — тестовый контракт и stale-тесты для production UI.
6. **Q5** — preview-баги и снятие `fixme`.
7. **Q6** — расширенное покрытие.
8. **Q7** — тесты lint-инфраструктуры и unused tokens.
9. **Q8** — report-only duplicate/text audits; blocking — только после baseline.

Каждый PR должен быть атомарным и небольшим; не объединять `SchemaPreview`
refactor, новые i18n-правила и исправление продуктовых багов в одну работу.

## 6. Отдельные направления и что не начинать автоматически

- полноценный browser/visual/coverage matrix;
- полноценная PWA/API/WASM-платформа;
- `SchemaPreview` state/view-model refactor;
- plural-формы до модели словаря;
- универсальный линтер одинаковых комментариев;
- batch/архивы, region-инструменты и остальные продуктовые волны из backlog.

## 7. Решения, которые нужно принять на ревью

- Какие executor/worker/fallback сценарии войдут в первый Q6 coverage PR?
- Какие special PNG fixtures обязательны для baseline?
- Нужны ли browser/mobile matrix и visual snapshots до coverage thresholds?
- Какие unused design tokens можно удалить, а какие должны остаться?
- Какие browser/e2e проверки должны быть обязательными для PR, а какие —
  отдельным ночным прогоном?
