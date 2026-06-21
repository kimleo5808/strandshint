// Editorial content for the "Connections Purple Group, Explained" pillar page.
//
// The archetype frequencies come from scripts/classify-purple.mjs, which
// classifies the purple (categories[3]) group of every archived puzzle by its
// title. Worked examples are hand-picked from the archive and cited to a real
// puzzle # + date so the page carries first-party E-E-A-T.
//
// To refresh the numbers after the archive grows: `node scripts/classify-purple.mjs`.
import archetypeData from './purple-archetypes.json'

export interface WorkedExample {
  /** Sequential NYT puzzle number */
  puzzleId: number
  /** YYYY-MM-DD */
  date: string
  /** The real purple category title */
  categoryTitle: string
  /** The four purple words */
  words: string[]
}

export interface PurpleArchetype {
  /** Stable key, matches the classifier output */
  key: string
  /** Display name (H3) */
  name: string
  /** Lucide icon name, mapped in the card component */
  icon: string
  /** One-sentence "what is X" definition (GEO-quotable) */
  definition: string
  /** Short pattern shorthand shown under the title */
  pattern: string
  /** The worked example */
  example: WorkedExample
  /** Why it fools you */
  trap: string
  /** How the four words resolve */
  reveal: string
}

const counts = archetypeData.counts as Record<string, number>
export const PURPLE_SAMPLE_SIZE = archetypeData.sampleSize
export const PURPLE_DATE_RANGE = archetypeData.dateRange
export const PURPLE_GENERATED_AT = archetypeData.generatedAt

/** Frequency (count + %) for an archetype, computed from the live classifier. */
export function archetypeFrequency(key: string) {
  const count = counts[key] ?? 0
  return { count, pct: Math.round((count / PURPLE_SAMPLE_SIZE) * 100) }
}

/**
 * The 7 purple archetypes in teaching order (mechanical wordplay first, the
 * catch-all niche category last). This taxonomy is the page's unique asset.
 */
export const PURPLE_ARCHETYPES: PurpleArchetype[] = [
  {
    key: 'phrase-completion',
    name: 'Phrase Completion',
    icon: 'SquareDashedBottom',
    definition:
      'Every word completes the same phrase, usually by filling a blank like "___ OFFICE" or "WORD ___".',
    pattern: '___ + WORD  /  WORD + ___',
    example: {
      puzzleId: 936,
      date: '2025-11-13',
      categoryTitle: '___ OFFICE',
      words: ['BOX', 'MICROSOFT', 'OVAL', 'POST'],
    },
    trap:
      'The four words have nothing in common by meaning — OVAL is a shape, MICROSOFT is a tech company, POST is mail. Meaning-first thinking scatters them across the grid.',
    reveal:
      'Each one snaps onto the same trailing word: Box Office, Microsoft Office, Oval Office, Post Office.',
  },
  {
    key: 'hidden-words',
    name: 'Hidden Words',
    icon: 'Search',
    definition:
      'Each word secretly contains a smaller themed word — at the start, end, or buried inside.',
    pattern: 'small themed word hidden in each',
    example: {
      puzzleId: 934,
      date: '2025-11-18',
      categoryTitle: 'ENDING IN SYNONYMS FOR "LOCATION"',
      words: ['COMMONPLACE', 'NEEDLEPOINT', 'PARASITE', 'SUNSPOT'],
    },
    trap:
      'On the surface these look like a vocabulary list. Nothing links a parasite to a sunspot — until you stop reading them as whole words.',
    reveal:
      'Each ends in a synonym for location: commonPLACE, needlePOINT, paraSITE, sunSPOT.',
  },
  {
    key: 'homophones',
    name: 'Homophones & Rhymes',
    icon: 'Volume2',
    definition:
      'The words only connect when you say them out loud — they sound like a themed set but are spelled differently.',
    pattern: 'sounds like a themed set',
    example: {
      puzzleId: 947,
      date: '2025-11-20',
      categoryTitle: 'WORDS THAT SOUND LIKE TWO LETTERS',
      words: ['ANY', 'ARTY', 'DECAY', 'ESSAY'],
    },
    trap:
      'Read silently, these are ordinary words. The link is invisible on the page because it lives in the sound, not the spelling.',
    reveal:
      'Said aloud, each is two letters: ANY = "N-E", ARTY = "R-T", DECAY = "D-K", ESSAY = "S-A".',
  },
  {
    key: 'anagrams',
    name: 'Anagrams & Scrambles',
    icon: 'Shuffle',
    definition:
      'The letters rearrange into a themed word — or, in the purest case, into each other.',
    pattern: 'letters rearranged',
    example: {
      puzzleId: 1155,
      date: '2026-05-26',
      categoryTitle: 'ANAGRAMS',
      words: ['ENLIST', 'LISTEN', 'SILENT', 'TINSEL'],
    },
    trap:
      'These feel like they should split into different meanings — listen vs. enlist vs. tinsel — so you instinctively try to separate them.',
    reveal:
      'They are the same six letters in every order: E, I, L, N, S, T. The connection is the letter set itself.',
  },
  {
    key: 'letter-change',
    name: 'Add / Drop / Change a Letter',
    icon: 'Replace',
    definition:
      'Each word is one letter away from a member of a hidden themed set.',
    pattern: 'themed word ± one letter',
    example: {
      puzzleId: 939,
      date: '2025-11-19',
      categoryTitle: 'ORGAN PLUS A LETTER',
      words: ['COLONY', 'HEARTH', 'LUNGE', 'SKINK'],
    },
    trap:
      'They read as a real (if odd) group — a colony, a hearth, a skink lizard — so you never suspect a letter has been smuggled in.',
    reveal:
      'Drop the extra letter and each becomes a body organ: COLON(y), HEART(h), LUNG(e), SKIN(k).',
  },
  {
    key: 'before-after',
    name: 'Words Before or After a Common Word',
    icon: 'ArrowLeftRight',
    definition:
      'All four words precede or follow the same word to form a compound or phrase.',
    pattern: 'all share one neighbor word',
    example: {
      puzzleId: 1007,
      date: '2026-01-23',
      categoryTitle: 'WORDS BEFORE "LIGHT"',
      words: ['FLOOD', 'LIME', 'PILOT', 'TRAFFIC'],
    },
    trap:
      'Flood, lime, pilot and traffic look like they belong to four different real-world categories — weather, fruit, aviation, roads.',
    reveal:
      'Each takes the same partner word: floodLIGHT, limeLIGHT, pilot LIGHT, traffic LIGHT.',
  },
  {
    key: 'pop-culture',
    name: 'Hyper-Specific & Niche Categories',
    icon: 'Sparkles',
    definition:
      'Not wordplay at all — just an unusually narrow real category: a film series, a board game, a domain vocabulary.',
    pattern: 'a very specific real category',
    example: {
      puzzleId: 933,
      date: '2025-11-16',
      categoryTitle: 'WORDS ON MONOPOLY SQUARES',
      words: ['AVENUE', 'PARKING', 'RAILROAD', 'TAX'],
    },
    trap:
      'The words are common enough to seem to fit anywhere — avenue, parking, tax — so you keep trying to place them by general meaning.',
    reveal:
      'They are all spaces on a Monopoly board. Purple here punishes broad knowledge gaps, not wordplay blindness.',
  },
]

