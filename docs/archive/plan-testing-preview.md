# План: тестирование preview перед промоушеном в главную

> Статус: **реализация завершена**. Playwright-набор в `web/e2e/` (108 тестов:
> 104 прошли, 4 `test.fixme` — известные баги №1–4 ниже), ручной чек-лист —
> `docs/checklist-manual-testing.md`. План ветки preview
> (`web/src/routes/preview/**`, регистр `lib/registry-new/`, 121 инструмент)
> перед шагом C17 из `docs/plan-redesign.md` (переезд preview → реальные
> маршруты).
>
> Охват: **документация плана** — реализация тестов (Playwright-раннер, сами
> тесты) делается отдельными задачами после ревью этого документа.
>
> Приоритет: **отсутствие падений/ошибок** > пиксельная корректность. Дизайн
> доделываем по ходу, визуальная сверка — ручная и вторичная.
>
> Команды для проверки в процессе:
>
> - `pnpm --dir web test` — существующий Vitest (42 файла, 121 инструмент
>   частично покрыт юнит-тестами).
> - `pnpm --dir web test:e2e` — Playwright (`web/e2e/`), сборка +
>   `scripts/serve-static.mjs` на 4173.
> - `pnpm --dir web exec svelte-check --tsconfig ./tsconfig.json` — проверка
>   типов.
> - `pnpm --dir web lint:all` — ESLint + stylelint + токен-аудит.
> - `pnpm --dir web build` — статическая сборка (adapter-static).

## 0. Что тестируем

Preview-ветка — клиентское SPA на SvelteKit (adapter-static, всё в браузере,
никакого API). Структура:

| Маршрут                               | Что это                                                                                      |
| ------------------------------------- | -------------------------------------------------------------------------------------------- |
| `/preview`                            | Workspace: поиск + сетка `ToolCard` (топ-24), «Open last project» (stub), футер              |
| `/preview/kit`                        | Витрина всех kit-компонентов (light/dark)                                                    |
| `/preview/list-tools`                 | Каталог: 8 групп, 121 инструмент, фильтр по категории, поиск                                 |
| `/preview/tools/[id]`                 | Страница инструмента: `SchemaToolView` (настройки + live preview), prerendered на все 121 id |
| `/preview/tools/xxx` (несуществующий) | 404 → `EmptyState` «Tool not found»                                                          |

Инструменты: **121**, категории CONVERT / TRANSPARENCY (alpha) / COLOR /
GEOMETRY / FILTERS / TEXT / ANALYZE / GENERATE. Режимы инструмента:

- **file** (transform): upload → `run` → картинка → download;
- **text** (convert-source): ввод текста → `runFromText` → картинка, либо
  `textToText` → текстовый результат;
- **verdict** (`result: "verdict"`, file): `toText` → текстовый вердикт;
- **text-output** (`result: "text"`, file): `toText` → текстовый результат;
- **generate**: без входа, `executeGenerate` → картинка.

Исполнение: `preview/executor` — worker с fallback на main-thread (domOnly / нет
Worker / ошибка worker). Auto-run с debounce 200 мс.

## 1. Функциональные блоки для проверки

### A. Инфраструктура и навигация

1. Все 4 маршрута + 404 открываются без console errors, uncaught exceptions и
   failed requests.
2. Поиск на `/preview` — фильтрация по названию/описанию, пустой результат →
   аккуратное empty-state.
3. Каталог `/preview/list-tools` — 8 групп, счётчик 121, фильтр категории,
   иконки не падают.
4. Тема light/dark и язык RU/EN переключаются на превью-страницах без регресса
   рендера.
5. 404 на несуществующий id инструмента → EmptyState, без краша.
6. Prerender: `pnpm --dir web build` проходит; все 121 страницы
   `/preview/tools/[id]` генерируются (проверка `entries()`/`getTool`).

### B. Конвейер инструмента (file-инструменты)

7. Upload → авто-run → результатный тайл появился, поле ошибки пустое.
8. Download — событие download, имя `<toolId>.<ext>`, MIME соответствует
   `output`.
9. Reset — возвращает дефолты, сбрасывает результат и ошибку.
10. Смена параметра → авто-перезапуск (debounce 200 мс) без «залипания»
    running-стейта.
11. Worker-исполнение и fallback-исполнение оба дают результат.

### C. Текстовые инструменты и вердикты

12. Text-source: ввод → текстовый результат или картинка; copy/download .txt.
13. Вердикты (analyze): корректный вердикт на PNG с альфой, на PNG без альфы, на
    не-PNG входе → без падений.
14. Пустой text-source → run пропускается без ошибки.

### D. Генераторы

15. Каждый генератор по дефолтам создаёт картинку; смена размеров/цвета
    перегенерирует; канва ожидаемого размера.

## 2. Репрезентативная выборка по категориям (для «нет падений»)

Полный прогон всех 121 — опционально (C/all); минимальный чек — по группам:

| Категория    | Кол-во | Охват для «нет падений»                                                           |
| ------------ | ------ | --------------------------------------------------------------------------------- |
| CONVERT      | 14     | convert-png-to-jpg, convert-png-to-webp, png-to-base64, base64-to-png, svg-to-png |
| TRANSPARENCY | 20     | remove-background, round-corners, add-stroke, remove-color-from, circle-mask      |
| COLOR        | 25     | grayscale, invert, black-and-white, quantize, dithering, png-to-hsl               |
| GEOMETRY     | 18     | resize, crop, rotate, flip, add-border, tile                                      |
| FILTERS      | 8      | blur, sharpen, pixelate, add-noise                                                |
| TEXT         | 3      | add-text, date-stamp, watermark-tile                                              |
| ANALYZE      | 12     | extract-color-from, show-transparent-pixels, verify-is-png, png-is-transparent    |
| GENERATE     | 21     | create-empty, linear-gradient, two-colors, placeholder, text-to-png               |

