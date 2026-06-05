import { StrandsGridStatic } from "@/components/strands/StrandsGrid";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { getRecentPuzzles, getYesterdayPuzzle } from "@/lib/strands-data";
import { breadcrumbSchema, faqPageSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import dayjs from "dayjs";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Lightbulb,
  Target,
  Trophy,
} from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

const FAQ_ITEMS = [
  {
    question: "Can I still play yesterday's Strands puzzle?",
    answer:
      "The official NYT Strands game only shows the current day's puzzle. Once a new puzzle goes live at midnight ET, yesterday's puzzle is no longer accessible in the app. Our archive lets you revisit any past puzzle's answers and analysis.",
  },
  {
    question: "What was the Spangram in yesterday's puzzle?",
    answer:
      "You can find yesterday's full Spangram above, along with its position on the grid and how it connected to the puzzle's theme. The Spangram is highlighted in gold on the solved grid visualization.",
  },
  {
    question: "How difficult was yesterday's Strands puzzle?",
    answer:
      "Difficulty in Strands varies based on the obscurity of the theme words, how many words share letter paths, and how abstract the theme clue is. Our Strategy Takeaways section above breaks down what made yesterday's specific puzzle tricky or approachable.",
  },
  {
    question: "Where can I find older Strands puzzles?",
    answer:
      "Our full archive at /strands-hint lists every past puzzle organized by month. Each puzzle page includes the complete solution, theme analysis, and strategy breakdown.",
  },
  {
    question: "Why does the Spangram matter so much?",
    answer:
      "The Spangram is the linchpin of every Strands puzzle. It spans the entire board from one edge to the other, physically dividing the grid and revealing the overarching theme. Once you identify the Spangram, the remaining theme words become much easier to spot because you understand the connection tying them together.",
  },
];

// Revalidate every 30 min so this page picks up new puzzle data from KV
export const revalidate = 1800;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "StrandsYesterday" });
  const puzzle = await getYesterdayPuzzle();
  const dateStr = puzzle
    ? dayjs(puzzle.printDate).format("MMMM D, YYYY")
    : "Yesterday";

  return constructMetadata({
    page: "StrandsYesterday",
    title: `${t("title")} — ${dateStr}`,
    description: t("description"),
    keywords: [
      "yesterday strands answer",
      "yesterday's strands puzzle",
      "strands answer yesterday",
      "nyt strands yesterday",
      "strands yesterday solution",
      "strands previous puzzle",
    ],
    locale: locale as Locale,
    path: `/strands-hint-yesterday`,
    canonicalUrl: `/strands-hint-yesterday`,
  });
}

