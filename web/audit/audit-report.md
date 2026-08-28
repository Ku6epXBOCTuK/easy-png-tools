# Style audit (multi-route)

_2026-08-28T15:27:27.893Z_

## Сводка

| route | ref | tokL | tokD | els | onlyOurs | onlyRef |
|---|---|---|---|---|---|---|
| `/preview/demo` | demo.html | 10 | 16 | 47 | 18 | 11 |
| `/preview/list-tools` | list-tools.html | 10 | 16 | 30 | 257 | 54 |
| `/preview/tools/linear-gradient-png` | gradient.html | 10 | 16 | 7 | 111 | 30 |
| `/preview/tools/remove-background-png` | background-remover.html | 10 | 16 | 8 | 110 | 28 |

## /preview/demo  (vs demo.html)

- Токены light: **10**, dark: **16**
- Элементы: **47**, только у нас: 18, только в рефе: 11

### Токены — Light

| token | ours | ref |
|---|---|---|
| `--danger` | #e5484d | — |
| `--success` | #25a96a | — |
| `--text-sm--line-height` | — | calc(1.25 / .875) |
| `--text-xs--line-height` | — | calc(1 / .75) |
| `--font-weight-medium` | — | 500 |
| `--spacing` | — | .25rem |
| `--text-xs` | — | .75rem |
| `--radius-md` | — | .375rem |
| `--radius-lg` | — | .5rem |
| `--text-sm` | — | .875rem |

### Токены — Dark

| token | ours | ref |
|---|---|---|
| `--panel` | #182129 | #f8fafb |
| `--blue` | #54a2ff | #1769d2 |
| `--muted` | #91a0ac | #6d7883 |
| `--background` | #11171d | #eef1f4 |
| `--danger` | #ff7479 | — |
| `--foreground` | #e8eef2 | #17212b |
| `--success` | #25a96a | — |
| `--line` | #33414c | #cbd3da |
| `--text-sm--line-height` | — | calc(1.25 / .875) |
| `--text-xs--line-height` | — | calc(1 / .75) |
| `--font-weight-medium` | — | 500 |
| `--spacing` | — | .25rem |
| `--text-xs` | — | .75rem |
| `--radius-md` | — | .375rem |
| `--radius-lg` | — | .5rem |
| `--text-sm` | — | .875rem |

