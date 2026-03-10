import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { breadcrumbSchema, howToSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import {
  BookOpen,
  Brain,
  CheckCircle2,
  Grid3X3,
  Lightbulb,
  Search,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HowToPlay" });

  return constructMetadata({
    page: "HowToPlay",
    title: t("title"),
    description: t("description"),
    keywords: [
      "how to play strands",
      "strands rules",
      "nyt strands guide",
      "strands game rules",
      "strands tips",
      "strands strategy",
      "strands spangram",
    ],
    locale: locale as Locale,
    path: `/how-to-play-strands`,
    canonicalUrl: `/how-to-play-strands`,
  });
}

const KEY_CONCEPTS = [
  {
    color: "Theme Words",
    bg: "bg-strands-theme",
    textBg: "bg-strands-theme/15 text-strands-theme",
    label: "Blue Highlight",
    description:
      "Regular theme words that relate to the daily puzzle theme. When you find one, the letters highlight blue on the board. Most puzzles have 6-7 theme words to discover.",
  },
  {
    color: "Spangram",
    bg: "bg-strands-spangram",
    textBg: "bg-strands-spangram/15 text-strands-spangram",
    label: "Yellow Highlight",
    description:
      "A special word that spans the entire board from one side to the other and describes the puzzle\u2019s overall theme. Every puzzle has exactly one Spangram \u2014 finding it is the key to solving the rest.",
  },
  {
    color: "Hints",
    bg: "bg-primary",
    textBg: "bg-primary/10 text-primary",
    label: "Earn by Finding",
    description:
      "You earn a hint for every 3 non-theme words you find on the board. Hints reveal the first letters of a theme word, helping you when you\u2019re stuck.",
  },
];

const STRATEGIES = [
  {
    icon: Search,
    title: "Read the Theme Clue",
    description:
      "Every puzzle has a theme clue at the top. Read it carefully \u2014 it tells you what all the theme words have in common. Understanding the theme is the single most important step.",
  },
  {
    icon: Target,
    title: "Find the Spangram First",
    description:
      "The Spangram describes the overall theme and spans the full board. Finding it early gives you a clear picture of what other theme words to look for.",
  },
  {
    icon: Brain,
    title: "Think in Categories",
    description:
      "Theme words are all related to the clue. If the theme is \"Things at a beach,\" think of every beach-related word you can \u2014 SAND, WAVE, SHELL, TOWEL \u2014 then look for them on the grid.",
  },
  {
    icon: Lightbulb,
    title: "Trace in All Directions",
    description:
      "Words can go horizontally, vertically, diagonally, and even change direction mid-word. Don\u2019t limit yourself to straight lines \u2014 follow the letters wherever they lead.",
  },
  {
    icon: Zap,
    title: "Use Non-Theme Words Strategically",
    description:
      "Finding non-theme words isn\u2019t wasted effort. Every 3 non-theme words earns you a hint. If you\u2019re stuck on theme words, hunt for any valid words to unlock hints.",
  },
  {
    icon: CheckCircle2,
    title: "Work the Edges",
    description:
      "The Spangram must touch two opposite edges of the board. Look for long words that could connect the top to bottom or left to right \u2014 this narrows down your Spangram search.",
  },
];

export default async function HowToPlayPage({ params }: { params: Params }) {
  await params;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "How to Play",
            url: `${BASE_URL}/how-to-play-strands`,
          },
        ])}
      />
      <JsonLd
        data={howToSchema(
          "How to Play NYT Strands",
          "Learn the rules and strategies to solve the NYT Strands word puzzle every day.",
          [
            { name: "Read the Theme Clue", text: "Every puzzle has a theme clue at the top. Read it carefully — it tells you what all the theme words have in common. Consider multiple interpretations; the clue might be a pun or double meaning." },
            { name: "Scan for the Spangram", text: "Look for a long word that spans the entire board from one edge to the opposite edge. The Spangram describes the overall theme and is highlighted in gold when found." },
            { name: "Find Theme Words", text: "Connect adjacent letters (horizontally, vertically, or diagonally) to form words related to the theme. Words can twist and turn in any direction. Theme words highlight in blue when found." },
            { name: "Earn Hints", text: "Find valid non-theme words (at least 4 letters) to earn hint tokens. Every 3 tokens reveals a letter in a remaining theme word." },
            { name: "Use Elimination", text: "As you find words, track which letters are used. Every letter belongs to exactly one answer. The remaining uncovered letters must form the remaining answers." },
            { name: "Complete the Puzzle", text: "The puzzle is solved when you find the Spangram and all theme words. Every letter on the board will be highlighted." },
          ]
        )}
      />

      {/* Header */}
      <header className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-white to-primary/5 p-6 sm:p-8 dark:border-primary/40 dark:from-zinc-900 dark:via-zinc-900 dark:to-primary/10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">
              Guide
            </span>
          </div>
          <h1 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            How to Play NYT Strands
          </h1>
          <p className="mt-2 text-muted-foreground">
            Learn the rules, understand the key concepts, and master
            strategies to solve the Strands puzzle every day.
          </p>
        </div>
      </header>

      <div className="mt-8 space-y-8">
        {/* Basic Rules */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-foreground">
            <Grid3X3 className="h-5 w-5 text-primary" />
            The Rules
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              NYT Strands is a daily word search puzzle by The New York Times.
              Each day, you&apos;re presented with a{" "}
              <strong>6&times;8 grid of letters</strong> and a theme clue.
            </p>
            <p>
              Your goal is to find all the <strong>theme words</strong> hidden
              in the grid. Theme words connect to the daily clue and can twist
              and turn in any direction &mdash; horizontally, vertically,
              diagonally, and even changing direction mid-word.
            </p>
            <p>
              Every puzzle includes one special word called the{" "}
              <strong>Spangram</strong> &mdash; a word that spans the entire
              board from one side to the other and captures the puzzle&apos;s
              overall theme.
            </p>
            <p>
              Unlike other word games, <strong>there are no mistake limits</strong>.
              You can keep searching until you find all the theme words. A new
              puzzle is released every day at midnight Eastern Time.
            </p>
          </div>
        </section>

        {/* Key Concepts */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-foreground">
            <Sparkles className="h-5 w-5 text-primary" />
            Key Concepts
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Understanding these three elements is essential to solving every
            Strands puzzle:
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-1">
            {KEY_CONCEPTS.map((concept) => (
              <div
                key={concept.color}
                className="rounded-xl border border-border p-4"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-3 w-3 rounded-full ${concept.bg}`}
                  />
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-bold ${concept.textBg}`}
                  >
                    {concept.color} &mdash; {concept.label}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {concept.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How the Grid Works */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-foreground">
            How the Grid Works
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              The 6&times;8 grid contains 48 letters. Every single letter
              belongs to either a theme word or the Spangram &mdash; there are
              no leftover letters.
            </p>
            <p>
              To select a word, <strong>tap or click letters</strong> in
              sequence. Letters must be adjacent (including diagonals), and
              words can bend and curve through the grid in any path.
            </p>
            <p>
              When you correctly identify a <strong>theme word</strong>, its
              letters highlight in <span className="font-semibold text-strands-theme">blue</span>.
              When you find the <strong>Spangram</strong>, its letters highlight
              in <span className="font-semibold text-strands-spangram">yellow/gold</span>.
              The puzzle is complete when every letter on the board is highlighted.
            </p>
          </div>
        </section>

        {/* Strategies */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-foreground">
            Strategies & Tips
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {STRATEGIES.map((strategy) => (
              <div
                key={strategy.title}
                className="rounded-xl border border-border p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <strategy.icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">
                    {strategy.title}
                  </h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {strategy.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Also Try */}
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-heading text-lg font-bold text-foreground mb-4">Also Try These Puzzles &amp; Tools</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Link href="/connections-hint-today" className="rounded-lg border border-purple-200 bg-purple-50 p-4 hover:border-purple-400 transition-colors">
              <p className="text-sm font-bold text-purple-800">NYT Connections Hints</p>
              <p className="text-xs text-purple-600 mt-1">Today&apos;s hints for all 4 categories →</p>
            </Link>
            <Link href="/wordle-hint-today" className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 hover:border-emerald-400 transition-colors">
              <p className="text-sm font-bold text-emerald-800">NYT Wordle Hints</p>
              <p className="text-xs text-emerald-600 mt-1">Progressive clues for today&apos;s word →</p>
            </Link>
            <Link href="/word-finder" className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 hover:border-indigo-400 transition-colors">
              <p className="text-sm font-bold text-indigo-800">Word Finder Tool</p>
              <p className="text-xs text-indigo-600 mt-1">Search words by pattern &amp; position →</p>
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-gradient-to-br from-primary to-primary/90 p-6 sm:p-8 text-center text-primary-foreground">
          <h2 className="font-heading text-2xl font-bold">
            Ready to Play?
          </h2>
          <p className="mt-2 opacity-90">
            Check out today&apos;s puzzle hints or browse our archive.
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
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
