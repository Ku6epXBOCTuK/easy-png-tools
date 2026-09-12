# План: i18n в preview (новый UI)

> Статус: готов к реализации (вопросы §5 решены). Соответствует беклог-задаче
> «добавить i18n в preview» (`docs/backlog.md`). Реализация не начата.

## 1. Что получается

Новый UI (`web/src/routes/**` кроме `v1`, `web/src/lib/components/**` кроме
`v1`) переходит на существующий модуль `lib/i18n`: переключатель RU/EN в шапке
работает по-настоящему, все строки локализованы, ошибки уже локализуются.
Инфраструктура i18n уже есть и проверена (v1-ветка) — задача в том, чтобы
подключить к ней preview и закрыть пробелы словарей.

До начала локализации **v1 изолируется**: у v1 появляется полная замороженная
копия `lib/i18n` → `lib/v1/i18n`, у нового UI — своя независимая ветка
`lib/i18n`, которую дальше меняем без оглядки на v1 (Фаза 0). Переключённая
локаль (localStorage) остаётся общей для обеих версий — язык переживает переход
между страницами.

## 2. Текущее состояние (исследование)

### Уже есть

- `lib/i18n/locale.svelte.ts` — состояние локали (runes), персист в
  localStorage, обновление `document.documentElement.lang`.
- `lib/i18n/t.ts` — перевод по точечному ключу с фолбэком на базовую локаль и
  интерполяцией `{var}`.
- `lib/i18n/dict.ts` — тип `Dict`, `BASE_LOCALE = "en"` (база — английский, ru —
  перевод), `LOCALES = ["ru", "en"]`.
- `lib/i18n/ru.ts` (~1351 строка) и `en.ts` (188 строк) — полные переводы
  инструментов v1 по id (title/description/params/options/results).
- `lib/i18n/tool-strings.ts` — хелперы для v1
  (`toolTitle/toolDescription/ paramLabel/optionLabel/searchDoc`).
- `lib/i18n/matching.ts` — кросс-языковой поиск (ё→е, диакритика, скоринг).
- Тесты: `i18n.test.ts`, `tools-i18n.test.ts`, `matching.test.ts`,
  `smoke-i18n.test.ts`, `search-coverage.test.ts`.
- `+layout.svelte` уже вызывает `initLocale()` на клиенте.

### Пробелы в новом UI

- `LangToggle.svelte` — заглушка с локальным `let lang = $state("RU")`, не
  связана с `locale.svelte.ts`.
- Новый UI почти целиком на хардкод-английском:
  - ~150+ строк по ~30 компонентам и маршрутам (заголовки, кнопки, аria,
    плейсхолдеры, подписи секций);
  - 122 инструмента с английскими `title`/`description` в `lib/registry/*.ts`;
  - ~60+ подписей опций select;
  - ~30 заголовков layout-групп (`title: "Canvas"`, `"Background"`, …);
  - вердикты анализаторов — raw English строки (`"Yes — valid PNG signature."`),
    при том что v1 возвращает ключи словаря (`"verifyYes"`) и рендерит их через
    `tools[id].results`;
  - `labelOf(id)` в `SchemaFields.svelte` генерирует подписи полей из field ID
    (keepAspect → "Keep Aspect");
  - категории в `catalog.ts` (`GROUP_LABELS`) — English uppercase, хотя в `dict`
    уже есть ключи `categories.X`.
- Из всех новых компонентов `t()` вызывает только `SchemaToolView.svelte`, и
  только для ошибок (`ToolError.key`).

### Совпадение регистров

- Новый registry и старый v1 registry используют **одинаковые id** инструментов
  (resize-png, flip-png, …) — переводы title/description из v1 `ru.ts` служат
  исходником для новой ветки `lib/i18n/ru.ts` (копирование данных при наполнении
  Фазы 2, не общий модуль).
- **Расхождение**: param ids в ru.ts (`width`/`height`/`keepAspect`) не равны
  field ids новоно schema (`size` dimension, `anchor`). Нужны новые переводы
  полей.
- `ru.ts` tools[id].results для анализаторов уже содержит ключи (`verifyYes`,
  `grayscaleNo`, `orientationPortrait` и т.д.).

### Архитектурные ограничения

- Изоляция old↔new (`isolation/no-mixed-imports`): сейчас `lib/i18n/` — shared.
  По решению задачи (Фаза 0) i18n **форкается**: v1 получает полную копию
  `lib/v1/i18n`, а `lib/i18n` переходит в ветку «new» (правило изоляции запретит
  старому коду импортить новый i18n). До форка в общем модуле два скрытых
  v1-импорта: `dict.ts` тянет `CategoryId` из `../v1/categories`,
  `tool-strings.ts` — `$lib/v1/registry`; после форка оба живут только в копии.
  Новому UI нужен параллельный `schema-tool-strings.ts` поверх `$lib/registry`.