### Расхождения элементов (топ 47)

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>span:nth-child(1)` — "/"
    - **fontFamily**: `"IBM Plex Mono", monospace` → `"IBM Plex Sans", sans-serif`
    - **fontSize**: `10px` → `16px`
    - **color**: `rgb(23, 105, 210)` → `rgb(23, 33, 43)`
    - **margin**: `0px 7px` → `0px`
    - **letterSpacing**: `1.2px` → `normal`
    - **lineHeight**: `normal` → `24px`
    - **display**: `inline` → `block`
    - **rect**: `165,124 7x13` → `1348,20 4x24`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(3)>article:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(3)>div:nth-child(2)>button:nth-child(1)` — "100%"
    - **color**: `rgb(255, 255, 255)` → `rgb(23, 33, 43)`
    - **backgroundColor**: `rgb(23, 105, 210)` → `rgba(0, 0, 0, 0)`
    - **padding**: `0px 11.2px` → `0px`
    - **letterSpacing**: `0.6px` → `0.8px`
    - **display**: `flex` → `block`
    - **rect**: `518,552 49x30` → `680,546 25x12`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(3)>article:nth-child(1)>div:nth-child(1)>span:nth-child(1)` — "01"
    - **fontSize**: `22px` → `11px`
    - **fontWeight**: `600` → `400`
    - **padding**: `0px` → `17px 0px 0px 15px`
    - **lineHeight**: `22px` → `normal`
    - **rect**: `74,464 26x22` → `59,466 46x150`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(3)>article:nth-child(2)>div:nth-child(1)>span:nth-child(1)` — "02"
    - **fontSize**: `22px` → `11px`
    - **fontWeight**: `600` → `400`
    - **padding**: `0px` → `17px 0px 0px 15px`
    - **lineHeight**: `22px` → `normal`
    - **rect**: `74,624 26x22` → `59,628 46x136`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(3)>article:nth-child(3)>div:nth-child(1)>span:nth-child(1)` — "03"
    - **fontSize**: `22px` → `11px`
    - **fontWeight**: `600` → `400`
    - **padding**: `0px` → `17px 0px 0px 15px`
    - **lineHeight**: `22px` → `normal`
    - **rect**: `74,746 26x22` → `59,776 46x150`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(3)>article:nth-child(4)>div:nth-child(1)>span:nth-child(1)` — "04"
    - **fontSize**: `22px` → `11px`
    - **fontWeight**: `600` → `400`
    - **padding**: `0px` → `17px 0px 0px 15px`
    - **lineHeight**: `22px` → `normal`
    - **rect**: `74,896 26x22` → `59,938 46x142`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>button:nth-child(2)>span:nth-child(2)>span:nth-child(1)` — "1.2 MB"
    - **fontSize**: `10px` → `11px`
    - **color**: `rgb(255, 255, 255)` → `rgb(23, 33, 43)`
    - **margin**: `0px` → `5px 0px 0px`
    - **display**: `inline` → `block`
    - **rect**: `1097,240 36x13` → `1246,291 79x13`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>span:nth-child(1)` — "PROCESSING PIPELINE"
    - **letterSpacing**: `1px` → `1.2px`
    - **lineHeight**: `12px` → `normal`
    - **display**: `block` → `inline`
    - **rect**: `58,382 154x12` → `58,400 127x12`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(3)>article:nth-child(4)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>label:nth-child(2)>span:nth-child(1)` — "Preserve aspect ratio"
    - **fontSize**: `13.6px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **display**: `block` → `inline`
    - **rect**: `422,973 129x18` → `432,1021 156x17`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>span:nth-child(1)` — "PIPELINE OUTPUTS"
    - **letterSpacing**: `1px` → `1.2px`
    - **lineHeight**: `12px` → `normal`
    - **display**: `block` → `inline`
    - **rect**: `799,178 94x24` → `799,188 54x36`

### `body>div:nth-child(1)>div:nth-child(1)>header:nth-child(1)>nav:nth-child(2)>a:nth-child(1)` — "Workspace"
    - **fontSize**: `12px` → `10px`
    - **letterSpacing**: `0.48px` → `normal`
    - **rect**: `513,24 69x15` → `792,26 49x12`

### `body>div:nth-child(1)>div:nth-child(1)>header:nth-child(1)>nav:nth-child(2)>a:nth-child(2)` — "Catalog"
    - **fontSize**: `12px` → `10px`
    - **letterSpacing**: `0.48px` → `normal`
    - **rect**: `600,24 54x15` → `864,26 39x12`

### `body>div:nth-child(1)>div:nth-child(1)>header:nth-child(1)>nav:nth-child(2)>a:nth-child(3)` — "Gradient"
    - **fontSize**: `12px` → `10px`
    - **letterSpacing**: `0.48px` → `normal`
    - **rect**: `672,24 61x15` → `924,26 44x12`

### `body>div:nth-child(1)>div:nth-child(1)>header:nth-child(1)>nav:nth-child(2)>a:nth-child(4)` — "Background remover"
    - **fontSize**: `12px` → `10px`
    - **letterSpacing**: `0.48px` → `normal`
    - **rect**: `751,24 138x15` → `990,26 99x12`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>span:nth-child(1)` — "SOURCE"
    - **fontSize**: `10px` → `9px`
    - **letterSpacing**: `0.8px` → `normal`
    - **rect**: `806,317 550x13` → `808,663 30x10`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>span:nth-child(1)` — "STEP 01"
    - **fontSize**: `10px` → `9px`
    - **letterSpacing**: `0.8px` → `normal`
    - **rect**: `806,750 550x13` → `1096,663 35x10`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(3)>span:nth-child(1)` — "STEP 02"
    - **fontSize**: `10px` → `9px`
    - **letterSpacing**: `0.8px` → `normal`
    - **rect**: `806,1182 550x13` → `808,1021 35x10`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(4)>span:nth-child(1)` — "STEP 03"
    - **fontSize**: `10px` → `9px`
    - **letterSpacing**: `0.8px` → `normal`
    - **rect**: `806,1615 550x13` → `1096,1021 35x10`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(5)>span:nth-child(1)` — "FINAL OUTPUT"
    - **fontSize**: `10px` → `9px`
    - **letterSpacing**: `0.8px` → `normal`
    - **rect**: `806,2047 550x13` → `808,1378 59x10`

