# CSS audit (phase B)

_2026-08-29T05:34:12.653Z_

## Сводка

| route | ref | tokL | tokD | style (el) | fields | rect | +struct | -struct | tag | text |
|---|---|---|---|---|---|---|---|---|---|---|
| `/preview/demo` | demo.html | 10 | 16 | 215 | 1499 | 215 | 0 | 0 | 0 | 0 |
| `/preview/list-tools` | list-tools.html | 10 | 16 | 303 | 1638 | 303 | 0 | 0 | 0 | 0 |
| `/preview/tools/linear-gradient-png` | gradient.html | 10 | 16 | 103 | 906 | 103 | 0 | 0 | 0 | 0 |
| `/preview/tools/remove-background-png` | background-remover.html | 10 | 16 | 108 | 965 | 108 | 0 | 0 | 0 | 0 |

## /preview/demo  (vs demo.html)

- Токены light: **10**, dark: **16**
- Стиль-расхождений: **215** элементов / **1499** полей (из них геометрия: 215)
- Структурные: +0 / -0 / tag 0 / text 0

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

### Расхождения стилей (топ 150)

### `body > main:1 > div:2 > section:1 > div:4 > article:1 > div:3 > div:2 > div:3 > label:1` — "OPACITY"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **letterSpacing**: `normal` → `0.8px`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **display**: `block` → `flex`
    - **justifyContent**: `normal` → `space-between`
    - **margin**: `0px` → `0px 0px 8px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `137.609px` → `143.922px`
    - **height**: `24px` → `12px`
    - **rect**: `548,607 138x24` → `477,534 144x12`

### `body > main:1 > div:2 > section:2 > div:1 > div:2 > button:2` — "Download result"
    - **fontSize**: `12px` → `11px`
    - **letterSpacing**: `0.48px` → `normal`
    - **justifyContent**: `normal` → `center`
    - **gap**: `8px` → `9px`
    - **padding**: `9px 14px` → `0px`
    - **margin**: `0px` → `18px 0px 0px`
    - **borderRadius**: `4px` → `0px`
    - **borderTopWidth**: `1px` → `0px`
    - **borderTopColor**: `rgb(23, 105, 210)` → `rgb(255, 255, 255)`
    - **borderTopStyle**: `solid` → `none`
    - **width**: `191.203px` → `418.875px`
    - **height**: `36px` → `42px`
    - **rect**: `877,231 191x36` → `791,204 419x42`

### `body > main:1 > div:2 > section:2 > div:1 > div:2 > button:4`
    - **fontSize**: `13.3333px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **display**: `flex` → `grid`
    - **justifyContent**: `center` → `normal`
    - **gridTemplateColumns**: `none` → `17px`
    - **padding**: `1px 6px` → `6px`
    - **borderRadius**: `4px` → `0px`
    - **borderTopWidth**: `1px` → `0px`
    - **borderTopColor**: `rgb(203, 211, 218)` → `rgb(109, 120, 131)`
    - **borderTopStyle**: `solid` → `none`
    - **width**: `32px` → `29px`
    - **height**: `32px` → `29px`
    - **rect**: `1211,298 32x32` → `1181,266 29x29`

### `body > main:1 > div:2 > section:1 > div:4 > article:1 > div:3 > div:1 > div:2 > span:1` — "AUTO"
    - **lineHeight**: `15px` → `normal`
    - **letterSpacing**: `0.8px` → `normal`
    - **textTransform**: `uppercase` → `none`
    - **color**: `rgb(37, 169, 106)` → `rgb(35, 131, 84)`
    - **gap**: `4.8px` → `4px`
    - **padding**: `2.4px 7.2px` → `0px`
    - **borderRadius**: `4px` → `0px`
    - **borderTopWidth**: `1px` → `0px`
    - **borderTopColor**: `color(srgb 0.535686 0.761569 0.679216)` → `rgb(203, 211, 218)`
    - **width**: `60.375px` → `38px`
    - **height**: `21.7812px` → `12px`
    - **rect**: `552,532 60x22` → `524,495 38x12`

### `body > main:1 > div:2 > section:1 > div:4 > article:2 > div:3 > div:1 > div:2 > span:1` — "AUTO"
    - **lineHeight**: `15px` → `normal`
    - **letterSpacing**: `0.8px` → `normal`
    - **textTransform**: `uppercase` → `none`
    - **color**: `rgb(37, 169, 106)` → `rgb(35, 131, 84)`
    - **gap**: `4.8px` → `4px`
    - **padding**: `2.4px 7.2px` → `0px`
    - **borderRadius**: `4px` → `0px`
    - **borderTopWidth**: `1px` → `0px`
    - **borderTopColor**: `color(srgb 0.535686 0.761569 0.679216)` → `rgb(203, 211, 218)`
    - **width**: `60.375px` → `38px`
    - **height**: `21.7812px` → `12px`
    - **rect**: `552,691 60x22` → `524,657 38x12`

### `body > main:1 > div:2 > section:1 > div:4 > article:3 > div:3 > div:1 > div:2 > span:1` — "AUTO"
    - **lineHeight**: `15px` → `normal`
    - **letterSpacing**: `0.8px` → `normal`
    - **textTransform**: `uppercase` → `none`
    - **color**: `rgb(37, 169, 106)` → `rgb(35, 131, 84)`
    - **gap**: `4.8px` → `4px`
    - **padding**: `2.4px 7.2px` → `0px`
    - **borderRadius**: `4px` → `0px`
    - **borderTopWidth**: `1px` → `0px`
    - **borderTopColor**: `color(srgb 0.535686 0.761569 0.679216)` → `rgb(203, 211, 218)`
    - **width**: `60.375px` → `38px`
    - **height**: `21.7812px` → `12px`
    - **rect**: `552,790 60x22` → `524,805 38x12`

### `body > main:1 > div:2 > section:1 > div:4 > article:4 > div:3 > div:1 > div:2 > span:1` — "AUTO"
    - **lineHeight**: `15px` → `normal`
    - **letterSpacing**: `0.8px` → `normal`
    - **textTransform**: `uppercase` → `none`
    - **color**: `rgb(37, 169, 106)` → `rgb(35, 131, 84)`
    - **gap**: `4.8px` → `4px`
    - **padding**: `2.4px 7.2px` → `0px`
    - **borderRadius**: `4px` → `0px`
    - **borderTopWidth**: `1px` → `0px`
    - **borderTopColor**: `color(srgb 0.535686 0.761569 0.679216)` → `rgb(203, 211, 218)`
    - **width**: `60.375px` → `38px`
    - **height**: `21.7812px` → `12px`
    - **rect**: `552,941 60x22` → `524,967 38x12`

### `body > main:1 > div:2 > section:2 > div:2 > div:1 > div:2`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `9px`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **alignItems**: `baseline` → `normal`
    - **padding**: `0px` → `8px`
    - **borderTopWidth**: `0px` → `1px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `467.219px` → `239.375px`
    - **height**: `13px` → `27px`
    - **rect**: `769,648 467x13` → `716,637 239x27`

### `body > main:1 > div:2 > section:2 > div:2 > div:2 > div:2`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `9px`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **alignItems**: `baseline` → `normal`
    - **padding**: `0px` → `8px`
    - **borderTopWidth**: `0px` → `1px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `467.219px` → `239.391px`
    - **height**: `13px` → `27px`
    - **rect**: `769,970 467x13` → `969,637 239x27`

### `body > main:1 > div:2 > section:2 > div:2 > div:3 > div:2`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `9px`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **alignItems**: `baseline` → `normal`
    - **padding**: `0px` → `8px`
    - **borderTopWidth**: `0px` → `1px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `467.219px` → `239.375px`
    - **height**: `13px` → `27px`
    - **rect**: `769,1291 467x13` → `716,978 239x27`

### `body > main:1 > div:2 > section:2 > div:2 > div:4 > div:2`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `9px`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **alignItems**: `baseline` → `normal`
    - **padding**: `0px` → `8px`
    - **borderTopWidth**: `0px` → `1px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `467.219px` → `239.391px`
    - **height**: `13px` → `27px`
    - **rect**: `769,1613 467x13` → `969,978 239x27`

### `body > main:1 > div:2 > section:2 > div:2 > div:5 > div:2`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `9px`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **alignItems**: `baseline` → `normal`
    - **padding**: `0px` → `8px`
    - **borderTopWidth**: `0px` → `1px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `467.219px` → `239.375px`
    - **height**: `13px` → `27px`
    - **rect**: `769,1934 467x13` → `716,1319 239x27`

### `body > main:1 > div:2 > section:1 > div:4 > article:4 > div:3 > div:2 > div:2`
    - **fontSize**: `13.6px` → `16px`
    - **lineHeight**: `20.4px` → `24px`
    - **display**: `flex` → `block`
    - **alignItems**: `center` → `normal`
    - **justifyContent**: `space-between` → `normal`
    - **gap**: `16px` → `normal`
    - **padding**: `10px 0px 0px` → `0px`
    - **borderTopWidth**: `1px` → `0px`
    - **width**: `222.406px` → `234.422px`
    - **height**: `53px` → `44px`
    - **rect**: `463,1005 222x53` → `387,1006 234x44`

### `body > main:1 > div:2 > section:1 > div:4 > article:4 > div:3 > div:2 > div:2 > button:2 > i:1`
    - **fontSize**: `13.3333px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **color**: `rgb(0, 0, 0)` → `rgb(23, 33, 43)`
    - **backgroundColor**: `rgb(255, 255, 255)` → `rgba(0, 0, 0, 0)`
    - **display**: `block` → `inline`
    - **borderRadius**: `50%` → `0px`
    - **borderTopColor**: `rgb(0, 0, 0)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `16.7969px` → `auto`
    - **height**: `16.7969px` → `auto`
    - **rect**: `667,1029 17x17` → `558,1015 0x0`

### `body > main:1 > div:2 > section:2 > div:1 > div:2 > div:3`
    - **display**: `flex` → `grid`
    - **flexDirection**: `column` → `row`
    - **gap**: `2.4px` → `8px`
    - **gridTemplateColumns**: `none` → `78.625px 78.625px 78.625px`
    - **padding**: `0px` → `14px 0px 0px`
    - **borderTopWidth**: `0px` → `1px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `164.812px` → `251.875px`
    - **height**: `78.2812px` → `48px`
    - **rect**: `1079,210 165x78` → `919,256 252x48`

### `body > main:1 > div:2 > section:2 > div:1 > div:2 > div:3 > div:1`
    - **display**: `flex` → `grid`
    - **alignItems**: `baseline` → `normal`
    - **justifyContent**: `space-between` → `normal`
    - **gap**: `16px` → `5px`
    - **gridTemplateColumns**: `none` → `78.625px`
    - **padding**: `4px 0px` → `0px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `164.812px` → `78.625px`
    - **height**: `24.5px` → `33px`
    - **rect**: `1079,210 165x25` → `919,271 79x33`

### `body > main:1 > div:2 > section:2 > div:1 > div:2 > div:3 > div:2`
    - **display**: `flex` → `grid`
    - **alignItems**: `baseline` → `normal`
    - **justifyContent**: `space-between` → `normal`
    - **gap**: `16px` → `5px`
    - **gridTemplateColumns**: `none` → `78.625px`
    - **padding**: `4px 0px` → `0px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `164.812px` → `78.625px`
    - **height**: `24.5px` → `33px`
    - **rect**: `1079,237 165x25` → `1006,271 79x33`

### `body > main:1 > div:2 > section:2 > div:1 > div:2 > div:3 > div:3`
    - **display**: `flex` → `grid`
    - **alignItems**: `baseline` → `normal`
    - **justifyContent**: `space-between` → `normal`
    - **gap**: `16px` → `5px`
    - **gridTemplateColumns**: `none` → `78.625px`
    - **padding**: `4px 0px` → `0px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `164.812px` → `78.625px`
    - **height**: `24.5px` → `33px`
    - **rect**: `1079,264 165x25` → `1092,271 79x33`

### `body > main:1 > div:2 > section:2 > div:2 > div:1 > div:1`
    - **backgroundColor**: `rgba(0, 0, 0, 0)` → `rgb(228, 232, 235)`
    - **display**: `block` → `grid`
    - **alignItems**: `normal` → `center`
    - **gridTemplateColumns**: `none` → `207.375px`
    - **padding**: `0px` → `16px`
    - **borderRadius**: `4px` → `0px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `467.219px` → `239.375px`
    - **height**: `276.859px` → `300px`
    - **rect**: `769,367 467x277` → `716,337 239x300`

### `body > main:1 > div:2 > section:2 > div:2 > div:2 > div:1`
    - **backgroundColor**: `rgba(0, 0, 0, 0)` → `rgb(228, 232, 235)`
    - **display**: `block` → `grid`
    - **alignItems**: `normal` → `center`
    - **gridTemplateColumns**: `none` → `207.391px`
    - **padding**: `0px` → `16px`
    - **borderRadius**: `4px` → `0px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `467.219px` → `239.391px`
    - **height**: `276.859px` → `300px`
    - **rect**: `769,688 467x277` → `969,337 239x300`

### `body > main:1 > div:2 > section:2 > div:2 > div:3 > div:1`
    - **backgroundColor**: `rgba(0, 0, 0, 0)` → `rgb(228, 232, 235)`
    - **display**: `block` → `grid`
    - **alignItems**: `normal` → `center`
    - **gridTemplateColumns**: `none` → `207.375px`
    - **padding**: `0px` → `16px`
    - **borderRadius**: `4px` → `0px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `467.219px` → `239.375px`
    - **height**: `276.859px` → `300px`
    - **rect**: `769,1010 467x277` → `716,678 239x300`

### `body > main:1 > div:2 > section:2 > div:2 > div:4 > div:1`
    - **backgroundColor**: `rgba(0, 0, 0, 0)` → `rgb(228, 232, 235)`
    - **display**: `block` → `grid`
    - **alignItems**: `normal` → `center`
    - **gridTemplateColumns**: `none` → `207.391px`
    - **padding**: `0px` → `16px`
    - **borderRadius**: `4px` → `0px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `467.219px` → `239.391px`
    - **height**: `276.859px` → `300px`
    - **rect**: `769,1331 467x277` → `969,678 239x300`

### `body > main:1 > div:2 > section:2 > div:2 > div:5 > div:1`
    - **backgroundColor**: `rgba(0, 0, 0, 0)` → `rgb(228, 232, 235)`
    - **display**: `block` → `grid`
    - **alignItems**: `normal` → `center`
    - **gridTemplateColumns**: `none` → `207.375px`
    - **padding**: `0px` → `16px`
    - **borderRadius**: `4px` → `0px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `467.219px` → `239.375px`
    - **height**: `276.859px` → `300px`
    - **rect**: `769,1652 467x277` → `716,1019 239x300`

### `body > main:1 > div:2 > section:1 > div:4 > article:1 > div:3 > div:2 > div:1 > div:2 > input:2`
    - **textTransform**: `uppercase` → `none`
    - **backgroundColor**: `rgb(238, 241, 244)` → `rgba(0, 0, 0, 0)`
    - **padding**: `5.6px 8px` → `0px`
    - **borderRadius**: `4px` → `0px`
    - **borderTopWidth**: `1px` → `0px`
    - **borderTopColor**: `rgb(203, 211, 218)` → `rgb(23, 33, 43)`
    - **borderTopStyle**: `solid` → `none`
    - **width**: `85.2188px` → `127px`
    - **height**: `27.1875px` → `13px`
    - **rect**: `257,636 85x27` → `167,563 127x13`

### `body > main:1 > div:2 > section:1 > div:4 > article:1 > div:3 > div:2 > div:2 > input:2`
    - **fontSize**: `13.3333px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **color**: `rgb(16, 16, 16)` → `rgb(23, 33, 43)`
    - **backgroundColor**: `rgb(255, 255, 255)` → `rgba(0, 0, 0, 0)`
    - **display**: `block` → `inline-block`
    - **margin**: `2px` → `0px`
    - **borderTopColor**: `rgb(16, 16, 16)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `137.609px` → `119.922px`
    - **rect**: `388,631 138x16` → `341,555 120x16`

### `body > main:1 > div:2 > section:1 > div:4 > article:1 > div:3 > div:2 > div:3 > label:1 > output:1` — "100%"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **letterSpacing**: `normal` → `0.8px`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `25.2031px`
    - **height**: `auto` → `12px`
    - **rect**: `617,609 44x20` → `596,534 25x12`

### `body > main:1 > div:2 > section:1 > div:4 > article:1 > div:3 > div:2 > div:3 > div:2 > button:1` — "100"
    - **letterSpacing**: `0.6px` → `normal`
    - **textTransform**: `uppercase` → `none`
    - **color**: `rgb(109, 120, 131)` → `rgb(255, 255, 255)`
    - **backgroundColor**: `rgba(0, 0, 0, 0)` → `rgb(23, 105, 210)`
    - **display**: `flex` → `block`
    - **alignItems**: `center` → `normal`
    - **padding**: `0px 11.2px` → `0px`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(255, 255, 255)`
    - **width**: `42.1875px` → `35.4688px`
    - **rect**: `549,640 42x30` → `478,555 35x30`

### `body > main:1 > div:2 > section:1 > div:4 > article:3 > div:3 > div:2 > div:1 > input:2`
    - **fontSize**: `13.3333px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **color**: `rgb(16, 16, 16)` → `rgb(23, 33, 43)`
    - **backgroundColor**: `rgb(255, 255, 255)` → `rgba(0, 0, 0, 0)`
    - **display**: `block` → `inline-block`
    - **margin**: `2px` → `0px`
    - **borderTopColor**: `rgb(16, 16, 16)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `222.406px` → `234.422px`
    - **rect**: `227,889 222x16` → `136,865 234x16`

### `body > main:1 > div:2 > section:1 > div:4 > article:3 > div:3 > div:2 > div:2 > div:2 > input:2`
    - **textTransform**: `uppercase` → `none`
    - **backgroundColor**: `rgb(238, 241, 244)` → `rgba(0, 0, 0, 0)`
    - **padding**: `5.6px 8px` → `0px`
    - **borderRadius**: `4px` → `0px`
    - **borderTopWidth**: `1px` → `0px`
    - **borderTopColor**: `rgb(203, 211, 218)` → `rgb(23, 33, 43)`
    - **borderTopStyle**: `solid` → `none`
    - **width**: `190.422px` → `194.422px`
    - **height**: `27.1875px` → `13px`
    - **rect**: `495,894 190x27` → `418,873 194x13`

### `body > main:1 > div:2 > section:1 > div:4 > article:4 > div:3 > div:2 > div:1 > input:2`
    - **fontSize**: `13.3333px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **color**: `rgb(16, 16, 16)` → `rgb(23, 33, 43)`
    - **backgroundColor**: `rgb(255, 255, 255)` → `rgba(0, 0, 0, 0)`
    - **display**: `block` → `inline-block`
    - **margin**: `2px` → `0px`
    - **borderTopColor**: `rgb(16, 16, 16)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `222.406px` → `234.422px`
    - **rect**: `227,1040 222x16` → `136,1027 234x16`

### `body > main:1 > div:2 > section:1 > div:4 > article:4 > div:3 > div:2 > div:2 > button:2`
    - **fontSize**: `13.3333px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **color**: `rgb(0, 0, 0)` → `rgb(23, 33, 43)`
    - **backgroundColor**: `rgb(23, 105, 210)` → `rgba(0, 0, 0, 0)`
    - **display**: `block` → `inline-block`
    - **borderRadius**: `999px` → `0px`
    - **borderTopColor**: `rgb(23, 105, 210)` → `rgb(203, 211, 218)`
    - **width**: `38.3906px` → `32px`
    - **height**: `20.7969px` → `18px`
    - **rect**: `647,1027 38x21` → `542,1006 32x18`

### `body > main:1 > div:2 > section:2 > div:2 > div:5`
    - **backgroundColor**: `rgb(248, 250, 251)` → `rgb(238, 241, 244)`
    - **display**: `flex` → `block`
    - **flexDirection**: `column` → `row`
    - **gap**: `4.8px` → `normal`
    - **padding**: `6.4px` → `0px`
    - **borderRadius**: `4px` → `0px`
    - **borderTopColor**: `rgb(203, 211, 218)` → `rgb(23, 105, 210)`
    - **width**: `482px` → `241.375px`
    - **height**: `309.438px` → `329px`
    - **rect**: `761,1645 482x309` → `715,1018 241x329`

