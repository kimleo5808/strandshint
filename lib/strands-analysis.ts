/**
 * Per-puzzle analysis helpers for Strands.
 *
 * Everything here is derived from the data we already store for each puzzle
 * (spangramCoords, themeCoords, themeWords, spangram, startingBoard,
 * constructors, editor). The goal is content that genuinely differs from one
 * puzzle to the next — concrete geometric and word-construction facts about
 * *this* board — instead of a fixed template with a few variables swapped in.
 */

import type { StrandsPuzzle } from "@/types/strands";
import { getSpangramDirection, getDifficulty } from "@/lib/strands-hints";
import dayjs from "dayjs";

/* ------------------------------------------------------------------ */
/*  Word geometry                                                      */
/* ------------------------------------------------------------------ */

/** 1-based "row R, column C" label for a [row, col] grid coordinate. */
export function coordLabel(coord: [number, number] | undefined): string {
  if (!coord) return "—";
  const [row, col] = coord;
  return `row ${row + 1}, column ${col + 1}`;
}

/** Where each word's first letter sits on the board. */
export function getWordStart(
  puzzle: StrandsPuzzle,
  word: string
): [number, number] | undefined {
  const coords = puzzle.themeCoords?.[word];
  return coords && coords.length > 0 ? coords[0] : undefined;
}

export interface WordStat {
  word: string;
  length: number;
  start: [number, number] | undefined;
  startLabel: string;
}

/** Theme words with their length + starting cell, longest first. */
export function getWordStats(puzzle: StrandsPuzzle): WordStat[] {
  return puzzle.themeWords
    .map((word) => {
      const start = getWordStart(puzzle, word);
      return {
        word,
        length: word.length,
        start,
        startLabel: coordLabel(start),
      };
    })
    .sort((a, b) => b.length - a.length);
}

/* ------------------------------------------------------------------ */
/*  Word-set construction facts                                        */
/* ------------------------------------------------------------------ */

export interface WordSetFacts {
  count: number;
  shortest: number;
  longest: number;
  avgLength: number;
  totalLetters: number;
  /** Distinct first letters across all theme words, e.g. "B, C, M, S". */
  firstLetters: string[];
  /** First letters that more than one theme word shares. */
  sharedFirstLetters: string[];
}

export function getWordSetFacts(puzzle: StrandsPuzzle): WordSetFacts {
  const words = puzzle.themeWords;
  const lengths = words.map((w) => w.length);
  const totalLetters =
    lengths.reduce((sum, n) => sum + n, 0) + puzzle.spangram.length;

  const firstLetterCounts = new Map<string, number>();
  for (const w of words) {
    const f = (w[0] || "").toUpperCase();
    firstLetterCounts.set(f, (firstLetterCounts.get(f) || 0) + 1);
  }

  return {
    count: words.length,
    shortest: lengths.length ? Math.min(...lengths) : 0,
    longest: lengths.length ? Math.max(...lengths) : 0,
    avgLength: lengths.length
      ? Math.round((lengths.reduce((s, n) => s + n, 0) / lengths.length) * 10) /
        10
      : 0,
    totalLetters,
    firstLetters: Array.from(firstLetterCounts.keys()).sort(),
    sharedFirstLetters: Array.from(firstLetterCounts.entries())
      .filter(([, n]) => n > 1)
      .map(([l]) => l)
      .sort(),
  };
}

/* ------------------------------------------------------------------ */
/*  Clue reading style (derived from the clue text itself)             */
/* ------------------------------------------------------------------ */

