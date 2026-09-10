# План C17: перенос preview → корень + (old) → /v1/

> Статус: план к выполнению. Предпосылки: tech debt закрыт, backlog №14 (старые
> файлы → lib/old/) выполнен. Домен НЕ блокер (см. plan-redesign.md §10,
> plan-seo.md §6).

## Цель

Новый дизайн становится основным на корневых маршрутах (`/`, `/tools/[id]`,
`/list-tools`). Старый дизайн переезжает на `/v1/*` как архив для справки.
Удаление старого кода (C19) откладывается до полной приёмки нового дизайна.

## Структура маршрутов (до → после)

**До:** `(old)/` даёт URLs `/`, `/demo`, `/list-tools`, `/tools/[id]`.
`preview/` даёт `/preview`, `/preview/list-tools`, `/preview/tools/[id]`,
`/preview/kit`.

**После:** `v1/` даёт `/v1/`, `/v1/demo`, `/v1/list-tools`, `/v1/tools/[id]`.
Корень даёт `/`, `/list-tools`, `/tools/[id]`. Витрина kit — на реальном
маршруте `/kit` (дизайн в стадии тестирования).

## Решения

1. **`v1/` — реальная папка, НЕ route group** — group `(v1)/` не меняет URL, а
   нам нужно чтобы старые страницы жили по `/v1/*`.
2. **Корневой layout: shell нового дизайна** — TopBar, Footer, тема, хлебные
   крошки, импорт `app.css`, `@layer app, design;`.
3. **`v1/+layout.svelte` — только импорт `app_v1.css`** — без
   header/footer/shell.
4. **Тема:** использовать `theme.svelte.ts` (не дублировать локальный `$state`).
5. **`@layer app, design;`** остаётся — design выигрывает у app везде.
6. **`noindex` остаётся** на `tools/[id]/+page.svelte` до покупки домена.
7. **CSS-файлы переименовываются:** `preview.css` → `app.css`, `old.css` →
   `app_v1.css`. Все ссылки обновляются.
8. **`kit/` витрина → `/kit`** — переносится на реальный маршрут вместе с
   остальными preview-страницами; отдельный `preview/+layout` удаляется (`/kit`
   наследует корневой shell).

## Что делать (шаги)

### 1. Rename `(old)/` → `v1/`

Переименовать папку. Обновить `v1/+layout.svelte`: убрать «Preview v2» ссылку,
обновить пути навигации, поправить импорт CSS.

### 2. Новый корневой `+layout.svelte` + rename CSS

Перезаписать текущий нейтральный layout содержимым из `preview/+layout.svelte`
(с правками: тема через `theme.svelte.ts`, путь к CSS). Переименовать
`src/preview.css` → `src/app.css`, `src/old.css` → `src/app_v1.css`. Обновить
все ссылки на эти файлы в проекте ( layout, лайнтеры, eslint-плагины, скрипты,
тесты).

### 3. Move preview pages → корень

Переместить страницы из `preview/` в корень `routes/`: `+page` → `/`,
`list-tools` → `/`, `tools/[id]` → `/`, витрину `kit` → `/kit`. Удалить
`preview/+layout.svelte` (корневой shell заменяет его).

### 4. Update hardcoded `/preview/` URLs

В компонентах с захардкоженными путями `/preview/` заменить на корневые.

### 5. Flatten `kit/` → `components/`

Перенести компоненты из `lib/components/kit/` в `lib/components/`, обновить все
импорты, удалить пустую `kit/`.

### 6. Flatten `preview/` → `lib/`

Перенести код из `lib/previw/` в `lib/`, обновить все импорты, удалить пустую
`preview/`.

### 7. Перенести `old/` → `v1/`

- `$lib/old/` — переименовать в `lib/v1/`, обновить все импорты

### 8. E2E тесты + playwright config

Заменить `/preview/...` на `/...` во всех e2e файлах и конфиге playwright.

### 9. ESLint config + AGENTS.md

Обновить glob-паттерны: `routes/preview/**` → `routes/**`, `components/kit/**` →
`components/**`. Обновить `AGENTS.md`.

### 10. Isolation plugin

Обновить `DEFAULT_OLD`: `routes/(old)/**` → `routes/v1/**`. Убрать
`routes/preview/**` из `DEFAULT_NEW`.

### 11. Archive audit scripts

Перенести скрипты аудита в `scripts/archive/`, убрать вызовы из манифестов.

## Что НЕ меняется

- `routes/+layout.ts` — prerender = true остаётся
- Слаги инструментов (`*-png`) — без изменений
- `/kit` — витрина дизайна остаётся (в стадии тестирования)

## Риски

- **v1/ без shell** — старый дизайн без header/footer.
- **`@layer` взаимодействие** — проверить что design-токены перекрывают
  app-токены на обоих маршрутах.
- **Isolation: shared-классификация** — маршруты нового дизайна shared до C19.
