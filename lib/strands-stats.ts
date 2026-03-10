import type { StrandsPuzzle } from "@/types/strands";

export interface MonthlyCount {
  month: string;
  count: number;
}

export interface LengthDist {
  length: number;
  count: number;
  pct: number;
}

export interface LetterFreq {
  letter: string;
  count: number;
  pct: number;
}

export interface ThemeWordsPerPuzzle {
  count: number;
  puzzles: number;
  pct: number;
}

export interface StrandsRecord {
  puzzle: { id: number; printDate: string; clue: string };
  value: string | number;
}

export interface StrandsStats {
  totalPuzzles: number;
  avgThemeWords: number;
  avgSpangramLength: number;
  avgThemeWordLength: number;
  monthlyPuzzleCounts: MonthlyCount[];
  themeWordLengthDist: LengthDist[];
  spangramStats: {
    min: number;
    max: number;
    avg: number;
    mostCommonStartLetter: string;
  };
  letterFrequency: LetterFreq[];
  themeWordsPerPuzzleDist: ThemeWordsPerPuzzle[];
  records: {
    longestSpangram: StrandsRecord;
    shortestSpangram: StrandsRecord;
    mostThemeWords: StrandsRecord;
    fewestThemeWords: StrandsRecord;
    longestThemeWord: StrandsRecord;
    shortestThemeWord: StrandsRecord;
  };
}

export function computeStrandsStats(puzzles: StrandsPuzzle[]): StrandsStats {
  const totalPuzzles = puzzles.length;

  // ── Averages ────────────────────────────────────────────────────────────────
  const avgThemeWords =
    Math.round(
      (puzzles.reduce((s, p) => s + p.themeWords.length, 0) / totalPuzzles) *
        10
    ) / 10;

  const avgSpangramLength =
    Math.round(
      (puzzles.reduce((s, p) => s + p.spangram.length, 0) / totalPuzzles) * 10
    ) / 10;

  const allThemeWords = puzzles.flatMap((p) => p.themeWords);
  const avgThemeWordLength =
    Math.round(
      (allThemeWords.reduce((s, w) => s + w.length, 0) / allThemeWords.length) *
        10
    ) / 10;

  // ── Monthly counts ──────────────────────────────────────────────────────────
  const monthMap = new Map<string, number>();
  puzzles.forEach((p) => {
    const m = p.printDate.slice(0, 7);
    monthMap.set(m, (monthMap.get(m) ?? 0) + 1);
  });
  const monthlyPuzzleCounts: MonthlyCount[] = Array.from(monthMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, count]) => ({ month, count }));

  // ── Theme word length distribution ──────────────────────────────────────────
  const lenMap = new Map<number, number>();
  allThemeWords.forEach((w) => lenMap.set(w.length, (lenMap.get(w.length) ?? 0) + 1));
  const themeWordLengthDist: LengthDist[] = Array.from(lenMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([length, count]) => ({
      length,
      count,
      pct: Math.round((count / allThemeWords.length) * 100),
    }));

  // ── Spangram stats ──────────────────────────────────────────────────────────
  const spanLens = puzzles.map((p) => p.spangram.length);
  const startLetterMap = new Map<string, number>();
  puzzles.forEach((p) => {
    const l = p.spangram[0]?.toUpperCase() ?? "?";
    startLetterMap.set(l, (startLetterMap.get(l) ?? 0) + 1);
  });
  const mostCommonStartLetter =
    Array.from(startLetterMap.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "S";

  const spangramStats = {
    min: Math.min(...spanLens),
    max: Math.max(...spanLens),
    avg: Math.round((spanLens.reduce((a, b) => a + b, 0) / spanLens.length) * 10) / 10,
    mostCommonStartLetter,
  };

  // ── Letter frequency ────────────────────────────────────────────────────────
  const letterCountMap = new Map<string, number>();
  allThemeWords.forEach((word) => {
    for (const ch of word) {
      const l = ch.toUpperCase();
      if (l >= "A" && l <= "Z") {
        letterCountMap.set(l, (letterCountMap.get(l) ?? 0) + 1);
      }
    }
  });
  const totalLetters = Array.from(letterCountMap.values()).reduce((a, b) => a + b, 0);
  const letterFrequency: LetterFreq[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    .split("")
    .map((letter) => ({
      letter,
      count: letterCountMap.get(letter) ?? 0,
      pct:
        Math.round(((letterCountMap.get(letter) ?? 0) / totalLetters) * 1000) / 10,
    }));

  // ── Theme words per puzzle distribution ─────────────────────────────────────
  const countMap = new Map<number, number>();
  puzzles.forEach((p) => {
    const c = p.themeWords.length;
    countMap.set(c, (countMap.get(c) ?? 0) + 1);
  });
  const themeWordsPerPuzzleDist: ThemeWordsPerPuzzle[] = Array.from(
    countMap.entries()
  )
    .sort((a, b) => a[0] - b[0])
    .map(([count, puzCount]) => ({
      count,
      puzzles: puzCount,
      pct: Math.round((puzCount / totalPuzzles) * 100),
    }));

  // ── Records ─────────────────────────────────────────────────────────────────
  const pRef = (p: StrandsPuzzle) => ({
    id: p.id,
    printDate: p.printDate,
    clue: p.clue,
  });

  const longestSpangramPuzzle = puzzles.reduce((b, p) =>
    p.spangram.length > b.spangram.length ? p : b
  );
  const shortestSpangramPuzzle = puzzles.reduce((b, p) =>
    p.spangram.length < b.spangram.length ? p : b
  );
  const mostThemeWordsPuzzle = puzzles.reduce((b, p) =>
    p.themeWords.length > b.themeWords.length ? p : b
  );
  const fewestThemeWordsPuzzle = puzzles.reduce((b, p) =>
    p.themeWords.length < b.themeWords.length ? p : b
  );

  let longestWord = "";
  let longestWordPuzzle = puzzles[0];
  let shortestWord = "Z".repeat(30);
  let shortestWordPuzzle = puzzles[0];
  puzzles.forEach((p) => {
    p.themeWords.forEach((w) => {
      if (w.length > longestWord.length) {
        longestWord = w;
        longestWordPuzzle = p;
      }
      if (w.length < shortestWord.length) {
        shortestWord = w;
        shortestWordPuzzle = p;
      }
    });
  });

  return {
    totalPuzzles,
    avgThemeWords,
    avgSpangramLength,
    avgThemeWordLength,
    monthlyPuzzleCounts,
    themeWordLengthDist,
    spangramStats,
    letterFrequency,
    themeWordsPerPuzzleDist,
    records: {
      longestSpangram: {
        puzzle: pRef(longestSpangramPuzzle),
        value: longestSpangramPuzzle.spangram,
      },
      shortestSpangram: {
        puzzle: pRef(shortestSpangramPuzzle),
        value: shortestSpangramPuzzle.spangram,
      },
      mostThemeWords: {
        puzzle: pRef(mostThemeWordsPuzzle),
        value: mostThemeWordsPuzzle.themeWords.length,
      },
      fewestThemeWords: {
        puzzle: pRef(fewestThemeWordsPuzzle),
        value: fewestThemeWordsPuzzle.themeWords.length,
      },
      longestThemeWord: { puzzle: pRef(longestWordPuzzle), value: longestWord },
      shortestThemeWord: {
        puzzle: pRef(shortestWordPuzzle),
        value: shortestWord,
      },
    },
  };
}
