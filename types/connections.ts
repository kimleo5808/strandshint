/** Difficulty level for a Connections category */
export type ConnectionsDifficulty = 0 | 1 | 2 | 3;

/** A single card (word) in a Connections category */
export interface ConnectionsCard {
  content: string;
  position: number;
}

/** A Connections category group */
export interface ConnectionsCategory {
  /** Category title / theme */
  title: string;
  /** The 4 cards belonging to this category */
  cards: ConnectionsCard[];
  /**
   * Difficulty level:
   * 0 = Yellow (easiest)
   * 1 = Green
   * 2 = Blue
   * 3 = Purple (hardest)
   */
  difficulty: ConnectionsDifficulty;
}

/** A complete Connections puzzle for a single day */
export interface ConnectionsPuzzle {
  /** Puzzle number (sequential) */
  id: number;
  /** Date string in YYYY-MM-DD format */
  printDate: string;
  /** Editor name */
  editor: string;
  /** The 4 categories, sorted by difficulty (0→3) */
  categories: ConnectionsCategory[];
}

/** Data file structure stored in data/connections/puzzles.json */
export interface ConnectionsDataFile {
  lastUpdated: string;
  puzzles: ConnectionsPuzzle[];
}

/** Color metadata for each difficulty level */
export const DIFFICULTY_COLORS = {
  0: {
    label: 'Yellow',
    bg: 'bg-yellow-400',
    text: 'text-yellow-900',
    border: 'border-yellow-400',
    light: 'bg-yellow-50 border-yellow-200',
    badge: 'bg-yellow-400 text-yellow-900',
  },
  1: {
    label: 'Green',
    bg: 'bg-green-500',
    text: 'text-green-900',
    border: 'border-green-500',
    light: 'bg-green-50 border-green-200',
    badge: 'bg-green-500 text-white',
  },
  2: {
    label: 'Blue',
    bg: 'bg-blue-500',
    text: 'text-blue-900',
    border: 'border-blue-500',
    light: 'bg-blue-50 border-blue-200',
    badge: 'bg-blue-500 text-white',
  },
  3: {
    label: 'Purple',
    bg: 'bg-purple-600',
    text: 'text-purple-900',
    border: 'border-purple-600',
    light: 'bg-purple-50 border-purple-200',
    badge: 'bg-purple-600 text-white',
  },
} as const satisfies Record<ConnectionsDifficulty, object>