### `body > main:1 > header:1 > div:3 > div:4 > span:2` — "/"
    - **fontFamily**: `"IBM Plex Mono", monospace` → `"IBM Plex Sans", sans-serif`
    - **fontSize**: `10px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **color**: `rgb(109, 120, 131)` → `rgb(23, 33, 43)`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `6px` → `4.45312px`
    - **height**: `13px` → `24px`
    - **rect**: `1344,25 6x13` → `1194,20 4x24`

### `body > main:1 > div:2 > section:1 > div:3 > div:1 > span:1` — "PROCESSING PIPELINE"
    - **lineHeight**: `12px` → `normal`
    - **letterSpacing**: `1px` → `1.2px`
    - **textTransform**: `uppercase` → `none`
    - **display**: `block` → `inline`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `153.609px` → `auto`
    - **height**: `12px` → `auto`
    - **rect**: `178,459 154x12` → `51,388 127x12`

### `body > main:1 > div:2 > section:1 > div:4 > article:1 > div:3 > div:2 > div:1 > label:1` — "COLOR"
    - **letterSpacing**: `0.5px` → `0.8px`
    - **textTransform**: `uppercase` → `none`
    - **alignItems**: `baseline` → `normal`
    - **gap**: `8px` → `normal`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `137.594px` → `189px`
    - **height**: `13px` → `12px`
    - **rect**: `225,607 138x13` → `136,534 189x12`

### `body > main:1 > div:2 > section:1 > div:4 > article:1 > div:3 > div:2 > div:2 > label:1` — "DIRECTION"
    - **letterSpacing**: `0.5px` → `0.8px`
    - **textTransform**: `uppercase` → `none`
    - **alignItems**: `center` → `normal`
    - **gap**: `8px` → `normal`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `137.609px` → `119.922px`
    - **height**: `14px` → `12px`
    - **rect**: `386,607 138x14` → `341,534 120x12`

### `body > main:1 > div:2 > section:1 > div:4 > article:3 > div:3 > div:2 > div:1 > label:1` — "WIDTH"
    - **letterSpacing**: `0.5px` → `0.8px`
    - **textTransform**: `uppercase` → `none`
    - **alignItems**: `center` → `normal`
    - **gap**: `8px` → `normal`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `222.406px` → `234.422px`
    - **height**: `14px` → `12px`
    - **rect**: `225,865 222x14` → `136,844 234x12`

### `body > main:1 > div:2 > section:1 > div:4 > article:3 > div:3 > div:2 > div:2 > label:1` — "COLOR"
    - **letterSpacing**: `0.5px` → `0.8px`
    - **textTransform**: `uppercase` → `none`
    - **alignItems**: `baseline` → `normal`
    - **gap**: `8px` → `normal`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `222.406px` → `234.422px`
    - **height**: `13px` → `12px`
    - **rect**: `463,865 222x13` → `387,844 234x12`

### `body > main:1 > div:2 > section:1 > div:4 > article:4 > div:3 > div:2 > div:1 > label:1` — "RADIUS"
    - **letterSpacing**: `0.5px` → `0.8px`
    - **textTransform**: `uppercase` → `none`
    - **alignItems**: `center` → `normal`
    - **gap**: `8px` → `normal`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `222.406px` → `234.422px`
    - **height**: `14px` → `12px`
    - **rect**: `225,1016 222x14` → `136,1006 234x12`

### `body > main:1 > div:2 > section:2 > div:1 > div:1 > span:1` — "PIPELINE OUTPUTS"
    - **lineHeight**: `12px` → `normal`
    - **letterSpacing**: `1px` → `1.2px`
    - **textTransform**: `uppercase` → `none`
    - **display**: `block` → `inline`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `78.5781px` → `auto`
    - **height**: `24px` → `auto`
    - **rect**: `761,203 79x24` → `715,188 54x36`

### `body > main:1 > div:2 > section:2 > div:2 > div:1`
    - **backgroundColor**: `rgb(248, 250, 251)` → `rgb(238, 241, 244)`
    - **display**: `flex` → `block`
    - **flexDirection**: `column` → `row`
    - **gap**: `4.8px` → `normal`
    - **padding**: `6.4px` → `0px`
    - **borderRadius**: `4px` → `0px`
    - **width**: `482px` → `241.375px`
    - **height**: `309.438px` → `329px`
    - **rect**: `761,359 482x309` → `715,336 241x329`

### `body > main:1 > div:2 > section:2 > div:2 > div:2`
    - **backgroundColor**: `rgb(248, 250, 251)` → `rgb(238, 241, 244)`
    - **display**: `flex` → `block`
    - **flexDirection**: `column` → `row`
    - **gap**: `4.8px` → `normal`
    - **padding**: `6.4px` → `0px`
    - **borderRadius**: `4px` → `0px`
    - **width**: `482px` → `241.391px`
    - **height**: `309.438px` → `329px`
    - **rect**: `761,681 482x309` → `968,336 241x329`

### `body > main:1 > div:2 > section:2 > div:2 > div:3`
    - **backgroundColor**: `rgb(248, 250, 251)` → `rgb(238, 241, 244)`
    - **display**: `flex` → `block`
    - **flexDirection**: `column` → `row`
    - **gap**: `4.8px` → `normal`
    - **padding**: `6.4px` → `0px`
    - **borderRadius**: `4px` → `0px`
    - **width**: `482px` → `241.375px`
    - **height**: `309.438px` → `329px`
    - **rect**: `761,1002 482x309` → `715,677 241x329`

### `body > main:1 > div:2 > section:2 > div:2 > div:4`
    - **backgroundColor**: `rgb(248, 250, 251)` → `rgb(238, 241, 244)`
    - **display**: `flex` → `block`
    - **flexDirection**: `column` → `row`
    - **gap**: `4.8px` → `normal`
    - **padding**: `6.4px` → `0px`
    - **borderRadius**: `4px` → `0px`
    - **width**: `482px` → `241.391px`
    - **height**: `309.438px` → `329px`
    - **rect**: `761,1324 482x309` → `968,677 241x329`

### `body > main:1 > footer:3 > span:1` — "easy-png-tools"
    - **letterSpacing**: `0.8px` → `normal`
    - **display**: `block` → `flex`
    - **alignItems**: `normal` → `center`
    - **gap**: `normal` → `7px`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `142.812px` → `116.984px`
    - **height**: `13px` → `12px`
    - **rect**: `58,2108 143x13` → `51,1500 117x12`

### `body > main:1 > footer:3 > span:1 > b:1` — "v2.4.0"
    - **fontWeight**: `700` → `400`
    - **letterSpacing**: `0.8px` → `normal`
    - **color**: `rgb(109, 120, 131)` → `rgb(23, 105, 210)`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `33px`
    - **height**: `auto` → `12px`
    - **rect**: `160,2108 41x13` → `135,1500 33x12`

### `body > main:1 > footer:3 > span:2` — "pipeline is local-only"
    - **letterSpacing**: `0.8px` → `normal`
    - **display**: `block` → `flex`
    - **alignItems**: `normal` → `center`
    - **gap**: `normal` → `7px`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `162.609px` → `140.969px`
    - **height**: `16px` → `13px`
    - **rect**: `690,2107 163x16` → `612,1500 141x13`

### `body > main:1 > footer:3 > span:3` — "© 2024"
    - **letterSpacing**: `0.8px` → `normal`
    - **display**: `block` → `flex`
    - **alignItems**: `normal` → `center`
    - **gap**: `normal` → `7px`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `40.8125px` → `33px`
    - **height**: `13px` → `12px`
    - **rect**: `1342,2108 41x13` → `1196,1500 33x12`

### `body > main:1 > header:1 > div:3 > button:2`
    - **fontSize**: `13.3333px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **display**: `flex` → `grid`
    - **justifyContent**: `center` → `normal`
    - **gridTemplateColumns**: `none` → `17px`
    - **width**: `28px` → `29px`
    - **height**: `28px` → `29px`
    - **rect**: `1224,18 28x28` → `1074,17 29x29`

### `body > main:1 > header:1 > div:3 > button:3`
    - **fontSize**: `13.3333px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **display**: `flex` → `grid`
    - **justifyContent**: `center` → `normal`
    - **gridTemplateColumns**: `none` → `17px`
    - **width**: `28px` → `29px`
    - **height**: `28px` → `29px`
    - **rect**: `1268,18 28x28` → `1119,17 29x29`

### `body > main:1 > div:2`
    - **gridTemplateColumns**: `508.812px 520px` → `588.844px 532.766px`
    - **padding**: `60px 57.6px 72px` → `60px 51.2px 72px`
    - **margin**: `0px 120px` → `0px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1200px` → `1280px`
    - **height**: `2025.97px` → `1418.5px`
    - **rect**: `120,64 1200x2026` → `0,64 1280x1419`

### `body > main:1 > div:2 > section:1 > div:2 > div:1 > h1:1` — "Build your image pipeline."
    - **fontSize**: `57.6px` → `51.2px`
    - **lineHeight**: `51.84px` → `51.2px`
    - **letterSpacing**: `-3.456px` → `-3.072px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `316.203px` → `405.062px`
    - **height**: `155.484px` → `102.406px`
    - **rect**: `178,155 316x155` → `51,154 405x102`

### `body > main:1 > div:2 > section:1 > div:3 > div:1`
    - **display**: `flex` → `block`
    - **flexDirection**: `column` → `row`
    - **gap**: `2px` → `normal`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `153.609px` → `148.484px`
    - **height**: `37px` → `46px`
    - **rect**: `178,459 154x37` → `51,380 148x46`

### `body > main:1 > div:2 > section:1 > div:4 > article:1 > div:1` — "01"
    - **fontSize**: `22px` → `11px`
    - **fontWeight**: `600` → `400`
    - **lineHeight**: `22px` → `normal`
    - **padding**: `17px 0px 6px 15px` → `17px 0px 0px 15px`
    - **borderTopColor**: `rgb(23, 105, 210)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **height**: `45px` → `150px`
    - **rect**: `179,524 46x45` → `52,454 46x150`

### `body > main:1 > div:2 > section:1 > div:4 > article:1 > div:3`
    - **display**: `flex` → `block`
    - **flexDirection**: `column` → `row`
    - **padding**: `0px` → `15px 18px 18px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `460.812px` → `520.844px`
    - **height**: `147px` → `150px`
    - **rect**: `225,524 461x147` → `118,454 521x150`

### `body > main:1 > div:2 > section:1 > div:4 > article:1 > div:3 > div:1`
    - **alignItems**: `flex-start` → `center`
    - **gap**: `8px` → `15px`
    - **padding**: `8px 12px` → `0px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `460.812px` → `484.844px`
    - **height**: `72px` → `65px`
    - **rect**: `225,524 461x72` → `136,469 485x65`

### `body > main:1 > div:2 > section:1 > div:4 > article:1 > div:3 > div:2 > div:1`
    - **display**: `flex` → `block`
    - **flexDirection**: `column` → `row`
    - **gap**: `8px` → `normal`
    - **padding**: `10px 0px 0px` → `0px`
    - **borderTopWidth**: `1px` → `0px`
    - **width**: `137.594px` → `189px`
    - **height**: `75px` → `52px`
    - **rect**: `225,596 138x75` → `136,534 189x52`

### `body > main:1 > div:2 > section:1 > div:4 > article:1 > div:3 > div:2 > div:1 > div:2`
    - **gap**: `6.4px` → `8px`
    - **padding**: `0px` → `0px 8px`
    - **borderTopWidth**: `0px` → `1px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `137.594px` → `189px`
    - **height**: `27.1875px` → `32px`
    - **rect**: `225,636 138x27` → `136,554 189x32`

### `body > main:1 > div:2 > section:1 > div:4 > article:1 > div:3 > div:2 > div:2`
    - **display**: `flex` → `block`
    - **flexDirection**: `column` → `row`
    - **gap**: `0px` → `normal`
    - **padding**: `10px 0px 0px` → `0px`
    - **borderTopWidth**: `1px` → `0px`
    - **width**: `137.609px` → `119.922px`
    - **height**: `75px` → `52px`
    - **rect**: `386,596 138x75` → `341,534 120x52`

### `body > main:1 > div:2 > section:1 > div:4 > article:1 > div:3 > div:2 > div:2 > label:1 > output:1` — "135 °"
    - **fontSize**: `11px` → `10px`
    - **letterSpacing**: `0.5px` → `0.8px`
    - **textTransform**: `uppercase` → `none`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `35.5px` → `31.5156px`
    - **height**: `14px` → `12px`
    - **rect**: `488,607 36x14` → `430,534 32x12`

### `body > main:1 > div:2 > section:1 > div:4 > article:1 > div:3 > div:2 > div:3`
    - **display**: `flex` → `block`
    - **flexDirection**: `column` → `row`
    - **gap**: `8px` → `normal`
    - **padding**: `10px 0px 0px` → `0px`
    - **borderTopWidth**: `1px` → `0px`
    - **width**: `137.609px` → `143.922px`
    - **height**: `75px` → `52px`
    - **rect**: `548,596 138x75` → `477,534 144x52`

### `body > main:1 > div:2 > section:1 > div:4 > article:2 > div:1` — "02"
    - **fontSize**: `22px` → `11px`
    - **fontWeight**: `600` → `400`
    - **lineHeight**: `22px` → `normal`
    - **padding**: `17px 0px 6px 15px` → `17px 0px 0px 15px`
    - **borderTopColor**: `rgb(23, 105, 210)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **height**: `45px` → `136px`
    - **rect**: `179,683 46x45` → `52,616 46x136`

### `body > main:1 > div:2 > section:1 > div:4 > article:2 > div:3`
    - **display**: `flex` → `block`
    - **flexDirection**: `column` → `row`
    - **padding**: `0px` → `15px 18px 18px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `460.812px` → `520.844px`
    - **height**: `87px` → `136px`
    - **rect**: `225,683 461x87` → `118,616 521x136`

### `body > main:1 > div:2 > section:1 > div:4 > article:2 > div:3 > div:1`
    - **alignItems**: `flex-start` → `center`
    - **gap**: `8px` → `15px`
    - **padding**: `8px 12px` → `0px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `460.812px` → `484.844px`
    - **height**: `72px` → `65px`
    - **rect**: `225,683 461x72` → `136,631 485x65`

### `body > main:1 > div:2 > section:1 > div:4 > article:3 > div:1` — "03"
    - **fontSize**: `22px` → `11px`
    - **fontWeight**: `600` → `400`
    - **lineHeight**: `22px` → `normal`
    - **padding**: `17px 0px 6px 15px` → `17px 0px 0px 15px`
    - **borderTopColor**: `rgb(23, 105, 210)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **height**: `45px` → `150px`
    - **rect**: `179,782 46x45` → `52,764 46x150`

### `body > main:1 > div:2 > section:1 > div:4 > article:3 > div:3`
    - **display**: `flex` → `block`
    - **flexDirection**: `column` → `row`
    - **padding**: `0px` → `15px 18px 18px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `460.812px` → `520.844px`
    - **height**: `139.188px` → `150px`
    - **rect**: `225,782 461x139` → `118,764 521x150`

### `body > main:1 > div:2 > section:1 > div:4 > article:3 > div:3 > div:1`
    - **alignItems**: `flex-start` → `center`
    - **gap**: `8px` → `15px`
    - **padding**: `8px 12px` → `0px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `460.812px` → `484.844px`
    - **height**: `72px` → `65px`
    - **rect**: `225,782 461x72` → `136,779 485x65`

### `body > main:1 > div:2 > section:1 > div:4 > article:3 > div:3 > div:2 > div:1`
    - **display**: `flex` → `block`
    - **flexDirection**: `column` → `row`
    - **gap**: `0px` → `normal`
    - **padding**: `10px 0px 0px` → `0px`
    - **borderTopWidth**: `1px` → `0px`
    - **width**: `222.406px` → `234.422px`
    - **height**: `67.1875px` → `52px`
    - **rect**: `225,854 222x67` → `136,844 234x52`

### `body > main:1 > div:2 > section:1 > div:4 > article:3 > div:3 > div:2 > div:1 > label:1 > output:1` — "2 px"
    - **fontSize**: `11px` → `10px`
    - **letterSpacing**: `0.5px` → `0.8px`
    - **textTransform**: `uppercase` → `none`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `28.4062px` → `25.2188px`
    - **height**: `14px` → `12px`
    - **rect**: `419,865 28x14` → `345,844 25x12`

### `body > main:1 > div:2 > section:1 > div:4 > article:3 > div:3 > div:2 > div:2`
    - **display**: `flex` → `block`
    - **flexDirection**: `column` → `row`
    - **gap**: `8px` → `normal`
    - **padding**: `10px 0px 0px` → `0px`
    - **borderTopWidth**: `1px` → `0px`
    - **width**: `222.406px` → `234.422px`
    - **height**: `67.1875px` → `52px`
    - **rect**: `463,854 222x67` → `387,844 234x52`

### `body > main:1 > div:2 > section:1 > div:4 > article:3 > div:3 > div:2 > div:2 > div:2`
    - **gap**: `6.4px` → `8px`
    - **padding**: `0px` → `0px 8px`
    - **borderTopWidth**: `0px` → `1px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `222.406px` → `234.422px`
    - **height**: `27.1875px` → `32px`
    - **rect**: `463,894 222x27` → `387,864 234x32`

### `body > main:1 > div:2 > section:1 > div:4 > article:4 > div:1` — "04"
    - **fontSize**: `22px` → `11px`
    - **fontWeight**: `600` → `400`
    - **lineHeight**: `22px` → `normal`
    - **padding**: `17px 0px 6px 15px` → `17px 0px 0px 15px`
    - **borderTopColor**: `rgb(23, 105, 210)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **height**: `45px` → `142px`
    - **rect**: `179,933 46x45` → `52,926 46x142`

### `body > main:1 > div:2 > section:1 > div:4 > article:4 > div:3`
    - **display**: `flex` → `block`
    - **flexDirection**: `column` → `row`
    - **padding**: `0px` → `15px 18px 18px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `460.812px` → `520.844px`
    - **height**: `125px` → `142px`
    - **rect**: `225,933 461x125` → `118,926 521x142`

### `body > main:1 > div:2 > section:1 > div:4 > article:4 > div:3 > div:1`
    - **alignItems**: `flex-start` → `center`
    - **gap**: `8px` → `15px`
    - **padding**: `8px 12px` → `0px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `460.812px` → `484.844px`
    - **height**: `72px` → `65px`
    - **rect**: `225,933 461x72` → `136,941 485x65`

### `body > main:1 > div:2 > section:1 > div:4 > article:4 > div:3 > div:2 > div:1`
    - **display**: `flex` → `block`
    - **flexDirection**: `column` → `row`
    - **gap**: `0px` → `normal`
    - **padding**: `10px 0px 0px` → `0px`
    - **borderTopWidth**: `1px` → `0px`
    - **width**: `222.406px` → `234.422px`
    - **height**: `53px` → `44px`
    - **rect**: `225,1005 222x53` → `136,1006 234x44`

### `body > main:1 > div:2 > section:1 > div:4 > article:4 > div:3 > div:2 > div:1 > label:1 > output:1` — "18 px"
    - **fontSize**: `11px` → `10px`
    - **letterSpacing**: `0.5px` → `0.8px`
    - **textTransform**: `uppercase` → `none`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `35.5px` → `31.5156px`
    - **height**: `14px` → `12px`
    - **rect**: `412,1016 36x14` → `339,1006 32x12`

### `body > main:1 > div:2 > section:1 > div:4 > article:4 > div:3 > div:2 > div:2 > span:1` — "Preserve aspect ratio"
    - **fontSize**: `13.6px` → `16px`
    - **lineHeight**: `20.4px` → `24px`
    - **display**: `block` → `inline`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `129.031px` → `auto`
    - **height**: `20.3906px` → `auto`
    - **rect**: `463,1027 129x20` → `387,1009 156x17`

### `body > main:1 > div:2 > section:2 > div:1 > div:1`
    - **display**: `flex` → `block`
    - **flexDirection**: `column` → `row`
    - **gap**: `2px` → `normal`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `78.5781px` → `75.8906px`
    - **height**: `67px` → `87px`
    - **rect**: `761,203 79x67` → `715,180 76x87`

### `body > main:1 > div:2 > section:2 > div:1 > div:2 > div:3 > div:1 > span:1` — "DIMENSIONS"
    - **lineHeight**: `13.5px` → `normal`
    - **letterSpacing**: `0.9px` → `normal`
    - **textTransform**: `uppercase` → `none`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `63px` → `78.625px`
    - **height**: `13.5px` → `10px`
    - **rect**: `1079,216 63x14` → `919,271 79x10`

### `body > main:1 > div:2 > section:2 > div:1 > div:2 > div:3 > div:1 > b:2` — "1200 × 800 px"
    - **fontWeight**: `700` → `400`
    - **lineHeight**: `16.5px` → `normal`
    - **margin**: `0px` → `5px 0px 0px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `85.8125px` → `78.625px`
    - **height**: `16.5px` → `13px`
    - **rect**: `1158,214 86x17` → `919,291 79x13`

### `body > main:1 > div:2 > section:2 > div:1 > div:2 > div:3 > div:2 > span:1` — "FORMAT"
    - **lineHeight**: `13.5px` → `normal`
    - **letterSpacing**: `0.9px` → `normal`
    - **textTransform**: `uppercase` → `none`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `37.8125px` → `78.625px`
    - **height**: `13.5px` → `10px`
    - **rect**: `1079,243 38x14` → `1006,271 79x10`

### `body > main:1 > div:2 > section:2 > div:1 > div:2 > div:3 > div:2 > b:2` — "PNG-24"
    - **fontWeight**: `700` → `400`
    - **lineHeight**: `16.5px` → `normal`
    - **margin**: `0px` → `5px 0px 0px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `39.6094px` → `78.625px`
    - **height**: `16.5px` → `13px`
    - **rect**: `1204,241 40x17` → `1006,291 79x13`

### `body > main:1 > div:2 > section:2 > div:1 > div:2 > div:3 > div:3 > span:1` — "SIZE"
    - **lineHeight**: `13.5px` → `normal`
    - **letterSpacing**: `0.9px` → `normal`
    - **textTransform**: `uppercase` → `none`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `25.2031px` → `78.625px`
    - **height**: `13.5px` → `10px`
    - **rect**: `1079,270 25x14` → `1092,271 79x10`

### `body > main:1 > div:2 > section:2 > div:1 > div:2 > div:3 > div:3 > b:2` — "1.2 MB"
    - **fontWeight**: `700` → `400`
    - **lineHeight**: `16.5px` → `normal`
    - **margin**: `0px` → `5px 0px 0px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `39.6094px` → `78.625px`
    - **height**: `16.5px` → `13px`
    - **rect**: `1204,268 40x17` → `1092,291 79x13`

### `body > main:1 > div:2 > section:2 > div:2 > div:1 > div:2 > span:1` — "SOURCE"
    - **fontSize**: `10px` → `9px`
    - **letterSpacing**: `0.8px` → `normal`
    - **textTransform**: `uppercase` → `none`
    - **borderTopColor**: `rgb(23, 105, 210)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `40.8125px` → `29.7031px`
    - **height**: `13px` → `10px`
    - **rect**: `769,648 41x13` → `724,646 30x10`

### `body > main:1 > div:2 > section:2 > div:2 > div:2 > div:2 > span:1` — "STEP 01"
    - **fontSize**: `10px` → `9px`
    - **letterSpacing**: `0.8px` → `normal`
    - **textTransform**: `uppercase` → `none`
    - **borderTopColor**: `rgb(23, 105, 210)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `47.6094px` → `34.6406px`
    - **height**: `13px` → `10px`
    - **rect**: `769,970 48x13` → `977,646 35x10`

### `body > main:1 > div:2 > section:2 > div:2 > div:3 > div:2 > span:1` — "STEP 02"
    - **fontSize**: `10px` → `9px`
    - **letterSpacing**: `0.8px` → `normal`
    - **textTransform**: `uppercase` → `none`
    - **borderTopColor**: `rgb(23, 105, 210)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `47.6094px` → `34.6406px`
    - **height**: `13px` → `10px`
    - **rect**: `769,1291 48x13` → `724,987 35x10`

### `body > main:1 > div:2 > section:2 > div:2 > div:4 > div:2 > span:1` — "STEP 03"
    - **fontSize**: `10px` → `9px`
    - **letterSpacing**: `0.8px` → `normal`
    - **textTransform**: `uppercase` → `none`
    - **borderTopColor**: `rgb(23, 105, 210)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `47.6094px` → `34.6406px`
    - **height**: `13px` → `10px`
    - **rect**: `769,1613 48x13` → `977,987 35x10`

### `body > main:1 > div:2 > section:2 > div:2 > div:5 > div:2 > span:1` — "FINAL OUTPUT"
    - **fontSize**: `10px` → `9px`
    - **letterSpacing**: `0.8px` → `normal`
    - **textTransform**: `uppercase` → `none`
    - **borderTopColor**: `rgb(23, 105, 210)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `81.6094px` → `59.3906px`
    - **height**: `13px` → `10px`
    - **rect**: `769,1934 82x13` → `724,1328 59x10`

### `body > main:1 > header:1 > nav:2`
    - **gap**: `18px` → `22px`
    - **margin**: `0px 0px 0px 24px` → `0px 28px 0px 355.891px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `376.594px` → `296.938px`
    - **height**: `15px` → `12px`
    - **rect**: `528,24 377x15` → `639,26 297x12`

### `body > main:1 > header:1 > nav:2 > a:1` — "Workspace"
    - **fontSize**: `12px` → `10px`
    - **letterSpacing**: `0.48px` → `normal`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `69.125px` → `49.4844px`
    - **height**: `15px` → `12px`
    - **rect**: `528,24 69x15` → `639,26 49x12`

### `body > main:1 > header:1 > nav:2 > a:2` — "Catalog"
    - **fontSize**: `12px` → `10px`
    - **letterSpacing**: `0.48px` → `normal`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `53.7656px` → `38.5px`
    - **height**: `15px` → `12px`
    - **rect**: `615,24 54x15` → `710,26 39x12`

### `body > main:1 > header:1 > nav:2 > a:3` — "Gradient"
    - **fontSize**: `12px` → `10px`
    - **letterSpacing**: `0.48px` → `normal`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `61.4531px` → `43.9844px`
    - **height**: `15px` → `12px`
    - **rect**: `687,24 61x15` → `771,26 44x12`

### `body > main:1 > header:1 > nav:2 > a:4` — "Background remover"
    - **fontSize**: `12px` → `10px`
    - **letterSpacing**: `0.48px` → `normal`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `138.25px` → `98.9688px`
    - **height**: `15px` → `12px`
    - **rect**: `767,24 138x15` → `837,26 99x12`

### `body > main:1 > header:1 > div:3 > button:2 > svg:1`
    - **fontSize**: `13.3333px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `16px` → `17px`
    - **height**: `16px` → `17px`
    - **rect**: `1230,24 16x16` → `1080,23 17x17`

