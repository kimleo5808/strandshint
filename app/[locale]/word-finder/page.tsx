import WordFinderTool from "@/components/tools/WordFinderTool";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { breadcrumbSchema, faqPageSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import {
  BookOpen,
  Filter,
  Hash,
  Search,
  Target,
  Zap,
} from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

const LETTER_FREQ = [
  { letter: "E", pct: 11.2, rank: 1 },
  { letter: "A", pct: 8.5, rank: 2 },
  { letter: "R", pct: 7.6, rank: 3 },
  { letter: "I", pct: 7.5, rank: 4 },
  { letter: "O", pct: 7.2, rank: 5 },
  { letter: "T", pct: 6.9, rank: 6 },
  { letter: "N", pct: 6.6, rank: 7 },
  { letter: "S", pct: 6.3, rank: 8 },
  { letter: "L", pct: 5.5, rank: 9 },
  { letter: "C", pct: 4.5, rank: 10 },
  { letter: "U", pct: 3.6, rank: 11 },
  { letter: "D", pct: 3.4, rank: 12 },
  { letter: "P", pct: 3.2, rank: 13 },
  { letter: "M", pct: 3.0, rank: 14 },
  { letter: "H", pct: 2.5, rank: 15 },
  { letter: "G", pct: 2.2, rank: 16 },
  { letter: "B", pct: 2.1, rank: 17 },
  { letter: "F", pct: 1.8, rank: 18 },
  { letter: "Y", pct: 1.8, rank: 19 },
  { letter: "W", pct: 1.5, rank: 20 },
  { letter: "K", pct: 1.1, rank: 21 },
  { letter: "V", pct: 1.0, rank: 22 },
  { letter: "X", pct: 0.3, rank: 23 },
  { letter: "Z", pct: 0.3, rank: 24 },
  { letter: "J", pct: 0.2, rank: 25 },
  { letter: "Q", pct: 0.2, rank: 26 },
];

const POPULAR_PATTERNS = [
  { pattern: "_ _ _ _ _", example: "CRANE, SLATE, RAISE", useCase: "Wordle guesses" },
  { pattern: "CR _ _ _ _", example: "CRANE, CRISP, CRAVE", useCase: "CR- opening" },
  { pattern: "_ _ _ ING", example: "BRING, STING, CLING", useCase: "-ING ending" },
  { pattern: "_ _ _ _ S", example: "TREES, WORDS, PLANTS", useCase: "Plural words" },
  { pattern: "_ _ _ _ ED", example: "PLAYED, TALKED, MOVED", useCase: "Past tense" },
  { pattern: "UN _ _ _ _", example: "UNDER, UNITY, UNCLE", useCase: "UN- prefix" },
];

const PREFIXES = [
  { affix: "UN-", meaning: "Not / reverse of", examples: "UNDO, UNFIT, UNSURE" },
  { affix: "RE-", meaning: "Again", examples: "REDO, REPAY, REUSE" },
  { affix: "IN-", meaning: "Not / into", examples: "INPUT, INNER, INFER" },
  { affix: "PRE-", meaning: "Before", examples: "PRESS, PRIOR, PRANK" },
  { affix: "OUT-", meaning: "Beyond / outside", examples: "OUTER, OUTPUT, OUST" },
  { affix: "OVER-", meaning: "Above / excess", examples: "OVERT, OVARY" },
];

const SUFFIXES = [
  { affix: "-ING", meaning: "Present participle", examples: "BRING, STING, CLING" },
  { affix: "-ED", meaning: "Past tense", examples: "MOVED, FIXED, LIKED" },
  { affix: "-ER", meaning: "Comparative / agent", examples: "TALLER, MAKER, RIVER" },
  { affix: "-LY", meaning: "Adverb", examples: "BADLY, TRULY, EARLY" },
  { affix: "-TION", meaning: "Noun (action)", examples: "LOTION, ACTION, MOTION" },
  { affix: "-NESS", meaning: "State / quality", examples: "ILLNESS, DARKNESS" },
];

const FAQ_ITEMS = [
  {
    question: "What is a Word Finder used for?",
    answer:
      "A Word Finder helps you discover valid words matching specific letter constraints — such as words of a given length, containing certain letters, or starting/ending with specific letters. It's most commonly used for Wordle, Scrabble, crossword puzzles, and NYT Strands.",
  },
  {
    question: "How do I use the position boxes in the Word Finder?",
    answer:
      "The position boxes represent each letter slot in the word. Type a letter in a box to require that exact letter in that position. Leave a box blank to allow any letter there. For example, typing 'C' in box 1 and 'N' in box 5 finds all 5-letter words starting with C and ending with N — like CRANE or CABIN.",
  },
  {
    question: "Can I use this Word Finder for Wordle?",
    answer:
      "Yes! Set the word length to 5. Use position boxes for green letters (known position), the Contains field for yellow letters (in word, unknown position), and the Exclude field for gray letters (not in word). This quickly narrows down remaining valid Wordle answers.",
  },
  {
    question: "Can I use this for NYT Strands?",
    answer:
      "Absolutely. Strands theme words range from 4 to 11+ letters. Use the length selector to target a specific word length, then use Contains to require letters you know are in the word based on the theme clue or partial grid visibility.",
  },
  {
    question: "What words are in the database?",
    answer:
      "Our word list contains common English words from 4 to 11 letters — the same words used in our Wordle variants. The list focuses on words likely to appear in word games: common nouns, verbs, adjectives, and adverbs. Obscure technical terms and proper nouns are generally excluded.",
  },
  {
    question: "How is this different from a Wordle Solver?",
    answer:
      "The Word Finder is a general-purpose filter: you specify letter patterns and get matching words. The Wordle Solver is specifically designed for the Wordle game — you enter color-coded guesses (green/yellow/gray) and it automatically applies all the game's logic to suggest your best next move.",
  },
];

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "WordFinder" });
  return constructMetadata({
    page: "WordFinder",
    title: t("title"),
    description: t("description"),
    keywords: [
      "word finder", "find words with letters", "words containing letters",
      "word search tool", "words starting with", "words ending with",
      "wordle helper", "scrabble word finder", "letter word finder",
    ],
    locale: locale as Locale,
    path: "/word-finder",
    canonicalUrl: "/word-finder",
  });
}

