// Classify the purple (hardest) group of every archived Connections puzzle into
// one of 7 wordplay archetypes, using heuristics over the category TITLE.
//
// Purple = categories[3]. The fallback JSON stores difficulty:0 for every
// category, but the NYT data is ordered yellow→green→blue→purple, so the 4th
// category is always purple.
//
// Output: data/connections/purple-archetypes.json
//   { generatedAt, sampleSize, dateRange, counts, examples }
//
// Run: node scripts/classify-purple.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const data = JSON.parse(
  readFileSync(join(ROOT, 'data/connections/puzzles.json'), 'utf8')
)

/** The 7 archetypes, in display order. */
const ARCHETYPES = [
  'phrase-completion',
  'hidden-words',
  'homophones',
  'anagrams',
  'letter-change',
  'before-after',
  'pop-culture',
]

/**
 * Classify a purple category by its title. Order matters: the most specific /
 * least ambiguous signals are tested first. Returns an archetype key.
 */
function classify(title) {
  const t = title.toUpperCase()

  // "___ + WORD" or "WORD + ___" — the title literally contains a blank.
  if (t.includes('___') || t.includes('___')) return 'phrase-completion'

  // Anagrams / scrambles
  if (/\bANAGRAM|\bSCRAMBLED?\b|REARRANGED?|MIXED-UP|MIXED UP/.test(t))
    return 'anagrams'

  // Add / drop / change a letter — "PLUS S", "MINUS LAST LETTER", "WITHOUT A", etc.
  if (
    /\bPLUS\b|\bMINUS\b|\bADD(ED|ING)?\b|\bDROP(PED|PING)?\b|WITHOUT (A |AN |THE )?(LAST |FIRST )?(LETTER|"?[A-Z]"?)|MISSING (A |AN |THE )?LETTER|CHANGE[DS]? (A |ONE )?LETTER|SWAP(PED)? (A |ONE )?LETTER/.test(
      t
    )
  )
    return 'letter-change'

  // Hidden words & structural extraction — "ENDING IN", "STARTING WITH",
  // "CONTAINING", "BACKWARDS/REVERSED", "WORDS FORMED BY", "FIRST/SECOND WORDS
  // OF/IN", "WITH A ___ INSIDE".
  if (
    /HIDDEN|ENDING IN|END(S|ING)? WITH|STARTING WITH|START(S|ING)? WITH|CONTAIN(S|ING)?|INSIDE|BURIED|WITHIN|BACKWARDS?|REVERSED?|FORMED BY|FORMED FROM|(FIRST|SECOND|LAST) WORDS? (IN|OF)|INCLUDE THEIR/.test(
      t
    )
  )
    return 'hidden-words'

  // Homophones & rhymes — "SOUND LIKE", "HOMOPHONE", "RHYME", "SAY ... ALOUD".
  if (
    /SOUND(S|ED)? LIKE|HOMOPHONE|HETERONYM|RHYME[DS]?|RHYMES? (FOR|WITH)|SAID ALOUD|SAY .* ALOUD|PRONOUNCED|PHONETIC/.test(
      t
    )
  )
    return 'homophones'

  // Words before/after a common word — "___ BOARD", "WORDS BEFORE/AFTER",
  // "FOLLOWED BY", "PRECEDED BY".
  if (
    /BEFORE |AFTER |FOLLOWED BY|PRECEDED BY|FOLLOW(S|ED|ING)?\b|PRECEDE[DS]?\b|GO(ES)? WITH\b|___ /.test(
      t
    )
  )
    return 'before-after'

  // Pop-culture / niche specifics — proper nouns, franchises, awards, brands.
  // Heuristic: title carries a recognizable proper-noun signal OR a possessive
  // ("'S") OR award/franchise words.
  if (
    /MOVIE|FILM|SONG|ALBUM|BAND|TV|SHOW|SERIES|CHARACTER|BRAND|AWARD|GRAMMY|OSCAR|DISNEY|MARVEL|POK[EÉ]MON|NOMINEES?|STARRING|ACTOR|ACTRESS|'S\b/.test(
      t
    )
  )
    return 'pop-culture'

  // Default: treat anything left as pop-culture / niche specifics, since those
  // are the catch-all "very specific category" purples.
  return 'pop-culture'
}

const counts = Object.fromEntries(ARCHETYPES.map((a) => [a, 0]))
const examples = Object.fromEntries(ARCHETYPES.map((a) => [a, []]))

for (const p of data.puzzles) {
  const purple = p.categories[3]
  if (!purple) continue
  const key = classify(purple.title)
  counts[key]++
  if (examples[key].length < 4) {
    examples[key].push({
      id: p.id,
      date: p.printDate,
      title: purple.title,
      words: purple.cards.map((c) => c.content),
    })
  }
}

const dates = data.puzzles.map((p) => p.printDate).sort()

const out = {
  generatedAt: new Date().toISOString().slice(0, 10),
  sampleSize: data.puzzles.length,
  dateRange: { from: dates[0], to: dates[dates.length - 1] },
  counts,
  examples,
}

writeFileSync(
  join(ROOT, 'data/connections/purple-archetypes.json'),
  JSON.stringify(out, null, 2) + '\n'
)

// Console report
console.log(`Classified ${data.puzzles.length} purple groups (${out.dateRange.from} → ${out.dateRange.to}):\n`)
const sorted = ARCHETYPES.map((a) => [a, counts[a]]).sort((x, y) => y[1] - x[1])
for (const [a, c] of sorted) {
  const pct = ((c / data.puzzles.length) * 100).toFixed(1)
  console.log(`  ${a.padEnd(20)} ${String(c).padStart(3)}  ${pct}%`)
}
console.log('\nWrote data/connections/purple-archetypes.json')
