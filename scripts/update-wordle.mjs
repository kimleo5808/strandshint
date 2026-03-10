#!/usr/bin/env node

/**
 * Wordle Puzzle Data Updater
 *
 * Fetches daily Wordle answers from the NYT Wordle API and merges
 * them into our local data file.
 *
 * Run manually:   node scripts/update-wordle.mjs
 * Backfill:       node scripts/update-wordle.mjs --backfill
 * Via npm script:  pnpm run update:wordle
 * Automated:       GitHub Actions cron (see .github/workflows/deploy-cloudflare.yml)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "..", "data", "wordle");
const DATA_FILE = path.join(DATA_DIR, "puzzles.json");

// NYT Wordle API — publicly accessible, no auth needed
const NYT_WORDLE_API = "https://www.nytimes.com/svc/wordle/v2";

// Historical data start date
const HISTORY_START = "2025-11-12";

// Rate limit: wait between API requests to be polite
const REQUEST_DELAY_MS = 300;

/**
 * Fetch JSON from a URL with retries
 */
async function fetchJSON(url, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; StrandsHint/1.0; +https://strandshint.app)",
          Accept: "application/json",
        },
      });
      if (res.status === 404) {
        return null;
      }
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      return await res.json();
    } catch (err) {
      console.error(
        `  Attempt ${attempt}/${retries} failed for ${url}: ${err.message}`
      );
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 2000 * attempt));
      }
    }
  }
  return null;
}

/**
 * Load existing puzzle data from disk
 */
function loadExistingData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("Could not load existing data:", err.message);
  }
  return { lastUpdated: "", puzzles: [] };
}

/**
 * Save puzzle data to disk
 */
function saveData(data) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * Validate a Wordle puzzle has the expected fields
 */
function isValidPuzzle(puzzle) {
  if (!puzzle || typeof puzzle.id !== "number") return false;
  if (!puzzle.print_date && !puzzle.printDate) return false;
  if (!puzzle.solution || typeof puzzle.solution !== "string") return false;
  if (puzzle.solution.length !== 5) return false;
  return true;
}

/**
 * Normalize an API response to our local format
 */
function normalizePuzzle(raw) {
  return {
    id: raw.id,
    printDate: raw.print_date || raw.printDate,
    answer: raw.solution.toUpperCase(),
    editor: raw.editor || "",
  };
}

/**
 * Generate date strings from start to end (inclusive)
 */
function* dateRange(startStr, endStr) {
  const start = new Date(startStr + "T00:00:00Z");
  const end = new Date(endStr + "T00:00:00Z");
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    yield d.toISOString().split("T")[0];
  }
}

/**
 * Fetch a single puzzle by date
 */
async function fetchPuzzle(dateStr) {
  const data = await fetchJSON(`${NYT_WORDLE_API}/${dateStr}.json`, 2);
  if (!data) return null;

  if (isValidPuzzle(data)) {
    return normalizePuzzle(data);
  }

  console.warn(`  Invalid puzzle data for ${dateStr}`);
  return null;
}

/**
 * Backfill: fetch all puzzles from HISTORY_START to today
 */
async function backfill(existingDates) {
  const today = new Date().toISOString().split("T")[0];
  const dates = [...dateRange(HISTORY_START, today)].filter(
    (d) => !existingDates.has(d)
  );

  if (dates.length === 0) {
    console.log("  No dates to backfill.");
    return [];
  }

  console.log(
    `  Backfilling ${dates.length} dates (${dates[0]} → ${dates[dates.length - 1]})...`
  );

  const newPuzzles = [];
  let fetchedCount = 0;
  let skippedCount = 0;

  for (const date of dates) {
    const puzzle = await fetchPuzzle(date);
    if (puzzle) {
      newPuzzles.push(puzzle);
      fetchedCount++;
      if (fetchedCount % 20 === 0) {
        console.log(`    Fetched ${fetchedCount}/${dates.length}...`);
      }
    } else {
      skippedCount++;
    }
    await new Promise((r) => setTimeout(r, REQUEST_DELAY_MS));
  }

  console.log(
    `  Backfill complete: ${fetchedCount} puzzles fetched, ${skippedCount} dates skipped`
  );
  return newPuzzles;
}

/**
 * Daily update: fetch today's puzzle if not already present
 */
async function dailyUpdate(existingDates) {
  const today = new Date().toISOString().split("T")[0];
  if (existingDates.has(today)) {
    console.log(`  Today's puzzle (${today}) already in data.`);
    return [];
  }

  console.log(`  Fetching today's puzzle (${today})...`);
  const puzzle = await fetchPuzzle(today);
  if (puzzle) {
    console.log(`  Got puzzle #${puzzle.id}: ${puzzle.answer}`);
    return [puzzle];
  }
  console.log(`  No puzzle available for today yet.`);
  return [];
}

/**
 * Main update function
 */
async function main() {
  const isBackfill = process.argv.includes("--backfill");

  console.log("🔄 Wordle Puzzle Data Updater");
  console.log("==============================\n");

  const existing = loadExistingData();
  const existingDates = new Set(existing.puzzles.map((p) => p.printDate));
  console.log(
    `📦 Existing data: ${existing.puzzles.length} puzzles (last updated: ${existing.lastUpdated || "never"})`
  );

  let newPuzzles = [];
  if (isBackfill) {
    console.log(`\n📡 Running backfill from ${HISTORY_START}...`);
    newPuzzles = await backfill(existingDates);
  } else {
    console.log(`\n📡 Running daily update...`);
    newPuzzles = await dailyUpdate(existingDates);
  }

  if (newPuzzles.length > 0) {
    const allPuzzles = [...existing.puzzles, ...newPuzzles].sort((a, b) =>
      a.printDate.localeCompare(b.printDate)
    );

    const updatedData = {
      lastUpdated: new Date().toISOString(),
      puzzles: allPuzzles,
    };

    saveData(updatedData);
    console.log(
      `\n✅ Saved ${allPuzzles.length} total puzzles (${newPuzzles.length} new)`
    );
  } else {
    console.log(`\n✅ No new puzzles to add. Data is up to date.`);
    existing.lastUpdated = new Date().toISOString();
    saveData(existing);
  }

  const finalData = loadExistingData();
  const dates = finalData.puzzles.map((p) => p.printDate).sort();
  console.log(`\n📊 Summary:`);
  console.log(`   Total puzzles: ${finalData.puzzles.length}`);
  if (dates.length > 0) {
    console.log(`   Date range: ${dates[0]} → ${dates[dates.length - 1]}`);
  }
  console.log(`   Last updated: ${finalData.lastUpdated}`);
}

main().catch((err) => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});
