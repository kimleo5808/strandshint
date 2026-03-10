"use client";

import { WORD_LISTS } from "@/data/wordle-words";
import { useCallback, useState } from "react";
import { RefreshCw, Sparkles } from "lucide-react";

const WORDLE_WORDS = WORD_LISTS[5] ?? [];

// Precompute letter frequency scores from the word list
function buildLetterScores(words: string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const word of words) {
    const seen = new Set<string>();
    for (const ch of word) {
      if (!seen.has(ch)) {
        counts[ch] = (counts[ch] ?? 0) + 1;
        seen.add(ch);
      }
    }
  }
  return counts;
}
const LETTER_SCORES = buildLetterScores(WORDLE_WORDS);

function scoreWord(word: string): number {
  const seen = new Set<string>();
  let score = 0;
  for (const ch of word) {
    if (!seen.has(ch)) {
      score += LETTER_SCORES[ch] ?? 0;
      seen.add(ch);
    }
  }
  return score;
}

type CellColor = "green" | "yellow" | "gray" | "none";

interface GuessRow {
  letters: string[];
  colors: CellColor[];
}

const EMPTY_ROW = (): GuessRow => ({
  letters: ["", "", "", "", ""],
  colors: ["none", "none", "none", "none", "none"],
});

const COLOR_CYCLE: CellColor[] = ["none", "gray", "yellow", "green"];

function filterWords(words: string[], rows: GuessRow[]): string[] {
  return words.filter((word) => {
    for (const row of rows) {
      for (let i = 0; i < 5; i++) {
        const ch = row.letters[i].toUpperCase();
        const color = row.colors[i];
        if (!ch || color === "none") continue;

        if (color === "green" && word[i] !== ch) return false;
        if (color === "yellow") {
          if (!word.includes(ch)) return false;
          if (word[i] === ch) return false;
        }
        if (color === "gray") {
          // Only exclude if no other instance of this letter is green/yellow
          const hasElsewhere = row.letters.some(
            (l, j) =>
              j !== i &&
              l.toUpperCase() === ch &&
              (row.colors[j] === "green" || row.colors[j] === "yellow")
          );
          if (!hasElsewhere && word.includes(ch)) return false;
        }
      }
    }
    return true;
  });
}

const COLOR_STYLES: Record<CellColor, string> = {
  green: "bg-green-500 text-white border-green-500",
  yellow: "bg-yellow-400 text-yellow-950 border-yellow-400",
  gray: "bg-slate-400 text-white border-slate-400",
  none: "bg-background text-foreground border-border",
};

export default function WordleSolverTool() {
  const [rows, setRows] = useState<GuessRow[]>([EMPTY_ROW()]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);

  const updateLetter = (rowIdx: number, colIdx: number, val: string) => {
    const ch = val.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 1);
    setRows((prev) => {
      const next = prev.map((r) => ({
        letters: [...r.letters],
        colors: [...r.colors],
      }));
      next[rowIdx].letters[colIdx] = ch;
      // Auto-advance: handled by focus shift in JSX
      return next;
    });
    setSolved(false);
  };

  const cycleColor = (rowIdx: number, colIdx: number) => {
    setRows((prev) => {
      const next = prev.map((r) => ({
        letters: [...r.letters],
        colors: [...r.colors],
      }));
      const current = next[rowIdx].colors[colIdx];
      const idx = COLOR_CYCLE.indexOf(current);
      next[rowIdx].colors[colIdx] = COLOR_CYCLE[(idx + 1) % COLOR_CYCLE.length];
      return next;
    });
    setSolved(false);
  };

  const addRow = () => {
    if (rows.length < 5) setRows((prev) => [...prev, EMPTY_ROW()]);
  };

  const handleSolve = useCallback(() => {
    const filtered = filterWords(WORDLE_WORDS, rows);
    const sorted = filtered.sort((a, b) => scoreWord(b) - scoreWord(a));
    setSuggestions(sorted.slice(0, 30));
    setSolved(true);
  }, [rows]);

  const handleReset = () => {
    setRows([EMPTY_ROW()]);
    setSuggestions([]);
    setSolved(false);
  };

  const hasAnyInput = rows.some((r) => r.letters.some((l) => l !== ""));

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
      <p className="text-sm text-muted-foreground mb-4">
        Enter your guesses below. Click each letter tile to cycle its color:
        <span className="inline-flex gap-1.5 ml-2 align-middle">
          <span className="rounded px-1.5 py-0.5 text-xs font-bold bg-slate-400 text-white">Gray</span>
          <span className="rounded px-1.5 py-0.5 text-xs font-bold bg-yellow-400 text-yellow-950">Yellow</span>
          <span className="rounded px-1.5 py-0.5 text-xs font-bold bg-green-500 text-white">Green</span>
        </span>
      </p>

      {/* Guess Rows */}
      <div className="space-y-2">
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className="flex items-center gap-1.5">
            <span className="w-4 text-xs text-muted-foreground text-right shrink-0">
              {rowIdx + 1}
            </span>
            {row.letters.map((letter, colIdx) => (
              <button
                key={colIdx}
                onClick={() => letter && cycleColor(rowIdx, colIdx)}
                className={`relative h-12 w-12 rounded-lg border-2 font-mono text-lg font-bold uppercase transition-all ${COLOR_STYLES[row.colors[colIdx]]} ${!letter ? "cursor-default" : "cursor-pointer hover:opacity-90"}`}
                title={letter ? "Click to change color" : "Type a letter first"}
              >
                <input
                  type="text"
                  maxLength={1}
                  value={letter}
                  onChange={(e) => updateLetter(rowIdx, colIdx, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute inset-0 w-full h-full bg-transparent text-center font-mono text-lg font-bold uppercase cursor-text focus:outline-none"
                />
              </button>
            ))}
            <span className="text-xs text-muted-foreground ml-1 hidden sm:block">
              {row.letters.every((l) => l) ? "← click tiles to set colors" : ""}
            </span>
          </div>
        ))}
      </div>

      {/* Add row */}
      {rows.length < 5 && (
        <button
          onClick={addRow}
          className="mt-2 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          + Add another guess row
        </button>
      )}

      {/* Buttons */}
      <div className="mt-5 flex gap-3">
        <button
          onClick={handleSolve}
          disabled={!hasAnyInput}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className="h-4 w-4" />
          Get Suggestions
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground"
        >
          <RefreshCw className="h-4 w-4" />
          Reset
        </button>
      </div>

      {/* Suggestions */}
      {solved && (
        <div className="mt-5 border-t border-border pt-5">
          <p className="text-sm font-semibold text-foreground mb-3">
            {suggestions.length === 0
              ? "No words match — check your colors are set correctly."
              : `Top ${suggestions.length} suggestions (ranked by letter frequency):`}
          </p>
          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {suggestions.map((word, i) => (
                <span
                  key={word}
                  className={`rounded-lg px-3 py-1.5 font-mono text-sm font-bold tracking-widest ${
                    i === 0
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-400/40"
                      : "bg-emerald-500/5 text-foreground border border-border"
                  }`}
                >
                  {word}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
