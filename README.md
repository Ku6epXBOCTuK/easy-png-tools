# easy-png-tools

Browser-based image utility toolkit — no server, no data upload, everything runs
locally in your browser.

Inspired by online services like onlinepngtools.com, but fully offline-capable
and open source.

## Features

- **A full set of image tools** across categories: conversion,
  transparency/alpha, color, channel decomposition, geometry, filters,
  pixel-property masks, generation, text/watermarks, analysis & verdicts — the
  current list lives in [`docs/tools-map.md`](docs/tools-map.md)
- **Pipeline system (workspace)** — load image → chain multiple tool steps →
  sequential application → download result; pipelines saved to localStorage,
  exportable as JSON
- **Web Worker execution** — heavy operations run off the main thread with
  automatic fallback to direct calls
- **i18n** — full Russian and English localization
- **Dark/Light themes** — persisted to localStorage
- **Pure TypeScript core** — `lib/core/` operates on
  `ImageData`/`Uint8ClampedArray` with no DOM dependency
- **Fully static** — no backend, no analytics, no tracking

## Tech Stack

- **SvelteKit** (Svelte 5, runes mode) with static adapter — pure static export,
  no server
- **Vite** + **TypeScript** (strict)
- **Vitest** for unit tests, **Playwright** for e2e
- **ESLint** (incl. local plugins) + Stylelint + Prettier
- **pnpm** (required, ^11.20.0)
- **Lucide** icons, **IBM Plex** fonts (self-hosted)

## Getting Started

### Prerequisites

- [pnpm](https://pnpm.io/) v11.20+

### Install & Run

```bash
pnpm install
pnpm dev
```

### Build

```bash
pnpm build
```

Static output is written to `web/build/`.

### Commands

Run from the repository root; `pnpm --dir web …` targets the app package.

```bash
pnpm install
pnpm dev        # dev server
pnpm verify     # full fast quality gate — the pre-review gate
pnpm build      # static production export → web/build/
```

Полный список команд и матрица «какие проверки запускать при каком изменении» —
в `AGENTS.md` и `docs/quality-gates.md`.

## Architecture

Everything is built around the **two-layer registry** (`web/src/lib/registry/`):
a tool is a self-contained implementation `{id, schema, input, result, run}`
(`registry/tools/`), and a page is `{slug, title, description, category, steps}`
(`registry/pages/`) that names the address and the tools to run — one tool can
back several pages. Pages, forms, and pipelines are generated from it, and all
execution goes through a single `executor.execute` entry point.

Core image processing lives in `web/src/lib/core/` and operates directly on
`ImageData`, with no browser API dependencies.

Layering, data flow, and the recipe for adding a tool or a field kind:
[`docs/architecture.md`](docs/architecture.md).

## Roadmap

See [`docs/roadmap.md`](docs/roadmap.md) for phases and
[`docs/plan-platform.md`](docs/plan-platform.md) for the API/PWA direction. The
current focus is SEO/GEO ([`docs/plan-seo.md`](docs/plan-seo.md)) plus the
product tasks in [`docs/backlog.md`](docs/backlog.md).

## For AI agents

Read [`AGENTS.md`](AGENTS.md) first — it is the mandatory short contract.

## License

[MIT](LICENSE)
