import type { StrandsPuzzle } from "@/types/strands";
import { getStrandsData } from "@/lib/puzzle-kv";
import { cache } from "react";

/** Get a puzzle by its date string (YYYY-MM-DD) */
export const getPuzzleByDate = cache(
  async (date: string): Promise<StrandsPuzzle | undefined> => {
    const data = await getStrandsData();
    return data.puzzles.find((p) => p.printDate === date);
  }
);

/** Get the latest/today's puzzle */
export const getLatestPuzzle = cache(
  async (): Promise<StrandsPuzzle | undefined> => {
    const data = await getStrandsData();
    if (data.puzzles.length === 0) return undefined;
    return data.puzzles[data.puzzles.length - 1];
  }
);

/** Get all puzzles, newest first */
export const getAllPuzzles = cache(async (): Promise<StrandsPuzzle[]> => {
  const data = await getStrandsData();
  return [...data.puzzles].reverse();
});

/** Get recent N puzzles, newest first */
export const getRecentPuzzles = cache(
  async (count: number = 7): Promise<StrandsPuzzle[]> => {
    const data = await getStrandsData();
    return [...data.puzzles].reverse().slice(0, count);
  }
);

/** Get puzzles for a specific month (YYYY-MM) */
export const getPuzzlesByMonth = cache(
  async (yearMonth: string): Promise<StrandsPuzzle[]> => {
    const data = await getStrandsData();
    return data.puzzles
      .filter((p) => p.printDate.startsWith(yearMonth))
      .reverse();
  }
);

/** Get all unique year-month strings available */
export const getAvailableMonths = cache(async (): Promise<string[]> => {
  const data = await getStrandsData();
  const months = new Set(data.puzzles.map((p) => p.printDate.slice(0, 7)));
  return Array.from(months).sort().reverse();
});

/** Get total puzzle count */
export const getPuzzleCount = cache(async (): Promise<number> => {
  const data = await getStrandsData();
  return data.puzzles.length;
});

/** Get the last updated timestamp */
export const getLastUpdated = cache(async (): Promise<string> => {
  const data = await getStrandsData();
  return data.lastUpdated;
});

/** Get the second-to-last puzzle ("yesterday's" puzzle) */
export const getYesterdayPuzzle = cache(
  async (): Promise<StrandsPuzzle | undefined> => {
    const data = await getStrandsData();
    if (data.puzzles.length < 2) return undefined;
    return data.puzzles[data.puzzles.length - 2];
  }
);

/** Get all puzzles as raw array (oldest first) for stats computation */
export const getAllPuzzlesRaw = cache(async (): Promise<StrandsPuzzle[]> => {
  const data = await getStrandsData();
  return data.puzzles;
});
