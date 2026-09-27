# ESLint-плагины и дизайн-токены: детали

> Статус: **active**. Область применения — `web/eslint-plugins/**`,
> `web/scripts/**`, конфиги линтинга. Остальная рутина разработки её не требует;
> детали нужны только при правке самих линт-правил или конфигов. Команды и
> пороги — `docs/quality-gates.md`.

## Структура

- `web/eslint-plugins/` — локальные ESLint-плагины.
  - `design-tokens/` — правила для `<style>`-блоков svelte-компонентов.
  - `conventions/` — конвенции кода (интерфейс пропсов, запрет union-алиасов).
  - `i18n/` — кросс-языковой линтер словарей (`dict-consistency`).
  - `__tests__/` — юнит-тесты (Vitest + `RuleTester`/`Linter`).
  - `__fixtures__/` — фикстуры для тестов: миниатюрный `src/app.css` (словарь
    токенов) и мини-словари `lib/i18n/`.
- `web/scripts/`:
  - `lint-all.mjs` — оркестратор `lint:all`.
  - `check-tokens.mjs` + `token-audit/` — токен-аудит по `app.css`.
  - `postcss-hct.mjs` — постcss-плагин эммита `hct()` в sRGB-hex.
  - `__tests__/` — тесты аудита и HCT-плагина; подхватываются обычным
    `vitest run` через `scripts/**/*.test.mjs`, поэтому входят в `verify`.
- `web/stylelint.config.js`, `web/postcss.config.js` — конфиги stylelint/css.

## Конфигурация ESLint (`web/eslint.config.js`)

Устроена инкрементально:

- На **весь код** — парсинг TS/Svelte + правило
  `@typescript-eslint/consistent-type-imports` (запрет инлайн-тип-импортов,
  `prefer: 'type-imports'`).
- Полные `recommended`-наборы (`eslint` + `typescript-eslint` +
  `eslint-plugin-svelte`) навешаны на UI-код (`src/lib/components/**`,
  `src/routes/**`). Scoped-пути двигаются вместе с папками: не оставлять
  устаревшие пути в `eslint.config.js`.
- Базовый `js.configs.recommended` + `globals.node` навешаны на инфраструктуру
  линтинга: `eslint-plugins/**/*.js` и `scripts/**/*.mjs`.
  TS/svelte-рекомендации туда не подключаются.
- Для `*.svelte` выключен `prefer-const` (пропсы в Svelte 5 пишутся через
  `let`).
- `allowDefaultProject` перечисляет test-файлы и фикстуры точечно (glob'ы с `**`
  там запрещены tseslint) — при добавлении файлов в `__tests__/` /
  `__fixtures__/` дописать их туда же.
- design-tokens правила применяются к тем же scoped-путям
  (`src/lib/components/**`, `src/routes/**`).
- `i18n/no-hardcoded-user-text` применяется к обоим scoped-путям
  (`src/lib/components/**` и `src/routes/**`): хардкод в `+page.svelte` и
  `+layout.svelte` — такой же production-UI. Исключение одно — `/kit`, витрина с
  намеренно латинскими подписями; выключается отдельным объектом конфига с
  `files: ["**/src/routes/kit/**/*.svelte"]`, потому что негативные паттерны в
  `files` не сужают область действия правила. Опция `allowWords` — brand не
  хардкодится в правиле.

## Правила плагина design-tokens

- `design-tokens/no-hardcoded-in-svelte` — запрет прямых цветов/размеров/
  длительностей/z-index и `color-mix()` (результат токенизировать в CSS).
  Исключения размеров: `0`, `0px`, `1px`, проценты и unitless (`line-height`).
- `design-tokens/no-category-mismatch` — size-свойство не может использовать
  color-токен (`--color-*`/`--brand-*`) и наоборот.
- `design-tokens/no-token-definition-in-svelte` — определение `--x:` в
  компоненте не может содержать примитив (hex/rgb/oklch/px/rem); допустимы
  производные от токенов (`var()`, `calc()`, unitless-числа).
- `design-tokens/no-undefined-in-svelte` — `var(--x)` в `<style>` должен быть
  определён в `src/app.css` (словарь токенов) или локально в компоненте. Файл
  читается один раз и кэшируется (не `glob`-зависим).

