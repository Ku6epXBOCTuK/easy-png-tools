# Style audit: http://127.0.0.1:5179/preview/demo

vs C:\+XBOCTuK\+life_projects\easy-png-tools\refs-html\demo.html

_2026-08-28T07:02:47.972Z_

## Сводка

- Токены light: **10** расх.
- Токены dark: **16** расх.
- Элементы (стиль/геометрия): **47** расх.
- Только у нас: 14, только в рефе: 7

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

### `body>div:nth-child(1)>div:nth-child(1)>header:nth-child(1)>div:nth-child(2)>div:nth-child(4)>button:nth-child(1)` — "RU"
    - **color**: `rgb(255, 255, 255)` → `rgb(238, 241, 244)`
    - **backgroundColor**: `rgb(23, 105, 210)` → `rgb(23, 33, 43)`
    - **padding**: `0px 11.2px` → `6px 9px`
    - **letterSpacing**: `0.6px` → `normal`
    - **display**: `flex` → `block`
    - **rect**: `1309,17 36x30` → `1323,20 29x24`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(1)>div:nth-child(4)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>span:nth-child(1)` — "COLOR"
    - **fontWeight**: `500` → `400`
    - **margin**: `0px` → `0px 0px 8px`
    - **letterSpacing**: `1px` → `0.8px`
    - **lineHeight**: `12px` → `normal`
    - **display**: `block` → `flex`
    - **rect**: `71,575 203x12` → `143,546 189x12`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(2)>div:nth-child(1)>div:nth-child(2)>button:nth-child(2)>span:nth-child(2)>span:nth-child(1)` — "1.2 MB"
    - **fontSize**: `10px` → `11px`
    - **color**: `rgb(255, 255, 255)` → `rgb(23, 33, 43)`
    - **margin**: `0px` → `5px 0px 0px`
    - **display**: `inline` → `block`
    - **rect**: `1090,240 36x13` → `1246,291 79x13`

