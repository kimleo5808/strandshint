import WordleSolverTool from "@/components/tools/WordleSolverTool";
import { WORD_LISTS } from "@/data/wordle-words";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { breadcrumbSchema, faqPageSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { Brain, Cpu, Lightbulb, Target, Zap } from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

// Compute top starting words by letter frequency score at build time
function buildLetterFreq(words: string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const word of words) {
    const seen = new Set<string>();
    for (const ch of word) {
      if (!seen.has(ch)) {
        counts[ch] = (counts[ch] ?? 0) + 1;
        seen.add(ch);
      }
    }
  }
  return counts;
}

function scoreWord(word: string, freq: Record<string, number>): number {
  const seen = new Set<string>();
  let score = 0;
  for (const ch of word) {
    if (!seen.has(ch)) {
      score += freq[ch] ?? 0;
      seen.add(ch);
    }
  }
  return score;
}

const FIVE_LETTER_WORDS = WORD_LISTS[5] ?? [];
const LETTER_FREQ = buildLetterFreq(FIVE_LETTER_WORDS);

const TOP_STARTING_WORDS = FIVE_LETTER_WORDS
  .filter((w) => new Set(w).size === 5) // unique letters only for best openers
  .map((w) => ({ word: w, score: scoreWord(w, LETTER_FREQ) }))
  .sort((a, b) => b.score - a.score)
  .slice(0, 20);

const LETTER_FREQ_TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  .split("")
  .map((l) => ({ letter: l, count: LETTER_FREQ[l] ?? 0 }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 15);

const COMMON_PATTERNS = [
  { pattern: "_ _ _ GHT", examples: "LIGHT, NIGHT, FIGHT, SIGHT, RIGHT", count: "12+" },
  { pattern: "_ _ _ NG", examples: "BRING, STING, FLING, CLING", count: "15+" },
  { pattern: "_ _ _ NK", examples: "DRINK, THINK, BLANK, FRANK", count: "10+" },
  { pattern: "SH _ _ _", examples: "SHARE, SHARP, SHIFT, SHINE", count: "20+" },
  { pattern: "_ _ _ LL", examples: "SMALL, SPELL, SKILL, STILL", count: "12+" },
  { pattern: "_ _ _ NT", examples: "FRONT, PLANT, POINT, GRANT", count: "18+" },
];

const FAQ_ITEMS = [
  {
    question: "How does the Wordle Solver work?",
    answer:
      "Enter each guess you've made in the Wordle row inputs, then click each letter tile to set its color — gray (not in word), yellow (in word, wrong position), or green (correct position). Click 'Get Suggestions' to see which words from our 5-letter dictionary still match all your clues, ranked by how useful they are as next guesses.",
  },
  {
    question: "Is it cheating to use a Wordle Solver?",
    answer:
      "That's a personal choice. Most players use solvers to learn strategy, recover from stuck positions, or verify their reasoning. If you use it to find the answer directly, you're cheating yourself out of the puzzle's satisfaction — but there's no score or competition affected. Many use the solver after finishing to see the optimal path they could have taken.",
  },
  {
    question: "How are suggestions ranked?",
    answer:
      "Suggestions are scored by letter frequency — words using the most commonly occurring letters in the 5-letter word list score higher. These words are statistically more likely to hit yellow or green tiles in your next guess, giving you the most information to narrow down the answer.",
  },
  {
    question: "What is the best first word for Wordle?",
    answer:
      "Our analysis of the Wordle word list shows CRANE, SLATE, RAISE, and STARE as top openers — they cover the highest-frequency letters (E, A, R, S, T) with no repeated letters. The tool's Top 20 Starting Words table above shows the full ranked list.",
  },
  {
    question: "Why doesn't the solver show more words?",
    answer:
      "The solver shows up to 30 top suggestions. If fewer words appear, it means your clues have narrowed the possibilities to a small set — which is actually great! Any of those remaining words could be the answer. If zero words appear, double-check that your colors are set correctly; conflicting clues can filter out all possibilities.",
  },
  {
    question: "Can I use this for other Wordle variants?",
    answer:
      "This solver is tuned for standard 5-letter Wordle with our word list. For 4-11 letter word game variants, check out our Word Finder which lets you apply similar constraints to any word length. For NYT Strands, our Strands Hints page provides direct puzzle assistance.",
  },
];

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "WordleSolver" });
  return constructMetadata({
    page: "WordleSolver",
    title: t("title"),
    description: t("description"),
    keywords: [
      "wordle solver", "wordle helper", "wordle cheat", "wordle answer finder",
      "best wordle starting word", "wordle strategy", "wordle letter frequency",
      "wordle next guess", "wordle word finder",
    ],
    locale: locale as Locale,
    path: "/wordle-solver",
    canonicalUrl: "/wordle-solver",
  });
}