- Tone detection в `SchemaTextResult.svelte`: `/^(yes|true)/i` по value —
  сломается при русских вердиктах («Да», «Нет»).
- `tools-i18n.test.ts` покрывает только v1 TOOLS; нужен аналог для нового
  registry.
- `known-issues.spec.ts`:
  `test.fixme("error message is localized, not a raw i18n key")`.

## 3. Как делаем

Принципы:

- Мелкие атомарные коммиты (правило AGENTS.md); самому не коммитить — коммитит
  разработчик после ревью.
- Изменения «снизу вверх»: сначала общий слой i18n, потом словари, потом UI.
- Каждый этап заканчивается зелёными `pnpm --dir web lint` +
  `pnpm --dir web check` + тесты.
- Решения по §5 зафиксированы и учитываются с первых правок словарей.

## 4. Фазы

### Фаза 0: Форк i18n для v1 + подготовка общего слоя

Выполняется строго до остальных фаз, без изменения поведения UI. Цель — два
независимых i18n-слоя: v1 получает замороженную копию, новый UI — свою ветку,
которую дальше меняем свободно. На выходе фазы — зелёные `lint`, `check`,
`test`, `test:rules`.

- **0.1** Форк: скопировать `web/src/lib/i18n/` → `web/src/lib/v1/i18n/` (полный
  снимок: `dict.ts`, `en.ts`, `ru.ts`, `t.ts`, `locale.svelte.ts`,
  `matching.ts`, `tool-strings.ts` + все 5 тестов). v1 работает дальше только с
  копией — поздние правки нового i18n её не затрагивают.
- **0.2** Привести копию к v1-канону (относительные пути от нового места):
  - копия `dict.ts`: импорт `CategoryId` `../v1/categories` → `../categories` (=
    `lib/v1/categories`);
  - копии тестов (`tools-i18n.test.ts`, `search-coverage.test.ts`,
    `smoke-i18n.test.ts`): `../v1/registry` → `../registry` (=
    `lib/v1/registry`);
  - импорт `$lib/v1/registry` в копии `tool-strings.ts` остаётся валидным;
  - перепроверить остальные относительные и `$lib`-пути в копии.
- **0.3** Переключить импорты старого UI: все `$lib/i18n/*` в `routes/v1/**` и
  `lib/v1/components/**` (39 импортов в 23 файлах) → `$lib/v1/i18n/*`.
- **0.4** Очистить новый `lib/i18n/` от v1-специфики, иначе isolation поймает
  new→old:
  - удалить `tool-strings.ts` (завязан на v1-типы `ParamDef`/`ToolEntry`; для
    нового UI вместо него `schema-tool-strings.ts`, см. 0.8);
  - удалить v1-центричные тесты `tools-i18n.test.ts`, `search-coverage.test.ts`,
    `smoke-i18n.test.ts` (они импортируют `../v1/registry`; живут только в
    копии);
  - остаются: `dict.ts`, `en.ts`, `ru.ts`, `t.ts`, `locale.svelte.ts`,
    `matching.ts`, `i18n.test.ts`, `matching.test.ts`.
- **0.5** Обновить правило изоляции и конфиги:
  - `isolation/no-mixed-imports.js`: добавить `lib/i18n/**` в `DEFAULT_NEW`
    (копия по-прежнему old через `lib/v1/**`);
  - `eslint-plugins/__tests__/no-mixed-imports.test.ts`: кейсы «old → i18n
    чисто» (строки 83–89) и «lib/i18n — shared» (строки 99–105) обновить под
    новую классификацию: old→новый i18n = нарушение; добавить фикстуру
    `__fixtures__/src/lib/v1/i18n/t.ts` для кейса old-копия;
  - `eslint.config.js`: в `allowDefaultProject` добавить фикстуру
    `eslint-plugins/__fixtures__/src/lib/v1/i18n/t.ts`; поправить комментарий
    изоляции «Общее (core/, i18n/, theme)» → «Общее (core/, theme)»;
  - `eslint-plugins/README.md`: убрать i18n из списка shared (§ Isolation).
- **0.6** Новый `lib/i18n/dict.ts`: `CategoryId` переключить с
  `../v1/categories` на `../categories` (новый структурно-идентичный тип) —
  скрытых v1-зависимостей в новом i18n не остаётся.
- **0.7** Проверка форка: `pnpm --dir web lint`, `check`, `test` (v1-копия
  тестов подхватывается `vitest include: src/**/*.test.ts`), `test:rules`;
  смоук: v1-страницы и оба переключателя RU/EN работают как раньше, языки обеих
  версий согласованы.
