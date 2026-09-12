// Extracts short definitions for five-letter words from WordNet and writes
// data/word-definitions.generated.ts.
//
// Wordle archive pages carried ~227 words of page-specific content each; the
// rest was boilerplate repeated across all 304 of them. A real definition is
// the one thing on those pages that cannot be computed from the puzzle data,
// and it answers what readers actually search for ("what does HOVEL mean").
//
// Sense selection matters more than it looks. WordNet orders senses per part
// of speech, not by overall frequency, so picking "first noun sense" gives
// THICK as "the location of something surrounded by other things" and CRANE as
// "United States writer". cntlist.rev carries the semantic-concordance tag
// counts, which is the closest thing WordNet has to "the meaning people mean".
//
// Source: Princeton WordNet 3.1 (https://wordnet.princeton.edu/). The WordNet
// licence permits redistribution with the copyright notice retained; see
// WORDNET_LICENCE in the generated file.
//
// Usage: node scripts/build-word-definitions.mjs <path-to-wordnet-dict-dir>

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_FILE = path.join(ROOT, 'data', 'word-definitions.generated.ts');

const DICT_DIR = process.argv[2];
if (!DICT_DIR || !fs.existsSync(DICT_DIR)) {
  console.error('Usage: node scripts/build-word-definitions.mjs <wordnet-dict-dir>');
  console.error('Download: https://wordnetcode.princeton.edu/wn3.1.dict.tar.gz');
  process.exit(1);
}

// ss_type digit in a sense key -> part of speech. 5 is an adjective satellite,
// which is still an adjective as far as a reader is concerned.
const SS_TYPE = { 1: 'n', 2: 'v', 3: 'a', 4: 'r', 5: 'a' };

const POS_LABEL = { n: 'noun', v: 'verb', a: 'adjective', r: 'adverb' };

const POS_FILES = {
  n: ['index.noun', 'data.noun'],
  v: ['index.verb', 'data.verb'],
  a: ['index.adj', 'data.adj'],
  r: ['index.adv', 'data.adv'],
};

// Tag counts come from a news-and-literature corpus, so a low count says more
// about that corpus than about the word. Only let it override the part-of-
// speech preference when the evidence is real: THICK as an adjective is tagged
// 25 times, while SLATE as a verb is tagged twice and should stay a noun.
const TAG_COUNT_THRESHOLD = 5;

// noun.person. WordNet's sense order is unreliable for untagged words, and its
// person senses skew to slang and job titles: BUNNY lists "a young waitress in
// a nightclub" ahead of the rabbit. When an untagged noun has a non-person
// sense available, that is the one a puzzle reader wants. Words whose senses
// are all person-ish (BARON, CHUMP, ENVOY, RACER) still resolve normally.
const PERSON_FILE = '18';
const SENSES_SCANNED = 4;

const read = (name) => fs.readFileSync(path.join(DICT_DIR, name), 'latin1').split('\n');

/* ------------------------------------------------------------------ */
/*  data.<pos> -> offset { gloss, lexFile }                            */
/* ------------------------------------------------------------------ */

function readData(file) {
  const byOffset = new Map();

  for (const line of read(file)) {
    if (!line || line.startsWith('  ')) continue;

    const bar = line.indexOf('|');
    if (bar === -1) continue;

    // offset lex_filenum ss_type w_cnt word lex_id ...
    // WordNet keeps the original capitalisation of `word`, which is the one
    // reliable marker of a proper noun: "Crane" the poet vs "crane" the bird.
    const word = line.slice(0, bar).trim().split(/\s+/)[4] || '';

    byOffset.set(line.slice(0, 8), {
      proper: /^[A-Z]/.test(word),
      lexFile: line.slice(9, 11),
      gloss: line.slice(bar + 1).trim(),
    });
  }

  return byOffset;
}

/* ------------------------------------------------------------------ */
/*  index.<pos> -> lemma [offset per sense]                            */
/* ------------------------------------------------------------------ */

function readIndex(file) {
  const byLemma = new Map();

  for (const line of read(file)) {
    if (!line || line.startsWith('  ')) continue;

    const parts = line.trim().split(/\s+/);
    const lemma = parts[0];
    if (!/^[a-z]{5}$/.test(lemma)) continue;

    // lemma pos synset_cnt p_cnt [ptr_symbol...] sense_cnt tagsense_cnt offsets...
    const pointerCount = Number(parts[3]);
    byLemma.set(lemma, parts.slice(4 + pointerCount + 2));
  }

  return byLemma;
}

/* ------------------------------------------------------------------ */
/*  cntlist.rev -> lemma best (pos, senseNumber) by tag count          */
/* ------------------------------------------------------------------ */

function readTagCounts() {
  const best = new Map();

  for (const line of read('cntlist.rev')) {
    if (!line) continue;

    const [senseKey, senseNumber, tagCount] = line.trim().split(/\s+/);
    if (!senseKey || !tagCount) continue;

    const pct = senseKey.indexOf('%');
    const lemma = senseKey.slice(0, pct);
    if (!/^[a-z]{5}$/.test(lemma)) continue;

    const pos = SS_TYPE[senseKey[pct + 1]];
    if (!pos) continue;

    const count = Number(tagCount);
    const current = best.get(lemma);
    if (current && current.count >= count) continue;

    best.set(lemma, { pos, sense: Number(senseNumber), count });
  }

  return best;
}

/* ------------------------------------------------------------------ */
/*  Gloss tidying                                                      */
/* ------------------------------------------------------------------ */

