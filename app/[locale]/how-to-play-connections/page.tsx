import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { breadcrumbSchema, faqPageSchema, howToSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import {
  AlertTriangle,
  BookOpen,
  Brain,
  CheckCircle2,
  Grid3X3,
  Lightbulb,
  Search,
  Shield,
  Sparkles,
  Target,
  XCircle,
  Zap,
} from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

const HOW_TO_STEPS = [
  {
    name: "Read the 16 Words Carefully",
    text: "A 4×4 grid of 16 words is presented. Read every word before guessing — many red herrings are designed to look like they belong to an obvious group.",
  },
  {
    name: "Look for the Easiest Group First",
    text: "The yellow (easiest) group is your entry point. Find 4 words that share an obvious, unambiguous connection. Completing it removes those words and clarifies the remaining grid.",
  },
  {
    name: "Identify the Hidden Connection Type",
    text: "Connections often groups words by a hidden rule: words that can follow a specific word, types of something, slang for the same thing, etc. Think beyond the obvious surface meaning.",
  },
  {
    name: "Test Before Submitting",
    text: "Before hitting Submit, mentally double-check each word belongs to your chosen group. The game warns you if you're 'one away' from a correct group, giving a second chance.",
  },
  {
    name: "Use Your Mistakes Strategically",
    text: "You have 4 mistakes total. Use your first 2-3 carefully on groups you're 90%+ confident in. Save at least one mistake as a safety net for the final groups.",
  },
  {
    name: "Work by Elimination",
    text: "Once 3 groups are found, the 4th group is automatically revealed by elimination. If you're stuck, completing the easier groups first often clarifies the hardest group (purple).",
  },
];

const DIFFICULTY_LEVELS = [
  {
    name: "Yellow — Easiest",
    bg: "bg-yellow-400",
    text: "text-yellow-950",
    border: "border-yellow-400",
    cardBg: "bg-yellow-50 dark:bg-yellow-950/20",
    example: "Types of dogs, Capital cities",
    description:
      "The most straightforward category. The connection is direct and unambiguous. Even players new to Connections can usually spot the yellow group within the first 30 seconds.",
    tip: "Always start here. Clearing the easy group gives you more information about what the harder groups are NOT.",
  },
  {
    name: "Green — Easy",
    bg: "bg-green-500",
    text: "text-white",
    border: "border-green-500",
    cardBg: "bg-green-50 dark:bg-green-950/20",
    example: "Things that can be 'cold', Words before 'stone'",
    description:
      "Still fairly approachable, but the connection might require a bit more lateral thinking. Words may have secondary meanings that belong to this group instead of the obvious interpretation.",
    tip: "Watch out for words that seem to fit yellow but actually belong here. Green often exploits double meanings.",
  },
  {
    name: "Blue — Medium",
    bg: "bg-blue-500",
    text: "text-white",
    border: "border-blue-500",
    cardBg: "bg-blue-50 dark:bg-blue-950/20",
    example: "___ fish, Famous ___s",
    description:
      "The connection requires more creative thinking. These often involve wordplay, compound words, or a specific cultural context. Many experienced players get tripped up on blue.",
    tip: "If you have 3 words that clearly fit a pattern, the 4th might be a word you wouldn't normally associate with the group — trust the pattern.",
  },
  {
    name: "Purple — Hardest",
    bg: "bg-purple-600",
    text: "text-white",
    border: "border-purple-600",
    cardBg: "bg-purple-50 dark:bg-purple-950/20",
    example: "Hidden word completions, Abstract conceptual links",
    description:
      "The trickiest category by design. Purple connections are often highly abstract, involve obscure wordplay, or deliberately include red herrings that mimic easier groups. Even veteran players often find purple by elimination.",
    tip: "Don't force purple. Use elimination — solve yellow, green, and blue first, and purple often reveals itself from the remaining 4 words.",
  },
];

const TRAPS = [
  {
    icon: AlertTriangle,
    title: "The Red Herring Word",
    description:
      "One word is almost always placed to look like it belongs to an obvious group when it actually belongs to a trickier one. These crossover words are the game's primary challenge.",
  },
  {
    icon: XCircle,
    title: "Multiple Meanings",
    description:
      "A word like 'BASS' could be a fish, a musical term, or part of a phrase. Connections deliberately picks words with multiple meanings to create ambiguity.",
  },
  {
    icon: AlertTriangle,
    title: "The Almost-Full Group",
    description:
      "You spot 3 words that clearly connect, but the 4th eludes you. The game will tell you 'one away' if you pick 4 words with 3 correct — use this to confirm your near-correct groups.",
  },
  {
    icon: XCircle,
    title: "Category Overlap",
    description:
      "Two groups might share a theme that could logically apply to both (e.g., things that are 'green' AND types of vegetables). Look for the more specific grouping.",
  },
  {
    icon: AlertTriangle,
    title: "Rushing the Purple Group",
    description:
      "Never guess purple early. Its abstract nature means almost any 4 words could seem to connect if you're imaginative enough — the real purple group is usually the one you'd never expect.",
  },
  {
    icon: XCircle,
    title: "Ignoring Proper Nouns",
    description:
      "Names, places, and brands often appear and belong to unexpected categories. Don't assume a proper noun must be in a 'names' group — it might complete a wordplay pattern.",
  },
];

const STRATEGIES = [
  {
    icon: Search,
    title: "Scan for Obvious Quartets First",
    description:
      "Before anything else, see if any 4 words jump out as an unmistakable group. If yes, submit it immediately — early wins build momentum and clarify the board.",
  },
  {
    icon: Target,
    title: "Think in Wordplay Patterns",
    description:
      "Ask: Can these words all follow '___'? Precede '___'? Be a type of ___? Hidden word completions, compound words, and fill-in-the-blank patterns are the most common Connections structures.",
  },
  {
    icon: Brain,
    title: "Consider Every Word's Secondary Meaning",
    description:
      "Every word in Connections is chosen because it has at least one non-obvious interpretation. Before assuming a word belongs to the obvious group, ask what else it could mean.",
  },
  {
    icon: Shield,
    title: "Protect Your Remaining Mistakes",
    description:
      "You only get 4 mistakes total. Once you've used 3, treat your final attempt like a lifeline. Use elimination — if you've correctly identified 3 groups, the 4th is automatic.",
  },
  {
    icon: Lightbulb,
    title: "Use the 'One Away' Clue",
    description:
      "If the game says 'one away,' you've identified 3 of 4 correct words. Swap out each of your 4 choices one at a time to find the one that doesn't belong.",
  },
  {
    icon: Zap,
    title: "Trust Elimination Over Guessing",
    description:
      "Solve the 3 clearest groups first. The remaining 4 words form the hardest group — purple — by definition. This beats trying to guess purple cold every time.",
  },
];

const FAQ_ITEMS = [
  {
    question: "How many mistakes do you get in Connections?",
    answer:
      "You get exactly 4 mistakes (represented by colored bubbles at the bottom of the screen). Each wrong guess removes one bubble. When all 4 are gone, the game ends and reveals the correct groupings.",
  },
  {
    question: "What does 'one away' mean in Connections?",
    answer:
      "'One away' means your selected group of 4 words contains 3 words from a correct category and 1 from a different category. The game gives you this hint so you know you're close — try swapping out each of your 4 choices to find the misfit.",
  },
  {
    question: "Can the same word appear in two Connections categories?",
    answer:
      "No — each word belongs to exactly one of the four categories. However, words are deliberately chosen because they COULD plausibly fit multiple categories, creating the red herring effect that makes the game challenging.",
  },
  {
    question: "When does a new Connections puzzle come out?",
    answer:
      "A new NYT Connections puzzle is released every day at midnight Eastern Time, the same as Wordle and Strands. The puzzle resets at midnight, so you get a fresh challenge every day.",
  },
  {
    question: "Is NYT Connections harder than Wordle?",
    answer:
      "They test different skills. Wordle tests vocabulary and letter deduction. Connections tests pattern recognition, lateral thinking, and knowledge of idioms, wordplay, and cultural references. Many players find Connections more unpredictable because the difficulty of the purple category varies greatly from day to day.",
  },
  {
    question: "How is Connections different from Strands?",
    answer:
      "Connections uses a 4×4 grid of words that you group into 4 categories. Strands uses a 6×8 grid of letters where you connect adjacent letters to form hidden words. Both feature a daily theme, but the mechanics are entirely different — Connections is about categorization and wordplay, Strands is about spatial word search.",
  },
  {
    question: "What is the hardest Connections category?",
    answer:
      "Purple is always the hardest category by design. NYT editors specifically create purple groups to include abstract connections, obscure wordplay, or unexpected linking rules that experienced players wouldn't immediately see. Many players solve purple purely through elimination rather than direct insight.",
  },
  {
    question: "Can I play past Connections puzzles?",
    answer:
      "Our Connections archive lets you browse and view solutions for all past puzzles. However, the official NYT Connections game only lets you play the current day's puzzle — yesterday's and older puzzles are no longer playable in the official app.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HowToPlayConnections" });

  return constructMetadata({
    page: "HowToPlayConnections",
    title: t("title"),
    description: t("description"),
    keywords: [
      "how to play nyt connections",
      "connections game rules",
      "connections strategy",
      "nyt connections tips",
      "connections puzzle guide",
      "connections difficulty levels",
      "connections yellow green blue purple",
    ],
    locale: locale as Locale,
    path: `/how-to-play-connections`,
    canonicalUrl: `/how-to-play-connections`,
  });
}