### `body>div:nth-child(1)>div:nth-child(1)>header:nth-child(1)>div:nth-child(3)>div:nth-child(4)>button:nth-child(2)` — "EN"
    - **letterSpacing**: `0.6px` → `normal`
    - **rect**: `1349,19 32x25` → `1352,20 29x24`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>h1:nth-child(2)` — "Build your image pipeline."
    - **lineHeight**: `51.84px` → `57.6px`
    - **rect**: `58,155 474x104` → `58,154 482x115`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(3)>article:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>span:nth-child(1)` — "BACKGROUND"
    - **display**: `block` → `inline`
    - **rect**: `117,455 171x13` → `143,489 67x12`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(3)>article:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>span:nth-child(1)` — "TRANSFORM"
    - **display**: `block` → `inline`
    - **rect**: `117,615 153x13` → `143,651 60x12`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(3)>article:nth-child(3)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>span:nth-child(1)` — "STYLE"
    - **display**: `block` → `inline`
    - **rect**: `117,737 99x13` → `143,799 34x12`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(3)>div:nth-child(1)>span:nth-child(1)` — "DIMENSIONS"
    - **letterSpacing**: `0.9px` → `normal`
    - **rect**: `1157,216 63x11` → `1073,271 79x10`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(3)>div:nth-child(1)>span:nth-child(2)` — "1200 × 800 px"
    - **margin**: `0px` → `5px 0px 0px`
    - **rect**: `1236,214 86x14` → `1073,291 79x13`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(3)>div:nth-child(2)>span:nth-child(1)` — "FORMAT"
    - **letterSpacing**: `0.9px` → `normal`
    - **rect**: `1157,240 38x11` → `1159,271 79x10`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(3)>div:nth-child(2)>span:nth-child(2)` — "PNG-24"
    - **margin**: `0px` → `5px 0px 0px`
    - **rect**: `1282,238 40x14` → `1159,291 79x13`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(3)>div:nth-child(3)>span:nth-child(1)` — "SIZE"
    - **letterSpacing**: `0.9px` → `normal`
    - **rect**: `1157,265 25x11` → `1246,271 79x10`

### `body>div:nth-child(1)>div:nth-child(1)>header:nth-child(1)>div:nth-child(1)>span:nth-child(2)` — "easy-png-tools"
    - **rect**: `98,23 118x18` → `98,23 108x17`

### `body>div:nth-child(1)>div:nth-child(1)>header:nth-child(1)>div:nth-child(3)>div:nth-child(4)>button:nth-child(1)` — "RU"
    - **letterSpacing**: `0.6px` → `normal`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>p:nth-child(3)` — "Chain simple tools together. Every chang"
    - **rect**: `58,275 474x51` → `58,285 482x51`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>span:nth-child(2)` — "source.png"
    - **rect**: `597,300 66x14` → `606,311 60x13`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>b:nth-child(3)` — "1.8 MB"
    - **rect**: `671,300 40x14` → `674,311 36x13`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>strong:nth-child(2)>em:nth-child(1)` — "• LIVE"
    - **rect**: `175,405 36x13` → `173,425 33x12`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(3)>article:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>h2:nth-child(2)` — "Gradient background"
    - **rect**: `117,473 171x19` → `143,510 157x18`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(3)>article:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>h2:nth-child(2)` — "Remove background"
    - **rect**: `117,633 153x19` → `143,672 140x18`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(3)>article:nth-child(3)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>h2:nth-child(2)` — "Add outline"
    - **rect**: `117,755 99x19` → `143,820 91x18`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(3)>article:nth-child(4)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>h2:nth-child(2)` — "Round corners"
    - **rect**: `117,905 117x19` → `143,982 107x18`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>strong:nth-child(2)` — "Visual history"
    - **rect**: `799,209 94x36` → `799,233 87x34`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>span:nth-child(1)` — "PNG"
    - **rect**: `1067,496 28x19` → `923,478 27x18`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>span:nth-child(1)` — "original.png · 1200 × 800"
    - **rect**: `814,704 135x11` → `942,663 124x10`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(2)>div:nth-child(2)>span:nth-child(1)` — "gradient applied"
    - **rect**: `814,1137 86x11` → `1275,663 79x10`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(3)>div:nth-child(2)>div:nth-child(2)>span:nth-child(1)` — "background removed"
    - **rect**: `814,1569 97x11` → `977,1021 89x10`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(4)>div:nth-child(2)>div:nth-child(2)>span:nth-child(1)` — "outline added"
    - **rect**: `814,2002 70x11` → `1290,1021 64x10`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(5)>div:nth-child(2)>div:nth-child(2)>span:nth-child(1)` — "ready · PNG-24"
    - **rect**: `814,2434 76x11` → `997,1378 69x10`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>p:nth-child(3)` — "Output is generated in-browser. Your fil"
    - **rect**: `799,2489 565x17` → `799,1425 565x17`

### Только у нас

- `/ DEMO`
- `+ Add tool`
- `AUTO`
- `Gradient color`
- `DIRECTION`
- `135 °`
- `OPACITY`
- `75%`
- `50%`
- `25%`
- `Automatic subject detection enabled`
- `Outline width`
- `2 px`
- `Outline color`
- `Corner radius`
- `18 px`
- `v0.1.0`
- `© 2026`

### Только в рефе

- `/ 
            WORKSPACE`
- `COLOR`
- `135
                        °`
- `100`
- `75`
- `50`
- `25`
- `2
                        px`
- `18
                        px`
- `v2.4.0`
- `© 2024`


## /preview/list-tools  (vs list-tools.html)

- Токены light: **10**, dark: **16**
- Элементы: **30**, только у нас: 257, только в рефе: 54

### Токены — Light

| token | ours | ref |
|---|---|---|
| `--danger` | #e5484d | — |
| `--success` | #25a96a | — |
| `--text-sm--line-height` | — | calc(1.25 / .875) |
| `--text-xs--line-height` | — | calc(1 / .75) |
| `--font-weight-medium` | — | 500 |
| `--spacing` | — | .25rem |
| `--text-xs` | — | .75rem |
| `--radius-md` | — | .375rem |
| `--radius-lg` | — | .5rem |
| `--text-sm` | — | .875rem |

### Токены — Dark

| token | ours | ref |
|---|---|---|
| `--panel` | #182129 | #f8fafb |
| `--blue` | #54a2ff | #1769d2 |
| `--muted` | #91a0ac | #6d7883 |
| `--background` | #11171d | #eef1f4 |
| `--danger` | #ff7479 | — |
| `--foreground` | #e8eef2 | #17212b |
| `--success` | #25a96a | — |
| `--line` | #33414c | #cbd3da |
| `--text-sm--line-height` | — | calc(1.25 / .875) |
| `--text-xs--line-height` | — | calc(1 / .75) |
| `--font-weight-medium` | — | 500 |
| `--spacing` | — | .25rem |
| `--text-xs` | — | .75rem |
| `--radius-md` | — | .375rem |
| `--radius-lg` | — | .5rem |
| `--text-sm` | — | .875rem |

### Расхождения элементов (топ 30)

### `body>div:nth-child(1)>div:nth-child(1)>header:nth-child(1)>nav:nth-child(2)>a:nth-child(2)` — "Catalog"
    - **fontSize**: `12px` → `10px`
    - **color**: `rgb(109, 120, 131)` → `rgb(23, 105, 210)`
    - **letterSpacing**: `0.48px` → `normal`
    - **rect**: `621,24 54x15` → `832,26 39x12`

### `body>div:nth-child(1)>div:nth-child(1)>header:nth-child(1)>nav:nth-child(2)>a:nth-child(1)` — "Workspace"
    - **fontSize**: `12px` → `10px`
    - **letterSpacing**: `0.48px` → `normal`
    - **rect**: `534,24 69x15` → `761,26 49x12`

### `body>div:nth-child(1)>div:nth-child(1)>header:nth-child(1)>nav:nth-child(2)>a:nth-child(3)` — "Gradient"
    - **fontSize**: `12px` → `10px`
    - **letterSpacing**: `0.48px` → `normal`
    - **rect**: `693,24 61x15` → `893,26 44x12`

### `body>div:nth-child(1)>div:nth-child(1)>header:nth-child(1)>nav:nth-child(2)>a:nth-child(4)` — "Background remover"
    - **fontSize**: `12px` → `10px`
    - **letterSpacing**: `0.48px` → `normal`
    - **rect**: `773,24 138x15` → `959,26 99x12`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>section:nth-child(1)>section:nth-child(2)>div:nth-child(2)>a:nth-child(1)>span:nth-child(2)>span:nth-child(1)` — "Convert JPG to PNG"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `14.4px` → `13px`
    - **rect**: `104,302 175x19` → `131,494 488x15`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>section:nth-child(1)>section:nth-child(2)>div:nth-child(2)>a:nth-child(2)>span:nth-child(2)>span:nth-child(1)` — "Convert WebP to PNG"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `14.4px` → `13px`
    - **rect**: `364,311 175x19` → `131,610 488x15`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>section:nth-child(1)>section:nth-child(2)>div:nth-child(2)>a:nth-child(7)>span:nth-child(2)>span:nth-child(1)` — "PNG to Base64"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `14.4px` → `13px`
    - **rect**: `364,429 175x19` → `131,726 488x15`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>section:nth-child(1)>section:nth-child(2)>div:nth-child(2)>a:nth-child(9)>span:nth-child(2)>span:nth-child(1)` — "PNG to Data URI"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `14.4px` → `13px`
    - **rect**: `885,429 175x19` → `131,842 488x15`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>section:nth-child(1)>section:nth-child(2)>div:nth-child(2)>a:nth-child(17)>span:nth-child(2)>span:nth-child(1)` — "Convert PNG to JPG"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `14.4px` → `13px`
    - **rect**: `364,717 175x19` → `131,958 488x15`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>section:nth-child(1)>section:nth-child(3)>div:nth-child(2)>a:nth-child(8)>span:nth-child(2)>span:nth-child(1)` — "Round corners PNG"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `14.4px` → `13px`
    - **rect**: `625,1239 175x19` → `807,726 488x15`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>section:nth-child(1)>section:nth-child(3)>div:nth-child(2)>a:nth-child(11)>span:nth-child(2)>span:nth-child(1)` — "Outline PNG"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `14.4px` → `13px`
    - **rect**: `104,1384 175x19` → `807,842 488x15`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>section:nth-child(1)>section:nth-child(4)>div:nth-child(2)>a:nth-child(7)>span:nth-child(2)>span:nth-child(1)` — "Grayscale PNG"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `14.4px` → `13px`
    - **rect**: `364,2096 175x19` → `131,1276 488x15`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>section:nth-child(1)>section:nth-child(4)>div:nth-child(2)>a:nth-child(8)>span:nth-child(2)>span:nth-child(1)` — "Invert colors PNG"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `14.4px` → `13px`
    - **rect**: `625,2104 175x19` → `131,1392 488x15`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>section:nth-child(1)>section:nth-child(4)>div:nth-child(2)>a:nth-child(10)>span:nth-child(2)>span:nth-child(1)` — "Change PNG opacity"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `14.4px` → `13px`
    - **rect**: `1146,2096 175x19` → `807,958 488x15`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>section:nth-child(1)>section:nth-child(4)>div:nth-child(2)>a:nth-child(20)>span:nth-child(2)>span:nth-child(1)` — "Temperature PNG"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `14.4px` → `13px`
    - **rect**: `1146,2361 175x19` → `131,1624 488x15`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>section:nth-child(1)>section:nth-child(5)>div:nth-child(2)>a:nth-child(1)>span:nth-child(2)>span:nth-child(1)` — "Resize PNG"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `14.4px` → `13px`
    - **rect**: `104,2731 175x19` → `807,1160 488x15`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>section:nth-child(1)>section:nth-child(5)>div:nth-child(2)>a:nth-child(2)>span:nth-child(2)>span:nth-child(1)` — "Crop PNG"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `14.4px` → `13px`
    - **rect**: `364,2740 175x19` → `807,1276 488x15`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>section:nth-child(1)>section:nth-child(5)>div:nth-child(2)>a:nth-child(3)>span:nth-child(2)>span:nth-child(1)` — "Rotate PNG"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `14.4px` → `13px`
    - **rect**: `625,2748 175x19` → `807,1392 488x15`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>section:nth-child(1)>section:nth-child(5)>div:nth-child(2)>a:nth-child(4)>span:nth-child(2)>span:nth-child(1)` — "Flip PNG"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `14.4px` → `13px`
    - **rect**: `885,2757 175x19` → `807,1508 488x15`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>section:nth-child(1)>section:nth-child(5)>div:nth-child(2)>a:nth-child(5)>span:nth-child(2)>span:nth-child(1)` — "Add padding to PNG"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `14.4px` → `13px`
    - **rect**: `1146,2748 175x19` → `807,1624 488x15`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>section:nth-child(1)>section:nth-child(6)>div:nth-child(2)>a:nth-child(1)>span:nth-child(2)>span:nth-child(1)` — "Blur PNG"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `14.4px` → `13px`
    - **rect**: `104,3396 175x19` → `131,1826 488x15`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>section:nth-child(1)>section:nth-child(6)>div:nth-child(2)>a:nth-child(2)>span:nth-child(2)>span:nth-child(1)` — "Sharpen PNG"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `14.4px` → `13px`
    - **rect**: `364,3387 175x19` → `131,1942 488x15`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>section:nth-child(1)>section:nth-child(6)>div:nth-child(2)>a:nth-child(3)>span:nth-child(2)>span:nth-child(1)` — "Vignette PNG"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `14.4px` → `13px`
    - **rect**: `625,3404 175x19` → `131,2058 488x15`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>section:nth-child(1)>section:nth-child(6)>div:nth-child(2)>a:nth-child(8)>span:nth-child(2)>span:nth-child(1)` — "JPEG artifacts"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `14.4px` → `13px`
    - **rect**: `625,3540 175x19` → `131,2174 488x15`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>section:nth-child(1)>section:nth-child(8)>div:nth-child(2)>a:nth-child(9)>span:nth-child(2)>span:nth-child(1)` — "PNG info"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `14.4px` → `13px`
    - **rect**: `885,4142 175x19` → `807,1826 488x15`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>section:nth-child(1)>section:nth-child(8)>div:nth-child(2)>a:nth-child(13)>span:nth-child(2)>span:nth-child(1)` — "PNG orientation"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `14.4px` → `13px`
    - **rect**: `625,4287 175x19` → `807,2174 488x15`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>section:nth-child(1)>section:nth-child(9)>div:nth-child(2)>a:nth-child(7)>span:nth-child(2)>span:nth-child(1)` — "Create gradient PNG"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `14.4px` → `13px`
    - **rect**: `364,4632 175x19` → `131,1160 488x15`

