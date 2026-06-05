import { ConnectionsHintCard } from '@/components/connections/ConnectionsHintCard'
import { ConnectionsAnswerReveal } from '@/components/connections/ConnectionsAnswerReveal'
import { ConnectionsGrid } from '@/components/connections/ConnectionsGrid'
import { ConnectionsPuzzleCardCompact } from '@/components/connections/ConnectionsPuzzleCard'
import { BASE_URL } from '@/config/site'
import { Locale, LOCALES } from '@/i18n/routing'
import {
  getAllConnections,
  getConnectionsByDate,
  getRecentConnections,
} from '@/lib/connections-data'
import { articleSchema, breadcrumbSchema, faqPageSchema, JsonLd } from '@/lib/jsonld'
import { constructMetadata } from '@/lib/metadata'
import dayjs from 'dayjs'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  Grid3X3,
  Lightbulb,
  Target,
} from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type Params = Promise<{ locale: string; date: string }>

// Revalidate every 30 min so this page picks up new puzzle data from KV
export const revalidate = 1800;

export async function generateStaticParams() {
  const allPuzzles = await getAllConnections()
  return LOCALES.flatMap((locale) =>
    allPuzzles.map((puzzle) => ({ locale, date: puzzle.printDate }))
  )
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, date } = await params
  const puzzle = await getConnectionsByDate(date)

  if (!puzzle) {
    return constructMetadata({
      page: 'ConnectionsHintDate',
      title: `Connections Hints for ${date}`,
      description: `View hints and answers for the NYT Connections puzzle from ${date}.`,
      locale: locale as Locale,
      path: `/connections-hint/${date}`,
      canonicalUrl: `/connections-hint/${date}`,
    })
  }

  const formattedDate = dayjs(date).format('MMMM D, YYYY')
  return constructMetadata({
    page: 'ConnectionsHintDate',
    title: `NYT Connections Hints ${formattedDate} — Puzzle #${puzzle.id}`,
    description: `Hints and answers for NYT Connections Puzzle #${puzzle.id} on ${formattedDate}. Progressive clues for all four categories — Yellow, Green, Blue, and Purple.`,
    keywords: [
      `connections hints ${formattedDate}`,
      `connections ${date} answer`,
      'nyt connections hints',
      `connections puzzle ${puzzle.id}`,
      'connections answer today',
    ],
    locale: locale as Locale,
    path: `/connections-hint/${date}`,
    canonicalUrl: `/connections-hint/${date}`,
  })
}

function generateFAQ(puzzle: NonNullable<Awaited<ReturnType<typeof getConnectionsByDate>>>) {
  const sorted = [...puzzle.categories].sort((a, b) => a.difficulty - b.difficulty)
  return [
    {
      question: `How many categories are in Connections Puzzle #${puzzle.id}?`,
      answer: `Like all NYT Connections puzzles, Puzzle #${puzzle.id} has exactly 4 categories with 4 words each, for a total of 16 words to sort.`,
    },
    {
      question: 'What is the Yellow category in this puzzle?',
      answer: `The Yellow (easiest) category in this puzzle is themed: "${sorted[0].title}". The four words are: ${sorted[0].cards.map((c) => c.content).join(', ')}.`,
    },
    {
      question: 'What is the Purple (hardest) category?',
      answer: `The Purple category is: "${sorted[3].title}". These are the trickiest words in the puzzle: ${sorted[3].cards.map((c) => c.content).join(', ')}.`,
    },
    {
      question: 'How do I find the answers without spoilers?',
      answer:
        'Use the Progressive Hints section above — each level reveals a bit more, from category themes to full answers. Click "Reveal" buttons one at a time to get just the help you need.',
    },
    {
      question: 'Can I browse other Connections puzzles?',
      answer: `Yes — visit the Connections archive to browse all past puzzles organized by date, each with full hints and answers.`,
    },
  ]
}

