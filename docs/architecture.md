# Архитектура

> Статус: **active**. Описание текущего кода: границы модулей, поток данных от
> реестра до скачивания, точки расширения. Канонический источник истины — сам
> код; этот документ объясняет, **куда смотреть и что с чем связано**, и не
> дублирует сигнатуры.

## 1. Слои

```txt
web/src/lib/
  registry/            # источник истины: записи ToolEntry
  registry-schema.ts   # декларативная схема параметров + санитизация дефолтов
  catalog.ts           # группировка и счётчики для /list-tools
  categories.ts        # id/названия категорий
  tool-icons.ts        # id → иконка
  core/                # чистый TS: операции над ImageData, без DOM
  executor/            # единственная точка исполнения инструментов
  i18n/                # словари ru/en, t(), списки для i18n-правил линтера
  components/          # UI (fields/, layout/, ui/, schema-компоненты)
  zip.ts               # сборка мультифайлового результата (1 → many)
  theme.svelte.ts      # light/dark + localStorage
web/src/routes/
  +page.svelte         # главная
  list-tools/          # каталог
  tools/[id]/          # страница инструмента
  kit/                 # витрина компонентов (production, но исключена из i18n-гейта)
```

Правило зависимостей: `components/**` и `routes/**` знают про `registry/**`,
`executor/**` и `core/**`; `core/**` не знает ни о ком и не зависит от DOM;
`registry/**` описывает данные и знает только `core/**` и `registry-schema.ts`.
Нарушение этого порядка — повод не заводить импорт, а инвертировать зависимость.

## 2. Поток данных

```txt
registry/*.ts  ──(TOOLS: ToolEntry[])
        │
        ├─► catalog.ts ──► routes/list-tools  (каталог, поиск, фильтры)
        │
        └─► routes/tools/[id]/+page.svelte
                 │  getTool(id) → запись реестра
                 ▼
             SchemaToolView.svelte          оркестратор страницы
                 │  schema = tool.schema
                 ├─► SchemaFields.svelte     поля из schema.fields (FIELDS: kind → контрол)
                 ├─► SchemaSourceTile/SchemaTextSource.svelte   вход
                 └─► SchemaPreview + schema-preview-model.ts    вид превью
                 │  buildSchemaPreviewModel(inputMode, resultKind, …) → source/result/hasResult
                 ▼
             executor.execute(ctx)          единственная точка исполнения
                 │  сериализация параметров → worker → worker-handler → tool.run(ctx)
                 ▼
             core/*                         пиксели
                 │
                 ▼
             SchemaResultTile / SchemaTextResult  + SchemaActions (download/copy)
                 │  кодирование по ToolEntry.output (mime/ext/quality)
                 └─► zip.ts, если result === "files"
```

Ключевые решения:

- **Реестр — единственный источник истины.** Страница, форма и пайплайн строятся
  из записи; новый инструмент = новая запись + функция `run`.
- **Исполнение идёт только через `executor.execute`.** Компоненты не зовут
  `tool.run` напрямую — иначе нельзя перенести тяжёлое в worker/wasm без правки
  вызывающего кода.
- **Форма параметров не знает про инструмент.** Она рендерится из
  `registry-schema.ts`, поэтому добавление вида поля не трогает страницы.
- **Модель превью отделена от вёрстки.** `schema-preview-model.ts` — чистая
  функция, покрыта unit-тестами; `SchemaPreview.svelte` только рисует её вывод.

## 3. Запись реестра

`ToolEntry` (`web/src/lib/registry/types.ts`):

| Поле          | Смысл                                                        |
| ------------- | ------------------------------------------------------------ |
| `id`          | уникальный ключ; он же URL-anchor и ключ в пайплайне         |
| `title`       | EN-строка реестра, переводится через `tools.*.title`         |
| `description` | EN-строка реестра, переводится через `tools.*.description`   |
| `category`    | id из `categories.ts`                                        |
| `schema`      | `toolSchema({ fields, layout?, meta? })`                     |
| `input`       | `"image" \| "text" \| "none"` — что ждёт инструмент на входе |
| `result`      | `"image" \| "text" \| "verdict" \| "files"` — что отдаёт     |
| `output`      | mime/ext/quality для download (не у всех инструментов)       |
| `run(ctx)`    | чистая функция: `ctx` → `ToolResult`                         |

Хелперы `genTool` / `imgTool` / `textGen` из `types.ts` задают `run` для типовых
случаев (приведение типа результата), чтобы запись не повторяла обвязку. `TOOLS`
собирается в `registry/index.ts` из восьми групп; `getTool(id)` — единственный
способ достать запись по id.

## 4. Схема параметров

