# Content Plan — "NYT Connections Purple Group, Explained"

> Backlinko-style Pillar Guide outline. Hand-off brief for writing + frontend implementation.

## Frontmatter

```
Target keyword:        connections purple group
Secondary keywords:    connections purple explained, how to solve connections purple,
                       connections hardest category, what does purple mean in connections
Search intent:         Informational (with how-to / problem-solving sub-intent)
Difficulty (KD):       Moderate (40–60 est.) — head term has authority sites, but the
                       "explained / how to solve" long-tail is served only by thin pages
Reality check verdict: MODERATE. New domain (low DR) → rank realistically in 3–6 months
                       IF we ship the unique-asset tier below. Pair with cluster (see notes).
Template:              Pillar Guide (definitive explainer + how-to)
Proposed URL slug:     /connections-purple-group
Target word count:     2,600–3,000

Unique asset — 3 tiers:
  Baseline (≈3 days):   Named taxonomy of 7 purple archetypes, each with 1 worked
                        example (4 words → trap → reasoning → reveal). Static FAQ + schema.
  Strong (≈1 week):     + "Purple by the Numbers" data block computed from our 164-puzzle
                        Connections archive (frequency of each archetype). + trap-word checklist.
  Aspirational (≈2 wks):+ Interactive "Spot the Purple Connection" trainer reusing the
                        hint-ladder progressive-reveal infra (pick 4 words → guess type → reveal).
Recommended tier:       STRONG now, upgrade to Aspirational after launch (trainer as v2).

Last-updated strategy:  Quarterly recompute of the data block from the live archive.
```

## Meta

- **Meta title (≤60):** `NYT Connections Purple Group, Explained (+ How to Solve It)` (57)
- **Meta description (≤155):** `Why purple is the hardest Connections category, the 7 wordplay types it uses, and a proven method to crack it — with data from 164 real puzzles.` (147)
- **OG title:** `The NYT Connections Purple Group, Explained`
- **OG description:** `7 purple archetypes, worked examples, and a trap-word checklist to beat the hardest category.`
- **Featured image concept:** A 4×4 Connections grid with the purple row glowing/locked and a magnifier over it, captioned "the hardest four."

## Opening Hook (3-part)

- **Stat/claim:** "Across the 164 Connections puzzles in our archive, the purple group is wrong on a player's first attempt far more often than any other color — because roughly half of all purple groups are wordplay, not meaning." (cite our data block + WordsRated)
- **Promise:** By the end you'll recognize the 7 ways purple tricks you and have a repeatable method to solve it.
- **What You'll Learn (preview bullets):**
  - What the purple group actually is and why it's the hardest
  - The 7 purple "archetypes" with real worked examples
  - A trap-word checklist to spot misdirection
  - The elimination + pattern method to solve purple last
  - What our 164-puzzle dataset reveals about purple

## Body Outline (H1 → H2 → H3)

**H1: NYT Connections Purple Group, Explained**

### H2: What Is the Purple Group in Connections? (≈250 w)
- **Quotable "What is X?" block (<50 w):** define purple = the difficulty-3 category, color-coded hardest, usually wordplay/loose connection. LLM-citable.
- Color hierarchy yellow→green→blue→purple; purple is assigned by the editors as the trickiest connection, not necessarily rarest words.
- 📝 Note callout: color = difficulty, revealed only after you solve.
- Visual: difficulty-ladder diagram (4 colors, 1-line descriptor each).

### H2: Why Purple Is the Hardest Category (≈300 w)
- Three reasons: (1) wordplay over meaning, (2) deliberate red herrings overlapping easier groups, (3) "closeness" — words feel like they belong elsewhere.
- Quotable stat paragraph: "~half of purple groups rely on wordplay rather than semantic category" (WordsRated + our data).
- 💡 Pro tip: if leftover four words seem unrelated by meaning, switch to a *form* trick (sound/spelling), not meaning.