export default async function WordFinderPage({ params }: { params: Params }) {
  await params;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: BASE_URL },
        { name: "Word Finder", url: `${BASE_URL}/word-finder` },
      ])} />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      {/* Header */}
      <header className="relative overflow-hidden rounded-2xl border border-indigo-200/50 bg-gradient-to-br from-indigo-50 via-white to-indigo-50 p-6 sm:p-8 dark:border-indigo-900/40 dark:from-indigo-950/30 dark:via-zinc-900 dark:to-indigo-950/10 mb-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-400/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Search className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Word Tool</span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Word Finder
          </h1>
          <p className="mt-2 text-muted-foreground">
            Find words by length, known positions, required letters, and
            exclusions. Perfect for Wordle, Strands, Scrabble, and crosswords.
          </p>
        </div>
      </header>

      {/* Tool */}
      <WordFinderTool />

      <div className="mt-10 space-y-8">

        {/* How to Use */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
            How to Use the Word Finder
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            Three simple steps to find the exact word you need:
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Hash,
                step: "1",
                title: "Set Word Length",
                body: "Choose how many letters your word needs. Options range from 4 to 11 letters, covering all standard word game formats.",
              },
              {
                icon: Filter,
                step: "2",
                title: "Apply Constraints",
                body: "Use position boxes for exact letter placements, Contains for letters that must appear, Excludes for letters to avoid, and prefix/suffix shortcuts.",
              },
              {
                icon: Target,
                step: "3",
                title: "Find Words",
                body: "Click Find Words to see all matching words instantly. Results are listed alphabetically. Reset anytime to start fresh.",
              },
            ].map(({ icon: Icon, step, title, body }) => (
              <div key={title} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 font-heading text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    {step}
                  </div>
                  <Icon className="h-4 w-4 text-indigo-500" />
                  <h3 className="font-heading text-sm font-bold text-foreground">{title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Patterns */}
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-foreground mb-1">
            Popular Search Patterns
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Common word patterns players search for in word games:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Pattern", "Example Words", "Best For"].map((h) => (
                    <th key={h} className="py-2 pr-4 text-left font-heading text-xs uppercase tracking-wide text-muted-foreground">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {POPULAR_PATTERNS.map((p, i) => (
                  <tr key={p.pattern} className={`border-b border-border/40 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                    <td className="py-2.5 pr-4 font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400">{p.pattern}</td>
                    <td className="py-2.5 pr-4 text-muted-foreground">{p.example}</td>
                    <td className="py-2.5 text-muted-foreground">{p.useCase}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Letter Frequency */}
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-foreground mb-1">
            English Letter Frequency
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            How often each letter appears in English words — the most frequent letters are your best starting guesses.
          </p>
          <div className="space-y-1.5">
            {LETTER_FREQ.slice(0, 12).map((l) => (
              <div key={l.letter} className="flex items-center gap-3">
                <span className="w-6 font-mono text-sm font-bold text-foreground">{l.letter}</span>
                <div className="flex-1 h-4 rounded-full bg-muted/40 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all"
                    style={{ width: `${(l.pct / 11.2) * 100}%` }}
                  />
                </div>
                <span className="w-10 text-right text-xs text-muted-foreground">{l.pct}%</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Showing top 12. E, A, R, I, O are the five most common letters in English — any good opening guess covers at least 3 of these.
          </p>
        </section>

        {/* Prefixes & Suffixes */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-foreground mb-5">
            Common Prefixes &amp; Suffixes
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h3 className="font-heading text-sm font-bold text-foreground mb-4 uppercase tracking-wide">Common Prefixes</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["Prefix", "Meaning", "Examples"].map((h) => (
                      <th key={h} className="py-1.5 pr-3 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PREFIXES.map((p, i) => (
                    <tr key={p.affix} className={`border-b border-border/30 ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                      <td className="py-2 pr-3 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{p.affix}</td>
                      <td className="py-2 pr-3 text-xs text-muted-foreground">{p.meaning}</td>
                      <td className="py-2 text-xs text-muted-foreground">{p.examples}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h3 className="font-heading text-sm font-bold text-foreground mb-4 uppercase tracking-wide">Common Suffixes</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["Suffix", "Meaning", "Examples"].map((h) => (
                      <th key={h} className="py-1.5 pr-3 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SUFFIXES.map((p, i) => (
                    <tr key={p.affix} className={`border-b border-border/30 ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                      <td className="py-2 pr-3 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{p.affix}</td>
                      <td className="py-2 pr-3 text-xs text-muted-foreground">{p.meaning}</td>
                      <td className="py-2 text-xs text-muted-foreground">{p.examples}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Tips for Word Games */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
            Word Finder Tips for Popular Games
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            How to apply the Word Finder to specific games you play every day:
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: "🟩",
                game: "Wordle",
                href: "/wordle-solver",
                tips: [
                  "Set length to 5 letters",
                  "Position boxes = green letters",
                  "Contains = yellow letters",
                  "Exclude = gray letters",
                ],
              },
              {
                icon: "🔵",
                game: "NYT Strands",
                href: "/strands-hint-today",
                tips: [
                  "Try different lengths (4-11)",
                  "Use Contains for letters visible on grid",
                  "Cross-reference the theme clue",
                  "Look for -ING and -ED endings",
                ],
              },
              {
                icon: "🔤",
                game: "Scrabble & Crosswords",
                href: "/anagram-solver",
                tips: [
                  "Use position boxes for crossing letters",
                  "Filter by exact length constraint",
                  "High-value: Q, Z, X, J words",
                  "Use Ends With for open endings",
                ],
              },
            ].map(({ icon, game, href, tips }) => (
              <div key={game} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{icon}</span>
                  <h3 className="font-heading text-sm font-bold text-foreground">{game}</h3>
                </div>
                <ul className="space-y-1.5">
                  {tips.map((tip) => (
                    <li key={tip} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                      <Zap className="h-3 w-3 text-indigo-500 mt-0.5 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
                <Link href={href} className="mt-3 block text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                  Go to {game} →
                </Link>
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

        {/* About */}
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-foreground mb-3">
            About This Word Finder
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              This Word Finder searches a curated dictionary of common English words from 4 to 11 letters — the same word lists used in our Wordle variant games. The database includes thousands of everyday words: nouns, verbs, adjectives, and adverbs that appear regularly in word games. Obscure technical terms, proper nouns, and very rare words are generally excluded to keep results practical and game-relevant.
            </p>
            <p>
              The tool works entirely in your browser — no data is sent to any server. Searches run instantly against the local word list, so you get results without any loading time. All filtering (position, contains, excludes, prefix, suffix) is applied simultaneously on each search, giving you the most precise results possible with your constraints.
            </p>
            <p>
              For the best Wordle-specific assistance, try our dedicated{" "}
              <Link href="/wordle-solver" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                Wordle Solver
              </Link>{" "}
              which handles the green/yellow/gray color logic automatically. For anagrams and word unscrambling, use the{" "}
              <Link href="/anagram-solver" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                Anagram Solver
              </Link>
              .
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-gradient-to-br from-indigo-700 to-indigo-600 p-6 sm:p-8 text-center text-white">
          <h2 className="font-heading text-2xl font-bold">More Word Game Tools</h2>
          <p className="mt-2 text-sm text-indigo-100">
            Combine the Word Finder with our other tools for maximum word game coverage.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link href="/wordle-solver" className="rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-indigo-700 transition-all hover:bg-white/90">
              Wordle Solver
            </Link>
            <Link href="/anagram-solver" className="rounded-xl border-2 border-white/30 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-white/10">
              Anagram Solver
            </Link>
            <Link href="/strands-hint-today" className="rounded-xl border-2 border-white/30 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-white/10">
              <BookOpen className="inline h-4 w-4 mr-1" />
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
