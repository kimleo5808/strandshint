# StrandsHint.app — New Pages Expansion Plan

> This document is the single source of truth for the new pages expansion project.
> Every task must follow the conventions, design patterns, and quality standards defined here.

---

## Table of Contents

1. [Project Context](#1-project-context)
2. [Design & Content Standards](#2-design--content-standards)
3. [Existing Patterns Reference](#3-existing-patterns-reference)
4. [Page Specifications](#4-page-specifications)
5. [Global Updates](#5-global-updates)
6. [Data Layer](#6-data-layer)
7. [New Components](#7-new-components)
8. [Implementation Phases & TodoList](#8-implementation-phases--todolist)

---

## 1. Project Context

### Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 App Router + React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 3 + shadcn/ui (CVA + clsx + tailwind-merge) |
| i18n | next-intl v4 (currently `en` only, locale prefix `as-needed`) |
| State | Zustand |
| Deployment | Cloudflare Workers via @opennextjs/cloudflare |
| Package Manager | pnpm |

### Key Directories

```
app/[locale]/              → All page routes
components/strands/        → Strands puzzle components
components/wordle/         → Wordle game components (existing play-mode)
components/home/           → Home page component
components/header/         → Header + HeaderLinks + MobileMenu
components/footer/         → Footer + SocialShare + Badges
components/ui/             → shadcn primitives (button, toast, dropdown-menu, select, alert)
data/strands/puzzles.json  → 25000+ lines of Strands puzzle data
data/wordle-words.ts       → Wordle word lists (answer pool + valid guesses)
data/letter-games.ts       → 4-11 letter game metadata
data/guides.ts             → Guide articles data
i18n/messages/en.json      → All English translations (namespaced)
config/site.ts             → Site metadata (BASE_URL, siteConfig)
lib/                       → Utility functions (jsonld schemas, puzzle helpers)
types/                     → TypeScript type definitions
```

---

## 2. Design & Content Standards

### Content Requirements

- **Minimum 1000 words** per page (excluding interactive tool UI)
- Split content into multiple `<h2>` and `<h3>` sections — **no section longer than 200 words**
- Every page must include:
  - Gradient header section with icon + title + subtitle
  - At least one card grid (2-col or 3-col)
  - At least one table or data visualization
  - FAQ section (minimum 5 questions, details/summary accordion)
  - CTA banner at bottom with 2 action buttons
  - Breadcrumb JsonLd + page-specific schema (faqPage / howTo / article)

### Visual Design Rules

- **Cards**: `rounded-xl border border-border bg-card p-4 sm:p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md`
- **Sections**: `rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm`
- **Gradient Headers**: `from-{color}-900 via-{color}-800 to-{color}-900` with white text
- **Container**: `mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8` (or max-w-6xl for wider pages)
- **Grid**: `grid gap-4 sm:grid-cols-2 lg:grid-cols-3`
- **Sidebar layout**: `flex flex-col gap-8 lg:flex-row` with `aside className="w-full lg:w-72 shrink-0"` sticky
- **Section spacing**: `mt-8` ~ `mt-12` between major sections
- **Typography**: font-heading for headings, font-body for text

### Color Coding by Game

| Game | Primary Color | Gradient |
|------|--------------|----------|
| Strands | Blue (`primary`) | `from-slate-900 via-slate-800 to-slate-900` (existing) |
| Connections | Purple | `from-purple-900 via-purple-800 to-purple-900` |
| Wordle | Emerald/Green | `from-emerald-900 via-emerald-800 to-emerald-900` |
| Tools | Blue/Indigo | `from-indigo-900 via-indigo-800 to-indigo-900` |
| Statistics | Dark Blue | `from-blue-900 via-blue-800 to-blue-900` |

### Connections Category Colors (match NYT official)

| Difficulty | Color | Tailwind |
|-----------|-------|----------|
| Easiest | Yellow | `bg-yellow-400 text-yellow-950` |
| Easy | Green | `bg-green-500 text-white` |
| Medium | Blue | `bg-blue-500 text-white` |
| Hardest | Purple | `bg-purple-600 text-white` |

### SEO Requirements (every page)

- Unique `<title>` and `<meta description>` via i18n namespace
- `generateMetadata()` with openGraph + twitter card
- JsonLd: breadcrumb schema (all pages) + faqPage / howTo / article as applicable
- Canonical URL
- Internal links: every page must link to at least 3 other pages on the site

---

## 3. Existing Patterns Reference

### Page Template (follow this structure)

```tsx
// app/[locale]/{page}/page.tsx
import { Locale, LOCALES } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd"; // or wherever it lives
import { breadcrumbSchema, faqPageSchema } from "@/lib/jsonld";
import { BASE_URL } from "@/config/site";

type Params = Promise<{ locale: string }>;

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PageNamespace" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: `${BASE_URL}/page-slug` },
  };
}

export default async function PageName({ params }: { params: Params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PageNamespace" });
  return ( /* page content */ );
}
```

### Interactive Component Pattern (client)

```tsx
"use client";
import { useState } from "react";
// Spoiler / reveal pattern: button toggles state, content conditionally rendered
```

### i18n Message Pattern

```json
{
  "PageNamespace": {
    "title": "Page Title — StrandsHint",
    "description": "Meta description for SEO.",
    "heading": "...",
    "subheading": "..."
  }
}
```

### Sitemap Entry Pattern

```ts
{ url: `${BASE_URL}/page-slug`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 }
```

---

## 4. Page Specifications

### PAGE 1: `/strands-hint-yesterday`

**Goal**: Capture "yesterday's strands answer" search traffic.
**Data Source**: Existing `data/strands/puzzles.json` — auto-pick yesterday's date (ET timezone).

**Sections**:

| # | Tag | Section Title | Content | Design Element |
|---|-----|--------------|---------|----------------|
| 1 | header | Yesterday's Strands Answer — {date} | Title + puzzle number + subtitle | Purple-blue gradient, Calendar icon |
| 2 | h2 | Puzzle Overview | Theme clue + word count + spangram length summary | 3-col stat cards (Puzzle #, Theme Words, Spangram Length) |
| 3 | h2 | Spangram | Full spangram + start/end position + direction analysis | Gold/amber card with grid position info |
| 4 | h2 | Theme Words | All theme words listed with lengths | Blue cards grid (one card per word) |
| 5 | h2 | Solved Grid | Complete 6×8 grid with highlights | `StrandsGridStatic` component |
| 6 | h2 | Puzzle Breakdown | Each word explained: meaning, position, why it fits theme | Table: Word / Length / Row / Explanation |
| 7 | h2 | Theme Analysis | How the theme connects all words | 2-3 paragraphs |
| 8 | h2 | Strategy Takeaways | Lessons learned from this puzzle | 4 tip cards in 2×2 grid |
| 9 | h2 | FAQ | 5 questions about yesterday's puzzle | details/summary accordion |
| 10 | — | CTA | "See Today's Hints" + "Browse Archive" | Gradient banner + 2 buttons |

**Target**: ~1000 words. **JsonLd**: breadcrumb + faqPage.

---

### PAGE 2: `/strands-statistics`

**Goal**: Unique data-driven content no competitor has. Computed at build time from puzzles.json.
**Data Source**: Aggregate stats computed from `data/strands/puzzles.json`.

**Sections**:

| # | Tag | Section Title | Content | Design Element |
|---|-----|--------------|---------|----------------|
| 1 | header | Strands Puzzle Statistics & Trends | Title + subtitle (total puzzle count) | Dark blue gradient, BarChart icon |
| 2 | h2 | At a Glance | Total puzzles, avg theme words, avg spangram length, avg word length | 4-col stat cards with large numbers |
| 3 | h2 | Puzzles Over Time | Monthly puzzle count | CSS horizontal bar chart (one bar per month) |
| 4 | h2 | Theme Word Length Distribution | Distribution of word lengths across all theme words | CSS bar chart + table |
| 5 | h2 | Spangram Statistics | Min/max/avg length, most common starting letters | Table + 2 highlight cards (longest/shortest) |
| 6 | h2 | Letter Frequency Heatmap | How often each letter appears in theme words | 26-cell CSS grid, color intensity = frequency |
| 7 | h2 | Theme Words Per Puzzle | Distribution (how many puzzles have 5 words, 6 words, etc.) | Table + percentage bars |
| 8 | h2 | Notable Records | Longest spangram, most theme words, shortest theme word, etc. | 6 record cards in 2×3 grid |
| 9 | h2 | Monthly Trends | Average metrics per month over time | Large table with scroll on mobile |
| 10 | h2 | FAQ | 5 questions | details/summary accordion |

**Target**: ~1200 words. **JsonLd**: breadcrumb + faqPage.

---

### PAGE 3: `/how-to-play-connections`

**Goal**: Capture educational search traffic, pair with future Connections hint pages.
**Data Source**: Static content (no puzzle data needed).

**Sections**:

| # | Tag | Section Title | Content | Design Element |
|---|-----|--------------|---------|----------------|
| 1 | header | How to Play NYT Connections | Title + subtitle | Purple gradient, BookOpen icon |
| 2 | h2 | What is NYT Connections? | Game overview, who makes it, daily schedule | 2-3 paragraphs |
| 3 | h2 | The Rules | Basic rules: 16 words, 4 groups, 4 mistakes | 3 icon cards (Grid / Groups / Mistakes) |
| 4 | h2 | Understanding Difficulty Levels | Yellow → Green → Blue → Purple | 4 color-coded cards with examples |
| 5 | h2 | Step-by-Step Guide | 6 steps from opening to solving | Numbered step cards |
| 6 | h2 | Common Traps & Tricks | 6 traps the game uses (red herrings, multiple meanings, etc.) | 2×3 warning cards with AlertTriangle icon |
| 7 | h2 | Winning Strategies | 6 strategies (eliminate easy group first, look for uncommon links, etc.) | 2×3 strategy cards with Lightbulb icon |
| 8 | h2 | Connections vs Strands | Side-by-side comparison | HTML table (Grid Size / Mechanic / Difficulty / Time / Goal) |
| 9 | h2 | Frequently Asked Questions | 8 FAQ items | details/summary accordion |
| 10 | — | CTA | "Today's Connections Hints" + "Play Strands" | Gradient banner + 2 buttons |

**Target**: ~1300 words. **JsonLd**: breadcrumb + howTo + faqPage.

---

### PAGE 4: `/word-finder`

**Goal**: High-volume tool page for word game players.
**Data Source**: Reuse `data/wordle-words.ts` word lists + extend with a larger dictionary file.

**Sections**:

| # | Tag | Section Title | Content | Design Element |
|---|-----|--------------|---------|----------------|
| 1 | header | Word Finder — Search Words by Letters & Pattern | Title + subtitle | Indigo gradient, Search icon |
| 2 | — | Tool Area | Inputs: word length, known letters (position), contains, excludes, starts with, ends with → filter + display results | Large interactive card, client component |
| 3 | — | Results | Matching words displayed as pill/tag grid, grouped by length | Scrollable area, word count badge |
| 4 | h2 | How to Use the Word Finder | 3-step guide | 3 numbered cards with icons |
| 5 | h2 | Popular Search Patterns | Common patterns people search for | Table: Pattern / Example Words / Use Case |
| 6 | h2 | English Letter Frequency | Which letters appear most in English words | CSS bar chart (26 bars) + table |
| 7 | h2 | Common Prefixes & Suffixes | UN-, RE-, -ING, -TION, etc. | 2 tables side by side |
| 8 | h2 | Tips for Word Games | How to use word finder for Wordle, Strands, Scrabble | 3 game-specific tip cards |
| 9 | h2 | FAQ | 6 questions | details/summary accordion |
| 10 | — | CTA | "Play Wordle" + "Today's Strands Hints" | Gradient banner + 2 buttons |

**Target**: ~1500 words (excl. tool UI). **JsonLd**: breadcrumb + faqPage.

---

### PAGE 5: `/anagram-solver`

**Goal**: Evergreen tool page, stable search volume.
**Data Source**: Same word lists as word-finder.

**Sections**:

| # | Tag | Section Title | Content | Design Element |
|---|-----|--------------|---------|----------------|
| 1 | header | Anagram Solver — Unscramble Any Letters | Title + subtitle | Amber gradient, Shuffle icon |
| 2 | — | Tool Area | Input: letters → Output: all valid words grouped by length (tabs) | Interactive card, client component |
| 3 | h2 | What is an Anagram? | Definition + 3 classic examples | 3 example cards (LISTEN→SILENT, EARTH→HEART, etc.) |
| 4 | h2 | How to Solve Anagrams | 5-step method | 5 numbered step cards |
| 5 | h2 | Common Anagram Patterns | Prefixes/suffixes to spot first, common letter swaps | Table |
| 6 | h2 | Anagrams in Word Games | How anagram skills help in Strands, Scrabble, Crosswords | 3 game cards |
| 7 | h2 | Fun Anagram Facts | Notable anagrams, longest English anagram, etc. | 4 fun-fact cards in 2×2 grid |
| 8 | h2 | FAQ | 6 questions | details/summary accordion |
| 9 | — | CTA | "Word Finder" + "Play Wordle" | Gradient banner + 2 buttons |

**Target**: ~1200 words. **JsonLd**: breadcrumb + faqPage.

---

### PAGE 6: `/wordle-solver`

**Goal**: Interactive tool for Wordle players, cross-sell to Wordle game pages.
**Data Source**: `data/wordle-words.ts` answer pool.

**Sections**:

| # | Tag | Section Title | Content | Design Element |
|---|-----|--------------|---------|----------------|
| 1 | header | Wordle Solver — Find the Best Next Guess | Title + subtitle | Emerald gradient, Cpu icon |
| 2 | — | Tool Area | 5-cell input (mimics Wordle row), each cell: letter + color (green/yellow/gray) toggle → suggest best words | Interactive card, client component |
| 3 | — | Suggestions | Ranked word list: Word / Remaining Possibilities / Unique Letters | Scrollable table/card list |
| 4 | h2 | How the Solver Works | Filtering algorithm explanation (3 steps) | 3 flow-step cards |
| 5 | h2 | Optimal Wordle Strategy | Opening → Middle → Endgame | 3 phase cards |
| 6 | h2 | Top 20 Starting Words | Ranked by letter frequency coverage | Table: Rank / Word / Score / Vowels / Unique |
| 7 | h2 | Letter Frequency in Wordle | 26-letter frequency specific to Wordle answer pool | CSS bar chart |
| 8 | h2 | Common 5-Letter Word Patterns | -IGHT, -OUND, -ATCH, etc. | Table: Pattern / Example Words / Frequency |
| 9 | h2 | FAQ | 6 questions | details/summary accordion |
| 10 | — | CTA | "Play 5-Letter Wordle" + "Today's Strands" | Gradient banner + 2 buttons |

**Target**: ~1400 words. **JsonLd**: breadcrumb + faqPage.

---

### PAGE 7: `/connections-hint-today`

**Goal**: Primary traffic page for Connections game.
**Data Source**: `data/connections/puzzles.json` (new — requires update script).

**Sections**:

| # | Tag | Section Title | Content | Design Element |
|---|-----|--------------|---------|----------------|
| 1 | header | Today's NYT Connections Hints — {date} | Title + puzzle # + subtitle | Purple gradient, Grid3x3 icon |
| 2 | — | 3-col highlight cards | Progressive Hints / Full Answer / Difficulty | 3 icon cards (purple/green/amber) |
| 3 | h2 | Progressive Hints | 4 groups, each with tiered hints (category name hint → one word → all words) | 4 color-coded expandable cards (yellow/green/blue/purple) |
| 4 | h2 | Today's Full Answer | Spoiler toggle → reveal all 4 groups | Spoiler card with toggle button |
| 5 | h2 | Difficulty Analysis | Rate each group's difficulty, overall rating | 4 colored difficulty bars + overall score card |
| 6 | h2 | How Connections Works | Brief rules for new visitors | 3 icon cards |
| 7 | h2 | Strategy Tips for Today | 6 tips relevant to today's puzzle | 2×3 card grid |
| 8 | h2 | FAQ | 8 questions | details/summary accordion |
| 9 | h2 | Recent Puzzles | Latest 6 puzzles | 3-col card grid |
| 10 | — | CTA | "Browse Archive" + "Play Strands" | Gradient banner + 2 buttons |
| 11 | sidebar | Recent Puzzles + Strands cross-promo | Links list | Sticky sidebar |

**Target**: ~1200 words. **JsonLd**: breadcrumb + faqPage.

---

### PAGE 8: `/connections-hint` + `/connections-hint/[date]`

**Goal**: Archive for long-tail SEO on dated queries.
**Data Source**: `data/connections/puzzles.json`.

#### Archive List `/connections-hint`

| # | Content | Design |
|---|---------|--------|
| 1 | Purple gradient header | Title + description |
| 2 | Tag cloud navigation | 6 pill links |
| 3 | Monthly sections | `ConnectionsMonthSection` with 3-col puzzle cards |
| 4 | Bottom CTA | 2 buttons |
| 5 | H2: About Connections Archive | 200-word intro paragraph |

#### Date Detail `/connections-hint/[date]`

| # | Tag | Content | Design |
|---|-----|---------|--------|
| 1 | — | Prev / Next navigation | Top + bottom |
| 2 | header | Date + puzzle # + theme | Purple gradient |
| 3 | — | 3-col highlight cards | Hints / Answer / Tips |
| 4 | h2 | Progressive Hints | 4 groups, tiered reveal | Color-coded cards |
| 5 | h2 | Complete Answer | All 4 groups fully revealed | Spoiler toggle |
| 6 | h2 | Category Breakdown | Each group: category name, words, why they connect | Table with colored rows |
| 7 | h2 | Strategy for This Puzzle | 3-4 specific tips | Numbered list cards |
| 8 | h2 | FAQ | 5 dynamically generated questions | Accordion |
| 9 | — | Related Puzzles | 3 nearby puzzle cards | 3-col grid |

**Target**: List ~400 words, Detail ~1200 words. **JsonLd**: breadcrumb + faqPage.

---

### PAGE 9: `/wordle-hint-today`

**Goal**: Capture daily Wordle hint search traffic.
**Data Source**: `data/wordle/puzzles.json` (new — requires update script).

**Sections**:

| # | Tag | Section Title | Content | Design Element |
|---|-----|--------------|---------|----------------|
| 1 | header | Today's Wordle Hints — {date} | Title + Wordle # + subtitle | Emerald gradient, PenTool icon |
| 2 | — | 3-col highlight cards | Letter Count / Hint Level / Answer | Icon cards |
| 3 | h2 | Progressive Hints | 5 levels: # of vowels → starting letter → ending letter → meaning → answer | 5-level expandable card |
| 4 | h2 | Today's Answer | Spoiler toggle → full answer | Spoiler card |
| 5 | h2 | Word Analysis | Definition, etymology, letter breakdown, common usage | Info card + small table |
| 6 | h2 | How Wordle Works | Brief rules | 3 icon cards |
| 7 | h2 | Best Starting Words | Top 10 words | Table: Word / Vowels / Common Letters |
| 8 | h2 | Strategy Tips | 6 tips | 2×3 card grid |
| 9 | h2 | FAQ | 8 questions | Accordion |
| 10 | h2 | Play Wordle Variants | Links to 4-11 letter games | Horizontal scroll cards |
| 11 | sidebar | Recent answers + Strands/Connections cross-promo | Sticky sidebar |
| 12 | — | CTA | "Browse Wordle Archive" + "Wordle Solver" | Gradient banner |

**Target**: ~1300 words. **JsonLd**: breadcrumb + faqPage.

---

### PAGE 10: `/wordle-hint` + `/wordle-hint/[date]`

**Goal**: Wordle archive for dated long-tail SEO.
**Data Source**: `data/wordle/puzzles.json`.

#### Archive List `/wordle-hint`

Same pattern as Connections archive but emerald-themed.
Monthly sections with `WordleMonthSection` + `WordlePuzzleCard`.

#### Date Detail `/wordle-hint/[date]`

| # | Tag | Content | Design |
|---|-----|---------|--------|
| 1 | — | Prev / Next nav | Top + bottom |
| 2 | header | Date + Wordle # | Emerald gradient |
| 3 | — | 3-col highlight cards | Hints / Answer / Analysis |
| 4 | h2 | Progressive Hints | 5-level reveal | Expandable card |
| 5 | h2 | Today's Answer | Full answer reveal | Spoiler toggle |
| 6 | h2 | Word Analysis | Definition, etymology, difficulty rating | Info cards + table |
| 7 | h2 | Letter Breakdown | Which letters, positions, vowel/consonant | Small table |
| 8 | h2 | Strategy Tips | 3-4 specific tips | Numbered cards |
| 9 | h2 | FAQ | 5 questions | Accordion |
| 10 | — | Related Days | 3 nearby puzzle cards | 3-col grid |

**Target**: List ~400 words, Detail ~1000 words. **JsonLd**: breadcrumb + faqPage.

---

## 5. Global Updates

### 5.1 Header Navigation

Replace flat link list with dropdown menus using Radix `DropdownMenu` (already in dependencies).

**Desktop Structure**:

```
Strands ▾           Connections ▾        Wordle ▾          Tools ▾       [Guides] [FAQ]
├ Today's Hints     ├ Today's Hints      ├ Today's Hints   ├ Word Finder
├ Yesterday         ├ Archive            ├ Archive         ├ Anagram Solver
├ Archive           └ How to Play        ├ Wordle Solver   └ Wordle Solver
├ How to Play                            └ Play Wordle
├ Statistics
└ FAQ
```

**Mobile**: Accordion-style groups inside existing MobileMenu.

**Files to modify**:
- `i18n/messages/en.json` → `Header.links` restructure to groups
- `components/header/HeaderLinks.tsx` → dropdown implementation
- `components/header/MobileMenu.tsx` → accordion groups

### 5.2 Footer Links

Update `i18n/messages/en.json` → `Footer.Links.groups`:

```
Group 1 "Strands":      Today / Yesterday / Archive / How to Play / Statistics / FAQ
Group 2 "Connections":   Today / Archive / How to Play
Group 3 "Wordle":        Today / Archive / Solver
Group 4 "Tools":         Word Finder / Anagram Solver / Wordle Solver
Group 5 "Word Games":    4-Letter / 5-Letter / 6-Letter / ... / 11-Letter
Group 6 "Company":       About / Contact / Blog / Guides
Group 7 "Legal":         Privacy Policy / Terms of Service
```

**Files to modify**:
- `i18n/messages/en.json` → `Footer.Links.groups`
- `components/footer/Footer.tsx` → may need layout adjustment for 7 groups (consider 2-row grid on mobile)

### 5.3 Sitemap

Update `app/sitemap.ts` to add all new routes:

| Route | changeFrequency | priority |
|-------|----------------|----------|
| `/strands-hint-yesterday` | daily | 0.8 |
| `/strands-statistics` | weekly | 0.6 |
| `/how-to-play-connections` | monthly | 0.5 |
| `/word-finder` | monthly | 0.7 |
| `/anagram-solver` | monthly | 0.7 |
| `/wordle-solver` | monthly | 0.7 |
| `/connections-hint-today` | daily | 0.9 |
| `/connections-hint` | daily | 0.8 |
| `/connections-hint/{date}` (all dates) | monthly | 0.6 |
| `/wordle-hint-today` | daily | 0.9 |
| `/wordle-hint` | daily | 0.8 |
| `/wordle-hint/{date}` (all dates) | monthly | 0.6 |

### 5.4 Internal Linking

Every new page must include cross-links:
- Strands pages → link to Connections and Wordle equivalents
- Tool pages → link to game pages and hint pages
- Hint pages → link to tool pages and how-to-play
- Home page → add sections for Connections and Wordle (new card grids)

### 5.5 Home Page Updates

Add to `components/home/index.tsx`:
- **New section**: "NYT Connections" card (below existing Strands preview) with today's Connections puzzle teaser + CTA
- **New section**: "Wordle Hints" card with today's Wordle teaser + CTA
- **New section**: "Word Tools" grid (Word Finder / Anagram Solver / Wordle Solver) — 3-col cards
- Update existing "Word Games" section to also mention Connections
- Update SEO article section to cover all 3 games

---

## 6. Data Layer

### 6.1 New Data Files

| File | Structure | Source |
|------|-----------|--------|
| `data/connections/puzzles.json` | `ConnectionsPuzzle[]` | Script fetches from NYT |
| `data/wordle/puzzles.json` | `WordlePuzzle[]` | Script fetches from NYT |

### 6.2 New Types

**`types/connections.ts`**:
```ts
export type ConnectionsGroup = {
  level: number;        // 0=yellow, 1=green, 2=blue, 3=purple
  groupName: string;    // category name
  members: string[];    // 4 words
};

export type ConnectionsPuzzle = {
  id: number;
  printDate: string;    // YYYY-MM-DD
  groups: ConnectionsGroup[];
};
```

**`types/wordle-hint.ts`**:
```ts
export type WordlePuzzle = {
  id: number;
  printDate: string;    // YYYY-MM-DD
  answer: string;       // 5-letter answer
  // Optional enrichment computed at build:
  vowelCount?: number;
  uniqueLetters?: number;
};
```

### 6.3 New Scripts

| Script | Purpose | Schedule |
|--------|---------|----------|
| `scripts/update-connections.mjs` | Fetch latest Connections puzzles → write to `data/connections/puzzles.json` | Daily (same cron as strands) |
| `scripts/update-wordle.mjs` | Fetch latest Wordle answer → append to `data/wordle/puzzles.json` | Daily |

### 6.4 Statistics Computation

Create `lib/strands-stats.ts`:
- `computeStrandsStats(puzzles: StrandsPuzzle[])` → returns all aggregate metrics
- Called at build time in the statistics page, result passed as props
- Pure function, no side effects, fully typed return object

---

## 7. New Components

### 7.1 Connections Components (`components/connections/`)

| Component | Type | Purpose |
|-----------|------|---------|
| `ConnectionsHintCard.tsx` | Client | Progressive hint reveal for one group (tiered: category hint → one word → all words) |
| `ConnectionsAnswerReveal.tsx` | Client | Spoiler toggle → show all 4 groups |
| `ConnectionsGrid.tsx` | Server | 4×4 word grid with color-coded groups |
| `ConnectionsPuzzleCard.tsx` | Server | Card for archive list (puzzle #, date, difficulty teaser) |
| `ConnectionsMonthSection.tsx` | Client | Collapsible month section (same pattern as `StrandsMonthSection`) |

### 7.2 Wordle Hint Components (`components/wordle-hints/`)

Separate from existing `components/wordle/` (which is the playable game).

| Component | Type | Purpose |
|-----------|------|---------|
| `WordleHintCard.tsx` | Client | 5-level progressive hint reveal |
| `WordleAnswerReveal.tsx` | Client | Spoiler toggle → show answer |
| `WordlePuzzleCard.tsx` | Server | Card for archive list |
| `WordleMonthSection.tsx` | Client | Collapsible month section |

### 7.3 Tool Components (`components/tools/`)

| Component | Type | Purpose |
|-----------|------|---------|
| `WordFinderTool.tsx` | Client | Input fields + filter logic + results display |
| `AnagramSolverTool.tsx` | Client | Letter input + permutation/lookup + results by length |
| `WordleSolverTool.tsx` | Client | 5-cell Wordle-style input with color toggles + suggestion engine |

### 7.4 Chart Components (`components/charts/`)

Pure CSS/Tailwind — **no external chart libraries**.

| Component | Type | Purpose |
|-----------|------|---------|
| `BarChart.tsx` | Server | Horizontal/vertical bar chart via div widths |
| `HeatMap.tsx` | Server | Grid of cells with color intensity based on value |
| `StatCard.tsx` | Server | Large number + label + optional trend indicator |

---

## 8. Implementation Phases & TodoList

### Phase 1 — No External Data Needed (use existing data / static content)

- [ ] **PAGE: `/strands-hint-yesterday`**
  - [ ] Create `app/[locale]/strands-hint-yesterday/page.tsx`
  - [ ] Add logic to pick yesterday's puzzle from `puzzles.json` (ET timezone)
  - [ ] Build page content with all sections per spec (Overview, Spangram, Theme Words, Grid, Breakdown table, Theme Analysis, Strategy Takeaways, FAQ, CTA)
  - [ ] Add i18n namespace `StrandsYesterday` to `en.json`
  - [ ] Add `generateMetadata()` with title, description, canonical, openGraph
  - [ ] Add JsonLd (breadcrumb + faqPage)
  - [ ] Verify 1000+ word count
  - [ ] Verify internal links (→ today, → archive, → statistics)

- [ ] **PAGE: `/strands-statistics`**
  - [ ] Create `lib/strands-stats.ts` with `computeStrandsStats()` function
  - [ ] Create `components/charts/BarChart.tsx` (CSS horizontal bars)
  - [ ] Create `components/charts/HeatMap.tsx` (CSS grid with color intensity)
  - [ ] Create `components/charts/StatCard.tsx` (big number + label)
  - [ ] Create `app/[locale]/strands-statistics/page.tsx`
  - [ ] Build all sections per spec (At a Glance, Puzzles Over Time, Word Length Distribution, Spangram Stats, Letter Heatmap, Theme Words Per Puzzle, Notable Records, Monthly Trends, FAQ)
  - [ ] Add i18n namespace `StrandsStatistics` to `en.json`
  - [ ] Add `generateMetadata()` + JsonLd
  - [ ] Verify 1200+ word count

- [ ] **PAGE: `/how-to-play-connections`**
  - [ ] Create `app/[locale]/how-to-play-connections/page.tsx`
  - [ ] Build all sections per spec (What is Connections, Rules, Difficulty Levels, Step-by-Step, Common Traps, Strategies, Connections vs Strands table, FAQ, CTA)
  - [ ] Add i18n namespace `HowToPlayConnections` to `en.json`
  - [ ] Add `generateMetadata()` + JsonLd (breadcrumb + howTo + faqPage)
  - [ ] Verify 1300+ word count

- [ ] **GLOBAL: Phase 1 updates**
  - [ ] Update `app/sitemap.ts` — add 3 new routes
  - [ ] Update `i18n/messages/en.json` — Header links (add Strands > Yesterday, Strands > Statistics)
  - [ ] Update `i18n/messages/en.json` — Footer links (add Yesterday, Statistics, How to Play Connections)
  - [ ] Update `components/header/HeaderLinks.tsx` — add new links
  - [ ] Update `components/header/MobileMenu.tsx` — add new links
  - [ ] Update `components/footer/Footer.tsx` — add new links
  - [ ] Test all pages render correctly (`pnpm dev`)
  - [ ] Verify no broken links

### Phase 2 — Tool Pages (use existing word lists)

- [ ] **PAGE: `/word-finder`**
  - [ ] Create `components/tools/WordFinderTool.tsx` (client component)
    - [ ] Input: word length selector (4-11)
    - [ ] Input: known letters with position (5 slots)
    - [ ] Input: contains letters (comma-separated)
    - [ ] Input: excludes letters (comma-separated)
    - [ ] Input: starts with / ends with
    - [ ] Filter logic against word list
    - [ ] Results display as pill/tag grid grouped by length
    - [ ] Show result count badge
  - [ ] Create `app/[locale]/word-finder/page.tsx`
  - [ ] Build all SEO content sections per spec (How to Use, Popular Patterns table, Letter Frequency chart, Prefixes & Suffixes tables, Tips, FAQ, CTA)
  - [ ] Add i18n namespace `WordFinder` to `en.json`
  - [ ] Add `generateMetadata()` + JsonLd
  - [ ] Verify 1500+ word count (excl. tool UI)

- [ ] **PAGE: `/anagram-solver`**
  - [ ] Create `components/tools/AnagramSolverTool.tsx` (client component)
    - [ ] Input: letter string
    - [ ] Algorithm: find all valid words from input letters (subset permutations)
    - [ ] Results: grouped by word length in tabs
    - [ ] Show total count
  - [ ] Create `app/[locale]/anagram-solver/page.tsx`
  - [ ] Build all SEO content sections per spec (What is an Anagram, How to Solve, Patterns table, Anagrams in Games, Fun Facts, FAQ, CTA)
  - [ ] Add i18n namespace `AnagramSolver` to `en.json`
  - [ ] Add `generateMetadata()` + JsonLd
  - [ ] Verify 1200+ word count

- [ ] **PAGE: `/wordle-solver`**
  - [ ] Create `components/tools/WordleSolverTool.tsx` (client component)
    - [ ] 5-cell input mimicking Wordle row
    - [ ] Each cell: letter input + color toggle (green/yellow/gray)
    - [ ] Filter algorithm: green = exact position, yellow = contains but not here, gray = absent
    - [ ] Rank suggestions by letter frequency score
    - [ ] Display top 20 suggestions in table (Word / Remaining / Unique Letters)
  - [ ] Create `app/[locale]/wordle-solver/page.tsx`
  - [ ] Build all SEO content sections per spec (How It Works, Strategy, Top 20 Starting Words table, Letter Frequency chart, Common Patterns table, FAQ, CTA)
  - [ ] Add i18n namespace `WordleSolver` to `en.json`
  - [ ] Add `generateMetadata()` + JsonLd
  - [ ] Verify 1400+ word count

- [ ] **GLOBAL: Phase 2 updates**
  - [ ] Update `app/sitemap.ts` — add 3 tool routes
  - [ ] Update `i18n/messages/en.json` — Header (add Tools dropdown group)
  - [ ] Update `i18n/messages/en.json` — Footer (add Tools group)
  - [ ] Implement Header dropdown menus (Radix DropdownMenu)
    - [ ] Create `components/header/NavDropdown.tsx` reusable dropdown component
    - [ ] Refactor `HeaderLinks.tsx` to use dropdown groups
    - [ ] Update `MobileMenu.tsx` with accordion groups
  - [ ] Update Footer layout for new group structure
  - [ ] Test all tool pages render and function correctly
  - [ ] Test tool interactivity (input → results)

### Phase 3 — Connections Pages (needs new data source)

- [ ] **DATA: Connections**
  - [ ] Create `types/connections.ts` with `ConnectionsPuzzle` and `ConnectionsGroup` types
  - [ ] Create `scripts/update-connections.mjs` to fetch NYT Connections data
  - [ ] Run script to populate `data/connections/puzzles.json`
  - [ ] Verify data structure matches type definition

- [ ] **COMPONENTS: Connections**
  - [ ] Create `components/connections/ConnectionsHintCard.tsx`
  - [ ] Create `components/connections/ConnectionsAnswerReveal.tsx`
  - [ ] Create `components/connections/ConnectionsGrid.tsx`
  - [ ] Create `components/connections/ConnectionsPuzzleCard.tsx`
  - [ ] Create `components/connections/ConnectionsMonthSection.tsx`

- [ ] **PAGE: `/connections-hint-today`**
  - [ ] Create `app/[locale]/connections-hint-today/page.tsx`
  - [ ] Build all sections per spec (Header, 3-col cards, Progressive Hints for 4 groups, Full Answer, Difficulty Analysis, How It Works, Strategy Tips, FAQ, Recent Puzzles, CTA, Sidebar)
  - [ ] Add i18n namespace `ConnectionsHintToday` to `en.json`
  - [ ] Add `generateMetadata()` + JsonLd
  - [ ] Verify 1200+ word count

- [ ] **PAGE: `/connections-hint` (archive list)**
  - [ ] Create `app/[locale]/connections-hint/page.tsx`
  - [ ] Monthly sections with `ConnectionsMonthSection`
  - [ ] Tag cloud navigation
  - [ ] Add i18n namespace `ConnectionsHintArchive` to `en.json`
  - [ ] Add `generateMetadata()` + JsonLd

- [ ] **PAGE: `/connections-hint/[date]` (date detail)**
  - [ ] Create `app/[locale]/connections-hint/[date]/page.tsx`
  - [ ] Build all sections per spec (Prev/Next, Header, Hints, Answer, Category Breakdown table, Strategy, FAQ, Related Puzzles)
  - [ ] `generateStaticParams()` for recent 60 dates
  - [ ] Add i18n namespace `ConnectionsHintDate` to `en.json`
  - [ ] Add `generateMetadata()` + JsonLd
  - [ ] Verify 1200+ word count per detail page

- [ ] **GLOBAL: Phase 3 updates**
  - [ ] Update `app/sitemap.ts` — add Connections routes (today + archive + all dates)
  - [ ] Update Header — add Connections dropdown group
  - [ ] Update Footer — add Connections link group
  - [ ] Update Home page — add Connections preview section
  - [ ] Add `update:connections` script to `package.json`

### Phase 4 — Wordle Hint Pages (needs new data source)

- [ ] **DATA: Wordle**
  - [ ] Create `types/wordle-hint.ts` with `WordlePuzzle` type
  - [ ] Create `scripts/update-wordle.mjs` to fetch Wordle answer data
  - [ ] Run script to populate `data/wordle/puzzles.json`
  - [ ] Verify data structure matches type definition

- [ ] **COMPONENTS: Wordle Hints**
  - [ ] Create `components/wordle-hints/WordleHintCard.tsx`
  - [ ] Create `components/wordle-hints/WordleAnswerReveal.tsx`
  - [ ] Create `components/wordle-hints/WordlePuzzleCard.tsx`
  - [ ] Create `components/wordle-hints/WordleMonthSection.tsx`

- [ ] **PAGE: `/wordle-hint-today`**
  - [ ] Create `app/[locale]/wordle-hint-today/page.tsx`
  - [ ] Build all sections per spec (Header, 3-col cards, Progressive Hints, Answer, Word Analysis, How Wordle Works, Best Starting Words table, Strategy Tips, FAQ, Play Variants, Sidebar, CTA)
  - [ ] Add i18n namespace `WordleHintToday` to `en.json`
  - [ ] Add `generateMetadata()` + JsonLd
  - [ ] Verify 1300+ word count

- [ ] **PAGE: `/wordle-hint` (archive list)**
  - [ ] Create `app/[locale]/wordle-hint/page.tsx`
  - [ ] Monthly sections with `WordleMonthSection`
  - [ ] Add i18n namespace `WordleHintArchive` to `en.json`
  - [ ] Add `generateMetadata()` + JsonLd

- [ ] **PAGE: `/wordle-hint/[date]` (date detail)**
  - [ ] Create `app/[locale]/wordle-hint/[date]/page.tsx`
  - [ ] Build all sections per spec (Prev/Next, Header, Hints, Answer, Word Analysis, Letter Breakdown table, Strategy, FAQ, Related Days)
  - [ ] `generateStaticParams()` for recent 60 dates
  - [ ] Add i18n namespace `WordleHintDate` to `en.json`
  - [ ] Add `generateMetadata()` + JsonLd
  - [ ] Verify 1000+ word count per detail page

- [ ] **GLOBAL: Phase 4 updates**
  - [ ] Update `app/sitemap.ts` — add Wordle routes (today + archive + all dates)
  - [ ] Update Header — add Wordle dropdown group
  - [ ] Update Footer — add Wordle link group
  - [ ] Update Home page — add Wordle Hints preview section + Word Tools section
  - [ ] Add `update:wordle` script to `package.json`

### Phase 5 — Final Polish

- [ ] **Cross-linking audit**
  - [ ] Every page links to at least 3 other internal pages
  - [ ] Home page links to all major sections
  - [ ] Tool pages cross-link to each other
  - [ ] Hint pages cross-link across games

- [ ] **SEO audit**
  - [ ] All pages have unique title + description
  - [ ] All pages have canonical URLs
  - [ ] All pages have openGraph + twitter metadata
  - [ ] All pages have appropriate JsonLd schemas
  - [ ] Sitemap includes all new URLs with correct priorities
  - [ ] No orphan pages (every page reachable from navigation)

- [ ] **Responsive check**
  - [ ] All pages render correctly on mobile (375px)
  - [ ] All pages render correctly on tablet (768px)
  - [ ] All pages render correctly on desktop (1280px)
  - [ ] Dropdown menus work on mobile (accordion fallback)
  - [ ] Tool inputs are usable on mobile

- [ ] **Performance check**
  - [ ] No client-side JS in pages that don't need interactivity
  - [ ] Tool components are lazy-loaded where possible
  - [ ] Statistics page is fully static (computed at build time)
  - [ ] No unnecessary re-renders in interactive components

- [ ] **Home page final update**
  - [ ] Add "NYT Connections" section with today's puzzle teaser
  - [ ] Add "Wordle Hints" section with today's Wordle teaser
  - [ ] Add "Word Tools" section (3-col grid: Word Finder / Anagram Solver / Wordle Solver)
  - [ ] Update long-form SEO article to cover all 3 games + tools
  - [ ] Update FAQ section with Connections and Wordle questions

---

## Summary

| Phase | Pages | New Components | Data Needed |
|-------|-------|---------------|-------------|
| 1 | 3 pages (yesterday, statistics, how-to-play-connections) | 3 chart components | None (existing data + static) |
| 2 | 3 pages (word-finder, anagram-solver, wordle-solver) | 3 tool components + nav dropdown | None (existing word lists) |
| 3 | 3 pages (connections today, archive, date detail) | 5 connections components | New: connections data + script |
| 4 | 3 pages (wordle today, archive, date detail) | 4 wordle-hint components | New: wordle data + script |
| 5 | 0 pages (polish) | 0 | None |
| **Total** | **12 routes (10 unique page types)** | **15 new components** | **2 new data sources** |