### `body>div:nth-child(1)>div:nth-child(1)>header:nth-child(1)>div:nth-child(3)>div:nth-child(4)>button:nth-child(2)` — "EN"
    - **letterSpacing**: `0.6px` → `normal`
    - **rect**: `1349,19 32x25` → `1352,20 29x24`

### `body>div:nth-child(1)>div:nth-child(1)>header:nth-child(1)>div:nth-child(1)>span:nth-child(2)` — "easy-png-tools"
    - **rect**: `98,23 118x18` → `98,23 108x17`

### `body>div:nth-child(1)>div:nth-child(1)>header:nth-child(1)>div:nth-child(3)>div:nth-child(4)>button:nth-child(1)` — "RU"
    - **letterSpacing**: `0.6px` → `normal`

### Только у нас

- `/ LIST-TOOLS`
- `CATALOG`
- `All tools`
- `Каталог всех PNG-инструментов, сгруппиро`
- `convert`
- `Convert`
- `Opens a JPEG and saves it as lossless PN`
- `Re-encodes a WebP image into universal P`
- `Convert GIF to PNG`
- `Extracts the first frame of a GIF animat`
- `Convert BMP to PNG`
- `Re-encodes BMP into compact lossless PNG`
- `Convert ICO to PNG`
- `Turns an .ico icon into a regular PNG of`
- `Convert PNG to BMP`
- `Saves the image as 24-bit BMP without an`
- `Encodes the image into a base64 string f`
- `Base64 to PNG`
- `Decodes a base64 string or data-uri back`
- `Builds a full data-uri (data:image/png;b`
- `Data URI to PNG`
- `Decodes data:image/…;base64,… back into `
- `PNG to HEX pixels`
- `Shows all pixels as rrggbbaa hex values `
- `HEX pixels to PNG`
- `Assembles an image from rrggbbaa hex val`
- `PNG to Bytes`
- `Lists every pixel as four decimal bytes `
- `Bytes to PNG`
- `Assembles an image from decimal RGBA byt`
- `PNG to RGB Values`
- `Lists every pixel as rgba(r, g, b, a), o`
- `RGB Values to PNG`
- `Assembles an image from rgba(r, g, b, a)`
- `Transparency is composited over the chos`
- `Convert PNG to WebP`
- `Re-encodes the image into WebP with adju`
- `Compress PNG`
- `Shrinks the PNG by reducing its palette `
- `Reduce PNG to Size`
- `Binary-searches the palette size until t`
- `SVG to PNG`
- `Decodes SVG markup into a raster image. `
- `alpha`
- `Alpha & transparency`
- `Circle Mask PNG`
- `Cuts the image into a circle. Diameter i`
- `Square Mask PNG`
- `Cuts the image into a rectangle with sid`
- `Star Mask PNG`
- `Cuts the image into an n-pointed star wi`
- `Wavy Mask PNG`
- `Cuts the image into a wavy-edged circle:`
- `Remove alpha channel PNG`
- `Composites the image over a white backgr`
- `Set alpha channel PNG`
- `Assigns the same opacity to all pixels; `
- `Extract alpha mask PNG`
- `Turns transparency into a black-and-whit`
- `Clips corners by a radius set as a perce`

