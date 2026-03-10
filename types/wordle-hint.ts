/** A single daily Wordle puzzle answer record */
export interface WordlePuzzle {
  /** Puzzle number (sequential from launch day) */
  id: number
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
