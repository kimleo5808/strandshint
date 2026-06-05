import { StrandsAnswerReveal } from "@/components/strands/StrandsAnswerReveal";
import { StrandsGrid } from "@/components/strands/StrandsGrid";
import { StrandsHintCard, WordHintList } from "@/components/strands/StrandsHintCard";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import {
  getAllPuzzles,
  getPuzzleByDate,
  getRecentPuzzles,
} from "@/lib/strands-data";
import { articleSchema, breadcrumbSchema, faqPageSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import dayjs from "dayjs";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  BookOpen,
  Lightbulb,
  Puzzle,
  Target,
  Zap,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = Promise<{ locale: string; date: string }>;

/* ── auto-generated analysis helpers ────────────────────── */
function generateOverview(
  id: number,
  date: string,
  clue: string,
  spangram: string,
  themeWords: string[]
) {
  const formattedDate = dayjs(date).format("MMMM D, YYYY");
  return `NYT Strands puzzle #${id} (${formattedDate}) has the theme clue "${clue}". The Spangram is "${spangram}" (${spangram.length} letters), and there are ${themeWords.length} theme words to find on the 6×8 letter grid. Below you'll find progressive hints, the complete solution with the solved grid, and strategies to help you solve similar puzzles.`;
}

function generateStrategyTips(spangram: string, themeWords: string[]) {
  const tips = [
    "Start by reading the theme clue carefully — it often contains wordplay or a double meaning that hints at the connection between all words.",
    `Look for the Spangram first. It's ${spangram.length} letters long and spans from one edge of the board to the other. Finding it reveals the overarching theme.`,
    "Scan for shorter words (4-5 letters) before tackling longer ones. Shorter words are usually easier to spot on the grid.",
    "Remember that every letter on the board belongs to exactly one word. If you've found some words, the remaining letters narrow down where other words can be.",
    "Words are formed by connecting adjacent letters — horizontally, vertically, and diagonally. Letters don't need to be in a straight line.",
  ];

  if (themeWords.some((w) => w.length >= 7)) {
    tips.push(
      "This puzzle has some longer theme words. Try identifying common prefixes or suffixes on the grid to spot them."
    );
  }

  return tips;
}

function generateFAQ(
  id: number,
  date: string,
  clue: string,
  spangram: string,
  themeWords: string[]
) {
  const formattedDate = dayjs(date).format("MMMM D, YYYY");
  return [
    {
      q: `What is the Spangram for Strands #${id}?`,
      a: `The Spangram for Strands #${id} (${formattedDate}) is "${spangram}". It's ${spangram.length} letters long and spans the entire board from one side to the other.`,
    },
    {
      q: `What are the theme words in Strands #${id}?`,
      a: `Strands #${id} has ${themeWords.length} theme words: ${themeWords.join(", ")}. All of these words relate to the theme clue "${clue}".`,
    },
    {
      q: `What is the theme clue for Strands #${id}?`,
      a: `The theme clue for Strands #${id} is "${clue}". This clue hints at the connection between all theme words and the Spangram on the puzzle grid.`,
    },
    {
      q: "How do I play NYT Strands?",
      a: "NYT Strands presents a 6×8 letter grid where you find theme words by connecting adjacent letters (horizontally, vertically, or diagonally). Each puzzle has a theme clue, several theme words (highlighted in blue), and one Spangram (highlighted in yellow/gold) that spans the entire board. Every letter on the grid belongs to exactly one word.",
    },
  ];
}

/* ── metadata ───────────────────────────────────────────── */
// Revalidate every 30 min so this page picks up new puzzle data from KV
export const revalidate = 1800;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, date } = await params;
  const puzzle = await getPuzzleByDate(date);
  if (!puzzle) return {};

  const formattedDate = dayjs(date).format("MMMM D, YYYY");

  return constructMetadata({
    page: "Daily",
    title: `Strands Hint ${formattedDate} — Puzzle #${puzzle.id} Answer & Hints`,
    description: `Complete hints, answers, and analysis for NYT Strands puzzle #${puzzle.id} on ${formattedDate}. Progressive hints, Spangram reveal, theme words, and solving strategies.`,
    keywords: [
      `strands hint ${date}`,
      `strands answers ${formattedDate}`,
      `nyt strands ${formattedDate}`,
      `strands puzzle #${puzzle.id}`,
      "strands puzzle answers",
      "nyt strands hints today",
      "strands spangram",
    ],
    locale: locale as Locale,
    path: `/strands-hint/${date}`,
    canonicalUrl: `/strands-hint/${date}`,
  });
}