(ESLint лезет в `<style>`-блоки через постпрефес postcss AST от
`svelte-eslint-parser`; stylelint прогоняется по всем CSS-файлам.)

## Плагин i18n (`i18n/`)

### `i18n/dict-consistency`

Кросс-языковой линтер словарей `lib/i18n/` (историческая модель и завершённые
фазы: `docs/archive/plan-preview-i18n.md`). Сравнивает каждый словарь со
**всеми** остальными локалями (не только с BASE). Список локалей берётся из
`LOCALES` в `lib/i18n/dict.ts` — новый словарь подхватывается без правки
правила.

- **warn-only, никогда `error`** — пропущенный перевод не валит сборку.
- Диагностика живёт там, где фикс: каждый файл репортит **только свои**
  расхождения:
  - **паритет ключей**: правило собирает union всех ключей из словарей-соседей
    (с диска) и для текущего файла репортит те, которых в нём нет — ровно одно
    предупреждение на разрыв, независимо от числа локалей, где ключ есть;
    пропавшая целая секция репортится один раз (не по каждому потомку);
  - **пустые значения**: `""` и строка из одних пробелов;
  - **паритет плейсхолдеров**: у одинакового ключа набор `{name}` сравнивается с
    каноническим (мажоритарный по локалям, при равенстве — `BASE_LOCALE`, затем
    `LOCALES`) — ловит потерянную при переводе переменную ровно один раз, даже
    когда отклоняется одна-единственная локаль.
- Словари-соседи читаются с диска и кэшируются на процесс линта (как
  `no-undefined-in-svelte`); каждый парсится `@typescript-eslint/parser`
  (синтакс, без типов).
- Опция `allowPaths: string[]` — dot-path ключи, исключаемые из всех проверок
  (осознанные отклонения до достижения zero-warn).
- `baseLocaleFallback: string[]` — паттерны ключей, которые допустимо
  отсутствовать только в базовой локали; в текущей конфигурации это registry
  metadata `tools.*.title` и `tools.*.description`. Пустые значения и
  placeholders для присутствующих ключей всё равно проверяются.
- `ignoreMissingPatterns: string[]` — паттерны ключей, которые временно не
  проверяются на missing; в текущей конфигурации это неиспользуемые
  `tools.*.params`. Эта опция не отключает empty/placeholder checks.
- Тесты: `__tests__/dict-consistency.test.ts`, фикстуры-словари в
  `__fixtures__/src/lib/i18n/` (`en`, `ru`, `de` — консистентные, zero-warn) — в
  тестах подаются модифицированные варианты `en.ts`/`ru.ts` против эталонных на
  диске.

### `i18n/no-hardcoded-user-text`

Запрещает пользовательский текст, зашитый в шаблон: литерал в Svelte-тексте или
в строковом значении пользовательского атрибута молча уедет в RU-локаль. Пилот
report-only (`warn`), baseline — 0 срабатываний.

- Поверхность: узлы `SvelteText` (включая текстовые части смешанного контента) и
  строковые литералы атрибутов из `i18n/lists.js` (`label`, `title`,
  `placeholder`, `aria-label`, `alt`, `description`, `emptyText`, `hint`,
  `eyebrow`, `suffix`, `unit`, `error`). Технические атрибуты (`variant`,
  `tone`, `type`, `icon`, `size`, `href`, `class`) не проверяются, значения в
  скобках (`{expr}`) тоже — они считаются в другом месте.
- Исключения списком, а не «на глаз»: форматы и единицы (`PNG`, `px`, `×`),
  имена файлов и версии (`result.png`, `v0.1.0`, `v1`), размеры (`512×512`),
  registry-строки и прочие ALL CAPS идентификаторы (`BACKGROUND`), а также
  `/kit` — витрина компонентов с намеренно латинскими подписями (исключение
  живёт в `eslint.config.js`, а не в правиле).
- Опция `allowWords: string[]` — brand и прочие собственные имена. Название
  продукта передаётся конфигом, а не зашито в правило.
