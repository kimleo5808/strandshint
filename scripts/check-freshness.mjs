#!/usr/bin/env node
/**
 * Puzzle data freshness check (run by GitHub Actions on a schedule).
 *
 * Catches the two failure modes we actually hit:
 *   - WRITE side: the puzzle-updater Worker stops writing to KV
 *     → /health lastUpdated goes stale.
 *   - READ side: the app stops reflecting KV (broken binding, missing ISR,
 *     frozen static fallback) → the live page shows an old puzzle date.
 *
 * Exits non-zero with a clear message if anything is stale, so the workflow
 * goes red and opens an issue.
 */

const WORKER_HEALTH = "https://puzzle-updater.kimleo5808.workers.dev/health";
const SITE_PAGES = [
  "https://strandshint.app/",
  "https://strandshint.app/strands-hint-today",
];
const MAX_WRITE_AGE_H = 36; // cron runs 3×/day; >36h means it stopped
const MAX_READ_AGE_DAYS = 2; // live page should show today's or yesterday's puzzle

const problems = [];
const now = Date.now();

async function get(url) {
  const res = await fetch(url, { headers: { "cache-control": "no-cache" } });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  return res;
}

// --- WRITE side: Worker /health ---
try {
  const health = await (await get(WORKER_HEALTH)).json();
  for (const game of ["strands", "connections", "wordle"]) {
    const g = health[game];
    if (!g || !g.lastUpdated || g.lastUpdated === "never") {
      problems.push(`[write] ${game}: no lastUpdated in /health`);
      continue;
    }
    const ageH = (now - Date.parse(g.lastUpdated)) / 3_600_000;
    if (ageH > MAX_WRITE_AGE_H) {
      problems.push(
        `[write] ${game}: KV not updated for ${ageH.toFixed(1)}h ` +
          `(lastUpdated ${g.lastUpdated}) — puzzle-updater Worker may be down`
      );
    } else {
      console.log(`[write] ${game}: OK (updated ${ageH.toFixed(1)}h ago, count ${g.count})`);
    }
  }
} catch (e) {
  problems.push(`[write] failed to read Worker /health: ${e.message}`);
}

// --- READ side: live pages must show a recent puzzle date ---
const MONTHS = ["january","february","march","april","may","june","july","august","september","october","november","december"];
function latestDateInText(text) {
  const re = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s+(\d{4})\b/g;
  let m, latest = null;
  while ((m = re.exec(text))) {
    const t = Date.UTC(+m[3], MONTHS.indexOf(m[1].toLowerCase()), +m[2]);
    if (latest === null || t > latest) latest = t;
  }
  return latest;
}

for (const url of SITE_PAGES) {
  try {
    const html = await (await get(url)).text();
    const latest = latestDateInText(html);
    if (latest === null) {
      problems.push(`[read] ${url}: no puzzle date found on page`);
      continue;
    }
    const ageDays = (now - latest) / 86_400_000;
    if (ageDays > MAX_READ_AGE_DAYS) {
      problems.push(
        `[read] ${url}: newest puzzle date is ${ageDays.toFixed(1)} days old ` +
          `(${new Date(latest).toISOString().slice(0, 10)}) — site not reflecting fresh KV data`
      );
    } else {
      console.log(`[read] ${url}: OK (newest date ${new Date(latest).toISOString().slice(0, 10)}, ${ageDays.toFixed(1)}d old)`);
    }
  } catch (e) {
    problems.push(`[read] ${url}: ${e.message}`);
  }
}

if (problems.length) {
  console.error("\n❌ FRESHNESS CHECK FAILED:\n" + problems.map((p) => "  - " + p).join("\n"));
  // Emit a summary the workflow can put into the issue body.
  console.log("\n::FRESHNESS_PROBLEMS::" + JSON.stringify(problems));
  process.exit(1);
}
console.log("\n✅ All fresh.");
