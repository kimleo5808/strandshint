#!/usr/bin/env node

/**
 * Strands Puzzle Data Updater
 *
 * Fetches puzzle data from the NYT Strands API and merges it into
 * our local data file. Strips the large `solutions` field to save space.
 *
 * Run manually:   node scripts/update-strands.mjs
 * Backfill:       node scripts/update-strands.mjs --backfill
 * Via npm script:  pnpm run update:strands
 * Automated:       GitHub Actions cron (see .github/workflows/deploy-cloudflare.yml)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "..", "data", "strands");
const DATA_FILE = path.join(DATA_DIR, "puzzles.json");

// NYT Strands API — publicly accessible, no auth needed
const NYT_STRANDS_API = "https://www.nytimes.com/svc/strands/v2";

// Historical data starts from this date (user chose to exclude 2024)
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
        // No puzzle for this date — not an error
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
 * Validate a Strands puzzle has the expected fields
 */
function isValidPuzzle(puzzle) {
  if (!puzzle || typeof puzzle.id !== "number") return false;
  if (!puzzle.printDate && !puzzle.print_date) return false;
  if (!puzzle.clue || typeof puzzle.clue !== "string") return false;
  if (!puzzle.spangram || typeof puzzle.spangram !== "string") return false;
  if (!Array.isArray(puzzle.themeWords) || puzzle.themeWords.length === 0)
    return false;
  if (!Array.isArray(puzzle.startingBoard) || puzzle.startingBoard.length !== 8)
    return false;
  return true;
}

/**
 * Normalize an API response to our local format, stripping unused fields
 */
function normalizePuzzle(raw) {
  return {
    id: raw.id,
    printDate: raw.printDate || raw.print_date,
    editor: raw.editor || "",
    constructors: raw.constructors || "",
    clue: raw.clue,
    spangram: raw.spangram,
    themeWords: raw.themeWords,
    startingBoard: raw.startingBoard,
    themeCoords: raw.themeCoords || {},
    spangramCoords: raw.spangramCoords || [],
    // NOTE: `solutions` field intentionally omitted — too large, not needed
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
  const data = await fetchJSON(`${NYT_STRANDS_API}/${dateStr}.json`, 2);
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
    // Rate limit
    await new Promise((r) => setTimeout(r, REQUEST_DELAY_MS));
  }

  console.log(
    `  Backfill complete: ${fetchedCount} puzzles fetched, ${skippedCount} dates skipped`
  );
  return newPuzzles;
}

/**
 * Daily update: fetch every missing date from the newest stored puzzle
 * through today, so a missed run (or months without one) leaves no gap.
 * Also re-checks the last RECHECK_DAYS, so a date that failed once (a
 * transient NYT/network error) is retried on later runs instead of leaving a
 * permanent hole. Older history is --backfill's job.
 */
const RECHECK_DAYS = 30;

async function dailyUpdate(existingDates) {
  const today = new Date().toISOString().split("T")[0];
  const recheck = new Date(today + "T00:00:00Z");
  recheck.setUTCDate(recheck.getUTCDate() - RECHECK_DAYS);
  const recheckFrom = recheck.toISOString().split("T")[0];
  const newest = [...existingDates].sort().pop();
  const start = newest && newest < recheckFrom ? newest : recheckFrom;
  const dates = [...dateRange(start, today)].filter(
    (d) => !existingDates.has(d)
  );

  if (dates.length === 0) {
    console.log(`  Up to date (newest stored puzzle: ${newest}).`);
    return [];
  }

  console.log(
    `  Fetching ${dates.length} date(s) (${dates[0]} → ${dates[dates.length - 1]})...`
  );
  const puzzles = [];
  for (const date of dates) {
    const puzzle = await fetchPuzzle(date);
    if (puzzle) {
      puzzles.push(puzzle);
    } else {
      console.log(`  No puzzle available for ${date} yet.`);
    }
    if (dates.length > 1) {
      await new Promise((r) => setTimeout(r, REQUEST_DELAY_MS));
    }
  }
  console.log(`  Got ${puzzles.length} puzzle(s).`);
  return puzzles;
}

/**
 * Main update function
 */
async function main() {
  const isBackfill = process.argv.includes("--backfill");

  console.log("🔄 Strands Puzzle Data Updater");
  console.log("===============================\n");

  // 1. Load existing data
  const existing = loadExistingData();
  const existingDates = new Set(existing.puzzles.map((p) => p.printDate));
  console.log(
    `📦 Existing data: ${existing.puzzles.length} puzzles (last updated: ${existing.lastUpdated || "never"})`
  );

  // 2. Fetch new puzzles
  let newPuzzles = [];
  if (isBackfill) {
    console.log(`\n📡 Running backfill from ${HISTORY_START}...`);
    newPuzzles = await backfill(existingDates);
  } else {
    console.log(`\n📡 Running daily update...`);
    newPuzzles = await dailyUpdate(existingDates);
  }

  // 3. Merge and save
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

  // 4. Summary
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
