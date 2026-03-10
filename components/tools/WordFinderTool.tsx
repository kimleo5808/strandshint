"use client";

import { WORD_LISTS } from "@/data/wordle-words";
import { useCallback, useState } from "react";
import { Search, X } from "lucide-react";

// Merge all words into one lookup: { word -> true }
const ALL_WORDS: Record<number, string[]> = WORD_LISTS;

interface Filters {
  length: string; // "" = any
  positions: string[]; // up to 11 slots, "" = wildcard
  contains: string;
  excludes: string;
  startsWith: string;
  endsWith: string;
}

const DEFAULT_FILTERS: Filters = {
  length: "5",
  positions: Array(5).fill(""),
  contains: "",
  excludes: "",
  startsWith: "",
  endsWith: "",
};

function applyFilters(words: string[], f: Filters): string[] {
  const contains = f.contains
    .toUpperCase()
    .split("")
    .filter((c) => /[A-Z]/.test(c));
  const excludes = f.excludes
    .toUpperCase()
    .split("")
    .filter((c) => /[A-Z]/.test(c));
  const sw = f.startsWith.toUpperCase().trim();
  const ew = f.endsWith.toUpperCase().trim();

  return words.filter((word) => {
    // known positions
    for (let i = 0; i < f.positions.length; i++) {
      const ch = f.positions[i].toUpperCase().trim();
      if (ch && word[i] !== ch) return false;
    }
    // contains
    for (const ch of contains) {
      if (!word.includes(ch)) return false;
    }
    // excludes
    for (const ch of excludes) {
      if (word.includes(ch)) return false;
    }
    if (sw && !word.startsWith(sw)) return false;
    if (ew && !word.endsWith(ew)) return false;
    return true;
  });
}

export default function WordFinderTool() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [results, setResults] = useState<string[]>([]);
  const [searched, setSearched] = useState(false);

  const currentLength = parseInt(filters.length) || 5;

  const handleLengthChange = (val: string) => {
    const len = parseInt(val) || 5;
    setFilters((f) => ({
      ...f,
      length: val,
      positions: Array(len).fill(""),
    }));
    setSearched(false);
  };

  const handlePosition = (idx: number, val: string) => {
    const ch = val.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 1);
    setFilters((f) => {
      const pos = [...f.positions];
      pos[idx] = ch;
      return { ...f, positions: pos };
    });
  };

  const handleSearch = useCallback(() => {
    const len = parseInt(filters.length) || 5;
    const pool = ALL_WORDS[len] ?? [];
    const found = applyFilters(pool, filters);
    setResults(found);
    setSearched(true);
  }, [filters]);

  const handleReset = () => {
    setFilters({
      ...DEFAULT_FILTERS,
      positions: Array(currentLength).fill(""),
    });
    setResults([]);
    setSearched(false);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Word Length */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
            Word Length
          </label>
          <select
            value={filters.length}
            onChange={(e) => handleLengthChange(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {[4, 5, 6, 7, 8, 9, 10, 11].map((n) => (
              <option key={n} value={n}>
                {n} letters
              </option>
            ))}
          </select>
        </div>

        {/* Starts / Ends with */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
              Starts With
            </label>
            <input
              type="text"
              maxLength={4}
              value={filters.startsWith}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  startsWith: e.target.value.toUpperCase().replace(/[^A-Z]/g, ""),
                }))
              }
              placeholder="e.g. CR"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground uppercase placeholder:normal-case placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
              Ends With
            </label>
            <input
              type="text"
              maxLength={4}
              value={filters.endsWith}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  endsWith: e.target.value.toUpperCase().replace(/[^A-Z]/g, ""),
                }))
              }
              placeholder="e.g. ING"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground uppercase placeholder:normal-case placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>

        {/* Contains */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
            Contains Letters
          </label>
          <input
            type="text"
            value={filters.contains}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                contains: e.target.value.toUpperCase().replace(/[^A-Z]/g, ""),
              }))
            }
            placeholder="e.g. AE"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground uppercase placeholder:normal-case placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Excludes */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
            Exclude Letters
          </label>
          <input
            type="text"
            value={filters.excludes}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                excludes: e.target.value.toUpperCase().replace(/[^A-Z]/g, ""),
              }))
            }
            placeholder="e.g. XQZ"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground uppercase placeholder:normal-case placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      {/* Position boxes */}
      <div className="mt-4">
        <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
          Known Letter Positions (leave blank = any)
        </label>
        <div className="flex gap-1.5 flex-wrap">
          {Array.from({ length: currentLength }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <input
                type="text"
                maxLength={1}
                value={filters.positions[i] ?? ""}
                onChange={(e) => handlePosition(i, e.target.value)}
                className="h-10 w-10 rounded-lg border border-border bg-background text-center text-sm font-bold uppercase text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <span className="text-[10px] text-muted-foreground">{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-5 flex gap-3">
        <button
          onClick={handleSearch}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90"
        >
          <Search className="h-4 w-4" />
          Find Words
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground"
        >
          <X className="h-4 w-4" />
          Reset
        </button>
      </div>

      {/* Results */}
      {searched && (
        <div className="mt-5 border-t border-border pt-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-foreground">
              {results.length} word{results.length !== 1 ? "s" : ""} found
            </span>
            {results.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {currentLength}-letter words
              </span>
            )}
          </div>
          {results.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No words match your criteria. Try relaxing some filters.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              {results.map((word) => (
                <span
                  key={word}
                  className="rounded-lg bg-primary/10 px-3 py-1.5 font-mono text-sm font-bold text-primary tracking-widest"
                >
                  {word}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
