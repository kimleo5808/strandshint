/* ------------------------------------------------------------------ */
/*  Per-word-length visual theme, unique sections, FAQ, and layout     */
/* ------------------------------------------------------------------ */

export type DifficultyTier = "beginner" | "intermediate" | "advanced" | "master";

export type TierTheme = {
  tier: DifficultyTier;
  label: string;
  color: string;            // primary accent (Tailwind color name)
  bgGradient: string;       // gradient for game section
  borderColor: string;      // card border
  badgeBg: string;          // badge / pill background
  badgeText: string;        // badge text
  iconColor: string;        // icon accent
  accentRing: string;       // focus ring
  sectionBg: string;        // alternating section bg
};

export type UniqueSection = {
  id: string;
  heading: string;
  description: string;
  layout: "table" | "cards" | "list" | "grid" | "comparison" | "reference";
  data: Record<string, unknown>;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type LetterGameConfig = {
  wordLength: number;
  tier: DifficultyTier;
  theme: TierTheme;
  difficultyScore: number;       // 1-10
  wordPoolSize: string;          // e.g. "~4,000"
  avgSolveGuesses: string;       // e.g. "2-4"
  doubleLettterPct: string;      // e.g. "~15%"
  targetAudience: string;
  uniqueSections: UniqueSection[];
  faq: FaqItem[];
  recommendNext: number;         // suggest this word length as "next step"
  relatedTools: { name: string; href: string; description: string }[];
};

/* ---- Tier Themes ------------------------------------------------- */

const BEGINNER_THEME: TierTheme = {
  tier: "beginner",
  label: "Beginner Friendly",
  color: "sky",
  bgGradient: "from-white to-sky-50/40 dark:from-zinc-900 dark:to-sky-950/20",
  borderColor: "border-sky-200/70 dark:border-sky-900/40",
  badgeBg: "bg-sky-100 dark:bg-sky-900/40",
  badgeText: "text-sky-700 dark:text-sky-300",
  iconColor: "text-sky-500",
  accentRing: "ring-sky-500/20",
  sectionBg: "bg-sky-50/50 dark:bg-sky-950/10",
};

const INTERMEDIATE_THEME: TierTheme = {
  tier: "intermediate",
  label: "Intermediate",
  color: "emerald",
  bgGradient: "from-white to-emerald-50/40 dark:from-zinc-900 dark:to-emerald-950/20",
  borderColor: "border-emerald-200/70 dark:border-emerald-900/40",
  badgeBg: "bg-emerald-100 dark:bg-emerald-900/40",
  badgeText: "text-emerald-700 dark:text-emerald-300",
  iconColor: "text-emerald-500",
  accentRing: "ring-emerald-500/20",
  sectionBg: "bg-emerald-50/50 dark:bg-emerald-950/10",
};

const ADVANCED_THEME: TierTheme = {
  tier: "advanced",
  label: "Advanced",
  color: "violet",
  bgGradient: "from-white to-violet-50/40 dark:from-zinc-900 dark:to-violet-950/20",
  borderColor: "border-violet-200/70 dark:border-violet-900/40",
  badgeBg: "bg-violet-100 dark:bg-violet-900/40",
  badgeText: "text-violet-700 dark:text-violet-300",
  iconColor: "text-violet-500",
  accentRing: "ring-violet-500/20",
  sectionBg: "bg-violet-50/50 dark:bg-violet-950/10",
};

const MASTER_THEME: TierTheme = {
  tier: "master",
  label: "Master Level",
  color: "amber",
  bgGradient: "from-white to-amber-50/40 dark:from-zinc-900 dark:to-amber-950/20",
  borderColor: "border-amber-200/70 dark:border-amber-900/40",
  badgeBg: "bg-amber-100 dark:bg-amber-900/40",
  badgeText: "text-amber-700 dark:text-amber-300",
  iconColor: "text-amber-500",
  accentRing: "ring-amber-500/20",
  sectionBg: "bg-amber-50/50 dark:bg-amber-950/10",
};

/* ---- Per-Word-Length Configs -------------------------------------- */

export const LETTER_GAME_CONFIGS: Record<number, LetterGameConfig> = {
  /* ============================================================== */
  /*  4-LETTER — Beginner                                           */
  /* ============================================================== */
  4: {
    wordLength: 4,
    tier: "beginner",
    theme: BEGINNER_THEME,
    difficultyScore: 2,
    wordPoolSize: "~4,000",
    avgSolveGuesses: "2-4",
    doubleLettterPct: "~15%",
    targetAudience: "New players, kids, quick daily practice",
    recommendNext: 5,
    relatedTools: [
      { name: "Word Finder", href: "/word-finder", description: "Find 4-letter words by pattern" },
      { name: "Anagram Solver", href: "/anagram-solver", description: "Unscramble 4-letter combos" },
    ],
    uniqueSections: [
      {
        id: "word-families",
        heading: "4-Letter Word Families",
        description: "Complete word families grouped by ending pattern — memorize these to solve faster",
        layout: "grid",
        data: {
          families: [
            { pattern: "-ACK", words: ["BACK", "HACK", "JACK", "LACK", "PACK", "RACK", "TACK"], count: 7, tip: "Very common in Wordle. If you see A and K confirmed, try this family first." },
            { pattern: "-ANE", words: ["BANE", "CANE", "DANE", "LANE", "MANE", "PANE", "SANE", "VANE", "WANE"], count: 9, tip: "One of the largest 4-letter word families in English." },
            { pattern: "-ATE", words: ["BATE", "DATE", "FATE", "GATE", "HATE", "LATE", "MATE", "RATE"], count: 8, tip: "High-frequency ending. SLATE is a top 5-letter starter partly because of this pattern." },
            { pattern: "-EAL", words: ["DEAL", "HEAL", "MEAL", "PEAL", "REAL", "SEAL", "TEAL", "VEAL", "ZEAL"], count: 9, tip: "EA is the most common vowel pair in 4-letter words." },
            { pattern: "-INE", words: ["DINE", "FINE", "LINE", "MINE", "NINE", "PINE", "VINE", "WINE"], count: 8, tip: "Silent-E pattern. If you confirm I and E, check this family." },
            { pattern: "-OOK", words: ["BOOK", "COOK", "HOOK", "LOOK", "NOOK", "ROOK", "TOOK"], count: 7, tip: "Double-O words are often overlooked — literally." },
          ],
        },
      },
      {
        id: "quick-solve-stats",
        heading: "Quick Solve Statistics",
        description: "How fast can you solve 4-letter Wordle? Here's what the data shows",
        layout: "comparison",
        data: {
          stats: [
            { label: "Average guesses to solve", value: "3.2", context: "vs 3.8 for 5-letter Wordle" },
            { label: "Chance of solving in 2 guesses", value: "~12%", context: "Much higher than longer formats" },
            { label: "Words with no repeated letters", value: "~85%", context: "Most 4-letter words use 4 unique letters" },
            { label: "Most common starting letter", value: "S", context: "Followed by C, B, P, and T" },
            { label: "Most common ending letter", value: "E", context: "Silent-E patterns are extremely frequent" },
          ],
        },
      },
    ],
    faq: [
      { question: "What are the easiest 4-letter words to guess in Wordle?", answer: "Common everyday words like SALE, TIRE, COME, HAND, and FIRE are among the easiest because they use high-frequency letters. Words with unusual letters like Z, X, Q, or J (e.g., JAZZ, JINX) are much harder to guess." },
      { question: "How many 4-letter words are in the English language?", answer: "There are approximately 4,000 common 4-letter English words, though the exact number depends on which dictionary you use. The Wordle game uses a curated subset of these as possible answers." },
      { question: "Is 4-letter Wordle easier than 5-letter Wordle?", answer: "Yes, significantly. With fewer possible answers (~4,000 vs ~2,300 curated answers for 5-letter) and shorter words, most 4-letter games are solved in 2-4 guesses compared to 3-5 for classic Wordle." },
      { question: "What is the best first guess for 4-letter Wordle?", answer: "SALE and TIRE are among the strongest openers. SALE covers S, A, L, E — four of the most frequent letters in 4-letter words. TIRE covers T, I, R, E. Together they test 7 high-value letters in just 2 guesses." },
      { question: "Can I play 4-letter Wordle unlimited times?", answer: "Yes, our 4-letter Wordle game offers unlimited plays with no daily limit. Each game generates a new random word from the complete word pool, so you can practice as much as you want." },
      { question: "What percentage of 4-letter words have double letters?", answer: "About 15% of 4-letter words contain a repeated letter (like BOOK, DEED, SASS, or NOON). This is lower than longer word formats where double letters become increasingly common." },
    ],
  },

  /* ============================================================== */
  /*  5-LETTER — Beginner                                           */
  /* ============================================================== */
  5: {
    wordLength: 5,
    tier: "beginner",
    theme: BEGINNER_THEME,
    difficultyScore: 4,
    wordPoolSize: "~2,300 answers",
    avgSolveGuesses: "3-5",
    doubleLettterPct: "~10-15%",
    targetAudience: "Everyone — the classic Wordle experience",
    recommendNext: 6,
    relatedTools: [
      { name: "Wordle Solver", href: "/wordle-solver", description: "Get optimal next guesses" },
      { name: "Word Finder", href: "/word-finder", description: "Search by letter pattern" },
    ],
    uniqueSections: [
      {
        id: "opening-science",
        heading: "The Science Behind Wordle's Best Opening Words",
        description: "Data-driven analysis of why certain first guesses outperform others",
        layout: "table",
        data: {
          columns: ["Word", "Unique Letters", "Vowels", "Top-Freq Letters", "Info Score", "Why It Works"],
          rows: [
            ["CRANE", "5", "2 (A,E)", "5/5", "9.8/10", "Covers the #1 vowel (E), #2 vowel (A), and top consonants (R, N, C). Statistically the best single opener."],
            ["SLATE", "5", "2 (A,E)", "5/5", "9.6/10", "Tests S (most common first letter), L, A, T, E — all in the top 8 most frequent letters."],
            ["ADIEU", "5", "4 (A,I,E,U)", "3/5", "8.5/10", "Maps 4 of 5 vowels instantly. Weaker on consonants but reveals the word's vowel skeleton."],
            ["RAISE", "5", "3 (A,I,E)", "5/5", "9.5/10", "Three vowels plus R and S — combines vowel mapping with top consonant coverage."],
            ["STARE", "5", "2 (A,E)", "5/5", "9.4/10", "S, T, A, R, E are the 5 most frequent letters overall in the Wordle answer list."],
          ],
        },
      },
      {
        id: "position-frequency",
        heading: "Letter Frequency by Position",
        description: "Which letters appear most often in each of the 5 positions? This table gives you a strategic edge",
        layout: "table",
        data: {
          columns: ["Position", "#1 Letter", "#2 Letter", "#3 Letter", "#4 Letter", "#5 Letter"],
          rows: [
            ["1st letter", "S (15.5%)", "C (8.4%)", "B (6.8%)", "T (6.7%)", "P (6.1%)"],
            ["2nd letter", "A (15.3%)", "O (13.6%)", "R (9.4%)", "E (8.7%)", "I (8.5%)"],
            ["3rd letter", "A (13.1%)", "I (10.5%)", "O (9.7%)", "R (8.7%)", "N (7.4%)"],
            ["4th letter", "E (14.8%)", "N (7.3%)", "S (6.9%)", "A (6.6%)", "L (6.5%)"],
            ["5th letter", "E (18.9%)", "Y (12.0%)", "T (8.1%)", "R (7.3%)", "S (5.5%)"],
          ],
          insight: "Notice how S dominates position 1, vowels dominate positions 2-3, and E dominates position 5. This is why STARE and CRANE work so well — they place high-frequency letters in their most common positions.",
        },
      },
    ],
    faq: [
      { question: "What is the single best starting word for Wordle?", answer: "Based on information theory analysis, CRANE is widely considered the single best starting word. It covers E (most common letter), A (2nd most common), and top consonants R, N, C. However, SLATE, RAISE, and STARE are nearly as effective." },
      { question: "How many possible answers does Wordle have?", answer: "The original NYT Wordle has approximately 2,300 curated answer words. There's also an extended list of ~10,000 accepted guesses (words the game recognizes but won't use as answers). Our unlimited version draws from the full pool." },
      { question: "Is it better to use a fixed opening word every game?", answer: "Yes, for consistency. Using the same strong opener (like CRANE) every game lets you develop pattern recognition for common second-guess scenarios. Top players almost always use a fixed opening strategy." },
      { question: "Should I use two fixed opening words?", answer: "A two-word opening like CRANE + DOUBT tests 10 unique letters in 2 guesses. This is an excellent strategy — by guess 3, you typically know enough to solve. The tradeoff is less flexibility, but the information gain is very high." },
      { question: "How many guesses do most people need to solve Wordle?", answer: "The average Wordle player solves in about 4 guesses. Experienced players average 3.5-3.8 guesses. Solving in 2 guesses happens about 3-5% of the time. Solving in 1 guess (without cheating) is roughly 1 in 2,300." },
      { question: "Why is hard mode different from normal mode?", answer: "In hard mode, any revealed hints must be used in subsequent guesses — green letters must stay in position, yellow letters must be reused. This prevents 'exploratory' guesses that test new letters, making the game harder but also more educational." },
      { question: "What makes 5-letter Wordle the 'classic' format?", answer: "The original Wordle game created by Josh Wardle in 2021 used 5-letter words, which hit a sweet spot — long enough for real strategy, short enough to solve in minutes. The New York Times acquired it in 2022, and the 5-letter format remains the global standard." },
    ],
  },

  /* ============================================================== */
  /*  6-LETTER — Intermediate                                       */
  /* ============================================================== */
  6: {
    wordLength: 6,
    tier: "intermediate",
    theme: INTERMEDIATE_THEME,
    difficultyScore: 5,
    wordPoolSize: "~23,000",
    avgSolveGuesses: "4-5",
    doubleLettterPct: "~25-30%",
    targetAudience: "Players ready to move beyond classic 5-letter Wordle",
    recommendNext: 7,
    relatedTools: [
      { name: "Word Finder", href: "/word-finder", description: "Search 6-letter words by pattern" },
      { name: "Anagram Solver", href: "/anagram-solver", description: "Unscramble 6-letter combos" },
    ],
    uniqueSections: [
      {
        id: "prefix-suffix-decoder",
        heading: "Prefix & Suffix Decoder for 6-Letter Words",
        description: "6-letter words are where prefixes and suffixes become game-changing. Learn to recognize them instantly",
        layout: "cards",
        data: {
          prefixes: [
            { affix: "UN-", meaning: "not / reverse", examples: "UNLOCK, UNFAIR, UNSAFE, UNWIND, UNSEEN, UNTOLD", frequency: "350+ words", strategy: "If U and N appear in positions 1-2, you're likely looking at an UN- word. Focus on the 4-letter root." },
            { affix: "RE-", meaning: "again / back", examples: "REFORM, RETURN, REMIND, REPORT, REPEAT, REMAIN", frequency: "400+ words", strategy: "R and E in positions 1-2? Strong RE- signal. Many RE- words have common roots (TURN, MIND, PORT)." },
            { affix: "IN-/IM-", meaning: "not / into", examples: "INSURE, INFECT, IMPORT, IMPOSE, INVITE, INVENT", frequency: "200+ words", strategy: "I and N in positions 1-2 with a consonant in position 3 usually means IN- prefix." },
          ],
          suffixes: [
            { affix: "-ING", meaning: "present participle", examples: "MAKING, TAKING, LIVING, GIVING, HOPING, MOVING", frequency: "800+ words", strategy: "The most dominant 6-letter suffix. If you confirm I, N, G in positions 4-5-6, you only need to solve a 3-letter root." },
            { affix: "-TION", meaning: "noun from verb", examples: "ACTION, NATION, MOTION, POTION, LOTION, RATION", frequency: "150+ words", strategy: "Always exactly 6 letters with this suffix. T-I-O-N in positions 3-6 is unmistakable." },
            { affix: "-LY", meaning: "adverb", examples: "FAIRLY, LONELY, NEARLY, KINDLY, BOLDLY, PURELY", frequency: "250+ words", strategy: "L and Y in positions 5-6? Almost certainly an -LY adverb. Solve the 4-letter adjective root." },
          ],
        },
      },
      {
        id: "5v6-comparison",
        heading: "6-Letter vs 5-Letter Wordle: What Changes?",
        description: "A side-by-side comparison to help you adjust your strategy",
        layout: "comparison",
        data: {
          stats: [
            { metric: "Word pool size", five: "~2,300", six: "~23,000", impact: "10x more possibilities means each guess eliminates less" },
            { metric: "Average guesses to solve", five: "3.8", six: "4.5", impact: "Expect ~1 more guess per game" },
            { metric: "Double letter frequency", five: "~15%", six: "~25-30%", impact: "Much more common — don't ignore repeated letters" },
            { metric: "Prefix/suffix importance", five: "Low", six: "High", impact: "UN-, RE-, -ING, -TION become major solving tools" },
            { metric: "Compound words", five: "Rare", six: "Occasional", impact: "Start watching for two-part words" },
            { metric: "Recommended opener letters", five: "E, A, R, S, T", six: "E, A, I, R, S, T, N", impact: "N and I gain importance at 6 letters" },
          ],
        },
      },
    ],
    faq: [
      { question: "How much harder is 6-letter Wordle than 5-letter?", answer: "Significantly harder. The word pool jumps from ~2,300 to ~23,000 possible words (10x increase), double letter frequency rises from ~15% to ~25-30%, and prefix/suffix patterns become critical. Expect to use 4-5 guesses vs 3-4 for classic Wordle." },
      { question: "What are the best starting words for 6-letter Wordle?", answer: "STRAIN and PLANET are excellent openers — they cover high-frequency letters (S, T, R, A, I, N, P, L, E) across common 6-letter positions. A two-word system like STRAIN + COUPLE tests 12 unique letters in just 2 guesses." },
      { question: "Why are double letters so common in 6-letter words?", answer: "Longer words naturally have more opportunities for letter repetition. Common patterns include TT (BUTTER, KITTEN), FF (COFFEE, TOFFEE), LL (MIDDLE, BUBBLE), and SS (LESSON,ASSEN). About 25-30% of 6-letter words contain at least one repeated letter." },
      { question: "How important are prefixes in 6-letter Wordle?", answer: "Very important. UN- (UNLOCK, UNFAIR), RE- (REFORM, RETURN), and IN- (INSURE, INVITE) are extremely common 6-letter prefixes. Recognizing a prefix in positions 1-2 immediately narrows your search to the 4-letter root word." },
      { question: "Should I try to identify suffixes early?", answer: "Yes, confirming the suffix is often the fastest path to solving. -ING alone appears in 800+ six-letter words. If early guesses reveal I, N, G in the right positions, you've reduced the puzzle to a 3-letter root word problem." },
      { question: "Is 6-letter Wordle a good step up from classic Wordle?", answer: "It's the ideal next challenge. The core mechanics are identical, but the larger word pool and increased prefix/suffix importance introduce new strategic layers without being overwhelmingly difficult. Most classic Wordle players adapt within a few games." },
    ],
  },

  /* ============================================================== */
  /*  7-LETTER — Intermediate                                       */
  /* ============================================================== */
  7: {
    wordLength: 7,
    tier: "intermediate",
    theme: INTERMEDIATE_THEME,
    difficultyScore: 6,
    wordPoolSize: "~34,000",
    avgSolveGuesses: "4-5",
    doubleLettterPct: "~30%",
    targetAudience: "Players who want morphological depth",
    recommendNext: 8,
    relatedTools: [
      { name: "Word Finder", href: "/word-finder", description: "Search 7-letter words" },
      { name: "Wordle Solver", href: "/wordle-solver", description: "Get strategic suggestions" },
    ],
    uniqueSections: [
      {
        id: "ing-encyclopedia",
        heading: "The -ING Words Encyclopedia",
        description: "Over 2,000 seven-letter words end in -ING. Master them by category to solve faster",
        layout: "grid",
        data: {
          categories: [
            { category: "Motion & Action", words: ["WALKING", "RUNNING", "JUMPING", "FALLING", "SITTING", "GETTING", "PUTTING", "CUTTING", "HITTING", "LETTING"], rootTip: "Most motion -ING words have 4-letter roots: WALK, RUN+N, JUMP, FALL" },
            { category: "Communication", words: ["TALKING", "READING", "WRITING", "CALLING", "TELLING", "SINGING", "YELLING", "SHARING", "POSTING", "TEXTING"], rootTip: "Communication roots are among the most common everyday words" },
            { category: "Creation & Change", words: ["MAKING", "COOKING", "GROWING", "PAINTING", "FORMING", "DRAWING", "CASTING", "MELTING", "BONDING", "SHAPING"], rootTip: "Creative -ING words often have single-syllable roots" },
            { category: "Mental & Emotional", words: ["FEELING", "WANTING", "WISHING", "KNOWING", "HOPING", "LOVING", "CARING", "FEARING", "MINDING", "VIEWING"], rootTip: "Abstract roots — think emotions and cognitive processes" },
            { category: "Daily Life", words: ["WORKING", "PLAYING", "DRIVING", "PARKING", "FISHING", "CAMPING", "DANCING", "SURFING", "BANKING", "TRADING"], rootTip: "Activity-based words. Roots are often hobby or occupation related" },
          ],
        },
      },
      {
        id: "root-decomposition",
        heading: "Root Word Decomposition Table",
        description: "Break 7-letter words into their building blocks to solve them systematically",
        layout: "table",
        data: {
          columns: ["Word", "Prefix", "Root", "Suffix", "Decomposition Strategy"],
          rows: [
            ["RESTART", "RE-", "START", "—", "Prefix + 5-letter root. If you spot RE- in positions 1-2, think of 5-letter words."],
            ["UNHAPPY", "UN-", "HAPPY", "—", "Prefix + 5-letter root. UN- words are adjective negations."],
            ["WALKING", "—", "WALK", "-ING", "Root + suffix. Confirm -ING first, then solve the 4-letter root."],
            ["STATION", "—", "STAT", "-ION", "Root + suffix. -TION/-SION endings always signal a noun."],
            ["PREVIEW", "PRE-", "VIEW", "—", "Prefix + 4-letter root. PRE- means 'before' — think temporal words."],
            ["CAPABLE", "—", "CAP(E)", "-ABLE", "Root + suffix. -ABLE means 'can be done' — adjective form."],
            ["KINGDOM", "KING", "—", "-DOM", "Base word + suffix. -DOM means 'domain/realm' — think territories."],
          ],
        },
      },
    ],
    faq: [
      { question: "Why do so many 7-letter words end in -ING?", answer: "English uses -ING to form present participles and gerunds from verbs. Since most common English verbs have 3-5 letter roots (WALK, READ, THINK), adding -ING produces exactly 7 letters. Over 2,000 seven-letter words end in -ING, making it the single most important pattern to recognize." },
      { question: "What percentage of 7-letter words are compound words?", answer: "Approximately 10-15% of common 7-letter words are compounds (BEDROOM, AIRPORT, HIGHWAY, NETWORK). These are worth watching for because identifying one half immediately reveals the other. If positions 1-3 spell BED, the answer is likely BEDROOM or BEDSIDE." },
      { question: "How do I handle the massive 34,000-word pool?", answer: "Morphological thinking is key. Instead of searching through 34,000 possibilities, decompose words into prefix + root + suffix. Confirming an -ING ending reduces the pool to ~2,000. Spotting a RE- prefix narrows it further. Think in word parts, not individual letters." },
      { question: "What's the most common mistake in 7-letter Wordle?", answer: "The most common mistake is treating it like a longer version of 5-letter Wordle — guessing letter by letter. At 7 letters, you should think in chunks: identify if the word has a prefix (UN-, RE-, PRE-), a suffix (-ING, -TION, -MENT, -ABLE), or is a compound (BED+ROOM). This structural approach is far more efficient." },
      { question: "Are there 7-letter words without any prefix or suffix?", answer: "Yes — words like KITCHEN, PREMIUM, JOURNEY, CHAPTER, and BLANKET have no clear affix structure. These 'monomorphemic' words are harder to decompose but follow predictable letter patterns. Stay flexible and don't force an affix analysis when the letters don't suggest one." },
      { question: "How does 7-letter Wordle help with NYT Strands?", answer: "Strands Spangrams (the special word spanning the grid) are often 7-9 letters. The morphological skills you develop — spotting -ING endings, recognizing compound words, decomposing prefix+root structures — directly help you trace these long words across adjacent grid cells." },
    ],
  },

  /* ============================================================== */
  /*  8-LETTER — Advanced                                           */
  /* ============================================================== */
  8: {
    wordLength: 8,
    tier: "advanced",
    theme: ADVANCED_THEME,
    difficultyScore: 7,
    wordPoolSize: "~80,000",
    avgSolveGuesses: "5-6",
    doubleLettterPct: "~35%",
    targetAudience: "Experienced word game players seeking a challenge",
    recommendNext: 9,
    relatedTools: [
      { name: "Word Finder", href: "/word-finder", description: "Search 8-letter patterns" },
      { name: "Anagram Solver", href: "/anagram-solver", description: "Decode 8-letter anagrams" },
    ],
    uniqueSections: [
      {
        id: "compound-atlas",
        heading: "Compound Word Atlas",
        description: "A visual guide to the most common compound word structures in 8-letter English",
        layout: "cards",
        data: {
          groups: [
            { prefix: "OVER-", words: ["OVERCOME", "OVERLOOK", "OVERTIME", "OVERLOAD", "OVERCAST", "OVERVIEW", "OVERHAUL", "OVERFLOW"], count: 40, description: "The largest 8-letter compound family. OVER- means 'above' or 'excess'. If O-V-E-R appears in positions 1-4, you're solving a 4-letter second half." },
            { prefix: "OUT-", words: ["OUTDOORS", "OUTBREAK", "OUTSHINE", "OUTLINED", "OUTWEIGH", "OUTREACH", "OUTBURST", "OUTRIGHT"], count: 30, description: "OUT- means 'beyond' or 'surpassing'. Common in competitive and spatial contexts." },
            { prefix: "BACK-/–BACK", words: ["COMEBACK", "DRAWBACK", "FEEDBACK", "FULLBACK", "SETBACK", "PLAYBACK", "CALLBACK", "KICKBACK"], count: 20, description: "BACK appears as both prefix and suffix. If B-A-C-K shows up in positions 5-8, scan for the first half." },
            { prefix: "UNDER-", words: ["UNDERWAY", "UNDERDOG", "UNDERCUT", "UNDERGO", "UNDERPIN", "UNDERLIE", "UNDERSEA"], count: 15, description: "UNDER- narrows the answer to just 3 unknown letters. One of the most solvable compound patterns." },
            { prefix: "Equal halves", words: ["BASEBALL", "HOMEWORK", "BOOKMARK", "WORKSHOP", "BIRTHDAY", "DOORBELL", "FOOTBALL", "FARMLAND"], count: 50, description: "Two 4-letter words joined. If positions 1-4 form a word, check if 5-8 also form a word." },
          ],
        },
      },
      {
        id: "academic-domains",
        heading: "Academic Vocabulary by Domain",
        description: "8-letter words often come from specialized fields. Knowing which domain you're in narrows possibilities fast",
        layout: "grid",
        data: {
          domains: [
            { field: "Science", words: ["ANALYSIS", "CHEMICAL", "HYDROGEN", "MOLECULE", "BACTERIA", "REACTION"], cue: "Look for Greek/Latin roots: -YSIS, -OGEN, -TION" },
            { field: "Business", words: ["STRATEGY", "DOCUMENT", "CAMPAIGN", "CUSTOMER", "EXCHANGE", "DEADLINE"], cue: "Professional context words. Often end in -MENT, -ATE, -TION" },
            { field: "Technology", words: ["COMPUTER", "DATABASE", "DOWNLOAD", "FIRMWARE", "HARDWARE", "KEYBOARD"], cue: "Many are compounds: DATA+BASE, DOWN+LOAD, KEY+BOARD" },
            { field: "Medicine", words: ["DIAGNOSE", "DISORDER", "CLINICAL", "SURGICAL", "ANTIBODY", "INFECTED"], cue: "Prefix-heavy: DIS-, ANTI-, IN-. Latin roots dominate" },
            { field: "Law & Government", words: ["CONGRESS", "CRIMINAL", "JUDGMENT", "EVIDENCE", "JUDICIAL", "ADVOCATE"], cue: "Formal register. French/Latin origins — look for -MENT, -ENCE, -IAL" },
          ],
        },
      },
    ],
    faq: [
      { question: "How do I approach 80,000 possible words with only 6 guesses?", answer: "Decomposition is your primary strategy. Most 8-letter words break into 2-3 meaningful parts: OVER+COME, BASE+BALL, UN+COVER+S. Identifying any one part drastically narrows the search. Use your first 2 guesses to test high-frequency letters, then look for structural patterns in guess 3." },
      { question: "What types of words are most common at 8 letters?", answer: "Three categories dominate: compound words (BASEBALL, HOMEWORK — about 20%), suffixed words (MOVEMENT, STARTING, POSSIBLE — about 50%), and academic/professional vocabulary (ANALYSIS, STRATEGY, COMPUTER — about 30%). Knowing which category you're in helps narrow possibilities." },
      { question: "Why does academic vocabulary dominate 8-letter words?", answer: "Everyday English conversation uses mostly 3-6 letter words. By 8 letters, you're in the territory of formal, technical, and professional language — words more commonly written than spoken. This is why shifting your mental dictionary toward 'textbook English' helps at this length." },
      { question: "How common are compound words in 8-letter Wordle?", answer: "Very common — roughly 1 in 5 answers is a compound word. Families like OVER- (40+ words), OUT- (30+ words), and equal-half compounds like BASEBALL (50+ words) make up a significant portion. Always ask: 'Could this be two shorter words joined together?'" },
      { question: "Should I change my opening strategy for 8-letter Wordle?", answer: "Yes. Use openers that test 8 unique high-frequency letters: ABSOLUTE or CHAPTERS are strong choices. A two-word system like CHAPTERS + FUDGING covers 15 unique letters across 2 guesses, leaving very few common letters untested." },
      { question: "What's the role of double letters in 8-letter words?", answer: "Double letters appear in about 35% of 8-letter words — much higher than shorter formats. Common doubles include LL (FOOTBALL), SS (POSSIBLE), TT (PATTERNS), NN (PLANNING), and PP (APPROACH). If 6-7 letters are placed but the word won't form, try repeating a consonant." },
    ],
  },

  /* ============================================================== */
  /*  9-LETTER — Advanced                                           */
  /* ============================================================== */
  9: {
    wordLength: 9,
    tier: "advanced",
    theme: ADVANCED_THEME,
    difficultyScore: 8,
    wordPoolSize: "~100,000+",
    avgSolveGuesses: "5-6",
    doubleLettterPct: "~35%",
    targetAudience: "Serious word game enthusiasts",
    recommendNext: 10,
    relatedTools: [
      { name: "Word Finder", href: "/word-finder", description: "Search 9-letter patterns" },
      { name: "Wordle Solver", href: "/wordle-solver", description: "Get solving assistance" },
    ],
    uniqueSections: [
      {
        id: "syllable-guide",
        heading: "Syllable Breakdown Guide",
        description: "9-letter words have 3-4 syllables. Learning to hear them speeds up solving dramatically",
        layout: "table",
        data: {
          columns: ["Word", "Syllables", "Breakdown", "Syllable Pattern", "Memory Tip"],
          rows: [
            ["BEAUTIFUL", "3", "BEAU-TI-FUL", "2-1-1", "French root BEAU (beautiful) + suffix -TIFUL"],
            ["DANGEROUS", "3", "DAN-GER-OUS", "1-1-1", "Latin DANGER + adjective suffix -OUS"],
            ["EDUCATION", "4", "ED-U-CA-TION", "1-1-1-1", "Latin EDUCARE (to lead out) + noun suffix -TION"],
            ["BUTTERFLY", "3", "BUT-TER-FLY", "1-1-1", "Compound: BUTTER + FLY (from Old English)"],
            ["SOMETHING", "2-3", "SOME-THING", "1-1", "Compound: SOME + THING. Pronounced 2 syllables, spelled as 2 words"],
            ["IMPORTANT", "3", "IM-POR-TANT", "1-1-1", "Latin prefix IM- (into) + PORT (carry) + -ANT"],
            ["CHOCOLATE", "3", "CHOC-O-LATE", "1-1-1", "Nahuatl origin. Unusual letter pattern for English"],
            ["SIGNATURE", "3", "SIG-NA-TURE", "1-1-1", "Latin SIGNUM (sign) + noun suffix -TURE"],
          ],
        },
      },
      {
        id: "literary-words",
        heading: "9-Letter Words in Literature and Culture",
        description: "Build your vocabulary through memorable literary and cultural connections",
        layout: "list",
        data: {
          entries: [
            { word: "TRANSFORM", context: "Kafka's 'The Metamorphosis' — the protagonist transforms into an insect. TRANS (across) + FORM (shape). Think 'change of form'.", category: "Literature" },
            { word: "DESPERATE", context: "'Desperate times call for desperate measures.' Latin DE- (away) + SPERARE (to hope). Literally 'without hope'.", category: "Proverbs" },
            { word: "DISCOVERY", context: "The Age of Discovery (15th-17th centuries). DIS- (opposite) + COVER + -Y. Literally 'to uncover'.", category: "History" },
            { word: "CHALLENGE", context: "From Old French 'chalenge' (accusation). Used in everything from sports to space exploration.", category: "Etymology" },
            { word: "ADVENTURE", context: "Latin ADVENTURA (about to happen). AD- (toward) + VENIRE (to come). The root of our word 'event' too.", category: "Etymology" },
            { word: "NIGHTMARE", context: "Compound: NIGHT + MARE. The 'mare' is from Old English MARA (an evil spirit that sits on sleepers). Not related to female horses!", category: "Etymology" },
          ],
        },
      },
    ],
    faq: [
      { question: "How do I even begin guessing a 9-letter word?", answer: "Start by sounding it out in syllables, not individual letters. 9-letter words almost always have 3-4 syllables. Use your first 2 guesses to identify high-frequency letters (try EDUCATION + SYMPHONY), then look for recognizable syllable patterns — is it a -TION word? A compound? A -FUL adjective?" },
      { question: "What are the most common 9-letter word structures?", answer: "Three structures dominate: (1) suffix-heavy words ending in -TION/-SION (EDUCATION, SITUATION — 500+ words), (2) compound words (BUTTERFLY, SOMETHING, SUNFLOWER — hundreds of words), and (3) prefix+root combinations (UNCERTAIN, RECOMMEND — very common). Identifying the structure is half the battle." },
      { question: "Are 9-letter words mostly academic vocabulary?", answer: "Many are, but not all. Everyday compounds like SOMETHING, EVERYBODY, and BUTTERFLY are 9 letters. Nature words (SUNFLOWER, LANDSCAPE), emotional words (BEAUTIFUL, DESPERATE), and action words (TRANSFORM, INTRODUCE) all appear. The key shift is from conversational to written vocabulary." },
      { question: "How does syllable thinking help solve 9-letter Wordle?", answer: "Syllable thinking activates your spoken vocabulary, which is much larger than your 'letter-by-letter' vocabulary. When you see confirmed letters B-E-A-U, thinking 'BEAU... beauty... beautiful!' is much faster than trying to permute 9 individual letters. Sound the word out mentally as letters emerge." },
      { question: "What compound words should I watch for at 9 letters?", answer: "Key families include: EVERY- compounds (EVERYBODY, EVERGREEN, EVERYTHING), nature compounds (BUTTERFLY, SUNFLOWER, WATERFALL), SOME- compounds (SOMETHING, SOMETIMES, SOMEWHERE), and direction compounds (NORTHEAST, ELSEWHERE). If the first 4-5 letters spell a word, think compound." },
      { question: "How do 9-letter skills transfer to NYT Strands?", answer: "Strands Spangrams are often 9-10 letters and frequently compound words or multi-morpheme terms. The ability to mentally decompose BUTTER+FLY or WATER+FALL while tracing through a letter grid is exactly what Spangram-finding requires. Regular 9-letter practice builds this skill naturally." },
    ],
  },

  /* ============================================================== */
  /*  10-LETTER — Master                                            */
  /* ============================================================== */
  10: {
    wordLength: 10,
    tier: "master",
    theme: MASTER_THEME,
    difficultyScore: 9,
    wordPoolSize: "~120,000+",
    avgSolveGuesses: "5-6",
    doubleLettterPct: "~40%",
    targetAudience: "Vocabulary enthusiasts and competitive players",
    recommendNext: 11,
    relatedTools: [
      { name: "Word Finder", href: "/word-finder", description: "Search 10-letter patterns" },
      { name: "Anagram Solver", href: "/anagram-solver", description: "Decode long anagrams" },
    ],
    uniqueSections: [
      {
        id: "latin-greek-roots",
        heading: "Latin & Greek Roots Reference",
        description: "Most 10-letter words are built from classical roots. This reference table is your decoder ring",
        layout: "table",
        data: {
          columns: ["Root", "Origin", "Meaning", "10-Letter Examples", "Memory Aid"],
          rows: [
            ["TELE-", "Greek", "far, distant", "TELEVISION, TELEPATHIC, TELEGRAPHS", "TELEphone = far + sound"],
            ["MICRO-", "Greek", "small", "MICROSCOPE, MICROPHONE, MICROWAVES", "MICRO = tiny things"],
            ["-GRAPH/-GRAM", "Greek", "write/record", "PHOTOGRAPH, AUTOGRAPHS, PARAGRAPHS", "GRAPH = written/drawn"],
            ["-OLOGY/-OLOG", "Greek", "study of", "TECHNOLOGY, PSYCHOLOGY, ARCHEOLOGY", "-OLOGY = a field of study"],
            ["TRANS-", "Latin", "across", "TRANSPLANT, TRANSITION, TRANSCRIPT", "TRANS = movement across"],
            ["UNDER-", "English", "below", "UNDERSTAND, UNDERNEATH, UNDERSCORE", "UNDER = beneath/less than"],
            ["BACK-/GROUND", "English", "base/rear", "BACKGROUND, PLAYGROUND, CAMPGROUND", "-GROUND = area/place"],
            ["-MENT", "Latin", "result/action", "GOVERNMENT, MANAGEMENT, DEPARTMENT", "-MENT = noun from verb"],
            ["-NESS", "English", "state/quality", "BRIGHTNESS, LONELINESS, WILDERNESS", "-NESS = quality of being"],
            ["-ABLE/-IBLE", "Latin", "capable of", "IMPOSSIBLE, REASONABLE, CHANGEABLE", "-ABLE = can be done"],
          ],
        },
      },
      {
        id: "professional-vocab",
        heading: "Professional Vocabulary Builder",
        description: "10-letter words organized by professional field — expand your vocabulary while you play",
        layout: "grid",
        data: {
          fields: [
            { profession: "Medicine & Health", words: ["ANTIBIOTIC", "DIAGNOSTIC", "HEALTHCARE", "OUTPATIENT", "PAINKILLER", "QUARANTINE"], insight: "Medical 10-letter words often have Greek roots (ANTI-, DIA-, -OTIC) or compound structure (HEALTH+CARE)" },
            { profession: "Technology", words: ["BLOCKCHAIN", "BROADBANDS", "ENCRYPTION", "JAVASCRIPT", "SCREENSHOT", "SMARTPHONE"], insight: "Tech vocabulary is dominated by compounds (BLOCK+CHAIN, SMART+PHONE) — ideal for decomposition strategy" },
            { profession: "Business & Finance", words: ["ACCOUNTING", "BANKRUPTCY", "COMMISSION", "ENTERPRISE", "INVESTMENT", "MANAGEMENT"], insight: "Business words lean heavily on -MENT and -TION suffixes. If the ending is clear, focus on the root." },
            { profession: "Education", words: ["ASSIGNMENT", "CURRICULUM", "DICTIONARY", "ELEMENTARY", "GRADUATION", "UNIVERSITY"], insight: "Education words often have Latin roots (UNIVERSITAS, CURRICULUM). -TION and -ARY suffixes are common." },
            { profession: "Law & Politics", words: ["AMBASSADOR", "COMPLIANCE", "CONVENTION", "DEMOCRATIC", "GOVERNMENT", "REGULATION"], insight: "Political vocabulary uses French/Latin roots extensively. Look for -MENT, -TION, -ANCE/-ENCE endings." },
          ],
        },
      },
    ],
    faq: [
      { question: "Is 10-letter Wordle even solvable in 6 guesses?", answer: "Yes, but it requires strategic discipline. The key is using your first 2 guesses to test 15+ unique letters (try BACKGROUND + SEMIFLUX), then applying root/compound analysis. Top players solve 10-letter puzzles about 70% of the time within 6 guesses." },
      { question: "What knowledge gives the biggest advantage at 10 letters?", answer: "Latin and Greek root knowledge is the single biggest advantage. Roots like TELE- (far), MICRO- (small), -GRAPH (write), -OLOGY (study), and TRANS- (across) appear in hundreds of 10-letter words. Recognizing these roots lets you 'decode' words you've never seen before." },
      { question: "How do professional fields relate to 10-letter words?", answer: "10-letter words cluster heavily in professional domains — medicine (ANTIBIOTIC), technology (SMARTPHONE), business (MANAGEMENT), law (GOVERNMENT). When letters start forming, ask yourself: 'What field does this word belong to?' This domain-matching narrows possibilities dramatically." },
      { question: "Are compound words still common at 10 letters?", answer: "Yes — words like BACKGROUND, PLAYGROUND, BASKETBALL, and SCREENSHOT are all compounds. At 10 letters, you often see a 4-6 letter first word + a 4-6 letter second word. If the first half forms a recognizable word, immediately try to complete the compound." },
      { question: "How many 10-letter words exist in English?", answer: "Over 120,000 ten-letter entries exist in comprehensive dictionaries, though the game uses a curated subset. This enormous pool makes pure letter-guessing impractical — structural analysis (prefixes, roots, suffixes, compounds) is essential." },
      { question: "What suffixes should I look for in 10-letter words?", answer: "The most common 10-letter suffixes are -TION/-SION (GENERATION, PERMISSION), -MENT (GOVERNMENT, MANAGEMENT), -ABLE/-IBLE (IMPOSSIBLE, REASONABLE), -NESS (BRIGHTNESS, LONELINESS), and -ING (PROCESSING, PHOTOGRAPH+ING). Confirming the ending is the single highest-value deduction." },
    ],
  },

  /* ============================================================== */
  /*  11-LETTER — Master                                            */
  /* ============================================================== */
  11: {
    wordLength: 11,
    tier: "master",
    theme: MASTER_THEME,
    difficultyScore: 10,
    wordPoolSize: "~150,000+",
    avgSolveGuesses: "5-6",
    doubleLettterPct: "~40%",
    targetAudience: "Ultimate challenge seekers and vocabulary masters",
    recommendNext: 4,
    relatedTools: [
      { name: "Word Finder", href: "/word-finder", description: "Search 11-letter patterns" },
      { name: "Wordle Solver", href: "/wordle-solver", description: "Expert-level solving help" },
    ],
    uniqueSections: [
      {
        id: "morpheme-mastery",
        heading: "Morpheme Mastery: Triple-Layer Word Decomposition",
        description: "Almost every 11-letter word has 3+ meaningful parts. Learn to see all three layers",
        layout: "table",
        data: {
          columns: ["Word", "Prefix", "Root", "Suffix", "Layer Analysis"],
          rows: [
            ["COMFORTABLE", "COM-", "FORT", "-ABLE", "COM- (with) + FORT (strength) + -ABLE (capable). Literally: 'capable of giving strength/support'."],
            ["INDEPENDENT", "IN-", "DEPEND", "-ENT", "IN- (not) + DEPEND (hang from) + -ENT (one who). Literally: 'one who does not hang from another'."],
            ["DEVELOPMENT", "DE-", "VELOP", "-MENT", "DE- (un-) + Old French VELOPER (to wrap) + -MENT. Literally: 'the act of unwrapping/unfolding'."],
            ["INFORMATION", "IN-", "FORM", "-ATION", "IN- (into) + FORM (shape) + -ATION (process). Literally: 'the process of shaping/forming [knowledge]'."],
            ["TEMPERATURE", "—", "TEMPER", "-ATURE", "Latin TEMPERARE (to moderate) + -ATURE (result). Related to 'temper' and 'temperament'."],
            ["PERFORMANCE", "PER-", "FORM", "-ANCE", "PER- (through) + FORM (shape) + -ANCE (state). Literally: 'the state of carrying through a form'."],
            ["ENVIRONMENT", "EN-", "VIRON", "-MENT", "EN- (in) + Old French VIRON (circle) + -MENT. Literally: 'that which circles around [us]'."],
            ["OPPORTUNITY", "OB- → OP-", "PORT", "-UNITY", "OB- (toward) + PORT (harbor) + -UNITY. Literally: 'favorable wind toward the harbor'."],
          ],
        },
      },
      {
        id: "hardest-words",
        heading: "The Hardest 11-Letter Words, Ranked",
        description: "Not all 11-letter words are equal. Here are the toughest ones and what makes them difficult",
        layout: "list",
        data: {
          entries: [
            { word: "APOCALYPTIC", difficulty: 10, reason: "Unusual letter combination (PC, LY, PT). Greek APOKALYPSIS (unveiling). No common prefix/suffix to anchor guessing.", category: "Extreme" },
            { word: "SWITCHBOARD", difficulty: 9, reason: "Compound (SWITCH+BOARD) but the W-I-T-C-H cluster is hard to deduce from partial letters. Uncommon letter T-C-H pattern.", category: "Very Hard" },
            { word: "QUARTERBACK", difficulty: 9, reason: "Triple compound (QUARTER+BACK). The QU opening is rare and Q is often the last letter players test. Contains uncommon letter Q.", category: "Very Hard" },
            { word: "ACKNOWLEDGE", difficulty: 8, reason: "Silent K at the start, unusual -WLEDGE cluster. AC+KNOW+LEDGE is the decomposition but hard to spot mid-game.", category: "Hard" },
            { word: "COMFORTABLE", difficulty: 5, reason: "Very common word with clear COM-FORT-ABLE structure. Most players recognize this from partial letters by guess 3-4.", category: "Moderate" },
            { word: "INFORMATION", difficulty: 4, reason: "Extremely common word. IN-FORM-ATION is transparent. High-frequency letters throughout. Usually solved in 4-5 guesses.", category: "Moderate" },
            { word: "PERSONALITY", difficulty: 6, reason: "PERSON+ALITY structure. Common word but the -ALITY suffix is less immediately obvious than -TION or -MENT.", category: "Moderate" },
          ],
        },
      },
    ],
    faq: [
      { question: "Is 11-letter Wordle the hardest word game format?", answer: "It's among the most challenging letter-guessing formats available. With 150,000+ possible words and only 6 guesses, pure letter deduction is nearly impossible. Success requires morphological analysis (breaking words into prefix + root + suffix), domain knowledge, and syllable-level thinking." },
      { question: "What skills do I need for 11-letter Wordle?", answer: "Three key skills: (1) Morpheme recognition — seeing that COMFORTABLE = COM + FORT + ABLE, (2) Domain thinking — recognizing that emerging letters suggest a science, business, or literary word, and (3) Syllable sounding — mentally pronouncing partial letter sequences to activate vocabulary recall." },
      { question: "How many morphemes do 11-letter words typically have?", answer: "Almost all have 3+ morphemes (meaningful word parts). INDEPENDENT = IN + DEPEND + ENT, COMFORTABLE = COM + FORT + ABLE, DEVELOPMENT = DE + VELOP + MENT. Recognizing any single morpheme narrows the search dramatically." },
      { question: "What are the most common 11-letter word endings?", answer: "The dominant suffixes are: -TION/-SION (INFORMATION, COMPETITION — hundreds of words), -MENT (DEVELOPMENT, ENVIRONMENT), -ABLE/-IBLE (COMFORTABLE, RESPONSIBLE), -NESS (CONSCIOUSNESS, AWKWARDNESS), and -ENCE/-ANCE (PERFORMANCE, INDEPENDENT). These 5 suffix families cover the majority of 11-letter words." },
      { question: "How should I use my first guess in 11-letter Wordle?", answer: "Use a word that tests 11 unique high-frequency letters: PERSONALITY or COUNTRYSIDE are strong choices. Since you have 11 positions, your first guess tests nearly half the alphabet. Follow up with a word using entirely different letters to map the remaining high-frequency letters." },
      { question: "Can etymology knowledge really help solve word puzzles?", answer: "Absolutely. Knowing that TRANS- means 'across', -GRAPH means 'write', or PORT means 'carry' lets you decode unfamiliar words from their components. TRANSPORTATION = TRANS (across) + PORT (carry) + ATION (process). Even partial root recognition dramatically narrows your guesses." },
    ],
  },
};

export function getLetterGameConfig(wordLength: number): LetterGameConfig | undefined {
  return LETTER_GAME_CONFIGS[wordLength];
}