### `body>div:nth-child(1)>div:nth-child(1)>header:nth-child(1)>div:nth-child(2)>div:nth-child(4)>button:nth-child(2)` — "EN"
    - **padding**: `0px 11.2px` → `6px 9px`
    - **letterSpacing**: `0.6px` → `normal`
    - **display**: `flex` → `block`
    - **rect**: `1345,17 37x30` → `1352,20 29x24`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(1)>div:nth-child(4)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(3)>div:nth-child(2)>button:nth-child(1)` — "100"
    - **padding**: `0px 11.2px` → `0px`
    - **letterSpacing**: `0.6px` → `normal`
    - **display**: `flex` → `block`
    - **rect**: `491,596 42x30` → `520,567 46x30`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(1)>div:nth-child(4)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(3)>div:nth-child(2)>button:nth-child(2)` — "75"
    - **padding**: `0px 11.2px` → `0px`
    - **letterSpacing**: `0.6px` → `normal`
    - **display**: `flex` → `block`
    - **rect**: `533,596 37x30` → `566,567 46x30`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(1)>div:nth-child(4)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(3)>div:nth-child(2)>button:nth-child(3)` — "50"
    - **padding**: `0px 11.2px` → `0px`
    - **letterSpacing**: `0.6px` → `normal`
    - **display**: `flex` → `block`
    - **rect**: `569,596 37x30` → `612,567 46x30`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(1)>div:nth-child(4)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(3)>div:nth-child(2)>button:nth-child(4)` — "25"
    - **padding**: `0px 11.2px` → `0px`
    - **letterSpacing**: `0.6px` → `normal`
    - **display**: `flex` → `block`
    - **rect**: `606,596 37x30` → `658,567 46x30`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(1)>div:nth-child(4)>div:nth-child(4)>div:nth-child(2)>div:nth-child(2)>label:nth-child(2)>span:nth-child(1)` — "Preserve aspect ratio"
    - **fontSize**: `13.6px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **display**: `block` → `inline`
    - **rect**: `399,1032 129x18` → `432,1021 156x17`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(3)>div:nth-child(1)>span:nth-child(1)` — "DIMENSIONS"
    - **fontSize**: `10px` → `9px`
    - **letterSpacing**: `1px` → `normal`
    - **rect**: `1150,215 70x13` → `1073,271 79x10`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(3)>div:nth-child(2)>span:nth-child(1)` — "FORMAT"
    - **fontSize**: `10px` → `9px`
    - **letterSpacing**: `1px` → `normal`
    - **rect**: `1150,239 42x13` → `1159,271 79x10`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(3)>div:nth-child(3)>span:nth-child(1)` — "SIZE"
    - **fontSize**: `10px` → `9px`
    - **letterSpacing**: `1px` → `normal`
    - **rect**: `1150,264 28x13` → `1246,271 79x10`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(2)>div:nth-child(2)>div:nth-child(1)>span:nth-child(1)` — "SOURCE"
    - **fontSize**: `10px` → `9px`
    - **letterSpacing**: `0.8px` → `normal`
    - **rect**: `806,320 262x13` → `808,663 30x10`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(2)>div:nth-child(2)>div:nth-child(2)>span:nth-child(1)` — "STEP 01"
    - **fontSize**: `10px` → `9px`
    - **letterSpacing**: `0.8px` → `normal`
    - **rect**: `1094,320 262x13` → `1096,663 35x10`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(2)>div:nth-child(2)>div:nth-child(3)>span:nth-child(1)` — "STEP 02"
    - **fontSize**: `10px` → `9px`
    - **letterSpacing**: `0.8px` → `normal`
    - **rect**: `806,753 262x13` → `808,1021 35x10`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(2)>div:nth-child(2)>div:nth-child(4)>span:nth-child(1)` — "STEP 03"
    - **fontSize**: `10px` → `9px`
    - **letterSpacing**: `0.8px` → `normal`
    - **rect**: `1094,753 262x13` → `1096,1021 35x10`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(2)>div:nth-child(2)>div:nth-child(5)>span:nth-child(1)` — "FINAL OUTPUT"
    - **fontSize**: `10px` → `9px`
    - **letterSpacing**: `0.8px` → `normal`
    - **rect**: `806,1185 262x13` → `808,1378 59x10`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(1)>div:nth-child(1)>span:nth-child(1)` — "/"
    - **color**: `rgb(23, 105, 210)` → `rgb(109, 120, 131)`
    - **rect**: `173,124 7x13` → `165,124 13x12`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(1)>div:nth-child(2)>div:nth-child(1)>h1:nth-child(1)` — "Build your image pipeline."
    - **lineHeight**: `normal` → `57.6px`
    - **rect**: `58,155 474x150` → `58,154 482x115`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(1)>div:nth-child(4)>div:nth-child(1)>div:nth-child(1)>span:nth-child(2)` — "01"
    - **padding**: `0px` → `17px 0px 0px 15px`
    - **rect**: `95,510 13x14` → `59,466 46x150`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(1)>div:nth-child(4)>div:nth-child(1)>div:nth-child(1)>span:nth-child(3)` — "BACKGROUND"
    - **display**: `block` → `inline`
    - **rect**: `116,510 72x13` → `143,489 67x12`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(1)>div:nth-child(4)>div:nth-child(1)>div:nth-child(1)>span:nth-child(4)` — "Gradient background"
    - **margin**: `0px` → `5px 0px 18px`
    - **rect**: `196,507 171x19` → `143,510 157x18`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(1)>div:nth-child(4)>div:nth-child(2)>div:nth-child(1)>span:nth-child(2)` — "02"
    - **padding**: `0px` → `17px 0px 0px 15px`
    - **rect**: `95,672 13x14` → `59,628 46x136`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(1)>div:nth-child(4)>div:nth-child(2)>div:nth-child(1)>span:nth-child(3)` — "TRANSFORM"
    - **display**: `block` → `inline`
    - **rect**: `116,672 65x13` → `143,651 60x12`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(1)>div:nth-child(4)>div:nth-child(2)>div:nth-child(1)>span:nth-child(4)` — "Remove background"
    - **margin**: `0px` → `5px 0px 18px`
    - **rect**: `189,669 153x19` → `143,672 140x18`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(1)>div:nth-child(4)>div:nth-child(3)>div:nth-child(1)>span:nth-child(2)` — "03"
    - **padding**: `0px` → `17px 0px 0px 15px`
    - **rect**: `95,786 13x14` → `59,776 46x150`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(1)>div:nth-child(4)>div:nth-child(3)>div:nth-child(1)>span:nth-child(3)` — "STYLE"
    - **display**: `block` → `inline`
    - **rect**: `116,786 36x13` → `143,799 34x12`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(1)>div:nth-child(4)>div:nth-child(3)>div:nth-child(1)>span:nth-child(4)` — "Add outline"
    - **margin**: `0px` → `5px 0px 18px`
    - **rect**: `160,783 99x19` → `143,820 91x18`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(1)>div:nth-child(4)>div:nth-child(4)>div:nth-child(1)>span:nth-child(2)` — "04"
    - **padding**: `0px` → `17px 0px 0px 15px`
    - **rect**: `95,948 13x14` → `59,938 46x142`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(1)>div:nth-child(4)>div:nth-child(4)>div:nth-child(1)>span:nth-child(4)` — "Round corners"
    - **margin**: `0px` → `5px 0px 18px`
    - **rect**: `160,945 117x19` → `143,982 107x18`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(3)>div:nth-child(1)>span:nth-child(2)` — "1200 × 800 px"
    - **margin**: `0px` → `5px 0px 0px`
    - **rect**: `1236,214 86x14` → `1073,291 79x13`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(3)>div:nth-child(2)>span:nth-child(2)` — "PNG-24"
    - **margin**: `0px` → `5px 0px 0px`
    - **rect**: `1282,238 40x14` → `1159,291 79x13`

### `body>div:nth-child(1)>div:nth-child(1)>header:nth-child(1)>div:nth-child(1)>span:nth-child(2)` — "easy-png-tools"
    - **rect**: `98,23 118x18` → `98,23 108x17`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(1)>div:nth-child(2)>div:nth-child(1)>p:nth-child(2)` — "Chain simple tools together. Every chang"
    - **rect**: `58,321 474x51` → `58,285 482x51`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(1)>div:nth-child(2)>div:nth-child(2)>span:nth-child(2)` — "source.png"
    - **rect**: `597,347 66x14` → `606,311 60x13`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(1)>div:nth-child(2)>div:nth-child(2)>b:nth-child(3)` — "1.8 MB"
    - **rect**: `671,347 40x14` → `674,311 36x13`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(1)>div:nth-child(3)>div:nth-child(1)>span:nth-child(1)` — "PROCESSING PIPELINE"
    - **rect**: `58,434 137x13` → `58,400 127x12`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(1)>div:nth-child(3)>div:nth-child(1)>strong:nth-child(2)>em:nth-child(1)` — "• LIVE"
    - **rect**: `184,457 36x13` → `173,425 33x12`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(2)>div:nth-child(1)>div:nth-child(1)>span:nth-child(1)` — "PIPELINE OUTPUTS"
    - **rect**: `799,177 58x33` → `799,188 54x36`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(2)>div:nth-child(1)>div:nth-child(1)>strong:nth-child(2)` — "Visual history"
    - **rect**: `799,216 93x36` → `799,233 87x34`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1)>span:nth-child(1)` — "PNG"
    - **rect**: `923,499 28x19` → `923,478 27x18`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>span:nth-child(2)` — "original.png · 1200 × 800"
    - **rect**: `925,707 135x11` → `942,663 124x10`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(2)>div:nth-child(2)>div:nth-child(2)>div:nth-child(2)>div:nth-child(2)>span:nth-child(2)` — "gradient applied"
    - **rect**: `1262,707 86x11` → `1275,663 79x10`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(2)>div:nth-child(2)>div:nth-child(3)>div:nth-child(2)>div:nth-child(2)>span:nth-child(2)` — "background removed"
    - **rect**: `962,1140 97x11` → `977,1021 89x10`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(2)>div:nth-child(2)>div:nth-child(4)>div:nth-child(2)>div:nth-child(2)>span:nth-child(2)` — "outline added"
    - **rect**: `1278,1140 70x11` → `1290,1021 64x10`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(2)>div:nth-child(2)>div:nth-child(5)>div:nth-child(2)>div:nth-child(2)>span:nth-child(2)` — "ready · PNG-24"
    - **rect**: `984,1572 76x11` → `997,1378 69x10`

### `body>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>section:nth-child(2)>p:nth-child(3)` — "Output is generated in-browser. Your fil"
    - **rect**: `799,1627 565x17` → `799,1425 565x17`

## Только у нас (структурно)

- `+ Add tool`
- `AUTO`
- `Gradient color`
- `DIRECTION`
- `135°`
- `OPACITY`
- `Automatic subject detection enabled`
- `WIDTH`
- `Outline width`
- `2px`
- `Outline color`
- `RADIUS`
- `Corner radius`
- `18px`

## Только в рефе (структурно)

- `/ DEMO`
- `135
                        °`
- `100%`
- `2
                        px`
- `18
                        px`
- `v2.4.0`
- `© 2024`