export default async function WordleSolverPage({ params }: { params: Params }) {
  await params;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: BASE_URL },
        { name: "Wordle Solver", url: `${BASE_URL}/wordle-solver` },
      ])} />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      {/* Header */}
      <header className="relative overflow-hidden rounded-2xl border border-emerald-200/50 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 p-6 sm:p-8 dark:border-emerald-900/40 dark:from-emerald-950/30 dark:via-zinc-900 dark:to-emerald-950/10 mb-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Word Tool</span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Wordle Solver
          </h1>
          <p className="mt-2 text-muted-foreground">
            Enter your guesses and set their colors to get ranked suggestions for
            your next move. Beat Wordle every day with data-driven strategy.
          </p>
        </div>
      </header>

      {/* Tool */}
      <WordleSolverTool />

      <div className="mt-10 space-y-8">

        {/* How It Works */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
            How the Wordle Solver Works
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            Three steps from stuck to solved:
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Target,
                step: "1",
                title: "Enter Your Guesses",
                body: "Type each word you've already guessed into the row inputs. Each row represents one guess you've made in the official Wordle game.",
              },
              {
                icon: Zap,
                step: "2",
                title: "Set Letter Colors",
                body: "Click each letter tile to cycle through: none → gray (absent) → yellow (wrong position) → green (correct position). Match exactly what Wordle showed you.",
              },
              {
                icon: Brain,
                step: "3",
                title: "Get Suggestions",
                body: "Click 'Get Suggestions' to see words that match all your clues, ranked by letter frequency score — the highest-scoring word covers the most likely letters.",
              },
            ].map(({ icon: Icon, step, title, body }) => (
              <div key={title} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 font-heading text-sm font-bold text-emerald-600 dark:text-emerald-400">{step}</div>
                  <Icon className="h-4 w-4 text-emerald-500" />
                  <h3 className="font-heading text-sm font-bold text-foreground">{title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Strategy */}
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-foreground mb-4">
            Optimal Wordle Strategy
          </h2>
          <div className="space-y-4">
            {[
              {
                phase: "Opening (Guess 1-2)",
                color: "border-l-emerald-500",
                icon: "🟢",
                content: "Use a high-frequency opener (CRANE, SLATE, RAISE) to hit as many common letters as possible. Your goal is information — not to guess the answer yet. A second guess with different letters (DOUBT, CLIMB) covers more of the alphabet.",
              },
              {
                phase: "Middle Game (Guess 3-4)",
                color: "border-l-yellow-500",
                icon: "🟡",
                content: "By guess 3, you should have identified most of the answer's letters. Use the solver to see what's still possible. Prioritize words that distinguish between remaining candidates — even if they're not the answer, they'll eliminate the most options.",
              },
              {
                phase: "Endgame (Guess 5-6)",
                color: "border-l-rose-500",
                icon: "🔴",
                content: "With only 1-2 guesses left, play it safe. Don't guess a word you're uncertain about if another guess would confirm your uncertainty. If 3+ words remain, use guess 5 to distinguish between them, saving guess 6 for the confirmed answer.",
              },
            ].map(({ phase, color, icon, content }) => (
              <div key={phase} className={`rounded-xl border-l-4 ${color} border border-border bg-card p-5`}>
                <h3 className="font-heading text-sm font-bold text-foreground mb-2">
                  {icon} {phase}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{content}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Top 20 Starting Words */}
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-foreground mb-1">
            Top 20 Starting Words
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Ranked by letter frequency score across our 5-letter word list. All have 5 unique letters for maximum information per guess.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Rank", "Word", "Score", "Unique Letters"].map((h) => (
                    <th key={h} className="py-2 pr-4 text-left font-heading text-xs uppercase tracking-wide text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TOP_STARTING_WORDS.map(({ word, score }, i) => (
                  <tr key={word} className={`border-b border-border/40 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                    <td className="py-2.5 pr-4 font-semibold text-muted-foreground">#{i + 1}</td>
                    <td className="py-2.5 pr-4 font-mono font-bold text-emerald-700 dark:text-emerald-400 tracking-widest">{word}</td>
                    <td className="py-2.5 pr-4 text-foreground">{score}</td>
                    <td className="py-2.5 text-muted-foreground">
                      <div className="flex gap-1">
                        {word.split("").map((ch) => (
                          <span key={ch} className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono font-bold">{ch}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Score = sum of each unique letter&apos;s frequency in the word list. Higher score = more common letters covered.
          </p>
        </section>

        {/* Letter Frequency */}
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-foreground mb-1">
            Letter Frequency in Wordle Words
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            How often each letter appears across all 5-letter words in our list — based on your word database:
          </p>
          <div className="space-y-1.5">
            {LETTER_FREQ_TABLE.map((l) => (
              <div key={l.letter} className="flex items-center gap-3">
                <span className="w-6 font-mono text-sm font-bold text-foreground">{l.letter}</span>
                <div className="flex-1 h-4 rounded-full bg-muted/40 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${(l.count / (LETTER_FREQ_TABLE[0]?.count ?? 1)) * 100}%` }}
                  />
                </div>
                <span className="w-12 text-right text-xs text-muted-foreground">{l.count} words</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">E, A, R, O, I</strong> are the five most common letters — any opening guess that covers 3+ of these gives you maximum information. Rare letters like <strong className="text-foreground">Q, X, Z, J</strong> almost never appear in starting word recommendations because they waste a guess slot.
          </p>
        </section>

        {/* Common Patterns */}
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-foreground mb-1">
            Common 5-Letter Word Patterns
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Recognizing these patterns narrows your search when you have partial information:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Pattern", "Example Words", "Approx. Count"].map((h) => (
                    <th key={h} className="py-2 pr-4 text-left font-heading text-xs uppercase tracking-wide text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMMON_PATTERNS.map((p, i) => (
                  <tr key={p.pattern} className={`border-b border-border/40 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                    <td className="py-2.5 pr-4 font-mono text-sm font-semibold text-emerald-700 dark:text-emerald-400">{p.pattern}</td>
                    <td className="py-2.5 pr-4 text-muted-foreground">{p.examples}</td>
                    <td className="py-2.5 text-muted-foreground">{p.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            When you have 2-3 green letters, try to recall which common patterns could form. A yellow G, H, or T often points toward -GHT endings. Yellow N or G at the end frequently means -ING. These pattern shortcuts can beat the solver on speed.
          </p>
        </section>

        {/* Wordle tips */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-foreground mb-5">
            Advanced Wordle Tips
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: Lightbulb,
                color: "text-amber-500",
                bg: "bg-amber-500/10",
                title: "Never Repeat a Gray Letter",
                body: "Gray means that letter is not in the word (in that count). Using it again wastes a guess. The solver handles this automatically, but manual players often forget on guess 3.",
              },
              {
                icon: Brain,
                color: "text-purple-500",
                bg: "bg-purple-500/10",
                title: "Yellow Letters Need Repositioning",
                body: "A yellow letter IS in the word, just not in that position. In your next guess, that letter must appear somewhere else — never in the same spot.",
              },
              {
                icon: Target,
                color: "text-blue-500",
                bg: "bg-blue-500/10",
                title: "Consider Double Letters",
                body: "About 15% of Wordle answers contain a doubled letter (SPEED, FLUFF, ABBEY). If you're stuck with 3 greens and can't find the last letter, try doubling one of the letters you've confirmed.",
              },
              {
                icon: Zap,
                color: "text-emerald-500",
                bg: "bg-emerald-500/10",
                title: "Use Hard Mode Mindfully",
                body: "Hard Mode forces you to use all revealed hints in every guess. While this feels more challenging, it can actually trap you — sometimes a 'wasted' guess that breaks the constraint eliminates more possibilities.",
              },
            ].map(({ icon: Icon, color, bg, title, body }) => (
              <div key={title} className="rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}>
                    <Icon className={`h-4 w-4 ${color}`} />
                  </div>
                  <h3 className="font-heading text-sm font-bold text-foreground">{title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
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
              <details key={item.question} className="group rounded-xl border border-border bg-card p-5 shadow-sm">
                <summary className="flex cursor-pointer items-center justify-between font-heading text-sm font-bold text-foreground list-none">
                  {item.question}
                  <span className="ml-2 shrink-0 text-muted-foreground transition-transform group-open:rotate-180">▾</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-600 p-6 sm:p-8 text-center text-white">
          <h2 className="font-heading text-2xl font-bold">Play Word Games</h2>
          <p className="mt-2 text-sm text-emerald-100">
            Now that you have the strategy — put it into practice.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link href="/5-letters" className="rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-emerald-700 transition-all hover:bg-white/90">
              Play 5-Letter Wordle
            </Link>
            <Link href="/word-finder" className="rounded-xl border-2 border-white/30 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-white/10">
              Word Finder
            </Link>
            <Link href="/strands-hint-today" className="rounded-xl border-2 border-white/30 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-white/10">
              Strands Hints
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