### `body > main:1 > header:1 > div:3 > button:3 > svg:1`
    - **fontSize**: `13.3333px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `16px` → `17px`
    - **height**: `16px` → `17px`
    - **rect**: `1274,24 16x16` → `1125,23 17x17`

### `body > main:1 > div:2 > section:1 > div:4 > article:1 > div:3 > div:1 > div:1`
    - **display**: `flex` → `block`
    - **flexDirection**: `column` → `row`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `171px` → `156.703px`
    - **height**: `55px` → `65px`
    - **rect**: `237,532 171x55` → `136,469 157x65`

### `body > main:1 > div:2 > section:1 > div:4 > article:1 > div:3 > div:1 > div:1 > span:1` — "BACKGROUND"
    - **textTransform**: `uppercase` → `none`
    - **display**: `block` → `inline`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `171px` → `auto`
    - **height**: `13px` → `auto`
    - **rect**: `237,532 171x13` → `136,477 67x12`

### `body > main:1 > div:2 > section:1 > div:4 > article:1 > div:3 > div:1 > div:2 > span:1 > svg:1`
    - **lineHeight**: `15px` → `normal`
    - **letterSpacing**: `0.8px` → `normal`
    - **textTransform**: `uppercase` → `none`
    - **color**: `rgb(37, 169, 106)` → `rgb(35, 131, 84)`
    - **borderTopColor**: `rgb(37, 169, 106)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **rect**: `560,537 12x12` → `524,495 12x12`

### `body > main:1 > div:2 > section:1 > div:4 > article:1 > div:3 > div:1 > div:2 > button:2`
    - **fontSize**: `13.3333px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **display**: `flex` → `block`
    - **padding**: `1px 6px` → `0px`
    - **width**: `28px` → `16px`
    - **height**: `18px` → `16px`
    - **rect**: `620,534 28x18` → `575,493 16x16`

### `body > main:1 > div:2 > section:1 > div:4 > article:1 > div:3 > div:2`
    - **gap**: `0px 24px` → `16px`
    - **gridTemplateColumns**: `137.594px 137.609px 137.609px` → `189px 119.922px 143.922px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `460.812px` → `484.844px`
    - **height**: `75px` → `52px`
    - **rect**: `225,596 461x75` → `136,534 485x52`

### `body > main:1 > div:2 > section:1 > div:4 > article:1 > div:3 > div:2 > div:3 > div:2 > button:2` — "75"
    - **letterSpacing**: `0.6px` → `normal`
    - **textTransform**: `uppercase` → `none`
    - **display**: `flex` → `block`
    - **alignItems**: `center` → `normal`
    - **padding**: `0px 11.2px` → `0px`
    - **width**: `36.5781px` → `35.4844px`
    - **rect**: `591,640 37x30` → `514,555 35x30`

### `body > main:1 > div:2 > section:1 > div:4 > article:1 > div:3 > div:2 > div:3 > div:2 > button:3` — "50"
    - **letterSpacing**: `0.6px` → `normal`
    - **textTransform**: `uppercase` → `none`
    - **display**: `flex` → `block`
    - **alignItems**: `center` → `normal`
    - **padding**: `0px 11.2px` → `0px`
    - **width**: `36.5781px` → `35.4844px`
    - **rect**: `628,640 37x30` → `549,555 35x30`

### `body > main:1 > div:2 > section:1 > div:4 > article:1 > div:3 > div:2 > div:3 > div:2 > button:4` — "25"
    - **letterSpacing**: `0.6px` → `normal`
    - **textTransform**: `uppercase` → `none`
    - **display**: `flex` → `block`
    - **alignItems**: `center` → `normal`
    - **padding**: `0px 11.2px` → `0px`
    - **width**: `36.5781px` → `35.4844px`
    - **rect**: `664,640 37x30` → `585,555 35x30`

### `body > main:1 > div:2 > section:1 > div:4 > article:2 > div:3 > div:1 > div:1`
    - **display**: `flex` → `block`
    - **flexDirection**: `column` → `row`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `153px` → `140.203px`
    - **height**: `55px` → `65px`
    - **rect**: `237,691 153x55` → `136,631 140x65`

### `body > main:1 > div:2 > section:1 > div:4 > article:2 > div:3 > div:1 > div:1 > span:1` — "TRANSFORM"
    - **textTransform**: `uppercase` → `none`
    - **display**: `block` → `inline`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `153px` → `auto`
    - **height**: `13px` → `auto`
    - **rect**: `237,691 153x13` → `136,639 60x12`

### `body > main:1 > div:2 > section:1 > div:4 > article:2 > div:3 > div:1 > div:2 > span:1 > svg:1`
    - **lineHeight**: `15px` → `normal`
    - **letterSpacing**: `0.8px` → `normal`
    - **textTransform**: `uppercase` → `none`
    - **color**: `rgb(37, 169, 106)` → `rgb(35, 131, 84)`
    - **borderTopColor**: `rgb(37, 169, 106)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **rect**: `560,696 12x12` → `524,657 12x12`

### `body > main:1 > div:2 > section:1 > div:4 > article:2 > div:3 > div:1 > div:2 > button:2`
    - **fontSize**: `13.3333px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **display**: `flex` → `block`
    - **padding**: `1px 6px` → `0px`
    - **width**: `28px` → `16px`
    - **height**: `18px` → `16px`
    - **rect**: `620,693 28x18` → `575,655 16x16`

### `body > main:1 > div:2 > section:1 > div:4 > article:3 > div:3 > div:1 > div:1`
    - **display**: `flex` → `block`
    - **flexDirection**: `column` → `row`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `99px` → `90.7188px`
    - **height**: `55px` → `65px`
    - **rect**: `237,790 99x55` → `136,779 91x65`

### `body > main:1 > div:2 > section:1 > div:4 > article:3 > div:3 > div:1 > div:1 > span:1` — "STYLE"
    - **textTransform**: `uppercase` → `none`
    - **display**: `block` → `inline`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `99px` → `auto`
    - **height**: `13px` → `auto`
    - **rect**: `237,790 99x13` → `136,787 34x12`

### `body > main:1 > div:2 > section:1 > div:4 > article:3 > div:3 > div:1 > div:2 > span:1 > svg:1`
    - **lineHeight**: `15px` → `normal`
    - **letterSpacing**: `0.8px` → `normal`
    - **textTransform**: `uppercase` → `none`
    - **color**: `rgb(37, 169, 106)` → `rgb(35, 131, 84)`
    - **borderTopColor**: `rgb(37, 169, 106)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **rect**: `560,795 12x12` → `524,805 12x12`

### `body > main:1 > div:2 > section:1 > div:4 > article:3 > div:3 > div:1 > div:2 > button:2`
    - **fontSize**: `13.3333px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **display**: `flex` → `block`
    - **padding**: `1px 6px` → `0px`
    - **width**: `28px` → `16px`
    - **height**: `18px` → `16px`
    - **rect**: `620,792 28x18` → `575,803 16x16`

### `body > main:1 > div:2 > section:1 > div:4 > article:3 > div:3 > div:2`
    - **gap**: `0px 16px` → `16px`
    - **gridTemplateColumns**: `222.406px 222.406px` → `234.422px 234.422px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `460.812px` → `484.844px`
    - **height**: `67.1875px` → `52px`
    - **rect**: `225,854 461x67` → `136,844 485x52`

### `body > main:1 > div:2 > section:1 > div:4 > article:4 > div:3 > div:1 > div:1`
    - **display**: `flex` → `block`
    - **flexDirection**: `column` → `row`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `117px` → `107.219px`
    - **height**: `55px` → `65px`
    - **rect**: `237,941 117x55` → `136,941 107x65`

### `body > main:1 > div:2 > section:1 > div:4 > article:4 > div:3 > div:1 > div:1 > span:1` — "STYLE"
    - **textTransform**: `uppercase` → `none`
    - **display**: `block` → `inline`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `117px` → `auto`
    - **height**: `13px` → `auto`
    - **rect**: `237,941 117x13` → `136,949 34x12`

### `body > main:1 > div:2 > section:1 > div:4 > article:4 > div:3 > div:1 > div:2 > span:1 > svg:1`
    - **lineHeight**: `15px` → `normal`
    - **letterSpacing**: `0.8px` → `normal`
    - **textTransform**: `uppercase` → `none`
    - **color**: `rgb(37, 169, 106)` → `rgb(35, 131, 84)`
    - **borderTopColor**: `rgb(37, 169, 106)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **rect**: `560,946 12x12` → `524,967 12x12`

### `body > main:1 > div:2 > section:1 > div:4 > article:4 > div:3 > div:1 > div:2 > button:2`
    - **fontSize**: `13.3333px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **display**: `flex` → `block`
    - **padding**: `1px 6px` → `0px`
    - **width**: `28px` → `16px`
    - **height**: `18px` → `16px`
    - **rect**: `620,943 28x18` → `575,965 16x16`

### `body > main:1 > div:2 > section:1 > div:4 > article:4 > div:3 > div:2`
    - **gap**: `0px 16px` → `16px`
    - **gridTemplateColumns**: `222.406px 222.406px` → `234.422px 234.422px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `460.812px` → `484.844px`
    - **height**: `53px` → `44px`
    - **rect**: `225,1005 461x53` → `136,1006 485x44`

### `body > main:1 > div:2 > section:2 > div:1`
    - **gap**: `16px` → `normal`
    - **padding**: `0px 0px 12px` → `0px 0px 15px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `482px` → `494.766px`
    - **height**: `200.281px` → `177px`
    - **rect**: `761,143 482x200` → `715,143 495x177`

### `body > main:1 > div:2 > section:2 > div:1 > div:2 > button:4 > svg:1`
    - **fontSize**: `13.3333px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `16px` → `17px`
    - **height**: `16px` → `17px`
    - **rect**: `1219,306 16x16` → `1187,272 17x17`

### `body > main:1 > div:2 > section:2 > div:2 > div:1 > div:2 > b:2` — "original.png · 1200 × 800"
    - **fontSize**: `10px` → `9px`
    - **textAlign**: `start` → `right`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `150px` → `123.719px`
    - **height**: `13px` → `10px`
    - **rect**: `1086,648 150x13` → `824,646 124x10`

### `body > main:1 > div:2 > section:2 > div:2 > div:2 > div:2 > b:2` — "gradient applied"
    - **fontSize**: `10px` → `9px`
    - **textAlign**: `start` → `right`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `96px` → `79.1719px`
    - **height**: `13px` → `10px`
    - **rect**: `1140,970 96x13` → `1122,646 79x10`

### `body > main:1 > div:2 > section:2 > div:2 > div:3 > div:2 > b:2` — "background removed"
    - **fontSize**: `10px` → `9px`
    - **textAlign**: `start` → `right`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `108px` → `89.0781px`
    - **height**: `13px` → `10px`
    - **rect**: `1128,1291 108x13` → `858,987 89x10`

### `body > main:1 > div:2 > section:2 > div:2 > div:4 > div:2 > b:2` — "outline added"
    - **fontSize**: `10px` → `9px`
    - **textAlign**: `start` → `right`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `78px` → `64.3281px`
    - **height**: `13px` → `10px`
    - **rect**: `1158,1613 78x13` → `1136,987 64x10`

### `body > main:1 > div:2 > section:2 > div:2 > div:5 > div:2 > b:2` — "ready · PNG-24"
    - **fontSize**: `10px` → `9px`
    - **textAlign**: `start` → `right`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `84px` → `69.2812px`
    - **height**: `13px` → `10px`
    - **rect**: `1152,1934 84x13` → `878,1328 69x10`

### `body > main:1`
    - **backgroundColor**: `rgba(0, 0, 0, 0)` → `rgb(238, 241, 244)`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `1280px`
    - **height**: `2138.97px` → `1528.5px`
    - **rect**: `0,0 1440x2139` → `0,0 1280x1529`

### `body > main:1 > header:1 > div:3 > span:1 > i:1`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `8px` → `6px`
    - **height**: `8px` → `6px`
    - **boxShadow**: `color(srgb 0.145098 0.662745 0.415686 / 0.25) 0px 0px 0px 2px` → `none`
    - **rect**: `1105,28 8x8` → `963,29 6x6`

### `body > main:1 > div:2 > section:1 > div:1` — "PNG PROCESSING WORKSPACE"
    - **color**: `rgb(109, 120, 131)` → `rgb(23, 105, 210)`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `508.812px` → `588.844px`
    - **height**: `13px` → `12px`
    - **rect**: `178,124 509x13` → `51,124 589x12`

### `body > main:1 > div:2 > section:1 > div:3`
    - **gap**: `16px` → `normal`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `508.812px` → `588.844px`
    - **height**: `50px` → `59px`
    - **rect**: `178,459 509x50` → `51,380 589x59`

### `body > main:1 > div:2 > section:1 > div:4`
    - **gridTemplateColumns**: `508.812px` → `588.844px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `508.812px` → `588.844px`
    - **height**: `550.188px` → `630px`
    - **rect**: `178,509 509x550` → `51,439 589x630`

### `body > main:1 > div:2 > section:1 > div:4 > article:1 > div:3 > div:1 > div:2`
    - **gap**: `8px` → `13px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `121.375px` → `97px`
    - **height**: `21.7812px` → `17px`
    - **rect**: `552,532 121x22` → `524,493 97x17`

### `body > main:1 > div:2 > section:1 > div:4 > article:2 > div:3 > div:1 > div:2`
    - **gap**: `8px` → `13px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `121.375px` → `97px`
    - **height**: `21.7812px` → `17px`
    - **rect**: `552,691 121x22` → `524,655 97x17`

### `body > main:1 > div:2 > section:1 > div:4 > article:3 > div:3 > div:1 > div:2`
    - **gap**: `8px` → `13px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `121.375px` → `97px`
    - **height**: `21.7812px` → `17px`
    - **rect**: `552,790 121x22` → `524,803 97x17`

### `body > main:1 > div:2 > section:1 > div:4 > article:4 > div:3 > div:1 > div:2`
    - **gap**: `8px` → `13px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `121.375px` → `97px`
    - **height**: `21.7812px` → `17px`
    - **rect**: `552,941 121x22` → `524,965 97x17`

### `body > main:1 > div:2 > section:1 > div:5 > span:2 > i:1`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `8px` → `6px`
    - **height**: `8px` → `6px`
    - **boxShadow**: `color(srgb 0.145098 0.662745 0.415686 / 0.25) 0px 0px 0px 2px` → `none`
    - **rect**: `453,1082 8x8` → `426,1093 6x6`

### `body > main:1 > div:2 > section:2 > div:2`
    - **gridTemplateColumns**: `482px` → `241.375px 241.391px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `482px` → `494.766px`
    - **height**: `1627.19px` → `1043px`
    - **rect**: `761,343 482x1627` → `715,320 495x1043`

### `body > main:1 > footer:3`
    - **letterSpacing**: `0.8px` → `normal`
    - **gap**: `16px` → `normal`
    - **padding**: `16px 57.6px` → `16px 51.2px`
    - **width**: `1440px` → `1280px`
    - **height**: `49px` → `46px`
    - **rect**: `0,2090 1440x49` → `0,1483 1280x46`

### `body`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `1280px`
    - **height**: `2138.97px` → `1528.5px`
    - **rect**: `0,0 1440x2139` → `0,0 1280x1529`

### `body > main:1 > header:1`
    - **padding**: `0px 57.6px` → `0px 51.2px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `1280px`
    - **rect**: `0,0 1440x64` → `0,0 1280x64`

### `body > main:1 > header:1 > a:1 > span:2` — "easy-png-tools"
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `117.609px` → `107.766px`
    - **height**: `18px` → `17px`
    - **rect**: `98,23 118x18` → `91,23 108x17`

### `body > main:1 > header:1 > a:1 > span:3` — "/ WORKSPACE"
    - **borderTopColor**: `rgb(23, 105, 210)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `79.2031px` → `73.7031px`
    - **height**: `13px` → `12px`
    - **rect**: `225,25 79x13` → `209,26 74x12`

### `body > main:1 > header:1 > div:3`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `277.812px` → `265.328px`
    - **height**: `28px` → `29px`
    - **rect**: `1105,18 278x28` → `963,17 265x29`

### `body > main:1 > header:1 > div:3 > span:1` — "AUTO PIPELINE"
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `103.406px` → `94.875px`
    - **height**: `13px` → `12px`
    - **rect**: `1105,25 103x13` → `963,26 95x12`

### `body > main:1 > header:1 > div:3 > div:4`
    - **alignItems**: `normal` → `center`
    - **borderRadius**: `4px` → `0px`
    - **width**: `70.4062px` → `64.4531px`
    - **height**: `27px` → `26px`
    - **rect**: `1312,18 70x27` → `1164,19 64x26`

### `body > main:1 > div:2 > section:1`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `508.812px` → `588.844px`
    - **height**: `970.453px` → `980.594px`
    - **rect**: `178,124 509x970` → `51,124 589x981`

### `body > main:1 > div:2 > section:1 > div:2`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `508.812px` → `588.844px`
    - **height**: `248.266px` → `169.594px`
    - **rect**: `178,155 509x248` → `51,154 589x170`

### `body > main:1 > div:2 > section:1 > div:2 > div:1`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `316.203px` → `405.062px`
    - **height**: `248.266px` → `169.594px`
    - **rect**: `178,155 316x248` → `51,154 405x170`

### `body > main:1 > div:2 > section:1 > div:2 > div:1 > p:2` — "Chain simple tools together. Every change is processed automatically and previewed at each stage."
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `316.203px` → `405.062px`
    - **height**: `76.7812px` → `51.1875px`
    - **rect**: `178,326 316x77` → `51,272 405x51`

### `body > main:1 > div:2 > section:1 > div:2 > div:2 > span:2` — "source.png"
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `66px` → `60.4844px`
    - **height**: `14px` → `13px`
    - **rect**: `560,378 66x14` → `522,299 60x13`

### `body > main:1 > div:2 > section:1 > div:2 > div:2 > b:3` — "1.8 MB"
    - **borderTopColor**: `rgb(23, 105, 210)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `39.6094px` → `36.2969px`
    - **height**: `14px` → `13px`
    - **rect**: `634,378 40x14` → `591,299 36x13`

### Структурные расхождения

_—_


## /preview/list-tools  (vs list-tools.html)

- Токены light: **10**, dark: **16**
- Стиль-расхождений: **303** элементов / **1638** полей (из них геометрия: 303)
- Структурные: +0 / -0 / tag 0 / text 0

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

### Расхождения стилей (топ 150)

### `body > main:1 > div:2 > div:1 > div:2`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `16px` → `14px`
    - **textAlign**: `start` → `right`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **flexDirection**: `column` → `row`
    - **alignItems**: `flex-end` → `center`
    - **gap**: `normal` → `14px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `61.2031px` → `123.625px`
    - **height**: `73.5938px` → `57.5938px`
    - **rect**: `1321,175 61x74` → `1105,206 124x58`

### `body > main:1 > div:2 > div:3 > section:1 > div:1`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `11px`
    - **fontWeight**: `400` → `600`
    - **lineHeight**: `24px` → `normal`
    - **letterSpacing**: `normal` → `1.32px`
    - **alignItems**: `baseline` → `center`
    - **gap**: `16px` → `normal`
    - **padding**: `0px 0px 8px` → `0px 0px 12px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `648.406px` → `574.812px`
    - **height**: `24px` → `26px`
    - **rect**: `58,324 648x24` → `51,415 575x26`

### `body > main:1 > div:2 > div:3 > section:2 > div:1`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `11px`
    - **fontWeight**: `400` → `600`
    - **lineHeight**: `24px` → `normal`
    - **letterSpacing**: `normal` → `1.32px`
    - **alignItems**: `baseline` → `center`
    - **gap**: `16px` → `normal`
    - **padding**: `0px 0px 8px` → `0px 0px 12px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `648.406px` → `574.812px`
    - **height**: `24px` → `26px`
    - **rect**: `734,324 648x24` → `654,415 575x26`

### `body > main:1 > div:2 > div:3 > section:3 > div:1`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `11px`
    - **fontWeight**: `400` → `600`
    - **lineHeight**: `24px` → `normal`
    - **letterSpacing**: `normal` → `1.32px`
    - **alignItems**: `baseline` → `center`
    - **gap**: `16px` → `normal`
    - **padding**: `0px 0px 8px` → `0px 0px 12px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `648.406px` → `574.812px`
    - **height**: `24px` → `26px`
    - **rect**: `58,990 648x24` → `51,1081 575x26`

### `body > main:1 > div:2 > div:3 > section:4 > div:1`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `11px`
    - **fontWeight**: `400` → `600`
    - **lineHeight**: `24px` → `normal`
    - **letterSpacing**: `normal` → `1.32px`
    - **alignItems**: `baseline` → `center`
    - **gap**: `16px` → `normal`
    - **padding**: `0px 0px 8px` → `0px 0px 12px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `648.406px` → `574.812px`
    - **height**: `24px` → `26px`
    - **rect**: `734,990 648x24` → `654,1081 575x26`

### `body > main:1 > div:2 > div:3 > section:5 > div:1`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `11px`
    - **fontWeight**: `400` → `600`
    - **lineHeight**: `24px` → `normal`
    - **letterSpacing**: `normal` → `1.32px`
    - **alignItems**: `baseline` → `center`
    - **gap**: `16px` → `normal`
    - **padding**: `0px 0px 8px` → `0px 0px 12px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `648.406px` → `574.812px`
    - **height**: `24px` → `26px`
    - **rect**: `58,1656 648x24` → `51,1747 575x26`

### `body > main:1 > div:2 > div:3 > section:6 > div:1`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `11px`
    - **fontWeight**: `400` → `600`
    - **lineHeight**: `24px` → `normal`
    - **letterSpacing**: `normal` → `1.32px`
    - **alignItems**: `baseline` → `center`
    - **gap**: `16px` → `normal`
    - **padding**: `0px 0px 8px` → `0px 0px 12px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `648.406px` → `574.812px`
    - **height**: `24px` → `26px`
    - **rect**: `734,1656 648x24` → `654,1747 575x26`

### `body > main:1 > div:2 > div:1 > div:2 > b:1` — "32"
    - **fontSize**: `32px` → `64px`
    - **fontWeight**: `700` → `400`
    - **lineHeight**: `normal` → `57.6px`
    - **letterSpacing**: `normal` → `-5.12px`
    - **textAlign**: `start` → `right`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `38.4062px` → `60.1406px`
    - **height**: `42px` → `57.5938px`
    - **rect**: `1344,175 38x42` → `1105,206 60x58`

### `body > main:1 > div:2 > div:1 > div:1 > h1:2` — "Tool catalog"
    - **fontSize**: `32px` → `51.2px`
    - **fontWeight**: `700` → `650`
    - **lineHeight**: `48px` → `51.2px`
    - **letterSpacing**: `normal` → `-3.072px`
    - **margin**: `0px` → `12px 0px 14px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `510.719px` → `660px`
    - **height**: `48px` → `51.2031px`
    - **rect**: `58,147 511x48` → `51,154 660x51`

### `body > main:1 > header:1 > div:3 > div:4 > span:2` — "/"
    - **fontFamily**: `"IBM Plex Mono", monospace` → `"IBM Plex Sans", sans-serif`
    - **fontSize**: `10px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **color**: `rgb(109, 120, 131)` → `rgb(23, 33, 43)`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `6px` → `4.45312px`
    - **height**: `13px` → `24px`
    - **rect**: `1344,25 6x13` → `1194,20 4x24`

### `body > main:1 > div:2 > div:1 > div:1 > div:1` — "EASY-PNG-TOOLS / CATALOG"
    - **fontSize**: `12px` → `10px`
    - **letterSpacing**: `2.16px` → `1.2px`
    - **color**: `rgb(109, 120, 131)` → `rgb(23, 105, 210)`
    - **margin**: `0px 0px 8px` → `0px 0px 18px`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `510.719px` → `660px`
    - **height**: `15px` → `12px`
    - **rect**: `58,124 511x15` → `51,124 660x12`

### `body > main:1 > div:2 > div:1 > div:1 > p:3` — "Focused utilities for working with PNG. Inspect, transform, and export — locally in your browser."
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `15.2px` → `14px`
    - **lineHeight**: `22.8px` → `22.4px`
    - **margin**: `8px 0px 0px` → `0px`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `510.719px` → `660px`
    - **height**: `45.5938px` → `44.7812px`
    - **rect**: `58,203 511x46` → `51,219 660x45`

