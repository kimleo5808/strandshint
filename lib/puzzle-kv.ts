/**
 * Runtime puzzle data loader — reads from Cloudflare KV at request time.
 *
 * Replaces the old static JSON imports (data/strands/puzzles.json etc.)
 * so the site no longer needs a full rebuild when puzzle data changes.
 *
 * Data is written to KV by the puzzle-updater Worker on a cron schedule.
 *
 * Fallback: if KV is unavailable (local dev / build time), falls back to
 * the static JSON files so everything still works offline.
 */

import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { StrandsDataFile } from "@/types/strands";
import type { ConnectionsDataFile } from "@/types/connections";
import type { WordleDataFile } from "@/types/wordle-hint";
import { puzzleNumberFor, type PuzzleGame } from "@/lib/puzzle-number";

/* ------------------------------------------------------------------ */
/*  Minimal KV type (avoids dependency on @cloudflare/workers-types)   */
/* ------------------------------------------------------------------ */

interface KVLike {
  get<T = string>(key: string, type: "json"): Promise<T | null>;
  get(key: string, type?: "text"): Promise<string | null>;
}

/* ------------------------------------------------------------------ */
/*  KV access via Cloudflare env bindings                              */
/* ------------------------------------------------------------------ */

/**
 * Get the KV namespace from the Cloudflare execution context.
 *
 * OpenNext exposes bindings on `getCloudflareContext().env`, NOT on
 * `process.env` — `process.env` only ever receives *string* vars, never
 * object bindings like a KV namespace. We use the async form so this also
 * resolves during ISR / SSG (where the context is fetched via wrangler's
 * platform proxy — empty KV locally, which falls back to static JSON).
 *
 * Returns null when no Cloudflare context is available (e.g. build time
 * without wrangler), so callers fall back to the bundled static JSON.
 */
async function getKV(): Promise<KVLike | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const kv = (env as unknown as Record<string, unknown>).PUZZLE_DATA;
    if (kv && typeof (kv as KVLike).get === "function") {
      return kv as KVLike;
    }
  } catch {
    // No Cloudflare context (build time / outside Cloudflare runtime)
  }

  return null;
}

/* ------------------------------------------------------------------ */
/*  Static JSON fallbacks (for dev / build time)                       */
/* ------------------------------------------------------------------ */

let _strandsStaticCache: StrandsDataFile | null = null;
let _connectionsStaticCache: ConnectionsDataFile | null = null;
let _wordleStaticCache: WordleDataFile | null = null;

async function getStaticStrands(): Promise<StrandsDataFile> {
  if (!_strandsStaticCache) {
    const mod = await import("@/data/strands/puzzles.json");
    _strandsStaticCache = mod.default as unknown as StrandsDataFile;
  }
  return _strandsStaticCache;
}

async function getStaticConnections(): Promise<ConnectionsDataFile> {
  if (!_connectionsStaticCache) {
    const mod = await import("@/data/connections/puzzles.json");
    _connectionsStaticCache = mod.default as unknown as ConnectionsDataFile;
  }
  return _connectionsStaticCache;
}

async function getStaticWordle(): Promise<WordleDataFile> {
  if (!_wordleStaticCache) {
    const mod = await import("@/data/wordle/puzzles.json");
    _wordleStaticCache = mod.default as unknown as WordleDataFile;
  }
  return _wordleStaticCache;
}

/* ------------------------------------------------------------------ */
/*  Puzzle number correction                                           */
/* ------------------------------------------------------------------ */

/**
 * Replace NYT's internal `id` with the number players actually see.
 *
 * Everything downstream renders `id` as "Puzzle #N" — the type comments have
 * always described it as the sequential puzzle number — but the updater stored
 * the API's internal database key instead, so every archive page advertised a
 * number that matched nothing in the game. Correcting it here covers KV and the
 * static fallback at once, and keeps the original under `nytId` for tracing.
 */
function withPuzzleNumbers<T extends { id: number; printDate: string }>(
  game: PuzzleGame,
  puzzles: T[]
): T[] {
  return puzzles.map((puzzle) => {
    // Wordle publishes its own counter; trust it over the date arithmetic so a
    // skipped or doubled day upstream cannot drift the whole archive.
    const published = (puzzle as { daysSinceLaunch?: number }).daysSinceLaunch;
    const number =
      typeof published === "number" && published > 0
        ? published
        : puzzleNumberFor(game, puzzle.printDate);

    if (number === null || number === puzzle.id) return puzzle;

    return { ...puzzle, id: number, nytId: puzzle.id };
  });
}

/* ------------------------------------------------------------------ */
/*  Public API — KV-first, static fallback                             */
/* ------------------------------------------------------------------ */

export async function getStrandsData(): Promise<StrandsDataFile> {
  const kv = await getKV();
  if (kv) {
    try {
      const data = await kv.get<StrandsDataFile>("puzzles:strands", "json");
      if (data && data.puzzles.length > 0) {
        return { ...data, puzzles: withPuzzleNumbers("strands", data.puzzles) };
      }
    } catch (e) {
      console.error("[puzzle-kv] Failed to read strands from KV:", e);
    }
  }
  const fallback = await getStaticStrands();
  return { ...fallback, puzzles: withPuzzleNumbers("strands", fallback.puzzles) };
}

export async function getConnectionsData(): Promise<ConnectionsDataFile> {
  const kv = await getKV();
  if (kv) {
    try {
      const data = await kv.get<ConnectionsDataFile>("puzzles:connections", "json");
      if (data && data.puzzles.length > 0) {
        return { ...data, puzzles: withPuzzleNumbers("connections", data.puzzles) };
      }
    } catch (e) {
      console.error("[puzzle-kv] Failed to read connections from KV:", e);
    }
  }
  const fallback = await getStaticConnections();
  return { ...fallback, puzzles: withPuzzleNumbers("connections", fallback.puzzles) };
}

export async function getWordleData(): Promise<WordleDataFile> {
  const kv = await getKV();
  if (kv) {
    try {
      const data = await kv.get<WordleDataFile>("puzzles:wordle", "json");
      if (data && data.puzzles.length > 0) {
        return { ...data, puzzles: withPuzzleNumbers("wordle", data.puzzles) };
      }
    } catch (e) {
      console.error("[puzzle-kv] Failed to read wordle from KV:", e);
    }
  }
  const fallback = await getStaticWordle();
  return { ...fallback, puzzles: withPuzzleNumbers("wordle", fallback.puzzles) };
}
