import { WordleHintCard } from '@/components/wordle-hints/WordleHintCard'
import { WordleAnswerReveal } from '@/components/wordle-hints/WordleAnswerReveal'
import { WordlePuzzleCardCompact } from '@/components/wordle-hints/WordlePuzzleCard'
import { BASE_URL } from '@/config/site'
import { Locale, LOCALES } from '@/i18n/routing'
import { getLatestWordle, getRecentWordles } from '@/lib/wordle-hints-data'
import { analyzeWord, generateStrategyTips, generateFAQ } from '@/lib/wordle-analysis'
import { breadcrumbSchema, faqPageSchema, JsonLd } from '@/lib/jsonld'
import { constructMetadata } from '@/lib/metadata'
import dayjs from 'dayjs'
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Grid3X3,
  Lightbulb,
  Target,
  Trophy,
} from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

type Params = Promise<{ locale: string }>

// Revalidate every 60s so this page picks up new puzzle data from KV
export const revalidate = 60;

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params
  return constructMetadata({
    page: 'WordleHintToday',
    title: "Today's Wordle Hint & Answer — NYT Wordle",
    description:
      "Get progressive hints for today's NYT Wordle answer. Five levels of clues — from letter count to full reveal — without spoiling the puzzle. Updated daily.",
    keywords: [
      'wordle hint today',
      'wordle answer today',
      'nyt wordle hint',
      'wordle hints',
      'wordle help today',
      'daily wordle answer',
      'wordle clue today',
    ],
    locale: locale as Locale,
    path: '/wordle-hint-today',
    canonicalUrl: '/wordle-hint-today',
  })
}

const TOP_STARTING_WORDS = [
  { word: 'CRANE', reason: 'Covers C, R, A, N, E — five of the most common Wordle letters' },
  { word: 'SLATE', reason: 'S, L, A, T, E — great vowel and consonant spread' },
  { word: 'TRACE', reason: 'T, R, A, C, E — all unique high-frequency letters' },
  { word: 'ADIEU', reason: 'Covers four vowels at once: A, D, I, E, U' },
  { word: 'RAISE', reason: 'R, A, I, S, E — three vowels plus common consonants' },
  { word: 'STARE', reason: 'S, T, A, R, E — reliable opener used by many players' },
  { word: 'ARISE', reason: 'A, R, I, S, E — covers the top vowels efficiently' },
  { word: 'TEARS', reason: 'T, E, A, R, S — all very frequent in 5-letter words' },
]

// Evergreen questions about the game. Today's word-specific Q&A is generated
// per request and merged in below, so the list changes with each answer.
const GENERAL_FAQ_ITEMS = [
  {
    question: 'What time does the daily Wordle reset?',
    answer:
      "NYT Wordle resets every day at midnight in your local time zone. A new puzzle is available as soon as the clock hits midnight. Our hints are updated at the same time.",
  },
  {
    question: 'How many guesses do you get in Wordle?',
    answer:
      'You get 6 guesses in Wordle to find the 5-letter answer. Each guess must be a valid 5-letter English word. After each guess, tiles turn green (correct position), yellow (wrong position), or gray (not in word).',
  },
  {
    question: 'What is the best starting word for Wordle?',
    answer:
      "Popular starting words include CRANE, SLATE, TRACE, and RAISE. The best opener covers common letters (E, A, R, T, S, O, I, N) without repeating any. Avoid words with double letters on your first guess.",
  },
]

