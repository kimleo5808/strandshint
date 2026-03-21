import type { WordlePuzzle } from '@/types/wordle-hint'
import { getWordleData } from '@/lib/puzzle-kv'
import { cache } from 'react'

/** Get a puzzle by its date string (YYYY-MM-DD) */
export const getWordleByDate = cache(
  async (date: string): Promise<WordlePuzzle | undefined> => {
    const data = await getWordleData()
    return data.puzzles.find((p) => p.printDate === date)
  }
)

/** Get the latest/today's puzzle */
export const getLatestWordle = cache(
  async (): Promise<WordlePuzzle | undefined> => {
    const data = await getWordleData()
    if (data.puzzles.length === 0) return undefined
    return data.puzzles[data.puzzles.length - 1]
  }
)

/** Get yesterday's puzzle (second-to-last) */
export const getYesterdayWordle = cache(
  async (): Promise<WordlePuzzle | undefined> => {
    const data = await getWordleData()
    if (data.puzzles.length < 2) return undefined
    return data.puzzles[data.puzzles.length - 2]
  }
)

/** Get all puzzles, newest first */
export const getAllWordles = cache(async (): Promise<WordlePuzzle[]> => {
  const data = await getWordleData()
  return [...data.puzzles].reverse()
})

/** Get recent N puzzles, newest first */
export const getRecentWordles = cache(
  async (count: number = 7): Promise<WordlePuzzle[]> => {
    const data = await getWordleData()
    return [...data.puzzles].reverse().slice(0, count)
  }
)

/** Get puzzles for a specific month (YYYY-MM) */
export const getWordlesByMonth = cache(
  async (yearMonth: string): Promise<WordlePuzzle[]> => {
    const data = await getWordleData()
    return data.puzzles
      .filter((p) => p.printDate.startsWith(yearMonth))
      .reverse()
  }
)

/** Get all unique year-month strings available */
export const getWordleAvailableMonths = cache(async (): Promise<string[]> => {
  const data = await getWordleData()
  const months = new Set(data.puzzles.map((p) => p.printDate.slice(0, 7)))
  return Array.from(months).sort().reverse()
})

/** Get total puzzle count */
export const getWordleCount = cache(async (): Promise<number> => {
  const data = await getWordleData()
  return data.puzzles.length
})
