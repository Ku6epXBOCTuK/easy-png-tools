# План начальной реализации: минимальный рабочий MVP

> **СТАТУС: ВЫПОЛНЕН И ЗАКРЫТ 2026-08-22. Документ перенесён в архив** (`docs/archive/`) и больше не развивается.
>
> **Что сделано по плану:**
> - Шаг 0 — каркас: SvelteKit + adapter-static, design-токены на CSS, лейаут с навигацией по категориям ✔
> - Шаг 1 — ядро: `PixelImage`, декодирование файлов, кодирование PNG/JPEG/WebP, скачивание ✔
> - Шаг 2 — операции ядра: color / geometry / alpha / analyze, чистые функции без DOM ✔
> - Шаг 3 — реестр из 11 инструментов + санитизация параметров ✔
> - Шаг 4 — универсальные UI-компоненты (DropZone, Preview, ParamForm, DownloadButton, InfoPanel, ToolPage) ✔
> - Шаг 5 — маршруты: `/tools/[id]` с prerender всех страниц, главная-каталог по категориям ✔
> - Шаги 6–7 — обработка ошибок, состояния, полировка; верификация ✔
>
> **Checkpoint пройден:** все 11 инструментов вручную проверены в браузере (загрузка → применение → скачивание), включая найденный и исправленный баг resize с сохранением пропорций. Тесты 75/75, svelte-check 0 ошибок, статический экспорт собирается.
>
> **Попутные улучшения сверх плана:** корневой скрипт `pnpm dev`; `sanitizeParams` против пустых/невалидных значений полей; семантика «вписать в размеры» для resize.

## 0. Зафиксированные решения

- **Объём MVP:** только одиночные инструменты «загрузил → настроил → скачал». Пайплайн-workspace (`/workspace`) вне скоупа этого плана.
- **Набор инструментов первого среза:** ~11 базовых EASY (см. §3). Достаточно, чтобы проверить насквозь ядро → реестр → универсальную страницу.
- **Стили:** обычный CSS без фреймворка — design-токены на CSS custom properties, ноль зависимостей.
- **Стек:** SvelteKit + `@sveltejs/adapter-static` + TypeScript, пакетный менеджер pnpm (уже зафиксирован в корневом `package.json`). Весь код сайта — в `web/`.
- **Ядро без DOM:** все пиксельные операции — чистые функции над `PixelImage`; DOM/canvas допускается только в модуле IO и компонентах превью.

---

## 1. Шаг 0 — Каркас проекта

1. Создать SvelteKit-приложение в `web/`: `npx sv create web` (шаблон minimal, TypeScript, без лишних аддонов).
2. `pnpm install` внутри `web/`.
3. `svelte.config.js`: заменить адаптер на `@sveltejs/adapter-static`.
4. `src/routes/+layout.ts`: `export const prerender = true;` — весь сайт prerenderится в статику.
5. `src/app.css`: дизайн-токены (палитра, типографика, отступы, радиусы через CSS custom properties) + минимальный сброс стилей.
6. `src/routes/+layout.svelte`: шапка с названием сайта и навигацией по категориям инструментов (категории — константа из реестра), футер.

**Проверка:** `pnpm dev` открывает пустой каркас; `pnpm build && pnpm preview` отдаёт статический экспорт.

---

## 2. Шаг 1 — Ядро: типы и ввод-вывод

Файлы в `web/src/lib/core/`:

- `types.ts`

  ```ts
  export type PixelImage = { width: number; height: number; data: Uint8ClampedArray }; // RGBA, как ImageData
  ```

- `io.ts` — единственное место ядра, где разрешён canvas/DOM:
  - `decodeFile(file: File): Promise<PixelImage>` — `createImageBitmap(file)` → отрисовка на canvas → `getImageData`;
  - `encode(img: PixelImage, mime: 'image/png' | 'image/jpeg' | 'image/webp', quality?: number): Promise<Blob>` — `putImageData` → `canvas.toBlob`;
  - `downloadBlob(blob: Blob, filename: string): void`.

**Проверка:** юнит-смоук — декодировать фикстурный PNG, закодировать обратно, размеры совпадают.

---

## 3. Шаг 2 — Операции ядра (чистые функции)

Файлы в `web/src/lib/core/`, каждая функция: `(img, params) => new PixelImage`, без мутации входа:

- `color.ts`: `grayscale(img)` (luma), `invert(img)`, `brightnessContrast(img, brightness −100..100, contrast −100..100)`.
- `geometry.ts`: `flip(img, axis)`, `rotate90(img, turns)`, `crop(img, x, y, w, h)` — индексная математика; `resize(img, w, h)` — билинейная интерполяция на TS (не `drawImage`, чтобы ядро осталось DOM-free и воспроизводимым бит-в-бит).
- `alpha.ts`: `removeColorToAlpha(img, hex, tolerancePercent)` — цветовое расстояние → альфа 0.
- `analyze.ts`: `imageInfo(img)` → `{ width, height, hasAlpha, colorCount }`.