### `body > main:1 > div:2 > div:3 > section:1 > div:2 > a:1 > span:2`
    - **display**: `flex` → `grid`
    - **flexDirection**: `column` → `row`
    - **gap**: `2px` → `8px`
    - **gridTemplateColumns**: `none` → `414.812px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `37px` → `59px`
    - **rect**: `131,398 488x37` → `124,478 415x59`

### `body > main:1 > div:2 > div:3 > section:1 > div:2 > a:2 > span:2`
    - **display**: `flex` → `grid`
    - **flexDirection**: `column` → `row`
    - **gap**: `2px` → `8px`
    - **gridTemplateColumns**: `none` → `414.812px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `37px` → `41px`
    - **rect**: `131,514 488x37` → `124,603 415x41`

### `body > main:1 > div:2 > div:3 > section:1 > div:2 > a:3 > span:2`
    - **display**: `flex` → `grid`
    - **flexDirection**: `column` → `row`
    - **gap**: `2px` → `8px`
    - **gridTemplateColumns**: `none` → `414.812px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `37px` → `59px`
    - **rect**: `131,630 488x37` → `124,710 415x59`

### `body > main:1 > div:2 > div:3 > section:1 > div:2 > a:4 > span:2`
    - **display**: `flex` → `grid`
    - **flexDirection**: `column` → `row`
    - **gap**: `2px` → `8px`
    - **gridTemplateColumns**: `none` → `414.812px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `37px` → `41px`
    - **rect**: `131,746 488x37` → `124,835 415x41`

### `body > main:1 > div:2 > div:3 > section:1 > div:2 > a:5 > span:2`
    - **display**: `flex` → `grid`
    - **flexDirection**: `column` → `row`
    - **gap**: `2px` → `8px`
    - **gridTemplateColumns**: `none` → `414.812px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `37px` → `59px`
    - **rect**: `131,862 488x37` → `124,942 415x59`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > a:1 > span:2`
    - **display**: `flex` → `grid`
    - **flexDirection**: `column` → `row`
    - **gap**: `2px` → `8px`
    - **gridTemplateColumns**: `none` → `414.812px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `55px` → `59px`
    - **rect**: `807,389 488x55` → `727,478 415x59`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > a:2 > span:2`
    - **display**: `flex` → `grid`
    - **flexDirection**: `column` → `row`
    - **gap**: `2px` → `8px`
    - **gridTemplateColumns**: `none` → `414.812px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `37px` → `41px`
    - **rect**: `807,514 488x37` → `727,603 415x41`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > a:3 > span:2`
    - **display**: `flex` → `grid`
    - **flexDirection**: `column` → `row`
    - **gap**: `2px` → `8px`
    - **gridTemplateColumns**: `none` → `414.812px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `37px` → `41px`
    - **rect**: `807,630 488x37` → `727,719 415x41`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > a:4 > span:2`
    - **display**: `flex` → `grid`
    - **flexDirection**: `column` → `row`
    - **gap**: `2px` → `8px`
    - **gridTemplateColumns**: `none` → `414.812px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `37px` → `59px`
    - **rect**: `807,746 488x37` → `727,826 415x59`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > a:5 > span:2`
    - **display**: `flex` → `grid`
    - **flexDirection**: `column` → `row`
    - **gap**: `2px` → `8px`
    - **gridTemplateColumns**: `none` → `414.812px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `55px` → `59px`
    - **rect**: `807,853 488x55` → `727,942 415x59`

### `body > main:1 > div:2 > div:3 > section:3 > div:2 > a:1 > span:2`
    - **display**: `flex` → `grid`
    - **flexDirection**: `column` → `row`
    - **gap**: `2px` → `8px`
    - **gridTemplateColumns**: `none` → `414.812px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `55px` → `59px`
    - **rect**: `131,1055 488x55` → `124,1144 415x59`

### `body > main:1 > div:2 > div:3 > section:3 > div:2 > a:2 > span:2`
    - **display**: `flex` → `grid`
    - **flexDirection**: `column` → `row`
    - **gap**: `2px` → `8px`
    - **gridTemplateColumns**: `none` → `414.812px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `37px` → `41px`
    - **rect**: `131,1180 488x37` → `124,1269 415x41`

### `body > main:1 > div:2 > div:3 > section:3 > div:2 > a:3 > span:2`
    - **display**: `flex` → `grid`
    - **flexDirection**: `column` → `row`
    - **gap**: `2px` → `8px`
    - **gridTemplateColumns**: `none` → `414.812px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `37px` → `41px`
    - **rect**: `131,1296 488x37` → `124,1385 415x41`

### `body > main:1 > div:2 > div:3 > section:3 > div:2 > a:4 > span:2`
    - **display**: `flex` → `grid`
    - **flexDirection**: `column` → `row`
    - **gap**: `2px` → `8px`
    - **gridTemplateColumns**: `none` → `414.812px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `37px` → `41px`
    - **rect**: `131,1412 488x37` → `124,1501 415x41`

### `body > main:1 > div:2 > div:3 > section:3 > div:2 > a:5 > span:2`
    - **display**: `flex` → `grid`
    - **flexDirection**: `column` → `row`
    - **gap**: `2px` → `8px`
    - **gridTemplateColumns**: `none` → `414.812px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `37px` → `41px`
    - **rect**: `131,1528 488x37` → `124,1617 415x41`

### `body > main:1 > div:2 > div:3 > section:4 > div:2 > a:1 > span:2`
    - **display**: `flex` → `grid`
    - **flexDirection**: `column` → `row`
    - **gap**: `2px` → `8px`
    - **gridTemplateColumns**: `none` → `414.812px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `55px` → `59px`
    - **rect**: `807,1055 488x55` → `727,1144 415x59`

### `body > main:1 > div:2 > div:3 > section:4 > div:2 > a:2 > span:2`
    - **display**: `flex` → `grid`
    - **flexDirection**: `column` → `row`
    - **gap**: `2px` → `8px`
    - **gridTemplateColumns**: `none` → `414.812px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `37px` → `41px`
    - **rect**: `807,1180 488x37` → `727,1269 415x41`

### `body > main:1 > div:2 > div:3 > section:4 > div:2 > a:3 > span:2`
    - **display**: `flex` → `grid`
    - **flexDirection**: `column` → `row`
    - **gap**: `2px` → `8px`
    - **gridTemplateColumns**: `none` → `414.812px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `37px` → `41px`
    - **rect**: `807,1296 488x37` → `727,1385 415x41`

### `body > main:1 > div:2 > div:3 > section:4 > div:2 > a:4 > span:2`
    - **display**: `flex` → `grid`
    - **flexDirection**: `column` → `row`
    - **gap**: `2px` → `8px`
    - **gridTemplateColumns**: `none` → `414.812px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `37px` → `41px`
    - **rect**: `807,1412 488x37` → `727,1501 415x41`

### `body > main:1 > div:2 > div:3 > section:4 > div:2 > a:5 > span:2`
    - **display**: `flex` → `grid`
    - **flexDirection**: `column` → `row`
    - **gap**: `2px` → `8px`
    - **gridTemplateColumns**: `none` → `414.812px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `37px` → `41px`
    - **rect**: `807,1528 488x37` → `727,1617 415x41`

### `body > main:1 > div:2 > div:3 > section:5 > div:2 > a:1 > span:2`
    - **display**: `flex` → `grid`
    - **flexDirection**: `column` → `row`
    - **gap**: `2px` → `8px`
    - **gridTemplateColumns**: `none` → `414.812px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `37px` → `59px`
    - **rect**: `131,1730 488x37` → `124,1810 415x59`

### `body > main:1 > div:2 > div:3 > section:5 > div:2 > a:2 > span:2`
    - **display**: `flex` → `grid`
    - **flexDirection**: `column` → `row`
    - **gap**: `2px` → `8px`
    - **gridTemplateColumns**: `none` → `414.812px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `37px` → `41px`
    - **rect**: `131,1846 488x37` → `124,1935 415x41`

### `body > main:1 > div:2 > div:3 > section:5 > div:2 > a:3 > span:2`
    - **display**: `flex` → `grid`
    - **flexDirection**: `column` → `row`
    - **gap**: `2px` → `8px`
    - **gridTemplateColumns**: `none` → `414.812px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `37px` → `41px`
    - **rect**: `131,1962 488x37` → `124,2051 415x41`

### `body > main:1 > div:2 > div:3 > section:5 > div:2 > a:4 > span:2`
    - **display**: `flex` → `grid`
    - **flexDirection**: `column` → `row`
    - **gap**: `2px` → `8px`
    - **gridTemplateColumns**: `none` → `414.812px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `37px` → `41px`
    - **rect**: `131,2078 488x37` → `124,2167 415x41`

### `body > main:1 > div:2 > div:3 > section:6 > div:2 > a:1 > span:2`
    - **display**: `flex` → `grid`
    - **flexDirection**: `column` → `row`
    - **gap**: `2px` → `8px`
    - **gridTemplateColumns**: `none` → `414.812px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `37px` → `41px`
    - **rect**: `807,1730 488x37` → `727,1819 415x41`

### `body > main:1 > div:2 > div:3 > section:6 > div:2 > a:2 > span:2`
    - **display**: `flex` → `grid`
    - **flexDirection**: `column` → `row`
    - **gap**: `2px` → `8px`
    - **gridTemplateColumns**: `none` → `414.812px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `37px` → `41px`
    - **rect**: `807,1846 488x37` → `727,1935 415x41`

### `body > main:1 > div:2 > div:3 > section:6 > div:2 > a:3 > span:2`
    - **display**: `flex` → `grid`
    - **flexDirection**: `column` → `row`
    - **gap**: `2px` → `8px`
    - **gridTemplateColumns**: `none` → `414.812px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `37px` → `41px`
    - **rect**: `807,1962 488x37` → `727,2051 415x41`

### `body > main:1 > div:2 > div:3 > section:6 > div:2 > a:4 > span:2`
    - **display**: `flex` → `grid`
    - **flexDirection**: `column` → `row`
    - **gap**: `2px` → `8px`
    - **gridTemplateColumns**: `none` → `414.812px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `37px` → `41px`
    - **rect**: `807,2078 488x37` → `727,2167 415x41`

### `body > main:1 > div:2 > footer:4 > span:1` — "•"
    - **letterSpacing**: `0.8px` → `normal`
    - **color**: `rgb(109, 120, 131)` → `rgb(23, 105, 210)`
    - **display**: `block` → `inline`
    - **margin**: `0px` → `0px 8px`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `6.8125px` → `auto`
    - **height**: `13px` → `auto`
    - **rect**: `258,2231 7x13` → `208,2326 11x12`

### `body > main:1 > header:1 > nav:2 > a:2` — "Catalog"
    - **fontSize**: `12px` → `10px`
    - **letterSpacing**: `0.48px` → `normal`
    - **color**: `rgb(109, 120, 131)` → `rgb(23, 105, 210)`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `53.7656px` → `38.5px`
    - **height**: `15px` → `12px`
    - **rect**: `591,24 54x15` → `679,26 39x12`

### `body > main:1 > header:1 > div:3 > button:2`
    - **fontSize**: `13.3333px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **display**: `flex` → `grid`
    - **justifyContent**: `center` → `normal`
    - **gridTemplateColumns**: `none` → `17px`
    - **width**: `28px` → `29px`
    - **height**: `28px` → `29px`
    - **rect**: `1224,18 28x28` → `1074,17 29x29`

### `body > main:1 > header:1 > div:3 > button:3`
    - **fontSize**: `13.3333px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **display**: `flex` → `grid`
    - **justifyContent**: `center` → `normal`
    - **gridTemplateColumns**: `none` → `17px`
    - **width**: `28px` → `29px`
    - **height**: `28px` → `29px`
    - **rect**: `1268,18 28x28` → `1119,17 29x29`

### `body > main:1 > div:2 > div:1 > div:2 > span:2` — "TOOLS AVAILABLE"
    - **lineHeight**: `normal` → `14px`
    - **letterSpacing**: `0.8px` → `normal`
    - **margin**: `5.6px 0px 0px` → `0px`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `61.2031px` → `49.4844px`
    - **height**: `26px` → `28px`
    - **rect**: `1321,223 61x26` → `1179,221 49x28`

### `body > main:1 > div:2 > div:2 > div:2 > button:2` — "ALL"
    - **letterSpacing**: `0.6px` → `normal`
    - **color**: `rgb(255, 255, 255)` → `rgb(23, 105, 210)`
    - **backgroundColor**: `rgb(23, 105, 210)` → `rgba(0, 0, 0, 0)`
    - **padding**: `6.4px 9.6px` → `8px 10px`
    - **borderRadius**: `4px` → `0px`
    - **width**: `41px` → `38.5px`
    - **height**: `27.7812px` → `30px`
    - **rect**: `872,272 41x28` → `769,337 39x30`

### `body > main:1 > div:2 > div:3 > section:1 > div:1 > span:1` — "CONVERT"
    - **fontSize**: `12px` → `11px`
    - **fontWeight**: `400` → `600`
    - **letterSpacing**: `1.68px` → `1.32px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `62.1719px` → `51.5781px`
    - **height**: `15px` → `13px`
    - **rect**: `58,324 62x15` → `51,415 52x13`

### `body > main:1 > div:2 > div:3 > section:2 > div:1 > span:1` — "TRANSPARENCY"
    - **fontSize**: `12px` → `11px`
    - **fontWeight**: `400` → `600`
    - **letterSpacing**: `1.68px` → `1.32px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `106.562px` → `88.4219px`
    - **height**: `15px` → `13px`
    - **rect**: `734,324 107x15` → `654,415 88x13`

### `body > main:1 > div:2 > div:3 > section:3 > div:1 > span:1` — "COLOR"
    - **fontSize**: `12px` → `11px`
    - **fontWeight**: `400` → `600`
    - **letterSpacing**: `1.68px` → `1.32px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `44.4062px` → `36.8438px`
    - **height**: `15px` → `13px`
    - **rect**: `58,990 44x15` → `51,1081 37x13`

### `body > main:1 > div:2 > div:3 > section:4 > div:1 > span:1` — "GEOMETRY"
    - **fontSize**: `12px` → `11px`
    - **fontWeight**: `400` → `600`
    - **letterSpacing**: `1.68px` → `1.32px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `71.0469px` → `58.9531px`
    - **height**: `15px` → `13px`
    - **rect**: `734,990 71x15` → `654,1081 59x13`

### `body > main:1 > div:2 > div:3 > section:5 > div:1 > span:1` — "FILTERS"
    - **fontSize**: `12px` → `11px`
    - **fontWeight**: `400` → `600`
    - **letterSpacing**: `1.68px` → `1.32px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `62.1719px` → `51.5781px`
    - **height**: `15px` → `13px`
    - **rect**: `58,1656 62x15` → `51,1747 52x13`

### `body > main:1 > div:2 > div:3 > section:6 > div:1 > span:1` — "ANALYZE"
    - **fontSize**: `12px` → `11px`
    - **fontWeight**: `400` → `600`
    - **letterSpacing**: `1.68px` → `1.32px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `62.1719px` → `51.5781px`
    - **height**: `15px` → `13px`
    - **rect**: `734,1656 62x15` → `654,1747 52x13`

### `body > main:1 > div:2 > footer:4` — "ALL OPERATIONS RUN LOCALLY YOUR FILES NEVER LEAVE THIS DEVICE"
    - **letterSpacing**: `0.8px` → `normal`
    - **display**: `flex` → `block`
    - **gap**: `24px` → `normal`
    - **padding**: `24px 0px 0px` → `20px 0px 0px`
    - **margin**: `56px 0px 0px` → `64px 0px 0px`
    - **width**: `1324.81px` → `1177.62px`
    - **height**: `38px` → `33px`
    - **rect**: `58,2206 1325x38` → `51,2305 1178x33`

### `body > main:1 > header:1 > nav:2`
    - **gap**: `18px` → `22px`
    - **margin**: `0px 0px 0px 24px` → `0px 28px 0px 337.797px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `376.594px` → `296.938px`
    - **height**: `15px` → `12px`
    - **rect**: `504,24 377x15` → `607,26 297x12`

### `body > main:1 > header:1 > nav:2 > a:1` — "Workspace"
    - **fontSize**: `12px` → `10px`
    - **letterSpacing**: `0.48px` → `normal`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `69.125px` → `49.4844px`
    - **height**: `15px` → `12px`
    - **rect**: `504,24 69x15` → `607,26 49x12`

### `body > main:1 > header:1 > nav:2 > a:3` — "Gradient"
    - **fontSize**: `12px` → `10px`
    - **letterSpacing**: `0.48px` → `normal`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `61.4531px` → `43.9844px`
    - **height**: `15px` → `12px`
    - **rect**: `663,24 61x15` → `739,26 44x12`

### `body > main:1 > header:1 > nav:2 > a:4` — "Background remover"
    - **fontSize**: `12px` → `10px`
    - **letterSpacing**: `0.48px` → `normal`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `138.25px` → `98.9688px`
    - **height**: `15px` → `12px`
    - **rect**: `742,24 138x15` → `805,26 99x12`

### `body > main:1 > header:1 > div:3 > button:2 > svg:1`
    - **fontSize**: `13.3333px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `16px` → `17px`
    - **height**: `16px` → `17px`
    - **rect**: `1230,24 16x16` → `1080,23 17x17`

### `body > main:1 > header:1 > div:3 > button:3 > svg:1`
    - **fontSize**: `13.3333px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `16px` → `17px`
    - **height**: `16px` → `17px`
    - **rect**: `1274,24 16x16` → `1125,23 17x17`

### `body > main:1 > div:2 > div:1`
    - **gap**: `24px` → `40px`
    - **padding**: `0px` → `0px 0px 42px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1324.81px` → `1177.62px`
    - **height**: `124.594px` → `182.984px`
    - **rect**: `58,124 1325x125` → `51,124 1178x183`

### `body > main:1 > div:2 > div:2`
    - **gap**: `16px` → `24px`
    - **padding**: `20px 0px` → `24px 0px 42px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1324.81px` → `1177.62px`
    - **height**: `75px` → `108px`
    - **rect**: `58,249 1325x75` → `51,307 1178x108`

### `body > main:1 > div:2 > div:2 > label:1`
    - **backgroundColor**: `rgb(248, 250, 251)` → `rgba(0, 0, 0, 0)`
    - **gap**: `8px` → `12px`
    - **padding**: `8px 12px` → `12px 14px`
    - **borderRadius**: `4px` → `0px`
    - **width**: `202px` → `420px`
    - **height**: `35px` → `42px`
    - **rect**: `58,269 202x35` → `51,331 420x42`

### `body > main:1 > div:2 > div:2 > div:2 > button:3` — "CONVERT"
    - **letterSpacing**: `0.6px` → `normal`
    - **padding**: `6.4px 9.6px` → `8px 10px`
    - **borderRadius**: `4px` → `0px`
    - **borderTopColor**: `rgb(203, 211, 218)` → `rgba(0, 0, 0, 0)`
    - **width**: `67.3906px` → `60.5px`
    - **height**: `27.7812px` → `30px`
    - **rect**: `920,272 67x28` → `814,337 61x30`

### `body > main:1 > div:2 > div:2 > div:2 > button:4` — "TRANSPARENCY"
    - **letterSpacing**: `0.6px` → `normal`
    - **padding**: `6.4px 9.6px` → `8px 10px`
    - **borderRadius**: `4px` → `0px`
    - **borderTopColor**: `rgb(203, 211, 218)` → `rgba(0, 0, 0, 0)`
    - **width**: `100.391px` → `87.9844px`
    - **height**: `27.7812px` → `30px`
    - **rect**: `993,272 100x28` → `880,337 88x30`

### `body > main:1 > div:2 > div:2 > div:2 > button:5` — "COLOR"
    - **letterSpacing**: `0.6px` → `normal`
    - **padding**: `6.4px 9.6px` → `8px 10px`
    - **borderRadius**: `4px` → `0px`
    - **borderTopColor**: `rgb(203, 211, 218)` → `rgba(0, 0, 0, 0)`
    - **width**: `54.1875px` → `49.5px`
    - **height**: `27.7812px` → `30px`
    - **rect**: `1100,272 54x28` → `974,337 50x30`

### `body > main:1 > div:2 > div:2 > div:2 > button:6` — "GEOMETRY"
    - **letterSpacing**: `0.6px` → `normal`
    - **padding**: `6.4px 9.6px` → `8px 10px`
    - **borderRadius**: `4px` → `0px`
    - **borderTopColor**: `rgb(203, 211, 218)` → `rgba(0, 0, 0, 0)`
    - **width**: `74px` → `65.9844px`
    - **height**: `27.7812px` → `30px`
    - **rect**: `1161,272 74x28` → `1030,337 66x30`

### `body > main:1 > div:2 > div:2 > div:2 > button:7` — "FILTERS"
    - **letterSpacing**: `0.6px` → `normal`
    - **padding**: `6.4px 9.6px` → `8px 10px`
    - **borderRadius**: `4px` → `0px`
    - **borderTopColor**: `rgb(203, 211, 218)` → `rgba(0, 0, 0, 0)`
    - **width**: `67.3906px` → `60.5px`
    - **height**: `27.7812px` → `30px`
    - **rect**: `1241,272 67x28` → `1102,337 61x30`

### `body > main:1 > div:2 > div:2 > div:2 > button:8` — "ANALYZE"
    - **letterSpacing**: `0.6px` → `normal`
    - **padding**: `6.4px 9.6px` → `8px 10px`
    - **borderRadius**: `4px` → `0px`
    - **borderTopColor**: `rgb(203, 211, 218)` → `rgba(0, 0, 0, 0)`
    - **width**: `67.3906px` → `60.5px`
    - **height**: `27.7812px` → `30px`
    - **rect**: `1315,272 67x28` → `1168,337 61x30`

### `body > main:1 > div:2 > div:3 > section:1`
    - **display**: `flex` → `block`
    - **flexDirection**: `column` → `row`
    - **gap**: `16px` → `normal`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `648.406px` → `574.812px`
    - **rect**: `58,324 648x610` → `51,415 575x610`

### `body > main:1 > div:2 > div:3 > section:1 > div:2`
    - **gridTemplateColumns**: `648.406px` → `574.812px`
    - **padding**: `0px` → `14px 0px 0px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `648.406px` → `574.812px`
    - **height**: `570px` → `584px`
    - **rect**: `58,364 648x570` → `51,441 575x584`

### `body > main:1 > div:2 > div:3 > section:2`
    - **display**: `flex` → `block`
    - **flexDirection**: `column` → `row`
    - **gap**: `16px` → `normal`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `648.406px` → `574.812px`
    - **rect**: `734,324 648x610` → `654,415 575x610`

### `body > main:1 > div:2 > div:3 > section:2 > div:2`
    - **gridTemplateColumns**: `648.406px` → `574.812px`
    - **padding**: `0px` → `14px 0px 0px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `648.406px` → `574.812px`
    - **height**: `570px` → `584px`
    - **rect**: `734,364 648x570` → `654,441 575x584`

### `body > main:1 > div:2 > div:3 > section:3`
    - **display**: `flex` → `block`
    - **flexDirection**: `column` → `row`
    - **gap**: `16px` → `normal`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `648.406px` → `574.812px`
    - **rect**: `58,990 648x610` → `51,1081 575x610`

### `body > main:1 > div:2 > div:3 > section:3 > div:2`
    - **gridTemplateColumns**: `648.406px` → `574.812px`
    - **padding**: `0px` → `14px 0px 0px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `648.406px` → `574.812px`
    - **height**: `570px` → `584px`
    - **rect**: `58,1030 648x570` → `51,1107 575x584`

### `body > main:1 > div:2 > div:3 > section:4`
    - **display**: `flex` → `block`
    - **flexDirection**: `column` → `row`
    - **gap**: `16px` → `normal`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `648.406px` → `574.812px`
    - **rect**: `734,990 648x610` → `654,1081 575x610`

### `body > main:1 > div:2 > div:3 > section:4 > div:2`
    - **gridTemplateColumns**: `648.406px` → `574.812px`
    - **padding**: `0px` → `14px 0px 0px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `648.406px` → `574.812px`
    - **height**: `570px` → `584px`
    - **rect**: `734,1030 648x570` → `654,1107 575x584`

