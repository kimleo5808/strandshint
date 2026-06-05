# StrandsHint.app

Daily hints, answers, and archives for NYT word puzzles — **Strands**, **Connections**, and **Wordle** — plus word tools (anagram solver, word finder, Wordle solver) and N-letter word lists.

Live: <https://strandshint.app>

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) + React 19, TypeScript (strict) |
| Styling | Tailwind CSS 3 + shadcn/ui (CVA + clsx + tailwind-merge) |
| i18n | next-intl v4 (`en` only today; `[locale]` routing kept for future langs) |
| State | Zustand |
| Content | MDX blog + static guides |
| Hosting | **Cloudflare Workers** via `@opennextjs/cloudflare` (R2 incremental cache) |
| Puzzle data | **Cloudflare KV** (`PUZZLE_DATA`), updated by a separate cron Worker |
| Package manager | pnpm |

## How puzzle data flows

```
┌─────────────────────┐   cron 3×/day    ┌──────────────┐   read at runtime   ┌──────────────┐
│ workers/             │ ───────────────▶ │ Cloudflare   │ ◀───────────────────│ Next.js app  │
│ puzzle-updater       │  fetch NYT API   │ KV           │  getCloudflareContext│ (ISR pages)  │
│ (Worker, own deploy) │  write JSON      │ PUZZLE_DATA  │  .env.PUZZLE_DATA    │              │
└─────────────────────┘                  └──────────────┘                     └──────────────┘
```

- **Writer** — `workers/puzzle-updater/` is a standalone Worker on a cron schedule (UTC 00:30 / 08:30 / 16:30). It fetches the NYT Strands/Connections/Wordle APIs and writes the full data files to the shared KV namespace `PUZZLE_DATA`. Health/manual trigger: `GET /health`, `POST /trigger?batch=N`.
- **Reader** — `lib/puzzle-kv.ts` reads KV at request time via `getCloudflareContext({async:true}).env.PUZZLE_DATA`. **KV bindings are objects and are NOT exposed on `process.env`** (OpenNext only copies string vars there). If no Cloudflare context is available (build time / local), it falls back to the bundled `data/*/puzzles.json` snapshots.
- **ISR is required** — every page that reads puzzle data declares `export const revalidate = <seconds>`. Without it the page is statically prerendered at build time (when KV is empty) and would freeze on the static fallback. Archive `[date]` pages render new dates on-demand via `dynamicParams`.
- `data/*/puzzles.json` are committed **fallback snapshots only**; the live source of truth is KV. Refresh them with `pnpm run update:strands` / `:connections` / `:wordle`.

> Note: a fresh deploy briefly serves the build-time fallback until the first request after the `revalidate` window regenerates the page from KV. This is expected.

## Local development

```bash
pnpm install
cp .dev.vars.example .dev.vars   # local runtime vars
pnpm dev                         # http://localhost:3000
```

`next.config.mjs` calls `initOpenNextCloudflareForDev()`, so `getCloudflareContext()` works in `next dev` (KV is the local miniflare namespace — empty unless seeded, so dev uses the static fallback).

## Deploy

The main app deploys to Cloudflare Workers automatically on push to `main` (`.github/workflows/deploy-cloudflare.yml` → `pnpm run deploy`).

```bash
# Main app (also runs in CI)
pnpm run preview   # build + local Cloudflare runtime preview
pnpm run deploy    # build + deploy to Cloudflare

# Puzzle-updater Worker — deployed separately, NOT covered by the main CI
cd workers/puzzle-updater
wrangler deploy
```

Required secrets for the deploy workflow: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, plus the `NEXT_PUBLIC_*` analytics IDs.

## Project structure

```
app/[locale]/              All page routes (strands/connections/wordle hint, today, archive, tools)
components/                strands/ connections/ wordle/ tools/ home/ header/ footer/ ui/
lib/                       puzzle-kv.ts (KV reader) + per-game data accessors, metadata, jsonld
data/                      committed fallback puzzle snapshots + game config
workers/puzzle-updater/    standalone cron Worker that writes puzzle data to KV
i18n/                      next-intl routing + messages (en)
blogs/, content/           MDX blog posts and static page content
config/site.ts             site metadata (BASE_URL, siteConfig)
scripts/                   update-*.mjs (refresh fallback snapshots), screenshot tools
```

## License

MIT
