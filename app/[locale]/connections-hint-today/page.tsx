import { ConnectionsHintCard } from '@/components/connections/ConnectionsHintCard'
import { ConnectionsAnswerReveal } from '@/components/connections/ConnectionsAnswerReveal'
import { ConnectionsGrid } from '@/components/connections/ConnectionsGrid'
import { ConnectionsPuzzleCardCompact } from '@/components/connections/ConnectionsPuzzleCard'
import { BASE_URL } from '@/config/site'
import { Locale, LOCALES } from '@/i18n/routing'
import {
  getLatestConnections,
  getRecentConnections,
} from '@/lib/connections-data'
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
    page: 'ConnectionsHintToday',
    title: "Today's NYT Connections Hints & Answers",
    description:
      "Get progressive hints and answers for today's NYT Connections puzzle. Hints for all four categories — Yellow, Green, Blue, and Purple — without spoiling the fun.",
    keywords: [
      'connections hint today',
      'nyt connections hint',
      'connections hints',
      'connections answer today',
      'nyt connections today',
      'connections puzzle hints',
      'connections categories',
    ],
    locale: locale as Locale,
    path: '/connections-hint-today',
    canonicalUrl: '/connections-hint-today',
  })
}

const FAQ_ITEMS = [
  {
    question: 'What is NYT Connections?',
    answer:
      'NYT Connections is a daily word puzzle by The New York Times. You are given 16 words and must sort them into 4 groups of 4 that share a common connection. Categories are color-coded by difficulty: Yellow (easiest), Green, Blue, and Purple (hardest).',
  },
  {
    question: 'How do I use these hints without spoiling the puzzle?',
    answer:
      'Our hints are revealed progressively. Each hint button reveals only one level at a time. Start with Hint 1 (category count) and reveal more only when you need help. The full answers are always behind a reveal button.',
  },
  {
    question: 'What time does the daily Connections puzzle reset?',
    answer:
      'A new NYT Connections puzzle is released every day at midnight Eastern Time (ET). Our hints are published shortly after the new puzzle goes live.',
  },
  {
    question: 'What makes a category Purple difficulty?',
    answer:
      "Purple (difficulty 3) is the hardest category in each Connections puzzle. These groups typically involve tricky wordplay, unusual associations, or words that seem to belong to other categories — they're designed to trip you up.",
  },
  {
    question: 'Can I see yesterday\'s Connections answer?',
    answer:
      "Yes — visit our Connections archive page to browse past puzzles with full answers, or check the archive for yesterday's specific date.",
  },
]

