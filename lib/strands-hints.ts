/**
 * Derived hint helpers for Strands puzzles.
 *
 * Everything here is computed from the puzzle data we already store
 * (spangramCoords, themeWords, spangram, startingBoard) — no extra data
 * source needed. These power the progressive hint ladder so the homepage
 * can offer graduated nudges instead of a single "reveal the answer" jump.
 */

import type { StrandsPuzzle } from "@/types/strands";

/* ------------------------------------------------------------------ */
/*  Spangram direction (derived from its grid coordinates)             */
/* ------------------------------------------------------------------ */

export interface SpangramDirection {
  orientation: "vertical" | "horizontal" | "diagonal";
  /** Edge the spangram starts from: "top" | "bottom" | "left" | "right" */
  startEdge: string;
  /** Player-facing one-liner, e.g. "runs vertically, starting from the top". */
  description: string;
}

export function getSpangramDirection(puzzle: StrandsPuzzle): SpangramDirection {
  const coords = puzzle.spangramCoords;
  const numRows = puzzle.startingBoard.length || 8;
  const numCols = puzzle.startingBoard[0]?.length || 6;

  if (!coords || coords.length === 0) {
    return {
      orientation: "vertical",
      startEdge: "one side",
      description: "spans the board from one side to the other",
    };
  }

  const rows = coords.map((c) => c[0]);
  const cols = coords.map((c) => c[1]);
  const rowSpan = Math.max(...rows) - Math.min(...rows);
  const colSpan = Math.max(...cols) - Math.min(...cols);

  let orientation: SpangramDirection["orientation"];
  if (rowSpan >= colSpan * 2) orientation = "vertical";
  else if (colSpan >= rowSpan * 2) orientation = "horizontal";
  else orientation = "diagonal";

  const [r0, c0] = coords[0];
  let startEdge: string;
  if (r0 === 0) startEdge = "top";
  else if (r0 === numRows - 1) startEdge = "bottom";
  else if (c0 === 0) startEdge = "left";
  else if (c0 === numCols - 1) startEdge = "right";
  else startEdge = "the middle";

  const verb =
    orientation === "vertical"
      ? "runs vertically"
      : orientation === "horizontal"
        ? "runs horizontally"
        : "runs diagonally";

  return {
    orientation,
    startEdge,
    description: `${verb}, starting from the ${startEdge} of the grid`,
  };
}

/* ------------------------------------------------------------------ */
/*  Letter hints                                                       */
/* ------------------------------------------------------------------ */

/** First letter of each theme word, e.g. "B, C, M, S, S, S". */
export function getFirstLetters(words: string[]): string {
  return words.map((w) => (w[0] || "").toUpperCase()).join(", ");
}

/** First two letters of each theme word, e.g. "BR, CL, ME, ...". */
export function getFirstTwoLetters(words: string[]): string {
  return words.map((w) => w.slice(0, 2).toUpperCase()).join(", ");
}

/* ------------------------------------------------------------------ */
/*  Difficulty estimate (heuristic — derived, not from NYT)            */
/* ------------------------------------------------------------------ */

export interface Difficulty {
  level: 1 | 2 | 3;
  label: "Easy" | "Medium" | "Hard";
}

/**
 * Rough difficulty estimate from word count, average theme-word length and
 * spangram length. It is a heuristic, not an official rating — kept subtle
 * in the UI on purpose.
 */
export function getDifficulty(puzzle: StrandsPuzzle): Difficulty {
  const words = puzzle.themeWords;
  const avgLen =
    words.length > 0
      ? words.reduce((sum, w) => sum + w.length, 0) / words.length
      : 0;

  let score = 0;
  if (puzzle.spangram.length >= 11) score++;
  if (avgLen >= 6) score++;
  if (words.length >= 7) score++;

  if (score <= 0) return { level: 1, label: "Easy" };
  if (score === 1) return { level: 2, label: "Medium" };
  return { level: 3, label: "Hard" };
}
