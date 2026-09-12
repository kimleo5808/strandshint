/** A single daily Wordle puzzle answer record */
export interface WordlePuzzle {
  /**
   * Puzzle number as shown in the game (sequential from launch day).
   * Derived in lib/puzzle-number.ts — NYT's API returns an internal key
   * here, not this number.
   */
  id: number

  /** NYT's internal API id, kept for tracing when it differs from `id`. */
  nytId?: number
  /** NYT's own puzzle counter. Authoritative for `id` when present. */
  daysSinceLaunch?: number

  /** Date string in YYYY-MM-DD format */
  printDate: string
  /** The 5-letter answer word (uppercase) */
  answer: string
  /** Editor name */
  editor: string
}

/** Data file structure stored in data/wordle/puzzles.json */
export interface WordleDataFile {
  lastUpdated: string
  puzzles: WordlePuzzle[]
}
