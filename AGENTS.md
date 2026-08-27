# AGENTS.md

Инструкции для агентов (и IDE-ассистентов) по работе с этим репозиторием.

## Стек

- **SvelteKit** (`web/`) — основное приложение, Svelte 5 (runes).
- Менеджер пакетов: **pnpm**. Запускать команды из `web/`, либо через
  обёртки в корне: `pnpm build`, `pnpm dev` (это `pnpm --dir web ...`).
  Не использовать npm.
- Сборка: `pnpm --dir web build`, проверка типов: `pnpm --dir web exec svelte-check --tsconfig ./tsconfig.json`,
  тесты: `pnpm --dir web test`.
- Форматирование: `pnpm --dir web format` (Prettier + `prettier-plugin-svelte`,
  конфиг `web/.prettierrc`, игнор `web/.prettierignore`). Проверка без записи:
  `pnpm --dir web exec prettier --check .`.
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
- Токены нового дизайна живут в `design2.css`; `refs/` и `refs-html/` —
  одноразовый источник, не поддерживаемый (правки дизайна — сразу в код).
- Коммиты мелкие (< ~500 строк), атомарные
