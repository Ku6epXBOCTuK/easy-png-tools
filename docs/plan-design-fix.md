# План: доводка дизайна до верности (фикс по refs)

> Статус: к выполнению. Ветка `feat/redesign`.
> Источники: `docs/archive/demo-fidelity.md` (архивная копия старого отчёта по
> верности, неактуальна), `docs/plan-redesign.md` (общая стратегия, фазы 1–4
> выполнены до C16). Актуальный аудит верности — `pnpm refs-audit` (Playwright) →
> `web/audit/audit-report.md`.

## Контекст

- Новый дизайн собран параллельно под `preview/*` (см. `plan-redesign.md`),
  старый сайт `(old)/` не трогаем до C17.
- `refs/` и `refs-html/` приведены к консистентному виду — текущая «правда по
  пикселям». Механизм синхронизации ref→код не создаётся (см. §9 plan-redesign).
- Аудит верности автоматизирован: `pnpm refs-audit` (Playwright, 1440×900) пишет
  `web/audit/audit-report.md` — light/dark токены + поэлементный дифф стилей;
  пиксель-дифф не используется. Палитры токенов уже сверены с рефом (light
  совпадает, dark собран). Темы в `refs-html` переключаются — скрипт инжектится
  в `scripts/extract-static.mjs`.
- Исходный отчёт `demo-fidelity.md` перенесён в `docs/archive/` как утративший
  актуальность; его данные актуализированы ниже (Этап 1).
- Зафиксированные решения (подтверждены автором):
  - **F1 — плоский фон холста**, без blueprint-сетки (как в рефе).
  - **F4 — preview-stack в одну колонку** (как в рефе).

## Принципы

- Никаких правок старого дизайна `(old)/` и старого `ui/`.
- Компоненты пишем в `kit/` (переименование в `ui/` — на C19 по plan-redesign).
- Коммиты атомарные (< ~500 строк), по 1–2 компонента; после каждого —
  `svelte-check` + `lint` + `build` + `refs-audit` (diff% не должен расти без причины).
- Коммиты делает автор (агент не коммитит).

## Этап 0 — Рефакторинг (SRP / дизайн-обёртки), без изменения визуала

Гигантские страницы (`demo` ~513, `tools/[id]` ~451 строк) дробим на
компоненты единой ответственности; убираем дублирующиеся inline-стили.

Новые обёртки в `src/lib/components/kit/`:

- `FieldGrid` — сетка полей (заменяет `.controls` / `.controls.compact`).
- `ToggleRow` — лейбл + `Toggle` (дублировался в `demo` и `tools/[id]`).
- `PreviewStack` — контейнер превью-плиток, **одна колонка** (реализует F4 в
  одном месте).
- `SectionLabel` — label + strong + actions (вместо `.pipeline-head` /
  `.preview-top`).
- `FileChip` — пилюля файла.
- `PipelineFooter` — reset + auto-note.
- `WorkspaceLayout` — двухпанельная сетка (settings | preview) со sticky +
  брейкпоинт 800px.

Декомпозиция страниц:

- `tools/[id]`: вынести `ParamControl` (диспетчер полей по `ParamDef`),
  `SettingsPanel` (левая панель), `PreviewPanel` (правая панель) —
  колоцированно в `routes/preview/tools/[id]/`. Страница сжимается до
  состояния + глёв.
- `demo`: переписать на те же обёртки + `WorkspaceHeader` (eyebrow + h1 + lede +
  file-chip).

Побочный баг, устраняемый тут же: в `demo` поля сейчас обёрнуты в
`<div class="control-block"><MonoLabel>…</MonoLabel><SliderField label>` —
**двойной лейбл**, т.к. `ColorField`/`SliderField`/`SelectField`/`NumberField`
уже содержат `Field` (MonoLabel) изнутри. При рефакторе убираем внешний
`MonoLabel`, оставляем само поле.

Критерий Этапа 0: визуал идентичен (audit diff% без регрессии), старые тесты
зелёные.

## Этап 1 — Верность (по refs-html; статус на момент плана)

