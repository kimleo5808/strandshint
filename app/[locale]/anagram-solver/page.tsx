import AnagramSolverTool from "@/components/tools/AnagramSolverTool";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { breadcrumbSchema, faqPageSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { Brain, Lightbulb, Search, Shuffle, Sparkles, Zap } from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

const FAMOUS_ANAGRAMS = [
  { word: "LISTEN", anagram: "SILENT", note: "Perfect reversal of meaning" },
  { word: "EARTH", anagram: "HEART", note: "Same letters, different core" },
  { word: "ASTRONOMER", anagram: "MOON STARER", note: "Poetic coincidence" },
  { word: "THE EYES", anagram: "THEY SEE", note: "True in both directions" },
];

const HOW_TO_STEPS = [
  {
    icon: Shuffle,
    step: "1",
    title: "Enter Your Letters",
    body: "Type all the letters you have available — up to 15. Order doesn't matter. Include any letter that might be in the solution.",
  },
  {
    icon: Search,
    step: "2",
    title: "Click Solve",
    body: "The solver checks every word in our dictionary against your letters, finding every valid word that can be made using some or all of them.",
  },
  {
    icon: Sparkles,
    step: "3",
    title: "Browse by Length",
    body: "Results are grouped by word length in tabs. Longer words are shown first — these are usually the most useful for word games.",
  },
];

const GAME_USES = [
  {
    icon: "🟨",
    game: "NYT Strands",
    href: "/strands-hint-today",
    desc: "Strands theme words connect to a theme. Use the anagram solver when you can see letters on the grid but can't figure out the word they form. Try all visible letter combinations to find the hidden theme word.",
  },
  {
    icon: "📝",
    game: "Scrabble",
    href: "/word-finder",
    desc: "With 7 tiles in your rack, use the anagram solver to find every possible word you can play. Focus on 7-letter words (Bingos) first for the 50-point bonus, then work down through shorter options.",
  },
  {
    icon: "✏️",
    game: "Crossword Puzzles",
    href: "/wordle-solver",
    desc: "When you have crossing letters in a crossword, enter those letters plus any other potential letters to see what words could fit. Combine with our Word Finder for positional constraints.",
  },
];

const FAQ_ITEMS = [
  {
    question: "What is an anagram?",
    answer:
      "An anagram is a word or phrase formed by rearranging the letters of another word or phrase, using all the original letters exactly once. For example, LISTEN is an anagram of SILENT — both words use the letters E, I, L, N, S, T.",
  },
  {
    question: "Does the solver find all possible anagrams?",
    answer:
      "The solver finds all valid words in our dictionary that can be formed using some or all of your input letters. It finds words of every length from 2 letters up to your input length. Note: words must be a subset of your available letters — you can't use a letter more times than it appears in your input.",
  },
  {
    question: "Can I use the anagram solver for Scrabble?",
    answer:
      "Yes. Enter all 7 letters from your Scrabble rack and the solver will find every valid word you can play. It searches all word lengths, so you'll see 7-letter words (Bingos), 6-letter words, 5-letter words, and shorter options. Note that our word list may differ slightly from the official Scrabble dictionary.",
  },
  {
    question: "How is an anagram solver different from a word finder?",
    answer:
      "An anagram solver takes a set of letters and finds all words that can be built from those letters (in any order). A Word Finder lets you specify constraints like exact letter positions, required letters, and exclusions — it's designed for when you know something about the word's structure. Use the anagram solver for pure unscrambling; use the Word Finder for pattern-based searches.",
  },
  {
    question: "Why don't my letters form any words?",
    answer:
      "If no words are found, try adding more letters (you may be missing one), removing letters that seem wrong, or accepting shorter word results. Our dictionary focuses on common English words — very rare, archaic, or technical terms may not be included.",
  },
  {
    question: "Can I solve multi-word anagrams?",
    answer:
      "This tool finds single words only. Multi-word anagram solving (like 'ASTRONOMER' → 'MOON STARER') requires a different algorithm. For now, try solving one word at a time and use your remaining letters for the second word.",
  },
];

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AnagramSolver" });
  return constructMetadata({
    page: "AnagramSolver",
    title: t("title"),
    description: t("description"),
    keywords: [
      "anagram solver", "unscramble words", "word unscrambler",
      "anagram finder", "scrambled letters", "unscramble letters",
      "anagram helper", "word scramble solver",
    ],
    locale: locale as Locale,
    path: "/anagram-solver",
    canonicalUrl: "/anagram-solver",
  });
}