### Только в рефе

- `/ 
            CATALOG`
- `/`
- `EASY-PNG-TOOLS / CATALOG`
- `Tool catalog`
- `Focused utilities for working with PNG. `
- `32`
- `ALL`
- `CONVERT`
- `TRANSPARENCY`
- `COLOR`
- `GEOMETRY`
- `FILTERS`
- `ANALYZE`
- `05
                 TOOLS`
- `Re-encode JPEG files as lossless PNG whi`
- `01`
- `Turn WebP images into a universal PNG fo`
- `02`
- `Encode an image as a base64 string for e`
- `03`
- `Build a complete data URI ready for HTML`
- `04`
- `Composite transparency over a selected b`
- `05`
- `Remove background PNG`
- `Remove a solid background by color, tole`
- `Extract alpha mask`
- `Turn the alpha channel into a clean blac`
- `Clip the image corners by a precise radi`
- `Add a colored ring around opaque content`
- `Multiply the alpha channel while keeping`
- `Generate a smooth transition between two`
- `Convert the image to luminance-based sha`
- `Invert every color channel while leaving`
- `Brightness & contrast`
- `Adjust brightness and contrast across a `
- `Make an image warmer or cooler with a si`
- `Scale an image with bilinear interpolati`
- `Cut a rectangular area with exact coordi`
- `Rotate by 90, 180, or 270 degrees withou`
- `Mirror the image horizontally or vertica`
- `Expand the canvas on all sides by a chos`
- `04
                 TOOLS`
