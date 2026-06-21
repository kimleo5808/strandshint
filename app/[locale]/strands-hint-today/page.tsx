import { StrandsGrid } from "@/components/strands/StrandsGrid";
import { StrandsHintLadder } from "@/components/strands/StrandsHintLadder";
import { BASE_URL } from "@/config/site";
import { GUIDES } from "@/data/guides";
import { Locale, LOCALES } from "@/i18n/routing";
import { Link as I18nLink } from "@/i18n/routing";
import { getLatestPuzzle, getRecentPuzzles } from "@/lib/strands-data";
import { getDifficulty, getSpangramDirection } from "@/lib/strands-hints";
import {
  generateOverview,
  generateStrategyTips,
  generateFAQ,
  getWordSetFacts,
} from "@/lib/strands-analysis";
import {
  breadcrumbSchema,
  faqPageSchema,
  JsonLd,
} from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import dayjs from "dayjs";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Grid3X3,
  Target,
  Zap,
} from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

// Icons rotated across the per-puzzle strategy tips generated at request time.
const TIP_ICONS = [Target, Zap, Grid3X3, BookOpen];

// Evergreen "how the game works" questions. Puzzle-specific Q&A is generated
// per request and merged in below, so this list stays general.
const GENERAL_FAQ_ITEMS = [
  {
    question: "When does the new Strands puzzle come out?",
    answer:
      "The new NYT Strands puzzle is released every day at midnight Eastern Time. We update our hints page shortly after, ensuring you have access to fresh hints as soon as the new puzzle goes live.",
  },
  {
    question: "What happens when I make wrong guesses in Strands?",
    answer:
      "In Strands, after every 3 incorrect word guesses, you earn a hint that highlights one letter of a theme word on the board. This helps you narrow down where the remaining words are hidden.",
  },
];

// Revalidate every 60s so this page picks up new puzzle data from KV
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "StrandsHintToday",
  });
  const puzzle = await getLatestPuzzle();
  const dateStr = puzzle
    ? dayjs(puzzle.printDate).format("MMMM D, YYYY")
    : "Today";

  return constructMetadata({
    page: "StrandsHintToday",
    title: `${t("title")} — ${dateStr}`,
    description: t("description"),
    keywords: [
      "strands hint today",
      "nyt strands hint",
      "strands answers today",
      "strands puzzle today",
      "nyt strands answers",
      "strands help today",
    ],
    locale: locale as Locale,
    path: `/strands-hint-today`,
    canonicalUrl: `/strands-hint-today`,
  });
}