### `body > main:1 > div:2 > div:3 > section:5`
    - **display**: `flex` → `block`
    - **flexDirection**: `column` → `row`
    - **gap**: `16px` → `normal`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `648.406px` → `574.812px`
    - **rect**: `58,1656 648x494` → `51,1747 575x494`

### `body > main:1 > div:2 > div:3 > section:5 > div:2`
    - **gridTemplateColumns**: `648.406px` → `574.812px`
    - **padding**: `0px` → `14px 0px 0px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `648.406px` → `574.812px`
    - **height**: `454px` → `468px`
    - **rect**: `58,1696 648x454` → `51,1773 575x468`

### `body > main:1 > div:2 > div:3 > section:6`
    - **display**: `flex` → `block`
    - **flexDirection**: `column` → `row`
    - **gap**: `16px` → `normal`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `648.406px` → `574.812px`
    - **rect**: `734,1656 648x494` → `654,1747 575x494`

### `body > main:1 > div:2 > div:3 > section:6 > div:2`
    - **gridTemplateColumns**: `648.406px` → `574.812px`
    - **padding**: `0px` → `14px 0px 0px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `648.406px` → `574.812px`
    - **height**: `454px` → `468px`
    - **rect**: `734,1696 648x454` → `654,1773 575x468`

### `body > main:1`
    - **backgroundColor**: `rgba(0, 0, 0, 0)` → `rgb(238, 241, 244)`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `1280px`
    - **height**: `2315.59px` → `2409.98px`
    - **rect**: `0,0 1440x2316` → `0,0 1280x2410`

### `body > main:1 > header:1 > div:3 > span:1 > i:1`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `8px` → `6px`
    - **height**: `8px` → `6px`
    - **boxShadow**: `color(srgb 0.145098 0.662745 0.415686 / 0.25) 0px 0px 0px 2px` → `none`
    - **rect**: `1071,28 8x8` → `932,29 6x6`

### `body > main:1 > div:2`
    - **padding**: `60px 57.6px 72px` → `60px 51.2px 72px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `1280px`
    - **height**: `2251.59px` → `2345.98px`
    - **rect**: `0,64 1440x2252` → `0,64 1280x2346`

### `body > main:1 > div:2 > div:2 > div:2`
    - **gap**: `6.4px` → `6px`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `531.484px` → `480.469px`
    - **height**: `27.7812px` → `30px`
    - **rect**: `851,272 531x28` → `748,337 480x30`

### `body > main:1 > div:2 > div:3 > section:1 > div:1 > i:2` — "05 TOOLS"
    - **letterSpacing**: `0.8px` → `1.32px`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `54.4062px` → `54.5625px`
    - **height**: `13px` → `12px`
    - **rect**: `652,326 54x13` → `571,415 55x12`

### `body > main:1 > div:2 > div:3 > section:2 > div:1 > i:2` — "05 TOOLS"
    - **letterSpacing**: `0.8px` → `1.32px`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `54.4062px` → `54.5625px`
    - **height**: `13px` → `12px`
    - **rect**: `1328,326 54x13` → `1174,415 55x12`

### `body > main:1 > div:2 > div:3 > section:3 > div:1 > i:2` — "05 TOOLS"
    - **letterSpacing**: `0.8px` → `1.32px`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `54.4062px` → `54.5625px`
    - **height**: `13px` → `12px`
    - **rect**: `652,992 54x13` → `571,1081 55x12`

### `body > main:1 > div:2 > div:3 > section:4 > div:1 > i:2` — "05 TOOLS"
    - **letterSpacing**: `0.8px` → `1.32px`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `54.4062px` → `54.5625px`
    - **height**: `13px` → `12px`
    - **rect**: `1328,992 54x13` → `1174,1081 55x12`

### `body > main:1 > div:2 > div:3 > section:5 > div:1 > i:2` — "04 TOOLS"
    - **letterSpacing**: `0.8px` → `1.32px`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `54.4062px` → `54.5625px`
    - **height**: `13px` → `12px`
    - **rect**: `652,1658 54x13` → `571,1747 55x12`

### `body > main:1 > div:2 > div:3 > section:6 > div:1 > i:2` — "04 TOOLS"
    - **letterSpacing**: `0.8px` → `1.32px`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `54.4062px` → `54.5625px`
    - **height**: `13px` → `12px`
    - **rect**: `1328,1658 54x13` → `1174,1747 55x12`

### `body`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `1280px`
    - **height**: `2315.59px` → `2409.98px`
    - **rect**: `0,0 1440x2316` → `0,0 1280x2410`

### `body > main:1 > header:1`
    - **padding**: `0px 57.6px` → `0px 51.2px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `1280px`
    - **rect**: `0,0 1440x64` → `0,0 1280x64`

### `body > main:1 > header:1 > a:1 > span:2` — "easy-png-tools"
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `117.609px` → `107.766px`
    - **height**: `18px` → `17px`
    - **rect**: `98,23 118x18` → `91,23 108x17`

### `body > main:1 > header:1 > a:1 > span:3` — "/ CATALOG"
    - **borderTopColor**: `rgb(23, 105, 210)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `64.8125px` → `60.2969px`
    - **height**: `13px` → `12px`
    - **rect**: `225,25 65x13` → `209,26 60x12`

### `body > main:1 > header:1 > div:3`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `311.812px` → `296.828px`
    - **height**: `28px` → `29px`
    - **rect**: `1071,18 312x28` → `932,17 297x29`

### `body > main:1 > header:1 > div:3 > span:1` — "LOCAL MODE / READY"
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `137.406px` → `126.375px`
    - **height**: `13px` → `12px`
    - **rect**: `1071,25 137x13` → `932,26 126x12`

### `body > main:1 > header:1 > div:3 > div:4`
    - **alignItems**: `normal` → `center`
    - **borderRadius**: `4px` → `0px`
    - **width**: `70.4062px` → `64.4531px`
    - **height**: `27px` → `26px`
    - **rect**: `1312,18 70x27` → `1164,19 64x26`

### `body > main:1 > div:2 > div:1 > div:1`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `510.719px` → `660px`
    - **height**: `124.594px` → `139.984px`
    - **rect**: `58,124 511x125` → `51,124 660x140`

### `body > main:1 > div:2 > div:1 > div:2 > span:2 > br:1`
    - **lineHeight**: `normal` → `14px`
    - **letterSpacing**: `0.8px` → `normal`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **rect**: `1382,223 0x13` → `1229,222 0x12`

### `body > main:1 > div:2 > div:3`
    - **gridTemplateColumns**: `648.406px 648.406px` → `574.812px 574.812px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1324.81px` → `1177.62px`
    - **rect**: `58,324 1325x1826` → `51,415 1178x1826`

### `body > main:1 > div:2 > div:3 > section:1 > div:2 > a:1 > span:2 > strong:1` — "Convert JPG to PNG"
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `17px` → `15px`
    - **rect**: `131,398 488x17` → `124,478 415x15`

### `body > main:1 > div:2 > div:3 > section:1 > div:2 > a:1 > span:2 > span:2` — "Re-encode JPEG files as lossless PNG while preserving transparency."
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `18px` → `36px`
    - **rect**: `131,417 488x18` → `124,501 415x36`

### `body > main:1 > div:2 > div:3 > section:1 > div:2 > a:1 > svg:4`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **opacity**: `1` → `0`
    - **rect**: `671,409 16x16` → `591,500 16x16`

### `body > main:1 > div:2 > div:3 > section:1 > div:2 > a:2 > span:2 > strong:1` — "Convert WebP to PNG"
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `17px` → `15px`
    - **rect**: `131,514 488x17` → `124,603 415x15`

### `body > main:1 > div:2 > div:3 > section:1 > div:2 > a:2 > svg:4`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **opacity**: `1` → `0`
    - **rect**: `671,525 16x16` → `591,616 16x16`

### `body > main:1 > div:2 > div:3 > section:1 > div:2 > a:3 > span:2 > strong:1` — "PNG to Base64"
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `17px` → `15px`
    - **rect**: `131,630 488x17` → `124,710 415x15`

### `body > main:1 > div:2 > div:3 > section:1 > div:2 > a:3 > span:2 > span:2` — "Encode an image as a base64 string for embedding in code or styles."
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `18px` → `36px`
    - **rect**: `131,649 488x18` → `124,733 415x36`

### `body > main:1 > div:2 > div:3 > section:1 > div:2 > a:3 > svg:4`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **opacity**: `1` → `0`
    - **rect**: `671,641 16x16` → `591,732 16x16`

### `body > main:1 > div:2 > div:3 > section:1 > div:2 > a:4 > span:2 > strong:1` — "PNG to Data URI"
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `17px` → `15px`
    - **rect**: `131,746 488x17` → `124,835 415x15`

### `body > main:1 > div:2 > div:3 > section:1 > div:2 > a:4 > svg:4`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **opacity**: `1` → `0`
    - **rect**: `671,757 16x16` → `591,848 16x16`

### `body > main:1 > div:2 > div:3 > section:1 > div:2 > a:5 > span:2 > strong:1` — "Convert PNG to JPG"
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `17px` → `15px`
    - **rect**: `131,862 488x17` → `124,942 415x15`

### `body > main:1 > div:2 > div:3 > section:1 > div:2 > a:5 > span:2 > span:2` — "Composite transparency over a selected backdrop and export JPEG."
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `18px` → `36px`
    - **rect**: `131,881 488x18` → `124,965 415x36`

### `body > main:1 > div:2 > div:3 > section:1 > div:2 > a:5 > svg:4`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **opacity**: `1` → `0`
    - **rect**: `671,873 16x16` → `591,964 16x16`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > a:1 > span:2 > strong:1` — "Remove background PNG"
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `17px` → `15px`
    - **rect**: `807,389 488x17` → `727,478 415x15`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > a:1 > svg:4`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **opacity**: `1` → `0`
    - **rect**: `1347,409 16x16` → `1194,500 16x16`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > a:2 > span:2 > strong:1` — "Extract alpha mask"
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `17px` → `15px`
    - **rect**: `807,514 488x17` → `727,603 415x15`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > a:2 > svg:4`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **opacity**: `1` → `0`
    - **rect**: `1347,525 16x16` → `1194,616 16x16`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > a:3 > span:2 > strong:1` — "Round corners PNG"
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `17px` → `15px`
    - **rect**: `807,630 488x17` → `727,719 415x15`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > a:3 > svg:4`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **opacity**: `1` → `0`
    - **rect**: `1347,641 16x16` → `1194,732 16x16`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > a:4 > span:2 > strong:1` — "Outline PNG"
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `17px` → `15px`
    - **rect**: `807,746 488x17` → `727,826 415x15`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > a:4 > span:2 > span:2` — "Add a colored ring around opaque content with adjustable thickness."
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `18px` → `36px`
    - **rect**: `807,765 488x18` → `727,849 415x36`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > a:4 > svg:4`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **opacity**: `1` → `0`
    - **rect**: `1347,757 16x16` → `1194,848 16x16`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > a:5 > span:2 > strong:1` — "Change PNG opacity"
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `17px` → `15px`
    - **rect**: `807,853 488x17` → `727,942 415x15`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > a:5 > svg:4`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **opacity**: `1` → `0`
    - **rect**: `1347,873 16x16` → `1194,964 16x16`

### `body > main:1 > div:2 > div:3 > section:3 > div:2 > a:1 > span:2 > strong:1` — "Create gradient PNG"
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `17px` → `15px`
    - **rect**: `131,1055 488x17` → `124,1144 415x15`

### `body > main:1 > div:2 > div:3 > section:3 > div:2 > a:1 > svg:4`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **opacity**: `1` → `0`
    - **rect**: `671,1075 16x16` → `591,1166 16x16`

### `body > main:1 > div:2 > div:3 > section:3 > div:2 > a:2 > span:2 > strong:1` — "Grayscale PNG"
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `17px` → `15px`
    - **rect**: `131,1180 488x17` → `124,1269 415x15`

### `body > main:1 > div:2 > div:3 > section:3 > div:2 > a:2 > svg:4`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **opacity**: `1` → `0`
    - **rect**: `671,1191 16x16` → `591,1282 16x16`

### `body > main:1 > div:2 > div:3 > section:3 > div:2 > a:3 > span:2 > strong:1` — "Invert colors PNG"
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `17px` → `15px`
    - **rect**: `131,1296 488x17` → `124,1385 415x15`

### `body > main:1 > div:2 > div:3 > section:3 > div:2 > a:3 > svg:4`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **opacity**: `1` → `0`
    - **rect**: `671,1307 16x16` → `591,1398 16x16`

### `body > main:1 > div:2 > div:3 > section:3 > div:2 > a:4 > span:2 > strong:1` — "Brightness & contrast"
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `17px` → `15px`
    - **rect**: `131,1412 488x17` → `124,1501 415x15`

### `body > main:1 > div:2 > div:3 > section:3 > div:2 > a:4 > svg:4`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **opacity**: `1` → `0`
    - **rect**: `671,1423 16x16` → `591,1514 16x16`

### `body > main:1 > div:2 > div:3 > section:3 > div:2 > a:5 > span:2 > strong:1` — "Temperature PNG"
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `17px` → `15px`
    - **rect**: `131,1528 488x17` → `124,1617 415x15`

### `body > main:1 > div:2 > div:3 > section:3 > div:2 > a:5 > svg:4`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **opacity**: `1` → `0`
    - **rect**: `671,1539 16x16` → `591,1630 16x16`

### `body > main:1 > div:2 > div:3 > section:4 > div:2 > a:1 > span:2 > strong:1` — "Resize PNG"
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `17px` → `15px`
    - **rect**: `807,1055 488x17` → `727,1144 415x15`

### `body > main:1 > div:2 > div:3 > section:4 > div:2 > a:1 > svg:4`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **opacity**: `1` → `0`
    - **rect**: `1347,1075 16x16` → `1194,1166 16x16`

### `body > main:1 > div:2 > div:3 > section:4 > div:2 > a:2 > span:2 > strong:1` — "Crop PNG"
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `17px` → `15px`
    - **rect**: `807,1180 488x17` → `727,1269 415x15`

### `body > main:1 > div:2 > div:3 > section:4 > div:2 > a:2 > svg:4`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **opacity**: `1` → `0`
    - **rect**: `1347,1191 16x16` → `1194,1282 16x16`

### `body > main:1 > div:2 > div:3 > section:4 > div:2 > a:3 > span:2 > strong:1` — "Rotate PNG"
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `17px` → `15px`
    - **rect**: `807,1296 488x17` → `727,1385 415x15`

### `body > main:1 > div:2 > div:3 > section:4 > div:2 > a:3 > svg:4`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **opacity**: `1` → `0`
    - **rect**: `1347,1307 16x16` → `1194,1398 16x16`

### `body > main:1 > div:2 > div:3 > section:4 > div:2 > a:4 > span:2 > strong:1` — "Flip PNG"
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `17px` → `15px`
    - **rect**: `807,1412 488x17` → `727,1501 415x15`

### `body > main:1 > div:2 > div:3 > section:4 > div:2 > a:4 > svg:4`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **opacity**: `1` → `0`
    - **rect**: `1347,1423 16x16` → `1194,1514 16x16`

### `body > main:1 > div:2 > div:3 > section:4 > div:2 > a:5 > span:2 > strong:1` — "Add padding to PNG"
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `17px` → `15px`
    - **rect**: `807,1528 488x17` → `727,1617 415x15`

### `body > main:1 > div:2 > div:3 > section:4 > div:2 > a:5 > svg:4`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **opacity**: `1` → `0`
    - **rect**: `1347,1539 16x16` → `1194,1630 16x16`

### `body > main:1 > div:2 > div:3 > section:5 > div:2 > a:1 > span:2 > strong:1` — "Blur PNG"
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `17px` → `15px`
    - **rect**: `131,1730 488x17` → `124,1810 415x15`

### `body > main:1 > div:2 > div:3 > section:5 > div:2 > a:1 > span:2 > span:2` — "Apply a fast Gaussian-style blur with transparent edge handling."
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `18px` → `36px`
    - **rect**: `131,1749 488x18` → `124,1833 415x36`

### `body > main:1 > div:2 > div:3 > section:5 > div:2 > a:1 > svg:4`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **opacity**: `1` → `0`
    - **rect**: `671,1741 16x16` → `591,1832 16x16`

### `body > main:1 > div:2 > div:3 > section:5 > div:2 > a:2 > span:2 > strong:1` — "Sharpen PNG"
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `17px` → `15px`
    - **rect**: `131,1846 488x17` → `124,1935 415x15`

### `body > main:1 > div:2 > div:3 > section:5 > div:2 > a:2 > svg:4`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **opacity**: `1` → `0`
    - **rect**: `671,1857 16x16` → `591,1948 16x16`

### `body > main:1 > div:2 > div:3 > section:5 > div:2 > a:3 > span:2 > strong:1` — "Vignette PNG"
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `488.406px` → `414.812px`
    - **height**: `17px` → `15px`
    - **rect**: `131,1962 488x17` → `124,2051 415x15`

### Структурные расхождения

_—_


## /preview/tools/linear-gradient-png  (vs gradient.html)

- Токены light: **10**, dark: **16**
- Стиль-расхождений: **103** элементов / **906** полей (из них геометрия: 103)
- Структурные: +0 / -0 / tag 0 / text 0

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

### Расхождения стилей (топ 103)

### `body > main:1 > div:2 > div:3 > section:2 > div:1 > div:2 > button:2` — "Download PNG"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `13.3333px` → `11px`
    - **color**: `rgb(0, 0, 0)` → `rgb(255, 255, 255)`
    - **backgroundColor**: `rgb(240, 240, 240)` → `rgb(23, 105, 210)`
    - **display**: `inline-block` → `flex`
    - **alignItems**: `normal` → `center`
    - **justifyContent**: `normal` → `center`
    - **gap**: `normal` → `9px`
    - **padding**: `1px 6px` → `0px`
    - **margin**: `0px` → `18px 0px 0px`
    - **borderTopWidth**: `2px` → `0px`
    - **borderTopColor**: `rgb(0, 0, 0)` → `rgb(255, 255, 255)`
    - **borderTopStyle**: `outset` → `none`
    - **width**: `141.297px` → `210.562px`
    - **height**: `25px` → `42px`
    - **rect**: `95,560 141x25` → `997,398 211x42`

### `body > main:1 > div:2 > div:3 > section:1 > div:6 > button:1` — "Reset"
    - **fontSize**: `13.3333px` → `12px`
    - **lineHeight**: `normal` → `18px`
    - **color**: `rgb(0, 0, 0)` → `rgb(23, 105, 210)`
    - **backgroundColor**: `rgb(240, 240, 240)` → `rgba(0, 0, 0, 0)`
    - **display**: `inline-block` → `flex`
    - **alignItems**: `normal` → `center`
    - **gap**: `normal` → `7px`
    - **padding**: `1px 6px` → `0px`
    - **borderTopWidth**: `2px` → `0px`
    - **borderTopColor**: `rgb(0, 0, 0)` → `rgb(23, 105, 210)`
    - **borderTopStyle**: `outset` → `none`
    - **width**: `67.2969px` → `52.3594px`
    - **height**: `24px` → `18px`
    - **rect**: `0,512 67x24` → `72,918 52x18`

### `body > main:1 > div:2 > div:3 > section:2 > div:1 > div:2 > button:1` — "Copy CSS"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `13.3333px` → `10px`
    - **color**: `rgb(0, 0, 0)` → `rgb(109, 120, 131)`
    - **backgroundColor**: `rgb(240, 240, 240)` → `rgba(0, 0, 0, 0)`
    - **display**: `inline-block` → `flex`
    - **alignItems**: `normal` → `center`
    - **gap**: `normal` → `8px`
    - **padding**: `1px 6px` → `8px 6px`
    - **borderTopWidth**: `2px` → `1px`
    - **borderTopColor**: `rgb(0, 0, 0)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `outset` → `solid`
    - **width**: `91px` → `80.9844px`
    - **height**: `25px` → `33px`
    - **rect**: `0,560 91x25` → `1127,337 81x33`

### `body > main:1 > div:2 > div:3 > section:2 > div:3 > div:1 > button:2`
    - **fontSize**: `13.3333px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **color**: `rgb(0, 0, 0)` → `rgb(109, 120, 131)`
    - **backgroundColor**: `rgb(240, 240, 240)` → `rgba(0, 0, 0, 0)`
    - **display**: `inline-block` → `grid`
    - **alignItems**: `normal` → `center`
    - **gridTemplateColumns**: `none` → `14px`
    - **padding**: `1px 6px` → `6px`
    - **borderTopWidth**: `2px` → `0px`
    - **borderTopColor**: `rgb(0, 0, 0)` → `rgb(109, 120, 131)`
    - **borderTopStyle**: `outset` → `none`
    - **width**: `30px` → `26px`
    - **height**: `24px` → `26px`
    - **rect**: `126,634 30x24` → `1182,1061 26x26`

### `body > main:1 > div:2 > div:3 > section:1 > div:2 > label:1` — "GRADIENT TYPE"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **letterSpacing**: `normal` → `1px`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **display**: `inline` → `flex`
    - **justifyContent**: `normal` → `space-between`
    - **margin**: `0px` → `0px 0px 12px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `350.562px`
    - **height**: `auto` → `12px`
    - **rect**: `0,293 120x20` → `72,424 351x12`

### `body > main:1 > div:2 > div:3 > section:1 > div:3 > label:1` — "COLOR STOPS"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **letterSpacing**: `normal` → `1px`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **display**: `inline` → `flex`
    - **justifyContent**: `normal` → `space-between`
    - **margin**: `0px` → `0px 0px 12px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `350.562px`
    - **height**: `auto` → `12px`
    - **rect**: `0,342 102x20` → `72,525 351x12`

### `body > main:1 > div:2 > div:3 > section:1 > div:4 > label:1` — "DIRECTION"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **letterSpacing**: `normal` → `1px`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **display**: `inline` → `flex`
    - **justifyContent**: `normal` → `space-between`
    - **margin**: `0px` → `0px 0px 12px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `350.562px`
    - **height**: `auto` → `12px`
    - **rect**: `0,440 129x20` → `72,654 351x12`

### `body > main:1 > div:2 > div:3 > section:1 > div:5 > label:1` — "OPACITY"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **letterSpacing**: `normal` → `1px`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **display**: `inline` → `flex`
    - **justifyContent**: `normal` → `space-between`
    - **margin**: `0px` → `0px 0px 12px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `350.562px`
    - **height**: `auto` → `12px`
    - **rect**: `0,489 116x20` → `72,831 351x12`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > div:1 > div:1` — "PNG"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(255, 255, 255)`
    - **display**: `block` → `grid`
    - **alignItems**: `normal` → `center`
    - **gridTemplateColumns**: `none` → `68px`
    - **margin**: `0px` → `0px 0px 12px`
    - **borderTopWidth**: `0px` → `1px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgba(255, 255, 255, 0.65)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `70px`
    - **height**: `24px` → `70px`
    - **rect**: `0,585 1440x24` → `829,704 70x70`

### `body > main:1 > div:2 > div:2 > span:2` — "LIVE PREVIEW"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(37, 169, 106)`
    - **display**: `inline` → `flex`
    - **alignItems**: `normal` → `center`
    - **gap**: `normal` → `8px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `79.9844px`
    - **height**: `auto` → `12px`
    - **rect**: `0,221 106x20` → `1149,258 80x12`

### `body > main:1 > div:2 > div:2 > span:2 > i:1`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(37, 169, 106)`
    - **backgroundColor**: `rgba(0, 0, 0, 0)` → `rgb(37, 169, 106)`
    - **display**: `inline` → `block`
    - **borderRadius**: `0px` → `50%`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `6px`
    - **height**: `auto` → `6px`
    - **rect**: `0,221 0x20` → `1149,261 6x6`

