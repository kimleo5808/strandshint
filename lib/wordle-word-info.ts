import {
  WORD_DEFINITIONS,
  WORDNET_LICENCE,
  type WordDefinition,
} from '@/data/word-definitions.generated'

export { WORDNET_LICENCE }
export type { WordDefinition }

/** Dictionary entry for a Wordle answer, or null when WordNet has no entry. */
export function getDefinition(word: string): WordDefinition | null {
  return WORD_DEFINITIONS[word.toUpperCase()] ?? null
}

const ALL_WORDS = Object.keys(WORD_DEFINITIONS)

export interface WordFamily {
  /** The shared tail, e.g. "IGHT" for LIGHT. */
  suffix: string
  /** Other words sharing that tail, excluding the answer itself. */
  siblings: string[]
}

/**
 * Words that differ from the answer only in their first letter.
 *
 * This is the shape behind most late-game losses: lock four letters, then find
 * that seven words still fit. Surfacing it per answer tells a reader whether
 * the day's puzzle was a genuine trap or whether they simply missed the word.
 */
export function getWordFamily(word: string): WordFamily | null {
  const upper = word.toUpperCase()
  if (upper.length !== 5) return null

  const suffix = upper.slice(1)

  const siblings = ALL_WORDS.filter(
    (candidate) => candidate !== upper && candidate.endsWith(suffix)
  ).sort()

  return { suffix, siblings }
}

/**
 * How exposed the answer was to a first-letter guessing game, used to phrase
 * the explanation rather than to score the puzzle.
 */
export function describeFamily(family: WordFamily | null): string | null {
  if (!family) return null

  const n = family.siblings.length

  if (n >= 5) {
    return `This is one of the trap shapes. Once the last four letters are locked, ${
      n + 1
    } words still fit, and each guess only tests one of them. Spend a turn on a word that tests several of the leading letters at once instead of guessing candidates one by one.`
  }

  if (n >= 2) {
    return `Locking the last four letters still leaves ${
      n + 1
    } candidates, so it is worth checking the remaining options before committing a guess.`
  }

  if (n === 1) {
    return `Only one other word shares this ending, so the last four letters all but settle the answer.`
  }

  return `No other common five-letter word ends this way, so pinning the last four letters settles it outright. Answers like this one reward spending an early guess on coverage rather than on a hunch.`
}