export default async function StrandsYesterdayPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const puzzle = await getYesterdayPuzzle();
  const recentPuzzles = await getRecentPuzzles(5);

  if (!puzzle) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="font-heading text-3xl font-bold">No Data Available</h1>
        <p className="mt-4 text-muted-foreground">
          Yesterday&apos;s puzzle data hasn&apos;t been loaded yet.
        </p>
        <Link
          href="/strands-hint"
          className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
        >
          Browse Archive
        </Link>
      </div>
    );
  }

  const formattedDate = dayjs(puzzle.printDate).format("MMMM D, YYYY");
  const dayOfWeek = dayjs(puzzle.printDate).format("dddd");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Strands Archive", url: `${BASE_URL}/strands-hint` },
          {
            name: "Yesterday's Answer",
            url: `${BASE_URL}/strands-hint-yesterday`,
          },
        ])}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      {/* Navigation */}
      <nav className="mb-6 flex items-center gap-3 text-sm text-muted-foreground">
        <Link href="/strands-hint" className="hover:text-primary transition-colors">
          Archive
        </Link>
        <span>/</span>
        <span className="text-foreground">Yesterday&apos;s Answer</span>
      </nav>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 p-6 sm:p-8 text-white mb-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2 text-slate-300 text-sm">
            <Calendar className="h-4 w-4" />
            <span>
              {dayOfWeek}, {formattedDate}
            </span>
            <span className="mx-1">&middot;</span>
            <span>Puzzle #{puzzle.id}</span>
          </div>
          <h1 className="font-heading text-3xl font-bold sm:text-4xl">
            Yesterday&apos;s Strands Answer
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base">
            Theme: &ldquo;{puzzle.clue}&rdquo; &mdash; complete solution with
            full analysis and strategy breakdown.
          </p>
        </div>
      </header>

      {/* ── 3-col stat cards ───────────────────────────────────────────────── */}
      <section className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 text-center shadow-sm">
          <div className="font-heading text-3xl font-bold text-primary">
            #{puzzle.id}
          </div>
          <div className="mt-1 text-sm font-semibold text-foreground">
            Puzzle Number
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 text-center shadow-sm">
          <div className="font-heading text-3xl font-bold text-blue-500">
            {puzzle.themeWords.length}
          </div>
          <div className="mt-1 text-sm font-semibold text-foreground">
            Theme Words
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            + 1 Spangram
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 text-center shadow-sm">
          <div className="font-heading text-3xl font-bold text-amber-500">
            {puzzle.spangram.length}
          </div>
          <div className="mt-1 text-sm font-semibold text-foreground">
            Spangram Letters
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Spans the full board
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* ── Main content ─────────────────────────────────────────────────── */}
        <div className="flex-1 space-y-8">

          {/* Spangram */}
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6 shadow-sm dark:border-amber-900/40 dark:bg-amber-950/20">
            <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-foreground mb-4">
              <span className="text-amber-500">★</span>
              Spangram
            </h2>
            <div className="flex flex-wrap items-center gap-4">
              <span className="rounded-xl bg-amber-400/20 px-6 py-3 font-heading text-2xl font-bold text-amber-700 dark:text-amber-400 tracking-widest border border-amber-300 dark:border-amber-800">
                {puzzle.spangram}
              </span>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  <strong className="text-foreground">Length:</strong>{" "}
                  {puzzle.spangram.length} letters
                </p>
                <p>
                  <strong className="text-foreground">Starts with:</strong>{" "}
                  {puzzle.spangram[0]}
                </p>
                <p>
                  <strong className="text-foreground">Ends with:</strong>{" "}
                  {puzzle.spangram[puzzle.spangram.length - 1]}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              The Spangram <strong className="text-foreground">&ldquo;{puzzle.spangram}&rdquo;</strong> spans
              the entire 6×8 grid from one edge to the opposite edge. It
              directly embodies the puzzle&apos;s theme clue:{" "}
              <strong className="text-foreground">&ldquo;{puzzle.clue}&rdquo;</strong>.
              Every Strands puzzle has exactly one Spangram and it&apos;s highlighted
              in gold when found.
            </p>
          </section>

          {/* Theme Words */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
            <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-foreground mb-4">
              <span className="h-3 w-3 rounded-full bg-blue-500 inline-block" />
              Theme Words
            </h2>
            <div className="flex flex-wrap gap-2 mb-5">
              {puzzle.themeWords.map((word) => (
                <span
                  key={word}
                  className="rounded-lg bg-blue-100 px-4 py-2 font-heading font-bold text-blue-800 tracking-wide dark:bg-blue-950/40 dark:text-blue-300"
                >
                  {word}
                </span>
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              All {puzzle.themeWords.length} theme words connect to the theme
              clue &ldquo;{puzzle.clue}&rdquo;. Together with the Spangram, they fill every
              letter on the 6×8 grid — no letters are left unused.
            </p>
          </section>

          {/* Solved Grid */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-8 shadow-sm">
            <h2 className="font-heading text-xl font-bold text-foreground text-center mb-2">
              Solved Grid
            </h2>
            <p className="text-center text-xs text-muted-foreground mb-5">
              Blue = theme words &nbsp;|&nbsp; Gold = Spangram
            </p>
            <StrandsGridStatic puzzle={puzzle} />
          </section>

          {/* Puzzle Breakdown Table */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
            <h2 className="font-heading text-xl font-bold text-foreground mb-4">
              Puzzle Breakdown
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Every word in the puzzle, including letter count and how it
              connects to the theme &ldquo;{puzzle.clue}&rdquo;.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 pr-4 text-left font-heading text-xs uppercase tracking-wide text-muted-foreground">
                      Word
                    </th>
                    <th className="py-2 pr-4 text-left font-heading text-xs uppercase tracking-wide text-muted-foreground">
                      Letters
                    </th>
                    <th className="py-2 text-left font-heading text-xs uppercase tracking-wide text-muted-foreground">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Spangram row */}
                  <tr className="border-b border-border/50 bg-amber-50/50 dark:bg-amber-950/10">
                    <td className="py-2.5 pr-4 font-bold text-amber-700 dark:text-amber-400">
                      {puzzle.spangram}
                    </td>
                    <td className="py-2.5 pr-4 text-foreground">
                      {puzzle.spangram.length}
                    </td>
                    <td className="py-2.5">
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                        Spangram
                      </span>
                    </td>
                  </tr>
                  {/* Theme word rows */}
                  {puzzle.themeWords.map((word, i) => (
                    <tr
                      key={word}
                      className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-muted/20"}`}
                    >
                      <td className="py-2.5 pr-4 font-semibold text-blue-700 dark:text-blue-300">
                        {word}
                      </td>
                      <td className="py-2.5 pr-4 text-foreground">
                        {word.length}
                      </td>
                      <td className="py-2.5">
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                          Theme Word
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Theme Analysis */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
            <h2 className="font-heading text-xl font-bold text-foreground mb-4">
              Theme Analysis
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The theme clue <strong className="text-foreground">&ldquo;{puzzle.clue}&rdquo;</strong> tied
              together {puzzle.themeWords.length} distinct theme words plus the
              Spangram <strong className="text-foreground">{puzzle.spangram}</strong>. NYT Strands
              themes often draw from everyday categories like food, nature,
              pop culture, or wordplay — but the clue frequently uses a twist,
              double meaning, or metaphor that makes the connection non-obvious
              at first glance.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The word lengths in this puzzle range from{" "}
              <strong className="text-foreground">
                {Math.min(...puzzle.themeWords.map((w) => w.length))}
              </strong>{" "}
              to{" "}
              <strong className="text-foreground">
                {Math.max(...puzzle.themeWords.map((w) => w.length))}
              </strong>{" "}
              letters. Shorter theme words are typically the first ones players
              spot on the grid, while longer words tend to wind along less
              obvious paths through the letter matrix.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Once a player identifies the Spangram —{" "}
              <strong className="text-foreground">{puzzle.spangram}</strong> —
              it physically bisects the board and often eliminates entire
              regions from consideration for other words, dramatically narrowing
              the search space. This is why the Spangram is always the most
              important word to find first.
            </p>
          </section>

          {/* Strategy Takeaways */}
          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
              Strategy Takeaways
            </h2>
            <p className="text-muted-foreground text-sm mb-5">
              What yesterday&apos;s puzzle teaches us about solving Strands:
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: Target,
                  color: "text-primary",
                  bg: "bg-primary/10",
                  title: "Interpret the Clue Broadly",
                  body: `The clue "${puzzle.clue}" may have multiple interpretations. When stuck, try thinking of synonyms, related concepts, or metaphorical meanings of the key words in the clue.`,
                },
                {
                  icon: Trophy,
                  color: "text-amber-500",
                  bg: "bg-amber-500/10",
                  title: "Spangram Defines the Board",
                  body: `At ${puzzle.spangram.length} letters, "${puzzle.spangram}" carves the grid into sections. Finding it early removes a large swath of letters from the theme word search.`,
                },
                {
                  icon: Lightbulb,
                  color: "text-blue-500",
                  bg: "bg-blue-500/10",
                  title: "Short Words First",
                  body: `The ${Math.min(...puzzle.themeWords.map((w) => w.length))}-letter words are the easiest entry points. Securing short theme words early builds momentum and removes letters from the grid.`,
                },
                {
                  icon: CheckCircle2,
                  color: "text-emerald-500",
                  bg: "bg-emerald-500/10",
                  title: "Eliminate Used Letters",
                  body: "Every letter in Strands belongs to exactly one word. As you find theme words, the remaining letters must form the remaining answers — use elimination to your advantage.",
                },
              ].map(({ icon: Icon, color, bg, title, body }) => (
                <div
                  key={title}
                  className="rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}>
                      <Icon className={`h-4 w-4 ${color}`} />
                    </div>
                    <h3 className="font-heading text-sm font-bold text-foreground">
                      {title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {body}
                  </p>
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

          {/* CTA */}
          <section className="rounded-2xl bg-gradient-to-br from-primary to-primary/90 p-6 sm:p-8 text-center text-primary-foreground">
            <h2 className="font-heading text-2xl font-bold">
              Ready for Today&apos;s Puzzle?
            </h2>
            <p className="mt-2 text-sm text-primary-foreground/80">
              Get progressive hints for today&apos;s fresh Strands puzzle, or
              explore our full archive.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                href="/strands-hint-today"
                className="rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-primary transition-all hover:bg-white/90"
              >
                Today&apos;s Hints
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

        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sticky top-24 space-y-4">
            <div>
              <h3 className="font-heading text-sm font-bold text-foreground mb-3">
                Recent Puzzles
              </h3>
              <div className="space-y-1">
                {recentPuzzles
                  .filter((p) => p.printDate !== puzzle.printDate)
                  .slice(0, 6)
                  .map((p) => (
                    <Link
                      key={p.printDate}
                      href={`/strands-hint/${p.printDate}`}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-primary/5"
                    >
                      <span className="font-medium text-foreground truncate">
                        #{p.id} &mdash; {dayjs(p.printDate).format("MMM D")}
                      </span>
                      <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
                    </Link>
                  ))}
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <Link
                  href="/strands-hint"
                  className="block text-center text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  View All Archives →
                </Link>
              </div>
            </div>

            <div className="pt-3 border-t border-border">
              <h3 className="font-heading text-sm font-bold text-foreground mb-2">
                Quick Links
              </h3>
              <div className="space-y-1 text-sm">
                {[
                  { href: "/strands-hint-today", label: "Today's Hints" },
                  { href: "/how-to-play-strands", label: "How to Play" },
                  { href: "/strands-statistics", label: "Puzzle Statistics" },
                  { href: "/strands-hint-faq", label: "FAQ" },
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                  >
                    <BookOpen className="h-3 w-3 shrink-0" />
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom nav */}
      <div className="mt-8 flex justify-between text-sm">
        <Link
          href="/strands-hint"
          className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Full Archive
        </Link>
        <Link
          href="/strands-hint-today"
          className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
        >
          Today&apos;s Hints
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