export default async function AnagramSolverPage({ params }: { params: Params }) {
  await params;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: BASE_URL },
        { name: "Anagram Solver", url: `${BASE_URL}/anagram-solver` },
      ])} />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      {/* Header */}
      <header className="relative overflow-hidden rounded-2xl border border-amber-200/50 bg-gradient-to-br from-amber-50 via-white to-amber-50 p-6 sm:p-8 dark:border-amber-900/40 dark:from-amber-950/30 dark:via-zinc-900 dark:to-amber-950/10 mb-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Shuffle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">Word Tool</span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Anagram Solver
          </h1>
          <p className="mt-2 text-muted-foreground">
            Enter any set of letters to find every valid word they can form.
            Great for Scrabble, NYT Strands, crosswords, and word puzzles.
          </p>
        </div>
      </header>

      {/* Tool */}
      <AnagramSolverTool />

      <div className="mt-10 space-y-8">

        {/* What is an Anagram */}
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-foreground mb-4">
            What is an Anagram?
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground mb-5">
            An anagram rearranges the letters of one word to create a completely
            different word. Every letter is used exactly once — no letters added
            or removed. Anagrams have fascinated word lovers for centuries,
            from ancient Greek puzzles to modern word games.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {FAMOUS_ANAGRAMS.map((a) => (
              <div key={a.word} className="rounded-xl border border-amber-200/60 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/10 p-4">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono font-bold text-amber-700 dark:text-amber-400 tracking-widest">{a.word}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-mono font-bold text-amber-700 dark:text-amber-400 tracking-widest">{a.anagram}</span>
                </div>
                <p className="text-xs text-muted-foreground">{a.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How to Solve */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
            How to Use the Anagram Solver
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            Three steps to unscramble any set of letters:
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {HOW_TO_STEPS.map(({ icon: Icon, step, title, body }) => (
              <div key={title} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 font-heading text-sm font-bold text-amber-600 dark:text-amber-400">
                    {step}
                  </div>
                  <Icon className="h-4 w-4 text-amber-500" />
                  <h3 className="font-heading text-sm font-bold text-foreground">{title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Manual Solving Tips */}
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-foreground mb-4">
            How to Solve Anagrams Manually
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground mb-5">
            Even without a solver, experienced word game players use these
            mental techniques to crack anagrams faster:
          </p>
          <div className="space-y-4">
            {[
              {
                icon: Zap,
                title: "Find Vowels First",
                body: "Count your vowels (A, E, I, O, U). Every English word needs at least one. Grouping vowels together helps you see potential word structures. If you have AEIOU, try placing one vowel between consonants.",
              },
              {
                icon: Brain,
                title: "Spot Common Letter Pairs",
                body: "Look for TH, CH, SH, PH, ST, TR, CR, PR — these letter pairs occur together frequently. If you see T and H in your letters, they often belong together. Similarly, QU almost always appear as a pair.",
              },
              {
                icon: Lightbulb,
                title: "Try Common Suffixes First",
                body: "Remove potential endings: -ING, -ED, -ER, -LY, -TION. If your remaining letters form a recognizable root, you've found the word. This suffix-first approach works especially well for 6-8 letter anagrams.",
              },
              {
                icon: Search,
                title: "Write Letters in a Circle",
                body: "Physical arrangement helps your eye find patterns that your brain's linear thinking misses. Write letters in a circular arrangement and scan for words reading clockwise, counterclockwise, or across the circle.",
              },
              {
                icon: Shuffle,
                title: "Rearrange in Groups",
                body: "Sort letters alphabetically first, then rearrange. Alphabetical order reveals letter clusters you might miss in random order. NSTPREA sorted becomes AAENPRST — much easier to spot SEPARATE.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                  <Icon className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-foreground mb-1">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Common Patterns Table */}
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-foreground mb-1">
            Common Anagram Letter Patterns
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Letter combinations that frequently appear in anagram puzzles:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Letters", "Often Becomes", "Tip"].map((h) => (
                    <th key={h} className="py-2 pr-4 text-left font-heading text-xs uppercase tracking-wide text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["AELST", "LEAST / SLATE / TALES / STALE", "5 common letters, 4+ words"],
                  ["AERST", "STARE / RATES / TEARS / ASTER", "Top Wordle opening"],
                  ["EILNST", "LISTEN / SILENT / ENLIST", "Perfect anagram trio"],
                  ["AEINR", "RAIN / NEAR / EARN / REIN", "All 4-letter combos"],
                  ["ORST", "SORT / ROTS / TORS", "Short but versatile"],
                  ["AELPR", "REPLA / PEARL / LAPER / PARLE", "Useful in Scrabble"],
                ].map(([letters, words, tip], i) => (
                  <tr key={letters} className={`border-b border-border/40 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                    <td className="py-2.5 pr-4 font-mono font-bold text-amber-700 dark:text-amber-400 tracking-widest">{letters}</td>
                    <td className="py-2.5 pr-4 text-muted-foreground">{words}</td>
                    <td className="py-2.5 text-xs text-muted-foreground">{tip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Anagrams in Games */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
            Anagram Skills in Word Games
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            How anagram-solving ability directly improves performance in popular games:
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {GAME_USES.map(({ icon, game, href, desc }) => (
              <div key={game} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{icon}</span>
                  <h3 className="font-heading text-sm font-bold text-foreground">{game}</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground mb-3">{desc}</p>
                <Link href={href} className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline">
                  Try {game} →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Fun Facts */}
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-foreground mb-4">
            Fun Anagram Facts
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: "Ancient Origins", body: "The word 'anagram' itself comes from Greek: ana (back, again) + gramma (letter). Ancient Greeks used anagrams as mystical signs and hidden messages in texts." },
              { title: "Longest Anagram Pair", body: "CONSERVATIONALISTS and CONVERSATIONALISTS are one of the longest English anagram pairs — 18 letters each, with no repeated structure." },
              { title: "Self-Referential", body: "ANAGRAM is an anagram of NAGA ARM (obscure) — but ASTRONOMER famously anagrams to MOON STARER, which poetically reflects the word's meaning." },
              { title: "In Literature", body: "Lewis Carroll was an avid anagrammer. He created the anagram WILLIAM EWART GLADSTONE → WILD AGITATOR MEANS WELL to describe a political opponent." },
            ].map(({ title, body }) => (
              <div key={title} className="rounded-xl border border-border p-4">
                <h3 className="font-heading text-sm font-bold text-foreground mb-2">📚 {title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-foreground mb-5">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item) => (
              <details key={item.question} className="group rounded-xl border border-border bg-card p-5 shadow-sm">
                <summary className="flex cursor-pointer items-center justify-between font-heading text-sm font-bold text-foreground list-none">
                  {item.question}
                  <span className="ml-2 shrink-0 text-muted-foreground transition-transform group-open:rotate-180">▾</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-gradient-to-br from-amber-600 to-amber-500 p-6 sm:p-8 text-center text-white">
          <h2 className="font-heading text-2xl font-bold">More Word Game Tools</h2>
          <p className="mt-2 text-sm text-amber-100">
            Anagram Solver is just the start — explore our full toolkit.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link href="/word-finder" className="rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-amber-700 transition-all hover:bg-white/90">
              Word Finder
            </Link>
            <Link href="/wordle-solver" className="rounded-xl border-2 border-white/30 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-white/10">
              Wordle Solver
            </Link>
            <Link href="/strands-hint-today" className="rounded-xl border-2 border-white/30 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-white/10">
              Strands Hints
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
