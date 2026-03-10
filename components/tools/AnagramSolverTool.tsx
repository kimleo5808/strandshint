"use client";

import { WORD_LISTS } from "@/data/wordle-words";
import { useCallback, useState } from "react";
import { Shuffle, X } from "lucide-react";

// Flatten all words into one searchable pool
const ALL_WORDS: string[] = Object.values(WORD_LISTS).flat();

function canFormWord(word: string, letters: string[]): boolean {
  const pool = [...letters];
  for (const ch of word) {
    const idx = pool.indexOf(ch);
    if (idx === -1) return false;
    pool.splice(idx, 1);
  }
  return true;
}

export default function AnagramSolverTool() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Record<number, string[]>>({});
  const [activeTab, setActiveTab] = useState<number>(0);
  const [solved, setSolved] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const handleSolve = useCallback(() => {
    const letters = input
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .split("");
    if (letters.length < 2) return;

    const grouped: Record<number, string[]> = {};
    let total = 0;

    for (const word of ALL_WORDS) {
      if (word.length < 2 || word.length > letters.length) continue;
      if (canFormWord(word, letters)) {
        if (!grouped[word.length]) grouped[word.length] = [];
        grouped[word.length].push(word);
        total++;
      }
    }

    setResults(grouped);
    setTotalCount(total);
    setSolved(true);
    // Default to longest tab
    const lengths = Object.keys(grouped)
      .map(Number)
      .sort((a, b) => b - a);
    setActiveTab(lengths[0] ?? 0);
  }, [input]);

  const handleReset = () => {
    setInput("");
    setResults({});
    setSolved(false);
    setTotalCount(0);
  };

  const tabs = Object.keys(results)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
            Enter Your Letters
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value.toUpperCase().replace(/[^A-Z]/g, ""));
              setSolved(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSolve()}
            maxLength={15}
            placeholder="e.g. LISTEN"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 font-mono text-lg font-bold uppercase tracking-widest text-foreground placeholder:normal-case placeholder:text-muted-foreground placeholder:font-normal placeholder:text-sm placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          {input && (
            <p className="mt-1 text-xs text-muted-foreground">
              {input.length} letter{input.length !== 1 ? "s" : ""} entered
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={handleSolve}
          disabled={input.length < 2}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Shuffle className="h-4 w-4" />
          Solve Anagram
        </button>
        {solved && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>

      {/* Results */}
      {solved && (
        <div className="mt-5 border-t border-border pt-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-foreground">
              {totalCount} word{totalCount !== 1 ? "s" : ""} found from &ldquo;
              {input}&rdquo;
            </p>
          </div>

          {totalCount === 0 ? (
            <p className="text-sm text-muted-foreground">
              No valid words found. Try different letters or a shorter
              combination.
            </p>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {tabs.map((len) => (
                  <button
                    key={len}
                    onClick={() => setActiveTab(len)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                      activeTab === len
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-card text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {len} letters ({results[len].length})
                  </button>
                ))}
              </div>

              {/* Word list */}
              {activeTab > 0 && results[activeTab] && (
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                  {results[activeTab].map((word) => (
                    <span
                      key={word}
                      className="rounded-lg bg-amber-500/10 px-3 py-1.5 font-mono text-sm font-bold text-amber-700 dark:text-amber-400 tracking-widest"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
