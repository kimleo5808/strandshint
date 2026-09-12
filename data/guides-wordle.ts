import type { Guide } from "./guides";

/**
 * Wordle guides.
 *
 * The guide shelf was Strands-only while the site carried a full Wordle
 * archive, so these cover the two areas nothing else on the site addressed:
 * Hard Mode, and the word families that decide most late-game losses.
 */
export const WORDLE_GUIDES: Guide[] = [
  {
    slug: "wordle-hard-mode",
    title: "Wordle Hard Mode",
    metaTitle: "Wordle Hard Mode Strategy - Rules, Traps and How to Win",
    description:
      "Hard Mode forces every revealed hint into your next guess. The exact rules, which openers survive the constraint, and how to escape the word families that end streaks.",
    keywords: [
      "wordle hard mode",
      "wordle hard mode strategy",
      "wordle hard mode starting word",
      "how to turn on wordle hard mode",
      "wordle hard mode tips",
    ],
    icon: "🔒",
    readTime: "9 min read",
    level: "advanced",
    levelLabel: "Advanced",
    sections: [
      {
        id: "what-hard-mode-does",
        icon: "🔒",
        title: "What Hard Mode Actually Changes",
        content:
          "Hard Mode is a toggle in the Wordle settings menu. Once it is on, the game refuses any guess that ignores what you have already learned. It does not give you fewer guesses and it does not pick harder answers, since the answer list is identical either way. What changes is that your guesses stop being free.",
        subsections: [
          {
            title: "The two rules it enforces",
            content: "Wordle blocks your entry if it breaks either rule:",
            items: [
              "Green letters must stay put. If position 3 is a green A, every later guess needs an A in position 3",
              "Yellow letters must be reused somewhere. If you found a yellow R, every later guess has to contain an R",
            ],
          },
          {
            title: "What it does not enforce",
            content:
              "Two gaps in the rules matter more than most players realise:",
            items: [
              "Gray letters are not blocked. You can re-guess a letter you already eliminated and the game will accept it",
              "A yellow letter only has to appear somewhere, not in a new position. Re-using it in the square where it was already yellow is legal, and it teaches you nothing",
            ],
          },
          {
            title: "You cannot switch it on mid-puzzle",
            content:
              "Hard Mode can be enabled before your first guess of a puzzle, but not once that puzzle is underway. Flip it on halfway through and it applies from the next day.",
          },
        ],
      },
      {
        id: "why-it-is-harder",
        icon: "⚖️",
        title: "Why It Is Harder Than It Looks",
        content:
          "In normal Wordle a guess has one job: remove possibilities. You are free to spend guess 3 on a word you already know is wrong, purely because it tests five fresh letters. That move is a probe, and Hard Mode takes it away from you.",
        subsections: [
          {
            title: "The cost of losing the probe",
            content:
              "Say you know the answer ends in -OUND and nothing else. BOUND, FOUND, HOUND, MOUND, POUND, ROUND, SOUND and WOUND all fit. In normal mode you would guess something that tests several of those leading consonants at once. Hard Mode forbids it, because your guess must itself end in -OUND. You can only test one candidate per turn, and with four guesses against eight candidates you are gambling.",
          },
          {
            title: "It raises your average, not your failure rate",
            content:
              "Hard Mode costs most players a fraction of a guess on average and turns a handful of 4s into 5s and 6s. The damage is concentrated rather than spread out: most puzzles play identically, and then one word-family puzzle takes out a long streak. Plan for that tail, not for the average.",
          },
        ],
      },
      {
        id: "openers",
        icon: "🎯",
        title: "Choosing an Opener for Hard Mode",
        content:
          "Standard opener advice changes here. A word that produces lots of yellows is normally excellent, because it tells you which letters are live. Under Hard Mode every yellow is also a constraint you have to carry, and carrying several vague constraints early is exactly what paints you into a corner.",
        subsections: [
          {
            title: "Prefer openers that resolve green or gray",
            content:
              "Words whose common letters sit in their most common positions give you cleaner information. SLATE, CRANE and CRATE place S, T, E and R near their typical slots, so you tend to get greens, which are cheap to satisfy, or grays, which cost you nothing, rather than a spray of yellows you must drag through every remaining guess.",
          },
          {
            title: "Be careful with vowel-dump openers",
            content:
              "ADIEU and AUDIO are already weak in normal Wordle because they test so few consonants. Under Hard Mode they are worse: a yellow U or I forces that letter into every later guess while telling you almost nothing about where it belongs.",
          },
          {
            title: "Fixed second guesses stop working",
            content:
              "If you normally play a rigid pair, expect the second word to be rejected often. Hard Mode asks you to pick guess 2 from what guess 1 actually revealed, so it is worth practising the choice rather than memorising a pair.",
          },
        ],
      },
      {
        id: "word-families",
        icon: "🕳️",
        title: "The Word Families That End Streaks",
        content:
          "Nearly every Hard Mode loss has the same shape. You lock four letters early and the fifth has many plausible fillers. Learn to recognise these clusters the moment they appear, because the response has to start before you are down to two guesses.",
        subsections: [
          {
            title: "The usual suspects",
            content:
              "These groups are large enough to outlast your remaining guesses:",
            items: [
              "-IGHT: EIGHT, FIGHT, LIGHT, MIGHT, NIGHT, RIGHT, SIGHT, TIGHT",
              "-OUND: BOUND, FOUND, HOUND, MOUND, POUND, ROUND, SOUND, WOUND",
              "-ATCH: BATCH, CATCH, HATCH, LATCH, MATCH, PATCH, WATCH",
              "-ASTE and -ASTY, where the vowel shift hides a second family inside the first",
              "SH- openers such as SHADE, SHAME, SHAPE, SHARE, SHARK, SHARP",
            ],
          },
          {
            title: "Order your attempts by letter frequency",
            content:
              "When you are forced to try candidates one at a time, do not work alphabetically. Lead with the consonants that turn up most often in answers, roughly S, T, R, L, N and C, and leave J, W, V and Z until last. It does not change the worst case, but it moves the odds toward finishing early.",
          },
          {
            title: "Spend a gray letter on purpose",
            content:
              "This is the escape hatch Hard Mode leaves open. Gray letters are not blocked, so a word containing a letter you already eliminated is still legal as long as it satisfies your greens and yellows. When you are stuck in a family, hunt for a legal word that happens to test two or three untried leading consonants at once. You are not trying to guess the answer with it; you are buying information inside the rules.",
          },
        ],
      },
      {
        id: "practical-routine",
        icon: "📋",
        title: "A Routine That Holds Up",
        content:
          "Hard Mode rewards deciding early rather than reacting late. This sequence keeps you out of the positions that lose games.",
        subsections: [
          {
            title: "Five habits worth building",
            content: "Apply these in order on every puzzle:",
            items: [
              "Guess 1: an opener that leans green, such as SLATE or CRANE",
              "Guess 2: chosen fresh from what guess 1 revealed, never memorised",
              "Guess 3: the decision point, where you count how many words still fit before typing",
              "If more than three candidates remain, play for information rather than picking a favourite",
              "Move every yellow letter to a new position, since repeating its old square learns nothing",
            ],
          },
          {
            title: "Count candidates before guess 4",
            content:
              "Most Hard Mode losses are not bad guesses, they are uncounted ones. Before guess 4, actually list the words that still fit. If the list runs past three you are in a family, and you need the information play now rather than after two more misses.",
          },
          {
            title: "Practise on finished puzzles",
            content:
              "Working backwards through past puzzles is the cheapest way to build the instinct, because you get to see how a board that looked safe on guess 3 turned into a four-way guess on guess 5.",
          },
        ],
      },
    ],
  },
  {
    slug: "wordle-endgame",
    title: "Wordle Endgame Tactics",
    metaTitle: "Wordle Endgame - How to Escape a Four-Way Guess",
    description:
      "Most lost Wordles are not hard words, they are boards with four letters locked and too many candidates. How to spot that shape early and break it before guess 6.",
    keywords: [
      "wordle endgame",
      "wordle last guess",
      "wordle stuck",
      "wordle four way guess",
      "wordle elimination strategy",
    ],
    icon: "🎲",
    readTime: "8 min read",
    level: "intermediate",
    levelLabel: "Intermediate",
    sections: [
      {
        id: "the-real-failure-mode",
        icon: "🎲",
        title: "The Real Failure Mode",
        content:
          "Players who lose a Wordle rarely lose because the answer was obscure. They lose from a board that looked excellent on guess 3: four green letters, one blank, and six words that fit. At that point the puzzle has stopped being a word game and become a coin flip with more sides than you have guesses.",
        subsections: [
          {
            title: "Why a strong start can lose",
            content:
              "Getting four greens on guess 2 feels like winning, so the instinct is to keep guessing candidates. But four greens with an open slot is the single worst position in Wordle, because each attempt tests exactly one letter. Two greens and two yellows is a far safer board, since it still leaves room for a guess that tests several letters at once.",
          },
          {
            title: "Recognise it on guess 3, not guess 5",
            content:
              "The window for fixing this closes fast. On guess 3 you have three attempts to spend and can afford one on information. On guess 5 you have one attempt and no choice but to pick. The whole skill is noticing the shape two turns earlier than feels necessary.",
          },
        ],
      },
      {
        id: "count-before-you-type",
        icon: "🔢",
        title: "Count Before You Type",
        content:
          "The habit that separates consistent 3s and 4s from occasional 6s is boring: before each guess from the third onward, list the words that still fit. Not approximately, actually list them.",
        subsections: [
          {
            title: "What the count tells you",
            content: "Your candidate count decides your next move:",
            items: [
              "One candidate: guess it",
              "Two candidates: guess either, the odds are even and there is nothing to gain from cleverness",
              "Three candidates with three guesses left: guess them in frequency order",
              "Four or more: stop guessing candidates and play for information instead",
            ],
          },
          {
            title: "The cutoff is guesses remaining",
            content:
              "The rule is simply whether your candidate count exceeds your remaining guesses. Four candidates with four guesses left is safe. Four candidates with two guesses left is a loss in progress, and it needed fixing a turn ago.",
          },
        ],
      },
      {
        id: "information-guesses",
        icon: "💡",
        title: "How to Build an Information Guess",
        content:
          "An information guess is a word you expect to be wrong, chosen because it separates the candidates you cannot otherwise distinguish. In normal Wordle you have complete freedom to build one, and most players never use it.",
        subsections: [
          {
            title: "Build it from the letters in dispute",
            content:
              "Suppose you are down to FIGHT, LIGHT, MIGHT, NIGHT, RIGHT and SIGHT. The letters in dispute are F, L, M, N, R and S. Do not guess one of the six candidates. Find a legal word packing as many of those disputed letters as possible, such as FILMS, which tests F, L, M and S in a single turn. Whatever comes back, you are almost always left with one answer.",
          },
          {
            title: "Ignore the greens when building it",
            content:
              "This feels wrong and it is correct. Your information word does not need to keep the greens you have already earned, because you are not trying to win with it. Dropping the fixed letters is what frees up all five squares to test disputed ones. This is the one move Hard Mode takes away, and it is the reason Hard Mode is harder.",
          },
          {
            title: "When it is not worth it",
            content:
              "Skip the information guess when the candidate count is at or below your remaining guesses, or when you are on your final attempt. Spending a turn to learn something you have no turns left to use is just forfeiting.",
          },
        ],
      },
      {
        id: "reading-the-board",
        icon: "🔍",
        title: "Reading the Board More Carefully",
        content:
          "Several late-game mistakes come from misreading information already on screen rather than from missing a word.",
        subsections: [
          {
            title: "Details players routinely miss",
            content: "Check each of these before committing a guess:",
            items: [
              "A yellow letter is not just present, it is present and not in that square, which is two facts",
              "Answers repeat letters more often than people expect, so a single yellow E does not rule out a second E",
              "If a letter appears twice in your guess and comes back one yellow and one gray, the answer contains exactly one of it",
              "Gray does not mean the letter is absent from English, only that it is absent from this answer",
            ],
          },
          {
            title: "The double-letter blind spot",
            content:
              "When you are stuck with a plausible-looking blank, ask whether a letter you already have might appear twice. Doubled letters are a common reason a board that should have resolved refuses to.",
          },
        ],
      },
      {
        id: "practice",
        icon: "📈",
        title: "Turning This Into a Habit",
        content:
          "These tactics are simple to describe and easy to forget under time pressure. Building them takes deliberate repetition rather than more puzzles.",
        subsections: [
          {
            title: "Three drills worth doing",
            content: "Each targets a different part of the endgame:",
            items: [
              "Replay finished puzzles from guess 3 and count candidates before looking at what you actually played",
              "Practise writing information words for the common families until FILMS-style answers come quickly",
              "Track which puzzles cost you 5 or 6 guesses and check how many were word families rather than hard words",
            ],
          },
          {
            title: "Use the archive",
            content:
              "Past puzzles are better practice than the daily one, because you can stop and think without a streak riding on it. Working backwards through previous answers builds the pattern recognition faster than a single puzzle a day ever will.",
          },
        ],
      },
    ],
  },
];