- `Apply a fast Gaussian-style blur with tr`
- `Emphasize edges with an adjustable sharp`
- `Smoothly darken the image edges while pr`
- `Simulate low-quality JPEG recompression `
- `Inspect dimensions, alpha presence, and `
- `Check grayscale`
- `Report whether the image contains only s`
- `Check transparency`
- `Detect transparent and semi-transparent `
- `Classify the image as portrait, landscap`
- `•`


## /preview/tools/linear-gradient-png  (vs gradient.html)

- Токены light: **10**, dark: **16**
- Элементы: **7**, только у нас: 111, только в рефе: 30

### Токены — Light

| token | ours | ref |
|---|---|---|
| `--danger` | #e5484d | — |
| `--success` | #25a96a | — |
| `--text-sm--line-height` | — | calc(1.25 / .875) |
| `--text-xs--line-height` | — | calc(1 / .75) |
| `--font-weight-medium` | — | 500 |
| `--spacing` | — | .25rem |
| `--text-xs` | — | .75rem |
| `--radius-md` | — | .375rem |
| `--radius-lg` | — | .5rem |
| `--text-sm` | — | .875rem |

### Токены — Dark

| token | ours | ref |
|---|---|---|
| `--panel` | #182129 | #f8fafb |
| `--blue` | #54a2ff | #1769d2 |
| `--muted` | #91a0ac | #6d7883 |
| `--background` | #11171d | #eef1f4 |
| `--danger` | #ff7479 | — |
| `--foreground` | #e8eef2 | #17212b |
| `--success` | #25a96a | — |
| `--line` | #33414c | #cbd3da |
| `--text-sm--line-height` | — | calc(1.25 / .875) |
| `--text-xs--line-height` | — | calc(1 / .75) |
| `--font-weight-medium` | — | 500 |
| `--spacing` | — | .25rem |
| `--text-xs` | — | .75rem |
| `--radius-md` | — | .375rem |
| `--radius-lg` | — | .5rem |
| `--text-sm` | — | .875rem |

### Расхождения элементов (топ 7)

### `body>div:nth-child(1)>div:nth-child(1)>header:nth-child(1)>nav:nth-child(2)>a:nth-child(3)` — "Gradient"
    - **fontSize**: `12px` → `10px`
    - **color**: `rgb(109, 120, 131)` → `rgb(23, 105, 210)`
    - **letterSpacing**: `0.48px` → `normal`
    - **rect**: `754,24 61x15` → `930,26 44x12`

### `body>div:nth-child(1)>div:nth-child(1)>header:nth-child(1)>nav:nth-child(2)>a:nth-child(1)` — "Workspace"
    - **fontSize**: `12px` → `10px`
    - **letterSpacing**: `0.48px` → `normal`
    - **rect**: `596,24 69x15` → `798,26 49x12`

### `body>div:nth-child(1)>div:nth-child(1)>header:nth-child(1)>nav:nth-child(2)>a:nth-child(2)` — "Catalog"
    - **fontSize**: `12px` → `10px`
    - **letterSpacing**: `0.48px` → `normal`
    - **rect**: `683,24 54x15` → `870,26 39x12`

