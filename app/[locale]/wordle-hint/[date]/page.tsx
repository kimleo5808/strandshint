import { WordleHintCard } from '@/components/wordle-hints/WordleHintCard'
import { WordleAnswerReveal } from '@/components/wordle-hints/WordleAnswerReveal'
import { WordlePuzzleCardCompact } from '@/components/wordle-hints/WordlePuzzleCard'
import { BASE_URL } from '@/config/site'
import { Locale, LOCALES } from '@/i18n/routing'
import {
  getAllWordles,
  getWordleByDate,
  getRecentWordles,
} from '@/lib/wordle-hints-data'
import { articleSchema, breadcrumbSchema, faqPageSchema, JsonLd } from '@/lib/jsonld'
import { constructMetadata } from '@/lib/metadata'
import dayjs from 'dayjs'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  Lightbulb,
  Target,
} from 'lucide-react'
import { analyzeWord, generateFAQ } from '@/lib/wordle-analysis'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type Params = Promise<{ locale: string; date: string }>

// Revalidate every 60s so this page picks up new puzzle data from KV
export const revalidate = 60;

export async function generateStaticParams() {
  const allPuzzles = await getAllWordles()
  // Prerender only the 60 most recent dates; older archive dates render
  // on-demand via ISR + dynamicParams. Keeps the build-time R2 cache upload
  // bounded instead of growing by one page per day forever.
  return LOCALES.flatMap((locale) =>
    allPuzzles.slice(0, 60).map((puzzle) => ({ locale, date: puzzle.printDate }))
  )
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, date } = await params
  const puzzle = await getWordleByDate(date)
  const formattedDate = dayjs(date).format('MMMM D, YYYY')

  return constructMetadata({
    page: 'WordleHintDate',
    title: puzzle
      ? `Wordle Answer ${formattedDate} — Puzzle #${puzzle.id} Hints`
      : `Wordle Hints for ${formattedDate}`,
    description: puzzle
      ? `Progressive hints and the full answer for NYT Wordle #${puzzle.id} on ${formattedDate}. Five clue levels — from letter count to the complete 5-letter word.`
      : `View hints and the answer for the NYT Wordle puzzle from ${formattedDate}.`,
    keywords: [
      `wordle answer ${formattedDate}`,
      `wordle ${date}`,
      'nyt wordle answer',
      'wordle hint',
      `wordle puzzle ${puzzle?.id ?? ''}`,
    ],
    locale: locale as Locale,
    path: `/wordle-hint/${date}`,
    canonicalUrl: `/wordle-hint/${date}`,
  })
}

// Evergreen Wordle questions, merged with the per-word FAQ generated below.
const WORDLE_GENERAL_FAQ = [
  {
    question: 'What is the best first guess for Wordle?',
    answer:
      'Top starting words include CRANE, SLATE, TRACE, RAISE, and ADIEU. The best openers cover common letters (E, A, R, T, S, O, I, N) without repeating any letter, maximizing the information you gain from the first guess.',
  },
  {
    question: 'How does the color-coded feedback work in Wordle?',
    answer:
      'Green means the letter is in the correct position. Yellow means the letter is in the word but in the wrong position. Gray means the letter is not in the word at all. Use this feedback to narrow down the answer.',
  },
]

