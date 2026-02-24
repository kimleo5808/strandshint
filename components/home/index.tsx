import { StrandsClickToReveal } from "@/components/strands/StrandsClickToReveal";
import { CountdownTimer } from "@/components/strands/CountdownTimer";
import { GUIDES } from "@/data/guides";
import { LETTER_GAMES } from "@/data/letter-games";
import { Locale } from "@/i18n/routing";
import { getLatestPuzzle, getRecentPuzzles } from "@/lib/strands-data";
import dayjs from "dayjs";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Clock,
  Gamepad2,
  Grid3X3,
  Lightbulb,
  Map,
  Puzzle,
  Search,
  Shield,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

const FEATURE_ICONS = [Lightbulb, Grid3X3, Clock, Puzzle, Shield, Sparkles];
type HomeComponentProps = { locale: Locale };

function FaqAccordionItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-xl border border-border bg-card transition-colors open:bg-primary/5">
      <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-foreground transition-colors hover:text-primary [&::-webkit-details-marker]:hidden">
        <h3 className="text-[0.95rem] leading-snug">{question}</h3>
        <ChevronDown className="h-4 w-4 shrink-0 text-primary/60 transition-transform group-open:rotate-180" />
      </summary>
      <div className="px-5 pb-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {answer}
        </p>
      </div>
    </details>
  );
}

