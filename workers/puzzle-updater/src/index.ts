/**
 * Puzzle Data Updater Worker
 *
 * A Cloudflare Worker that runs on a cron schedule (3x daily) to fetch
 * the latest puzzle data from NYT APIs and store it in KV.
 *
 * KV Keys:
 *   - puzzles:strands   → full StrandsDataFile JSON
 *   - puzzles:connections → full ConnectionsDataFile JSON
 *   - puzzles:wordle    → full WordleDataFile JSON
 *
 * This replaces the GitHub Actions cron + build cycle, saving CI minutes.
 * The main Next.js app reads from the same KV namespace at runtime.
 */

export interface Env {
  PUZZLE_DATA: KVNamespace;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const NYT_STRANDS_API = "https://www.nytimes.com/svc/strands/v2";
const NYT_CONNECTIONS_API = "https://www.nytimes.com/svc/connections/v2";
const NYT_WORDLE_API = "https://www.nytimes.com/svc/wordle/v2";
const HISTORY_START = "2025-11-12";
const RETRY_COUNT = 3;
const RETRY_BASE_MS = 2000;
const RATE_LIMIT_MS = 300;

/* ------------------------------------------------------------------ */
/*  Types (simplified — mirrors the main app types)                    */
/* ------------------------------------------------------------------ */

interface StrandsPuzzle {
  id: number;
  printDate: string;
  editor: string;
  constructors: string;
  clue: string;
  spangram: string;
  themeWords: string[];
  startingBoard: string[];
  themeCoords: Record<string, [number, number][]>;
  spangramCoords: [number, number][];
}

interface ConnectionsCard {
  content: string;
  position: number;
}

interface ConnectionsCategory {
  title: string;
  cards: ConnectionsCard[];
  difficulty: number;
}

interface ConnectionsPuzzle {
  id: number;
  printDate: string;
  editor: string;
  categories: ConnectionsCategory[];
}

interface WordlePuzzle {
  id: number;
  printDate: string;
  answer: string;
  editor: string;
}

interface DataFile<T> {
  lastUpdated: string;
  puzzles: T[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function getDateRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const current = new Date(start + "T00:00:00Z");
  const last = new Date(end + "T00:00:00Z");
  while (current <= last) {
    dates.push(formatDate(current));
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return dates;
}

async function fetchWithRetry(url: string): Promise<Response | null> {
  for (let attempt = 0; attempt < RETRY_COUNT; attempt++) {
    try {
      const resp = await fetch(url);
      if (resp.status === 404) return null; // No puzzle for this date
      if (resp.ok) return resp;
      // Retry on server errors
      if (attempt < RETRY_COUNT - 1) {
        await new Promise((r) =>
          setTimeout(r, RETRY_BASE_MS * Math.pow(2, attempt))
        );
      }
    } catch {
      if (attempt < RETRY_COUNT - 1) {
        await new Promise((r) =>
          setTimeout(r, RETRY_BASE_MS * Math.pow(2, attempt))
        );
      }
    }
  }
  return null;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/* ------------------------------------------------------------------ */
/*  Strands Updater                                                    */
/* ------------------------------------------------------------------ */

function normalizeStrands(raw: Record<string, unknown>): StrandsPuzzle | null {
  const id = raw.id as number;
  const printDate = (raw.printDate || raw.print_date) as string;
  const clue = raw.clue as string;
  const spangram = raw.spangram as string;
  const themeWords = raw.themeWords as string[];
  const startingBoard = raw.startingBoard as string[];

  if (!id || !printDate || !clue || !spangram) return null;

  return {
    id,
    printDate,
    editor: (raw.editor as string) || "",
    constructors: (raw.constructors as string) || "",
    clue,
    spangram,
    themeWords: themeWords || [],
    startingBoard: startingBoard || [],
    themeCoords: (raw.themeCoords as Record<string, [number, number][]>) || {},
    spangramCoords: (raw.spangramCoords as [number, number][]) || [],
  };
}

async function updateStrands(kv: KVNamespace, maxBatch = 0): Promise<number> {
  // Load existing data from KV
  const existing =
    (await kv.get<DataFile<StrandsPuzzle>>("puzzles:strands", "json")) || {
      lastUpdated: "",
      puzzles: [],
    };

  const existingDates = new Set(existing.puzzles.map((p) => p.printDate));
  const today = formatDate(new Date());
  const allDates = getDateRange(HISTORY_START, today);
  let missingDates = allDates.filter((d) => !existingDates.has(d));
  if (maxBatch > 0) missingDates = missingDates.slice(0, maxBatch);

  let added = 0;
  for (const date of missingDates) {
    const resp = await fetchWithRetry(`${NYT_STRANDS_API}/${date}.json`);
    if (resp) {
      const raw = (await resp.json()) as Record<string, unknown>;
      const puzzle = normalizeStrands(raw);
      if (puzzle) {
        existing.puzzles.push(puzzle);
        added++;
      }
    }
    await sleep(RATE_LIMIT_MS);
  }

  if (added > 0) {
    existing.puzzles.sort(
      (a, b) => a.printDate.localeCompare(b.printDate)
    );
    existing.lastUpdated = new Date().toISOString();
    await kv.put("puzzles:strands", JSON.stringify(existing));
  }

  return added;
}

/* ------------------------------------------------------------------ */
/*  Connections Updater                                                */
/* ------------------------------------------------------------------ */

function normalizeConnections(
  raw: Record<string, unknown>
): ConnectionsPuzzle | null {
  const id = raw.id as number;
  const printDate = (raw.printDate || raw.print_date) as string;
  const rawCategories = raw.categories as
    | Record<string, unknown>[]
    | undefined;

  if (!id || !printDate || !rawCategories) return null;

  const categories: ConnectionsCategory[] = rawCategories
    .map((cat) => ({
      title: (cat.title as string) || "",
      cards: ((cat.cards as Record<string, unknown>[]) || []).map((c) => ({
        content: (c.content as string) || "",
        position: (c.position as number) || 0,
      })),
      difficulty: (cat.difficulty as number) || 0,
    }))
    .sort((a, b) => a.difficulty - b.difficulty);

  return {
    id,
    printDate,
    editor: (raw.editor as string) || "",
    categories,
  };
}

async function updateConnections(kv: KVNamespace, maxBatch = 0): Promise<number> {
  const existing =
    (await kv.get<DataFile<ConnectionsPuzzle>>(
      "puzzles:connections",
      "json"
    )) || { lastUpdated: "", puzzles: [] };

  const existingDates = new Set(existing.puzzles.map((p) => p.printDate));
  const today = formatDate(new Date());
  const allDates = getDateRange(HISTORY_START, today);
  let missingDates = allDates.filter((d) => !existingDates.has(d));
  if (maxBatch > 0) missingDates = missingDates.slice(0, maxBatch);

  let added = 0;
  for (const date of missingDates) {
    const resp = await fetchWithRetry(`${NYT_CONNECTIONS_API}/${date}.json`);
    if (resp) {
      const raw = (await resp.json()) as Record<string, unknown>;
      const puzzle = normalizeConnections(raw);
      if (puzzle) {
        existing.puzzles.push(puzzle);
        added++;
      }
    }
    await sleep(RATE_LIMIT_MS);
  }

  if (added > 0) {
    existing.puzzles.sort(
      (a, b) => a.printDate.localeCompare(b.printDate)
    );
    existing.lastUpdated = new Date().toISOString();
    await kv.put("puzzles:connections", JSON.stringify(existing));
  }

  return added;
}

/* ------------------------------------------------------------------ */
/*  Wordle Updater                                                     */
/* ------------------------------------------------------------------ */

function normalizeWordle(raw: Record<string, unknown>): WordlePuzzle | null {
  const id = raw.id as number;
  const printDate = (raw.printDate || raw.print_date) as string;
  const answer = ((raw.solution || raw.answer) as string || "").toUpperCase();

  if (!id || !printDate || !answer) return null;

  return {
    id,
    printDate,
    answer,
    editor: (raw.editor as string) || "",
  };
}

async function updateWordle(kv: KVNamespace, maxBatch = 0): Promise<number> {
  const existing =
    (await kv.get<DataFile<WordlePuzzle>>("puzzles:wordle", "json")) || {
      lastUpdated: "",
      puzzles: [],
    };

  const existingDates = new Set(existing.puzzles.map((p) => p.printDate));
  const today = formatDate(new Date());
  const allDates = getDateRange(HISTORY_START, today);
  let missingDates = allDates.filter((d) => !existingDates.has(d));
  if (maxBatch > 0) missingDates = missingDates.slice(0, maxBatch);

  let added = 0;
  for (const date of missingDates) {
    const resp = await fetchWithRetry(`${NYT_WORDLE_API}/${date}.json`);
    if (resp) {
      const raw = (await resp.json()) as Record<string, unknown>;
      const puzzle = normalizeWordle(raw);
      if (puzzle) {
        existing.puzzles.push(puzzle);
        added++;
      }
    }
    await sleep(RATE_LIMIT_MS);
  }

  if (added > 0) {
    existing.puzzles.sort(
      (a, b) => a.printDate.localeCompare(b.printDate)
    );
    existing.lastUpdated = new Date().toISOString();
    await kv.put("puzzles:wordle", JSON.stringify(existing));
  }

  return added;
}

/* ------------------------------------------------------------------ */
/*  Worker Entry Point                                                 */
/* ------------------------------------------------------------------ */

export default {
  // Cron trigger handler
  async scheduled(
    _event: ScheduledEvent,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    ctx.waitUntil(
      (async () => {
        console.log(`[puzzle-updater] Cron triggered at ${new Date().toISOString()}`);

        const strandsAdded = await updateStrands(env.PUZZLE_DATA);
        console.log(`[strands] Added ${strandsAdded} puzzles`);

        const connectionsAdded = await updateConnections(env.PUZZLE_DATA);
        console.log(`[connections] Added ${connectionsAdded} puzzles`);

        const wordleAdded = await updateWordle(env.PUZZLE_DATA);
        console.log(`[wordle] Added ${wordleAdded} puzzles`);

        console.log(`[puzzle-updater] Done. Total new: ${strandsAdded + connectionsAdded + wordleAdded}`);
      })()
    );
  },

  // HTTP handler — for manual trigger or health check
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      const strands = await env.PUZZLE_DATA.get<DataFile<unknown>>("puzzles:strands", "json");
      const connections = await env.PUZZLE_DATA.get<DataFile<unknown>>("puzzles:connections", "json");
      const wordle = await env.PUZZLE_DATA.get<DataFile<unknown>>("puzzles:wordle", "json");

      return Response.json({
        status: "ok",
        strands: {
          count: strands?.puzzles?.length || 0,
          lastUpdated: strands?.lastUpdated || "never",
        },
        connections: {
          count: connections?.puzzles?.length || 0,
          lastUpdated: connections?.lastUpdated || "never",
        },
        wordle: {
          count: wordle?.puzzles?.length || 0,
          lastUpdated: wordle?.lastUpdated || "never",
        },
      });
    }

    if (url.pathname === "/trigger" && request.method === "POST") {
      // HTTP requests have 30s timeout, so limit batch size
      // Use ?batch=N to control (default 30 per game per call)
      const batch = Math.min(parseInt(url.searchParams.get("batch") || "30"), 60);
      const strandsAdded = await updateStrands(env.PUZZLE_DATA, batch);
      const connectionsAdded = await updateConnections(env.PUZZLE_DATA, batch);
      const wordleAdded = await updateWordle(env.PUZZLE_DATA, batch);

      return Response.json({
        status: "updated",
        batch,
        strands: strandsAdded,
        connections: connectionsAdded,
        wordle: wordleAdded,
      });
    }

    return new Response("Puzzle Updater Worker. GET /health or POST /trigger", {
      status: 200,
    });
  },
} satisfies ExportedHandler<Env>;
