# ESLint-плагины и дизайн-токены: детали

Эта часть репозитория подробно описана здесь, а не в корневом `AGENTS.md`:
рутина-разработка её не требует, детали нужны только при правке самих
линт-правил или конфигов.

## Структура

- `web/eslint-plugins/` — локальные ESLint-плагины.
  - `design-tokens/` — правила для `<style>`-блоков svelte-компонентов.
  - `isolation/` — правило изоляции old/new UI.
  - `__tests__/` — юнит-тесты (Vitest + `RuleTester`/`Linter`).
  - `__fixtures__/` — фикстуры для тестов: миниатюрный `src/app.css` (словарь
    токенов) и файлы для изоляционных тестов.
- `web/scripts/`:
  - `lint-all.mjs` — оркестратор `lint:all`.
  - `check-tokens.mjs` + `token-audit/` — токен-аудит по `app.css`.
  - `postcss-hct.mjs` — постcss-плагин эммита `hct()` в sRGB-hex.
- `web/stylelint.config.js`, `web/postcss.config.js` — конфиги stylelint/css.

## Конфигурация ESLint (`web/eslint.config.js`)

Устроена инкрементально:

- На **весь код** — парсинг TS/Svelte + правило
  `@typescript-eslint/consistent-type-imports` (запрет инлайн-тип-импортов,
  `prefer: 'type-imports'`).
- Полные `recommended`-наборы (`eslint` + `typescript-eslint` +
  `eslint-plugin-svelte`) навешаны **только на новый код**
  (`src/lib/components/**`, `src/routes/**`), чтобы старый код не засыпался
  предсуществующими ошибками. Старый код (C17) — `src/lib/v1/**`,
  `src/routes/v1/**`. Когда старый дизайн удалён (C19), scoped-блок убирается и
  `recommended` включается на весь код.
- **Scoped-пути двигаются вместе с папками** (см. `plan-redesign.md` §10): не
  оставлять устаревшие пути в `eslint.config.js` (C17 уже двигал
  `routes/preview/**` → `routes/**` и `components/kit/**` → `components/**`; на
  C19 при наведении порядка в `components/` paths останутся `components/**` +
  `routes/**`).
- Для `*.svelte` выключен `prefer-const` (пропсы в Svelte 5 пишутся через
  `let`).
- `allowDefaultProject` перечисляет test-файлы и фикстуры точечно (glob'ы с `**`
  там запрещены tseslint) — при добавлении файлов в `__tests__/` /
  `__fixtures__/` дописать их туда же.
- design-tokens правила применяются к тем же scoped-путям
  (`src/lib/components/**`, `src/routes/**`).
- isolation-правило включено на весь `**/*.{ts,svelte}`.

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

Выводит **варнинг** о неиспользуемых токенах app.css (определены, но нигде не
используются) — выход он не меняет. Провалом (exit 1) считаются только parity и
hct-авторство.

## Тесты кастомных линт-правил

Линт-правила покрыты юнит-тестами (Vitest, `test:rules`):

- `__tests__/design-tokens.test.ts` — три чистых правила
  (`no-hardcoded-in-svelte`, `no-category-mismatch`,
  `no-token-definition-in-svelte`) через `RuleTester` со строковыми кейсами;
  `no-undefined-in-svelte` — через `Linter` API, т.к. читает словарь токенов из
  `__fixtures__/src/app.css` (не из реального `src/app.css`).
- `__tests__/no-mixed-imports.test.ts` — isolation-правило через `Linter` API с
  `cwd` на `__fixtures__`: правило резолвит импорты по реальным файлам, поэтому
  цели импортов обязаны существовать на диске.
- Хелпер `__tests__/helpers.ts` собирает `Linter` с `cwd = __fixtures__` —
  `process.cwd()` не трогается, реальные `src/` не читаются.

Запуск: `pnpm --dir web test:rules` (`vitest run eslint-plugins/__tests__`).
Полный `pnpm --dir web test` тоже их гоняет.

Фикстуры живут в `__fixtures__/` и сами прогоняются линтом (`eslint .`), поэтому
добавление/правка стабов — тоже работа с валидным кодом.

## Isolation-правило (`isolation/no-mixed-imports`)

**Полная взаимная изоляция** старого (v1) и нового (корень) UI. В отличие от
`no-restricted-imports`, правило **резолвит** каждый импорт (и `$lib/...`, и
относительные `./`/`../`) до реального файла и классифицирует стороны по
фактическому пути, поэтому относительным импортом правило не обойти.

- Старое: `routes/v1/**`, `lib/v1/**`.
- Новое: `routes/**` без `v1/**`, `lib/components/**`, `lib/registry/**`,
  `lib/catalog.ts`, `lib/categories.ts`, `lib/tool-icons.ts`,
  `lib/registry-schema.ts`, `lib/registry-schema.test.ts`.
- Общее (разрешено обоим): `core/`, `i18n/`, `theme`, `assets/`, корневой `lib`.
- Плагин **конфигурируем** (опции `old`/`new` + `root`/`alias` в
  `eslint.config.js`): перенос старых файлов в папки `old/` — это правка
  glob-паттернов в настройке, а не код правила.
- Изоляция уже достигнута: старый `lib/v1/registry.ts`/`registry-helpers.ts` не
  тянут `registry-schema` (пилоты add-border/add-stroke работают через
  `params`), `registry.ts` не импортирует `ToolSchema`; новый `list-tools`
  использует `$lib/tool-icons.ts`, а не старые `lib/v1/tools/tool-icons.ts`.

Линтер только показывает ошибки, старый код (непрефиксованные токены, hex в
`app_v1.css`) — известный техдолг, его НЕ чинить и не игнорировать правилами.
