# Чек-лист ручного тестирования production UI

> Вспомогательный документ к e2e-тестам (`web/e2e/`, `pnpm --dir web test:e2e`)
> и стратегии `docs/testing-strategy.md`. Автоматизированная часть закрывает
> «нет падений/ошибок»; здесь — то, что руками, и что Playwright не покрывает.
>
> Перед прогоном: `pnpm --dir web build`, поднять локально `web/` (dev или build
> → `node scripts/serve-static.mjs`).
>
> Критерий приёмки большинства пунктов: **нет зависаний, нет «залипания»,
> сообщения об ошибках человекочитаемые**.

## A. Краевые PNG-файлы

> Фикстуры для этого раздела генерируются скриптом: `pnpm generate:fixtures` →
> `tests/fixtures/manual-edge-cases/`.

- [ ] Огромное изображение (мегапиксели) — загрузка не висит, прогресс есть.
- [ ] PNG 1×1 — инструменты не падают (проверено авто: flip-png, см. suite).
- [ ] PNG с полупрозрачностью/чётким альфа-краёв (чёрно-белая шахматка) —
      remove-background, feather-edges, clean-edges дают корректные края.
- [ ] Палитровый PNG (индексированные цвета) — конвертируется/анализируется
      (авто-покрытие: `web/e2e/png-fixtures.spec.ts`).
- [ ] Анимированный/APNG, если попадётся — не ломает конвейер.
- [ ] Повреждённый/не-PNG файл — понятная ошибка, нет краша (авто-чека в
      `pipeline.spec.ts` и `png-fixtures.spec.ts`).
- [ ] PNG с битой CRC / 16-bit — как ведут себя анализаторы (ориентация, размер,
      прозрачность); CRC/16-bit авто-покрыты в `png-fixtures.spec.ts`.

### Файлы (`tests/fixtures/manual-edge-cases/`)

| Файл                     | Описание                                                     |
| ------------------------ | ------------------------------------------------------------ |
| `1x1.png`                | Минимальное изображение 1×1, сплошной красный                |
| `1x1-transparent.png`    | 1×1, полностью прозрачный (alpha=0)                          |
| `2x2-extreme.png`        | 2×2: чёрный, белый, полупрозрачный красный, прозрачный синий |
| `1024x1024-checker.png`  | 1024×1024, шахматка ≈1 мегапиксель                           |
| `1920x1080-gradient.png` | 1920×1080, градиент ≈2 мегапикселя                           |
| `alpha-checkerboard.png` | 64×64, чёрно-белая шахматка с чередующейся альфой            |
| `alpha-gradient.png`     | 128×64, альфа-градиент 0→255 по ширине                       |
| `sparse-alpha.png`       | 100×100, 10% пикселей с alpha=0                              |
| `all-black-opaque.png`   | 64×64, сплошной чёрный                                       |
| `all-white-opaque.png`   | 64×64, сплошной белый                                        |
| `all-transparent.png`    | 64×64, полностью прозрачное                                  |
| `palette-4colors.png`    | 32×32, палитровый 4 цвета (RGBW)                             |
| `palette-256.png`        | 64×64, палитровый полная палитра 256 цветов                  |
| `16bit-subtle.png`       | 32×32, 16-bit RGBA, тонкий градиент                          |
| `noise-pattern.png`      | 100×100, шумовая текстура                                    |
| `1x4000-strip.png`       | 1×4000, длинная вертикальная полоса                          |
| `4000x1-strip.png`       | 4000×1, широкая горизонтальная полоса                        |
| `corrupt-bad-crc.png`    | 4×4, повреждённый CRC в IDAT                                 |
| `truncated.png`          | Обрезанный файл (только PNG-заголовок + часть IHDR)          |
| `fake-png.txt`           | Текстовый файл «.png» — не-PNG                               |

## B. Края параметров

- [ ] Экстремальные значения слайдеров (0 и max) в blur/sharpen/pixelate — не
      «залипает» running.
- [ ] Пустые/NaN поля (напр. width/height) — санитизация (silent repair), нет
      красного alert-текста в виде `errors.*`.
- [ ] Невалидные цвета в плашках/градиентах (мисс-спелл `#xyz`, короткие hex,
      именные цвета) — silent repair или понятная ошибка.
- [ ] Пустой text-source на text-инструменте — run пропускается, ошибок нет.
- [ ] Смена параметра после Reset — авто-перезапуск работает (Debounce 200 мс).

