import type { ConnectionsPuzzle } from '@/types/connections'
import { getConnectionsData } from '@/lib/puzzle-kv'
import { cache } from 'react'

/** Get a puzzle by its date string (YYYY-MM-DD) */
export const getConnectionsByDate = cache(
  async (date: string): Promise<ConnectionsPuzzle | undefined> => {
    const data = await getConnectionsData()
    return data.puzzles.find((p) => p.printDate === date)
  }
)

/** Get the latest/today's puzzle */
export const getLatestConnections = cache(
  async (): Promise<ConnectionsPuzzle | undefined> => {
    const data = await getConnectionsData()
    if (data.puzzles.length === 0) return undefined
    return data.puzzles[data.puzzles.length - 1]
  }
)

/** Get yesterday's puzzle (second-to-last) */
export const getYesterdayConnections = cache(
  async (): Promise<ConnectionsPuzzle | undefined> => {
    const data = await getConnectionsData()
    if (data.puzzles.length < 2) return undefined
    return data.puzzles[data.puzzles.length - 2]
  }
)

/** Get all puzzles, newest first */
export const getAllConnections = cache(async (): Promise<ConnectionsPuzzle[]> => {
  const data = await getConnectionsData()
  return [...data.puzzles].reverse()
})

/** Get recent N puzzles, newest first */
export const getRecentConnections = cache(
  async (count: number = 7): Promise<ConnectionsPuzzle[]> => {
    const data = await getConnectionsData()
    return [...data.puzzles].reverse().slice(0, count)
  }
)

/** Get puzzles for a specific month (YYYY-MM) */
export const getConnectionsByMonth = cache(
  async (yearMonth: string): Promise<ConnectionsPuzzle[]> => {
    const data = await getConnectionsData()
    return data.puzzles
      .filter((p) => p.printDate.startsWith(yearMonth))
      .reverse()
  }
)

/** Get all unique year-month strings available */
export const getConnectionsAvailableMonths = cache(async (): Promise<string[]> => {
  const data = await getConnectionsData()
  const months = new Set(data.puzzles.map((p) => p.printDate.slice(0, 7)))
  return Array.from(months).sort().reverse()
})

/** Get total puzzle count */
export const getConnectionsCount = cache(async (): Promise<number> => {
  const data = await getConnectionsData()
  return data.puzzles.length
})