export default async function WordleHintTodayPage({ params }: { params: Params }) {
  await params
  const puzzle = await getLatestWordle()
  const recentPuzzles = await getRecentWordles(8)

  const formattedDate = puzzle ? dayjs(puzzle.printDate).format('MMMM D, YYYY') : 'Today'
  const analysis = puzzle ? analyzeWord(puzzle.answer) : null
  const strategyTips = puzzle ? generateStrategyTips(puzzle.answer) : []
  const faqItems = puzzle
    ? [...generateFAQ(puzzle), ...GENERAL_FAQ_ITEMS]
    : []

  const letterVariants = [4, 5, 6, 7, 8, 9, 10, 11]

  return (
    <div className="w-full grid-bg">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <JsonLd
          data={breadcrumbSchema([
            { name: 'Home', url: BASE_URL },
            { name: 'Wordle Hint Today', url: `${BASE_URL}/wordle-hint-today` },
          ])}
        />
        <JsonLd
          data={faqPageSchema(
            faqItems.map((f) => ({ question: f.question, answer: f.answer }))
          )}
        />

        {/* Header */}
        <div className="mb-8 rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 p-8 text-white">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium">
              NYT Wordle
            </span>
            {puzzle && (
              <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium">
                Puzzle #{puzzle.id}
              </span>
            )}
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formattedDate}
            </span>
          </div>
          <h1 className="font-heading text-3xl font-bold mb-3">
            Today&apos;s Wordle Hint &amp; Answer
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl mb-6">
            Five progressive hints — from letter count to full answer. Reveal only what you need without spoiling the fun.
          </p>

          {puzzle && analysis && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-lg bg-white/10 p-3">
                <p className="text-xs font-bold uppercase text-emerald-200">Letters</p>
                <p className="text-2xl font-bold">{puzzle.answer.length}</p>
              </div>
              <div className="rounded-lg bg-white/10 p-3">
                <p className="text-xs font-bold uppercase text-emerald-200">Vowels</p>
                <p className="text-2xl font-bold">{analysis.vowels}</p>
              </div>
              <div className="rounded-lg bg-white/10 p-3">
                <p className="text-xs font-bold uppercase text-emerald-200">Unique Letters</p>
                <p className="text-2xl font-bold">{analysis.unique}</p>
              </div>
              <div className="rounded-lg bg-white/10 p-3">
                <p className="text-xs font-bold uppercase text-emerald-200">Puzzle #</p>
                <p className="text-2xl font-bold">{puzzle.id}</p>
              </div>
            </div>
          )}
        </div>

        {!puzzle ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <Grid3X3 className="mx-auto h-12 w-12 text-emerald-400 mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Puzzle Data Coming Soon</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We&apos;re setting up Wordle puzzle data. Check back soon, or use our Wordle Solver in the meantime.
            </p>
            <Link
              href="/wordle-solver"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition-colors"
            >
              Try the Wordle Solver
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">

              {/* Progressive Hints */}
              <section>
                <h2 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Progressive Hints
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Reveal hints one at a time — each level gives a bit more away. Stop when you have enough to solve it yourself.
                </p>
                <WordleHintCard puzzle={puzzle} />
              </section>

              {/* Answer Reveal */}
              <section>
                <h2 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-emerald-600" />
                  Full Answer
                </h2>
                <WordleAnswerReveal puzzle={puzzle} />
              </section>

              {/* Word Analysis */}
              {analysis && (
                <section className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="px-6 py-4 border-b border-border">
                    <h2 className="font-heading text-lg font-bold text-foreground">
                      Word Analysis
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
                      {[
                        { label: 'Letters', value: puzzle.answer.length },
                        { label: 'Vowels', value: analysis.vowels },
                        { label: 'Consonants', value: analysis.consonants },
                        { label: 'Unique', value: analysis.unique },
                      ].map((stat) => (
                        <div key={stat.label} className="rounded-lg bg-emerald-50 p-3 text-center">
                          <p className="text-2xl font-bold text-emerald-700">{stat.value}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="px-4 py-2 text-left font-semibold text-foreground">Position</th>
                            <th className="px-4 py-2 text-left font-semibold text-foreground">Letter</th>
                            <th className="px-4 py-2 text-left font-semibold text-foreground">Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {puzzle.answer.split('').map((letter, i) => {
                            const isVowel = 'AEIOU'.includes(letter)
                            return (
                              <tr key={i} className="border-t border-border">
                                <td className="px-4 py-2 text-muted-foreground">Position {i + 1}</td>
                                <td className="px-4 py-2 font-bold text-foreground uppercase">{letter}</td>
                                <td className="px-4 py-2">
                                  <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${isVowel ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {isVowel ? 'Vowel' : 'Consonant'}
                                  </span>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                    {analysis.hasDouble && (
                      <p className="mt-3 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                        ⚠️ This word contains a repeated letter — a common Wordle trap!
                      </p>
                    )}
                  </div>
                </section>
              )}

              {/* Strategy Tips */}
              <section className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">
                  Strategy Tips for Today
                </h2>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {strategyTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Best Starting Words */}
              <section className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <h2 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Best Starting Words
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-3 text-left font-semibold text-foreground">#</th>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">Word</th>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">Why It Works</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TOP_STARTING_WORDS.map((w, i) => (
                        <tr key={w.word} className="border-t border-border hover:bg-muted/30">
                          <td className="px-4 py-3 text-muted-foreground font-medium">{i + 1}</td>
                          <td className="px-4 py-3">
                            <span className="font-bold text-emerald-700 font-mono uppercase tracking-wider">
                              {w.word}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{w.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* FAQ */}
              <section className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">
                  Frequently Asked Questions
                </h2>
                <div className="divide-y divide-border">
                  {faqItems.map((item, i) => (
                    <details key={i} className="group py-4 first:pt-0 last:pb-0">
                      <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm font-semibold text-foreground hover:text-emerald-600 list-none">
                        {item.question}
                        <span className="shrink-0 text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>

              {/* Play Wordle Variants */}
              <section className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-heading text-xl font-bold text-foreground mb-2">
                  Play Wordle with Different Word Lengths
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Want more challenge? Try Wordle variants with 4 to 11 letters — each with a different word list and difficulty level.
                </p>
                <div className="flex flex-wrap gap-2">
                  {letterVariants.map((n) => (
                    <Link
                      key={n}
                      href={`/${n}-letters`}
                      className="rounded-lg border border-border bg-muted/30 px-4 py-2 text-sm font-semibold text-foreground hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-colors"
                    >
                      {n} Letters
                    </Link>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Quick Links */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-heading text-sm font-bold text-foreground mb-3">
                  Quick Links
                </h3>
                <nav className="space-y-1">
                  {[
                    { href: '/wordle-hint', label: 'Wordle Archive', icon: BookOpen },
                    { href: '/wordle-solver', label: 'Wordle Solver', icon: Target },
                    { href: '/strands-hint-today', label: "Today's Strands", icon: Grid3X3 },
                    { href: '/connections-hint-today', label: "Today's Connections", icon: Grid3X3 },
                  ].map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Recent Puzzles */}
              {recentPuzzles.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="font-heading text-sm font-bold text-foreground mb-3">
                    Recent Answers
                  </h3>
                  <div className="space-y-1">
                    {recentPuzzles.slice(0, 6).map((p) => (
                      <WordlePuzzleCardCompact key={p.printDate} puzzle={p} />
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-border">
                    <Link
                      href="/wordle-hint"
                      className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-800"
                    >
                      View full archive
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )}

              {/* About Wordle */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-heading text-sm font-bold text-foreground mb-3">
                  About NYT Wordle
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  Wordle is the daily 5-letter word game by The New York Times. You have 6 guesses to find the hidden word. Color-coded feedback guides each guess.
                </p>
                <Link
                  href="/wordle-solver"
                  className="text-xs font-medium text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
                >
                  Try our Wordle Solver →
                </Link>
              </div>
            </aside>
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 p-8 text-white text-center">
          <h2 className="font-heading text-2xl font-bold mb-2">
            Also Try NYT Strands &amp; Connections
          </h2>
          <p className="text-emerald-100 mb-5 max-w-lg mx-auto">
            Explore more daily NYT word puzzles — Strands and Connections — with full hint archives and progressive clue systems.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/strands-hint-today"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              Strands Hints
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/connections-hint-today"
              className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-6 py-3 text-sm font-bold text-white hover:bg-white/30 transition-colors"
            >
              Connections Hints
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