### `body > main:1 > div:2 > div:3 > section:1 > div:2 > div:2 > button:1` — "Linear"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `13.3333px` → `10px`
    - **color**: `rgb(0, 0, 0)` → `rgb(255, 255, 255)`
    - **backgroundColor**: `rgb(240, 240, 240)` → `rgb(23, 105, 210)`
    - **display**: `inline-block` → `block`
    - **padding**: `1px 6px` → `0px`
    - **borderTopWidth**: `2px` → `0px`
    - **borderTopColor**: `rgb(0, 0, 0)` → `rgb(255, 255, 255)`
    - **borderTopStyle**: `outset` → `none`
    - **width**: `52.9219px` → `174.281px`
    - **height**: `24px` → `30px`
    - **rect**: `0,316 53x24` → `73,449 174x30`

### `body > main:1 > div:2 > div:3 > section:1 > div:2 > div:2 > button:2` — "Radial"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `13.3333px` → `10px`
    - **color**: `rgb(0, 0, 0)` → `rgb(109, 120, 131)`
    - **backgroundColor**: `rgb(240, 240, 240)` → `rgba(0, 0, 0, 0)`
    - **display**: `inline-block` → `block`
    - **padding**: `1px 6px` → `0px`
    - **borderTopWidth**: `2px` → `0px`
    - **borderTopColor**: `rgb(0, 0, 0)` → `rgb(109, 120, 131)`
    - **borderTopStyle**: `outset` → `none`
    - **width**: `53.3281px` → `174.281px`
    - **height**: `24px` → `30px`
    - **rect**: `53,316 53x24` → `247,449 174x30`

### `body > main:1 > div:2 > div:3 > section:1 > div:3 > div:2 > div:1 > input:2`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `13.3333px` → `11px`
    - **color**: `rgb(0, 0, 0)` → `rgb(23, 33, 43)`
    - **backgroundColor**: `rgb(255, 255, 255)` → `rgba(0, 0, 0, 0)`
    - **display**: `inline-block` → `block`
    - **padding**: `1px 2px` → `0px`
    - **borderTopWidth**: `2px` → `0px`
    - **borderTopColor**: `rgb(118, 118, 118)` → `rgb(23, 33, 43)`
    - **borderTopStyle**: `inset` → `none`
    - **width**: `157px` → `127px`
    - **height**: `24px` → `13px`
    - **rect**: `0,365 157x24` → `103,559 127x13`

### `body > main:1 > div:2 > div:3 > section:1 > div:3 > div:2 > div:3 > input:2`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `13.3333px` → `11px`
    - **color**: `rgb(0, 0, 0)` → `rgb(23, 33, 43)`
    - **backgroundColor**: `rgb(255, 255, 255)` → `rgba(0, 0, 0, 0)`
    - **display**: `inline-block` → `block`
    - **padding**: `1px 2px` → `0px`
    - **borderTopWidth**: `2px` → `0px`
    - **borderTopColor**: `rgb(118, 118, 118)` → `rgb(23, 33, 43)`
    - **borderTopStyle**: `inset` → `none`
    - **width**: `157px` → `127px`
    - **height**: `24px` → `13px`
    - **rect**: `0,414 157x24` → `306,559 127x13`

### `body > main:1 > div:2 > div:3 > section:1 > div:4 > div:3 > button:1` — "0° →"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `13.3333px` → `10px`
    - **color**: `rgb(0, 0, 0)` → `rgb(109, 120, 131)`
    - **backgroundColor**: `rgb(240, 240, 240)` → `rgba(0, 0, 0, 0)`
    - **display**: `inline-block` → `block`
    - **padding**: `1px 6px` → `8px 6px`
    - **borderTopWidth**: `2px` → `1px`
    - **borderTopColor**: `rgb(0, 0, 0)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `outset` → `solid`
    - **width**: `46.7188px` → `83.1406px`
    - **height**: `24px` → `32px`
    - **rect**: `0,463 47x24` → `72,716 83x32`

### `body > main:1 > div:2 > div:3 > section:1 > div:4 > div:3 > button:2` — "45° ↗"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `13.3333px` → `10px`
    - **color**: `rgb(0, 0, 0)` → `rgb(109, 120, 131)`
    - **backgroundColor**: `rgb(240, 240, 240)` → `rgba(0, 0, 0, 0)`
    - **display**: `inline-block` → `block`
    - **padding**: `1px 6px` → `8px 6px`
    - **borderTopWidth**: `2px` → `1px`
    - **borderTopColor**: `rgb(0, 0, 0)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `outset` → `solid`
    - **width**: `51.1406px` → `83.1406px`
    - **height**: `24px` → `32px`
    - **rect**: `47,463 51x24` → `161,716 83x32`

### `body > main:1 > div:2 > div:3 > section:1 > div:4 > div:3 > button:3` — "90° ↑"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `13.3333px` → `10px`
    - **color**: `rgb(0, 0, 0)` → `rgb(109, 120, 131)`
    - **backgroundColor**: `rgb(240, 240, 240)` → `rgba(0, 0, 0, 0)`
    - **display**: `inline-block` → `block`
    - **padding**: `1px 6px` → `8px 6px`
    - **borderTopWidth**: `2px` → `1px`
    - **borderTopColor**: `rgb(0, 0, 0)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `outset` → `solid`
    - **width**: `52.3125px` → `83.1406px`
    - **height**: `24px` → `32px`
    - **rect**: `98,463 52x24` → `250,716 83x32`

### `body > main:1 > div:2 > div:3 > section:1 > div:4 > div:3 > button:4` — "135° ↖"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `13.3333px` → `10px`
    - **color**: `rgb(0, 0, 0)` → `rgb(238, 241, 244)`
    - **backgroundColor**: `rgb(240, 240, 240)` → `rgb(23, 33, 43)`
    - **display**: `inline-block` → `block`
    - **padding**: `1px 6px` → `8px 6px`
    - **borderTopWidth**: `2px` → `1px`
    - **borderTopColor**: `rgb(0, 0, 0)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `outset` → `solid`
    - **width**: `59.1562px` → `83.1406px`
    - **height**: `24px` → `32px`
    - **rect**: `150,463 59x24` → `340,716 83x32`

### `body > main:1 > div:2 > div:3 > section:1 > div:4 > div:3 > button:5` — "180° ←"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `13.3333px` → `10px`
    - **color**: `rgb(0, 0, 0)` → `rgb(109, 120, 131)`
    - **backgroundColor**: `rgb(240, 240, 240)` → `rgba(0, 0, 0, 0)`
    - **display**: `inline-block` → `block`
    - **padding**: `1px 6px` → `8px 6px`
    - **borderTopWidth**: `2px` → `1px`
    - **borderTopColor**: `rgb(0, 0, 0)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `outset` → `solid`
    - **width**: `62.7188px` → `83.1406px`
    - **height**: `24px` → `32px`
    - **rect**: `209,463 63x24` → `72,754 83x32`

### `body > main:1 > div:2 > div:3 > section:1 > div:4 > div:3 > button:6` — "225° ↙"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `13.3333px` → `10px`
    - **color**: `rgb(0, 0, 0)` → `rgb(109, 120, 131)`
    - **backgroundColor**: `rgb(240, 240, 240)` → `rgba(0, 0, 0, 0)`
    - **display**: `inline-block` → `block`
    - **padding**: `1px 6px` → `8px 6px`
    - **borderTopWidth**: `2px` → `1px`
    - **borderTopColor**: `rgb(0, 0, 0)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `outset` → `solid`
    - **width**: `59.1562px` → `83.1406px`
    - **height**: `24px` → `32px`
    - **rect**: `272,463 59x24` → `161,754 83x32`

### `body > main:1 > div:2 > div:3 > section:1 > div:4 > div:3 > button:7` — "270° ↓"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `13.3333px` → `10px`
    - **color**: `rgb(0, 0, 0)` → `rgb(109, 120, 131)`
    - **backgroundColor**: `rgb(240, 240, 240)` → `rgba(0, 0, 0, 0)`
    - **display**: `inline-block` → `block`
    - **padding**: `1px 6px` → `8px 6px`
    - **borderTopWidth**: `2px` → `1px`
    - **borderTopColor**: `rgb(0, 0, 0)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `outset` → `solid`
    - **width**: `60.3125px` → `83.1406px`
    - **height**: `24px` → `32px`
    - **rect**: `331,463 60x24` → `250,754 83x32`

### `body > main:1 > div:2 > div:3 > section:1 > div:4 > div:3 > button:8` — "315° ↘"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `13.3333px` → `10px`
    - **color**: `rgb(0, 0, 0)` → `rgb(109, 120, 131)`
    - **backgroundColor**: `rgb(240, 240, 240)` → `rgba(0, 0, 0, 0)`
    - **display**: `inline-block` → `block`
    - **padding**: `1px 6px` → `8px 6px`
    - **borderTopWidth**: `2px` → `1px`
    - **borderTopColor**: `rgb(0, 0, 0)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `outset` → `solid`
    - **width**: `59.1562px` → `83.1406px`
    - **height**: `24px` → `32px`
    - **rect**: `392,463 59x24` → `340,754 83x32`

### `body > main:1 > div:2 > div:3 > section:1 > div:6 > span:2` — "updates automatically"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `11px`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **display**: `inline` → `flex`
    - **alignItems**: `normal` → `center`
    - **gap**: `normal` → `8px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `141.016px`
    - **height**: `auto` → `13px`
    - **rect**: `71,513 159x20` → `282,921 141x13`

### `body > main:1 > div:2 > div:3 > section:1 > div:6 > span:2 > i:1`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `11px`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **backgroundColor**: `rgba(0, 0, 0, 0)` → `rgb(37, 169, 106)`
    - **display**: `inline` → `block`
    - **borderRadius**: `0px` → `50%`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `6px`
    - **height**: `auto` → `6px`
    - **rect**: `71,513 0x20` → `282,924 6x6`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > div:1`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `12px`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(255, 255, 255)`
    - **display**: `block` → `grid`
    - **justifyContent**: `normal` → `center`
    - **gridTemplateColumns**: `none` → `92.375px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `679.062px`
    - **height**: `48px` → `537.594px`
    - **rect**: `0,585 1440x48` → `525,483 679x538`

### `body > main:1 > div:2 > div:3 > section:2 > div:3 > pre:2` — "background: linear-gradient(135deg, #1769D2 0%, #00A8C7 100%); opacity: 1;"
    - **fontFamily**: `monospace` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `12px`
    - **lineHeight**: `24px` → `19.2px`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **backgroundColor**: `rgba(0, 0, 0, 0)` → `rgb(238, 241, 244)`
    - **padding**: `0px` → `14px`
    - **margin**: `16px 0px` → `12px 0px 0px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `687.062px`
    - **height**: `48px` → `66.375px`
    - **rect**: `0,674 1440x48` → `521,1099 687x66`

### `body > main:1 > div:2 > div:1` — "PNG PROCESSING SINGLE TOOL"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **letterSpacing**: `normal` → `1.2px`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **margin**: `0px` → `0px 0px 18px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `1177.62px`
    - **height**: `24px` → `12px`
    - **rect**: `0,64 1440x24` → `51,124 1178x12`

### `body > main:1 > div:2 > div:3 > section:1 > div:1 > div:1 > strong:2` — "Configure output"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `14px`
    - **fontWeight**: `700` → `600`
    - **lineHeight**: `24px` → `normal`
    - **display**: `inline` → `block`
    - **margin**: `0px` → `5px 0px 0px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `123.156px`
    - **height**: `auto` → `17px`
    - **rect**: `161,245 127x20` → `72,366 123x17`

### `body > main:1 > div:2 > div:3 > section:1 > div:1 > span:2` — "TOOL 01"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **letterSpacing**: `normal` → `1.2px`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `46.8906px`
    - **height**: `auto` → `12px`
    - **rect**: `0,269 62x20` → `376,354 47x12`

### `body > main:1 > div:2 > div:3 > section:1 > div:4 > label:1 > output:1` — "135 °"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **letterSpacing**: `normal` → `1px`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `32.5px`
    - **height**: `auto` → `12px`
    - **rect**: `89,440 40x20` → `390,654 33x12`

### `body > main:1 > div:2 > div:3 > section:1 > div:5 > label:1 > output:1` — "100 %"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **letterSpacing**: `normal` → `1px`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `32.5px`
    - **height**: `auto` → `12px`
    - **rect**: `69,489 47x20` → `390,831 33x12`

### `body > main:1 > div:2 > div:3 > section:2 > div:1 > div:1 > strong:2` — "gradient.png"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `14px`
    - **fontWeight**: `700` → `600`
    - **lineHeight**: `24px` → `normal`
    - **display**: `inline` → `block`
    - **margin**: `0px` → `5px 0px 0px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `93.7812px`
    - **height**: `auto` → `17px`
    - **rect**: `137,538 96x20` → `521,395 94x17`

### `body > main:1 > div:2 > div:3 > section:2 > div:3 > div:1 > span:1` — "GENERATED CSS"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **letterSpacing**: `normal` → `1.2px`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `87.0781px`
    - **height**: `auto` → `12px`
    - **rect**: `0,635 122x20` → `521,1068 87x12`

### `body > main:1 > div:2 > div:2`
    - **display**: `block` → `flex`
    - **alignItems**: `normal` → `end`
    - **justifyContent**: `normal` → `space-between`
    - **gap**: `normal` → `32px`
    - **margin**: `0px` → `0px 0px 48px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `1177.62px`
    - **height**: `133.438px` → `116.391px`
    - **rect**: `0,109 1440x133` → `51,154 1178x116`

### `body > main:1 > div:2 > div:2 > div:1 > h1:1` — "Gradient background."
    - **fontSize**: `32px` → `51.2px`
    - **fontWeight**: `700` → `650`
    - **lineHeight**: `48px` → `51.2px`
    - **letterSpacing**: `normal` → `-3.072px`
    - **margin**: `21.44px 0px` → `0px 0px 14px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `550px`
    - **height**: `48px` → `51.2031px`
    - **rect**: `0,109 1440x48` → `51,154 550x51`

### `body > main:1 > div:2 > div:3 > section:1 > div:3 > div:2 > div:1`
    - **display**: `block` → `flex`
    - **alignItems**: `normal` → `center`
    - **gap**: `normal` → `8px`
    - **padding**: `0px` → `0px 8px`
    - **borderTopWidth**: `0px` → `1px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `167px`
    - **height**: `25px` → `32px`
    - **rect**: `0,364 1440x25` → `72,549 167x32`

### `body > main:1 > div:2 > div:3 > section:1 > div:3 > div:2 > div:3`
    - **display**: `block` → `flex`
    - **alignItems**: `normal` → `center`
    - **gap**: `normal` → `8px`
    - **padding**: `0px` → `0px 8px`
    - **borderTopWidth**: `0px` → `1px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `167px`
    - **height**: `25px` → `32px`
    - **rect**: `0,413 1440x25` → `275,549 167x32`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > div:1 > span:2` — "easy-png-tools"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `12px`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(255, 255, 255)`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `92.375px`
    - **height**: `auto` → `14px`
    - **rect**: `0,611 108x20` → `818,786 92x14`

### `body > main:1 > header:1 > div:3 > div:4 > span:2` — "/"
    - **fontFamily**: `"IBM Plex Mono", monospace` → `"IBM Plex Sans", sans-serif`
    - **fontSize**: `10px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **color**: `rgb(109, 120, 131)` → `rgb(23, 33, 43)`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `6px` → `4.45312px`
    - **height**: `13px` → `24px`
    - **rect**: `1344,25 6x13` → `1194,20 4x24`

### `body > main:1 > div:2 > div:1 > span:1` — "/"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **letterSpacing**: `normal` → `1.2px`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **margin**: `0px` → `0px 7px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **rect**: `137,66 6x20` → `159,124 13x12`

### `body > main:1 > div:2 > div:3`
    - **display**: `block` → `grid`
    - **alignItems**: `normal` → `start`
    - **gap**: `normal` → `56px`
    - **gridTemplateColumns**: `none` → `392.562px 729.062px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `1177.62px`
    - **height**: `479px` → `863.969px`
    - **rect**: `0,243 1440x479` → `51,318 1178x864`

### `body > main:1 > div:2 > div:3 > section:1 > div:1`
    - **display**: `block` → `flex`
    - **alignItems**: `normal` → `center`
    - **justifyContent**: `normal` → `space-between`
    - **padding**: `0px` → `18px 20px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `390.562px`
    - **height**: `48px` → `83px`
    - **rect**: `0,243 1440x48` → `52,319 391x83`

### `body > main:1 > div:2 > div:3 > section:1 > div:4 > div:3`
    - **display**: `block` → `grid`
    - **gap**: `normal` → `6px`
    - **gridTemplateColumns**: `none` → `83.1406px 83.1406px 83.1406px 83.1406px`
    - **margin**: `0px` → `14px 0px 0px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `350.562px`
    - **height**: `25px` → `70px`
    - **rect**: `0,462 1440x25` → `72,716 351x70`

### `body > main:1 > div:2 > div:3 > section:1 > div:6`
    - **display**: `block` → `flex`
    - **alignItems**: `normal` → `center`
    - **justifyContent**: `normal` → `space-between`
    - **padding**: `0px` → `16px 20px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `390.562px`
    - **height**: `25px` → `50px`
    - **rect**: `0,511 1440x25` → `52,902 391x50`

### `body > main:1 > div:2 > div:3 > section:2 > div:1`
    - **display**: `block` → `flex`
    - **alignItems**: `normal` → `center`
    - **justifyContent**: `normal` → `space-between`
    - **padding**: `0px` → `18px 20px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `727.062px`
    - **height**: `49px` → `140px`
    - **rect**: `0,536 1440x49` → `501,319 727x140`

### `body > main:1 > div:2 > div:3 > section:2 > div:1 > div:2`
    - **display**: `block` → `flex`
    - **alignItems**: `normal` → `center`
    - **justifyContent**: `normal` → `flex-end`
    - **gap**: `normal` → `10px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `210.562px`
    - **height**: `25px` → `103px`
    - **rect**: `0,560 1440x25` → `997,337 211x103`

### `body > main:1 > footer:3 > span:1` — "easy-png-tools"
    - **letterSpacing**: `0.8px` → `normal`
    - **display**: `block` → `flex`
    - **alignItems**: `normal` → `center`
    - **gap**: `normal` → `7px`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `142.812px` → `116.984px`
    - **height**: `13px` → `12px`
    - **rect**: `58,755 143x13` → `51,1271 117x12`

### `body > main:1 > footer:3 > span:1 > b:1` — "v2.4.0"
    - **fontWeight**: `700` → `400`
    - **letterSpacing**: `0.8px` → `normal`
    - **color**: `rgb(109, 120, 131)` → `rgb(23, 105, 210)`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `33px`
    - **height**: `auto` → `12px`
    - **rect**: `160,755 41x13` → `135,1271 33x12`

### `body > main:1 > footer:3 > span:2` — "gradient tool · local-only"
    - **letterSpacing**: `0.8px` → `normal`
    - **display**: `block` → `flex`
    - **alignItems**: `normal` → `center`
    - **gap**: `normal` → `7px`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `176.812px` → `142.953px`
    - **height**: `13px` → `12px`
    - **rect**: `683,755 177x13` → `611,1271 143x12`

### `body > main:1 > footer:3 > span:3` — "© 2024"
    - **letterSpacing**: `0.8px` → `normal`
    - **display**: `block` → `flex`
    - **alignItems**: `normal` → `center`
    - **gap**: `normal` → `7px`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `40.8125px` → `33px`
    - **height**: `13px` → `12px`
    - **rect**: `1342,755 41x13` → `1196,1271 33x12`

### `body > main:1 > header:1 > nav:2 > a:3` — "Gradient"
    - **fontSize**: `12px` → `10px`
    - **letterSpacing**: `0.48px` → `normal`
    - **color**: `rgb(109, 120, 131)` → `rgb(23, 105, 210)`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `61.4531px` → `43.9844px`
    - **height**: `15px` → `12px`
    - **rect**: `687,24 61x15` → `777,26 44x12`

### `body > main:1 > header:1 > div:3 > button:2`
    - **fontSize**: `13.3333px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **display**: `flex` → `grid`
    - **justifyContent**: `center` → `normal`
    - **gridTemplateColumns**: `none` → `17px`
    - **width**: `28px` → `29px`
    - **height**: `28px` → `29px`
    - **rect**: `1224,18 28x28` → `1074,17 29x29`

### `body > main:1 > header:1 > div:3 > button:3`
    - **fontSize**: `13.3333px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **display**: `flex` → `grid`
    - **justifyContent**: `center` → `normal`
    - **gridTemplateColumns**: `none` → `17px`
    - **width**: `28px` → `29px`
    - **height**: `28px` → `29px`
    - **rect**: `1268,18 28x28` → `1119,17 29x29`

### `body > main:1 > div:2 > div:2 > div:1 > p:2` — "Create a clean, export-ready gradient with precise control over color, direction and transparency."
    - **lineHeight**: `24px` → `25.6px`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **margin**: `16px 0px` → `0px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `550px`
    - **height**: `24px` → `51.1875px`
    - **rect**: `0,179 1440x24` → `51,219 550x51`

### `body > main:1 > div:2 > div:3 > section:1 > div:1 > div:1 > span:1` — "GRADIENT SETTINGS"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **letterSpacing**: `normal` → `1.2px`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **rect**: `0,245 158x20` → `72,345 114x12`

### `body > main:1 > div:2 > div:3 > section:1 > div:3 > div:2`
    - **display**: `block` → `flex`
    - **alignItems**: `normal` → `center`
    - **gap**: `normal` → `10px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `350.562px`
    - **height**: `74px` → `32px`
    - **rect**: `0,364 1440x74` → `72,549 351x32`

### `body > main:1 > div:2 > div:3 > section:1 > div:4 > input:2`
    - **fontSize**: `13.3333px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **color**: `rgb(16, 16, 16)` → `rgb(23, 33, 43)`
    - **backgroundColor**: `rgb(255, 255, 255)` → `rgba(0, 0, 0, 0)`
    - **margin**: `2px` → `0px`
    - **borderTopColor**: `rgb(16, 16, 16)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **rect**: `134,440 129x16` → `72,679 129x16`

### `body > main:1 > div:2 > div:3 > section:1 > div:5 > input:2`
    - **fontSize**: `13.3333px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **color**: `rgb(16, 16, 16)` → `rgb(23, 33, 43)`
    - **backgroundColor**: `rgb(255, 255, 255)` → `rgba(0, 0, 0, 0)`
    - **margin**: `2px` → `0px`
    - **borderTopColor**: `rgb(16, 16, 16)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **rect**: `122,489 129x16` → `72,856 129x16`

### `body > main:1 > div:2 > div:3 > section:2 > div:1 > div:1 > span:1` — "OUTPUT PREVIEW"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **letterSpacing**: `normal` → `1.2px`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **rect**: `0,538 134x20` → `521,374 94x12`

### `body > main:1 > div:2 > div:3 > section:2 > div:3 > div:1`
    - **display**: `block` → `flex`
    - **alignItems**: `normal` → `center`
    - **justifyContent**: `normal` → `space-between`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `687.062px`
    - **height**: `25px` → `26px`
    - **rect**: `0,633 1440x25` → `521,1061 687x26`