## C. Буфер обмена и drag-n-drop

- [ ] В реальном браузере кнопка copy на текстовом результате (png-to-base64 и
      т.п.) кладёт текст в буфер (в Playwright не тестируем из-за permissions).
- [ ] Drag-n-drop файла на dropzone страницы инструмента (не только файл-диалог)
      — UX-ощущения и корректность.

## D. Производительность и отзывчивость

- [ ] Долгие авто-рераны на больших картинках (jpeg-artifacts, dithering,
      quantize на 4К) — UI не фризит, канселяция/дебаунс срабатывает.
- [ ] Скролл страницы при длинных настройках (например, text-инструменты) — нет
      залипаний, панели не прыгают.
- [ ] Вкладка не «съедает» память при 10+ повторах blur/sharpen на мегапикселе
      (утечек blob-URL/bitmap быть не должно).

## E. Визуальный слой (доделываем по ходу)

- [ ] Сетки/выравнивание на брейкпоинтах 640 / 800 / 1100 (mobile/tablet/
      desktop) на всех 4 маршрутах.
- [ ] Тема light/dark: контраст вердиктов (Yes/No), статус «LIVE PREVIEW»,
      мета-инфо бликов не даёт.
- [ ] Иконки в каталоге на всех категориях — не «бьются» (missing icon).
- [ ] Язык RU/EN на превью-страницах — переключение без регресса рендера.

## F. Субъективная корректность

- [ ] dithering / two-colors / quantize — результат «по ощущениям» соответствует
      описанию.
- [ ] watermark-tile / add-text / date-stamp на кириллице — рендер текста
      корректный (не «кракозябры»).
- [ ] remove-background на сложной полупрозрачности — края не «звенят».

## G. Закрытые Q5/Q6b/Q6c/Q6d/Q6e/Q6f.1/Q6f.2/Q6f.3-проблемы

> Q5/Q6b/Q6c/Q6d/Q6e/Q6f.1/Q6f.2/Q6f.3-проблемы закрыты автоматическими тестами;
> для ручной проверки остаются субъективные сценарии разделов A–F.

- [x] **Генераторы:** auto-run по дефолтам, результат и изменение параметра без
      кнопки Generate. `web/e2e/generators.spec.ts`.
- [x] **resize-png/crop-png:** размеры текущего source используются по
      умолчанию, alert не появляется. `web/e2e/pipeline.spec.ts`.
- [x] **Reset:** defaults восстанавливаются, source сохраняется, deferred
      auto-run завершается результатом. `web/e2e/pipeline.spec.ts`.
- [x] **Локализация ошибок:** alert хранит key/vars, переводится при выводе и
      обновляется при смене языка. `web/e2e/i18n.spec.ts`.
- [x] **FileResult → ZIP:** `split-into-parts-png` скачивает
      `split-into-parts-png.zip` с именованными PNG-частями; содержимое и
      сигнатуры проверяются `web/src/lib/zip.test.ts` и
      `web/e2e/pipeline.spec.ts`.
- [x] **Output MIME/quality:** JPG/WebP/BMP имеют ожидаемые расширения и
      сигнатуры, quality 10/90 меняет размер файла; `web/e2e/pipeline.spec.ts`.
- [x] **Malformed/special PNG:** CRC, truncated, palette и 16-bit fixtures
      проходят через upload без краша; `web/e2e/png-fixtures.spec.ts`.
- [x] **Registry smoke:** все 122 production tools имеют специализированный
      browser smoke по input/result-типу; `web/e2e/tools-smoke.spec.ts`,
      `generators.spec.ts`, `text-and-verdicts.spec.ts`.
- [x] **Layout resolver:** `resolveLayoutGroups` покрыт unit-тестами; UI
      группировка полей использует тот же seam.
- [x] **Preview model:** `buildSchemaPreviewModel` покрывает source/result
      values, формат и `hasResult` для image/text/verdict/files.
- [x] **Browser matrix:** pipeline, verdicts и PNG-fixtures проходят в Firefox и
      WebKit, mobile viewport 390×844 — в Chromium; отказ декодера битого PNG
      зафиксирован per-engine. См. раздел 7 `docs/testing-strategy.md`.

## Как долго

- Полный прогон: ~40 минут (все разделы, включая мегапиксели и 4К) в двух
  браузерах.
- Быстрый смоук (< 15 мин): A (кроме мегапикселей), B (выборочно), C, F
  выборочно, G обязательно.
