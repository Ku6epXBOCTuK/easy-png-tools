# AGENTS.md

Инструкции для агентов (и IDE-ассистентов) по работе с этим репозиторием.

## Стек

- **SvelteKit** (`web/`) — основное приложение, Svelte 5 (runes).
- Менеджер пакетов: **pnpm**. Запускать команды из `web/`, либо через
  обёртки в корне: `pnpm build`, `pnpm dev` (это `pnpm --dir web ...`).
  Не использовать npm.
- Сборка: `pnpm --dir web build`, проверка типов: `pnpm --dir web exec svelte-check --tsconfig ./tsconfig.json`,
  тесты: `pnpm --dir web test`.

## Правила кода

### Svelte 5: типизация props через `interface Props`

Все типизированные пропсы компонентов описываются через локальный
`interface Props`, а деструктуризация идёт через аннотацию типа при `$props()`:

```svelte
<script lang="ts">
  interface Props {
    label: string;
    accent?: boolean;
    children?: import('svelte').Snippet;
  }
  let { label, accent = false, children }: Props = $props();
</script>
```

Не использовать инлайн-дженерик `$props<{ ... }>()` — он тяжело читается и
разносит тип и деструктуризацию по разным местам.

> Позже планируется линтер/правило (eslint-plugin-svelte / custom rule),
> запрещающее `$props<...>()` и требующее `interface Props`.

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