Аудит: `pnpm refs-audit` (Playwright, 1440×900) пишет `web/audit/audit-report.md` —
light/dark токены + поэлементный дифф стилей. Пиксель-дифф не используется.
Палитры токенов уже сверены с рефом: light совпадает (`--background`,
`--panel`, `--foreground`, `--muted`, `--line`, `--blue`), dark собран (16
токенов). Темы в `refs-html` переключаются (скрипт инжектится в
`extract-static.mjs`).

Открытые / решённые пункты (исходник — `docs/archive/demo-fidelity.md`):

- **B1** (открыт, P1): `button, input, select, textarea` рендерятся Arial —
  добавить в reset `design2.css` `font-family: inherit`. Влияет на все страницы.
- **B2** (решён — проверить): двойного топбара нет. `preview/+layout.svelte`
  рендерит ровно один `TopBar`; `demo` свой `.topbar` не рендерит. Подтвердить
  аудитом/визуально при Этапе 1.
- **F1** (решено — плоский фон): наш `--background` уже `#EEF1F4` (как реф);
  видимое отличие было в blueprint-сетке поверх фона. Фикс: убрать `BlueprintGrid`
  из `AppShell`.
- **F2** (сделано C16): тип шага (`StepCard`) — приглушённый mono-текст, не
  синий бейдж; индекс шага — синий `#1769D2`.
- **F3** (сделано C16): подпись превью-тайла (`PreviewTile`) — синяя `#1769D2`.
- **F4** (решено — одна колонка): реализуется в `PreviewStack` (Этап 0),
  колонка = `1fr`.
- **F5** (открыт): вес `MonoLabel` 500 → 400 (как в рефе).
- **F6** (открыт): мета-подписи (MetaRow/MetaList, DIMENSIONS/FORMAT/SIZE)
  fs 10px → 9px.
- **F7** (низкий): копирайт/стиль — у нас `+ Add tool` (реф `Add tool`);
  кнопка `Download result` — сверить с рефом (синяя, ~478×42). Проверить
  визуально (замеры NOT FOUND — артефакт вложенного чипа размера).
- **F8** (низкий): `h1` line-height чуть выше рефа (150px vs 115px).
- **F9** (открыт): вертикальный ритм — подровнять паддинги секций под реф
  (pipeline-head и пр.).
- **F10** (открыт): внутренние отступы preview-панели (паддинг панели).

После Этапа 1 — повторный `refs-audit`, зафиксировать остаточный diff (sub-pixel /
структурный) и обновить статус пунктов выше прямо в этом файле.

## Этап 2 — plan-redesign.md (C17–C21), ОТЛОЖЕНО

Выполняется **только после** того, как новый дизайн доведён до приемлемого
уровня верности (Этапы 0–1). Сами пункты — в `plan-redesign.md` §10 Шаг 5–6:

- **C17**: `preview/*` → реальные маршруты, удалить `(old)/`, корневой
  `+layout.svelte` ← `design2.css`, поправить `newCode` в `eslint.config.js`
  (`src/routes/preview/**` → `src/routes/**`).
- **C18**: правки импортов/редиректов, проверка билда.
- **C19**: удалить старое `ui/` + `app.css`, `kit/` → `ui/` (или оставить),
  раскрыть ESLint `recommended` на весь код.
- **C20**: брейкпоинты 1200/1100/800/480; build без предупреждений; `grep` по
  старым токенам/классам пуст.
- **C21**: опц. удалить `refs/` и `refs-html/` из репо.

## Порядок коммитов (Этап 0)

1. `kit/`: `FieldGrid`, `ToggleRow`, `PreviewStack`, `SectionLabel`, `FileChip`,
   `PipelineFooter`, `WorkspaceLayout` — по 1–2 на коммит.
2. `tools/[id]`: `ParamControl` → `SettingsPanel` + `PreviewPanel` → тонкая
   страница.
3. `demo`: переписать на обёртки.

После каждого коммита: `svelte-check` + `lint` + `build` + `refs-audit`.