## 3. Playwright (авто) против ручного — разбиение

### ✅ Playwright — детерминированные сквозные потоки и «нет падений»

- Все маршруты + 404: открытие, отсутствие console errors / uncaught exceptions
  / failed requests (слушатели `page.on('console'/'pageerror')`).
- Поиск и каталог: фильтрация, счётчики, переходы.
- Upload (`setInputFiles` с фикстурой PNG) → авто-результат → Download (ожидание
  `download` события, проверка имени/расширения/suggestedFilename).
- Reset / смена параметра → перегенерация, running не «залипает».
- Тема light/dark и язык RU/EN.
- Текстовые инструменты: ввод → текстовый результат → копия/скачивание.
- Вердикты на подготовленных фикстурах (PNG с альфой, PNG без альфы,
  JPG/некартинка).
- Генераторы: дефолты → результат появился, размер канвы ожидаемый.
- 404 и empty-state.
- Worker и fallback: сравнить оба пути рендера (инжект отключения Worker).

### 🔄 Playwright + ручная сверка

- Пиксельная корректность результата (сравнение `<canvas>` через
  `toDataURL`/тест-per-pixel) — по приоритету вторично; эталоны задаются
  вручную, делать отдельной задачей.
- Реальные пользовательские картинки (не фикстуры) — вручную.

### ✋ Ручное тестирование

- **Краевые PNG:** большие (мегапиксели), 1×1, анимация, палитровые,
  чекерборд/полупрозрачность, повреждённые файлы → нет зависаний, понятные
  сообщения об ошибке.
- **Края параметров:** экстремальные значения, NaN/пустые поля, инвалидные цвета
  в плашках/градиентах → корректная санитизация (silent repair).
- **Производительность/отзывчивость:** задержка авто-реранов на слайдерах, нет
  «залипания» UI, скролл при длинных настройках.
- **Визуальный слой дизайна** (доделываем по ходу): сетки, выравнивание, отступы
  на брейкпоинтах mobile/tablet/desktop (640/800/1100).
- **Буфер обмена** (copy) в реальном браузере.
- **Drag-n-drop** файла на dropzone (UX-ощущения).
- **Разные браузеры:** Firefox/Safari-нюансы (webkit в Playwright опционален).
- **Субъективная корректность:** dithering, two-colors, watermark, текст
  не-ASCII/кириллица в add-text/date-stamp/watermark-tile.

## 4. Критерии приёмки (доступ в главную)

1. Все 4 маршрута + 404 открываются без console errors и исключений.
2. Репрезентативный прогон по 8 категориям: ни один инструмент не падает и не
   показывает поле ошибки.
3. Upload → результат → download завершается для file-инструментов;
   текст/вердикты/генераторы дают корректный output-тип.
4. `pnpm --dir web test`, `pnpm --dir web lint:all`, `pnpm --dir web build`
   зелёные.
5. Тема и язык переключаются без регрессов.

## 5. Оценка покрытия

- **~60–70%** «нет падений/ошибок» закрывается Playwright детерминированно
  (маршруты, сквозные потоки, отсутствие ошибок).
- **~30–40%** — руками: краевые PNG/параметры, реальные пользовательские файлы,
  буфер обмена, кросс-браузеры, визуальный/производительный слой, субъективная
  корректность.

## 6. Шаги реализации (после ревью)

1. ✅ Playwright-раннер: `web/playwright.config.ts` (webServer на
   `pnpm build + `scripts/serve-static.mjs` `--port
   4173`), папка `web/e2e/`, npm-скрипт `test:e2e`.
2. ✅ Фикстуры PNG (генерируются в рантайме, `web/e2e/helpers/fixtures.ts`): с
   альфой, без альфы, 1×1, большой, повреждённый, ландшафт.
3. ✅ E2E по блокам A–D и секции 3 (авто-часть): `navigation.spec.ts`,
   `catalog.spec.ts`, `pipeline.spec.ts`, `text-and-verdicts.spec.ts`,
   `tools-smoke.spec.ts` (матрица ~71 инструмента), `generators.spec.ts`,
   `known-issues.spec.ts` (fixme).
4. ✅ Ручной чек-лист из секции 3 (ручная часть) —
   `docs/checklist-manual-testing.md` (разделы A–G, включая известные баги).
5. ✅ Найденные баги (зафиксированы как `test.fixme` + чек-лист §G):
   1. генераторы (21/121) не имеют кнопки «Generate» и полей схемы — результат
      через UI недостижим;
   2. `resize-png` с дефолтом 0×0 → `errors.resizeSize` при любом входе;
   3. `crop-png` с дефолтом 0×0 → `errors.cropSize` при любом входе;
   4. ключи ошибок показываются сырыми (`errors.*`) вместо переведённого текста
      из `en.ts`/`ru.ts`. Исправления — отдельными атомарными задачами по
      конвенции AGENTS.md (после правок: `lint:all`, `test:e2e`).

## 7. Итоговое состояние на момент сдачи

- `pnpm --dir web test:e2e` — **104 passed, 4 skipped (fixme), 0 failed**.
- `pnpm --dir web lint:all` и `svelte-check` — зелёные.
- Визуальный слой, краевые PNG/параметры, кросс-браузеры — остаются на ручной
  прогон по `docs/checklist-manual-testing.md`.