/** A short, clue-specific note on how to read today's theme clue. */
export function getClueNote(clue: string): string {
  const trimmed = clue.trim();
  const hasQuestion = trimmed.includes("?");
  const hasQuotes = /["“”']/.test(trimmed);
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;

  if (hasQuestion) {
    return `The clue "${trimmed}" is phrased as a question, which on Strands almost always signals wordplay — read it for a pun or double meaning rather than taking it literally.`;
  }
  if (hasQuotes) {
    return `The clue "${trimmed}" puts part of itself in quotation marks, a hint that the quoted phrase is doing double duty — treat it as a play on words.`;
  }
  if (wordCount <= 2) {
    return `The clue "${trimmed}" is short and broad, so expect the theme to be a wide category — keep your associations loose while you scan the grid.`;
  }
  return `The clue "${trimmed}" reads fairly directly, so look for words that fit its plain meaning before reaching for a more lateral interpretation.`;
}

/* ------------------------------------------------------------------ */
/*  Overview paragraph (data-driven, varies per puzzle)                */
/* ------------------------------------------------------------------ */

export function generateOverview(puzzle: StrandsPuzzle): string {
  const formattedDate = dayjs(puzzle.printDate).format("MMMM D, YYYY");
  const dir = getSpangramDirection(puzzle);
  const facts = getWordSetFacts(puzzle);
  const diff = getDifficulty(puzzle);
  const byline = puzzle.constructors
    ? ` Constructed by ${puzzle.constructors}${puzzle.editor ? `, edited by ${puzzle.editor}` : ""},`
    : "";

  const lengthNote =
    facts.shortest === facts.longest
      ? `all ${facts.count} theme words are ${facts.longest} letters long`
      : `the theme words range from ${facts.shortest} to ${facts.longest} letters (averaging ${facts.avgLength})`;

  const sharedNote = facts.sharedFirstLetters.length
    ? ` Several theme words share a starting letter (${facts.sharedFirstLetters.join(", ")}), so first-letter spotting alone won't separate them — you'll need to follow the paths.`
    : ` Each theme word starts with a different letter, which makes first-letter scanning a reliable way to tell them apart.`;

  return `NYT Strands #${puzzle.id} (${formattedDate}) carries the theme "${puzzle.clue}".${byline} its Spangram is "${puzzle.spangram}" (${puzzle.spangram.length} letters), which ${dir.description}. There are ${facts.count} theme words to find on the 6×8 board, filling all ${facts.totalLetters} letters between them; ${lengthNote}. By our heuristic this plays as a ${diff.label.toLowerCase()} puzzle.${sharedNote}`;
}

/* ------------------------------------------------------------------ */
/*  Strategy tips, tailored to this board                              */
/* ------------------------------------------------------------------ */

export function generateStrategyTips(puzzle: StrandsPuzzle): string[] {
  const dir = getSpangramDirection(puzzle);
  const facts = getWordSetFacts(puzzle);
  const stats = getWordStats(puzzle);
  const tips: string[] = [];

  tips.push(getClueNote(puzzle.clue));

  tips.push(
    `The Spangram "${puzzle.spangram}" ${dir.description}, so start tracing from the ${dir.startEdge} — locking it in early splits the board and reveals the theme.`
  );

  const longest = stats[0];
  if (longest) {
    tips.push(
      `The longest theme word is ${longest.length} letters and begins at ${longest.startLabel}. Long words have fewer possible paths, so they're often easier to confirm once you spot the opening letters.`
    );
  }

  const shortest = stats[stats.length - 1];
  if (shortest && shortest !== longest) {
    tips.push(
      `The shortest theme word is just ${shortest.length} letters (starting near ${shortest.startLabel}); short words hide in plain sight, so sweep those corners deliberately.`
    );
  }

  if (facts.sharedFirstLetters.length) {
    tips.push(
      `Watch the repeated starting letters (${facts.sharedFirstLetters.join(", ")}) — more than one theme word begins the same way, so don't assume the first match you find is the only one.`
    );
  } else {
    tips.push(
      `Every theme word here starts with a different letter (${facts.firstLetters.join(", ")}). Use that: if you've placed a word starting with one of them, you can rule that letter out elsewhere.`
    );
  }

  tips.push(
    "Every letter on the board belongs to exactly one word, so once a region is solved the leftover letters tightly constrain what can still fit."
  );

  return tips;
}

/* ------------------------------------------------------------------ */
/*  FAQ, with puzzle-specific answers                                  */
/* ------------------------------------------------------------------ */

export interface FaqItem {
  q: string;
  a: string;
}

export function generateFAQ(puzzle: StrandsPuzzle): FaqItem[] {
  const formattedDate = dayjs(puzzle.printDate).format("MMMM D, YYYY");
  const dir = getSpangramDirection(puzzle);
  const diff = getDifficulty(puzzle);
  const facts = getWordSetFacts(puzzle);

  const items: FaqItem[] = [
    {
      q: `What is the Spangram for Strands #${puzzle.id}?`,
      a: `The Spangram for Strands #${puzzle.id} (${formattedDate}) is "${puzzle.spangram}", ${puzzle.spangram.length} letters long. It ${dir.description} and ties together the theme "${puzzle.clue}".`,
    },
    {
      q: `What are the theme words in Strands #${puzzle.id}?`,
      a: `Strands #${puzzle.id} has ${facts.count} theme words: ${puzzle.themeWords.join(", ")}. They run from ${facts.shortest} to ${facts.longest} letters and all connect to the clue "${puzzle.clue}".`,
    },
    {
      q: `How hard is Strands #${puzzle.id}?`,
      a: `On our heuristic (word count, average length, and Spangram length) #${puzzle.id} rates as ${diff.label.toLowerCase()}. ${
        facts.sharedFirstLetters.length
          ? `One thing that adds friction: some theme words share a first letter (${facts.sharedFirstLetters.join(", ")}).`
          : `It helps that every theme word starts with a distinct letter.`
      } This is an unofficial estimate, not an NYT rating.`,
    },
  ];

  if (puzzle.constructors) {
    items.push({
      q: `Who made Strands #${puzzle.id}?`,
      a: `Strands #${puzzle.id} was constructed by ${puzzle.constructors}${puzzle.editor ? ` and edited by ${puzzle.editor}` : ""} for The New York Times, published ${formattedDate}.`,
    });
  }

  items.push({
    q: "How do I play NYT Strands?",
    a: "Strands gives you a 6×8 grid of letters. Find the theme words by connecting adjacent letters (horizontally, vertically, or diagonally); each puzzle has one Spangram that spans the whole board and touches two opposite sides. Every letter belongs to exactly one word, and non-theme words you find earn hints.",
  });

  return items;
}
