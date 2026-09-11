# AGENTS.md

Инструкции для агентов (и IDE-ассистентов) по работе с этим репозиторием.

## Стек

- **SvelteKit** (`web/`) — основное приложение, Svelte 5 (runes).
- Менеджер пакетов: **pnpm**. Запускать команды из `web/`, либо через обёртки в
  корне: `pnpm build`, `pnpm dev` (это `pnpm --dir web ...`). Не использовать
  npm.
- Сборка: `pnpm --dir web build`, проверка типов:
  `pnpm --dir web exec svelte-check --tsconfig ./tsconfig.json`, тесты:
  `pnpm --dir web test` (Vitest), e2e: `pnpm --dir web test:e2e` (Playwright,
  `web/e2e/`, свой webServer на `pnpm build` + `scripts/serve-static.mjs`, порт
  4173).
- Форматирование: `pnpm format` в корне (оба прогона) или
  `pnpm --dir web format` (только код web/). Проверка: `pnpm check:docs`
  (docs) + `pnpm --dir web exec prettier --check .` (код).
- Линтинг: `pnpm --dir web lint` (ESLint). Полный прогон дизайн-проверок:
  `pnpm --dir web lint:all` (ESLint + stylelint + токен-аудит). Каждый шаг
  выполняется, даже если предыдущий упал. Текущие «ожидаемые долги» (hardcoded
  размеры в kit до C19, не-Prefix токены в `app_v1.css`) — техдолг: чинить
  только по заведённым tasks, не игнорировать правилом.

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
`import type` поднимаются наверх файла.

> Правило «всегда `interface Props` + `let {...}: Props = $props()`» стандартным
> ESLint-правилом не покрывается — остаётся конвенцией.

### Дизайн: новый визуальный язык

Описание дизайна — в `docs/plan-redesign.md`. Общие правила:

- Новый дизайн живёт в `web/src/app.css` (корневые маршруты), старый — в
  `web/src/app_v1.css` (маршруты `/v1/*`).
- Все повторяющиеся визуальные элементы — отдельные компоненты в
  `web/src/lib/components/`, даже «просто div с двумя стилями».

### Линтинг дизайн-токенов

Запрещено «захардкоживать» дизайн: цвета, размеры, длительности и z-index
обязаны приходить из CSS-переменных. Прогон: `pnpm --dir web lint:all`.

- **Цвета**: только `hct(...)` в `app.css`, seed-токены
  (`--brand-main`/`--brand-alt`) и `color-mix(...)` — исключения.
  `oklch()/rgb()/#hex` в `--color-*` запрещены.
- **Размеры**: `--space-*`, `--text-*`, `--radius-*`, `--size-*`.
- **Breakpoints**: `@custom-media --bp-*` (объявления в `app.css`, используются
  как `@media (--bp-*)`).
- **z-index**: `--z-*`; **длительности**: `--duration-*`, `--ease-*`.
- В `<style>` svelte-компонентов: нельзя хардкодить цвета/размеры/длительности,
  нельзя использовать необъявленные `var(--x)`, нельзя путать категории
  (color-токен в size-свойстве).

Детали: полный список правил плагина, токены-префиксы, настройка stylelint — см.
`web/eslint-plugins/README.md`.

### Изоляция веток old ↔ new

Старый (`v1/`) и новый UI полностью изолированы: ESLint-правило
`isolation/no-mixed-imports` резолвит каждый импорт до файла и запрещает
смешивание.

- Trunk-based: коммиты делает разработчик после ревью, самому не коммитить.
  Изменения делать небольшими (< ~500 строк), атомарными.
