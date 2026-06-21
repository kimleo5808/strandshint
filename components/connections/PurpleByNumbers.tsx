import { BarChart } from '@/components/charts/BarChart'
import { StatCard } from '@/components/charts/StatCard'
import {
  PURPLE_ARCHETYPES,
  PURPLE_DATE_RANGE,
  PURPLE_GENERATED_AT,
  PURPLE_SAMPLE_SIZE,
  archetypeFrequency,
} from '@/data/connections/purple-content'

// Short labels for the bar chart (the full archetype names are too long for the
// chart's fixed label column).
const SHORT_LABELS: Record<string, string> = {
  'phrase-completion': 'Phrase fill',
  'hidden-words': 'Hidden word',
  homophones: 'Homophone',
  anagrams: 'Anagram',
  'letter-change': '± a letter',
  'before-after': 'Before/after',
  'pop-culture': 'Niche category',
}

/**
 * "Purple by the Numbers" — a first-party data block computed from the archive
 * by scripts/classify-purple.mjs. This is the page's citable GEO/LLM asset.
 */
export function PurpleByNumbers() {
  const ranked = PURPLE_ARCHETYPES.map((a) => ({
    key: a.key,
    label: SHORT_LABELS[a.key] ?? a.name,
    ...archetypeFrequency(a.key),
  })).sort((x, y) => y.count - x.count)

  const top = ranked[0]
  const niche = archetypeFrequency('pop-culture')
  const wordplayPct = 100 - niche.pct

  const chartItems = ranked.map((r) => ({
    label: r.label,
    value: r.count,
    subLabel: `${r.pct}%`,
  }))

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-heading text-xl font-bold text-foreground">
          Purple by the Numbers
        </h2>
        <span className="text-xs text-muted-foreground">
          {PURPLE_SAMPLE_SIZE} puzzles · {PURPLE_DATE_RANGE.from} → {PURPLE_DATE_RANGE.to}
        </span>
      </div>
      <p className="mb-5 text-sm text-muted-foreground">
        We classified the purple group of every puzzle in our archive by its
        underlying trick. Here is how often each archetype shows up.
      </p>

      {/* Headline stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard
          label="Purple groups analyzed"
          value={PURPLE_SAMPLE_SIZE}
          accent="purple"
        />
        <StatCard
          label="Use some form of wordplay"
          value={`${wordplayPct}%`}
          subtext="vs. a straight niche category"
          accent="amber"
        />
        <StatCard
          label="Most common trick"
          value={`${top.pct}%`}
          subtext={top.label}
          accent="emerald"
        />
      </div>

      {/* Frequency chart */}
      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          Archetype frequency across the archive
        </h3>
        <BarChart items={chartItems} color="purple" />
      </div>

      <p className="mt-5 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
        Method: each purple category is auto-classified by its title into one of
        seven archetypes (a title like &ldquo;ENDING IN SYNONYMS FOR LOCATION&rdquo;
        counts as a hidden-word group). Counts are approximate and recomputed as the
        archive grows. Last updated {PURPLE_GENERATED_AT}.
      </p>
    </div>
  )
}
