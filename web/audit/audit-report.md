# Style audit: http://127.0.0.1:5179/preview/demo

vs C:\+XBOCTuK\+life_projects\easy-png-tools\refs-html\demo.html

_2026-08-28T11:58:18.224Z_

## Сводка

- Токены light: **10** расх.
- Токены dark: **16** расх.
- Элементы (стиль/геометрия): **46** расх.
- Только у нас: 13, только в рефе: 12

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

## Расхождения элементов (топ 46)

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>span:nth-child(1)` — "/"
    - **fontFamily**: `"IBM Plex Mono", monospace` → `"IBM Plex Sans", sans-serif`
    - **fontSize**: `10px` → `16px`
    - **color**: `rgb(23, 105, 210)` → `rgb(23, 33, 43)`
    - **margin**: `0px 7px` → `0px`
    - **letterSpacing**: `1.2px` → `normal`
    - **lineHeight**: `normal` → `24px`
    - **display**: `inline` → `block`
    - **rect**: `165,124 7x13` → `1348,20 4x24`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>span:nth-child(1)` — "PROCESSING PIPELINE"
    - **fontWeight**: `500` → `400`
    - **letterSpacing**: `1px` → `1.2px`
    - **lineHeight**: `12px` → `normal`
    - **display**: `block` → `inline`
    - **rect**: `58,428 154x12` → `58,400 127x12`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>span:nth-child(1)` — "PIPELINE OUTPUTS"
    - **fontWeight**: `500` → `400`
    - **letterSpacing**: `1px` → `1.2px`
    - **lineHeight**: `12px` → `normal`
    - **display**: `block` → `inline`
    - **rect**: `799,178 93x24` → `799,188 54x36`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>button:nth-child(2)>span:nth-child(2)>span:nth-child(1)` — "1.2 MB"
    - **fontSize**: `10px` → `11px`
    - **color**: `rgb(255, 255, 255)` → `rgb(23, 33, 43)`
    - **margin**: `0px` → `5px 0px 0px`
    - **display**: `inline` → `block`
    - **rect**: `1090,240 36x13` → `1246,291 79x13`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(3)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(3)>div:nth-child(2)>button:nth-child(1)` — "100"
    - **padding**: `0px 11.2px` → `0px`
    - **letterSpacing**: `0.6px` → `normal`
    - **display**: `flex` → `block`
    - **rect**: `491,590 42x30` → `520,567 46x30`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(3)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(3)>div:nth-child(2)>button:nth-child(2)` — "75"
    - **padding**: `0px 11.2px` → `0px`
    - **letterSpacing**: `0.6px` → `normal`
    - **display**: `flex` → `block`
    - **rect**: `533,590 37x30` → `566,567 46x30`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(3)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(3)>div:nth-child(2)>button:nth-child(3)` — "50"
    - **padding**: `0px 11.2px` → `0px`
    - **letterSpacing**: `0.6px` → `normal`
    - **display**: `flex` → `block`
    - **rect**: `569,590 37x30` → `612,567 46x30`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(3)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(3)>div:nth-child(2)>button:nth-child(4)` — "25"
    - **padding**: `0px 11.2px` → `0px`
    - **letterSpacing**: `0.6px` → `normal`
    - **display**: `flex` → `block`
    - **rect**: `606,590 37x30` → `658,567 46x30`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(3)>div:nth-child(4)>div:nth-child(2)>div:nth-child(2)>label:nth-child(2)>span:nth-child(1)` — "Preserve aspect ratio"
    - **fontSize**: `13.6px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **display**: `block` → `inline`
    - **rect**: `399,986 129x18` → `432,1021 156x17`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(3)>div:nth-child(1)>span:nth-child(1)` — "DIMENSIONS"
    - **fontSize**: `10px` → `9px`
    - **letterSpacing**: `1px` → `normal`
    - **rect**: `1150,215 70x13` → `1073,271 79x10`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(3)>div:nth-child(2)>span:nth-child(1)` — "FORMAT"
    - **fontSize**: `10px` → `9px`
    - **letterSpacing**: `1px` → `normal`
    - **rect**: `1150,239 42x13` → `1159,271 79x10`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(3)>div:nth-child(3)>span:nth-child(1)` — "SIZE"
    - **fontSize**: `10px` → `9px`
    - **letterSpacing**: `1px` → `normal`
    - **rect**: `1150,264 28x13` → `1246,271 79x10`

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

### `body>div:nth-child(1)>div:nth-child(1)>header:nth-child(1)>div:nth-child(2)>div:nth-child(4)>button:nth-child(2)` — "EN"
    - **letterSpacing**: `0.6px` → `normal`
    - **rect**: `1349,19 32x25` → `1352,20 29x24`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>h1:nth-child(2)` — "Build your image pipeline."
    - **lineHeight**: `normal` → `57.6px`
    - **rect**: `58,155 474x150` → `58,154 482x115`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(3)>div:nth-child(1)>div:nth-child(1)>span:nth-child(2)` — "01"
    - **padding**: `0px` → `17px 0px 0px 15px`
    - **rect**: `95,504 13x14` → `59,466 46x150`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(3)>div:nth-child(1)>div:nth-child(1)>span:nth-child(3)` — "BACKGROUND"
    - **display**: `block` → `inline`
    - **rect**: `116,504 72x13` → `143,489 67x12`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(3)>div:nth-child(1)>div:nth-child(1)>span:nth-child(4)` — "Gradient background"
    - **margin**: `0px` → `5px 0px 18px`
    - **rect**: `196,501 171x19` → `143,510 157x18`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(3)>div:nth-child(2)>div:nth-child(1)>span:nth-child(2)` — "02"
    - **padding**: `0px` → `17px 0px 0px 15px`
    - **rect**: `95,655 13x14` → `59,628 46x136`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(3)>div:nth-child(2)>div:nth-child(1)>span:nth-child(3)` — "TRANSFORM"
    - **display**: `block` → `inline`
    - **rect**: `116,656 65x13` → `143,651 60x12`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(3)>div:nth-child(2)>div:nth-child(1)>span:nth-child(4)` — "Remove background"
    - **margin**: `0px` → `5px 0px 18px`
    - **rect**: `189,653 153x19` → `143,672 140x18`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(3)>div:nth-child(3)>div:nth-child(1)>span:nth-child(2)` — "03"
    - **padding**: `0px` → `17px 0px 0px 15px`
    - **rect**: `95,769 13x14` → `59,776 46x150`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(3)>div:nth-child(3)>div:nth-child(1)>span:nth-child(3)` — "STYLE"
    - **display**: `block` → `inline`
    - **rect**: `116,770 36x13` → `143,799 34x12`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(3)>div:nth-child(3)>div:nth-child(1)>span:nth-child(4)` — "Add outline"
    - **margin**: `0px` → `5px 0px 18px`
    - **rect**: `160,767 99x19` → `143,820 91x18`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(3)>div:nth-child(4)>div:nth-child(1)>span:nth-child(2)` — "04"
    - **padding**: `0px` → `17px 0px 0px 15px`
    - **rect**: `95,911 13x14` → `59,938 46x142`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(3)>div:nth-child(4)>div:nth-child(1)>span:nth-child(4)` — "Round corners"
    - **margin**: `0px` → `5px 0px 18px`
    - **rect**: `160,909 117x19` → `143,982 107x18`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(3)>div:nth-child(1)>span:nth-child(2)` — "1200 × 800 px"
    - **margin**: `0px` → `5px 0px 0px`
    - **rect**: `1236,214 86x14` → `1073,291 79x13`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(3)>div:nth-child(2)>span:nth-child(2)` — "PNG-24"
    - **margin**: `0px` → `5px 0px 0px`
    - **rect**: `1282,238 40x14` → `1159,291 79x13`

### `body>div:nth-child(1)>div:nth-child(1)>header:nth-child(1)>div:nth-child(1)>span:nth-child(2)` — "easy-png-tools"
    - **rect**: `98,23 118x18` → `98,23 108x17`

### `body>div:nth-child(1)>div:nth-child(1)>header:nth-child(1)>div:nth-child(2)>div:nth-child(4)>button:nth-child(1)` — "RU"
    - **letterSpacing**: `0.6px` → `normal`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>p:nth-child(3)` — "Chain simple tools together. Every chang"
    - **rect**: `58,321 474x51` → `58,285 482x51`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>span:nth-child(2)` — "source.png"
    - **rect**: `597,347 66x14` → `606,311 60x13`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>b:nth-child(3)` — "1.8 MB"
    - **rect**: `671,347 40x14` → `674,311 36x13`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>strong:nth-child(2)>em:nth-child(1)` — "• LIVE"
    - **rect**: `175,451 36x13` → `173,425 33x12`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>strong:nth-child(2)` — "Visual history"
    - **rect**: `799,209 93x36` → `799,233 87x34`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>span:nth-child(1)` — "PNG"
    - **rect**: `1067,496 28x19` → `923,478 27x18`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>span:nth-child(2)` — "original.png · 1200 × 800"
    - **rect**: `1213,704 135x11` → `942,663 124x10`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(2)>div:nth-child(2)>span:nth-child(2)` — "gradient applied"
    - **rect**: `1262,1137 86x11` → `1275,663 79x10`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(3)>div:nth-child(2)>div:nth-child(2)>span:nth-child(2)` — "background removed"
    - **rect**: `1251,1569 97x11` → `977,1021 89x10`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(4)>div:nth-child(2)>div:nth-child(2)>span:nth-child(2)` — "outline added"
    - **rect**: `1278,2002 70x11` → `1290,1021 64x10`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(5)>div:nth-child(2)>div:nth-child(2)>span:nth-child(2)` — "ready · PNG-24"
    - **rect**: `1272,2434 76x11` → `997,1378 69x10`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>p:nth-child(3)` — "Output is generated in-browser. Your fil"
    - **rect**: `799,2489 565x17` → `799,1425 565x17`

## Только у нас (структурно)

- `/ DEMO`
- `+ Add tool`
- `AUTO`
- `Gradient color`
- `DIRECTION`
- `135°`
- `OPACITY`
- `Automatic subject detection enabled`
- `Outline width`
- `2px`
- `Outline color`
- `Corner radius`
- `18px`

## Только в рефе (структурно)

- `/ 
            WORKSPACE`
- `Workspace`
- `Catalog`
- `Gradient`
- `Background remover`
- `COLOR`
- `135
                        °`
- `100%`
- `2
                        px`
- `18
                        px`
- `v2.4.0`
- `© 2024`
