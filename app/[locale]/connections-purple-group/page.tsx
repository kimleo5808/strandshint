import { DifficultyLadder } from '@/components/connections/DifficultyLadder'
import { PurpleArchetypeCard } from '@/components/connections/PurpleArchetypeCard'
import { PurpleByNumbers } from '@/components/connections/PurpleByNumbers'
import { BASE_URL } from '@/config/site'
import {
  PURPLE_ARCHETYPES,
  PURPLE_FAQ,
  PURPLE_SAMPLE_SIZE,
  SOLVE_STEPS,
  TRAP_WORD_CHECKLIST,
  archetypeFrequency,
} from '@/data/connections/purple-content'
import { Locale, LOCALES } from '@/i18n/routing'
import {
  articleSchema,
  breadcrumbSchema,
  faqPageSchema,
  howToSchema,
  JsonLd,
} from '@/lib/jsonld'
import { constructMetadata } from '@/lib/metadata'
import {
  ArrowRight,
  CheckSquare,
  Lightbulb,
  ListChecks,
  Sparkles,
} from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

type Params = Promise<{ locale: string }>

// Evergreen explainer; recompute the data block quarterly. Revalidate keeps the
// page fresh without a full rebuild when the archive script is rerun.
export const revalidate = 3600

const PATH = '/connections-purple-group'
const PUBLISHED = '2026-06-21'

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params
  return constructMetadata({
    page: 'ConnectionsPurpleGroup',
    title: 'NYT Connections Purple Group, Explained (+ How to Solve It)',
    description:
      'Why purple is the hardest Connections category, the 7 wordplay types it uses, and a proven method to crack it — with data from 164 real puzzles.',
    keywords: [
      'connections purple group',
      'connections purple explained',
      'how to solve connections purple',
      'connections hardest category',
      'what does purple mean in connections',
      'connections wordplay',
    ],
    locale: locale as Locale,
    path: PATH,
    canonicalUrl: PATH,
  })
}

const wordplayPct = 100 - archetypeFrequency('pop-culture').pct