### `body>div:nth-child(1)>div:nth-child(1)>header:nth-child(1)>nav:nth-child(2)>a:nth-child(4)` — "Background remover"
    - **fontSize**: `12px` → `10px`
    - **letterSpacing**: `0.48px` → `normal`
    - **rect**: `834,24 138x15` → `996,26 99x12`

### `body>div:nth-child(1)>div:nth-child(1)>header:nth-child(1)>div:nth-child(3)>div:nth-child(4)>button:nth-child(2)` — "EN"
    - **letterSpacing**: `0.6px` → `normal`
    - **rect**: `1349,19 32x25` → `1352,20 29x24`

### `body>div:nth-child(1)>div:nth-child(1)>header:nth-child(1)>div:nth-child(1)>span:nth-child(2)` — "easy-png-tools"
    - **rect**: `98,23 118x18` → `98,23 108x17`

### `body>div:nth-child(1)>div:nth-child(1)>header:nth-child(1)>div:nth-child(3)>div:nth-child(4)>button:nth-child(1)` — "RU"
    - **letterSpacing**: `0.6px` → `normal`

### Только у нас

- `/ TOOLS / LINEAR-GRADIENT-PNG`
- `STEPS`
- `Pipeline`
- `AUTO`
- `01`
- `generate`
- `Create gradient PNG`
- `Width`
- `Height`
- `Start color`
- `End color`
- `Direction`
- `Horizontal`
- `Vertical`
- `Add step`
- `Split PNG into HSL`
- `Split PNG into HSV`
- `Split PNG into HSI`
- `Convert PNG to CMYK Colors`
- `Convert PNG to YCbCr Colors`
- `Convert PNG to LAB Colors`
- `Show Transparent Areas PNG`
- `Show Grayscale Pixels PNG`
- `Show Color Pixels PNG`
- `Light Pixel Mask PNG`
- `Dark Pixel Mask PNG`
- `Unique Color Mask PNG`
- `Convert JPG to PNG`
- `Convert WebP to PNG`
- `Convert GIF to PNG`
- `Convert BMP to PNG`
- `Convert ICO to PNG`
- `Convert PNG to BMP`
- `Resize PNG`
- `Crop PNG`
- `Rotate PNG`
- `Flip PNG`
- `Add padding to PNG`
- `Add border to PNG`
- `Fit PNG onto background`
- `Tile PNG`
- `Circle Mask PNG`
- `Square Mask PNG`
- `Star Mask PNG`
- `Wavy Mask PNG`
- `Center PNG by content`
- `Blur PNG`
- `Sharpen PNG`
- `Grayscale PNG`
- `Invert colors PNG`
- `Brightness & contrast PNG`
- `Change PNG opacity`
- `Sepia effect`
- `Change hue PNG`
- `Extract channel PNG`
- `Swap channels PNG`
- `Black & white threshold PNG`
- `Posterize PNG`
- `Two colors PNG`
- `Convert PNG to JPG`

### Только в рефе

- `/ 
            GRADIENT`
- `/`
- `Gradient background.`
- `Create a clean, export-ready gradient wi`
- `GRADIENT SETTINGS`
- `Configure output`
- `TOOL 01`
- `GRADIENT TYPE`
- `Linear`
- `Radial`
- `COLOR STOPS`
- `→`
- `135
                  °`
- `0° →`
- `45° ↗`
- `90° ↑`
- `135° ↖`
- `180° ←`
- `225° ↙`
- `270° ↓`
- `315° ↘`
- `100
                  %`
- `OUTPUT PREVIEW`
- `gradient.png`
- `PNG`
- `GENERATED CSS`
- `background: linear-gradient(135deg, #176`
- `v2.4.0`
- `gradient tool · local-only`
- `© 2024`


## /preview/tools/remove-background-png  (vs background-remover.html)

- Токены light: **10**, dark: **16**
- Элементы: **8**, только у нас: 110, только в рефе: 28

### Токены — Light

| token | ours | ref |
|---|---|---|
| `--danger` | #e5484d | — |
| `--success` | #25a96a | — |
| `--text-sm--line-height` | — | calc(1.25 / .875) |
| `--text-xs--line-height` | — | calc(1 / .75) |
| `--font-weight-medium` | — | 500 |
| `--spacing` | — | .25rem |
| `--text-xs` | — | .75rem |
| `--radius-md` | — | .375rem |
| `--radius-lg` | — | .5rem |
| `--text-sm` | — | .875rem |

### Токены — Dark

| token | ours | ref |
|---|---|---|
| `--panel` | #182129 | #f8fafb |
| `--blue` | #54a2ff | #1769d2 |
| `--muted` | #91a0ac | #6d7883 |
| `--background` | #11171d | #eef1f4 |
| `--danger` | #ff7479 | — |
| `--foreground` | #e8eef2 | #17212b |
| `--success` | #25a96a | — |
| `--line` | #33414c | #cbd3da |
| `--text-sm--line-height` | — | calc(1.25 / .875) |
| `--text-xs--line-height` | — | calc(1 / .75) |
| `--font-weight-medium` | — | 500 |
| `--spacing` | — | .25rem |
| `--text-xs` | — | .75rem |
| `--radius-md` | — | .375rem |
| `--radius-lg` | — | .5rem |
| `--text-sm` | — | .875rem |

