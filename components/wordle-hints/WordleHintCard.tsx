'use client'

import type { WordlePuzzle } from '@/types/wordle-hint'
import { ChevronDown, Eye, Lightbulb } from 'lucide-react'
import { useState } from 'react'

interface WordleHintCardProps {
  puzzle: WordlePuzzle
}

function countVowels(word: string): number {
  return (word.match(/[AEIOU]/g) || []).length
}

export function WordleHintCard({ puzzle }: WordleHintCardProps) {
  const [expanded, setExpanded] = useState(true)
  const [revealLevel, setRevealLevel] = useState(0)

  const word = puzzle.answer.toUpperCase()
  const vowels = countVowels(word)
  const consonants = word.length - vowels
  const uniqueLetters = new Set(word).size

  const hints = [
    {
      label: 'Hint 1: Letter Count',
      content: `Today's Wordle answer is ${word.length} letters long. It has ${vowels} vowel${vowels !== 1 ? 's' : ''} and ${consonants} consonant${consonants !== 1 ? 's' : ''}.`,
    },
    {
      label: 'Hint 2: Starting Letter',
      content: `The word starts with the letter "${word[0]}". Think of common 5-letter words beginning with ${word[0]}.`,
    },
    {
      label: 'Hint 3: Ending Letter',
      content: `The word ends with "${word[word.length - 1]}". It starts with "${word[0]}" and ends with "${word[word.length - 1]}".`,
    },
    {
      label: 'Hint 4: Letter Pattern',
      content: `The word has ${uniqueLetters} unique letter${uniqueLetters !== 1 ? 's' : ''}. The pattern is: ${word.split('').map((l, i) => (i === 0 || i === word.length - 1 ? l : '_')).join('')}`,
    },
    {
      label: 'Hint 5: Full Answer',
      content: `Today's Wordle answer is: ${word}`,
    },
  ]

  return (
    <div className="rounded-xl border border-emerald-200 bg-card overflow-hidden transition-shadow hover:shadow-md">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-emerald-50/50"
      >
        <div className="flex items-center gap-3">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <span className="font-heading text-sm font-bold text-foreground">
            Progressive Hints
          </span>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
            {revealLevel}/{hints.length}
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {expanded && (
        <div className="border-t border-border px-5 pb-5 pt-4 space-y-3">
          {hints.map((hint, i) => (
            <div key={i}>
              {i < revealLevel ? (
                <div className="flex items-start gap-2 rounded-lg bg-emerald-50 px-3 py-2.5">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  <div>
                    <p className="text-xs font-bold text-foreground mb-1">{hint.label}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">{hint.content}</p>
                  </div>
                </div>
              ) : i === revealLevel ? (
                <button
                  onClick={() => setRevealLevel(revealLevel + 1)}
                  className="flex w-full items-center gap-2 rounded-lg border border-dashed border-emerald-300 px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-emerald-500 hover:text-emerald-700"
                >
                  <Eye className="h-4 w-4" />
                  Reveal {hint.label}
                </button>
              ) : null}
            </div>
          ))}
          {revealLevel >= hints.length && (
            <p className="text-center text-xs text-muted-foreground mt-2">
              All hints revealed! See the full answer and word analysis below.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