- Содержимое `<style>` и `<script>` пропускается: там код, а не копирайт.
- Тесты: `__tests__/no-hardcoded-user-text.test.ts` — `RuleTester` на
  svelte-eslint-parser плюс прямые кейсы `hasUserWords`.

## Токены-префиксы (целевой словарь дизайна)

- Цвета: `--color-*`, бренд `--brand-main` / `--brand-alt` — единственные две
  переменные, которым разрешено быть hex/rgb, остальные цвета — только `hct()` и
  только в app.css.
- Размеры: `--space-*`, `--text-*` (font-size), `--radius-*`, `--size-*`.
- Брейкпоинты: `@custom-media --bp-mobile (max-width: 640px)` /
  `--bp-tablet (800px)` / `--bp-desktop (1100px)` — объявляются в app.css,
  используются как `@media (--bp-*)`. CSS-переменные в `@media` не работают,
  поэтому отдельных `--bp-*` токенов нет; раскрытие делает postcss-плагин
  `postcss-custom-media` (конфиг `web/postcss.config.js`, определения
  подтягиваются через `@csstools/postcss-global-data`).
- z-index: `--z-*`; длительности/анимации: `--duration-*`, `--ease-*`.

Нюансы stylelint:

- Правило `custom-property-pattern` тестирует паттерн **без** `--` (`--x` →
  `x`), а `declaration-property-value-disallowed-list` — целиком с `--`.
- `custom-property-empty-line-before` перенастроен (`after-custom-property` в
  `ignore`, не в `except`): пустые строки между подряд идущими токенами
  **свободны** и `--fix` их не удаляет — можно группировать цветовые и размерные
  токены в app.css отдельными блоками.

## Токен-аудит (`check-tokens.mjs`)

Лёгкий оркестратор поверх `web/scripts/token-audit/*`. Проверяет:

- **Parity**: каждый цветовой токен из `:root` обязан иметь пару в
  `[data-theme="dark"]` и наоборот. Производные токены (значение содержит
  `var()`, напр. `hct(from var(--...))`) из пары исключены — они наследуют тему
  автоматически.
- **hct-only для цветов**: ЛЮБОЕ цветовое значение в app.css обязано быть
  `hct(...)` — и литерал, и производное `hct(from var(...) h c t)`. Исключения:
  только `--brand-main` / `--brand-alt` (seed-токены, любая форма) и
  `color-mix(...)` (единственный легальный способ смешать два токена).
  `oklch()/rgb()/#hex` в `--color-*` запрещены.

- **Резолв `var()`**: каждая ссылка `var(--x)` в app.css должна указывать на
  токен, определённый в этом же файле. `var(--x, fallback)` не считается ошибкой
  — fallback легален без определения. Провал (exit 1), потому что несуществующий
  токен молча роняет объявление.
- **Неиспользуемые токены**: выводится **варнинг** (определены, но нигде не
  используются) — выход он не меняет. Проверка видит только ссылки `var(--x)`,
  поэтому чтение токена из JS (`getPropertyValue`) она не учтёт; решение
  оставить проверку неблокирующей зафиксировано в `docs/quality-gates.md`.
  Провалами (exit 1) считаются parity, hct-авторство и резолв `var()`.

## Тесты кастомных линт-правил

Линт-правила покрыты юнит-тестами (Vitest, `test:rules`):

- `__tests__/design-tokens.test.ts` — три чистых правила
  (`no-hardcoded-in-svelte`, `no-category-mismatch`,
  `no-token-definition-in-svelte`) через `RuleTester` со строковыми кейсами;
  `no-undefined-in-svelte` — через `Linter` API, т.к. читает словарь токенов из
  `__fixtures__/src/app.css` (не из реального `src/app.css`).
- Хелпер `__tests__/helpers.ts` собирает `Linter` с `cwd = __fixtures__` —
  `process.cwd()` не трогается, реальные `src/` не читаются.

Запуск: `pnpm --dir web test:rules` (`vitest run eslint-plugins/__tests__`).
Полный `pnpm --dir web test` тоже их гоняет.

Фикстуры живут в `__fixtures__/` и сами прогоняются линтом (`eslint .`), поэтому
добавление/правка стабов — тоже работа с валидным кодом.
