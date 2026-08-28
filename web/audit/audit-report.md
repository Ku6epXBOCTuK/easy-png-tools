# Style audit: http://127.0.0.1:5179/preview/demo

vs C:\+XBOCTuK\+life_projects\easy-png-tools\refs-html\demo.html

_2026-08-28T14:54:53.564Z_

## Сводка

- Токены light: **10** расх.
- Токены dark: **16** расх.
- Элементы (стиль/геометрия): **47** расх.
- Только у нас: 18, только в рефе: 11

## Токены — Light

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

## Токены — Dark

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

## Расхождения элементов (топ 47)

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

## Только у нас (структурно)

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

## Только в рефе (структурно)

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
