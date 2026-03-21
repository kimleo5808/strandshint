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

import type { StrandsDataFile } from "@/types/strands";
import type { ConnectionsDataFile } from "@/types/connections";
import type { WordleDataFile } from "@/types/wordle-hint";

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
 * Returns null when running outside Cloudflare (dev, build time).
 */
function getKV(): KVLike | null {
  try {
    // OpenNext exposes Cloudflare bindings via process.env at runtime
    const env = process.env as unknown as Record<string, unknown>;
    if (env.PUZZLE_DATA && typeof (env.PUZZLE_DATA as KVLike).get === "function") {
      return env.PUZZLE_DATA as KVLike;
    }
  } catch {
    // Not in Cloudflare runtime
  }

  // Try globalThis approach (some OpenNext versions)
  try {
    const g = globalThis as unknown as Record<string, Record<string, unknown>>;
    if (g.__env?.PUZZLE_DATA) {
      return g.__env.PUZZLE_DATA as KVLike;
    }
  } catch {
    // Not available
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
/*  Public API — KV-first, static fallback                             */
/* ------------------------------------------------------------------ */

export async function getStrandsData(): Promise<StrandsDataFile> {
  const kv = getKV();
  if (kv) {
    try {
      const data = await kv.get<StrandsDataFile>("puzzles:strands", "json");
      if (data && data.puzzles.length > 0) return data;
    } catch (e) {
      console.error("[puzzle-kv] Failed to read strands from KV:", e);
    }
  }
  return getStaticStrands();
}

export async function getConnectionsData(): Promise<ConnectionsDataFile> {
  const kv = getKV();
  if (kv) {
    try {
      const data = await kv.get<ConnectionsDataFile>("puzzles:connections", "json");
      if (data && data.puzzles.length > 0) return data;
    } catch (e) {
      console.error("[puzzle-kv] Failed to read connections from KV:", e);
    }
  }
  return getStaticConnections();
}

export async function getWordleData(): Promise<WordleDataFile> {
  const kv = getKV();
  if (kv) {
    try {
      const data = await kv.get<WordleDataFile>("puzzles:wordle", "json");
      if (data && data.puzzles.length > 0) return data;
    } catch (e) {
      console.error("[puzzle-kv] Failed to read wordle from KV:", e);
    }
  }
  return getStaticWordle();
}
