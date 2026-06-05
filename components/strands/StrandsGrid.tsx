"use client";

import type { StrandsPuzzle } from "@/types/strands";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

/**
 * Displays the 6×8 Strands letter grid with interactive word highlighting.
 * - Click a word button to reveal its position on the grid
 * - Theme words highlighted in blue
 * - Spangram highlighted in amber/gold
 */

interface StrandsGridProps {
  puzzle: StrandsPuzzle;
  showAnswers?: boolean;
  /** Enable interactive word-by-word reveal buttons below the grid */
  interactive?: boolean;
}

/** Build a lookup: "row-col" → { type, word } */
function buildCellMap(puzzle: StrandsPuzzle) {
  const map: Record<string, { type: "theme" | "spangram"; word: string }> = {};

  for (const coord of puzzle.spangramCoords) {
    map[`${coord[0]}-${coord[1]}`] = {
      type: "spangram",
      word: puzzle.spangram,
    };
  }

  for (const [word, coords] of Object.entries(puzzle.themeCoords)) {
    for (const coord of coords) {
      map[`${coord[0]}-${coord[1]}`] = { type: "theme", word };
    }
  }

  return map;
}

const CELL_BASE =
  "flex items-center justify-center rounded-md text-sm font-bold uppercase select-none aspect-square transition-all duration-300";

const CELL_DEFAULT = "bg-strands-grid text-foreground";

const CELL_THEME = "bg-strands-theme text-white scale-105";

const CELL_SPANGRAM = "bg-strands-spangram text-amber-950 scale-105";

export function StrandsGrid({
  puzzle,
  showAnswers = false,
  interactive = false,
}: StrandsGridProps) {
  const [revealedWords, setRevealedWords] = useState<Set<string>>(new Set());
  const cellMap = buildCellMap(puzzle);

  const toggleWord = (word: string) => {
    setRevealedWords((prev) => {
      const next = new Set(prev);
      if (next.has(word)) {
        next.delete(word);
      } else {
        next.add(word);
      }
      return next;
    });
  };

  const shouldHighlight = (key: string) => {
    if (showAnswers) return true;
    const cell = cellMap[key];
    if (!cell) return false;
    return revealedWords.has(cell.word);
  };

  return (
    <div className="mx-auto w-full max-w-xs">
      <div className="grid grid-cols-6 gap-1">
        {puzzle.startingBoard.map((row, rowIdx) =>
          row.split("").map((letter, colIdx) => {
            const key = `${rowIdx}-${colIdx}`;
            const cell = cellMap[key];
            const highlighted = shouldHighlight(key);

            let cellStyle = CELL_DEFAULT;
            if (highlighted && cell?.type === "spangram")
              cellStyle = CELL_SPANGRAM;
            else if (highlighted && cell?.type === "theme")
              cellStyle = CELL_THEME;

            return (
              <div key={key} className={`${CELL_BASE} ${cellStyle}`}>
                {letter}
              </div>
            );
          })
        )}
      </div>

      {/* Interactive word reveal buttons */}
      {interactive && (
        <div className="mt-5 space-y-3">
          <p className="text-center text-xs text-slate-400">
            Tap a word to reveal its position on the grid
          </p>

          {/* Spangram button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => toggleWord(puzzle.spangram)}
              aria-pressed={revealedWords.has(puzzle.spangram)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-all duration-200 ${
                revealedWords.has(puzzle.spangram)
                  ? "bg-strands-spangram text-amber-950 shadow-md shadow-strands-spangram/30"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {revealedWords.has(puzzle.spangram) ? (
                <EyeOff className="h-3 w-3" aria-hidden="true" />
              ) : (
                <Eye className="h-3 w-3" aria-hidden="true" />
              )}
              Spangram ({puzzle.spangram.length} letters)
            </button>
          </div>

          {/* Theme word buttons */}
          <div className="flex flex-wrap justify-center gap-1.5">
            {puzzle.themeWords.map((word) => (
              <button
                key={word}
                type="button"
                onClick={() => toggleWord(word)}
                aria-pressed={revealedWords.has(word)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-all duration-200 ${
                  revealedWords.has(word)
                    ? "bg-strands-theme text-white shadow-md shadow-strands-theme/30"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {revealedWords.has(word) ? (
                  <EyeOff className="h-3 w-3" aria-hidden="true" />
                ) : (
                  <Eye className="h-3 w-3" aria-hidden="true" />
                )}
                {word}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Static version that always shows answers */
export function StrandsGridStatic({ puzzle }: { puzzle: StrandsPuzzle }) {
  return <StrandsGrid puzzle={puzzle} showAnswers />;
}