### H2: The 7 Purple Archetypes (with Worked Examples) (≈1,000 w — the backbone)
Each H3 = name + 1-sentence def + 4-word example + the trap + the reveal. (This is the unique asset no competitor has.)
- **H3: Phrase Completion (`___ + WORD` / `WORD + ___`)** — e.g. all become "___ BOARD."
- **H3: Hidden Words** — a smaller word buried in each (body parts, animals, colors).
- **H3: Homophones** — sound like a themed set, spelled differently.
- **H3: Anagrams / Scrambles** — rearrange to a themed word.
- **H3: Add / Drop / Change a Letter** — one edit from a themed word.
- **H3: Words Before or After a Common Word** — all precede/follow the same word.
- **H3: Pop-culture / Niche Specifics** — names, franchises, brand lines.
- Per H3 visual: a 4-chip mini-grid showing the example words.
- E-E-A-T injection: examples drawn from real archived puzzles (cite puzzle # + date).

### H2: Trap-Word Spotting Checklist (≈250 w)
- Operational checklist: short common words (HEAD, COLD, GOLD), words with 2+ meanings, words that fit two groups, proper nouns.
- Featured-snippet-optimized as an ordered list.
- 💡 Pro tip: assume an ambiguous word belongs to the *harder* group; build the easy group without it.

### H2: How to Solve the Purple Group (Step-by-Step) (≈350 w)
- The elimination method: solve yellow/green/blue first, isolate the leftover four.
- Then run the archetype scan: read the four aloud (homophones), look inside them (hidden words), test "+word" (phrase completion).
- The "leftover four" partition check before submitting.
- Internal link to today's puzzle for live practice.

### H2: Purple by the Numbers (our data) (≈250 w) — PENDING EVIDENCE
- Original stat block computed from the 164-puzzle archive: % of purple groups per archetype, most common purple mechanic, hardest month, etc.
- ⚠️ Flag: requires a one-off script over `lib/connections-data` to classify historical purple groups. If full classification is too costly, ship a partial sample (e.g. last 50 puzzles) and label it.
- Chart: bar chart of archetype frequency. This is the citable GEO/LLM asset.

### H2: FAQ (≈300 w) — schema-marked
(see drafts below)

## Closing
- Recap: purple isn't harder vocabulary, it's a different *kind* of thinking — switch from meaning to form.
- Share CTA.
- 2 internal next-step links + 1 soft tool CTA (see link map).

## Internal Link Map

| Anchor text | Target URL | Placement (H2) | Purpose |
|---|---|---|---|
| today's Connections hints | /connections-hint-today | How to Solve Purple | down / fresh-content funnel |
| Connections archive | /connections-hint | What Is the Purple Group | hub |
| How to Solve NYT Connections (full method) | /blog/how-to-solve-connections | Why Purple Is Hardest | lateral |
| how to play Connections | /how-to-play-connections | What Is the Purple Group | lateral |
| browse past purple groups by date | /connections-hint | Purple by the Numbers | hub |

## GEO Signals Applied
- 2+ quotable <50-word paragraphs ("What is the purple group", "why hardest").
- 1 "What is X?" block (H2 #1).
- ≥1 stat+source per 500 words (our data block + WordsRated + Wikipedia for definitions).
- Q&A FAQ section + inline mini-Q&As.
- Author bio hook: "Written by the StrandsHint team — we publish daily hints for every NYT Connections puzzle and maintain a 164-puzzle archive." Last-updated date visible.

## E-E-A-T Injection Points
- Proprietary data: "Across our 164-puzzle Connections archive…" (data block).
- First-party: real worked examples cited to puzzle # + date from the archive.
- Real screenshot: a solved purple row from an archived puzzle.
- Pending evidence: the archetype-frequency stats (generate via classification script).

## FAQ Drafts (schema: FAQPage)

**Q: Why is the purple group the hardest in Connections?**
A: Purple is the difficulty-3 (hardest) category. It's tough because it usually relies on wordplay — hidden words, homophones, phrase completion — rather than a straightforward shared meaning, and the editors plant words that look like they belong to easier groups. About half of purple groups are wordplay-based, so meaning-first thinking often fails.

**Q: Is the purple group always wordplay?**
A: No, but most of the time. Purple frequently uses wordplay (anagrams, hidden words, "___ + word" patterns), yet some purple groups are simply very specific or niche categories. If the four leftover words share no obvious meaning, test a form-based trick — sound, spelling, or hidden words — before assuming it's a category.

**Q: Should I solve the purple group first or last?**
A: Last. The reliable method is to lock yellow, green, and blue first, then let the remaining four words form purple by elimination. Solving the easy groups removes the red herrings that purple borrows, so the hardest group often solves itself once the other twelve are placed.

**Q: What does the purple category usually mean in Connections?**
A: Purple signals the trickiest connection of the four, typically wordplay or a "loose" link. Common purple mechanics include words that complete a phrase, words containing a hidden word, homophones, and anagrams. The color is only revealed after you solve the group correctly.

**Q: How do I get better at solving purple?**
A: Learn the recurring purple archetypes and practice spotting them. Read leftover words aloud for homophones, look inside them for hidden words, and test whether they all precede or follow a common word. Reviewing past puzzles in a Connections archive trains pattern recognition fast.

## Schema JSON-LD stubs
- `Article` (headline, datePublished, dateModified, author=Organization StrandsHint)
- `FAQPage` (the 5 Q&As above)
- `BreadcrumbHome > Connections Hint > Purple Group`

## Next actions
- Implement frontend (workflow: frontend-design) — taxonomy cards, data chart, checklist, FAQ accordion, optional trainer.
- Generate the archetype-frequency dataset (classification pass over the archive).
