import { ConnectionsMonthSection } from '@/components/connections/ConnectionsMonthSection'
import { BASE_URL } from '@/config/site'
import { Locale, LOCALES } from '@/i18n/routing'
import {
  getAllConnections,
  getConnectionsAvailableMonths,
  getConnectionsCount,
  getLatestConnections,
} from '@/lib/connections-data'
import { breadcrumbSchema, JsonLd } from '@/lib/jsonld'
import { constructMetadata } from '@/lib/metadata'
import dayjs from 'dayjs'
import { ArrowRight, BookOpen, Calendar, Grid3X3, Lightbulb } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

type Params = Promise<{ locale: string }>

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params
  const count = await getConnectionsCount()

  return constructMetadata({
    page: 'ConnectionsArchive',
    title: 'All NYT Connections Hints & Answers Archive',
    description: `Browse all ${count || 'past'} NYT Connections puzzle hints and answers. Progressive clues for all four categories, organized by date. Updated daily.`,
    keywords: [
      'connections hint',
      'nyt connections hints',
      'connections answers',
      'connections archive',
      'nyt connections answers',
      'connections puzzle archive',
    ],
    locale: locale as Locale,
    path: '/connections-hint',
    canonicalUrl: '/connections-hint',
  })
}

const TAG_LINKS = [
  { label: "Today's Connections", href: '/connections-hint-today' },
  { label: 'How to Play', href: '/how-to-play-connections' },
  { label: 'Strands Archive', href: '/strands-hint' },
  { label: 'Strands Today', href: '/strands-hint-today' },
]

export default async function ConnectionsHintArchivePage({ params }: { params: Params }) {
  await params
  const allPuzzles = await getAllConnections()
  const months = await getConnectionsAvailableMonths()
  const totalCount = await getConnectionsCount()
  const latestPuzzle = await getLatestConnections()

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
            { name: 'Connections Hint Archive', url: `${BASE_URL}/connections-hint` },
          ])}
        />

        {/* Header */}
        <div className="mb-8 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-900 p-8 text-white">
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
            NYT Connections Hints &amp; Answers Archive
          </h1>
          <p className="text-purple-100 text-lg max-w-2xl mb-6">
            Browse every past NYT Connections puzzle with progressive hints and full answers for all four categories.
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
          /* No puzzles yet */
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <Grid3X3 className="mx-auto h-12 w-12 text-purple-400 mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Archive Coming Soon</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We&apos;re building our Connections puzzle archive. Check back soon, or explore our Strands archive in the meantime.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/connections-hint-today"
                className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-purple-700 transition-colors"
              >
                Today&apos;s Hints
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/strands-hint"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-bold text-foreground hover:bg-muted transition-colors"
              >
                Strands Archive
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Sidebar: Month Navigation */}
            <aside className="lg:col-span-1">
              <div className="sticky top-20 rounded-xl border border-border bg-card p-5">
                <h2 className="font-heading text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  Jump to Month
                </h2>
                <nav className="space-y-1 max-h-80 overflow-y-auto">
                  {months.map((ym) => (
                    <a
                      key={ym}
                      href={`#${ym}`}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-purple-50 hover:text-purple-700"
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
                    href="/connections-hint-today"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
                  >
                    <Lightbulb className="h-4 w-4" />
                    Today&apos;s Hints
                  </Link>
                  <Link
                    href="/how-to-play-connections"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 transition-colors"
                  >
                    How to Play
                  </Link>
                </div>
              </div>
            </aside>

            {/* Main: Monthly Sections */}
            <main className="lg:col-span-3 space-y-10">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {totalCount} puzzle{totalCount !== 1 ? 's' : ''} ·{' '}
                  {months.length} month{months.length !== 1 ? 's' : ''}
                </p>
                <Link
                  href="/connections-hint-today"
                  className="flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-800"
                >
                  Today&apos;s Hints
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {months.map((ym) => {
                const monthPuzzles = puzzlesByMonth.get(ym) || []
                return (
                  <ConnectionsMonthSection
                    key={ym}
                    yearMonth={ym}
                    puzzles={monthPuzzles}
                    latestId={latestPuzzle?.id}
                  />
                )
              })}
            </main>
          </div>
        )}

        {/* About Section */}
        <section className="mt-12 rounded-xl border border-border bg-card p-8">
          <h2 className="font-heading text-xl font-bold text-foreground mb-4">
            About NYT Connections
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 text-sm text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Four Categories, 16 Words</h3>
              <p>
                Each daily Connections puzzle presents 16 words that you must sort into exactly 4 groups of 4. Every word belongs to one — and only one — category.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Color-Coded Difficulty</h3>
              <p>
                Categories are ranked from Yellow (easiest) to Purple (hardest). The Yellow group is usually straightforward; Purple often involves clever wordplay or surprising connections.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Progressive Hints</h3>
              <p>
                Our hint system gives you five levels of help — from general category counts to full answers — so you can choose exactly how much assistance you need without spoiling the puzzle.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white text-center">
          <h2 className="font-heading text-2xl font-bold mb-2">
            Try Today&apos;s Connections Puzzle
          </h2>
          <p className="text-purple-100 mb-5">
            Get progressive hints for today&apos;s puzzle — no spoilers unless you want them.
          </p>
          <Link
            href="/connections-hint-today"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-purple-700 hover:bg-purple-50 transition-colors"
          >
            Get Today&apos;s Hints
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