- **0.8** Добавить `lib/i18n/schema-tool-strings.ts` поверх `$lib/registry`
  (новый тип `ToolEntry`):
  - `toolTitle(tool)`, `toolDescription(tool)` с фолбэком на registry English;
  - `fieldLabel(field, id)` — перевод по ключу из `fields`-секции словаря (см.
    решение C), фолбэк на `labelOf(id)`;
  - `groupLabel(title)` — перевод по ключу из `groups`-секции словаря (см.
    решение A);
  - `verdictText(toolId, key)` — рендер вердикта по ключу;
  - `verdictTone(key)` — `success`|`danger`|`info` по имени ключа
    (`*Yes`/`*No`/`*Portrait`/`*Landscape`) — не по строке.
- **0.9** Расширить тип `Dict` (только новая ветка `lib/i18n`):
  - секция `preview` **не заводится**: оставшиеся после чистки mono-лейблов (см.
    решение B) строки нового UI живут в собственных категориях — расширяем
    существующие (`catalog`, `header`, `dropZone`, `sourceCard`, `resultCard`,
    `paramsCard`, `textResult`, `ui`) и заводим две маленькие новые: `actions`
    (Generate / Open image / Download result…) и `textSource` (placeholder, Try
    sample…);
  - новая глобальная секция `fields: Record<string, string>` — переводы подписей
    полей по ключу из схемы (решение C);
  - новая глобальная секция `groups: Record<string, string>` — переводы
    заголовков групп полей (решение A).

### Фаза 1: Словари — наполнение (только новая ветка `lib/i18n`, v1 не трогаем)

- **1.1** Заполнить `en.ts` и `ru.ts` секциями `actions`, `textSource`,
  `fields`, `groups` и ключами недостающих строк в существующих секциях.
- **1.2** Проинвентаризировать разницу между 122 инструментами нового registry и
  ключами `ru.tools`: для инструментов без перевода (нет в v1) добавить
  title/description в ru.ts новой ветки (по категориям — несколько коммитов).
- **1.3** Добавить в `ru.ts` ключи `fields`/`groups` для используемых в схемах
  ключей полей и заголовков групп (по ходу проставления ключей в schema, Фаза
  5).
- **1.4** Добавить `tools[id].options[fieldId][value]` для select-полей, чьи
  опции нужно локализовать.
- **1.5** Тест полноты (задел на Фазу 6): для каждого ключа label в schema есть
  перевод в обоих словарях.

### Фаза 2: LangToggle → реальный locale

- **2.1** `LangToggle.svelte`: убрать локальный `lang`, подключить
  `getLocale()`, `setLocale()`, `LOCALES`. Модель — language switch из
  `routes/v1/+layout.svelte`.
- **2.2** Проверить e2e `navigation.spec.ts` «language toggle marks the active
  button» — должен проходить без изменений.

### Фаза 3: Routes + layout

- **3.1** `+layout.svelte`: breadcrumbs через `t()`, динамический `lang`.
- **3.2** `+page.svelte`, `list-tools/+page.svelte`: footer-строка →
  `t("header.footerNote")`.
- **3.3** `tools/[id]/+page.svelte`: «Tool not found», fallback title → `t()`.

### Фаза 4: Компоненты — основной блок (по одному коммиту на компонент)

Каждый коммит: удаление декоративных mono-лейблов (решение B) + замена
оставшихся строк на `t`/хелперы + lint/check. Список mono-лейблов, которые
**удаляем**: eyebrow'ы (`PNG PROCESSING / SINGLE TOOL`, `KIT SHOWCASE`,
`EASY-PNG-TOOLS / CATALOG`), статусы (`LIVE PREVIEW`, `rendering ok`), панельные
подписи (`TOOL SETTINGS`), дублирующие капшены (`SOURCE / RESULT`,
`GENERATOR / RESULT`). Оставляем и локализуем только информативные: категории
каталога, счётчики инструментов, подписи данных (`FORMAT`, `parts`, `px`, «ZIP
(PNG)»), alt-тексты, а также содержательные заголовки («Configure output»).

- `SchemaToolView.svelte`: убрать eyebrow/`LIVE PREVIEW`/`TOOL SETTINGS`,
  перевести «Configure output» и «This tool has no schema yet.».
- `SchemaSourceTile.svelte`: убрать figcaption `SOURCE`, перевести «choose an
  image»/«no source…» и alt.
- `SchemaResultTile.svelte`: убрать figcaption `RESULT`, перевести «no result
  yet»/«parts» и alt.
- `SchemaPreview.svelte`: убрать панельные
  `SOURCE / RESULT`/`GENERATOR / RESULT`, перевести meta-капшены (`FORMAT` и
  т.п.).