export default async function WordleHintDatePage({ params }: { params: Params }) {
  const { date } = await params
  const puzzle = await getWordleByDate(date)

  if (!puzzle) notFound()

  const formattedDate = dayjs(date).format('MMMM D, YYYY')
  const word = puzzle.answer.toUpperCase()
  const analysis = analyzeWord(word)
  const faqItems = [...generateFAQ(puzzle), ...WORDLE_GENERAL_FAQ]
  const recentPuzzles = await getRecentWordles(6)

  const allPuzzles = await getAllWordles() // newest first
  const currentIdx = allPuzzles.findIndex((p) => p.printDate === date)
  const prevPuzzle = currentIdx >= 0 ? allPuzzles[currentIdx + 1] : undefined
  const nextPuzzle = currentIdx > 0 ? allPuzzles[currentIdx - 1] : undefined

  return (
    <div className="w-full grid-bg">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <JsonLd
          data={breadcrumbSchema([
            { name: 'Home', url: BASE_URL },
            { name: 'Wordle Archive', url: `${BASE_URL}/wordle-hint` },
            { name: `Wordle ${formattedDate}`, url: `${BASE_URL}/wordle-hint/${date}` },
          ])}
        />
        <JsonLd
          data={faqPageSchema(
            faqItems.map((f) => ({ question: f.question, answer: f.answer }))
          )}
        />
        <JsonLd
          data={articleSchema({
            title: `NYT Wordle Answer — ${formattedDate} (Puzzle #${puzzle.id})`,
            description: `The complete answer and progressive hints for NYT Wordle Puzzle #${puzzle.id} from ${formattedDate}.`,
            url: `${BASE_URL}/wordle-hint/${date}`,
            datePublished: date,
            dateModified: date,
          })}
        />

        {/* Header */}
        <div className="mb-8 rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 p-8 text-white">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Link
              href="/wordle-hint"
              className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-sm hover:bg-white/25 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Archive
            </Link>
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium">
              Puzzle #{puzzle.id}
            </span>
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formattedDate}
            </span>
          </div>
          <h1 className="font-heading text-3xl font-bold mb-3">
            Wordle Answer — {formattedDate}
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl mb-5">
            Progressive hints for Wordle #{puzzle.id}. Reveal clues one at a time, or jump straight to the full answer.
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Letters', value: word.length },
              { label: 'Vowels', value: analysis.vowels },
              { label: 'Unique Letters', value: analysis.unique },
              { label: 'Puzzle #', value: puzzle.id },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg bg-white/10 p-3">
                <p className="text-xs font-bold uppercase text-emerald-200">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">

            {/* Progressive Hints */}
            <section>
              <h2 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Progressive Hints
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Reveal clues one at a time. Each hint gives a little more away — stop when you have enough to solve it yourself.
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
            <section className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Word Analysis: {word}
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
                  {[
                    { label: 'Total Letters', value: word.length, color: 'bg-emerald-50 text-emerald-700' },
                    { label: 'Vowels', value: analysis.vowels, color: 'bg-amber-50 text-amber-700' },
                    { label: 'Consonants', value: analysis.consonants, color: 'bg-blue-50 text-blue-700' },
                    { label: 'Unique Letters', value: analysis.unique, color: 'bg-purple-50 text-purple-700' },
                  ].map((stat) => (
                    <div key={stat.label} className={`rounded-lg p-3 text-center ${stat.color}`}>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs mt-0.5 opacity-80">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-2.5 text-left font-semibold text-foreground">Position</th>
                        <th className="px-4 py-2.5 text-left font-semibold text-foreground">Letter</th>
                        <th className="px-4 py-2.5 text-left font-semibold text-foreground">Type</th>
                        <th className="px-4 py-2.5 text-left font-semibold text-foreground">Frequency Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {word.split('').map((letter, i) => {
                        const isVowel = 'AEIOU'.includes(letter)
                        const commonVowels = ['E', 'A']
                        const commonConsonants = ['T', 'R', 'S', 'N', 'L']
                        const isCommon = commonVowels.includes(letter) || commonConsonants.includes(letter)
                        return (
                          <tr key={i} className="border-t border-border hover:bg-muted/30">
                            <td className="px-4 py-2.5 text-muted-foreground">
                              {['1st', '2nd', '3rd', '4th', '5th'][i]}
                            </td>
                            <td className="px-4 py-2.5">
                              <span className="font-bold text-lg text-foreground font-mono">{letter}</span>
                            </td>
                            <td className="px-4 py-2.5">
                              <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${isVowel ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                {isVowel ? 'Vowel' : 'Consonant'}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-muted-foreground text-xs">
                              {isCommon ? 'Very common in Wordle answers' : 'Less frequent letter'}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {analysis.hasDouble && (
                  <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
                    <p className="text-sm font-semibold text-amber-800 mb-1">
                      ⚠️ Repeated Letter Alert
                    </p>
                    <p className="text-sm text-amber-700">
                      This word contains a repeated letter ({analysis.repeatedLetters.join(', ')}). Many players miss repeated letters because they assume all letters in a Wordle answer are unique — this is a classic trap!
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Letter Breakdown Visual */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-heading text-xl font-bold text-foreground mb-4">
                Letter Breakdown
              </h2>
              <div className="flex gap-2 justify-center flex-wrap">
                {word.split('').map((letter, i) => {
                  const isVowel = 'AEIOU'.includes(letter)
                  return (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div
                        className={`flex h-16 w-16 items-center justify-center rounded-lg text-2xl font-bold ${
                          isVowel ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
                        }`}
                      >
                        {letter}
                      </div>
                      <span className="text-xs text-muted-foreground">Pos {i + 1}</span>
                      <span className="text-xs font-medium text-muted-foreground">
                        {isVowel ? 'V' : 'C'}
                      </span>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 flex justify-center gap-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-sm bg-amber-500" />
                  Vowel
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-sm bg-emerald-500" />
                  Consonant
                </span>
              </div>
            </section>

            {/* Solving Strategy */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-heading text-xl font-bold text-foreground mb-4">
                How to Solve This Word
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  {
                    title: 'Opener Approach',
                    desc: `Starting with CRANE or SLATE would reveal ${word.split('').filter((l) => 'CRANES LATED'.includes(l)).length > 0 ? 'some' : 'few'} letters in ${word}. Good openers expose common letters quickly.`,
                  },
                  {
                    title: 'Vowel Strategy',
                    desc: `${word} has ${analysis.vowels} vowel${analysis.vowels !== 1 ? 's' : ''}. ${analysis.vowels >= 3 ? 'With 3+ vowels, a vowel-heavy guess like ADIEU helps early.' : 'With fewer vowels, focus on consonant-rich guesses after your opener.'}`,
                  },
                  {
                    title: 'Pattern Recognition',
                    desc: `Once you know ${word[0]} is the starting letter, think of all common 5-letter words beginning with ${word[0]}. This narrows the field significantly.`,
                  },
                  {
                    title: 'Elimination Method',
                    desc: `Each green or yellow tile eliminates hundreds of possibilities. After 2-3 good guesses, the remaining candidates are usually manageable to work through logically.`,
                  },
                ].map((tip) => (
                  <div key={tip.title} className="rounded-lg bg-emerald-50 p-4">
                    <h3 className="text-sm font-bold text-emerald-900 mb-1">{tip.title}</h3>
                    <p className="text-sm text-muted-foreground">{tip.desc}</p>
                  </div>
                ))}
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

            {/* Prev / Next Navigation */}
            <div className="flex items-center justify-between gap-4">
              {prevPuzzle ? (
                <Link
                  href={`/wordle-hint/${prevPuzzle.printDate}`}
                  className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <div>
                    <p className="text-xs text-muted-foreground">Previous</p>
                    <p>{dayjs(prevPuzzle.printDate).format('MMM D, YYYY')}</p>
                  </div>
                </Link>
              ) : <div />}
              {nextPuzzle ? (
                <Link
                  href={`/wordle-hint/${nextPuzzle.printDate}`}
                  className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
                >
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Next</p>
                    <p>{dayjs(nextPuzzle.printDate).format('MMM D, YYYY')}</p>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : <div />}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Quick Links */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-heading text-sm font-bold text-foreground mb-3">Quick Links</h3>
              <nav className="space-y-1">
                {[
                  { href: '/wordle-hint-today', label: "Today's Wordle", icon: Lightbulb },
                  { href: '/wordle-hint', label: 'Full Archive', icon: BookOpen },
                  { href: '/wordle-solver', label: 'Wordle Solver', icon: Target },
                  { href: '/strands-hint-today', label: "Today's Strands", icon: Lightbulb },
                  { href: '/connections-hint-today', label: "Today's Connections", icon: Lightbulb },
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
                  {recentPuzzles.map((p) => (
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

            {/* Puzzle Info */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-heading text-sm font-bold text-foreground mb-3">Puzzle Info</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Puzzle #</dt>
                  <dd className="font-semibold">{puzzle.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Date</dt>
                  <dd className="font-semibold">{dayjs(date).format('MMM D, YYYY')}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Letters</dt>
                  <dd className="font-semibold">{word.length}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Vowels</dt>
                  <dd className="font-semibold">{analysis.vowels}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Unique Letters</dt>
                  <dd className="font-semibold">{analysis.unique}</dd>
                </div>
                {puzzle.editor && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Editor</dt>
                    <dd className="font-semibold">{puzzle.editor}</dd>
                  </div>
                )}
              </dl>
            </div>
          </aside>
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 p-8 text-white text-center">
          <h2 className="font-heading text-2xl font-bold mb-2">Browse More Wordle Answers</h2>
          <p className="text-emerald-100 mb-5">
            Explore our full archive of past Wordle answers with hints and word analysis.
          </p>
          <Link
            href="/wordle-hint"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-emerald-700 hover:bg-emerald-50 transition-colors"
          >
            View Full Archive
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
