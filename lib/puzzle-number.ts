/**
 * Derives the puzzle number players actually see.
 *
 * NYT's puzzle APIs return an `id` field that is an internal database key, not
 * the number printed in the game. They diverge badly: on 2026-09-12 the API
 * reported Wordle id=2349 / Strands id=1112 / Connections id=1285, while the
 * games themselves showed #1911, #923 and #1189. Wordle's id is not even
 * monotonic (2026-09-01 returns 4774, eleven days before 2349).
 *
 * Only Wordle exposes the real number, as `days_since_launch`. For Strands and
 * Connections it has to be derived from the print date.
 *
 * Day 1 of each game. Verified against live puzzles on 2026-09-12:
 *   Wordle      #1911  (matches the API's own days_since_launch)
 *   Strands     #923
 *   Connections #1189
 * The Wordle epoch is back-solved from days_since_launch and cross-checked on
 * three dates spanning ten months, so it stays in step with NYT's counter
 * rather than with the commonly cited 2021-06-19 launch date.
 */

const DAY_MS = 86_400_000

export type PuzzleGame = 'wordle' | 'strands' | 'connections'

const EPOCH: Record<PuzzleGame, string> = {
  wordle: '2021-06-20',
  strands: '2024-03-04',
  connections: '2023-06-12',
}

/** Parse YYYY-MM-DD as UTC midnight, so DST never shifts the day count. */
function utcDay(date: string): number {
  const year = Number(date.slice(0, 4))
  const month = Number(date.slice(5, 7))
  const day = Number(date.slice(8, 10))

  if (!year || !month || !day) return NaN

  return Date.UTC(year, month - 1, day)
}

/**
 * Puzzle number for a print date, or null if the date is unparseable or falls
 * before the game launched. Callers fall back to the raw id in that case.
 */
export function puzzleNumberFor(game: PuzzleGame, printDate: string): number | null {
  const start = utcDay(EPOCH[game])
  const target = utcDay(printDate)

  if (Number.isNaN(target)) return null

  const number = Math.round((target - start) / DAY_MS) + 1

  return number > 0 ? number : null
}
