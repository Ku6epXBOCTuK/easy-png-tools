# DOM audit (phase A)

_2026-08-29T01:35:12.853Z_

## Сводка

| route | ref | added | removed | tag | text |
|---|---|---|---|---|---|
| `/preview/demo` | demo.html | 4 | 8 | 2 | 1 |
| `/preview/list-tools` | list-tools.html | 5 | 8 | 1 | 1 |
| `/preview/tools/linear-gradient-png` | gradient.html | 4 | 5 | 1 | 1 |
| `/preview/tools/remove-background-png` | background-remover.html | 4 | 5 | 1 | 1 |

## /preview/demo  (vs demo.html)

- added: **4** (≈227 узл.), removed: **8** (≈210 узл.), tag: **2**, text: **1**

### Расхождения (топ 15)

- `body > div:1` **tag**: ours `div` → ref `main`
- `body > div:1 > div:1 > header:1` **added** (`header` · 20 узл.)
- `body > div:1 > div:1 > div:2` **tag**: ours `div` → ref `section`
- `body > div:1 > div:1 > div:2 > div:1` **added** (`div` · 1 узл.)
- `body > div:1 > div:1 > div:2 > div:2` **text**: ours `` → ref `PNG PROCESSING WORKSPACE`
- `body > div:1 > div:1 > div:2 > div:2 > div:1` **added** (`div` · 203 узл.)
- `body > div:1 > div:1 > div:2 > div:2 > span:1` **removed** (`span` "/" · 1 узл.)
- `body > div:1 > div:1 > div:2 > div:2` **removed** (`div` · 8 узл.)
- `body > div:1 > div:1 > div:2 > div:3` **removed** (`div` · 7 узл.)
- `body > div:1 > div:1 > div:2 > div:4` **removed** (`div` · 97 узл.)
- `body > div:1 > div:1 > div:2 > div:5` **removed** (`div` · 5 узл.)
- `body > div:1 > div:1 > footer:3` **added** (`footer` · 3 узл.)
- `body > div:1 > div:1 > section:2` **removed** (`section` · 65 узл.)
- `body > div:1 > header:1` **removed** (`header` · 21 узл.)
- `body > div:1 > footer:3` **removed** (`footer` · 6 узл.)


## /preview/list-tools  (vs list-tools.html)

- added: **5** (≈986 узл.), removed: **8** (≈297 узл.), tag: **1**, text: **1**

### Расхождения (топ 15)

- `body > div:1` **tag**: ours `div` → ref `main`
- `body > div:1 > div:1 > header:1` **added** (`header` · 20 узл.)
- `body > div:1 > div:1 > div:2 > div:1` **added** (`div` · 1 узл.)
- `body > div:1 > div:1 > div:2 > div:2 > section:1` **added** (`section` · 963 узл.)
- `body > div:1 > div:1 > div:2 > div:2 > div:1` **removed** (`div` "EASY-PNG-TOOLS / CATALOG" · 1 узл.)
- `body > div:1 > div:1 > div:2 > div:2 > h1:2` **removed** (`h1` "Tool catalog" · 1 узл.)
- `body > div:1 > div:1 > div:2 > div:2 > p:3` **removed** (`p` "Focused utilities for working with PNG. Inspect, transform, and export — locally in your browser." · 1 узл.)
- `body > div:1 > div:1 > div:2 > div:2` **removed** (`div` · 4 узл.)
- `body > div:1 > div:1 > footer:3` **text**: ours `` → ref `ALL OPERATIONS RUN LOCALLY YOUR FILES NEVER LEAVE THIS DEVICE`
- `body > div:1 > div:1 > footer:3 > span:1` **added** (`span` "v0.1.0" · 1 узл.)
- `body > div:1 > div:1 > footer:3 > span:2` **added** (`span` "© 2026" · 1 узл.)
- `body > div:1 > div:1 > footer:3 > span:1` **removed** (`span` "•" · 1 узл.)
- `body > div:1 > div:1 > div:2` **removed** (`div` · 13 узл.)
- `body > div:1 > div:1 > div:3` **removed** (`div` · 255 узл.)
- `body > div:1 > header:1` **removed** (`header` · 21 узл.)


## /preview/tools/linear-gradient-png  (vs gradient.html)

- added: **4** (≈186 узл.), removed: **5** (≈99 узл.), tag: **1**, text: **1**

### Расхождения (топ 11)

- `body > div:1` **tag**: ours `div` → ref `main`
- `body > div:1 > div:1 > header:1` **added** (`header` · 20 узл.)
- `body > div:1 > div:1 > div:2` **text**: ours `` → ref `PNG PROCESSING SINGLE TOOL`
- `body > div:1 > div:1 > div:2 > div:1` **added** (`div` · 1 узл.)
- `body > div:1 > div:1 > div:2 > div:2` **added** (`div` · 162 узл.)
- `body > div:1 > div:1 > div:2 > span:1` **removed** (`span` "/" · 1 узл.)
- `body > div:1 > div:1 > footer:3` **added** (`footer` · 3 узл.)
- `body > div:1 > div:1 > div:2` **removed** (`div` · 6 узл.)
- `body > div:1 > div:1 > div:3` **removed** (`div` · 66 узл.)
- `body > div:1 > header:1` **removed** (`header` · 21 узл.)
- `body > div:1 > footer:3` **removed** (`footer` · 5 узл.)


## /preview/tools/remove-background-png  (vs background-remover.html)

- added: **4** (≈186 узл.), removed: **5** (≈104 узл.), tag: **1**, text: **1**

### Расхождения (топ 11)

- `body > div:1` **tag**: ours `div` → ref `main`
- `body > div:1 > div:1 > header:1` **added** (`header` · 20 узл.)
- `body > div:1 > div:1 > div:2` **text**: ours `` → ref `PNG PROCESSING SINGLE TOOL`
- `body > div:1 > div:1 > div:2 > div:1` **added** (`div` · 1 узл.)
- `body > div:1 > div:1 > div:2 > div:2` **added** (`div` · 162 узл.)
- `body > div:1 > div:1 > div:2 > span:1` **removed** (`span` "/" · 1 узл.)
- `body > div:1 > div:1 > footer:3` **added** (`footer` · 3 узл.)
- `body > div:1 > div:1 > div:2` **removed** (`div` · 6 узл.)
- `body > div:1 > div:1 > div:3` **removed** (`div` · 71 узл.)
- `body > div:1 > header:1` **removed** (`header` · 21 узл.)
- `body > div:1 > footer:3` **removed** (`footer` · 5 узл.)
