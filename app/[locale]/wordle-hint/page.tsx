import { WordleMonthSection } from '@/components/wordle-hints/WordleMonthSection'
import { BASE_URL } from '@/config/site'
import { Locale, LOCALES } from '@/i18n/routing'
import {
  getAllWordles,
  getWordleAvailableMonths,
  getWordleCount,
  getLatestWordle,
} from '@/lib/wordle-hints-data'
import { breadcrumbSchema, JsonLd } from '@/lib/jsonld'
import { constructMetadata } from '@/lib/metadata'
import dayjs from 'dayjs'
import { ArrowRight, BookOpen, Calendar, Lightbulb, Target } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

type Params = Promise<{ locale: string }>

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params
  const count = await getWordleCount()

  return constructMetadata({
    page: 'WordleHintArchive',
    title: 'All NYT Wordle Answers & Hints Archive',
    description: `Browse all ${count || 'past'} NYT Wordle daily answers with progressive hints. Full archive organized by date — find any past Wordle word instantly.`,
    keywords: [
      'wordle archive',
      'wordle answers',
      'past wordle answers',
      'wordle hint archive',
      'nyt wordle answers',
      'wordle word list',
      'daily wordle archive',
    ],
    locale: locale as Locale,
    path: '/wordle-hint',
    canonicalUrl: '/wordle-hint',
  })
}

const TAG_LINKS = [
  { label: "Today's Wordle", href: '/wordle-hint-today' },
  { label: 'Wordle Solver', href: '/wordle-solver' },
  { label: 'Word Finder', href: '/word-finder' },
  { label: 'Strands Archive', href: '/strands-hint' },
  { label: 'Connections Archive', href: '/connections-hint' },
]

export default async function WordleHintArchivePage({ params }: { params: Params }) {
  await params
  const allPuzzles = await getAllWordles()
  const months = await getWordleAvailableMonths()
  const totalCount = await getWordleCount()
  const latestPuzzle = await getLatestWordle()

  const puzzlesByMonth = new Map<string, typeof allPuzzles>()
  for (const puzzle of allPuzzles) {
    const month = puzzle.printDate.slice(0, 7)
    if (!puzzlesByMonth.has(month)) {
      puzzlesByMonth.set(month, [])
    }
    puzzlesByMonth.get(month)!.push(puzzle)
  }

  return (
    <div className="w-full grid-bg">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <JsonLd
          data={breadcrumbSchema([
            { name: 'Home', url: BASE_URL },
            { name: 'Wordle Hint Archive', url: `${BASE_URL}/wordle-hint` },
          ])}
        />

        {/* Header */}
        <div className="mb-8 rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 p-8 text-white">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              Full Archive
            </span>
            {totalCount > 0 && (
              <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium">
                {totalCount} Puzzles
              </span>
            )}
          </div>
          <h1 className="font-heading text-3xl font-bold mb-3">
            NYT Wordle Answers &amp; Hints Archive
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl mb-6">
            Every past Wordle answer with progressive hints. Browse by month or search for a specific date.
          </p>
          <div className="flex flex-wrap gap-2">
            {TAG_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="rounded-full bg-white/15 px-3 py-1 text-sm text-white hover:bg-white/25 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {allPuzzles.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-emerald-400 mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Archive Coming Soon</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We&apos;re building our Wordle answer archive. Check back soon, or use our Wordle Solver while you wait.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/wordle-hint-today"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition-colors"
              >
                Today&apos;s Hints
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/wordle-solver"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-bold text-foreground hover:bg-muted transition-colors"
              >
                Wordle Solver
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Sidebar: Month Navigation */}
            <aside className="lg:col-span-1">
              <div className="sticky top-20 rounded-xl border border-border bg-card p-5">
                <h2 className="font-heading text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-emerald-600" />
                  Jump to Month
                </h2>
                <nav className="space-y-1 max-h-80 overflow-y-auto">
                  {months.map((ym) => (
                    <a
                      key={ym}
                      href={`#${ym}`}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      <span>{dayjs(ym + '-01').format('MMMM YYYY')}</span>
                      <span className="text-xs text-muted-foreground/60">
                        {puzzlesByMonth.get(ym)?.length || 0}
                      </span>
                    </a>
                  ))}
                </nav>

                <div className="mt-4 pt-4 border-t border-border space-y-2">
                  <Link
                    href="/wordle-hint-today"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                  >
                    <Lightbulb className="h-4 w-4" />
                    Today&apos;s Hints
                  </Link>
                  <Link
                    href="/wordle-solver"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 transition-colors"
                  >
                    <Target className="h-4 w-4" />
                    Wordle Solver
                  </Link>
                </div>
              </div>
            </aside>

            {/* Main: Monthly Sections */}
            <main className="lg:col-span-3 space-y-10">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {totalCount} answer{totalCount !== 1 ? 's' : ''} ·{' '}
                  {months.length} month{months.length !== 1 ? 's' : ''}
                </p>
                <Link
                  href="/wordle-hint-today"
                  className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-800"
                >
                  Today&apos;s Hints
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {months.map((ym) => {
                const monthPuzzles = puzzlesByMonth.get(ym) || []
                return (
                  <WordleMonthSection
                    key={ym}
                    yearMonth={ym}
                    puzzles={monthPuzzles}
                    latestId={latestPuzzle?.id}
                    showAnswers={true}
                  />
                )
              })}
            </main>
          </div>
        )}

        {/* About Section */}
        <section className="mt-12 rounded-xl border border-border bg-card p-8">
          <h2 className="font-heading text-xl font-bold text-foreground mb-4">
            About the Wordle Archive
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 text-sm text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Daily 5-Letter Words</h3>
              <p>
                Every day, NYT Wordle selects a new 5-letter English word as the answer. Our archive captures each daily answer and provides progressive hints so you can revisit any past puzzle.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Progressive Hints</h3>
              <p>
                Each archived puzzle includes five levels of hints — from letter count to full reveal. Use them to replay old puzzles with varying degrees of assistance, or study patterns.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Word Analysis</h3>
              <p>
                Every puzzle detail page includes a word analysis breakdown: vowel/consonant count, letter positions, and whether the word contains repeated letters — a common Wordle trap.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 p-8 text-white text-center">
          <h2 className="font-heading text-2xl font-bold mb-2">
            Try Today&apos;s Wordle Puzzle
          </h2>
          <p className="text-emerald-100 mb-5">
            Get progressive hints for today&apos;s answer — from subtle clues to full reveal.
          </p>
          <Link
            href="/wordle-hint-today"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-emerald-700 hover:bg-emerald-50 transition-colors"
          >
            Get Today&apos;s Hints
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
