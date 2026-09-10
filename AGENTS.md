# AGENTS.md

Инструкции для агентов (и IDE-ассистентов) по работе с этим репозиторием.

## Стек

- **SvelteKit** (`web/`) — основное приложение, Svelte 5 (runes).
- Менеджер пакетов: **pnpm**. Запускать команды из `web/`, либо через
  обёртки в корне: `pnpm build`, `pnpm dev` (это `pnpm --dir web ...`).
  Не использовать npm.
- Сборка: `pnpm --dir web build`, проверка типов: `pnpm --dir web exec svelte-check --tsconfig ./tsconfig.json`,
  тесты: `pnpm --dir web test` (Vitest), e2e: `pnpm --dir web test:e2e` (Playwright,
  `web/e2e/`, свой webServer на `pnpm build` + `scripts/serve-static.mjs`, порт 4173).
- Форматирование: два независимых прогона. Корневой prettier форматирует
  только markdown `docs/` (`.prettierrc` в корне, `pnpm format:docs`, проверка —
  `pnpm check:docs`). Корневой `.prettierignore` — только точечные исключения
  (node_modules, refs-html…), без `/*`-allowlist: он глушит формат-он-сейв
  для всего `web/` (файлы резолвятся как ignored и дочерние конфиги не
  применяются). Код `web/` форматируется
  отдельно: `pnpm --dir web format` (Prettier + `prettier-plugin-svelte`,
  конфиг `web/.prettierrc`, игнор `web/.prettierignore`). Проверка без записи:
  `pnpm --dir web exec prettier --check .`. Оба прогона сразу: `pnpm format`
  в корне.
- Линтинг: `pnpm --dir web lint` (ESLint, flat-конфиг `web/eslint.config.js`).
  Устроен инкрементально:
  - На **весь код** — парсинг TS/Svelte + правило
    `@typescript-eslint/consistent-type-imports` (запрет инлайн-тип-импортов).
  - Полные `recommended`-наборы (`eslint` + `typescript-eslint` + `eslint-plugin-svelte`)
    навешены **только на новый код** (`src/lib/components/kit/**`,
    `src/routes/preview/**`), чтобы старый код не засыпался предсуществующими
    ошибками. Когда старый дизайн удалён (C19), scoped-блок убирается и
    `recommended` включается на весь код.
  - **Scoped-пути двигаются вместе с папками** (см. `plan-redesign.md` §10):
    на C17 `src/routes/preview/**` → `src/routes/**` (preview переезжает на
    реальные маршруты), на C19 при переименовании `kit/`→`ui/` — и компонентный
    glob. Не оставлять устаревшие пути в `eslint.config.js`.
  - Для `*.svelte` выключен `prefer-const` (пропсы в Svelte 5 пишутся через `let`).
- **Единый запуск всей дизайн-проверки: `pnpm --dir web lint:all`**
  (`web/scripts/lint-all.mjs`) — гоняет по очереди: ESLint (все правила,
  включая design-tokens), stylelint (`lint:css`) и токен-аудит
  (`lint:tokens`). Каждый шаг выполняется, даже если предыдущий упал; выход
  ненулевой, если хоть один не прошёл. Текущие «ожидаемые долги» (hardcoded
  размеры в kit, не-Prefix токены в preview.css и т.п.) — техдолг: чинить
  только по заведённым tasks, не игнорировать правилом.

### Тесты кастомных линт-правил

Линт-правила в `web/eslint-plugins/` покрыты юнит-тестами (Vitest):

- `web/eslint-plugins/__tests__/design-tokens.test.ts` — три чистых правила
  (`no-hardcoded-in-svelte`, `no-category-mismatch`,
  `no-token-definition-in-svelte`) через `RuleTester` со строковыми кейсами;
  `no-undefined-in-svelte` — через `Linter` API, т.к. читает словарь токенов из
  `__fixtures__/src/app.css` (не из реального `src/app.css`).
- `web/eslint-plugins/__tests__/no-mixed-imports.test.ts` — isolation-правило
  через `Linter` API с `cwd` на `__fixtures__`: правило резолвит импорты по
  реальным файлам, поэтому цели импортов обязаны существовать на диске.
