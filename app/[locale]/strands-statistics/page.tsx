import { BarChart } from "@/components/charts/BarChart";
import { HeatMap } from "@/components/charts/HeatMap";
import { StatCard } from "@/components/charts/StatCard";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { getAllPuzzlesRaw } from "@/lib/strands-data";
import { computeStrandsStats } from "@/lib/strands-stats";
import { breadcrumbSchema, faqPageSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import dayjs from "dayjs";
import { BarChart2, Calendar, Link2, Trophy } from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

const FAQ_ITEMS = [
  {
    question: "How many NYT Strands puzzles have been published?",
    answer:
      "You can see the exact current total at the top of this page — we track every puzzle from the very first one. The count grows by one every day as a new puzzle is released at midnight Eastern Time.",
  },
  {
    question: "What is the average number of theme words in a Strands puzzle?",
    answer:
      "Most Strands puzzles contain 6 to 8 theme words plus the Spangram. The exact average across all published puzzles is shown in the statistics above. Puzzles with more theme words tend to have shorter individual words, keeping the total letter count consistent with the 48-cell grid.",
  },
  {
    question: "What is the longest Spangram ever in Strands?",
    answer:
      "The record holder is listed in the Notable Records section above, complete with the puzzle date and theme clue so you can look it up in our archive. Spangrams must span the full 6×8 board, so their length is constrained by the grid dimensions.",
  },
  {
    question: "Which letters appear most often in Strands theme words?",
    answer:
      "The letter frequency heatmap above shows the complete breakdown. As with most English word games, vowels (E, A, I) and common consonants (S, T, R, N) dominate. The puzzle editors do aim for variety, but the constraints of the English lexicon mean certain letters naturally appear far more often.",
  },
  {
    question: "Are newer Strands puzzles harder than older ones?",
    answer:
      "Difficulty is subjective and difficult to measure quantitatively, but the monthly trends table tracks average theme word length over time — longer words generally indicate harder puzzles. Puzzle editors have also experimented with increasingly abstract theme clues as the game has matured.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "StrandsStatistics" });

  return constructMetadata({
    page: "StrandsStatistics",
    title: t("title"),
    description: t("description"),
    keywords: [
      "strands puzzle statistics",
      "nyt strands data",
      "strands puzzle analysis",
      "strands letter frequency",
      "strands spangram stats",
      "nyt strands trends",
    ],
    locale: locale as Locale,
    path: `/strands-statistics`,
    canonicalUrl: `/strands-statistics`,
  });
}

export default async function StrandsStatisticsPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const puzzles = await getAllPuzzlesRaw();
  const stats = computeStrandsStats(puzzles);

  const firstDate = puzzles[0]
    ? dayjs(puzzles[0].printDate).format("MMMM D, YYYY")
    : "N/A";
  const lastDate = puzzles[puzzles.length - 1]
    ? dayjs(puzzles[puzzles.length - 1].printDate).format("MMMM D, YYYY")
    : "N/A";

  // For bar charts: last 12 months only to keep it readable
  const recentMonths = stats.monthlyPuzzleCounts.slice(-12);

  // Format month label
  const fmtMonth = (m: string) => dayjs(m + "-01").format("MMM 'YY");

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "Strands Statistics",
            url: `${BASE_URL}/strands-statistics`,
          },
        ])}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-6 sm:p-10 text-white mb-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <BarChart2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-xs font-medium uppercase tracking-widest text-blue-300">
              Data Analysis
            </span>
            <h1 className="mt-1 font-heading text-3xl font-bold sm:text-4xl">
              Strands Puzzle Statistics &amp; Trends
            </h1>
            <p className="mt-2 text-blue-200 text-sm sm:text-base">
              Every puzzle from {firstDate} through {lastDate}, analyzed.
            </p>
          </div>
        </div>
      </header>

      {/* ── At a Glance ────────────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-5">
          At a Glance
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Puzzles"
            value={stats.totalPuzzles.toLocaleString()}
            subtext={`${firstDate} – present`}
            accent="blue"
          />
          <StatCard
            label="Avg Theme Words"
            value={stats.avgThemeWords}
            subtext="per puzzle (excl. Spangram)"
            accent="emerald"
          />
          <StatCard
            label="Avg Spangram Length"
            value={stats.avgSpangramLength}
            subtext="letters (spans full board)"
            accent="amber"
          />
          <StatCard
            label="Avg Theme Word Length"
            value={stats.avgThemeWordLength}
            subtext="letters per theme word"
            accent="purple"
          />
        </div>
      </section>

      {/* ── Monthly Puzzle Count ───────────────────────────────────────────── */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm mb-8">
        <h2 className="font-heading text-xl font-bold text-foreground mb-1">
          Puzzles Published Per Month
        </h2>
        <p className="text-sm text-muted-foreground mb-5">
          Last 12 months — one puzzle is published every day.
        </p>
        <BarChart
          items={recentMonths.map((m) => ({
            label: fmtMonth(m.month),
            value: m.count,
          }))}
          color="blue"
        />
        <p className="mt-4 text-xs text-muted-foreground">
          Months with fewer than 30 puzzles typically indicate the game
          launched or data collection started mid-month.
        </p>
      </section>

      {/* ── Theme Word Length Distribution ─────────────────────────────────── */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm mb-8">
        <h2 className="font-heading text-xl font-bold text-foreground mb-1">
          Theme Word Length Distribution
        </h2>
        <p className="text-sm text-muted-foreground mb-5">
          How many theme words exist at each letter count, across all{" "}
          {stats.totalPuzzles.toLocaleString()} puzzles.
        </p>
        <BarChart
          items={stats.themeWordLengthDist.map((d) => ({
            label: `${d.length} letters`,
            value: d.count,
          }))}
          color="emerald"
        />
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Length", "Word Count", "% of Total"].map((h) => (
                  <th
                    key={h}
                    className="py-2 pr-4 text-left font-heading text-xs uppercase tracking-wide text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.themeWordLengthDist.map((d, i) => (
                <tr
                  key={d.length}
                  className={`border-b border-border/40 ${i % 2 === 0 ? "" : "bg-muted/20"}`}
                >
                  <td className="py-2 pr-4 font-semibold text-foreground">
                    {d.length} letters
                  </td>
                  <td className="py-2 pr-4 text-foreground">
                    {d.count.toLocaleString()}
                  </td>
                  <td className="py-2 text-muted-foreground">{d.pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Spangram Statistics ────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm mb-8">
        <h2 className="font-heading text-xl font-bold text-foreground mb-4">
          Spangram Statistics
        </h2>
        <div className="grid gap-4 sm:grid-cols-3 mb-5">
          <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-4 text-center">
            <div className="font-heading text-3xl font-bold text-amber-600">
              {stats.spangramStats.min}
            </div>
            <div className="text-sm font-medium text-foreground mt-1">
              Shortest Spangram
            </div>
            <div className="text-xs text-muted-foreground">letters</div>
          </div>
          <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-4 text-center">
            <div className="font-heading text-3xl font-bold text-amber-600">
              {stats.spangramStats.avg}
            </div>
            <div className="text-sm font-medium text-foreground mt-1">
              Average Spangram
            </div>
            <div className="text-xs text-muted-foreground">letters</div>
          </div>
          <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-4 text-center">
            <div className="font-heading text-3xl font-bold text-amber-600">
              {stats.spangramStats.max}
            </div>
            <div className="text-sm font-medium text-foreground mt-1">
              Longest Spangram
            </div>
            <div className="text-xs text-muted-foreground">letters</div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The Spangram must span the entire 6×8 grid from one side to the
          opposite side, so its minimum length is constrained by the board
          geometry. The most common starting letter for Spangrams is{" "}
          <strong className="text-foreground">
            &ldquo;{stats.spangramStats.mostCommonStartLetter}&rdquo;
          </strong>
          , likely reflecting both common English word patterns and the
          editors&apos; word selection preferences.
        </p>
      </section>

      {/* ── Letter Frequency Heatmap ───────────────────────────────────────── */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm mb-8">
        <h2 className="font-heading text-xl font-bold text-foreground mb-1">
          Letter Frequency in Theme Words
        </h2>
        <p className="text-sm text-muted-foreground mb-5">
          Darker cells = letter appears more often across all theme words.
          Hover a cell to see the exact count.
        </p>
        <HeatMap
          cells={stats.letterFrequency.map((f) => ({
            label: f.letter,
            value: f.count,
          }))}
          color="blue"
        />
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          As in standard English, <strong className="text-foreground">E, A, I, O</strong>{" "}
          dominate. Common consonants{" "}
          <strong className="text-foreground">S, T, R, N, L</strong> follow
          closely. Rare letters like{" "}
          <strong className="text-foreground">Q, X, Z</strong> appear
          infrequently, though puzzle editors occasionally feature them to
          create memorable Spangrams.
        </p>
      </section>

      {/* ── Theme Words Per Puzzle ─────────────────────────────────────────── */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm mb-8">
        <h2 className="font-heading text-xl font-bold text-foreground mb-4">
          Theme Words Per Puzzle
        </h2>
        <p className="text-sm text-muted-foreground mb-5">
          How often does a puzzle have exactly 5, 6, 7, 8+ theme words?
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Theme Words", "# of Puzzles", "Percentage"].map((h) => (
                  <th
                    key={h}
                    className="py-2 pr-4 text-left font-heading text-xs uppercase tracking-wide text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.themeWordsPerPuzzleDist.map((d, i) => (
                <tr
                  key={d.count}
                  className={`border-b border-border/40 ${i % 2 === 0 ? "" : "bg-muted/20"}`}
                >
                  <td className="py-2.5 pr-4 font-semibold text-foreground">
                    {d.count} words
                  </td>
                  <td className="py-2.5 pr-4 text-foreground">
                    {d.puzzles.toLocaleString()}
                  </td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 max-w-24 rounded-full bg-muted/40 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${d.pct}%` }}
                        />
                      </div>
                      <span className="text-muted-foreground">{d.pct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          The puzzle editors balance word count against word length to keep
          every cell on the 48-letter grid occupied. More theme words generally
          means shorter individual words; fewer theme words means longer,
          harder-to-find words.
        </p>
      </section>

      {/* ── Notable Records ────────────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
          Notable Records
        </h2>
        <p className="text-sm text-muted-foreground mb-5">
          The most extreme puzzles in the entire archive:
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Trophy,
              color: "text-amber-500",
              bg: "bg-amber-500/10",
              label: "Longest Spangram",
              value: String(stats.records.longestSpangram.value),
              meta: `Puzzle #${stats.records.longestSpangram.puzzle.id} · ${dayjs(stats.records.longestSpangram.puzzle.printDate).format("MMM D, YYYY")}`,
              href: `/strands-hint/${stats.records.longestSpangram.puzzle.printDate}`,
            },
            {
              icon: Trophy,
              color: "text-blue-500",
              bg: "bg-blue-500/10",
              label: "Shortest Spangram",
              value: String(stats.records.shortestSpangram.value),
              meta: `Puzzle #${stats.records.shortestSpangram.puzzle.id} · ${dayjs(stats.records.shortestSpangram.puzzle.printDate).format("MMM D, YYYY")}`,
              href: `/strands-hint/${stats.records.shortestSpangram.puzzle.printDate}`,
            },
            {
              icon: Trophy,
              color: "text-emerald-500",
              bg: "bg-emerald-500/10",
              label: "Most Theme Words",
              value: `${stats.records.mostThemeWords.value} words`,
              meta: `Puzzle #${stats.records.mostThemeWords.puzzle.id} · "${stats.records.mostThemeWords.puzzle.clue}"`,
              href: `/strands-hint/${stats.records.mostThemeWords.puzzle.printDate}`,
            },
            {
              icon: Trophy,
              color: "text-purple-500",
              bg: "bg-purple-500/10",
              label: "Fewest Theme Words",
              value: `${stats.records.fewestThemeWords.value} words`,
              meta: `Puzzle #${stats.records.fewestThemeWords.puzzle.id} · "${stats.records.fewestThemeWords.puzzle.clue}"`,
              href: `/strands-hint/${stats.records.fewestThemeWords.puzzle.printDate}`,
            },
            {
              icon: Trophy,
              color: "text-rose-500",
              bg: "bg-rose-500/10",
              label: "Longest Theme Word",
              value: String(stats.records.longestThemeWord.value),
              meta: `Puzzle #${stats.records.longestThemeWord.puzzle.id} · ${dayjs(stats.records.longestThemeWord.puzzle.printDate).format("MMM D, YYYY")}`,
              href: `/strands-hint/${stats.records.longestThemeWord.puzzle.printDate}`,
            },
            {
              icon: Trophy,
              color: "text-sky-500",
              bg: "bg-sky-500/10",
              label: "Shortest Theme Word",
              value: String(stats.records.shortestThemeWord.value),
              meta: `Puzzle #${stats.records.shortestThemeWord.puzzle.id} · ${dayjs(stats.records.shortestThemeWord.puzzle.printDate).format("MMM D, YYYY")}`,
              href: `/strands-hint/${stats.records.shortestThemeWord.puzzle.printDate}`,
            },
          ].map(({ icon: Icon, color, bg, label, value, meta, href }) => (
            <Link
              key={label}
              href={href}
              className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}
                >
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {label}
                </span>
              </div>
              <div className="font-heading text-xl font-bold text-foreground group-hover:text-primary transition-colors truncate">
                {value}
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Link2 className="h-3 w-3 shrink-0" />
                <span className="truncate">{meta}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Monthly Trends Table ───────────────────────────────────────────── */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm mb-8">
        <h2 className="font-heading text-xl font-bold text-foreground mb-1">
          Monthly Trends
        </h2>
        <p className="text-sm text-muted-foreground mb-5">
          Puzzle count per month across the full archive. Scroll horizontally on
          mobile.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 pr-4 text-left font-heading text-xs uppercase tracking-wide text-muted-foreground">
                  Month
                </th>
                <th className="py-2 pr-4 text-left font-heading text-xs uppercase tracking-wide text-muted-foreground">
                  Puzzles
                </th>
                <th className="py-2 text-left font-heading text-xs uppercase tracking-wide text-muted-foreground">
                  Volume
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.monthlyPuzzleCounts
                .slice()
                .reverse()
                .map((m, i) => (
                  <tr
                    key={m.month}
                    className={`border-b border-border/40 ${i % 2 === 0 ? "" : "bg-muted/20"}`}
                  >
                    <td className="py-2 pr-4 font-medium text-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {dayjs(m.month + "-01").format("MMMM YYYY")}
                      </div>
                    </td>
                    <td className="py-2 pr-4 text-foreground font-semibold">
                      {m.count}
                    </td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-muted/40 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-blue-500"
                            style={{ width: `${Math.round((m.count / 31) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {m.count}/31
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── How Stats Are Computed ────────────────────────────────────────── */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm mb-8">
        <h2 className="font-heading text-xl font-bold text-foreground mb-3">
          About This Data
        </h2>
        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            All statistics are computed directly from our puzzle archive, which
            includes every NYT Strands puzzle published since the game launched.
            The data is updated automatically whenever a new puzzle is added to
            our system — typically within hours of the official NYT release at
            midnight Eastern Time.
          </p>
          <p>
            <strong className="text-foreground">Theme word analysis</strong>{" "}
            includes all words categorized as &ldquo;theme words&rdquo; in each
            puzzle, excluding the Spangram. The Spangram is treated as a separate
            category throughout all statistics because it has unique properties
            (must span the full board, describes the overall theme) that make it
            statistically distinct from regular theme words.
          </p>
          <p>
            <strong className="text-foreground">Letter frequency</strong> counts
            each letter occurrence across all theme word characters. A word like
            &ldquo;LETTER&rdquo; would count L, E, T, T, E, R separately —
            double letters are counted twice. This reflects how often each letter
            physically appears in the grid cells that form theme words.
          </p>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-5">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.question}
              className="group rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <summary className="flex cursor-pointer items-center justify-between font-heading text-sm font-bold text-foreground list-none">
                {item.question}
                <span className="ml-2 shrink-0 text-muted-foreground transition-transform group-open:rotate-180">
                  ▾
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="rounded-2xl bg-gradient-to-br from-primary to-primary/90 p-6 sm:p-8 text-center text-primary-foreground">
        <h2 className="font-heading text-2xl font-bold">
          Ready to Put the Stats to Work?
        </h2>
        <p className="mt-2 text-sm text-primary-foreground/80">
          Use what you&apos;ve learned from the data to solve today&apos;s puzzle — or
          browse the archive to revisit your favorite themes.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            href="/strands-hint-today"
            className="rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-primary transition-all hover:bg-white/90"
          >
            Today&apos;s Puzzle
          </Link>
          <Link
            href="/strands-hint"
            className="rounded-xl border-2 border-white/30 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-white/10"
          >
            Browse Archive
          </Link>
        </div>
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