export default async function HowToPlayConnectionsPage({
  params,
}: {
  params: Params;
}) {
  await params;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "How to Play Connections",
            url: `${BASE_URL}/how-to-play-connections`,
          },
        ])}
      />
      <JsonLd
        data={howToSchema(
          "How to Play NYT Connections",
          "Learn the rules, difficulty levels, and strategies to solve the NYT Connections word puzzle every day.",
          HOW_TO_STEPS
        )}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden rounded-2xl border border-purple-200/50 bg-gradient-to-br from-purple-50 via-white to-purple-50 p-6 sm:p-8 dark:border-purple-900/40 dark:from-purple-950/30 dark:via-zinc-900 dark:to-purple-950/10 mb-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-purple-400/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              Guide
            </span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            How to Play NYT Connections
          </h1>
          <p className="mt-2 text-muted-foreground">
            Master the rules, learn the four difficulty levels, spot the traps,
            and use proven strategies to solve every daily puzzle.
          </p>
        </div>
      </header>

      <div className="space-y-8">

        {/* ── What is Connections ──────────────────────────────────────────── */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-foreground mb-4">
            <Grid3X3 className="h-5 w-5 text-purple-500" />
            What is NYT Connections?
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              NYT Connections is a daily word puzzle created by The New York
              Times and edited by Wyna Liu. First launched in June 2023, it
              quickly became one of the most popular daily word games alongside
              Wordle and Strands.
            </p>
            <p>
              Each day, 16 words are arranged in a 4×4 grid. Your goal is to
              group them into <strong className="text-foreground">4 sets of 4</strong>, where
              every set shares a hidden connection. The connection might be
              types of something, words that can follow a phrase, slang terms,
              or any creative link the editor devises.
            </p>
            <p>
              A new puzzle launches every day at{" "}
              <strong className="text-foreground">midnight Eastern Time</strong>. You get{" "}
              <strong className="text-foreground">4 mistakes</strong> before the game ends,
              making every guess count. Results can be shared as colored emoji
              squares — the familiar purple/blue/green/yellow pattern you&apos;ve
              probably seen on social media.
            </p>
          </div>
        </section>

        {/* ── The Rules ───────────────────────────────────────────────────── */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-foreground mb-4">
            <CheckCircle2 className="h-5 w-5 text-purple-500" />
            The Rules
          </h2>
          <div className="grid gap-4 sm:grid-cols-3 mb-5">
            <div className="rounded-xl border border-border p-4 text-center">
              <div className="font-heading text-3xl font-bold text-purple-500">
                16
              </div>
              <div className="mt-1 text-sm font-semibold text-foreground">
                Words on the Grid
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                4 rows × 4 columns
              </div>
            </div>
            <div className="rounded-xl border border-border p-4 text-center">
              <div className="font-heading text-3xl font-bold text-purple-500">
                4
              </div>
              <div className="mt-1 text-sm font-semibold text-foreground">
                Groups to Find
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                4 words per group
              </div>
            </div>
            <div className="rounded-xl border border-border p-4 text-center">
              <div className="font-heading text-3xl font-bold text-rose-500">
                4
              </div>
              <div className="mt-1 text-sm font-semibold text-foreground">
                Mistakes Allowed
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Game ends after 4 wrong guesses
              </div>
            </div>
          </div>
          <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              Select 4 words you believe share a connection, then tap{" "}
              <strong className="text-foreground">Submit</strong>. If correct, those
              4 words are removed and their category is revealed with its color.
              If wrong, you lose one of your 4 mistake bubbles.
            </p>
            <p>
              The game also gives a{" "}
              <strong className="text-foreground">&ldquo;One Away&rdquo;</strong> hint when
              exactly 3 of your 4 selected words belong to a correct category —
              letting you know you&apos;re close without revealing which word
              is wrong.
            </p>
          </div>
        </section>

        {/* ── Difficulty Levels ────────────────────────────────────────────── */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-foreground mb-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            The Four Difficulty Levels
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            Each category is color-coded by difficulty. The color is only
            revealed after you correctly identify the group.
          </p>
          <div className="space-y-4">
            {DIFFICULTY_LEVELS.map((level) => (
              <div
                key={level.name}
                className={`rounded-xl border-l-4 ${level.border} border border-border ${level.cardBg} p-5`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`${level.bg} ${level.text} rounded-full px-3 py-1 text-xs font-bold`}
                  >
                    {level.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    e.g. {level.example}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground mb-2">
                  {level.description}
                </p>
                <div className="flex items-start gap-1.5 rounded-lg bg-white/60 dark:bg-black/20 p-2.5">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground">{level.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Step-by-Step Guide ───────────────────────────────────────────── */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-foreground mb-5">
            Step-by-Step Guide
          </h2>
          <div className="space-y-4">
            {HOW_TO_STEPS.map((step, i) => (
              <div key={step.name} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/10 font-heading text-sm font-bold text-purple-600 dark:text-purple-400">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-foreground mb-1">
                    {step.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Common Traps ─────────────────────────────────────────────────── */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
            Common Traps to Avoid
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            NYT editors deliberately design these pitfalls into every puzzle:
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {TRAPS.map((trap) => (
              <div
                key={trap.title}
                className="rounded-xl border border-rose-200/60 bg-rose-50/50 p-5 dark:border-rose-900/30 dark:bg-rose-950/10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <trap.icon className="h-4 w-4 text-rose-500 shrink-0" />
                  <h3 className="font-heading text-sm font-bold text-foreground">
                    {trap.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {trap.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Winning Strategies ───────────────────────────────────────────── */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
            Winning Strategies
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            Approaches that experienced Connections players use every day:
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {STRATEGIES.map((s) => (
              <div
                key={s.title}
                className="rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                    <s.icon className="h-4 w-4 text-purple-500" />
                  </div>
                  <h3 className="font-heading text-sm font-bold text-foreground">
                    {s.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Connections vs Strands ───────────────────────────────────────── */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-foreground mb-4">
            Connections vs. Strands — Side by Side
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            Both are daily NYT word puzzles, but they test completely different
            skills:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-2 pr-4 text-left font-heading text-xs uppercase tracking-wide text-muted-foreground w-32">
                    Feature
                  </th>
                  <th className="py-2 pr-4 text-left font-heading text-xs uppercase tracking-wide text-purple-600">
                    Connections
                  </th>
                  <th className="py-2 text-left font-heading text-xs uppercase tracking-wide text-blue-600">
                    Strands
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Grid Size", "4×4 (16 words)", "6×8 (48 letters)"],
                  ["Core Mechanic", "Group words by category", "Find words by connecting letters"],
                  ["Mistake Limit", "4 mistakes", "No limit (earn hints)"],
                  ["Daily Theme", "4 category themes", "1 overarching theme"],
                  ["Difficulty Signal", "Color (Yellow→Purple)", "None — all equal"],
                  ["Special Element", "Red herring words", "Spangram (spans full board)"],
                  ["Skill Focus", "Categorization & wordplay", "Spatial reasoning & vocabulary"],
                  ["Typical Time", "2–5 minutes", "5–15 minutes"],
                ].map(([feature, connections, strands], i) => (
                  <tr
                    key={feature}
                    className={`border-b border-border/40 ${i % 2 === 0 ? "" : "bg-muted/20"}`}
                  >
                    <td className="py-2.5 pr-4 font-semibold text-foreground">
                      {feature}
                    </td>
                    <td className="py-2.5 pr-4 text-muted-foreground">
                      {connections}
                    </td>
                    <td className="py-2.5 text-muted-foreground">{strands}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Many NYT puzzle fans play both games daily — they complement each
            other well. Connections sharpens categorical thinking and wordplay
            recognition; Strands trains spatial pattern recognition and
            vocabulary depth.
          </p>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────────── */}
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

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <section className="rounded-2xl bg-gradient-to-br from-purple-700 to-purple-600 p-6 sm:p-8 text-center text-white">
          <h2 className="font-heading text-2xl font-bold">
            Ready to Test Your Skills?
          </h2>
          <p className="mt-2 text-sm text-purple-100">
            Check today&apos;s Connections hints or brush up on Strands while
            you wait for tomorrow&apos;s puzzle.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/strands-hint-today"
              className="rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-purple-700 transition-all hover:bg-white/90"
            >
              Today&apos;s Strands Hints
            </Link>
            <Link
              href="/how-to-play-strands"
              className="rounded-xl border-2 border-white/30 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-white/10"
            >
              How to Play Strands
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