### `body > main:1 > header:1 > nav:2`
    - **gap**: `18px` → `22px`
    - **margin**: `0px 0px 0px 24px` → `0px 28px 0px 368.891px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `376.594px` → `296.938px`
    - **height**: `15px` → `12px`
    - **rect**: `528,24 377x15` → `645,26 297x12`

### `body > main:1 > header:1 > nav:2 > a:1` — "Workspace"
    - **fontSize**: `12px` → `10px`
    - **letterSpacing**: `0.48px` → `normal`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `69.125px` → `49.4844px`
    - **height**: `15px` → `12px`
    - **rect**: `528,24 69x15` → `645,26 49x12`

### `body > main:1 > header:1 > nav:2 > a:2` — "Catalog"
    - **fontSize**: `12px` → `10px`
    - **letterSpacing**: `0.48px` → `normal`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `53.7656px` → `38.5px`
    - **height**: `15px` → `12px`
    - **rect**: `615,24 54x15` → `716,26 39x12`

### `body > main:1 > header:1 > nav:2 > a:4` — "Background remover"
    - **fontSize**: `12px` → `10px`
    - **letterSpacing**: `0.48px` → `normal`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `138.25px` → `98.9688px`
    - **height**: `15px` → `12px`
    - **rect**: `766,24 138x15` → `843,26 99x12`

### `body > main:1 > header:1 > div:3 > button:2 > svg:1`
    - **fontSize**: `13.3333px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `16px` → `17px`
    - **height**: `16px` → `17px`
    - **rect**: `1230,24 16x16` → `1080,23 17x17`

### `body > main:1 > header:1 > div:3 > button:3 > svg:1`
    - **fontSize**: `13.3333px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `16px` → `17px`
    - **height**: `16px` → `17px`
    - **rect**: `1274,24 16x16` → `1125,23 17x17`

### `body > main:1 > div:2 > div:3 > section:1`
    - **backgroundColor**: `rgba(0, 0, 0, 0)` → `rgb(248, 250, 251)`
    - **borderTopWidth**: `0px` → `1px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `392.562px`
    - **height**: `293px` → `635px`
    - **rect**: `0,243 1440x293` → `51,318 393x635`

### `body > main:1 > div:2 > div:3 > section:1 > div:2 > div:2`
    - **display**: `block` → `flex`
    - **borderTopWidth**: `0px` → `1px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `350.562px`
    - **height**: `25px` → `32px`
    - **rect**: `0,315 1440x25` → `72,448 351x32`

### `body > main:1 > div:2 > div:3 > section:1 > div:3 > div:2 > div:1 > span:1`
    - **display**: `inline` → `block`
    - **borderTopWidth**: `0px` → `1px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `14px`
    - **height**: `auto` → `14px`
    - **rect**: `0,366 0x20` → `81,558 14x14`

### `body > main:1 > div:2 > div:3 > section:1 > div:3 > div:2 > span:2` — "→"
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `16px`
    - **height**: `auto` → `24px`
    - **rect**: `0,391 16x20` → `249,553 16x24`

### `body > main:1 > div:2 > div:3 > section:1 > div:3 > div:2 > div:3 > span:1`
    - **display**: `inline` → `block`
    - **borderTopWidth**: `0px` → `1px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `14px`
    - **height**: `auto` → `14px`
    - **rect**: `0,415 0x20` → `284,558 14x14`

### `body > main:1 > div:2 > div:3 > section:1 > div:3 > div:3`
    - **margin**: `0px` → `14px 0px 0px`
    - **borderTopWidth**: `0px` → `1px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `350.562px`
    - **height**: `0px` → `14px`
    - **rect**: `0,438 1440x0` → `72,595 351x14`

### `body > main:1 > div:2 > div:3 > section:1 > div:6 > button:1 > svg:1`
    - **fontSize**: `13.3333px` → `12px`
    - **lineHeight**: `normal` → `18px`
    - **color**: `rgb(0, 0, 0)` → `rgb(23, 105, 210)`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(0, 0, 0)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **rect**: `8,515 14x14` → `72,920 14x14`

### `body > main:1 > div:2 > div:3 > section:2`
    - **backgroundColor**: `rgba(0, 0, 0, 0)` → `rgb(248, 250, 251)`
    - **borderTopWidth**: `0px` → `1px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `729.062px`
    - **height**: `186px` → `863.969px`
    - **rect**: `0,536 1440x186` → `500,318 729x864`

### `body > main:1 > div:2 > div:3 > section:2 > div:1 > div:2 > button:1 > svg:1`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `13.3333px` → `10px`
    - **color**: `rgb(0, 0, 0)` → `rgb(109, 120, 131)`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(0, 0, 0)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **rect**: `8,563 15x15` → `1134,346 15x15`

### `body > main:1 > div:2 > div:3 > section:2 > div:1 > div:2 > button:2 > svg:1`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `13.3333px` → `11px`
    - **color**: `rgb(0, 0, 0)` → `rgb(255, 255, 255)`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(0, 0, 0)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **rect**: `103,563 15x15` → `1043,412 15x15`

### `body > main:1 > div:2 > div:3 > section:2 > div:1 > div:2 > button:2 > svg:2`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `13.3333px` → `11px`
    - **color**: `rgb(0, 0, 0)` → `rgb(255, 255, 255)`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(0, 0, 0)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **rect**: `214,564 14x14` → `1148,412 14x14`

### `body > main:1 > div:2 > div:3 > section:2 > div:2`
    - **backgroundColor**: `rgba(0, 0, 0, 0)` → `rgb(32, 42, 49)`
    - **padding**: `0px` → `24px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `727.062px`
    - **height**: `48px` → `585.594px`
    - **rect**: `0,585 1440x48` → `501,459 727x586`

### `body > main:1 > div:2 > div:3 > section:2 > div:3 > div:1 > button:2 > svg:1`
    - **fontSize**: `13.3333px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **color**: `rgb(0, 0, 0)` → `rgb(109, 120, 131)`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(0, 0, 0)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **rect**: `134,637 14x14` → `1188,1067 14x14`

### `body > main:1`
    - **backgroundColor**: `rgba(0, 0, 0, 0)` → `rgb(238, 241, 244)`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `1280px`
    - **height**: `783.875px` → `1299.36px`
    - **rect**: `0,0 1440x784` → `0,0 1280x1299`

### `body > main:1 > header:1 > div:3 > span:1 > i:1`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `8px` → `6px`
    - **height**: `8px` → `6px`
    - **boxShadow**: `color(srgb 0.145098 0.662745 0.415686 / 0.25) 0px 0px 0px 2px` → `none`
    - **rect**: `1111,28 8x8` → `970,29 6x6`

### `body > main:1 > div:2`
    - **padding**: `0px` → `60px 51.2px 72px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `1280px`
    - **height**: `657.875px` → `1190.36px`
    - **rect**: `0,64 1440x658` → `0,64 1280x1190`

### `body > main:1 > div:2 > div:3 > section:1 > div:2`
    - **padding**: `0px` → `22px 20px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `390.562px`
    - **height**: `49px` → `101px`
    - **rect**: `0,291 1440x49` → `52,402 391x101`

### `body > main:1 > div:2 > div:3 > section:1 > div:3`
    - **padding**: `0px` → `22px 20px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `390.562px`
    - **height**: `98px` → `129px`
    - **rect**: `0,340 1440x98` → `52,503 391x129`

### `body > main:1 > div:2 > div:3 > section:1 > div:4`
    - **padding**: `0px` → `22px 20px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `390.562px`
    - **height**: `49px` → `177px`
    - **rect**: `0,438 1440x49` → `52,632 391x177`

### `body > main:1 > div:2 > div:3 > section:1 > div:5`
    - **padding**: `0px` → `22px 20px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `390.562px`
    - **height**: `24px` → `93px`
    - **rect**: `0,487 1440x24` → `52,809 391x93`

### `body > main:1 > div:2 > div:3 > section:2 > div:3`
    - **padding**: `0px` → `16px 20px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `727.062px`
    - **height**: `89px` → `136.375px`
    - **rect**: `0,633 1440x89` → `501,1045 727x136`

### `body > main:1 > footer:3`
    - **letterSpacing**: `0.8px` → `normal`
    - **gap**: `16px` → `normal`
    - **padding**: `16px 57.6px` → `16px 51.2px`
    - **width**: `1440px` → `1280px`
    - **height**: `46px` → `45px`
    - **rect**: `0,738 1440x46` → `0,1254 1280x45`

### `body`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `1280px`
    - **height**: `783.875px` → `1299.36px`
    - **rect**: `0,0 1440x784` → `0,0 1280x1299`

### `body > main:1 > header:1`
    - **padding**: `0px 57.6px` → `0px 51.2px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `1280px`
    - **rect**: `0,0 1440x64` → `0,0 1280x64`

### `body > main:1 > header:1 > a:1 > span:2` — "easy-png-tools"
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `117.609px` → `107.766px`
    - **height**: `18px` → `17px`
    - **rect**: `98,23 118x18` → `91,23 108x17`

### `body > main:1 > header:1 > a:1 > span:3` — "/ GRADIENT"
    - **borderTopColor**: `rgb(23, 105, 210)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `72px` → `67px`
    - **height**: `13px` → `12px`
    - **rect**: `225,25 72x13` → `209,26 67x12`

### `body > main:1 > header:1 > div:3`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `271.016px` → `259.031px`
    - **height**: `28px` → `29px`
    - **rect**: `1111,18 271x28` → `970,17 259x29`

### `body > main:1 > header:1 > div:3 > span:1` — "LIVE PREVIEW"
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `96.6094px` → `88.5781px`
    - **height**: `13px` → `12px`
    - **rect**: `1111,25 97x13` → `970,26 89x12`

### `body > main:1 > header:1 > div:3 > div:4`
    - **alignItems**: `normal` → `center`
    - **borderRadius**: `4px` → `0px`
    - **width**: `70.4062px` → `64.4531px`
    - **height**: `27px` → `26px`
    - **rect**: `1312,18 70x27` → `1164,19 64x26`

### `body > main:1 > div:2 > div:2 > div:1`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `550px`
    - **height**: `93.4375px` → `116.391px`
    - **rect**: `0,109 1440x93` → `51,154 550x116`

### `body > main:1 > div:2 > div:3 > section:1 > div:1 > div:1`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `123.156px`
    - **height**: `24px` → `46px`
    - **rect**: `0,243 1440x24` → `72,337 123x46`

### `body > main:1 > div:2 > div:3 > section:2 > div:1 > div:1`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `93.7812px`
    - **height**: `24px` → `46px`
    - **rect**: `0,536 1440x24` → `521,366 94x46`

### `body > main:1 > header:1 > a:1`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `239.609px` → `224.766px`
    - **rect**: `58,17 240x30` → `51,17 225x30`

### `body > main:1 > header:1 > div:3 > div:4 > button:1` — "RU"
    - **letterSpacing**: `0.6px` → `normal`
    - **width**: `31.2031px` → `29px`
    - **height**: `25px` → `24px`
    - **rect**: `1313,19 31x25` → `1165,20 29x24`

### `body > main:1 > header:1 > div:3 > div:4 > button:3` — "EN"
    - **letterSpacing**: `0.6px` → `normal`
    - **width**: `31.2031px` → `29px`
    - **height**: `25px` → `24px`
    - **rect**: `1350,19 31x25` → `1199,20 29x24`

### `body > main:1 > header:1 > a:1 > span:1` — "EP"
    - **borderTopColor**: `rgb(255, 255, 255)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **rect**: `58,17 30x30` → `51,17 30x30`

### Структурные расхождения

_—_


## /preview/tools/remove-background-png  (vs background-remover.html)

- Токены light: **10**, dark: **16**
- Стиль-расхождений: **108** элементов / **965** полей (из них геометрия: 108)
- Структурные: +0 / -0 / tag 0 / text 0

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

### Расхождения стилей (топ 108)

### `body > main:1 > div:2 > div:3 > section:2 > div:1 > div:2 > button:2` — "Download result"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `13.3333px` → `11px`
    - **color**: `rgb(0, 0, 0)` → `rgb(255, 255, 255)`
    - **backgroundColor**: `rgb(240, 240, 240)` → `rgb(23, 105, 210)`
    - **display**: `inline-block` → `flex`
    - **alignItems**: `normal` → `center`
    - **justifyContent**: `normal` → `center`
    - **gap**: `normal` → `9px`
    - **padding**: `1px 6px` → `0px`
    - **margin**: `0px` → `18px 0px 0px`
    - **borderTopWidth**: `2px` → `0px`
    - **borderTopColor**: `rgb(0, 0, 0)` → `rgb(255, 255, 255)`
    - **borderTopStyle**: `outset` → `none`
    - **width**: `131.828px` → `193.203px`
    - **height**: `25px` → `42px`
    - **rect**: `96,624 132x25` → `1015,379 193x42`

### `body > main:1 > div:2 > div:3 > section:1 > div:4 > label:1`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **letterSpacing**: `normal` → `1px`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **display**: `inline` → `flex`
    - **alignItems**: `normal` → `center`
    - **justifyContent**: `normal` → `space-between`
    - **margin**: `0px` → `0px 0px 12px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `318px`
    - **height**: `auto` → `18px`
    - **rect**: `0,417 148x20` → `72,662 318x18`

### `body > main:1 > div:2 > div:3 > section:1 > div:5 > label:1`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **letterSpacing**: `normal` → `1px`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **display**: `inline` → `flex`
    - **alignItems**: `normal` → `center`
    - **justifyContent**: `normal` → `space-between`
    - **margin**: `0px` → `0px 0px 12px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `318px`
    - **height**: `auto` → `18px`
    - **rect**: `0,497 93x20` → `72,755 318x18`

### `body > main:1 > div:2 > div:3 > section:1 > div:6 > button:1` — "Reset"
    - **fontSize**: `13.3333px` → `12px`
    - **lineHeight**: `normal` → `18px`
    - **color**: `rgb(0, 0, 0)` → `rgb(23, 105, 210)`
    - **backgroundColor**: `rgb(240, 240, 240)` → `rgba(0, 0, 0, 0)`
    - **display**: `inline-block` → `flex`
    - **alignItems**: `normal` → `center`
    - **gap**: `normal` → `7px`
    - **padding**: `1px 6px` → `0px`
    - **borderTopWidth**: `2px` → `0px`
    - **borderTopColor**: `rgb(0, 0, 0)` → `rgb(23, 105, 210)`
    - **borderTopStyle**: `outset` → `none`
    - **width**: `67.2969px` → `52.3594px`
    - **height**: `24px` → `18px`
    - **rect**: `0,576 67x24` → `72,842 52x18`

### `body > main:1 > div:2 > div:3 > section:1 > div:2 > label:1` — "BACKGROUND COLOR"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **letterSpacing**: `normal` → `1px`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **display**: `inline` → `flex`
    - **justifyContent**: `normal` → `space-between`
    - **margin**: `0px` → `0px 0px 12px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `318px`
    - **height**: `auto` → `12px`
    - **rect**: `0,293 159x20` → `72,424 318x12`

### `body > main:1 > div:2 > div:3 > section:1 > div:2 > div:3` — "sampled from image background"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **display**: `block` → `flex`
    - **justifyContent**: `normal` → `flex-start`
    - **gap**: `normal` → `8px`
    - **margin**: `0px` → `10px 0px 0px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `318px`
    - **height**: `24px` → `12px`
    - **rect**: `0,343 1440x24` → `72,490 318x12`

### `body > main:1 > div:2 > div:3 > section:1 > div:3 > label:1` — "COLOR SIMILARITY"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **letterSpacing**: `normal` → `1px`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **display**: `inline` → `flex`
    - **justifyContent**: `normal` → `space-between`
    - **margin**: `0px` → `0px 0px 12px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `318px`
    - **height**: `auto` → `12px`
    - **rect**: `0,369 184x20` → `72,547 318x12`

### `body > main:1 > div:2 > div:3 > section:1 > div:4 > label:1 > b:2`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **letterSpacing**: `normal` → `1px`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **backgroundColor**: `rgba(0, 0, 0, 0)` → `rgb(23, 105, 210)`
    - **display**: `inline` → `block`
    - **borderTopWidth**: `0px` → `1px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `32px`
    - **height**: `auto` → `18px`
    - **rect**: `148,417 0x20` → `358,662 32x18`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > div:1 > div:2 > div:1`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `14px`
    - **fontWeight**: `400` → `600`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgba(255, 255, 255, 0.85)`
    - **display**: `block` → `grid`
    - **alignItems**: `normal` → `center`
    - **gridTemplateColumns**: `none` → `258.109px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `258.109px`
    - **height**: `24px` → `259.75px`
    - **rect**: `0,673 1440x24` → `528,538 271x273`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > div:2 > div:2 > div:1`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `14px`
    - **fontWeight**: `400` → `600`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgba(255, 255, 255, 0.85)`
    - **display**: `block` → `grid`
    - **alignItems**: `normal` → `center`
    - **gridTemplateColumns**: `none` → `258.109px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `258.109px`
    - **height**: `24px` → `259.75px`
    - **rect**: `0,745 1440x24` → `903,545 258x260`

### `body > main:1 > div:2 > div:3 > section:2 > div:3`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **display**: `block` → `flex`
    - **gap**: `normal` → `24px`
    - **padding**: `0px` → `16px 20px`
    - **borderTopWidth**: `0px` → `1px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `759.625px`
    - **height**: `24px` → `45px`
    - **rect**: `0,793 1440x24` → `468,886 760x45`

### `body > main:1 > div:2 > div:2 > span:2` — "LIVE PREVIEW"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(37, 169, 106)`
    - **display**: `inline` → `flex`
    - **alignItems**: `normal` → `center`
    - **gap**: `normal` → `8px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `79.9844px`
    - **height**: `auto` → `12px`
    - **rect**: `0,221 106x20` → `1149,258 80x12`

### `body > main:1 > div:2 > div:2 > span:2 > i:1`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(37, 169, 106)`
    - **backgroundColor**: `rgba(0, 0, 0, 0)` → `rgb(37, 169, 106)`
    - **display**: `inline` → `block`
    - **borderRadius**: `0px` → `50%`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `6px`
    - **height**: `auto` → `6px`
    - **rect**: `0,221 0x20` → `1149,261 6x6`

### `body > main:1 > div:2 > div:3 > section:1 > div:2 > div:2 > input:2`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `13.3333px` → `11px`
    - **color**: `rgb(0, 0, 0)` → `rgb(23, 33, 43)`
    - **backgroundColor**: `rgb(255, 255, 255)` → `rgba(0, 0, 0, 0)`
    - **display**: `inline-block` → `block`
    - **padding**: `1px 2px` → `0px`
    - **borderTopWidth**: `2px` → `0px`
    - **borderTopColor**: `rgb(118, 118, 118)` → `rgb(23, 33, 43)`
    - **borderTopStyle**: `inset` → `none`
    - **width**: `157px` → `135px`
    - **height**: `24px` → `13px`
    - **rect**: `0,319 157x24` → `103,458 135x13`

### `body > main:1 > div:2 > div:3 > section:1 > div:3 > div:3`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **display**: `block` → `flex`
    - **justifyContent**: `normal` → `space-between`
    - **margin**: `0px` → `10px 0px 0px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `318px`
    - **height**: `24px` → `12px`
    - **rect**: `0,391 1440x24` → `72,605 318x12`

### `body > main:1 > div:2 > div:3 > section:1 > div:5 > label:1 > b:2`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **letterSpacing**: `normal` → `1px`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **display**: `inline` → `block`
    - **borderTopWidth**: `0px` → `1px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `32px`
    - **height**: `auto` → `18px`
    - **rect**: `93,497 0x20` → `358,755 32x18`

### `body > main:1 > div:2 > div:3 > section:1 > div:6 > span:2` — "updates automatically"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `11px`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **display**: `inline` → `flex`
    - **alignItems**: `normal` → `center`
    - **gap**: `normal` → `8px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `141.016px`
    - **height**: `auto` → `13px`
    - **rect**: `71,577 159x20` → `249,845 141x13`

### `body > main:1 > div:2 > div:3 > section:1 > div:6 > span:2 > i:1`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `11px`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **backgroundColor**: `rgba(0, 0, 0, 0)` → `rgb(37, 169, 106)`
    - **display**: `inline` → `block`
    - **borderRadius**: `0px` → `50%`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `6px`
    - **height**: `auto` → `6px`
    - **rect**: `71,577 0x20` → `249,848 6x6`

### `body > main:1 > div:2 > div:3 > section:2 > div:1 > div:2 > span:1` — "processed"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(37, 169, 106)`
    - **display**: `inline` → `flex`
    - **alignItems**: `normal` → `center`
    - **gap**: `normal` → `5px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `68.4844px`
    - **height**: `auto` → `14px`
    - **rect**: `0,626 92x20` → `1139,337 68x14`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > div:1 > div:1`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **display**: `block` → `flex`
    - **justifyContent**: `normal` → `space-between`
    - **margin**: `0px` → `0px 0px 10px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `350.812px`
    - **height**: `24px` → `12px`
    - **rect**: `0,649 1440x24` → `488,460 351x12`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > div:2 > div:1`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **display**: `block` → `flex`
    - **justifyContent**: `normal` → `space-between`
    - **margin**: `0px` → `0px 0px 10px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `350.812px`
    - **height**: `24px` → `12px`
    - **rect**: `0,721 1440x24` → `857,460 351x12`

### `body > main:1 > div:2 > div:1` — "PNG PROCESSING SINGLE TOOL"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **letterSpacing**: `normal` → `1.2px`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **margin**: `0px` → `0px 0px 18px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `1177.62px`
    - **height**: `24px` → `12px`
    - **rect**: `0,64 1440x24` → `51,124 1178x12`

### `body > main:1 > div:2 > div:3 > section:1 > div:1 > div:1 > strong:2` — "Configure detection"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `14px`
    - **fontWeight**: `700` → `600`
    - **lineHeight**: `24px` → `normal`
    - **display**: `inline` → `block`
    - **margin**: `0px` → `5px 0px 0px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `146.25px`
    - **height**: `auto` → `17px`
    - **rect**: `156,245 148x20` → `72,366 146x17`

### `body > main:1 > div:2 > div:3 > section:1 > div:1 > span:2` — "TOOL 02"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **letterSpacing**: `normal` → `1.2px`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `46.8906px`
    - **height**: `auto` → `12px`
    - **rect**: `0,269 62x20` → `343,354 47x12`

### `body > main:1 > div:2 > div:3 > section:1 > div:2 > div:2 > input:3`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `13.3333px` → `11px`
    - **color**: `rgb(0, 0, 0)` → `rgb(23, 33, 43)`
    - **backgroundColor**: `rgb(240, 240, 240)` → `rgba(0, 0, 0, 0)`
    - **display**: `inline-block` → `block`
    - **padding**: `1px 2px` → `0px`
    - **borderTopWidth**: `1px` → `0px`
    - **borderTopColor**: `rgb(0, 0, 0)` → `rgb(23, 33, 43)`
    - **borderTopStyle**: `solid` → `none`
    - **width**: `50px` → `135px`
    - **rect**: `161,315 50x27` → `246,451 135x27`

### `body > main:1 > div:2 > div:3 > section:1 > div:2 > div:3 > span:1`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **display**: `inline` → `block`
    - **borderTopWidth**: `0px` → `1px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `9px`
    - **height**: `auto` → `9px`
    - **rect**: `0,345 0x20` → `72,490 9x9`

### `body > main:1 > div:2 > div:3 > section:1 > div:3 > label:1 > output:1` — "72 %"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **letterSpacing**: `normal` → `1px`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `26px`
    - **height**: `auto` → `12px`
    - **rect**: `147,369 38x20` → `364,547 26x12`

### `body > main:1 > div:2 > div:3 > section:1 > div:4 > label:1 > span:1` — "OUTER COLOR ONLY"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **letterSpacing**: `normal` → `1px`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `103.969px`
    - **height**: `auto` → `12px`
    - **rect**: `0,417 148x20` → `72,665 104x12`

### `body > main:1 > div:2 > div:3 > section:1 > div:5 > label:1 > span:1` — "SHOW MASK"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **letterSpacing**: `normal` → `1px`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `58.4844px`
    - **height**: `auto` → `12px`
    - **rect**: `0,497 93x20` → `72,758 58x12`