- Хелпер `__tests__/helpers.ts` собирает `Linter` с `cwd = __fixtures__` —
  `process.cwd()` не трогается, реальные `src/` не читаются.

Запуск: `pnpm --dir web test:rules` (`vitest run eslint-plugins/__tests__`).
Полный `pnpm --dir web test` тоже их гоняет.

Фикстуры живут в `web/eslint-plugins/__fixtures__/` и сами прогоняются линтом
(`eslint .`), поэтому добавление/правка стабов — тоже работа с валидным кодом.
Помнить: `allowDefaultProject` в `eslint.config.js` перечисляет test-файлы и
фикстуры точечно (glob'ы с `**` там запрещены tseslint) — при добавлении
файлов в `__tests__/`/`__fixtures__/` дописать их туда же.

## Правила кода

### Svelte 5: типизация props через `interface Props`

Все типизированные пропсы компонентов описываются через локальный
`interface Props`, а деструктуризация идёт через аннотацию типа при `$props()`:

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    label: string;
    accent?: boolean;
    children?: Snippet;
  }

  let { label, accent = false, children }: Props = $props();
</script>
```

Не использовать инлайн-дженерик `$props<{ ... }>()` — он тяжело читается и
разносит тип и деструктуризацию по разным местам. Также **не использовать
инлайн-импорты в типах** (`children?: import('svelte').Snippet;`) — все
`import type` поднимаются наверх файла. Это правило **включено в ESLint**
(`@typescript-eslint/consistent-type-imports`, `prefer: 'type-imports'`).

> Правило «всегда `interface Props` + `let {...}: Props = $props()`» стандартным
> ESLint-правилом не покрывается — остаётся конвенцией. Кастомное правило
> (eslint-plugin-svelte / свой visitor) — TODO, позже.

### Дизайн: новый визуальный язык

Переезд на новый дизайн описан в `docs/plan-redesign.md`. Ключевые
ограничения при работе с веткой `feat/redesign`:

- Глобальные стили старого и нового дизайна разнесены по layout без
  наследования: старое в `web/src/app.css` (группа `(old)/`), новое в
  `web/src/lib/styles/design2.css` (ветка `preview/*`). Префикс `.ds2` не
  используется.
- Все повторяющиеся визуальные элементы — отдельные компоненты в
  `web/src/lib/components/kit/`, даже «просто div с двумя стилями».

### Линтинг дизайн-токенов («единая точка правды» дизайна)

Запрещено «захардкоживать» дизайн: цвета, размеры, длительности и z-index
обязаны приходить из CSS-переменных. Стек: **stylelint** прогоняется по всем
CSS-файлам (`web/stylelint.config.js`), **ESLint** лезет в `<style>`-блоки
svelte-компонентов через локальный плагин `web/eslint-plugins/design-tokens/`
(постпрефес postcss AST от svelte-eslint-parser). Правила применяются к тем же
scoped-путям (`kit/**`, `preview/**`).

Команды:

- `pnpm --dir web lint:css` — stylelint по всем `src/**/*.css` (`old.css` и
  `node_modules/build/.svelte-kit/static` игнорируются).
- `pnpm --dir web exec node scripts/check-tokens.mjs` — токен-аудит по
  preview.css (лёгкий оркестратор поверх `web/scripts/token-audit/*`);
  проверяет три вещи. Каждый цветовой
  токен из `:root` обязан иметь пару в `[data-theme="dark"]` и наоборот.
  Производные токены (значение содержит `var()`, напр. `hct(from var(--...))`)
  из пары исключены — они наследуют тему автоматически. Выводит **варнинг** о
  неиспользуемых токенах preview.css (определены, но нигде не используются) —
  выход он не меняет. Провалом (exit 1) считаются только parity и hct-авторство.
- Тот же скрипт проверяет **hct-only для цветов**: ЛЮБОЕ цветовое значение в
  preview.css обязано быть `hct(...)` — и литерал, и производное
  `hct(from var(...) h c t)` (вся палитра считается через hct-каналы; эммит в
  sRGB-hex делает postcss-плагин `web/scripts/postcss-hct.mjs`). Исключения:
  только `--brand-main` / `--brand-alt` (seed-токены, любая форма) и
  `color-mix(...)` (единственный легальный способ смешать два токена).
  `oklch()/rgb()/#hex` в `--color-*` запрещены.

Токены-префиксы (целевой словарь дизайна):

- Цвета: `--color-*`, бренд `--brand-main` / `--brand-alt` — единственные
  две переменные, которым разрешено быть hex/rgb, остальные цвета — только
  `hct()` (эммит в sRGB-hex делает postcss-плагин `web/scripts/postcss-hct.mjs`)
  и только в preview.css.
- Размеры: `--space-*`, `--text-*` (font-size), `--radius-*`, `--size-*`.
- Брейкпоинты: `@custom-media --bp-mobile (max-width: 640px)` /
  `--bp-tablet (800px)` / `--bp-desktop (1100px)` — объявляются в preview.css,
  используются как `@media (--bp-*)`. CSS-переменные в `@media` не работают,
  поэтому отдельных `--bp-*` токенов нет; раскрытие делает postcss-плагин
  `postcss-custom-media` (конфиг `web/postcss.config.js`, определения
  подтягиваются через `@csstools/postcss-global-data`).
- z-index: `--z-*`; длительности/анимации: `--duration-*`, `--ease-*`.
- Правило `custom-property-pattern` в stylelint тестирует паттерн **без** `--`
  (`--x` → `x`), а `declaration-property-value-disallowed-list` — целиком с `--`.
- `custom-property-empty-line-before` перенастроен (`after-custom-property` в
  `ignore`, не в `except`): пустые строки между подряд идущими токенами
  **свободны** и `--fix` их не удаляет — можно группировать цветовые и размерные
  токены в preview.css отдельными блоками.

Правила плагина (компоненты, `eslint.config.js`):

- `design-tokens/no-hardcoded-in-svelte` — запрет прямых цветов/размеров/
  длительностей/z-index и `color-mix()` (результат токенизировать в CSS).
  Исключения размеров: `0`, `0px`, `1px`, проценты и unitless (`line-height`).
- `design-tokens/no-category-mismatch` — size-свойство не может использовать
  color-токен (`--color-*`/`--brand-*`) и наоборот.
- `design-tokens/no-token-definition-in-svelte` — определение `--x:` в
  компоненте не может содержать примитив (hex/rgb/oklch/px/rem); допустимы
  производные от токенов (`var()`, `calc()`, unitless-числа).
- `design-tokens/no-undefined-in-svelte` — `var(--x)` в `<style>` должен быть
  определён в `src/preview.css` (словарь токенов) или локально в компоненте.
  Файл читается один раз и кэшируется (не `glob`-зависим).

### Изоляция веток old ↔ preview

`isolation/no-mixed-imports` (`web/eslint-plugins/isolation/no-mixed-imports.js`,
включён на весь `**/*.{ts,svelte}`) — **полная взаимная изоляция** старого UI и
новой preview-ветки. В отличие от `no-restricted-imports`, правило **резолвит**
каждый импорт (и `$lib/...`, и относительные `./`/`../`) до реального файла и
классифицирует стороны по фактическому пути, поэтому относительным импортом
правило не обойти.

- Старое: `routes/(old)/**`, `lib/old/**`.
- Новое: `routes/preview/**`, `lib/registry-new/**`, `lib/preview/**`,
  `lib/registry-schema.ts`, `lib/registry-schema.test.ts`, `lib/components/kit/**`.
- Общее (разрешено обоим): `core/`, `i18n/`, `theme`, `assets/`, корневой `lib`.
- Плагин **конфигурируем** (опции `old`/`new` + `root`/`alias` в
  `eslint.config.js`): перенос старых файлов в папки `old/` — это правка
  glob-паттернов в настройке, а не код правила.
- Изоляция уже достигнута: старый `registry/` не тянет `registry-schema`
  (пилоты add-border/add-stroke работают через `params`), `registry.ts` не
  импортирует `ToolSchema`; preview-`list-tools` использует копию
  `preview/tool-icons.ts`, а не старый `tools/tool-icons.ts`.

Линтер только показывает ошибки, старый код (непрефиксованные токены, hex в
preview.css) — известный техдолг, его НЕ чинить и не игнорировать правилами.

- Коммиты мелкие (< ~500 строк), атомарные
