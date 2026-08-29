# DOM audit (phase A)

_2026-08-29T02:50:59.953Z_

## Сводка

| route | ref | added | removed | tag | text |
|---|---|---|---|---|---|
| `/preview/demo` | demo.html | 0 | 0 | 0 | 0 |
| `/preview/list-tools` | list-tools.html | 0 | 0 | 0 | 0 |
| `/preview/tools/linear-gradient-png` | gradient.html | 5 | 6 | 2 | 1 |
| `/preview/tools/remove-background-png` | background-remover.html | 7 | 6 | 2 | 1 |

## /preview/demo  (vs demo.html)

- added: **0** (≈0 узл.), removed: **0** (≈0 узл.), tag: **0**, text: **0**

### Расхождения (топ 0)

_расхождений нет_


## /preview/list-tools  (vs list-tools.html)

- added: **0** (≈0 узл.), removed: **0** (≈0 узл.), tag: **0**, text: **0**

### Расхождения (топ 0)

_расхождений нет_


## /preview/tools/linear-gradient-png  (vs gradient.html)

- added: **5** (≈154 узл.), removed: **6** (≈72 узл.), tag: **2**, text: **1**

### Расхождения (топ 14)

- `body > main:1 > div:2 > section:1` **tag**: ours `section` → ref `div`
- `body > main:1 > div:2 > section:1` **text**: ours `` → ref `PNG PROCESSING SINGLE TOOL`
- `body > main:1 > div:2 > section:1 > section:1` **added** (`section` · 145 узл.)
- `body > main:1 > div:2 > section:1 > span:1` **removed** (`span` "/" · 1 узл.)
- `body > main:1 > div:2 > section:2` **tag**: ours `section` → ref `div`
- `body > main:1 > div:2 > section:2 > header:1` **added** (`header` · 5 узл.)
- `body > main:1 > div:2 > section:2 > div:2 > div:1` **added** (`div` · 1 узл.)
- `body > main:1 > div:2 > section:2 > div:2 > div:2` **added** (`div` · 1 узл.)
- `body > main:1 > div:2 > section:2 > div:2 > h1:1` **removed** (`h1` "Gradient background." · 1 узл.)
- `body > main:1 > div:2 > section:2 > div:2 > p:2` **removed** (`p` "Create a clean, export-ready gradient with precise control over color, direction and transparency." · 1 узл.)
- `body > main:1 > div:2 > section:2 > span:2` **removed** (`span` "LIVE PREVIEW" · 2 узл.)
- `body > main:1 > div:2 > div:3` **removed** (`div` · 66 узл.)
- `body > main:1 > footer:3 > span:2` **added** (`span` "pipeline is local-only" · 2 узл.)
- `body > main:1 > footer:3 > span:2` **removed** (`span` "gradient tool · local-only" · 1 узл.)


## /preview/tools/remove-background-png  (vs background-remover.html)

- added: **7** (≈152 узл.), removed: **6** (≈77 узл.), tag: **2**, text: **1**

### Расхождения (топ 16)

- `body > main:1 > div:2 > section:1` **tag**: ours `section` → ref `div`
- `body > main:1 > div:2 > section:1` **text**: ours `` → ref `PNG PROCESSING SINGLE TOOL`
- `body > main:1 > div:2 > section:1 > section:1` **added** (`section` · 138 узл.)
- `body > main:1 > div:2 > section:1 > span:1` **removed** (`span` "/" · 1 узл.)
- `body > main:1 > div:2 > section:2` **tag**: ours `section` → ref `div`
- `body > main:1 > div:2 > section:2 > header:1` **added** (`header` · 5 узл.)
- `body > main:1 > div:2 > section:2 > div:2 > div:1` **added** (`div` · 4 узл.)
- `body > main:1 > div:2 > section:2 > div:2 > div:2` **added** (`div` · 1 узл.)
- `body > main:1 > div:2 > section:2 > div:2 > div:3` **added** (`div` · 1 узл.)
- `body > main:1 > div:2 > section:2 > div:2 > h1:1` **removed** (`h1` "Remove background." · 1 узл.)
- `body > main:1 > div:2 > section:2 > div:2 > p:2` **removed** (`p` "Select a background color and tune the edge detection. Changes are processed automatically in your browser." · 1 узл.)
- `body > main:1 > div:2 > section:2 > span:2` **removed** (`span` "LIVE PREVIEW" · 2 узл.)
- `body > main:1 > div:2 > div:3` **removed** (`div` · 71 узл.)
- `body > main:1 > footer:3 > span:2` **added** (`span` "pipeline is local-only" · 2 узл.)
- `body > main:1 > footer:3 > span:2` **removed** (`span` "background remover · local-only" · 1 узл.)
- `body > div:2` **added** (`div` · 1 узл.)
