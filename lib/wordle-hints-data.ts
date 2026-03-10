import type { WordleDataFile, WordlePuzzle } from '@/types/wordle-hint'
import puzzlesData from '@/data/wordle/puzzles.json'
import { cache } from 'react'

const data = puzzlesData as unknown as WordleDataFile

/** Get a puzzle by its date string (YYYY-MM-DD) */
export const getWordleByDate = cache(
  async (date: string): Promise<WordlePuzzle | undefined> => {
    return data.puzzles.find((p) => p.printDate === date)
  }
)

/** Get the latest/today's puzzle */
export const getLatestWordle = cache(
  async (): Promise<WordlePuzzle | undefined> => {
    if (data.puzzles.length === 0) return undefined
    return data.puzzles[data.puzzles.length - 1]
  }
)

/** Get yesterday's puzzle (second-to-last) */
export const getYesterdayWordle = cache(
  async (): Promise<WordlePuzzle | undefined> => {
    if (data.puzzles.length < 2) return undefined
    return data.puzzles[data.puzzles.length - 2]
  }
)

/** Get all puzzles, newest first */
export const getAllWordles = cache(async (): Promise<WordlePuzzle[]> => {
  return [...data.puzzles].reverse()
})

/** Get recent N puzzles, newest first */
export const getRecentWordles = cache(
  async (count: number = 7): Promise<WordlePuzzle[]> => {
    return [...data.puzzles].reverse().slice(0, count)
  }
)

/** Get puzzles for a specific month (YYYY-MM) */
export const getWordlesByMonth = cache(
  async (yearMonth: string): Promise<WordlePuzzle[]> => {
    return data.puzzles
      .filter((p) => p.printDate.startsWith(yearMonth))
      .reverse()
  }
)

/** Get all unique year-month strings available */
export const getWordleAvailableMonths = cache(async (): Promise<string[]> => {
  const months = new Set(data.puzzles.map((p) => p.printDate.slice(0, 7)))
  return Array.from(months).sort().reverse()
})

/** Get total puzzle count */
export const getWordleCount = cache(async (): Promise<number> => {
  return data.puzzles.length
})
