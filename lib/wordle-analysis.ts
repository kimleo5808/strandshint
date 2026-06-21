/**
 * Per-puzzle analysis helpers for NYT Wordle.
 *
 * A Wordle record is just a 5-letter answer, so all derived content comes from
 * the letters themselves: vowel/consonant make-up, repeats, rare letters,
 * first/last letter, vowel positions. The point is hints and strategy that
 * actually describe *today's* word rather than a fixed list reused every day.
 */

import type { WordlePuzzle } from "@/types/wordle-hint";
import dayjs from "dayjs";

const VOWELS = "AEIOU";
// Letters that show up least often in common 5-letter words.
const RARE_LETTERS = "JQXZ";
const UNCOMMON_LETTERS = "VWKFY";

export interface WordAnalysis {
  word: string;
  letters: string[];
  vowels: number;
  consonants: number;
  unique: number;
  hasDouble: boolean;
  repeatedLetters: string[];
  firstLetter: string;
  lastLetter: string;
  startsWithVowel: boolean;
  /** 1-based positions of the vowels. */
  vowelPositions: number[];
  /** Rarer letters present in the word (J, Q, X, Z, plus V/W/K/F/Y). */
  notableLetters: string[];
}

export function analyzeWord(raw: string): WordAnalysis {
  const word = raw.toUpperCase();
  const letters = word.split("");
  const vowelLetters = letters.filter((l) => VOWELS.includes(l));
  const unique = new Set(letters).size;
  const repeated = [
    ...new Set(letters.filter((l, i, arr) => arr.indexOf(l) !== i)),
  ];
  const notable = [
    ...new Set(
      letters.filter(
        (l) => RARE_LETTERS.includes(l) || UNCOMMON_LETTERS.includes(l)
      )
    ),
  ];

  return {
    word,
    letters,
    vowels: vowelLetters.length,
    consonants: word.length - vowelLetters.length,
    unique,
    hasDouble: unique < word.length,
    repeatedLetters: repeated,
    firstLetter: letters[0] || "",
    lastLetter: letters[letters.length - 1] || "",
    startsWithVowel: VOWELS.includes(letters[0] || ""),
    vowelPositions: letters
      .map((l, i) => (VOWELS.includes(l) ? i + 1 : -1))
      .filter((n) => n > 0),
    notableLetters: notable,
  };
}

/** How many of a starter word's letters appear in the answer. */
function overlapCount(answer: string, starter: string): number {
  const set = new Set(answer.toUpperCase());
  return [...new Set(starter.toUpperCase())].filter((l) => set.has(l)).length;
}

/* ------------------------------------------------------------------ */
/*  Strategy tips, tailored to today's word                            */
/* ------------------------------------------------------------------ */

export function generateStrategyTips(raw: string): string[] {
  const a = analyzeWord(raw);
  const tips: string[] = [];

  const craneHits = overlapCount(a.word, "CRANE");
  const slateHits = overlapCount(a.word, "SLATE");
  const bestStarter = craneHits >= slateHits ? "CRANE" : "SLATE";
  const bestHits = Math.max(craneHits, slateHits);
  tips.push(
    bestHits > 0
      ? `Opening with ${bestStarter} would surface ${bestHits} of this word's letters — a strong way to narrow the field on guess one.`
      : `Common openers like CRANE and SLATE share no letters with today's answer, so treat a blank first guess as useful elimination, not a wasted turn.`
  );

  tips.push(
    a.vowels >= 3
      ? `Today's word packs ${a.vowels} vowels, so a vowel-heavy probe like ADIEU or AUDIO pays off early.`
      : a.vowels === 1
        ? `There's only one vowel here (position ${a.vowelPositions[0]}), so don't burn guesses chasing vowels — lean on common consonants instead.`
        : `With ${a.vowels} vowels at positions ${a.vowelPositions.join(" and ")}, locking the vowels early frames the consonants around them.`
  );

  if (a.hasDouble) {
    tips.push(
      `Watch for the repeated letter (${a.repeatedLetters.join(", ")}). Most solvers assume five distinct letters, so a double is a classic trap that costs guesses.`
    );
  } else {
    tips.push(
      "All five letters are distinct, so you can play unique-letter guesses freely without wasting a tile on a repeat."
    );
  }

  if (a.notableLetters.length) {
    tips.push(
      `The word uses the less common letter${a.notableLetters.length > 1 ? "s" : ""} ${a.notableLetters.join(", ")} — once a rare letter turns yellow or green, it collapses the candidate list fast.`
    );
  }

  tips.push(
    `It ${a.startsWithVowel ? "starts with a vowel" : `starts with the consonant ${a.firstLetter}`} and ends in ${a.lastLetter}. Fixing the first and last letters early is one of the quickest ways to corner the answer.`
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

export function generateFAQ(puzzle: WordlePuzzle): FaqItem[] {
  const a = analyzeWord(puzzle.answer);
  const formattedDate = dayjs(puzzle.printDate).format("MMMM D, YYYY");

  const items: FaqItem[] = [
    {
      question: `What is the Wordle answer for ${formattedDate}?`,
      answer: `The Wordle answer for ${formattedDate} (Puzzle #${puzzle.id}) is ${a.word}. Use the "Reveal Answer" button above to see it on the tile display first if you'd rather not be spoiled.`,
    },
    {
      question: `How many vowels are in the ${formattedDate} Wordle?`,
      answer: `${a.word} has ${a.vowels} vowel${a.vowels !== 1 ? "s" : ""} (at position${a.vowelPositions.length !== 1 ? "s" : ""} ${a.vowelPositions.join(", ")}) and ${a.consonants} consonant${a.consonants !== 1 ? "s" : ""}. ${a.hasDouble ? `It also repeats the letter ${a.repeatedLetters.join(", ")}, which trips up a lot of solvers.` : "Every letter is unique."}`,
    },
    {
      question: `What letter does the ${formattedDate} Wordle start with?`,
      answer: `Today's answer starts with ${a.firstLetter} and ends with ${a.lastLetter}. If you want a nudge instead of the full answer, that's usually enough to get unstuck.`,
    },
  ];

  if (a.notableLetters.length) {
    items.push({
      question: `Does the ${formattedDate} Wordle use any tricky letters?`,
      answer: `Yes — it contains ${a.notableLetters.join(", ")}, which appear less often in five-letter words, so they're easy to overlook. Try a guess that tests one of them once your common letters are placed.`,
    });
  }

  if (puzzle.editor) {
    items.push({
      question: `Who edits NYT Wordle?`,
      answer: `Puzzle #${puzzle.id} is credited to ${puzzle.editor} at The New York Times, which has curated the daily Wordle list since acquiring the game.`,
    });
  }

  return items;
}