`registry-schema.ts` — единственное место, где описаны виды полей.

- **Виды поля** (`fieldSpecs`): `number`, `slider`, `color`, `select`, `text`,
  `checkbox`, `dimension`, `color-pair`, `colors`, `offset`, `position9`,
  `font-style`, `plate`, `gradient`.
- **Фабрика `field.*`** создаёт `Field<T>`; UI-контрол подбирается в
  `SchemaFields.svelte` по `spec.kind` через карту `FIELDS`.
- **`schema.layout`** группирует поля (`resolveLayoutGroups`); раскладка
  разделов — единственное место, где живёт порядок и группировка.
- **Значения по умолчанию** даёт `defaultSchemaParams`; `applySourceDefaults`
  подставляет размеры текущего source; `sanitizeSchemaParams` приводит мусор к
  допустимому виду. Правка поведения полей идёт здесь, а не в компоненте.

Новый вид поля требует: спека + фабрика `field.*` → запись в `fieldSpecs` →
контрол в `components/fields/schema/` → ключ в `FIELDS` → дефолт и санитизация →
i18n-подписи → тест в `registry-schema.test.ts`.

## 5. Исполнение

`executor/executor.ts` — фабрика `createExecutor(factories?)` плюс готовый
экспорт `execute`. Контракт асинхронный (`Promise`), параметры сериализуются,
исполнение уходит в `executor.worker.ts`; `worker-handler.ts` разбирает
сообщение и зовёт `run`. Если worker недоступен — прямой вызов.

Отсюда следует: подключение wasm позже означает замену реализации **внутри**
исполнителя, а не правку компонентов.

## 6. i18n

Словари — `web/src/lib/i18n/` (`en.ts`, `ru.ts`, общий `dict.ts` с
`LOCALES`/`BASE_LOCALE`). Пользовательский текст живёт только в словарях и
читается через `t()`; строки реестра (`title`/`description`) — источник для
EN-ключей `tools.*` и словарь-переводчик. Инварианты паритета ключей,
плейсхолдеров и запрет хардкода проверяются линтером, детали —
`web/eslint-plugins/README.md`.

## 7. Точки расширения

| Задача                         | Где править                                                       |
| ------------------------------ | ----------------------------------------------------------------- |
| Новый инструмент               | запись в `registry/<group>.ts` + i18n-ключи + тесты (рецепт ниже) |
| Новый вид поля                 | `registry-schema.ts` + контрол + `FIELDS` (раздел 4)              |
| Новый маршрут/страница         | `web/src/routes/**` + ссылка в каталоге                           |
| Новый визуальный элемент       | компонент в `components/**` по образцу `ui/` или `layout/`        |
| Новый дизайн-токен             | `web/src/app.css` (только там) + потребитель сразу                |
| Тяжёлая операция → worker/wasm | `executor/**`, без правок компонентов                             |
| Мультифайловый результат       | `result: "files"` + `zip.ts`                                      |

## 8. Рецепт: добавить инструмент

1. **Найти соседей.** Поиск по ключу в `registry/<group>.ts` и по всему
   `web/src/` — не заводить дублирующую константу, тип или утилиту.
2. **Выбрать группу** (`geometry`/`alpha`/`color`/`convert`/`filters`/
   `generate`/`text`/`analyze`) и положить запись в её экспорт; при новой
   категории — сначала `categories.ts`.
3. **Описать схему** через `field.*`, задать `layout`, если поля нужно
   сгруппировать.
4. **Написать `run`** поверх `core/*`; пиксельные операции — чистые функции в
   `core/`, без DOM.
5. **Проверить обязательные контракты** для нового id: entry попадает в `TOOLS`,
   страница `/tools/<id>` prerender-ится, `input`/`result` согласованы с тем,
   что делает `run`.
6. **Добавить i18n-ключи во все локали** сразу.
7. **Тесты:** unit — в `registry/*.test.ts` или рядом с `core`-функцией;
   e2e-smoke — существующий spec по типу `input`/`result` (правила —
   `docs/testing-strategy.md`).
8. **Обновить `docs/tools-map.md`:** новый инструмент обязателен в разделе
   «Реализовано», формат строки — в шапке раздела. Проверяет
   `web/src/lib/registry/tools-map-doc.test.ts`: отсутствующий в карте id и
   несуществующий в реестре id роняют тест. Обоснование и границы автоматизации
   — `docs/decisions.md`, раздел 4.

Ожидаемый минимум проверок: `pnpm --dir web check` и `pnpm --dir web test`; для
инструмента, меняющего пользовательский поток, — e2e (см. раздел 3
`docs/quality-gates.md`).