**Проверка:** vitest на маленьких матрицах пикселей (2×2, 3×3): flip, rotate, crop, grayscale — ожидаемые значения руками.

---

## 4. Шаг 3 — Реестр инструментов

`web/src/lib/registry.ts` — источник истины для страниц, форм и навигации:

```ts
export type ParamDef =
  | { id: string; label: string; type: "number"; min?: number; max?: number; step?: number; default: number }
  | { id: string; label: string; type: "select"; options: { value: string; label: string }[]; default: string }
  | { id: string; label: string; type: "checkbox"; default: boolean }
  | { id: string; label: string; type: "color"; default: string };

export type ToolEntry = {
  id: string; // slug маршрута
  title: string;
  description: string;
  category: CategoryId;
  params: ParamDef[];
  run: (img: PixelImage, params: Record<string, unknown>) => Promise<PixelImage> | PixelImage;
};
```

Категории (константа там же): `convert`, `alpha`, `color`, `geometry`, `analyze`.

### Состав первого среза — 11 инструментов

| #   | id                               | Категория | Параметры                                             |
| --- | -------------------------------- | --------- | ----------------------------------------------------- |
| 1   | `resize-png`                     | geometry  | width, height, checkbox «сохранять пропорции»         |
| 2   | `crop-png`                       | geometry  | x, y, width, height                                   |
| 3   | `rotate-png`                     | geometry  | select: 90 / 180 / 270                                |
| 4   | `flip-png`                       | geometry  | select: horizontal / vertical                         |
| 5   | `grayscale-png`                  | color     | —                                                     |
| 6   | `invert-colors-png`              | color     | —                                                     |
| 7   | `adjust-brightness-contrast-png` | color     | brightness −100..100, contrast −100..100              |
| 8   | `convert-png-to-jpg`             | convert   | background color (подложка под альфу), quality 0..100 |
| 9   | `convert-png-to-webp`            | convert   | quality 0..100                                        |
| 10  | `remove-color-from-png`          | alpha     | hex color, tolerance %                                |
| 11  | `png-info`                       | analyze   | — особый случай: не картинка, а текстовая сводка      |

Для `png-info` в записи реестра добавляется флаг `resultType: 'info'`; остальные — `'image'`.

**Проверка:** импорт реестра в тесте — все id уникальны, у каждого `params` имеют дефолты, `run` определён.

---

## 5. Шаг 4 — Универсальные UI-компоненты

`web/src/lib/components/`:

- `DropZone.svelte` — drag&drop + клик; эмитит `File`; проверка MIME (PNG/JPEG/WebP/GIF/BMP).
- `Preview.svelte` — рендер `PixelImage` на canvas с fit-масштабированием; шахматный фон под прозрачность.
- `ParamForm.svelte` — генерирует контролы из `ParamDef[]`, двусторонний `bind:values`.
- `DownloadButton.svelte` — encode выбранного формата + `downloadBlob`, имя `<tool-id>.<ext>`.
- `InfoPanel.svelte` — текстовый вывод для `resultType: 'info'`.
- `ToolPage.svelte` — оркестратор страницы инструмента; состояния `idle → loaded → processing → done | error`; раскладка: слева DropZone, справа превью + форма параметров + кнопки «Применить» / «Скачать».

**Правило:** новый инструмент = новая запись в реестре (+ функция операции). Компоненты и маршрут не трогаем.

---

## 6. Шаг 5 — Маршруты

- `/` (`src/routes/+page.svelte`) — сетка карточек инструментов, сгруппированных по категориям; данные из реестра.
- `/tools/[id]` — универсальная страница:
  - `+page.ts`: `entries()` возвращает все `id` из реестра (обязательное условие prerender при adapter-static);
  - `load()` возвращает запись реестра по `id`, неизвестный id → 404;
  - `+page.svelte` — тонкая обёртка над `ToolPage`.

**Проверка:** `pnpm build` — в `build/tools/` лежат все 11 страниц; главная содержит ссылки на каждую.

---

## 7. Шаг 6 — Ошибки и минимальная полировка

- Обработка ошибок: неподдерживаемый формат, ошибка декода, некорректные параметры crop (выход за границы — клампы или понятная ошибка).
- Состояния: «перетащите файл», спиннер во время обработки, disabled-кнопки до загрузки.
- Тексты описаний для всех 11 инструментов (title/description уже в реестре).

---

## 8. Шаг 7 — Верификация и checkpoint

Команды:

```bash
cd web && pnpm dev        # разработка
cd web && pnpm build      # статический экспорт должен проходить без ошибок
cd web && pnpm test       # vitest: ядро (геометрия/цвет) + целостность реестра
```

Ручной smoke-тест каждого из 11 инструментов: загрузка PNG → применить → скачать → открыть результат.

**Checkpoint MVP:** любой из 11 инструментов доступен по прямому URL с главной страницы; PNG загружается drag&drop; параметры применяются; результат скачивается; всё работает офлайн со статического хостинга; ни одной серверной зависимости.