export default async function HomeComponent({ locale }: HomeComponentProps) {
  const t = await getTranslations({ locale, namespace: "HomePage" });
  const latestPuzzle = await getLatestPuzzle();
  const recentPuzzles = await getRecentPuzzles(9);

  const todayDate = latestPuzzle
    ? dayjs(latestPuzzle.printDate).format("MMMM D, YYYY")
    : "";

  return (
    <div className="w-full grid-bg">
      {/* Hero Section - Dark blue */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="mt-4 text-lg text-slate-300 sm:text-xl">
            {t("hero.subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/strands-hint-today"
              className="group inline-flex items-center gap-2 rounded-xl bg-cta px-7 py-3.5 text-sm font-bold text-cta-foreground shadow-lg shadow-cta/25 transition-all hover:bg-cta/90 hover:shadow-cta/30"
            >
              {t("hero.ctaHints")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/strands-hint"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-600 px-6 py-3.5 text-sm font-semibold text-slate-200 transition-all hover:border-slate-500 hover:bg-slate-800"
            >
              {t("hero.ctaArchive")}
              <Search className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Today's Puzzle Preview */}
      {latestPuzzle && (
        <section className="bg-slate-800 py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="text-center">
              <h2 className="font-heading text-2xl font-bold text-white">
                Today&apos;s Strands Puzzle
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Puzzle #{latestPuzzle.id} — {todayDate}
              </p>
            </div>

            {/* Theme clue */}
            <div className="mt-6 text-center">
              <p className="text-lg font-bold text-primary">
                &ldquo;{latestPuzzle.clue}&rdquo;
              </p>
              <p className="mt-2 text-sm text-slate-400">
                {latestPuzzle.themeWords.length} theme words + 1 Spangram
              </p>
            </div>

            {/* Click to reveal */}
            <div className="mt-8 flex justify-center">
              <StrandsClickToReveal puzzle={latestPuzzle} />
            </div>

            {/* Link to full hints */}
            <div className="mt-4 text-center">
              <Link
                href="/strands-hint-today"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Need progressive hints? Click here for step-by-step clues →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Countdown Timer */}
      <section className="py-12 bg-background">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="font-heading text-lg font-bold text-foreground">
            {t("hero.countdown")}
          </h2>
          <div className="mt-5">
            <CountdownTimer />
          </div>
        </div>
      </section>

      {/* Recent Puzzles Grid */}
      <section className="py-12 bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Recent Strands Answers
            </h2>
            <Link
              href="/strands-hint"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              {t("recentPuzzles.viewAll")}
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentPuzzles.map((puzzle) => (
              <Link
                key={puzzle.printDate}
                href={`/strands-hint/${puzzle.printDate}`}
                className="group rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-block rounded-md bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                    Puzzle #{puzzle.id}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {dayjs(puzzle.printDate).format("MMM D, YYYY")}
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-bold text-foreground line-clamp-1">
                  &ldquo;{puzzle.clue}&rdquo;
                </h3>
                <div className="mt-2 space-y-1">
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-strands-spangram" />
                    <span className="truncate">Spangram: {puzzle.spangram.length} letters</span>
                  </p>
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-strands-theme" />
                    <span>{puzzle.themeWords.length} theme words</span>
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary">
                  View Hints
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* What is NYT Strands? */}
      <section className="py-12 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            What is NYT Strands?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            NYT Strands is a daily word puzzle by The New York Times where you find theme words hidden in a 6x8 letter grid. Words are formed by connecting adjacent letters (including diagonals). Each puzzle has a theme clue, several theme words, and one special Spangram that spans the entire board.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Grid3X3 className="h-7 w-7" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-foreground">6x8 Letter Grid</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Find words by connecting adjacent letters on the board.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Puzzle className="h-7 w-7" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-foreground">Theme Words</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                All words connect to a daily theme revealed by the clue.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <BookOpen className="h-7 w-7" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-foreground">Daily Puzzle</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                A new puzzle is released every day at midnight ET.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-heading text-2xl font-bold text-foreground sm:text-3xl">
            How Our NYT Strands Hints Work
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((index) => {
              const Icon = FEATURE_ICONS[index];
              return (
                <div
                  key={index}
                  className="group rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-foreground">
                    {t(`features.${index}.title`)}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {t(`features.${index}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ - 2 column */}
      <section className="py-12 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-foreground text-center">
            {t("faq.title")}
          </h2>
          <p className="mt-2 text-center text-muted-foreground">
            {t("faq.description")}
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
              <FaqAccordionItem
                key={index}
                question={t(`faqItems.${index}.question`)}
                answer={t(`faqItems.${index}.answer`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Word Games Grid */}
      <section className="py-12 bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Gamepad2 className="h-4 w-4" />
              Word Games
            </div>
            <h2 className="mt-4 font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Free Word Games — Practice Your Skills
            </h2>
            <p className="mt-2 text-muted-foreground">
              Challenge yourself with word puzzles from 4 to 11 letters
            </p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {LETTER_GAMES.map((g) => (
              <Link
                key={g.slug}
                href={`/${g.slug}`}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 text-center transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <div className="font-heading text-3xl font-bold text-primary transition-transform group-hover:scale-110">
                  {g.wordLength}
                </div>
                <h3 className="mt-1 text-sm font-bold text-foreground">
                  {g.wordLength} Letter Words
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {g.wordLength <= 5
                    ? g.wordLength === 4
                      ? "Quick and easy"
                      : "Classic Wordle"
                    : g.wordLength <= 7
                      ? "Advanced challenge"
                      : g.wordLength <= 9
                        ? "Expert level"
                        : "Ultimate difficulty"}
                </p>
                <div className="mt-2 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Play Now →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Guides Promotion */}
      <section className="py-12 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Map className="h-4 w-4" />
              Strategy Guides
            </div>
            <h2 className="mt-4 font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Master Strands with Expert Guides
            </h2>
            <p className="mt-2 text-muted-foreground">
              Take your puzzle-solving skills to the next level with our comprehensive strategy guides
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GUIDES.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="group rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-lg transition-transform group-hover:scale-110">
                    {guide.icon}
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-foreground">
                    {guide.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {guide.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                    Read Guide
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4 text-center text-sm text-muted-foreground">
            <strong className="text-foreground">Pro Tip:</strong>{" "}
            Start with the{" "}
            <Link href="/guides/beginner-guide" className="font-medium text-primary hover:text-primary/80">
              Beginner&apos;s Guide
            </Link>{" "}
            if you&apos;re new, or jump to{" "}
            <Link href="/guides/strategy-tips" className="font-medium text-primary hover:text-primary/80">
              Strategy Tips
            </Link>{" "}
            to improve your current approach!
          </div>
        </div>
      </section>

      {/* Long-form SEO Article */}
      <section className="py-12 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            NYT Strands Hints: Complete Guide &amp; Today&apos;s Answers
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Welcome to the premier destination for <strong className="text-foreground">Strands hint</strong> enthusiasts and word puzzle players! Whether you&apos;re seeking today&apos;s puzzle solutions or looking to sharpen your word-finding skills, you&apos;ve found the perfect resource.
          </p>

          <h3 className="mt-8 font-heading text-lg font-semibold text-foreground">
            What is a Strands Hint?
          </h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            A <strong className="text-foreground">Strands hint today</strong> refers to the subtle clues and strategies that help players find hidden theme words on the 6x8 letter grid. The New York Times Strands game challenges players to connect adjacent letters to form words that all relate to a daily theme, making <strong className="text-foreground">NYT Strands hints</strong> an essential tool for puzzle enthusiasts worldwide.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Our platform provides progressive hints that guide you from the theme clue to the Spangram and individual theme words. By understanding letter connections and thematic relationships, players can significantly improve their puzzle-solving abilities.
          </p>

          <h3 className="mt-8 font-heading text-lg font-semibold text-foreground">
            How to Solve NYT Strands Puzzles
          </h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Every <strong className="text-foreground">Strands hint</strong> serves a specific purpose in guiding players toward the solution. The 6x8 grid format creates a unique word search experience. Here&apos;s how to approach the puzzle:
          </p>
          <ul className="mt-3 space-y-2">
            {[
              ["Read the theme clue:", "The clue at the top reveals the common thread connecting all hidden words"],
              ["Find the Spangram first:", "The Spangram spans the entire board and is often the key to understanding the theme"],
              ["Look for shorter words:", "Start with 4-5 letter words before tackling longer ones"],
              ["Use hint letters:", "Finding non-theme words earns hint letters that highlight cells on the grid"],
            ].map(([title, desc]) => (
              <li key={title} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span><strong className="text-foreground">{title}</strong> {desc}</span>
              </li>
            ))}
          </ul>

          <h3 className="mt-8 font-heading text-lg font-semibold text-foreground">
            NYT Strands Hints: Advanced Strategies
          </h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            The <strong className="text-foreground">NYT Strands hints</strong> system relies on understanding how letters connect on the grid. Successful players develop spatial awareness that extends beyond simple word knowledge.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Key strategies for Strands include:
          </p>
          <ul className="mt-3 space-y-2">
            {[
              ["Adjacent letter scanning:", "Words form by connecting horizontally, vertically, and diagonally adjacent cells"],
              ["Theme interpretation:", "The clue often has a double meaning — think broadly about what words could fit"],
              ["Board coverage:", "Every letter on the board belongs to exactly one word — use this to eliminate possibilities"],
              ["Spangram awareness:", "The Spangram always spans from one side of the board to the other"],
            ].map(([title, desc]) => (
              <li key={title} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span><strong className="text-foreground">{title}</strong> {desc}</span>
              </li>
            ))}
          </ul>

          <h3 className="mt-8 font-heading text-lg font-semibold text-foreground">
            Daily Puzzle Strategy and Strands Hint Today
          </h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Finding the right <strong className="text-foreground">Strands hint today</strong> requires a systematic approach. Start by reading the theme clue carefully — it often contains wordplay or a double meaning that reveals the connection between all theme words.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Advanced players recommend finding the Spangram first, as it reveals the overarching theme and makes the remaining words easier to identify. The Spangram always connects two opposite edges of the board, so look for long words that traverse the grid.
          </p>

          <h3 className="mt-8 font-heading text-lg font-semibold text-foreground">
            What Is the Spangram (Spanogram) in Strands?
          </h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            The <strong className="text-foreground">Spangram</strong> (sometimes misspelled as &ldquo;spanogram&rdquo;) is the most important word in every Strands puzzle. Unlike regular theme words, the Spangram spans the entire board from one edge to the opposite edge — left to right, top to bottom, or diagonally across the grid.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            The Spangram always relates to the overarching theme and is highlighted in gold when found. Finding it early is a powerful strategy because it reveals the theme connection, making the remaining words much easier to identify. Look for long words (typically 7-10 letters) that could physically stretch across the 6-column or 8-row grid.
          </p>

          <h3 className="mt-8 font-heading text-lg font-semibold text-foreground">
            Strands Answers: How to Find Past Puzzle Solutions
          </h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Looking for <strong className="text-foreground">Strands answers</strong> from previous days? Our archive contains every past NYT Strands puzzle with complete solutions — including all theme words, the Spangram, and the theme clue. Each puzzle page shows the full 6x8 grid with highlighted word positions so you can see exactly how the answers fit together.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Reviewing past <strong className="text-foreground">Strands answers</strong> is one of the best ways to improve. You&apos;ll start noticing patterns in how themes are structured, where Spangrams typically run across the board, and which types of words the puzzle creators favor. Browse the archive by date to study past puzzles at your own pace.
          </p>

          <h3 className="mt-8 font-heading text-lg font-semibold text-foreground">
            How Many Hints Do You Get in Strands?
          </h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            In the official NYT Strands game, hints are earned — not given freely. Every time you find a valid English word on the grid that isn&apos;t a theme word, you earn progress toward a hint. After finding three non-theme words, you receive one hint that highlights a single cell on the board, showing you one letter of a theme word.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            There&apos;s no limit to how many hints you can earn in a single puzzle, but each one requires finding three more non-theme words. On StrandsHint, we take a different approach: we provide up to five progressive <strong className="text-foreground">hint levels</strong> for each puzzle, ranging from vague thematic nudges to specific letter reveals to full answers — so you control exactly how much help you get.
          </p>

          <h3 className="mt-8 font-heading text-lg font-semibold text-foreground">
            Getting Started: Your First Steps
          </h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Begin your puzzle-solving journey with today&apos;s Strands puzzle. Start by reading the theme clue, scanning the grid for obvious words, and working toward the Spangram. Remember, every expert puzzle solver started with simple <strong className="text-foreground">Strands hint</strong> strategies before developing advanced techniques.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Join our community of puzzle enthusiasts and share your progress. Whether you&apos;re seeking today&apos;s <strong className="text-foreground">Strands hint</strong> or celebrating finding the Spangram on your first try, you&apos;ll find support and encouragement here.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Ready to challenge yourself? Start with today&apos;s puzzle and discover how strategic thinking and the right hints can transform your solving experience. Welcome to the world of Strands, letter grids, and the satisfaction of puzzle mastery!
          </p>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-primary">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="font-heading text-2xl font-bold text-primary-foreground sm:text-3xl">
            Ready to Solve Today&apos;s Puzzle?
          </h2>
          <p className="mt-3 text-primary-foreground/80">
            Get progressive hints without spoiling the fun. Start with a gentle nudge and reveal more only when you need it.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/strands-hint-today"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-primary shadow-lg transition-all hover:bg-white/90"
            >
              Get Today&apos;s Hints
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/how-to-play-strands"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              How to Play
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