export default async function ConnectionsPurpleGroupPage({ params }: { params: Params }) {
  await params

  return (
    <div className="w-full grid-bg">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <JsonLd
          data={breadcrumbSchema([
            { name: 'Home', url: BASE_URL },
            { name: 'Connections Hint', url: `${BASE_URL}/connections-hint` },
            { name: 'Purple Group', url: `${BASE_URL}${PATH}` },
          ])}
        />
        <JsonLd
          data={articleSchema({
            title: 'NYT Connections Purple Group, Explained',
            description:
              'The 7 wordplay archetypes the purple Connections group uses, with worked examples and a proven solving method.',
            url: `${BASE_URL}${PATH}`,
            datePublished: PUBLISHED,
          })}
        />
        <JsonLd data={faqPageSchema(PURPLE_FAQ)} />
        <JsonLd
          data={howToSchema(
            'How to Solve the Connections Purple Group',
            'A repeatable method for cracking the hardest Connections category.',
            SOLVE_STEPS,
          )}
        />

        {/* ── Breadcrumb ───────────────────────────────── */}
        <nav className="mb-6 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-purple-600">Home</Link>
          <span className="mx-1.5">/</span>
          <Link href="/connections-hint" className="hover:text-purple-600">Connections</Link>
          <span className="mx-1.5">/</span>
          <span className="text-foreground">Purple Group</span>
        </nav>

        {/* ── Hero ─────────────────────────────────────── */}
        <header className="mb-8 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-900 p-8 text-white">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            NYT Connections · The Hardest Four
          </span>
          <h1 className="mt-4 font-heading text-3xl font-bold sm:text-4xl">
            The NYT Connections Purple Group, Explained
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-purple-100">
            Purple is the category players get wrong most often — because roughly
            half of all purple groups are <strong>wordplay, not meaning</strong>.
            Here are the 7 ways purple tricks you, and a repeatable method to beat it.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { value: '7', label: 'archetypes' },
              { value: `${wordplayPct}%`, label: 'use wordplay' },
              { value: `${PURPLE_SAMPLE_SIZE}`, label: 'puzzles analyzed' },
            ].map((s) => (
              <div key={s.label} className="rounded-lg bg-white/10 px-3 py-2 text-center">
                <div className="font-heading text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-purple-100">{s.label}</div>
              </div>
            ))}
          </div>
        </header>

        {/* ── What You'll Learn ────────────────────────── */}
        <section className="mb-10 rounded-xl border border-border bg-card p-6">
          <h2 className="mb-3 font-heading text-lg font-bold text-foreground">
            What you&apos;ll learn
          </h2>
          <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            {[
              'What the purple group actually is and why it&apos;s the hardest',
              'The 7 purple archetypes with real worked examples',
              'A trap-word checklist to spot misdirection',
              'The elimination method to solve purple last',
              'What our 164-puzzle dataset reveals about purple',
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-purple-600" />
                <span dangerouslySetInnerHTML={{ __html: t }} />
              </li>
            ))}
          </ul>
        </section>

        {/* ── What Is the Purple Group ─────────────────── */}
        <section className="mb-10">
          <h2 className="mb-4 font-heading text-2xl font-bold text-foreground">
            What is the purple group in Connections?
          </h2>
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p className="rounded-lg border-l-4 border-purple-600 bg-purple-50/60 p-4 text-base font-medium text-foreground">
                The purple group is the difficulty-3 (hardest) category in NYT
                Connections. It is color-coded as the trickiest of the four
                connections — usually wordplay or a deliberately loose link rather
                than a simple shared meaning.
              </p>
              <p>
                Every Connections puzzle sorts 16 words into four groups of four,
                ranked by difficulty from Yellow (easiest) through Green and Blue up
                to Purple. The colors are assigned by the editors and only revealed
                after you solve a group correctly, so &ldquo;purple&rdquo; is a
                statement about <em>how tricky the link is</em>, not how rare or long
                the words are.
              </p>
              <p>
                That is why purple so often contains short, ordinary words. The
                difficulty lives in the connection itself — a hidden word, a phrase
                you have to complete, a sound you only hear when you read it aloud.
              </p>
              <p>
                It helps to treat the four colors as four different questions.
                Yellow asks &ldquo;what do these obviously have in common?&rdquo;
                and the answer arrives almost before you finish reading. By the
                time you reach purple, the question has quietly changed to
                &ldquo;what is the editor <em>doing</em> to these words?&rdquo; The
                link is no longer a category you recognize but a mechanism you have
                to reverse-engineer — and the puzzle gives you no hint that the
                rules have shifted.
              </p>
              <p>
                This is also why purple resists raw knowledge. You can know all
                sixteen words cold and still miss the group, because the difficulty
                was never about vocabulary. It was about noticing that COLONY hides
                COLON, or that ANY is really the letters &ldquo;N-E&rdquo; said
                aloud. Purple rewards a specific habit of attention, and the rest of
                this guide is about building it deliberately.
              </p>
            </div>
            <DifficultyLadder />
          </div>
        </section>

        {/* ── Why Purple Is Hardest ────────────────────── */}
        <section className="mb-10">
          <h2 className="mb-4 font-heading text-2xl font-bold text-foreground">
            Why purple is the hardest category
          </h2>
          <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Purple&apos;s difficulty is not the bad luck of one tricky category —
            it is engineered into how the puzzle is built. Three forces compound to
            make it the group players get wrong most often, and knowing each one
            tells you exactly where to look when you are stuck.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                t: 'Wordplay over meaning',
                d: 'Around half of purple groups hinge on the form of the words — spelling, sound, hidden letters — instead of a shared meaning. Category-first thinking simply does not fire.',
              },
              {
                t: 'Borrowed red herrings',
                d: 'Editors plant purple words that look like they belong to an easier group, so you confidently place them in yellow or green and break the whole grid.',
              },
              {
                t: 'Everything feels close',
                d: 'Purple words often seem to belong somewhere else. That false sense of fit is the trap — the real link is one you have not considered yet.',
              },
            ].map((r) => (
              <div key={r.t} className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-2 font-heading text-sm font-bold text-foreground">{r.t}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{r.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Notice that all three forces push the same way: they make a purple word
            look like it belongs somewhere it does not. HEART feels like an easy
            &ldquo;body&rdquo; clue, so you place it — and only later discover the
            real purple was &ldquo;organ plus a letter,&rdquo; where HEART should
            have been HEARTH. The cure is not to think harder about meaning. It is
            to distrust the obvious placement and hold ambiguous words back until
            the rest of the grid forces their hand.
          </p>
          <p className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <span>
              <strong>Pro tip:</strong> if the leftover four words seem unrelated by
              meaning, switch to a <em>form</em> trick — sound or spelling — not meaning.
            </span>
          </p>
        </section>

        {/* ── The 7 Archetypes ─────────────────────────── */}
        <section className="mb-10">
          <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">
            The 7 purple archetypes (with worked examples)
          </h2>
          <p className="mb-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            After classifying the purple group of every puzzle in our archive, a
            clear pattern emerged: almost every one is a variation on just seven
            tricks. Roughly three in four lean on the <em>form</em> of the words — a
            hidden word, a completed phrase, a sound, a swapped letter — and the
            rest are unusually narrow real categories. Learn to recognize these
            seven and you have seen, in some form, nearly every purple the puzzle
            can throw at you.
          </p>
          <p className="mb-5 max-w-2xl text-sm text-muted-foreground">
            Each example below is a real category pulled from our archive — reveal
            the answer only once you have tried to spot the link yourself.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {PURPLE_ARCHETYPES.map((a, i) => (
              <PurpleArchetypeCard key={a.key} archetype={a} index={i + 1} />
            ))}
          </div>
        </section>

        {/* ── Trap-Word Checklist ──────────────────────── */}
        <section className="mb-10 rounded-xl border border-border bg-card p-6">
          <h2 className="mb-2 flex items-center gap-2 font-heading text-2xl font-bold text-foreground">
            <ListChecks className="h-6 w-6 text-purple-600" />
            Trap-word spotting checklist
          </h2>
          <p className="mb-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Misdirection is the whole game in purple, and most of it is planted in
            plain sight. Before you commit any group, run the sixteen words past
            this checklist. Each signal below is a common way the editors disguise a
            purple word as a member of an easier group — and catching one early is
            often all it takes to keep you from locking in a wrong answer.
          </p>
          <ol className="space-y-3">
            {TRAP_WORD_CHECKLIST.map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.signal}</p>
                  <p className="text-sm text-muted-foreground">{item.why}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            None of these signals proves a word is purple — they simply flag it for
            a second look. In practice you are quietly building a watchlist as you
            read the grid: the two or three words that feel a little too convenient,
            a little too short, or a little too eager to join an easy group. Those
            are usually the words doing double duty, and double duty is exactly
            where purple lives. When you later find a group that only works if one
            of those flagged words is <em>removed</em>, you have almost certainly
            found the purple seam.
          </p>
          <p className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <span>
              <strong>Pro tip:</strong> assume an ambiguous word belongs to the{' '}
              <em>harder</em> group, and build the easy group without it.
            </span>
          </p>
        </section>

        {/* ── How to Solve, Step by Step ───────────────── */}
        <section className="mb-10">
          <h2 className="mb-4 font-heading text-2xl font-bold text-foreground">
            How to solve the purple group, step by step
          </h2>
          <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            The biggest mistake players make is hunting for the purple connection
            head-on. You almost never find it that way. The reliable approach is
            indirect: clear everything you <em>can</em> identify, then let purple
            reveal itself as the remainder. Here is the method in the order that
            actually works at the board.
          </p>
          <ol className="space-y-4">
            {SOLVE_STEPS.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-600 font-heading text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div className="pt-0.5">
                  <h3 className="font-heading text-base font-bold text-foreground">{step.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-5 rounded-lg bg-purple-50 p-4 text-sm text-purple-900">
            Ready to practice on a live puzzle?{' '}
            <Link href="/connections-hint-today" className="font-semibold underline hover:text-purple-700">
              See today&apos;s Connections hints
            </Link>{' '}
            and try to isolate the purple group yourself.
          </div>
        </section>

        {/* ── Purple by the Numbers ────────────────────── */}
        <section className="mb-10">
          <PurpleByNumbers />
          <div className="mt-5 rounded-xl border border-border bg-card p-6 text-sm leading-relaxed text-muted-foreground">
            <p>
              A few things stand out in the data. Phrase completion and
              before/after tricks together account for a large share of purples,
              which is why training one reflex — &ldquo;does a single common word
              attach to all four?&rdquo; — pays off more than almost anything else
              you can do. Hidden words are the next most common, and they are the
              hardest to un-see once you start looking; the habit of scanning the
              start and end of each word for a smaller word buried inside is worth
              building early.
            </p>
            <p className="mt-3">
              The real surprise for most players is how often purple is <em>not</em>
              wordplay at all. Around a quarter of purple groups are simply
              hyper-specific real categories — the spaces on a Monopoly board, the
              terms used in blackjack, the second words in ABBA song titles. There
              is no mechanism to reverse-engineer here. These groups reward broad,
              slightly random knowledge, and the only reliable defense is to solve
              the other three groups cleanly and trust whatever is left.
            </p>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────── */}
        <section className="mb-10 rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 font-heading text-2xl font-bold text-foreground">
            Frequently asked questions
          </h2>
          <div className="divide-y divide-border">
            {PURPLE_FAQ.map((item, i) => (
              <details key={i} className="group py-4 first:pt-0 last:pb-0">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-foreground hover:text-purple-600">
                  {item.question}
                  <span className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180">▼</span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── Closing + internal links ─────────────────── */}
        <section className="mb-10">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-2 font-heading text-xl font-bold text-foreground">
              The one shift that beats purple
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Purple is not harder vocabulary — it is a different <em>kind</em> of
              thinking. Solve the other three groups, isolate the leftover four, and
              switch from meaning to form. Once you start hearing homophones and
              seeing hidden words, the hardest group stops feeling impossible.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Like any pattern-recognition skill, it compounds with practice. The
              players who solve purple consistently are not smarter about words —
              they have simply seen enough of these seven archetypes that the right
              one comes to mind quickly. Work through a handful of past puzzles with
              the archetypes in front of you, force yourself to name the mechanism
              before you reveal each answer, and within a week or two the leftover
              four will start telling you what they are.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {[
                { href: '/connections-hint-today', label: "Today's Connections hints" },
                { href: '/blog/how-to-solve-connections', label: 'Full Connections method' },
                { href: '/how-to-play-connections', label: 'How to play Connections' },
                { href: '/connections-hint', label: 'Browse the archive' },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-3.5 py-2 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-100"
                >
                  {l.label}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <p className="text-center text-xs text-muted-foreground">
          Written by the StrandsHint team — we publish daily hints for every NYT
          Connections puzzle and maintain a {PURPLE_SAMPLE_SIZE}-puzzle archive.
        </p>
      </div>
    </div>
  )
}
