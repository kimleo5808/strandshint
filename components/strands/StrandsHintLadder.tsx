"use client";

import type { StrandsPuzzle } from "@/types/strands";
import {
  getFirstLetters,
  getFirstTwoLetters,
  getSpangramDirection,
} from "@/lib/strands-hints";
import { track } from "@/lib/track";
import { Eye, Lightbulb, ThumbsDown, ThumbsUp } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { StrandsGridStatic } from "./StrandsGrid";

/**
 * Progressive hint ladder.
 *
 * Each rung is revealed independently (take only what you need), going from
 * gentle nudges to the full solution. The final rung is styled as a heavy
 * spoiler gate. Content is always rendered into the DOM and only *visually*
 * gated with a blur overlay, so it stays crawlable for SEO while remaining
 * spoiler-safe for players.
 *
 * `onDark` switches to a fixed slate palette for use on the dark homepage
 * hero section; the default palette is theme-adaptive for the hint pages.
 */

interface StrandsHintLadderProps {
  puzzle: StrandsPuzzle;
  /** "compact" for the homepage preview, "full" for the dedicated hint page */
  variant?: "compact" | "full";
  /** Use fixed dark colors (for the dark homepage section) */
  onDark?: boolean;
}

interface Rung {
  label: string;
  content: ReactNode;
  tone: "normal" | "spangram" | "answer";
}

export function StrandsHintLadder({
  puzzle,
  variant = "compact",
  onDark = false,
}: StrandsHintLadderProps) {
  const direction = getSpangramDirection(puzzle);

  const p = {
    title: onDark ? "text-white" : "text-foreground",
    muted: onDark ? "text-slate-400" : "text-muted-foreground",
    content: onDark ? "text-slate-300" : "text-muted-foreground",
    chip: onDark
      ? "bg-strands-theme/25 text-white"
      : "bg-strands-theme/15 text-foreground",
    spangramWord: onDark ? "text-white" : "text-foreground",
    overlay: onDark
      ? "bg-slate-900/50 text-primary hover:bg-slate-900/30"
      : "bg-card/40 text-primary hover:bg-card/20",
    rowNormal: onDark
      ? "border-slate-700 bg-slate-800/60"
      : "border-border bg-muted/30",
    rowSpangram: "border-strands-spangram/40 bg-strands-spangram/10",
    rowAnswer: onDark
      ? "border-rose-500/40 bg-rose-500/10"
      : "border-destructive/30 bg-destructive/5",
    answerBadge: onDark
      ? "bg-rose-500/20 text-rose-300"
      : "bg-destructive/15 text-destructive",
  };

  const rungs: Rung[] = [
    {
      label: "Spangram hint",
      tone: "spangram",
      content: (
        <>
          The Spangram is <strong>{puzzle.spangram.length} letters</strong> and{" "}
          {direction.description}.
        </>
      ),
    },
    {
      label: "First letters",
      tone: "normal",
      content: (
        <>
          Each theme word starts with:{" "}
          <strong>{getFirstLetters(puzzle.themeWords)}</strong>.
        </>
      ),
    },
    {
      label: "First two letters",
      tone: "normal",
      content: (
        <>
          The first two letters of each theme word:{" "}
          <strong>{getFirstTwoLetters(puzzle.themeWords)}</strong>.
        </>
      ),
    },
    {
      label: `All ${puzzle.themeWords.length} theme words`,
      tone: "normal",
      content: (
        <div className="flex flex-wrap gap-1.5">
          {puzzle.themeWords.map((w) => (
            <span
              key={w}
              className={`rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${p.chip}`}
            >
              {w}
            </span>
          ))}
        </div>
      ),
    },
    {
      label: "The Spangram word",
      tone: "spangram",
      content: (
        <span
          className={`text-base font-bold uppercase tracking-wide ${p.spangramWord}`}
        >
          {puzzle.spangram}
        </span>
      ),
    },
    {
      label: "Full solution",
      tone: "answer",
      content: (
        <div>
          <p className={`mb-3 text-xs ${p.muted}`}>
            Every theme word and the Spangram, highlighted on the grid.
          </p>
          <StrandsGridStatic puzzle={puzzle} />
        </div>
      ),
    },
  ];

  const [revealed, setRevealed] = useState<boolean[]>(
    () => rungs.map(() => false)
  );
  const revealedCount = revealed.filter(Boolean).length;

  const reveal = (i: number) => {
    setRevealed((prev) => prev.map((v, idx) => (idx === i ? true : v)));
    track("strands_hint_reveal", {
      rung_index: i + 1,
      rung_label: rungs[i].label,
      variant,
    });
  };
  const revealAll = () => {
    setRevealed(rungs.map(() => true));
    track("strands_hint_reveal_all", { variant });
  };

  return (
    <div className="w-full text-left">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" aria-hidden="true" />
          <span className={`font-heading text-sm font-bold ${p.title}`}>
            Need a hint?
          </span>
          <span
            className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary"
            aria-label={`${revealedCount} of ${rungs.length} hints revealed`}
          >
            {revealedCount}/{rungs.length}
          </span>
        </div>
        {revealedCount < rungs.length && (
          <button
            type="button"
            onClick={revealAll}
            className={`text-xs font-medium transition-colors hover:opacity-80 ${p.muted}`}
          >
            Reveal all
          </button>
        )}
      </div>

      <p className={`mb-4 text-xs ${p.muted}`}>
        Reveal one hint at a time — stop as soon as you&apos;re unstuck.
      </p>

      <ol className={variant === "compact" ? "space-y-2.5" : "space-y-3"}>
        {rungs.map((rung, i) => (
          <RungRow
            key={rung.label}
            index={i}
            rung={rung}
            revealed={revealed[i]}
            onReveal={() => reveal(i)}
            p={p}
          />
        ))}
      </ol>

      {variant === "full" && (
        <HintFeedback puzzleDate={puzzle.printDate} muted={p.muted} />
      )}
    </div>
  );
}