### Расхождения элементов (топ 8)

### `body>div:nth-child(1)>div:nth-child(1)>header:nth-child(1)>nav:nth-child(2)>a:nth-child(4)` — "Background remover"
    - **fontSize**: `12px` → `10px`
    - **color**: `rgb(109, 120, 131)` → `rgb(23, 105, 210)`
    - **letterSpacing**: `0.48px` → `normal`
    - **rect**: `841,24 138x15` → `978,26 99x12`

### `body>div:nth-child(1)>div:nth-child(1)>header:nth-child(1)>nav:nth-child(2)>a:nth-child(1)` — "Workspace"
    - **fontSize**: `12px` → `10px`
    - **letterSpacing**: `0.48px` → `normal`
    - **rect**: `603,24 69x15` → `780,26 49x12`

### `body>div:nth-child(1)>div:nth-child(1)>header:nth-child(1)>nav:nth-child(2)>a:nth-child(2)` — "Catalog"
    - **fontSize**: `12px` → `10px`
    - **letterSpacing**: `0.48px` → `normal`
    - **rect**: `690,24 54x15` → `851,26 39x12`

### `body>div:nth-child(1)>div:nth-child(1)>header:nth-child(1)>nav:nth-child(2)>a:nth-child(3)` — "Gradient"
    - **fontSize**: `12px` → `10px`
    - **letterSpacing**: `0.48px` → `normal`
    - **rect**: `762,24 61x15` → `912,26 44x12`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>section:nth-child(1)>header:nth-child(1)>div:nth-child(1)>span:nth-child(1)` — "RESULT"
    - **letterSpacing**: `1px` → `normal`
    - **lineHeight**: `12px` → `normal`
    - **rect**: `726,125 108x12` → `954,467 33x12`

### `body>div:nth-child(1)>div:nth-child(1)>header:nth-child(1)>div:nth-child(3)>div:nth-child(4)>button:nth-child(2)` — "EN"
    - **letterSpacing**: `0.6px` → `normal`
    - **rect**: `1349,19 32x25` → `1352,20 29x24`

### `body>div:nth-child(1)>div:nth-child(1)>header:nth-child(1)>div:nth-child(1)>span:nth-child(2)` — "easy-png-tools"
    - **rect**: `98,23 118x18` → `98,23 108x17`

### `body>div:nth-child(1)>div:nth-child(1)>header:nth-child(1)>div:nth-child(3)>div:nth-child(4)>button:nth-child(1)` — "RU"
    - **letterSpacing**: `0.6px` → `normal`

### Только у нас

- `/ TOOLS / REMOVE-BACKGROUND-PNG`
- `STEPS`
- `Pipeline`
- `AUTO`
- `01`
- `alpha`
- `Remove background PNG (smart)`
- `Background color`
- `Similarity tolerance, %`
- `10`
- `Outer regions only`
- `Edge smoothing, passes`
- `1`
- `Add step`
- `Split PNG into HSL`
- `Split PNG into HSV`
- `Split PNG into HSI`
- `Convert PNG to CMYK Colors`
- `Convert PNG to YCbCr Colors`
- `Convert PNG to LAB Colors`
- `Show Transparent Areas PNG`
- `Show Grayscale Pixels PNG`
- `Show Color Pixels PNG`
- `Light Pixel Mask PNG`
- `Dark Pixel Mask PNG`
- `Unique Color Mask PNG`
- `Convert JPG to PNG`
- `Convert WebP to PNG`
- `Convert GIF to PNG`
- `Convert BMP to PNG`
- `Convert ICO to PNG`
- `Convert PNG to BMP`
- `Resize PNG`
- `Crop PNG`
- `Rotate PNG`
- `Flip PNG`
- `Add padding to PNG`
- `Add border to PNG`
- `Fit PNG onto background`
- `Tile PNG`
- `Circle Mask PNG`
- `Square Mask PNG`
- `Star Mask PNG`
- `Wavy Mask PNG`
- `Center PNG by content`
- `Blur PNG`
- `Sharpen PNG`
- `Grayscale PNG`
- `Invert colors PNG`
- `Brightness & contrast PNG`
- `Change PNG opacity`
- `Sepia effect`
- `Change hue PNG`
- `Extract channel PNG`
- `Swap channels PNG`
- `Black & white threshold PNG`
- `Posterize PNG`
- `Two colors PNG`
- `Convert PNG to JPG`
- `Convert PNG to WebP`

### Только в рефе

- `/ 
            BACKGROUND REMOVER`
- `/`
- `Remove background.`
- `Select a background color and tune the e`
- `REMOVER SETTINGS`
- `Configure detection`
- `TOOL 02`
- `BACKGROUND COLOR`
- `72
                  %`
- `strict edges`
- `more removal`
- `OUTER COLOR ONLY`
- `Only remove connected background pixels `
- `SHOW MASK`
- `Preview the detected transparency mask.`
- `SOURCE / RESULT`
- `comparison.png`
- `SOURCE`
- `original.png`
- `OBJECT`
- `1200 × 800`
- `removed-bg.png`
- `PNG`
- `PNG-24`
- `ENABLED`
- `v2.4.0`
- `background remover · local-only`
- `© 2024`