export default async function ConnectionsHintDatePage({ params }: { params: Params }) {
  const { date } = await params
  const puzzle = await getConnectionsByDate(date)

  if (!puzzle) notFound()

  const formattedDate = dayjs(date).format('MMMM D, YYYY')
  const sorted = [...puzzle.categories].sort((a, b) => a.difficulty - b.difficulty)
  const faqItems = generateFAQ(puzzle)
  const recentPuzzles = await getRecentConnections(6)

  // Prev/next date navigation
  const allPuzzles = await getAllConnections() // newest first
  const currentIdx = allPuzzles.findIndex((p) => p.printDate === date)
  const prevPuzzle = currentIdx >= 0 ? allPuzzles[currentIdx + 1] : undefined
  const nextPuzzle = currentIdx > 0 ? allPuzzles[currentIdx - 1] : undefined

  const diffColors = ['bg-yellow-400', 'bg-green-500', 'bg-blue-500', 'bg-purple-600']
  const diffLabels = ['Yellow', 'Green', 'Blue', 'Purple']
  const diffTextColors = ['text-yellow-900', 'text-white', 'text-white', 'text-white']

  return (
    <div className="w-full grid-bg">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <JsonLd
          data={breadcrumbSchema([
            { name: 'Home', url: BASE_URL },
            { name: 'Connections Hint', url: `${BASE_URL}/connections-hint` },
            {
              name: `Connections ${formattedDate}`,
              url: `${BASE_URL}/connections-hint/${date}`,
            },
          ])}
        />
        <JsonLd
          data={faqPageSchema(
            faqItems.map((f) => ({ question: f.question, answer: f.answer }))
          )}
        />
        <JsonLd
          data={articleSchema({
            title: `NYT Connections Hints — ${formattedDate} (Puzzle #${puzzle.id})`,
            description: `Progressive hints and complete answers for NYT Connections Puzzle #${puzzle.id} from ${formattedDate}.`,
            url: `${BASE_URL}/connections-hint/${date}`,
            datePublished: date,
            dateModified: date,
          })}
        />

        {/* Header */}
        <div className="mb-8 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-900 p-8 text-white">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Link
              href="/connections-hint"
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
            NYT Connections Hints — {formattedDate}
          </h1>
          <p className="text-purple-100 text-lg max-w-2xl mb-5">
            Progressive hints for all four categories. Reveal only what you need — from vague clues to full answers.
          </p>

          {/* Category dots */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {sorted.map((cat) => (
              <div
                key={cat.difficulty}
                className={`rounded-lg p-3 ${diffColors[cat.difficulty]}`}
              >
                <p className={`text-xs font-bold uppercase ${diffTextColors[cat.difficulty]}`}>
                  {diffLabels[cat.difficulty]}
                </p>
                <p className={`text-xs mt-0.5 opacity-90 line-clamp-2 ${diffTextColors[cat.difficulty]}`}>
                  {cat.title}
                </p>
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
              <ConnectionsHintCard puzzle={puzzle} />
            </section>

            {/* Category Answers */}
            <section>
              <h2 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                Category Answers
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Click each category to reveal its words.
              </p>
              <ConnectionsAnswerReveal puzzle={puzzle} />
            </section>

            {/* Solved Grid */}
            <section>
              <h2 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Grid3X3 className="h-5 w-5 text-purple-600" />
                Solved Grid
              </h2>
              <ConnectionsGrid puzzle={puzzle} />
            </section>

            {/* Puzzle Breakdown Table */}
            <section className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Puzzle #{puzzle.id} Breakdown
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Color</th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Category</th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Words</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((cat, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`h-3 w-3 rounded-full ${diffColors[cat.difficulty]}`} />
                            <span className="font-medium">{diffLabels[cat.difficulty]}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-semibold text-foreground">{cat.title}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {cat.cards.map((c) => c.content).join(', ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Difficulty Analysis */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-heading text-xl font-bold text-foreground mb-4">
                Difficulty Analysis
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-3 w-3 rounded-full bg-yellow-400" />
                    <h3 className="text-sm font-bold text-yellow-900">Yellow — Easiest</h3>
                  </div>
                  <p className="text-sm font-semibold text-yellow-800">{sorted[0].title}</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    {sorted[0].cards.map((c) => c.content).join(' · ')}
                  </p>
                </div>
                <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-3 w-3 rounded-full bg-green-500" />
                    <h3 className="text-sm font-bold text-green-900">Green — Easy</h3>
                  </div>
                  <p className="text-sm font-semibold text-green-800">{sorted[1].title}</p>
                  <p className="text-xs text-green-700 mt-1">
                    {sorted[1].cards.map((c) => c.content).join(' · ')}
                  </p>
                </div>
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-3 w-3 rounded-full bg-blue-500" />
                    <h3 className="text-sm font-bold text-blue-900">Blue — Hard</h3>
                  </div>
                  <p className="text-sm font-semibold text-blue-800">{sorted[2].title}</p>
                  <p className="text-xs text-blue-700 mt-1">
                    {sorted[2].cards.map((c) => c.content).join(' · ')}
                  </p>
                </div>
                <div className="rounded-lg bg-purple-50 border border-purple-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-3 w-3 rounded-full bg-purple-600" />
                    <h3 className="text-sm font-bold text-purple-900">Purple — Hardest</h3>
                  </div>
                  <p className="text-sm font-semibold text-purple-800">{sorted[3].title}</p>
                  <p className="text-xs text-purple-700 mt-1">
                    {sorted[3].cards.map((c) => c.content).join(' · ')}
                  </p>
                </div>
              </div>
            </section>

            {/* Solving Strategies */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-heading text-xl font-bold text-foreground mb-4">
                Solving Strategies for This Puzzle
              </h2>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-600 shrink-0" />
                  Start with the Yellow category (&quot;{sorted[0].title}&quot;) — it&apos;s the most straightforward connection.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-600 shrink-0" />
                  The Purple group (&quot;{sorted[3].title}&quot;) is the trickiest — look for unexpected or lateral connections.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-600 shrink-0" />
                  Each word belongs to exactly one category. If a word seems to fit two groups, it&apos;s probably a red herring for the easier one.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-600 shrink-0" />
                  Once you&apos;ve correctly identified two categories, the remaining 8 words split into the other two — making them easier to solve.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-600 shrink-0" />
                  Look for patterns: words that all follow a common word, precede a word, or belong to a hidden category (e.g., all types of something).
                </li>
              </ul>
            </section>

            {/* FAQ */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-heading text-xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <div className="divide-y divide-border">
                {faqItems.map((item, i) => (
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

            {/* Prev / Next Navigation */}
            <div className="flex items-center justify-between gap-4">
              {prevPuzzle ? (
                <Link
                  href={`/connections-hint/${prevPuzzle.printDate}`}
                  className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:border-purple-400 hover:bg-purple-50 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <div>
                    <p className="text-xs text-muted-foreground">Previous</p>
                    <p>{dayjs(prevPuzzle.printDate).format('MMM D, YYYY')}</p>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {nextPuzzle ? (
                <Link
                  href={`/connections-hint/${nextPuzzle.printDate}`}
                  className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:border-purple-400 hover:bg-purple-50 transition-colors"
                >
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Next</p>
                    <p>{dayjs(nextPuzzle.printDate).format('MMM D, YYYY')}</p>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <div />
              )}
            </div>
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
                  { href: '/connections-hint-today', label: "Today's Hints", icon: Lightbulb },
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
                  {recentPuzzles.map((p) => (
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

            {/* Puzzle Meta */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-heading text-sm font-bold text-foreground mb-3">
                Puzzle Info
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Puzzle #</dt>
                  <dd className="font-semibold">{puzzle.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Date</dt>
                  <dd className="font-semibold">{dayjs(date).format('MMM D, YYYY')}</dd>
                </div>
                {puzzle.editor && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Editor</dt>
                    <dd className="font-semibold">{puzzle.editor}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Categories</dt>
                  <dd className="font-semibold">4</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Total Words</dt>
                  <dd className="font-semibold">16</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white text-center">
          <h2 className="font-heading text-2xl font-bold mb-2">
            Browse More Connections Puzzles
          </h2>
          <p className="text-purple-100 mb-5">
            Explore our full archive of past Connections puzzles with hints and complete answers.
          </p>
          <Link
            href="/connections-hint"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-purple-700 hover:bg-purple-50 transition-colors"
          >
            View Full Archive
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
