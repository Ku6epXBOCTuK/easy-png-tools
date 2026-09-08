# Plan: `/preview/list-tools` → design2 (catalog)

> **СТАТУС: ВЫПОЛНЕН (2026-09-07) — устарел.** Каталог `/preview/list-tools`
> переписан на `CatalogHeader` / `CatalogToolbar` / `CatalogGroup` / `ToolCard`
> (kit), поиск и фильтры функциональны. Доводка верности против рефа остаётся в
> рамках `plan-design-fix.md`.

Ветка `feat/redesign`. Цель — привести каталог инструментов к рефу
`refs-html/list-tools.html`. Сейчас страница вообще не на design2: по
мульти-аудиту `onlyOurs=257, onlyRef=54` (демо-страница — `18/11`).

## Текущее состояние

- `src/routes/preview/list-tools/+page.svelte` использует собственную вёрстку
  (`.catalog` / `.cat-head` / `.cat-grid`) + `Panel` / `PanelHeading` /
  `ToolCard` (kit). Нет поиска, фильтров, счётчика, навигация по категориям
  сделана через `Panel`-блоки, а не через `.catalog-groups`.
- Реф (`list-tools.html`) строит:
  - `.catalog-page` → `.catalog-head` (`.eyebrow`, `h1` «Tool catalog», `p`
    lede, `.catalog-total` «NN TOOLS AVAILABLE» с большим числом),
  - `.catalog-toolbar` (`.catalog-search` + `.catalog-filters` с кнопками),
  - `.catalog-groups` (grid `repeat(2,minmax(0,1fr))`, gap `56px 28px`) →
    `.catalog-group` (`.group-title` «CAT · NN TOOLS») → `.tool-cards` →
    `.tool-card`.
- `.tool-card` (реф) — `display:grid`, колонки `42px minmax(0,1fr) 24px 18px`,
  `min-height:106px`, `gap:14px`, `padding:16px`: `.tool-icon` (42×42 синий
  размытый квадрат), `.tool-copy` (`strong` 13px mono + `span` 12px mono muted),
  `.tool-index` (10px mono, сверху), `.tool-arrow` (появляется при hover).
- Токены `design2.css` уже совпадают с рефом (`--background #eef1f4`,
  `--panel #f8fafb`, `--foreground #17212b`, `--muted #6d7883`,
  `--line #cbd3da`, `--blue #1769d2`, `--radius 4px`) — править токены не нужно.

## Шаги

1. **Restyle `kit/ToolCard.svelte`** под реф (меняется «на месте» — используется
   ещё в `preview/+page` и `preview/kit`, стиль унифицируется, ок):
   - grid-колонки `42px minmax(0,1fr) 24px 18px`, `align-items:center`,
     `gap:14px`, `min-height:106px`, `padding:16px`, `border:1px solid line`,
     `background:panel`, `border-radius:radius`.
   - `.tool-icon`: 42×42 `place-items:center`,
     `background:color-mix(in srgb, var(--blue) 12%, transparent)`,
     `color:var(--blue)` (реф использует `--panel-strong`; вместо нового токена
     берём этот `color-mix`).
   - `.tool-copy strong`: `600 13px var(--font-mono)`; `span`: `12px/1.5 mono`
     `muted`.
   - `.tool-index`: `10px mono muted`, `align-self:start`.
   - `.tool-arrow`: `color:var(--blue)`, `opacity:0` → `1` +
     `translate(2px,-2px)` на `.tool-card:hover`.
   - DOM-порядок как в рефе: `icon, copy, index, arrow`.
   - `href` через `resolve` из `$app/paths` (убрать `svelte-ignore`).

2. **`kit/CatalogHeader.svelte`**: `.eyebrow` «EASY-PNG-TOOLS / CATALOG», `h1`
   «Tool catalog», lede; `.catalog-total` с динамическим `TOOLS.length` (реф
   показывает `32`).

3. **`kit/CatalogToolbar.svelte`**: `.catalog-search` (иконка + `<input>`) и
   `.catalog-filters` (кнопки по категориям). Состояние `query` / `category`
   поднимается наружу через `bind:` (или callback-пропы), чтобы страница
   фильтровала список. Фильтры функциональные (клиентский фильтр по названию +
   категории), не декоративные.

4. **`kit/CatalogGroup.svelte`**: `.group-title` (uppercase label категории +
   «NN TOOLS») + слот со списком карточек; сетка `.tool-cards` — `gap:10px`
   (реф), на мобиле (`@media max-width:800px`) всё схлопывается в 1 колонку.

5. **Переписать `preview/list-tools/+page.svelte`** как тонкую композицию:
   - обёртка `.catalog-page` (`padding:60px clamp(24px,4vw,72px) 72px`);
   - `<CatalogHeader />`;
   - `<CatalogToolbar bind:query bind:category />`;
   - `.catalog-groups` из отфильтрованных групп (по `CATEGORIES`, пересчитав
     `tools` с учётом `query`/`category`);
   - внутри `<CatalogGroup>` — `<ToolCard>` на каждый tool
     (`href= "/preview/tools/{id}"`, `icon` из `tool-icons`, `index` по порядку,
     `title`/`description` из registry);
   - убрать `Panel`/`PanelHeading` из этого маршрута.

6. **Категории/локализация**: labels привести к рефу (реф: ALL / CONVERT /
   TRANSPARENCY / COLOR / GEOMETRY / FILTERS / ANALYZE). Наши `CATEGORIES`
   (`convert/alpha/color/geometry/filters/text/analyze/generate`) — сопоставить
   (`alpha`→TRANSPARENCY и т.п.); точное сопоставление уточнить по рефу и
   `i18n/ru.ts`. Фильтры = ALL + те же label'ы. Тексты заголовков/lede — по рефу
   (англ. «Tool catalog» / «Focused utilities for working with PNG…»), либо
   оставить RU-вариант, если это сознательное отклонение (зафиксировать).

7. **Адаптив**: перенести правила рефа (`@media max-width:800px`) —
   `.catalog-groups` → 1fr, `.tool-card` → `38px minmax(0,1fr) 18px`, скрыть
   `.tool-index`/показать `.tool-arrow`, `.catalog-head` в колонку и т.д.

## Верификация

- `pnpm lint`, `pnpm exec svelte-check --tsconfig ./tsconfig.json`, `pnpm build`
  — без ошибок.
- `pnpm refs-audit` (теперь мульти-маршрутный) → глянуть секцию
  `/preview/list-tools`: `onlyOurs`/`onlyRef` должны упасть с `257/54` примерно
  до уровня demo (`18/11`). Остаточный diff (если будет) зафиксировать в этом
  файле.

## Примечания

- `ToolCard` правится на месте — влияет на `preview/+page` и `preview/kit` (там
  тоже карточки каталога, унификация уместна).
- Старый дизайн (`routes/(old)/**`, `components/search/**`) не трогать.
- Коммиты делает автор (агент не коммитит).
