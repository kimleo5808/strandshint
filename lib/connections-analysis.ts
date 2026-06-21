/**
 * Per-puzzle analysis helpers for NYT Connections.
 *
 * Derived entirely from the puzzle data we already store (category titles,
 * the 16 cards, difficulty levels). The aim is content that genuinely changes
 * from one puzzle to the next — concrete facts about *this* board — rather
 * than a fixed strategy list with two titles interpolated in.
 */

import type { ConnectionsPuzzle } from "@/types/connections";

const DIFF_LABELS = ["Yellow", "Green", "Blue", "Purple"] as const;

export interface ConnectionsFacts {
  /** Categories sorted easiest → hardest. */
  sorted: ConnectionsPuzzle["categories"];
  /** All 16 card words. */
  allWords: string[];
  longestWord: string;
  shortestWord: string;
  minLen: number;
  maxLen: number;
  avgLen: number;
  /** Cards that are multi-word phrases (contain a space). */
  multiWordCards: string[];
  /** Single letters / very short (≤3) cards — easy to overlook. */
  shortCards: string[];
}

export function getConnectionsFacts(puzzle: ConnectionsPuzzle): ConnectionsFacts {
  const sorted = [...puzzle.categories].sort(
    (a, b) => a.difficulty - b.difficulty
  );
  const allWords = sorted.flatMap((c) => c.cards.map((card) => card.content));
  const lengths = allWords.map((w) => w.replace(/\s/g, "").length);

  let longestWord = allWords[0] || "";
  let shortestWord = allWords[0] || "";
  for (const w of allWords) {
    const len = w.replace(/\s/g, "").length;
    if (len > longestWord.replace(/\s/g, "").length) longestWord = w;
    if (len < shortestWord.replace(/\s/g, "").length) shortestWord = w;
  }

  return {
    sorted,
    allWords,
    longestWord,
    shortestWord,
    minLen: lengths.length ? Math.min(...lengths) : 0,
    maxLen: lengths.length ? Math.max(...lengths) : 0,
    avgLen: lengths.length
      ? Math.round((lengths.reduce((s, n) => s + n, 0) / lengths.length) * 10) /
        10
      : 0,
    multiWordCards: allWords.filter((w) => w.trim().includes(" ")),
    shortCards: allWords.filter((w) => w.replace(/\s/g, "").length <= 3),
  };
}

/* ------------------------------------------------------------------ */
/*  Strategies tailored to this board                                  */
/* ------------------------------------------------------------------ */

export function generateStrategies(puzzle: ConnectionsPuzzle): string[] {
  const f = getConnectionsFacts(puzzle);
  const yellow = f.sorted[0];
  const purple = f.sorted[3];
  const tips: string[] = [];

  tips.push(
    `Open with the Yellow group, "${yellow.title}" — it's the most literal connection in puzzle #${puzzle.id}, so confirming it first clears four cards and steadies the board.`
  );

  tips.push(
    `Save the Purple group, "${purple.title}", for last. Purple usually hides wordplay or a category-within-a-category, so don't commit to it until the other twelve cards are spoken for.`
  );

  if (f.multiWordCards.length) {
    tips.push(
      `Watch the multi-word answers (${f.multiWordCards.join(", ")}). Phrases often anchor the trickier groups, so use them as fixed points while you sort the rest.`
    );
  }

  if (f.shortCards.length) {
    tips.push(
      `Short cards are easy to misread — keep an eye on ${f.shortCards.join(", ")}, which can belong somewhere less obvious than their length suggests.`
    );
  }

  tips.push(
    "Each word belongs to exactly one group. If a card seems to fit two themes, treat it as a red herring planted for the easier group and slot it into the harder one."
  );

  tips.push(
    "Once you've locked two groups, the remaining eight cards split cleanly into the last two — guess the group you're surest of to protect your mistake count."
  );

  return tips;
}

/* ------------------------------------------------------------------ */
/*  FAQ with puzzle-specific answers                                   */
/* ------------------------------------------------------------------ */

export interface FaqItem {
  question: string;
  answer: string;
}

export function generateFAQ(puzzle: ConnectionsPuzzle): FaqItem[] {
  const f = getConnectionsFacts(puzzle);
  const yellow = f.sorted[0];
  const purple = f.sorted[3];

  const items: FaqItem[] = [
    {
      question: `What is the Yellow category in Connections #${puzzle.id}?`,
      answer: `The Yellow (easiest) category is "${yellow.title}". Its four words are: ${yellow.cards.map((c) => c.content).join(", ")}.`,
    },
    {
      question: `Which category is trickiest in Connections #${puzzle.id}?`,
      answer: `The Purple group, "${purple.title}", is the hardest. Its words — ${purple.cards.map((c) => c.content).join(", ")} — rely on the most lateral connection, which is why so many solvers leave it for last.`,
    },
    {
      question: `Are there any multi-word answers in Connections #${puzzle.id}?`,
      answer: f.multiWordCards.length
        ? `Yes — ${f.multiWordCards.join(", ")} ${f.multiWordCards.length === 1 ? "is a multi-word card" : "are multi-word cards"}, which can make them easier to anchor to the right group.`
        : `No — every card in puzzle #${puzzle.id} is a single word, so length and spelling are your only surface clues.`,
    },
  ];

  if (puzzle.editor) {
    items.push({
      question: `Who edited Connections #${puzzle.id}?`,
      answer: `Connections #${puzzle.id} was edited by ${puzzle.editor} for The New York Times.`,
    });
  }

  items.push({
    question: "How do I use these hints without spoiling the answer?",
    answer:
      "Work top-down through the Progressive Hints section: it starts with the category themes only, then a single word per group, and finally the full answers. Reveal one level at a time and stop as soon as you're unstuck.",
  });

  return items;
}

export { DIFF_LABELS };
