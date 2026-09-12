/** A coordinate on the 6×8 Strands letter grid [row, col] */
export type GridCoord = [number, number];

/** A complete Strands puzzle for a single day */
export interface StrandsPuzzle {
  /**
   * Puzzle number as shown in the game (sequential from launch day).
   * Derived in lib/puzzle-number.ts — NYT's API returns an internal key
   * here, not this number.
   */
  id: number;
  /** NYT's internal API id, kept for tracing when it differs from `id`. */
  nytId?: number;
  /** Date string in YYYY-MM-DD format */
  printDate: string;
  /** Editor name */
  editor: string;
  /** Constructor(s) name */
  constructors: string;
  /** Theme clue shown to players (e.g. "Mark my words") */
  clue: string;
  /** The Spangram word that spans the board */
  spangram: string;
  /** Array of theme words (excluding spangram) */
  themeWords: string[];
  /** 6×8 letter grid as 8 strings of 6 characters each */
  startingBoard: string[];
  /** Coordinates for each theme word: { "WORD": [[row,col], ...] } */
  themeCoords: Record<string, GridCoord[]>;
  /** Coordinates for the Spangram word: [[row,col], ...] */
  spangramCoords: GridCoord[];
}

/** Data file structure stored in data/strands/puzzles.json */
export interface StrandsDataFile {
  lastUpdated: string;
  puzzles: StrandsPuzzle[];
}