- `SchemaActions.svelte`: Generating…, Generate, Open image, Download result.
- `SchemaFields.svelte`: Reset, «updates automatically», `labelOf(field.id)` →
  `fieldLabel(field)`.
- `SchemaTextSource.svelte`: placeholder, Try sample, Render text.
- `SchemaTextResult.svelte`: убрать лейбл `RESULT` у вердикта, перевести Copy /
  Download .txt; tone detection → `verdictTone()`.
- `CatalogToolbar.svelte`: фильтры → `t("categories.all")` +
  `t("categories.X")`, поисковый placeholder.
- `CatalogHeader.svelte`: убрать eyebrow, перевести heading/lead и счётчик
  «TOOLS AVAILABLE».
- `CatalogGroup.svelte`: перевести суффикс счётчика «TOOLS».
- `Dropzone.svelte`: текст зоны → `t("dropZone.pickDefault")`.
- Schema field controls (по одному или группой): Width/Height, From/To, Backing
  plate, Opacity, Font/Size/Color/Bold, Sans/Serif/Mono, Angle, «+ Add color»,
  «Remove color».
- `TopNav.svelte`, `ThemeToggle.svelte`, `CodeBlock.svelte`, `StepCard.svelte`,
  `Footer.svelte`.

### Фаза 5: Вердикты + ключи в schema

- **5.1** Анализаторы в `registry/analyze.ts`: возвращают ключи (`"verifyYes"`
  вместо raw English).
- **5.2** `SchemaPreview.svelte`: рендер вердикта через
  `verdictText(tool.id, key)`.
- **5.3** Layout groups в `registry/*.ts` (решение A): `title` → ключ
  (`title: "groups.canvas"`); в `SchemaFields.svelte` — `groupLabel(title)`. В
  `Dict` — глобальная секция `groups`.
- **5.4** Лейблы полей в `registry/*.ts` (решение C): на поле в схеме
  проставляется `label`-ключ (`field.number({ label: "fields.thickness", … })`),
  вывод в UI — `fieldLabel(field)` = `t(label)`. В `Dict` — глобальная секция
  `fields`.
- **5.5** Категории в `catalog.ts`: `GROUP_LABELS` → `t("categories.X")` (ключи
  уже есть в dict).

### Фаза 6: Тесты

- **6.1** `new-tools-i18n.test.ts` — полнота словарей для нового registry:
  title/description ru для всех инструментов, каждый `label`-ключ схемы есть в
  `fields`, каждый `groups`-ключ есть в `groups`, без лишних ключей.
- **6.2** Фикс `known-issues.spec.ts` test.fixme — ошибки локализуются.
- **6.3** В новой ветке `lib/i18n` появится собственный `smoke-i18n.test.ts`
  (аналог v1: переключение локали, `html lang`, контент без смеси языков) —
  v1-копия теста не трогается.

### Фаза 7: Кросс-языковой поиск

Переключить поиск в новом каталоге с `toLowerCase()` на
`scoreDoc()`/`normalizeForSearch()` из `matching.ts` (входит в объём, см.
решение D). Последний шаг, аккуратный отдельный коммит.

## 5. Решения

- **A. Layout groups**: заголовки групп храним i18n-ключами прямо в схеме
  (`title: "groups.canvas"`), перевод — в глобальной секции `groups` словаря
  (`Dict.groups: Record<string, string>`). В UI — `groupLabel(title)` =
  `t(title)` с фолбэком на сырой ключ.
- **B. Mono-лейблы**: декоративные лейблы без полезной информации **удаляем**
  (eyebrow'ы, статусы, панельные капшены, дублирующие подписи секций) — они
  занимают место. Оставляем только там, где реально нужно, и локализуем:
  счётчики инструментов, категории каталога, подписи данных (FORMAT, parts, px,
  «ZIP (PNG)»), alt-тексты, содержательные headings.
- **C. Лейблы полей**: в схеме задаём i18n-ключ
  (`field.number({ label: "fields.thickness", … })`), в UI выводится перевод —
  `fieldLabel(field)` = `t(label)`. Ключи — глобальная секция `fields` словаря,
  фолбэк на текущий `labelOf(id)` для несопоставленных.
- **D. Объём**: переводим всё сразу — и каркас, и контент реестра, и вердикты, и
  кросс-языковой поиск (Фаза 7). Крупные изменения кода разбиваем на небольшие
  атомарные шаги/коммиты.

## 6. Проверки

- `pnpm --dir web lint`
- `pnpm --dir web exec svelte-check --tsconfig ./tsconfig.json`
- `pnpm --dir web test`
- `pnpm --dir web test:rules` (если менялся eslint/isolation-конфиг)
- Смоук: переключатель RU/EN на новом UI; страницы каталога/инструмента, ошибка,
  вердикт — без смеси языков; `html lang` следует за локалью.