/** Operational trap-word checklist (featured-snippet ordered list). */
export const TRAP_WORD_CHECKLIST: { signal: string; why: string }[] = [
  {
    signal: 'Short, common words (HEAD, COLD, GOLD, LIGHT)',
    why: 'These are the favorite building blocks for phrase-completion and before/after purples.',
  },
  {
    signal: 'Words with two or more meanings',
    why: 'A double meaning lets the editors dangle a word in front of an easier group it does not belong to.',
  },
  {
    signal: 'A word that fits two groups at once',
    why: 'Assume it belongs to the harder group and build the easy group without it.',
  },
  {
    signal: 'Odd spellings or words that read strangely aloud',
    why: 'A clue to homophones or hidden words — the surface spelling is hiding the real link.',
  },
  {
    signal: 'A word one letter off from something familiar',
    why: 'SKINK is SKIN, HEARTH is HEART — add/drop-a-letter purples hide in near-misses.',
  },
  {
    signal: 'Proper nouns and brand names',
    why: 'Often the tell for a hyper-specific niche category rather than wordplay.',
  },
]

/** Step-by-step method for the "How to Solve" section. */
export const SOLVE_STEPS: { name: string; text: string }[] = [
  {
    name: 'Solve the other three groups first',
    text: 'Lock yellow, green, and blue with confidence. Purple borrows red herrings from the easier groups, so clearing them removes most of the misdirection.',
  },
  {
    name: 'Isolate the leftover four',
    text: 'Whatever remains after the first three groups is your purple — even if the connection is not yet obvious. Treat the four as a fixed set and study them together.',
  },
  {
    name: 'Run the archetype scan',
    text: 'Read the four aloud (homophones/rhymes), look inside them for smaller words (hidden words), test "+ word" on each (phrase completion), and check if they are one letter off something (add/drop a letter).',
  },
  {
    name: 'Switch from meaning to form',
    text: 'If no shared meaning appears, stop hunting for a category and look at the shape of the words — sound, spelling, letters. Roughly half of all purples are form tricks, not meaning.',
  },
  {
    name: 'Verify the partition before you submit',
    text: 'Confirm the four purple words leave a clean, sensible set for the other three groups. If removing one breaks an easier group, you have the wrong four.',
  },
]

/** FAQ (schema: FAQPage). */
export const PURPLE_FAQ: { question: string; answer: string }[] = [
  {
    question: 'Why is the purple group the hardest in Connections?',
    answer:
      'Purple is the difficulty-3 (hardest) category. It is tough because it usually relies on wordplay — hidden words, homophones, phrase completion — rather than a straightforward shared meaning, and the editors plant words that look like they belong to easier groups. Around half of purple groups are wordplay-based, so meaning-first thinking often fails.',
  },
  {
    question: 'Is the purple group always wordplay?',
    answer:
      'No, but most of the time. Purple frequently uses wordplay such as anagrams, hidden words, and "___ + word" patterns, yet some purple groups are simply very specific or niche categories. If the four leftover words share no obvious meaning, test a form-based trick — sound, spelling, or hidden words — before assuming it is a category.',
  },
  {
    question: 'Should I solve the purple group first or last?',
    answer:
      'Last. The reliable method is to lock yellow, green, and blue first, then let the remaining four words form purple by elimination. Solving the easy groups removes the red herrings that purple borrows, so the hardest group often solves itself once the other twelve are placed.',
  },
  {
    question: 'What does the purple category usually mean in Connections?',
    answer:
      'Purple signals the trickiest connection of the four, typically wordplay or a "loose" link. Common purple mechanics include words that complete a phrase, words containing a hidden word, homophones, and anagrams. The color is only revealed after you solve the group correctly.',
  },
  {
    question: 'How do I get better at solving purple?',
    answer:
      'Learn the recurring purple archetypes and practice spotting them. Read leftover words aloud for homophones, look inside them for hidden words, and test whether they all precede or follow a common word. Reviewing past puzzles in a Connections archive trains pattern recognition fast.',
  },
]