function splitGloss(gloss) {
  const quote = gloss.indexOf('"');
  const definition = (quote === -1 ? gloss : gloss.slice(0, quote)).replace(/;\s*$/, '').trim();

  let example = '';
  if (quote !== -1) {
    const end = gloss.indexOf('"', quote + 1);
    if (end !== -1) example = gloss.slice(quote + 1, end).trim();
  }

  return { definition, example };
}

function tidy(definition) {
  let d = definition.replace(/\s+/g, ' ').trim();

  // WordNet stacks near-synonymous clauses with semicolons; the first clause
  // is the one worth showing on a puzzle page.
  const semi = d.indexOf(';');
  if (semi > 25) d = d.slice(0, semi);

  d = d
    .replace(/\s*\(.*?\)\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/[;,]\s*$/, '')
    .trim();

  // Stripping a leading qualifier such as "(usually informal)" can leave the
  // adverb that followed it stranded at the front: "especially a young rabbit".
  d = d.replace(/^(?:especially|usually|often|typically|generally|chiefly|esp)\s+/i, '');

  if (!d) return '';

  return d.charAt(0).toUpperCase() + d.slice(1);
}

/* ------------------------------------------------------------------ */

const data = {};
const index = {};
for (const [pos, [indexFile, dataFile]] of Object.entries(POS_FILES)) {
  index[pos] = readIndex(indexFile);
  data[pos] = readData(dataFile);
}

const tagCounts = readTagCounts();

/** True when this sense sits in WordNet's noun.person file. */
function isPersonSense(pos, lemma, sense) {
  const offset = index[pos]?.get(lemma)?.[sense - 1];
  return Boolean(offset && data[pos].get(offset)?.lexFile === PERSON_FILE);
}

/** Resolve one (lemma, pos, senseNumber) to a usable entry, or null. */
function resolve(lemma, pos, sense) {
  const offsets = index[pos]?.get(lemma);
  if (!offsets) return null;

  const offset = offsets[sense - 1];
  if (!offset) return null;

  const row = data[pos].get(offset);
  if (!row) return null;
  if (row.proper) return null;

  const { definition, example } = splitGloss(row.gloss);
  const clean = tidy(definition);
  if (!clean || clean.length < 8 || clean.length > 180) return null;

  return {
    pos: POS_LABEL[pos],
    definition: clean,
    example: example && example.length <= 120 ? example : '',
  };
}

const words = new Set([
  ...index.n.keys(),
  ...index.v.keys(),
  ...index.a.keys(),
  ...index.r.keys(),
]);

const entries = new Map();
let fromTagCounts = 0;

for (const lemma of words) {
  const tagged = tagCounts.get(lemma);

  // Preferred: the sense people actually tagged most often in the corpus,
  // but only when it was tagged often enough to mean something.
  if (tagged && tagged.count >= TAG_COUNT_THRESHOLD) {
    const entry = resolve(lemma, tagged.pos, tagged.sense);
    if (entry) {
      entries.set(lemma.toUpperCase(), entry);
      fromTagCounts += 1;
      continue;
    }
  }

  // Fallback for untagged words: first sense, preferring the parts of speech
  // a reader is most likely to have in mind.
  let chosen = null;

  for (const pos of ['n', 'a', 'v', 'r']) {
    const senseCount = index[pos]?.get(lemma)?.length ?? 0;
    if (!senseCount) continue;

    // Prefer the first non-person sense, then fall back to the first usable
    // one so single-sense person words are not dropped.
    for (let sense = 1; sense <= Math.min(senseCount, SENSES_SCANNED); sense += 1) {
      if (pos === 'n' && isPersonSense(pos, lemma, sense)) continue;

      chosen = resolve(lemma, pos, sense);
      if (chosen) break;
    }

    if (!chosen) chosen = resolve(lemma, pos, 1);
    if (chosen) break;
  }

  if (chosen) entries.set(lemma.toUpperCase(), chosen);
}

const sorted = [...entries.entries()].sort(([a], [b]) => a.localeCompare(b));

const out = {};
for (const [word, { pos, definition, example }] of sorted) {
  out[word] = example ? { pos, definition, example } : { pos, definition };
}

const banner = `// AUTO-GENERATED by scripts/build-word-definitions.mjs — do not edit by hand.
// Regenerate: node scripts/build-word-definitions.mjs <wordnet-dict-dir>
// Data: https://wordnetcode.princeton.edu/wn3.1.dict.tar.gz
//
// WordNet 3.1 Copyright 2011 The Trustees of Princeton University.
// Redistributed under the WordNet licence, which permits use and
// redistribution provided this notice is retained.

export const WORDNET_LICENCE =
  'Definitions from Princeton University WordNet 3.1. Copyright 2011 The Trustees of Princeton University.'

export interface WordDefinition {
  pos: string
  definition: string
  example?: string
}

export const WORD_DEFINITIONS: Record<string, WordDefinition> = `;

fs.writeFileSync(OUT_FILE, `${banner}${JSON.stringify(out, null, 0)}\n`, 'utf8');

const bytes = fs.statSync(OUT_FILE).size;
console.log(
  `build-word-definitions: ${sorted.length} five-letter words ` +
    `(${fromTagCounts} from tag counts, ${sorted.length - fromTagCounts} from first sense), ` +
    `${(bytes / 1024).toFixed(0)} KB -> data/word-definitions.generated.ts`
);