### `body > main:1 > div:2 > div:3 > section:2 > div:1 > div:1 > strong:2` — "comparison.png"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `14px`
    - **fontWeight**: `700` → `600`
    - **lineHeight**: `24px` → `normal`
    - **display**: `inline` → `block`
    - **margin**: `0px` → `5px 0px 0px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `107.766px`
    - **height**: `auto` → `17px`
    - **rect**: `134,602 121x20` → `488,385 108x17`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > div:1 > div:1 > b:2` — "original.png"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **fontWeight**: `700` → `400`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `65.9844px`
    - **height**: `auto` → `12px`
    - **rect**: `61,651 90x20` → `773,460 66x12`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > div:1 > div:2 > div:1 > span:1` — "OBJECT"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `14px`
    - **fontWeight**: `400` → `600`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgba(255, 255, 255, 0.85)`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `46.1875px`
    - **height**: `auto` → `17px`
    - **rect**: `0,675 58x20` → `640,665 47x19`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > div:2 > div:1 > b:2` — "removed-bg.png"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **fontWeight**: `700` → `400`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `76.9844px`
    - **height**: `auto` → `12px`
    - **rect**: `56,723 124x20` → `1131,460 77x12`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > div:2 > div:2 > div:1 > span:1` — "PNG"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `14px`
    - **fontWeight**: `400` → `600`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgba(255, 255, 255, 0.85)`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `23.0938px`
    - **height**: `auto` → `17px`
    - **rect**: `0,747 32x20` → `1021,666 23x17`

### `body > main:1 > div:2 > div:2`
    - **display**: `block` → `flex`
    - **alignItems**: `normal` → `end`
    - **justifyContent**: `normal` → `space-between`
    - **gap**: `normal` → `32px`
    - **margin**: `0px` → `0px 0px 48px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `1177.62px`
    - **height**: `133.438px` → `116.391px`
    - **rect**: `0,109 1440x133` → `51,154 1178x116`

### `body > main:1 > div:2 > div:2 > div:1 > h1:1` — "Remove background."
    - **fontSize**: `32px` → `51.2px`
    - **fontWeight**: `700` → `650`
    - **lineHeight**: `48px` → `51.2px`
    - **letterSpacing**: `normal` → `-3.072px`
    - **margin**: `21.44px 0px` → `0px 0px 14px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `550px`
    - **height**: `48px` → `51.2031px`
    - **rect**: `0,109 1440x48` → `51,154 550x51`

### `body > main:1 > div:2 > div:3 > section:1 > div:2 > div:2`
    - **display**: `block` → `flex`
    - **alignItems**: `normal` → `center`
    - **gap**: `normal` → `8px`
    - **padding**: `0px` → `0px 8px`
    - **borderTopWidth**: `0px` → `1px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `318px`
    - **height**: `28px` → `32px`
    - **rect**: `0,315 1440x28` → `72,448 318x32`

### `body > main:1 > div:2 > div:3 > section:1 > div:3 > div:3 > span:1` — "strict edges"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `65.9844px`
    - **height**: `auto` → `12px`
    - **rect**: `0,393 84x20` → `72,605 66x12`

### `body > main:1 > div:2 > div:3 > section:1 > div:3 > div:3 > span:2` — "more removal"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `65.9844px`
    - **height**: `auto` → `12px`
    - **rect**: `87,393 99x20` → `324,605 66x12`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > div:1 > div:1 > span:1` — "SOURCE"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `33px`
    - **height**: `auto` → `12px`
    - **rect**: `0,651 61x20` → `488,460 33x12`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > div:1 > div:2`
    - **backgroundColor**: `rgba(0, 0, 0, 0)` → `rgb(232, 238, 242)`
    - **display**: `block` → `grid`
    - **alignItems**: `normal` → `center`
    - **gridTemplateColumns**: `none` → `348.812px`
    - **borderTopWidth**: `0px` → `1px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `350.812px`
    - **height**: `48px` → `384px`
    - **rect**: `0,673 1440x48` → `488,482 351x384`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > div:1 > div:2 > span:2` — "1200 × 800"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `9px`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `49.4844px`
    - **height**: `auto` → `10px`
    - **rect**: `0,699 84x20` → `779,846 49x10`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > div:2 > div:1 > span:1` — "RESULT"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(23, 105, 210)`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `33px`
    - **height**: `auto` → `12px`
    - **rect**: `0,723 56x20` → `857,460 33x12`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > div:2 > div:2 > span:2` — "1200 × 800"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `9px`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `49.4844px`
    - **height**: `auto` → `10px`
    - **rect**: `0,771 84x20` → `1147,846 49x10`

### `body > main:1 > div:2 > div:3 > section:2 > div:3 > span:1` — "FORMAT"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `77.5px`
    - **height**: `auto` → `12px`
    - **rect**: `0,795 125x20` → `488,903 78x12`

### `body > main:1 > div:2 > div:3 > section:2 > div:3 > span:2` — "ALPHA"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `77.5px`
    - **height**: `auto` → `12px`
    - **rect**: `129,795 126x20` → `590,903 78x12`

### `body > main:1 > div:2 > div:3 > section:2 > div:3 > span:3` — "SIMILARITY"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `88.4844px`
    - **height**: `auto` → `12px`
    - **rect**: `258,795 131x20` → `691,903 88x12`

### `body > main:1 > header:1 > div:3 > div:4 > span:2` — "/"
    - **fontFamily**: `"IBM Plex Mono", monospace` → `"IBM Plex Sans", sans-serif`
    - **fontSize**: `10px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **color**: `rgb(109, 120, 131)` → `rgb(23, 33, 43)`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `6px` → `4.45312px`
    - **height**: `13px` → `24px`
    - **rect**: `1344,25 6x13` → `1194,20 4x24`

### `body > main:1 > div:2 > div:1 > span:1` — "/"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **letterSpacing**: `normal` → `1.2px`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **margin**: `0px` → `0px 7px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **rect**: `137,66 6x20` → `159,124 13x12`

### `body > main:1 > div:2 > div:3`
    - **display**: `block` → `grid`
    - **alignItems**: `normal` → `start`
    - **gap**: `normal` → `56px`
    - **gridTemplateColumns**: `none` → `360px 761.625px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `1177.62px`
    - **height**: `574px` → `614px`
    - **rect**: `0,243 1440x574` → `51,318 1178x614`

### `body > main:1 > div:2 > div:3 > section:1 > div:1`
    - **display**: `block` → `flex`
    - **alignItems**: `normal` → `center`
    - **justifyContent**: `normal` → `space-between`
    - **padding**: `0px` → `18px 20px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `358px`
    - **height**: `48px` → `83px`
    - **rect**: `0,243 1440x48` → `52,319 358x83`

### `body > main:1 > div:2 > div:3 > section:1 > div:4 > p:2` — "Only remove connected background pixels from the edges."
    - **fontSize**: `16px` → `12px`
    - **lineHeight**: `24px` → `18px`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **margin**: `16px 0px` → `8px 0px 0px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `318px`
    - **height**: `24px` → `18px`
    - **rect**: `0,455 1440x24` → `72,692 318x18`

### `body > main:1 > div:2 > div:3 > section:1 > div:5 > p:2` — "Preview the detected transparency mask."
    - **fontSize**: `16px` → `12px`
    - **lineHeight**: `24px` → `18px`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **margin**: `16px 0px` → `8px 0px 0px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `318px`
    - **height**: `24px` → `18px`
    - **rect**: `0,535 1440x24` → `72,785 318x18`

### `body > main:1 > div:2 > div:3 > section:1 > div:6`
    - **display**: `block` → `flex`
    - **alignItems**: `normal` → `center`
    - **justifyContent**: `normal` → `space-between`
    - **padding**: `0px` → `16px 20px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `358px`
    - **height**: `25px` → `50px`
    - **rect**: `0,575 1440x25` → `52,826 358x50`

### `body > main:1 > div:2 > div:3 > section:2 > div:1`
    - **display**: `block` → `flex`
    - **alignItems**: `normal` → `center`
    - **justifyContent**: `normal` → `space-between`
    - **padding**: `0px` → `18px 20px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `759.625px`
    - **height**: `49px` → `121px`
    - **rect**: `0,600 1440x49` → `468,319 760x121`

### `body > main:1 > div:2 > div:3 > section:2 > div:1 > div:2`
    - **display**: `block` → `flex`
    - **alignItems**: `normal` → `center`
    - **justifyContent**: `normal` → `flex-end`
    - **gap**: `normal` → `10px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `193.203px`
    - **height**: `25px` → `84px`
    - **rect**: `0,624 1440x25` → `1015,337 193x84`

### `body > main:1 > div:2 > div:3 > section:2 > div:2`
    - **display**: `block` → `grid`
    - **gap**: `normal` → `18px`
    - **gridTemplateColumns**: `none` → `350.812px 350.812px`
    - **padding**: `0px` → `20px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `759.625px`
    - **height**: `144px` → `446px`
    - **rect**: `0,649 1440x144` → `468,440 760x446`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > div:2 > div:2`
    - **display**: `block` → `grid`
    - **alignItems**: `normal` → `center`
    - **gridTemplateColumns**: `none` → `348.812px`
    - **borderTopWidth**: `0px` → `1px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `350.812px`
    - **height**: `48px` → `384px`
    - **rect**: `0,745 1440x48` → `857,482 351x384`

### `body > main:1 > footer:3 > span:1` — "easy-png-tools"
    - **letterSpacing**: `0.8px` → `normal`
    - **display**: `block` → `flex`
    - **alignItems**: `normal` → `center`
    - **gap**: `normal` → `7px`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `142.812px` → `116.984px`
    - **height**: `13px` → `12px`
    - **rect**: `58,834 143x13` → `51,1021 117x12`

### `body > main:1 > footer:3 > span:1 > b:1` — "v2.4.0"
    - **fontWeight**: `700` → `400`
    - **letterSpacing**: `0.8px` → `normal`
    - **color**: `rgb(109, 120, 131)` → `rgb(23, 105, 210)`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `33px`
    - **height**: `auto` → `12px`
    - **rect**: `160,834 41x13` → `135,1021 33x12`

### `body > main:1 > footer:3 > span:2` — "background remover · local-only"
    - **letterSpacing**: `0.8px` → `normal`
    - **display**: `block` → `flex`
    - **alignItems**: `normal` → `center`
    - **gap**: `normal` → `7px`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `210.812px` → `170.453px`
    - **height**: `13px` → `12px`
    - **rect**: `666,834 211x13` → `597,1021 170x12`

### `body > main:1 > footer:3 > span:3` — "© 2024"
    - **letterSpacing**: `0.8px` → `normal`
    - **display**: `block` → `flex`
    - **alignItems**: `normal` → `center`
    - **gap**: `normal` → `7px`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `40.8125px` → `33px`
    - **height**: `13px` → `12px`
    - **rect**: `1342,834 41x13` → `1196,1021 33x12`

### `body > main:1 > header:1 > nav:2 > a:4` — "Background remover"
    - **fontSize**: `12px` → `10px`
    - **letterSpacing**: `0.48px` → `normal`
    - **color**: `rgb(109, 120, 131)` → `rgb(23, 105, 210)`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `138.25px` → `98.9688px`
    - **height**: `15px` → `12px`
    - **rect**: `792,24 138x15` → `824,26 99x12`

### `body > main:1 > header:1 > div:3 > button:2`
    - **fontSize**: `13.3333px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **display**: `flex` → `grid`
    - **justifyContent**: `center` → `normal`
    - **gridTemplateColumns**: `none` → `17px`
    - **width**: `28px` → `29px`
    - **height**: `28px` → `29px`
    - **rect**: `1224,18 28x28` → `1074,17 29x29`

### `body > main:1 > header:1 > div:3 > button:3`
    - **fontSize**: `13.3333px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **display**: `flex` → `grid`
    - **justifyContent**: `center` → `normal`
    - **gridTemplateColumns**: `none` → `17px`
    - **width**: `28px` → `29px`
    - **height**: `28px` → `29px`
    - **rect**: `1268,18 28x28` → `1119,17 29x29`

### `body > main:1 > div:2 > div:2 > div:1 > p:2` — "Select a background color and tune the edge detection. Changes are processed automatically in your browser."
    - **lineHeight**: `24px` → `25.6px`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **margin**: `16px 0px` → `0px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `550px`
    - **height**: `24px` → `51.1875px`
    - **rect**: `0,179 1440x24` → `51,219 550x51`

### `body > main:1 > div:2 > div:3 > section:1 > div:1 > div:1 > span:1` — "REMOVER SETTINGS"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **letterSpacing**: `normal` → `1.2px`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **rect**: `0,245 152x20` → `72,345 107x12`

### `body > main:1 > div:2 > div:3 > section:1 > div:3 > input:2`
    - **fontSize**: `13.3333px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **color**: `rgb(16, 16, 16)` → `rgb(23, 33, 43)`
    - **backgroundColor**: `rgb(255, 255, 255)` → `rgba(0, 0, 0, 0)`
    - **margin**: `2px` → `0px`
    - **borderTopColor**: `rgb(16, 16, 16)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **rect**: `190,369 129x16` → `72,572 129x16`

### `body > main:1 > div:2 > div:3 > section:2 > div:1 > div:1 > span:1` — "SOURCE / RESULT"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **letterSpacing**: `normal` → `1.2px`
    - **color**: `rgb(23, 33, 43)` → `rgb(109, 120, 131)`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **rect**: `0,602 130x20` → `488,364 100x12`

### `body > main:1 > div:2 > div:3 > section:2 > div:1 > div:2 > span:1 > svg:1`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **lineHeight**: `24px` → `normal`
    - **color**: `rgb(23, 33, 43)` → `rgb(37, 169, 106)`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **rect**: `0,628 14x14` → `1139,337 14x14`

### `body > main:1 > div:2 > div:3 > section:2 > div:3 > span:1 > b:1` — "PNG-24"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **fontWeight**: `700` → `600`
    - **lineHeight**: `24px` → `normal`
    - **margin**: `0px` → `0px 0px 0px 6px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **rect**: `65,795 59x20` → `533,903 33x12`

### `body > main:1 > div:2 > div:3 > section:2 > div:3 > span:2 > b:1` — "ENABLED"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **fontWeight**: `700` → `600`
    - **lineHeight**: `24px` → `normal`
    - **margin**: `0px` → `0px 0px 0px 6px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **rect**: `182,795 72x20` → `629,903 39x12`

### `body > main:1 > div:2 > div:3 > section:2 > div:3 > span:3 > b:1` — "72 %"
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `16px` → `10px`
    - **fontWeight**: `700` → `600`
    - **lineHeight**: `24px` → `normal`
    - **margin**: `0px` → `0px 0px 0px 6px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **rect**: `351,795 39x20` → `758,903 22x12`

### `body > main:1 > header:1 > nav:2`
    - **gap**: `18px` → `22px`
    - **margin**: `0px 0px 0px 24px` → `0px 28px 0px 283px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `376.594px` → `296.938px`
    - **height**: `15px` → `12px`
    - **rect**: `554,24 377x15` → `626,26 297x12`

### `body > main:1 > header:1 > nav:2 > a:1` — "Workspace"
    - **fontSize**: `12px` → `10px`
    - **letterSpacing**: `0.48px` → `normal`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `69.125px` → `49.4844px`
    - **height**: `15px` → `12px`
    - **rect**: `554,24 69x15` → `626,26 49x12`

### `body > main:1 > header:1 > nav:2 > a:2` — "Catalog"
    - **fontSize**: `12px` → `10px`
    - **letterSpacing**: `0.48px` → `normal`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `53.7656px` → `38.5px`
    - **height**: `15px` → `12px`
    - **rect**: `641,24 54x15` → `697,26 39x12`

### `body > main:1 > header:1 > nav:2 > a:3` — "Gradient"
    - **fontSize**: `12px` → `10px`
    - **letterSpacing**: `0.48px` → `normal`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `61.4531px` → `43.9844px`
    - **height**: `15px` → `12px`
    - **rect**: `713,24 61x15` → `758,26 44x12`

### `body > main:1 > header:1 > div:3 > button:2 > svg:1`
    - **fontSize**: `13.3333px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `16px` → `17px`
    - **height**: `16px` → `17px`
    - **rect**: `1230,24 16x16` → `1080,23 17x17`

### `body > main:1 > header:1 > div:3 > button:3 > svg:1`
    - **fontSize**: `13.3333px` → `16px`
    - **lineHeight**: `normal` → `24px`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `16px` → `17px`
    - **height**: `16px` → `17px`
    - **rect**: `1274,24 16x16` → `1125,23 17x17`

### `body > main:1 > div:2 > div:3 > section:1`
    - **backgroundColor**: `rgba(0, 0, 0, 0)` → `rgb(248, 250, 251)`
    - **borderTopWidth**: `0px` → `1px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `360px`
    - **height**: `357px` → `559px`
    - **rect**: `0,243 1440x357` → `51,318 360x559`

### `body > main:1 > div:2 > div:3 > section:1 > div:2 > div:2 > span:1`
    - **display**: `inline` → `block`
    - **borderTopWidth**: `0px` → `1px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `auto` → `14px`
    - **height**: `auto` → `14px`
    - **rect**: `0,320 0x20` → `81,457 14x14`

### `body > main:1 > div:2 > div:3 > section:1 > div:6 > button:1 > svg:1`
    - **fontSize**: `13.3333px` → `12px`
    - **lineHeight**: `normal` → `18px`
    - **color**: `rgb(0, 0, 0)` → `rgb(23, 105, 210)`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(0, 0, 0)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **rect**: `8,579 14x14` → `72,844 14x14`

### `body > main:1 > div:2 > div:3 > section:2`
    - **backgroundColor**: `rgba(0, 0, 0, 0)` → `rgb(248, 250, 251)`
    - **borderTopWidth**: `0px` → `1px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `761.625px`
    - **height**: `217px` → `614px`
    - **rect**: `0,600 1440x217` → `467,318 762x614`

### `body > main:1 > div:2 > div:3 > section:2 > div:1 > div:2 > button:2 > svg:1`
    - **fontFamily**: `"IBM Plex Sans", sans-serif` → `"IBM Plex Mono", monospace`
    - **fontSize**: `13.3333px` → `11px`
    - **color**: `rgb(0, 0, 0)` → `rgb(255, 255, 255)`
    - **display**: `inline` → `block`
    - **borderTopColor**: `rgb(0, 0, 0)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **rect**: `104,627 15x15` → `1054,393 15x15`

### `body > main:1`
    - **backgroundColor**: `rgba(0, 0, 0, 0)` → `rgb(238, 241, 244)`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `1280px`
    - **height**: `862.875px` → `1049.39px`
    - **rect**: `0,0 1440x863` → `0,0 1280x1049`

### `body > main:1 > header:1 > div:3 > span:1 > i:1`
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `8px` → `6px`
    - **height**: `8px` → `6px`
    - **boxShadow**: `color(srgb 0.145098 0.662745 0.415686 / 0.25) 0px 0px 0px 2px` → `none`
    - **rect**: `1091,28 8x8` → `951,29 6x6`

### `body > main:1 > div:2`
    - **padding**: `0px` → `60px 51.2px 72px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `1280px`
    - **height**: `752.875px` → `940.391px`
    - **rect**: `0,64 1440x753` → `0,64 1280x940`

### `body > main:1 > div:2 > div:3 > section:1 > div:2`
    - **padding**: `0px` → `22px 20px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `358px`
    - **height**: `76px` → `123px`
    - **rect**: `0,291 1440x76` → `52,402 358x123`

### `body > main:1 > div:2 > div:3 > section:1 > div:3`
    - **padding**: `0px` → `22px 20px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `358px`
    - **height**: `48px` → `115px`
    - **rect**: `0,367 1440x48` → `52,525 358x115`

### `body > main:1 > div:2 > div:3 > section:1 > div:4`
    - **padding**: `0px` → `22px 20px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `358px`
    - **height**: `64px` → `93px`
    - **rect**: `0,415 1440x64` → `52,640 358x93`

### `body > main:1 > div:2 > div:3 > section:1 > div:5`
    - **padding**: `0px` → `22px 20px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `358px`
    - **height**: `64px` → `93px`
    - **rect**: `0,495 1440x64` → `52,733 358x93`

### `body > main:1 > footer:3`
    - **letterSpacing**: `0.8px` → `normal`
    - **gap**: `16px` → `normal`
    - **padding**: `16px 57.6px` → `16px 51.2px`
    - **width**: `1440px` → `1280px`
    - **height**: `46px` → `45px`
    - **rect**: `0,817 1440x46` → `0,1004 1280x45`

### `body`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `1280px`
    - **height**: `862.875px` → `1049.39px`
    - **rect**: `0,0 1440x863` → `0,0 1280x1049`

### `body > main:1 > header:1`
    - **padding**: `0px 57.6px` → `0px 51.2px`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `1280px`
    - **rect**: `0,0 1440x64` → `0,0 1280x64`

### `body > main:1 > header:1 > a:1 > span:2` — "easy-png-tools"
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `117.609px` → `107.766px`
    - **height**: `18px` → `17px`
    - **rect**: `98,23 118x18` → `91,23 108x17`

### `body > main:1 > header:1 > a:1 > span:3` — "/ BACKGROUND REMOVER"
    - **borderTopColor**: `rgb(23, 105, 210)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `144px` → `133.984px`
    - **height**: `13px` → `12px`
    - **rect**: `225,25 144x13` → `209,26 134x12`

### `body > main:1 > header:1 > div:3`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `291.406px` → `277.938px`
    - **height**: `28px` → `29px`
    - **rect**: `1091,18 291x28` → `951,17 278x29`

### `body > main:1 > header:1 > div:3 > span:1` — "AUTO PROCESSING"
    - **borderTopColor**: `rgb(109, 120, 131)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `117px` → `107.484px`
    - **height**: `13px` → `12px`
    - **rect**: `1091,25 117x13` → `951,26 107x12`

### `body > main:1 > header:1 > div:3 > div:4`
    - **alignItems**: `normal` → `center`
    - **borderRadius**: `4px` → `0px`
    - **width**: `70.4062px` → `64.4531px`
    - **height**: `27px` → `26px`
    - **rect**: `1312,18 70x27` → `1164,19 64x26`

### `body > main:1 > div:2 > div:2 > div:1`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `550px`
    - **height**: `93.4375px` → `116.391px`
    - **rect**: `0,109 1440x93` → `51,154 550x116`

### `body > main:1 > div:2 > div:3 > section:1 > div:1 > div:1`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `146.25px`
    - **height**: `24px` → `46px`
    - **rect**: `0,243 1440x24` → `72,337 146x46`

### `body > main:1 > div:2 > div:3 > section:2 > div:1 > div:1`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `107.766px`
    - **height**: `24px` → `46px`
    - **rect**: `0,600 1440x24` → `488,356 108x46`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > div:1`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `350.812px`
    - **height**: `72px` → `406px`
    - **rect**: `0,649 1440x72` → `488,460 351x406`

### `body > main:1 > div:2 > div:3 > section:2 > div:2 > div:2`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `1440px` → `350.812px`
    - **height**: `72px` → `406px`
    - **rect**: `0,721 1440x72` → `857,460 351x406`

### `body > main:1 > header:1 > a:1`
    - **borderTopColor**: `rgb(23, 33, 43)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **width**: `311.609px` → `291.75px`
    - **rect**: `58,17 312x30` → `51,17 292x30`

### `body > main:1 > header:1 > div:3 > div:4 > button:1` — "RU"
    - **letterSpacing**: `0.6px` → `normal`
    - **width**: `31.2031px` → `29px`
    - **height**: `25px` → `24px`
    - **rect**: `1313,19 31x25` → `1165,20 29x24`

### `body > main:1 > header:1 > div:3 > div:4 > button:3` — "EN"
    - **letterSpacing**: `0.6px` → `normal`
    - **width**: `31.2031px` → `29px`
    - **height**: `25px` → `24px`
    - **rect**: `1350,19 31x25` → `1199,20 29x24`

### `body > main:1 > header:1 > a:1 > span:1` — "EP"
    - **borderTopColor**: `rgb(255, 255, 255)` → `rgb(203, 211, 218)`
    - **borderTopStyle**: `none` → `solid`
    - **rect**: `58,17 30x30` → `51,17 30x30`

### Структурные расхождения

_—_
