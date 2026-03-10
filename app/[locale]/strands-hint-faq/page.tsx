import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { breadcrumbSchema, faqPageSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { ChevronDown, HelpCircle } from "lucide-react";
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
  const t = await getTranslations({ locale, namespace: "FAQ" });

  return constructMetadata({
    page: "FAQ",
    title: t("title"),
    description: t("description"),
    keywords: [
      "strands hint faq",
      "nyt strands questions",
      "strands puzzle help",
      "strands game faq",
      "how does strands work",
    ],
    locale: locale as Locale,
    path: `/strands-hint-faq`,
    canonicalUrl: `/strands-hint-faq`,
  });
}

const FAQ_ITEMS = [
  {
    question: "What is NYT Strands?",
    answer:
      "NYT Strands is a daily word search puzzle by The New York Times. You\u2019re given a 6\u00d78 grid of letters and a theme clue. Your goal is to find all the theme words hidden in the grid, plus a special word called the Spangram that spans the entire board.",
  },
  {
    question: "When does the new Strands puzzle come out?",
    answer:
      "A new Strands puzzle is released every day at midnight Eastern Time (ET). That\u2019s 9 PM Pacific, 5 AM GMT, and 1 PM JST. The same puzzle is available worldwide.",
  },
  {
    question: "What is a Spangram?",
    answer:
      "The Spangram is a special word in every Strands puzzle that spans the board from one side to the other (top to bottom or left to right). It describes the overall theme of the puzzle and highlights in yellow/gold when found.",
  },
  {
    question: "How do hints work in Strands?",
    answer:
      "You earn a hint for every 3 non-theme words you find on the board. When you use a hint, it reveals the starting letters of a theme word, helping you locate it on the grid. There\u2019s no penalty for finding non-theme words.",
  },
  {
    question: "How does StrandsHint work?",
    answer:
      "We provide progressive hints for each day\u2019s puzzle. You can reveal hints one at a time \u2014 from vague thematic clues to specific word reveals \u2014 so you can get just the right amount of help without fully spoiling the puzzle.",
  },
  {
    question: "Is StrandsHint affiliated with The New York Times?",
    answer:
      "No, StrandsHint is an independent fan site. We are not affiliated with, endorsed by, or connected to The New York Times in any way. NYT Strands is a trademark of The New York Times Company.",
  },
  {
    question: "Can I play past Strands puzzles?",
    answer:
      "The official NYT site only offers the current day\u2019s puzzle. However, our archive contains hints and answers for every past puzzle, so you can review or study older puzzles.",
  },
  {
    question: "What\u2019s the best strategy for solving Strands?",
    answer:
      "Start by reading the theme clue carefully. Try to find the Spangram first, as it reveals the overall theme. Then look for theme words that match. If you\u2019re stuck, find any valid non-theme words to earn hints.",
  },
  {
    question: "How do words connect on the grid?",
    answer:
      "Words in Strands can go in any direction \u2014 horizontally, vertically, diagonally, and even change direction mid-word. Letters must be adjacent (including diagonals) but each letter can only be used once per word.",
  },
  {
    question: "How are the hints generated?",
    answer:
      "Our hints are generated based on the puzzle data. We provide progressive levels of hints: thematic clues, word length information, starting letter hints, and full answer reveals. This lets you choose how much help you want.",
  },
];

export default async function FAQPage({ params }: { params: Params }) {
  await params;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "FAQ", url: `${BASE_URL}/strands-hint-faq` },
        ])}
      />
      <JsonLd
        data={faqPageSchema(
          FAQ_ITEMS.map((item) => ({
            question: item.question,
            answer: item.answer,
          }))
        )}
      />

      {/* Header */}
      <header className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-white to-primary/5 p-6 sm:p-8 dark:border-primary/40 dark:from-zinc-900 dark:via-zinc-900 dark:to-primary/10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">
              FAQ
            </span>
          </div>
          <h1 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-2 text-muted-foreground">
            Everything you need to know about NYT Strands and
            StrandsHint.
          </p>
        </div>
      </header>

      {/* FAQ Items */}
      <div className="mt-8 space-y-3">
        {FAQ_ITEMS.map((item, index) => (
          <details
            key={index}
            className="group rounded-xl border border-primary/20 bg-card transition-colors open:bg-primary/5 dark:border-primary/40 dark:open:bg-primary/10"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-foreground transition-colors hover:text-primary dark:hover:text-primary [&::-webkit-details-marker]:hidden">
              <h2 className="text-[0.95rem] leading-snug">{item.question}</h2>
              <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-5 pb-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </p>
            </div>
          </details>
        ))}
      </div>

      {/* Cross-links to other games */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link
          href="/connections-hint-today"
          className="rounded-xl border border-purple-200 bg-purple-50 p-4 text-center hover:border-purple-400 hover:bg-purple-100 transition-colors"
        >
          <p className="text-sm font-bold text-purple-800">NYT Connections</p>
          <p className="text-xs text-purple-600 mt-1">Today&apos;s hints →</p>
        </Link>
        <Link
          href="/wordle-hint-today"
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center hover:border-emerald-400 hover:bg-emerald-100 transition-colors"
        >
          <p className="text-sm font-bold text-emerald-800">NYT Wordle</p>
          <p className="text-xs text-emerald-600 mt-1">Today&apos;s hints →</p>
        </Link>
        <Link
          href="/word-finder"
          className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-center hover:border-indigo-400 hover:bg-indigo-100 transition-colors"
        >
          <p className="text-sm font-bold text-indigo-800">Word Finder Tool</p>
          <p className="text-xs text-indigo-600 mt-1">Find words free →</p>
        </Link>
      </div>

      {/* CTA */}
      <div className="mt-6 rounded-2xl bg-gradient-to-br from-primary to-primary/90 p-6 text-center text-primary-foreground">
        <h2 className="font-heading text-xl font-bold">
          Still have questions?
        </h2>
        <p className="mt-1 text-sm opacity-90">
          Check out our detailed guide or jump straight to today&apos;s puzzle.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link
            href="/how-to-play-strands"
            className="rounded-xl bg-white px-5 py-2 text-sm font-bold text-primary transition-all hover:bg-white/90"
          >
            How to Play
          </Link>
          <Link
            href="/strands-hint-today"
            className="rounded-xl border-2 border-white/30 px-5 py-2 text-sm font-bold text-white transition-all hover:bg-white/10"
          >
            Today&apos;s Hints
          </Link>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