export default async function ConnectionsHintTodayPage({ params }: { params: Params }) {
  await params
  const puzzle = await getLatestConnections()
  const recentPuzzles = await getRecentConnections(8)

  const formattedDate = puzzle ? dayjs(puzzle.printDate).format('MMMM D, YYYY') : 'Today'
  const sorted = puzzle
    ? [...puzzle.categories].sort((a, b) => a.difficulty - b.difficulty)
    : []

  return (
    <div className="w-full grid-bg">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <JsonLd
          data={breadcrumbSchema([
            { name: 'Home', url: BASE_URL },
            { name: 'Connections Hint Today', url: `${BASE_URL}/connections-hint-today` },
          ])}
        />
        {puzzle && (
          <JsonLd
            data={faqPageSchema(
              FAQ_ITEMS.map((f) => ({ question: f.question, answer: f.answer }))
            )}
          />
        )}

        {/* ── Header ───────────────────────────────────── */}
        <div className="mb-8 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 p-8 text-white">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium">
              NYT Connections
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
            Today&apos;s Connections Hints &amp; Answers
          </h1>
          <p className="text-purple-100 text-lg max-w-2xl">
            Progressive hints for all four categories — from vague nudges to full answers. Reveal only what you need.
          </p>

          {puzzle && (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {sorted.map((cat) => {
                const colors = { 0: 'bg-yellow-400 text-yellow-900', 1: 'bg-green-500 text-white', 2: 'bg-blue-500 text-white', 3: 'bg-purple-400 text-white' }
                const labels = { 0: 'Yellow', 1: 'Green', 2: 'Blue', 3: 'Purple' }
                return (
                  <div key={cat.difficulty} className={`rounded-lg p-3 ${colors[cat.difficulty]}`}>
                    <p className="text-xs font-bold uppercase">{labels[cat.difficulty as 0 | 1 | 2 | 3]}</p>
                    <p className="text-xs mt-0.5 opacity-80 line-clamp-2">{cat.title}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {!puzzle ? (
          /* No data yet */
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <Grid3X3 className="mx-auto h-12 w-12 text-purple-400 mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Puzzle Data Coming Soon</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We&apos;re setting up Connections puzzle data. Check back soon for today&apos;s hints and answers.
            </p>
            <Link
              href="/how-to-play-connections"
              className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-purple-700 transition-colors"
            >
              Learn How to Play Connections
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
                <ConnectionsHintCard puzzle={puzzle} />
              </section>

              {/* Category Reveals */}
              <section>
                <h2 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Category Answers
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Click each category to reveal its title and the four words that belong to it.
                </p>
                <ConnectionsAnswerReveal puzzle={puzzle} />
              </section>

              {/* Solved Grid */}
              <section>
                <h2 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Grid3X3 className="h-5 w-5 text-purple-600" />
                  Solved Grid
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  The complete puzzle solution showing all four categories and their 16 words.
                </p>
                <ConnectionsGrid puzzle={puzzle} />
              </section>

              {/* Strategy Section */}
              <section className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">
                  How to Solve Today&apos;s Puzzle
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    {
                      title: 'Start with Yellow',
                      desc: "The Yellow category is always the easiest. Identify it first to reduce the remaining 12 words you need to sort.",
                    },
                    {
                      title: 'Watch for Traps',
                      desc: "Some words could fit multiple categories. The Purple group often contains words that seem to belong elsewhere — this is intentional misdirection.",
                    },
                    {
                      title: 'Look for Patterns',
                      desc: "Categories often follow patterns: things that follow a word, things preceded by a word, or items in a hidden category (e.g., all types of a specific thing).",
                    },
                    {
                      title: 'Use Process of Elimination',
                      desc: "Once you've identified Yellow and Green confidently, the remaining 8 words split into Blue and Purple — making the harder ones more manageable.",
                    },
                  ].map((tip) => (
                    <div key={tip.title} className="rounded-lg bg-purple-50 p-4">
                      <h3 className="text-sm font-bold text-purple-900 mb-1">{tip.title}</h3>
                      <p className="text-sm text-muted-foreground">{tip.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Category Breakdown Table */}
              <section className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <h2 className="font-heading text-lg font-bold text-foreground">
                    Today&apos;s Category Breakdown
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-3 text-left font-semibold text-foreground">Color</th>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">Category Theme</th>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">Difficulty</th>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">Word Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sorted.map((cat, i) => {
                        const diffLabels = ['Easiest', 'Easy', 'Hard', 'Hardest']
                        const colorDots = ['bg-yellow-400', 'bg-green-500', 'bg-blue-500', 'bg-purple-600']
                        return (
                          <tr key={i} className="border-t border-border hover:bg-muted/30">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className={`h-3 w-3 rounded-full ${colorDots[cat.difficulty]}`} />
                                <span className="font-medium capitalize">
                                  {['Yellow', 'Green', 'Blue', 'Purple'][cat.difficulty]}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 font-semibold text-foreground">{cat.title}</td>
                            <td className="px-4 py-3 text-muted-foreground">{diffLabels[cat.difficulty]}</td>
                            <td className="px-4 py-3 text-muted-foreground">{cat.cards.length} words</td>
                          </tr>
                        )
                      })}
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
                  {FAQ_ITEMS.map((item, i) => (
                    <details key={i} className="group py-4 first:pt-0 last:pb-0">
                      <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm font-semibold text-foreground hover:text-purple-600 list-none">
                        {item.question}
                        <span className="shrink-0 text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
                    </details>
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
                    { href: '/connections-hint', label: 'Full Archive', icon: BookOpen },
                    { href: '/how-to-play-connections', label: 'How to Play', icon: Target },
                    { href: '/strands-hint-today', label: "Today's Strands", icon: Grid3X3 },
                  ].map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-purple-50 hover:text-purple-700"
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
                    Recent Puzzles
                  </h3>
                  <div className="space-y-1">
                    {recentPuzzles.slice(0, 6).map((p) => (
                      <ConnectionsPuzzleCardCompact key={p.printDate} puzzle={p} />
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-border">
                    <Link
                      href="/connections-hint"
                      className="flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-800"
                    >
                      View full archive
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )}

              {/* About Connections */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-heading text-sm font-bold text-foreground mb-3">
                  About NYT Connections
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  NYT Connections is a daily word puzzle where you group 16 words into 4 categories of 4. Categories are color-coded by difficulty.
                </p>
                <Link
                  href="/how-to-play-connections"
                  className="text-xs font-medium text-purple-600 hover:text-purple-800 flex items-center gap-1"
                >
                  Learn how to play →
                </Link>
              </div>
            </aside>
          </div>
        )}

        {/* CTA Banner */}
        <div className="mt-10 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white text-center">
          <h2 className="font-heading text-2xl font-bold mb-2">
            Also Play NYT Strands
          </h2>
          <p className="text-purple-100 mb-5 max-w-lg mx-auto">
            Try Strands — another daily NYT word puzzle where you find theme words and the Spangram on a 6×8 letter grid.
          </p>
          <Link
            href="/strands-hint-today"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-purple-700 hover:bg-purple-50 transition-colors"
          >
            Get Today&apos;s Strands Hints
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