function HintFeedback({
  puzzleDate,
  muted,
}: {
  puzzleDate: string;
  muted: string;
}) {
  const storageKey = `strands_hint_feedback_${puzzleDate}`;
  const [voted, setVoted] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    try {
      const v = window.localStorage.getItem(storageKey);
      if (v === "up" || v === "down") setVoted(v);
    } catch {
      // localStorage unavailable — ignore
    }
  }, [storageKey]);

  const vote = (value: "up" | "down") => {
    setVoted(value);
    try {
      window.localStorage.setItem(storageKey, value);
    } catch {
      // ignore
    }
    track("strands_hint_feedback", { value, puzzle_date: puzzleDate });
  };

  if (voted) {
    return (
      <p className={`mt-5 text-center text-xs ${muted}`}>
        Thanks for the feedback! 🙌
      </p>
    );
  }

  return (
    <div className="mt-5 flex items-center justify-center gap-3">
      <span className={`text-xs ${muted}`}>Were these hints helpful?</span>
      <button
        type="button"
        onClick={() => vote("up")}
        aria-label="These hints were helpful"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-emerald-500/50 hover:text-emerald-500"
      >
        <ThumbsUp className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => vote("down")}
        aria-label="These hints were not helpful"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-rose-500/50 hover:text-rose-500"
      >
        <ThumbsDown className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

function RungRow({
  index,
  rung,
  revealed,
  onReveal,
  p,
}: {
  index: number;
  rung: Rung;
  revealed: boolean;
  onReveal: () => void;
  p: Record<string, string>;
}) {
  const contentId = useId();
  const contentRef = useRef<HTMLDivElement>(null);

  const accent =
    rung.tone === "answer"
      ? p.rowAnswer
      : rung.tone === "spangram"
        ? p.rowSpangram
        : p.rowNormal;

  const handleReveal = () => {
    onReveal();
    // Content is always mounted (only visually gated), so we can move focus
    // to it right away — the reveal button unmounts on the next render.
    contentRef.current?.focus();
  };

  return (
    <li className={`relative overflow-hidden rounded-xl border ${accent}`}>
      <div className="px-4 py-3">
        <p className={`mb-1.5 flex items-center gap-2 text-xs font-bold ${p.title}`}>
          <span
            className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary"
            aria-hidden="true"
          >
            {index + 1}
          </span>
          {rung.label}
          {rung.tone === "answer" && (
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${p.answerBadge}`}
            >
              Spoiler
            </span>
          )}
        </p>

        {/* Content is always in the DOM (crawlable); only visually gated. */}
        <div
          id={contentId}
          ref={contentRef}
          tabIndex={-1}
          className={`text-sm leading-relaxed outline-none ${p.content} ${
            revealed ? "" : "pointer-events-none select-none blur-[6px]"
          }`}
          aria-hidden={!revealed}
        >
          {rung.content}
        </div>
      </div>

      {/* Reveal overlay */}
      {!revealed && (
        <button
          type="button"
          onClick={handleReveal}
          aria-expanded={false}
          aria-controls={contentId}
          className={`absolute inset-0 flex items-center justify-center gap-2 text-sm font-semibold backdrop-blur-[2px] transition-colors ${p.overlay}`}
        >
          <Eye className="h-4 w-4" aria-hidden="true" />
          Reveal {rung.label.toLowerCase()}
        </button>
      )}
    </li>
  );
}