/* ── page ────────────────────────────────────────────────── */
export default async function DailyPuzzlePage({
  params,
}: {
  params: Params;
}) {
  const { date } = await params;
  const puzzle = await getPuzzleByDate(date);

  if (!puzzle) {
    notFound();
  }

  const allPuzzles = await getAllPuzzles();
  const currentIndex = allPuzzles.findIndex((p) => p.printDate === date);
  const prevPuzzle =
    currentIndex < allPuzzles.length - 1 ? allPuzzles[currentIndex + 1] : null;
  const nextPuzzle =
    currentIndex > 0 ? allPuzzles[currentIndex - 1] : null;
  const recentPuzzles = await getRecentPuzzles(10);

  const formattedDate = dayjs(puzzle.printDate).format("MMMM D, YYYY");
  const dayOfWeek = dayjs(puzzle.printDate).format("dddd");

  const faqItems = generateFAQ(puzzle.id, puzzle.printDate, puzzle.clue, puzzle.spangram, puzzle.themeWords);
  const strategyTips = generateStrategyTips(puzzle.spangram, puzzle.themeWords);
  const overview = generateOverview(puzzle.id, puzzle.printDate, puzzle.clue, puzzle.spangram, puzzle.themeWords);

  // Related puzzles (3 closest, excluding current)
  const relatedPuzzles = recentPuzzles
    .filter((p) => p.printDate !== puzzle.printDate)
    .slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 grid-bg">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "Strands Hint",
            url: `${BASE_URL}/strands-hint`,
          },
          {
            name: `Puzzle #${puzzle.id}`,
            url: `${BASE_URL}/strands-hint/${date}`,
          },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: `Strands #${puzzle.id} Answer & Hints — ${formattedDate}`,
          description: `Complete hints, answers, and analysis for NYT Strands puzzle #${puzzle.id} on ${formattedDate}.`,
          url: `${BASE_URL}/strands-hint/${date}`,
          datePublished: puzzle.printDate,
          dateModified: puzzle.printDate,
        })}
      />
      <JsonLd
        data={faqPageSchema(
          faqItems.map((f) => ({ question: f.q, answer: f.a }))
        )}
      />

      {/* ── Prev / Next nav ──────────────────────────────── */}
      <nav className="flex items-center justify-between mb-6">
        {prevPuzzle ? (
          <Link
            href={`/strands-hint/${prevPuzzle.printDate}`}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Link>
        ) : (
          <span />
        )}
        {nextPuzzle ? (
          <Link
            href={`/strands-hint/${nextPuzzle.printDate}`}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <span />
        )}
      </nav>

      {/* ── Title ────────────────────────────────────────── */}
      <header className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
          <Calendar className="h-4 w-4" />
          <span>
            {dayOfWeek}, {formattedDate}
          </span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Strands #{puzzle.id} Hints &amp; Answer
        </h1>
        <p className="mt-2 text-muted-foreground">({formattedDate})</p>
        <p className="mt-4 text-lg font-bold text-primary">
          Theme: &ldquo;{puzzle.clue}&rdquo;
        </p>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Find {puzzle.themeWords.length} theme words and the Spangram on
          today&apos;s 6×8 letter grid. Use the progressive hints below if
          you need help!
        </p>
      </header>

      {/* ── 3-column highlight cards ─────────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-border bg-card p-5 text-center">
          <Lightbulb className="mx-auto h-8 w-8 text-amber-500 mb-3" />
          <h3 className="font-heading text-sm font-bold text-foreground">
            Progressive Hints
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Start with gentle clues, reveal more only when you need them
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 text-center">
          <Target className="mx-auto h-8 w-8 text-primary mb-3" />
          <h3 className="font-heading text-sm font-bold text-foreground">
            Full Answer
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Complete solution with Spangram, theme words, and solved grid
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 text-center">
          <Zap className="mx-auto h-8 w-8 text-purple-500 mb-3" />
          <h3 className="font-heading text-sm font-bold text-foreground">
            Strategy Tips
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Learn the patterns and strategies behind today&apos;s puzzle
          </p>
        </div>
      </section>

      {/* ── Letter Grid Preview ────────────────────────────── */}
      <section className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 sm:p-8 mb-8">
        <h2 className="text-center font-heading text-lg font-bold text-white mb-4">
          Today&apos;s Letter Grid
        </h2>
        <StrandsGrid puzzle={puzzle} interactive />
      </section>

      {/* ── Main content + Sidebar ───────────────────────── */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Main content */}
        <div className="flex-1 space-y-6 min-w-0">
          {/* Spoiler / answer reveal */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
            <StrandsAnswerReveal puzzle={puzzle} />
          </section>

          {/* Progressive hints */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Progressive Hints
              </h2>
            </div>
            <StrandsHintCard puzzle={puzzle} />
          </section>

          {/* Individual word hints */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Puzzle className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Individual Word Hints
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Click to reveal hints and answers for each word individually.
            </p>
            <WordHintList puzzle={puzzle} />
          </section>

          {/* ── Answer & Full Analysis ────────────────────── */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Strands #{puzzle.id} Full Analysis
              </h2>
            </div>

            {/* Overview */}
            <p className="text-sm leading-relaxed text-muted-foreground mb-8">
              {overview}
            </p>

            {/* Spangram breakdown */}
            <h3 className="font-heading text-lg font-bold text-foreground mb-4">
              Spangram
            </h3>
            <div className="rounded-xl border border-strands-spangram/30 bg-strands-spangram/10 p-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-strands-spangram" />
                <span className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">
                  {puzzle.spangram}
                </span>
                <span className="ml-auto text-xs font-medium text-strands-spangram">
                  {puzzle.spangram.length} letters
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                The Spangram &ldquo;{puzzle.spangram}&rdquo; spans the entire board from one edge to the other.
                It encapsulates the theme clue &ldquo;{puzzle.clue}&rdquo; and is highlighted in gold/yellow when found.
              </p>
            </div>

            {/* Theme words breakdown */}
            <h3 className="font-heading text-lg font-bold text-foreground mb-4">
              Theme Words ({puzzle.themeWords.length})
            </h3>
            <div className="rounded-xl border border-strands-theme/30 bg-strands-theme/10 p-4 mb-8">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {puzzle.themeWords.map((word) => (
                  <span
                    key={word}
                    className="rounded-md bg-strands-theme/15 px-2.5 py-1 text-xs font-bold text-foreground uppercase"
                  >
                    {word}
                  </span>
                ))}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                All {puzzle.themeWords.length} theme words relate to the clue &ldquo;{puzzle.clue}&rdquo;.
                Theme words are highlighted in blue when found on the grid.
                They range from {Math.min(...puzzle.themeWords.map(w => w.length))} to {Math.max(...puzzle.themeWords.map(w => w.length))} letters in length.
              </p>
            </div>

            {/* Word reference table */}
            <h3 className="font-heading text-lg font-bold text-foreground mb-4">
              Word Reference Table
            </h3>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-2.5 text-left font-heading font-bold text-foreground">
                      Word
                    </th>
                    <th className="px-4 py-2.5 text-left font-heading font-bold text-foreground">
                      Type
                    </th>
                    <th className="px-4 py-2.5 text-left font-heading font-bold text-foreground">
                      Length
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50 bg-amber-50/50 dark:bg-amber-900/5">
                    <td className="px-4 py-2.5 font-mono font-bold text-foreground uppercase">
                      {puzzle.spangram}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-strands-spangram" />
                        <span className="text-strands-spangram font-medium">Spangram</span>
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {puzzle.spangram.length} letters
                    </td>
                  </tr>
                  {puzzle.themeWords.map((word) => (
                    <tr
                      key={word}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-2.5 font-mono font-bold text-foreground uppercase">
                        {word}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-strands-theme" />
                          <span className="text-muted-foreground">Theme Word</span>
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {word.length} letters
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Strategy tips */}
            <h3 className="font-heading text-lg font-bold text-foreground mb-4">
              Strategy Tips for Strands #{puzzle.id}
            </h3>
            <ul className="space-y-3 mb-8">
              {strategyTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {tip}
                  </p>
                </li>
              ))}
            </ul>

            {/* FAQ */}
            <h3 className="font-heading text-lg font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {faqItems.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-muted/20 p-4"
                >
                  <h4 className="text-sm font-bold text-foreground mb-2">
                    {faq.q}
                  </h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Related Puzzles ───────────────────────────── */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
            <h2 className="font-heading text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              Related Strands Puzzles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {relatedPuzzles.map((p) => (
                <Link
                  key={p.printDate}
                  href={`/strands-hint/${p.printDate}`}
                  className="group rounded-xl border border-border p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <span className="inline-block rounded-md bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
                    Puzzle #{p.id}
                  </span>
                  <p className="mt-2 text-xs font-medium text-muted-foreground">
                    {dayjs(p.printDate).format("MMMM D, YYYY")}
                  </p>
                  <p className="mt-1 text-xs text-foreground font-bold truncate">
                    &ldquo;{p.clue}&rdquo;
                  </p>
                  <span className="mt-2 flex items-center gap-1 text-xs font-medium text-primary">
                    View Hints
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link
                href="/strands-hint"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                View All Strands Hints &amp; Answers →
              </Link>
            </div>
          </section>

          {/* ── Bottom prev/next navigation ───────────────── */}
          <nav className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
            {prevPuzzle ? (
              <Link
                href={`/strands-hint/${prevPuzzle.printDate}`}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>
                  #{prevPuzzle.id} — {dayjs(prevPuzzle.printDate).format("MMM D")}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {nextPuzzle ? (
              <Link
                href={`/strands-hint/${nextPuzzle.printDate}`}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <span>
                  #{nextPuzzle.id} — {dayjs(nextPuzzle.printDate).format("MMM D")}
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>

        {/* ── Sidebar ────────────────────────────────────── */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sticky top-24">
            <h3 className="font-heading text-sm font-bold text-foreground mb-3">
              More Strands Hints
            </h3>
            <div className="space-y-1">
              {recentPuzzles
                .filter((p) => p.printDate !== puzzle.printDate)
                .slice(0, 8)
                .map((p) => (
                  <Link
                    key={p.printDate}
                    href={`/strands-hint/${p.printDate}`}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-primary/5"
                  >
                    <span className="font-medium text-foreground">
                      Strands Hints #{p.id}
                    </span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </Link>
                ))}
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <Link
                href="/strands-hint"
                className="block text-center text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              >
                All Strands Hints →
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const allPuzzles = await getAllPuzzles();
  const params: { locale: string; date: string }[] = [];

  for (const locale of LOCALES) {
    for (const puzzle of allPuzzles.slice(0, 60)) {
      params.push({ locale, date: puzzle.printDate });
    }
  }

  return params;
}