export default async function StrandsHintTodayPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const puzzle = await getLatestPuzzle();
  const recentPuzzles = await getRecentPuzzles(7);

  if (!puzzle) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="font-heading text-3xl font-bold">No Puzzle Available</h1>
        <p className="mt-4 text-muted-foreground">
          Today&apos;s puzzle hasn&apos;t been loaded yet. Check back soon!
        </p>
      </div>
    );
  }

  const formattedDate = dayjs(puzzle.printDate).format("MMMM D, YYYY");
  const dayOfWeek = dayjs(puzzle.printDate).format("dddd");
  const difficulty = getDifficulty(puzzle);
  const dir = getSpangramDirection(puzzle);
  const facts = getWordSetFacts(puzzle);
  const overview = generateOverview(puzzle);
  const strategyTips = generateStrategyTips(puzzle);
  const faqItems = [
    ...generateFAQ(puzzle).map((f) => ({ question: f.q, answer: f.a })),
    ...GENERAL_FAQ_ITEMS,
  ];

  const guides = GUIDES.slice(0, 6);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 grid-bg">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "Today's Hints",
            url: `${BASE_URL}/strands-hint-today`,
          },
        ])}
      />
      <JsonLd data={faqPageSchema(faqItems)} />

      {/* Title */}
      <header className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
          <Calendar className="h-4 w-4" />
          <span>
            {dayOfWeek}, {formattedDate}
          </span>
          <span className="mx-1">&middot;</span>
          <span>Puzzle #{puzzle.id}</span>
          <span className="mx-1">&middot;</span>
          <span
            className={`rounded-md px-2 py-0.5 text-xs font-bold ${
              difficulty.level === 1
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                : difficulty.level === 2
                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                  : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
            }`}
          >
            {difficulty.label}
          </span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Strands Hint Today
        </h1>
        <p className="mt-2 text-muted-foreground">
          Progressive hints for today&apos;s NYT Strands puzzle. Reveal one
          hint at a time to keep the challenge!
        </p>
      </header>

      {/* Today's Grid Preview */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-8 mb-8 shadow-sm">
        <h2 className="text-center font-heading text-lg font-bold text-foreground mb-1">
          Today&apos;s Letter Grid
        </h2>
        <p className="text-center text-xs text-muted-foreground mb-2">
          Theme: &ldquo;{puzzle.clue}&rdquo;
        </p>
        <p className="text-center text-xs text-muted-foreground mb-5">
          Find {puzzle.themeWords.length} theme words + 1 Spangram
        </p>
        <StrandsGrid puzzle={puzzle} interactive />
      </section>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Main content */}
        <div className="flex-1 space-y-6">
          {/* Progressive hint ladder */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
            <StrandsHintLadder puzzle={puzzle} variant="full" />
          </section>
        </div>

        {/* Sidebar */}
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
                View All Hints →
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* ─── SEO Content Sections ─── */}

      {/* Strategy Tips */}
      <section className="mt-12">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Today&apos;s Strategy Tips
        </h2>
        <p className="mt-2 text-muted-foreground">
          Tips tailored to puzzle #{puzzle.id} — its grid, its words, today only:
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {strategyTips.map((tip, i) => {
            const Icon = TIP_ICONS[i % TIP_ICONS.length];
            return (
              <div
                key={i}
                className="rounded-xl border border-primary/20 bg-card p-5"
              >
                <Icon className="h-4 w-4 text-primary mb-2" />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {tip}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How Strands Works */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          How Strands Works
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            NYT Strands presents you with a 6×8 letter grid and a theme clue.
            Your goal is to find all the hidden theme words by connecting
            adjacent letters (horizontally, vertically, or diagonally). You
            also need to find the Spangram — a special word that spans the
            entire board and directly relates to the theme.
          </p>
          <p>
            <strong className="font-semibold text-foreground">
              Hint System:
            </strong>{" "}
            After every 3 incorrect word guesses, you earn a hint that
            highlights one letter of a theme word. Every letter on the board is
            used — there are no wasted letters!
          </p>
        </div>
      </section>

      {/* Difficulty Analysis */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Today&apos;s Puzzle Difficulty Analysis
        </h2>
        <p className="mt-2 text-muted-foreground">
          Understanding what makes today&apos;s puzzle challenging helps you
          improve for tomorrow:
        </p>
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border-l-4 border-l-amber-500 border border-border bg-card p-5">
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              The Spangram
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Today&apos;s Spangram is {puzzle.spangram.length} letters and{" "}
              {dir.description}. Tracing it early from the {dir.startEdge} splits
              the board in two and locks in the theme &ldquo;{puzzle.clue}&rdquo;,
              which makes the remaining words far easier to place.
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-l-strands-theme border border-border bg-card p-5">
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              Theme Word Difficulty
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              This board hides {facts.count} theme words ranging from{" "}
              {facts.shortest} to {facts.longest} letters (averaging{" "}
              {facts.avgLength}).{" "}
              {facts.sharedFirstLetters.length
                ? `Watch the repeated starting letters (${facts.sharedFirstLetters.join(", ")}) — more than one word begins the same way, so the first match you spot may not be the only one.`
                : `Every theme word starts with a different letter (${facts.firstLetters.join(", ")}), so first-letter scanning is a dependable way to tell them apart.`}
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-l-emerald-500 border border-border bg-card p-5">
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              Recommended Approach
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              By our heuristic, puzzle #{puzzle.id} plays as{" "}
              {difficulty.label.toLowerCase()}. Read the clue, find the Spangram
              from the {dir.startEdge}, then work outward — every letter on the
              board belongs to exactly one word, so each word you confirm tightens
              where the rest can hide.
            </p>
          </div>
        </div>
      </section>

      {/* Guide Navigation */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Strategy Guides
        </h2>
        <p className="mt-2 text-muted-foreground">
          Deep-dive into proven strategies and expert techniques:
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <I18nLink
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              prefetch={false}
              className="group flex items-center gap-3 rounded-xl border border-primary/20 bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <span className="text-xl">{guide.icon}</span>
              <div className="min-w-0">
                <span className="block text-sm font-semibold text-foreground group-hover:text-primary truncate">
                  {guide.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {guide.readTime}
                </span>
              </div>
            </I18nLink>
          ))}
        </div>

        {/* Guides callout */}
        <div className="mt-6 rounded-2xl bg-primary p-6 text-center text-primary-foreground sm:p-8">
          <h3 className="font-heading text-lg font-bold">
            Struggling with Today&apos;s Puzzle?
          </h3>
          <p className="mt-2 text-sm text-primary-foreground/80">
            Don&apos;t worry! Even experts get stuck. Check out our proven
            strategies or learn about common mistakes that might be holding you
            back.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <I18nLink
              href="/guides/beginner-guide"
              prefetch={false}
              className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-white/90"
            >
              Start Learning
            </I18nLink>
            <I18nLink
              href="/guides/advanced-techniques"
              prefetch={false}
              className="rounded-lg border-2 border-white px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-primary"
            >
              Expert Techniques
            </I18nLink>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground text-center">
          Frequently Asked Questions
        </h2>
        <div className="mt-6 space-y-4 max-w-3xl mx-auto">
          {faqItems.map((item) => (
            <div
              key={item.question}
              className="rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <h3 className="font-heading text-sm font-bold text-primary mb-2">
                {item.question}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* About Today's Puzzle */}
      <section className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
          About Today&apos;s Strands Puzzle
        </h2>
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>{overview}</p>
          <p>
            Strands combines the satisfaction of word search puzzles with the
            thematic depth of crosswords. The beauty of the game is that every
            single letter on the board is used — there&apos;s no wasted space.
            This means you can use process of elimination: once you find most
            words, the remaining letters must form the final words.
          </p>
          <p>
            Remember: every puzzle is solvable with careful thought and strategy.
            If you&apos;re stuck, our progressive hint system above will guide
            you toward the solution without completely spoiling the satisfaction
            of solving. Come back tomorrow for a fresh puzzle and new hints!
          </p>
        </div>
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
