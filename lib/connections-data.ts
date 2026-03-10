import type { ConnectionsDataFile, ConnectionsPuzzle } from '@/types/connections'
import puzzlesData from '@/data/connections/puzzles.json'
import { cache } from 'react'

const data = puzzlesData as unknown as ConnectionsDataFile

/** Get a puzzle by its date string (YYYY-MM-DD) */
export const getConnectionsByDate = cache(
  async (date: string): Promise<ConnectionsPuzzle | undefined> => {
    return data.puzzles.find((p) => p.printDate === date)
  }
)

/** Get the latest/today's puzzle */
export const getLatestConnections = cache(
  async (): Promise<ConnectionsPuzzle | undefined> => {
    if (data.puzzles.length === 0) return undefined
    return data.puzzles[data.puzzles.length - 1]
  }
)

/** Get yesterday's puzzle (second-to-last) */
export const getYesterdayConnections = cache(
  async (): Promise<ConnectionsPuzzle | undefined> => {
    if (data.puzzles.length < 2) return undefined
    return data.puzzles[data.puzzles.length - 2]
  }
)

/** Get all puzzles, newest first */
export const getAllConnections = cache(async (): Promise<ConnectionsPuzzle[]> => {
  return [...data.puzzles].reverse()
})

/** Get recent N puzzles, newest first */
export const getRecentConnections = cache(
  async (count: number = 7): Promise<ConnectionsPuzzle[]> => {
    return [...data.puzzles].reverse().slice(0, count)
  }
)

/** Get puzzles for a specific month (YYYY-MM) */
export const getConnectionsByMonth = cache(
  async (yearMonth: string): Promise<ConnectionsPuzzle[]> => {
    return data.puzzles
      .filter((p) => p.printDate.startsWith(yearMonth))
      .reverse()
  }
)

/** Get all unique year-month strings available */
export const getConnectionsAvailableMonths = cache(async (): Promise<string[]> => {
  const months = new Set(data.puzzles.map((p) => p.printDate.slice(0, 7)))
  return Array.from(months).sort().reverse()
})

/** Get total puzzle count */
export const getConnectionsCount = cache(async (): Promise<number> => {
  return data.puzzles.length
})
