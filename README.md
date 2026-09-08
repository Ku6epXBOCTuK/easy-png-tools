# easy-png-tools

Browser-based PNG utility toolkit — no server, no data upload, everything runs locally.

Inspired by online services like onlinepngtools.com, but fully offline-capable and open source.

## Features

- **Pixel-level image processing** — format conversion, transparency/alpha channel, color transformations, geometry, filters/convolutions, morphology, quantization & palettes, image generation, text/watermarks, analysis & checks
- **Pipeline system (workspace)** — load image → chain multiple tool steps → sequential application → download result; pipelines saved to localStorage, exportable as JSON
- **Web Worker execution** — heavy operations run off the main thread with automatic fallback to direct calls
- **i18n** — full Russian and English localization with search matching
- **Dark/Light themes** — persisted to localStorage
- **Pure TypeScript core** — `lib/core/` operates on `ImageData`/`Uint8ClampedArray` with no DOM dependency
- **~30+ tools** across categories: transparency, color, geometry, filters, morphology, palettes, generation, text, analysis

## Tech Stack

- **SvelteKit** (Svelte 5, runes mode) with static adapter — pure static export, no server
- **Vite** + **TypeScript** (strict)
- **Vitest** for unit tests
- **ESLint** + **Prettier**
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

### Other Commands

| Command                  | Description               |
| ------------------------ | ------------------------- |
| `pnpm --dir web test`    | Run unit tests (Vitest)   |
| `pnpm --dir web check`   | Type-check (svelte-check) |
| `pnpm --dir web lint`    | Lint (ESLint)             |
| `pnpm --dir web format`  | Format code (Prettier)    |
| `pnpm format:docs`       | Format docs (Prettier)    |
| `pnpm --dir web preview` | Preview production build  |

## Project Structure

```txt
easy-png-tools/
├── web/                    # Main SvelteKit application
│   ├── src/
│   │   ├── lib/
│   │   │   ├── core/       # Pure TS image processing (ImageData-based)
│   │   │   ├── components/ # UI components
│   │   │   ├── tools/      # Pipeline, executor, overlay store
│   │   │   ├── i18n/       # Localization (ru/en)
│   │   │   └── registry.ts # Tool registry (source of truth)
│   │   └── routes/         # SvelteKit routes
│   └── build/              # Static export output
├── docs/                   # Architecture docs, roadmap, plans
└── refs/                   # Design reference (Next.js, not part of runtime)
```

## Architecture

The project is built around a **tool registry** (`registry.ts`) — each tool is a self-contained entry with `{id, title, description, category, params, run}`. Pages, forms, and pipelines are generated from this registry.

Core image processing lives in `lib/core/` and operates directly on `ImageData` objects with no browser API dependencies, making it portable to other environments (WASM, CLI) in the future.

## Roadmap

See [docs/roadmap.md](docs/roadmap.md) for the full development plan. Current phases:

1. **Phase 1** — TypeScript core + web UI (in progress)
2. **Phase 2** — Rust/WASM core for performance-critical operations
3. **Phase 3** — CLI tool

## License

[MIT](LICENSE)
