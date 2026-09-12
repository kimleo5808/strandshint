import { WORDLE_GUIDES } from "./guides-wordle";

export type GuideSection = {
  id: string;
  icon: string;
  title: string;
  content: string;
  subsections?: {
    title: string;
    content: string;
    items?: string[];
  }[];
};

export type Guide = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  keywords: string[];
  icon: string;
  readTime: string;
  level: string;
  levelLabel: string;
  sections: GuideSection[];
};

const STRANDS_GUIDES: Guide[] = [
  {
    slug: "beginner-guide",
    title: "Strands Beginner's Guide",
    metaTitle:
      "Strands Beginner's Guide - Learn to Play NYT Strands",
    description:
      "Complete beginner's guide to NYT Strands. Learn the rules, basic strategies, and essential tips to start solving Strands puzzles like a pro.",
    keywords: [
      "strands beginner guide",
      "how to play strands",
      "strands rules",
      "strands for beginners",
      "NYT strands tutorial",
    ],
    icon: "🔰",
    readTime: "10 min read",
    level: "beginner",
    levelLabel: "Beginner Friendly",
    sections: [
      {
        id: "what-is-strands",
        icon: "🎮",
        title: "What Is Strands?",
        content:
          "Strands presents you with a 6×8 grid of letters. Your mission: find all the theme words hidden in the grid by connecting adjacent letters. Each puzzle has a theme clue, several theme words, and a special Spangram that spans the entire board.",
        subsections: [
          {
            title: "Key Features",
            content:
              "Strands is The New York Times' word search puzzle with these key features:",
            items: [
              "Daily Puzzle — One new puzzle every day, just like Wordle or Connections",
              "Theme-Based — Every puzzle has a theme clue that ties all the words together",
              "Spangram — A special word that spans the entire board edge to edge, highlighted in gold",
              "Hint System — Find non-theme words to earn hint tokens that reveal letters on the board",
            ],
          },
        ],
      },
      {
        id: "basic-rules",
        icon: "📏",
        title: "Basic Rules",
        content: "Here are the fundamental rules of NYT Strands:",
        subsections: [
          {
            title: "1. Connect Adjacent Letters",
            content:
              "Form words by connecting letters that are horizontally, vertically, or diagonally adjacent. Each letter can only be used once per word.",
          },
          {
            title: "2. Find Theme Words",
            content:
              "Use the theme clue to figure out what the words have in common. Theme words are highlighted in blue when found correctly.",
          },
          {
            title: "3. Find the Spangram",
            content:
              "The Spangram is a special word that touches two opposite sides of the board. It describes the overall theme and is highlighted in gold when found.",
          },
          {
            title: "4. Earn Hints",
            content:
              "Finding valid non-theme words (at least 4 letters) earns you hint tokens. Every 3 tokens reveals the location of a single letter in a theme word.",
          },
          {
            title: "5. Complete the Board",
            content:
              "The puzzle is solved when you find the Spangram and all theme words. Every letter on the board belongs to one of the answer words.",
          },
        ],
      },
      {
        id: "understanding-the-grid",
        icon: "🔤",
        title: "Understanding the Grid",
        content:
          "The 6×8 grid (6 columns, 8 rows) contains 48 letters. Every single letter is part of an answer word — there are no leftover letters:",
        subsections: [
          {
            title: "Theme Words (Blue)",
            content:
              "These are the main answer words. They relate to the puzzle's theme as described by the clue. There are typically 6-8 theme words per puzzle.",
          },
          {
            title: "Spangram (Gold)",
            content:
              "One special word that spans from one side of the board to the other (left-to-right, top-to-bottom, or diagonally). The Spangram encapsulates the overall theme of the puzzle.",
          },
          {
            title: "No Wasted Letters",
            content:
              "Unlike a traditional word search, every letter on the board is used in exactly one answer word. This means once you find all theme words and the Spangram, the entire grid is covered.",
          },
        ],
      },
      {
        id: "first-steps",
        icon: "👣",
        title: "Your First Steps Strategy",
        content: "Follow these steps when approaching a new Strands puzzle:",
        subsections: [
          {
            title: "1. Read the Theme Clue Carefully",
            content:
              "The clue at the top of the puzzle tells you the theme. Think about what words could relate to it. Sometimes the clue is straightforward (\"Fruits\"), sometimes it's a pun or wordplay.",
          },
          {
            title: "2. Look for the Spangram First",
            content:
              "The Spangram spans the entire board and describes the theme. If you can find it early, it confirms the theme and makes finding other words easier. Look for long words that stretch edge to edge.",
          },
          {
            title: "3. Scan for Obvious Words",
            content:
              "Look for any words that clearly relate to the theme. Start from corners and edges, as words often begin or end near the board edges.",
          },
          {
            title: "4. Use Non-Theme Words Strategically",
            content:
              "If you're stuck, find any valid 4+ letter words (even if they're not theme words) to earn hint tokens. Three tokens reveal a letter in a theme word.",
          },
          {
            title: "5. Work Systematically",
            content:
              "Once you find a few theme words, notice which letters are left uncovered. The remaining letters must form the remaining theme words, narrowing your search.",
          },
        ],
      },
      {
        id: "beginner-strategies",
        icon: "🎯",
        title: "Essential Beginner Strategies",
        content:
          "Master these core strategies to improve your Strands game:",
        subsections: [
          {
            title: "Theme Clue Analysis",
            content:
              "Spend time thinking about the clue before scanning the grid. If the clue is \"On a roll\", the words might be types of rolls (bread roll, drum roll, egg roll) or things that roll. Understanding the theme narrows your search dramatically.",
          },
          {
            title: "Edge-to-Edge Scanning",
            content:
              "The Spangram must touch two opposite sides of the board. Trace paths from one edge to the opposite edge looking for meaningful words. This is the most efficient way to find the Spangram.",
          },
          {
            title: "Letter Frequency Awareness",
            content:
              "Notice which letters appear most often and where clusters form. Common letter combinations (TH, ING, TION) can help you spot word fragments.",
          },
          {
            title: "Process of Elimination",
            content:
              "As you find words, the remaining uncovered letters become easier to work with. Every letter belongs to exactly one answer, so found words eliminate letters from consideration.",
          },
          {
            title: "Earn Hints When Stuck",
            content:
              "Don't be afraid to find non-theme words to earn hint tokens. Three tokens reveal a letter in a theme word, which can break a deadlock.",
          },
          {
            title: "Take Breaks",
            content:
              "If you're stuck, step away for a few minutes. Fresh eyes often spot words and patterns that escaped you during intense focus.",
          },
        ],
      },
      {
        id: "common-beginner-mistakes",
        icon: "❌",
        title: "Common Beginner Mistakes to Avoid",
        content: "Watch out for these typical beginner errors:",
        subsections: [
          {
            title: "Ignoring the Theme Clue",
            content:
              "Jumping straight into word-hunting without thinking about the clue. The theme clue is your most powerful tool — it tells you what kinds of words to look for. Always start there.",
          },
          {
            title: "Looking for Words in Straight Lines Only",
            content:
              "Unlike traditional word searches, Strands words can twist and turn in any direction. Words follow paths of adjacent letters, changing direction at every step. Think of it like a snake, not a line.",
          },
          {
            title: "Forgetting About the Spangram",
            content:
              "Some beginners ignore the Spangram and focus only on theme words. The Spangram is the key to the puzzle — it spans edge to edge and confirms the theme. Finding it early gives you a huge advantage.",
          },
          {
            title: "Not Using Hint Tokens",
            content:
              "Struggling for ages without earning hints. Finding non-theme words to earn tokens is a legitimate strategy built into the game. Use it when you're stuck instead of staring at the grid.",
          },
        ],
      },
    ],
  },
  {
    slug: "strategy-tips",
    title: "NYT Strands Strategy Tips",
    metaTitle: "Strands Strategy Tips - Master NYT Strands Puzzles",
    description:
      "Master NYT Strands with proven strategies and expert tips. Learn the best approaches to find theme words, locate the Spangram, and improve your daily solve rate.",
    keywords: [
      "strands strategy",
      "strands tips",
      "NYT strands guide",
      "strands solving techniques",
      "puzzle strategies",
    ],
    icon: "🎯",
    readTime: "8 min read",
    level: "intermediate",
    levelLabel: "Expert Level",
    sections: [
      {
        id: "theme-clue-strategy",
        icon: "🔍",
        title: "The Theme Clue Strategy",
        content:
          "The theme clue is your most powerful tool. Learning to decode it effectively is the single biggest improvement you can make.",
        subsections: [
          {
            title: "Literal vs. Wordplay Clues",
            content:
              "Clues can be straightforward ('Fruits') or involve wordplay ('On a roll'). When a clue seems too simple, consider puns, double meanings, or idiomatic expressions. 'On a roll' could mean types of rolls (bread, drum, egg) rather than things that roll.",
          },
          {
            title: "Brainstorm Before Scanning",
            content:
              "Before looking at the grid, spend 30 seconds brainstorming words that fit the theme. This primes your brain to spot relevant words faster:",
            items: [
              "Write down 5-10 words that relate to the clue",
              "Consider different interpretations of the clue",
              "Think about both common and uncommon words in the theme",
              "Consider compound words and phrases related to the theme",
            ],
          },
        ],
      },
      {
        id: "spangram-strategy",
        icon: "⭐",
        title: "Finding the Spangram",
        content:
          "The Spangram is the key to unlocking the puzzle. It spans edge to edge and encapsulates the theme:",
        subsections: [
          {
            title: "Edge-to-Edge Tracing",
            content:
              "The Spangram must connect two opposite edges of the board (left-right, top-bottom, or corner-to-corner). Start at one edge and trace possible word paths to the opposite edge. Focus on paths that form meaningful words related to the theme.",
          },
          {
            title: "Length Estimation",
            content:
              "Spangrams are typically 7-12 letters long. On a 6×8 grid, the shortest edge-to-edge path is 6 letters (straight across), but most Spangrams wind through the grid. Estimate the length based on the theme — 'PHOTOGRAPHY' is 11 letters, 'BAKING' is only 6.",
          },
          {
            title: "Theme Word Confirmation",
            content:
              "The Spangram often IS the theme category. If the theme words are types of bread, the Spangram might be 'BAKERY' or 'BREADBASKET'. Think about what single word or phrase could describe all the theme words.",
          },
        ],
      },
      {
        id: "grid-scanning",
        icon: "🧩",
        title: "Grid Scanning Techniques",
        content:
          "Efficient grid scanning helps you find words faster:",
        subsections: [
          {
            title: "Corner-First Approach",
            content: "Start scanning from the four corners of the grid. Words often begin or end at edges, and corner letters have fewer adjacency options, making them easier to trace:",
            items: [
              "Corner letters connect to only 3 other letters",
              "Edge letters connect to 5 other letters",
              "Interior letters connect to 8 other letters",
              "Fewer connections mean fewer possible word paths to check",
            ],
          },
          {
            title: "Common Prefix Scanning",
            content:
              "Scan for common word beginnings (UN-, RE-, PRE-, OUT-) and endings (-ING, -TION, -ED, -ER). When you spot a familiar prefix or suffix, trace outward to see if it forms a complete theme word.",
          },
          {
            title: "Cluster Analysis",
            content:
              "Look for clusters of consonants or vowels. English words alternate between consonants and vowels, so a cluster of consonants often marks a word boundary. This helps you mentally segment the grid into potential word regions.",
          },
        ],
      },
      {
        id: "hint-token-strategy",
        icon: "💡",
        title: "Strategic Hint Token Usage",
        content:
          "Hint tokens are a built-in help system — use them wisely:",
        subsections: [
          {
            title: "When to Earn Hints",
            content:
              "Don't wait until you're completely stuck. If you've found 3-4 theme words and can't spot the next one, start earning tokens. Finding three non-theme words (4+ letters each) reveals one letter of a theme word.",
          },
          {
            title: "Non-Theme Word Hunting",
            content:
              "Look for common short words (4-5 letters) in uncovered areas of the grid. Words like THEM, THIS, THAT, WHEN, WHAT are often findable and earn you tokens quickly.",
          },
          {
            title: "Revealed Letter Analysis",
            content:
              "When a hint reveals a letter, use it strategically. The revealed letter shows both the position AND the letter. Trace paths from that letter to find the complete theme word it belongs to.",
          },
        ],
      },
      {
        id: "elimination-method",
        icon: "❌",
        title: "Process of Elimination",
        content:
          "As you solve, elimination becomes your most powerful tool:",
        subsections: [
          {
            title: "Track Uncovered Letters",
            content:
              "After finding a word, notice which letters are now covered (used). The remaining uncovered letters must form the remaining answer words. As more words are found, the shrinking pool of uncovered letters makes finding the remaining words easier.",
          },
          {
            title: "Letter Island Analysis",
            content:
              "When most of the board is covered, look for 'islands' of uncovered letters. These isolated groups must form complete words. If you see an island of 5 uncovered letters, the remaining word is exactly 5 letters long.",
          },
          {
            title: "Path Constraint Verification",
            content:
              "Remember that words must follow paths of adjacent letters. If an uncovered island has letters that can't form a connected path spelling a valid word, reconsider whether a previously found word is actually correct.",
          },
        ],
      },
      {
        id: "advanced-tips",
        icon: "🚀",
        title: "Advanced Pro Tips",
        content: "Take your game to the next level with these expert techniques:",
        subsections: [
          {
            title: "Reverse Engineering the Theme",
            content:
              "After finding 2-3 theme words, re-evaluate the theme clue. Sometimes your initial interpretation was wrong. The found words might suggest a different reading of the clue that makes the remaining words easier to spot.",
          },
          {
            title: "Word Length Estimation",
            content:
              "Count the total uncovered letters and divide by the number of remaining words. If 20 letters remain and you need 4 more words, they average 5 letters each. This helps you calibrate what word lengths to look for.",
          },
          {
            title: "Adjacency Pattern Recognition",
            content:
              "Train yourself to quickly spot common letter pairs in the grid: TH, SH, CH, QU, CK, PH. These digraphs often appear in theme words and help you trace word paths faster.",
          },
          {
            title: "Mental Map Building",
            content:
              "Build a mental map of the grid. Note where vowels cluster (potential word centers) and where consonant strings appear (potential word boundaries). This spatial awareness speeds up scanning.",
          },
        ],
      },
    ],
  },
  {
    slug: "common-mistakes",
    title: "Common Strands Mistakes to Avoid",
    metaTitle: "Common Strands Mistakes to Avoid",
    description:
      "Avoid the most common Strands mistakes with this comprehensive guide. Learn from typical errors and strategic blunders that trip up players on the 6×8 grid.",
    keywords: [
      "strands mistakes",
      "strands errors",
      "strands tips",
      "avoid strands traps",
      "strands problem solving",
    ],
    icon: "⚠️",
    readTime: "11 min read",
    level: "intermediate",
    levelLabel: "All Levels",
    sections: [
      {
        id: "theme-clue-mistakes",
        icon: "🧠",
        title: "Theme Clue Mistakes",
        content:
          "These theme interpretation errors lead players astray from the start:",
        subsections: [
          {
            title: "Taking the Clue Too Literally",
            content:
              "Assuming the clue means exactly what it says. Many Strands clues use puns, double meanings, or idioms. 'Breaking news' might mean words that follow 'break' (breakfast, breakdown, breakthrough) rather than journalism terms.",
          },
          {
            title: "Ignoring the Clue Entirely",
            content:
              "Some players skip the clue and just hunt for any words on the grid. This wastes time because you'll find non-theme words that don't contribute to solving the puzzle (though they do earn hint tokens).",
          },
          {
            title: "Locking Into One Interpretation",
            content:
              "Deciding what the clue means and refusing to reconsider. If your first 2-3 found words don't match your interpretation, the clue probably means something different. Stay flexible and re-evaluate the theme as you find words.",
          },
          {
            title: "Overthinking Simple Clues",
            content:
              "Sometimes 'Fruits' really does just mean fruits. Not every clue is a clever pun. If the straightforward interpretation produces words you can find on the grid, trust it.",
          },
        ],
      },
      {
        id: "grid-navigation-errors",
        icon: "🔤",
        title: "Grid Navigation Errors",
        content:
          "These mistakes come from misunderstanding how words work on the grid:",
        subsections: [
          {
            title: "Straight-Line Thinking",
            content:
              "Only looking for words in straight horizontal, vertical, or diagonal lines. Strands words can twist and turn in any direction — they follow paths of adjacent letters, not straight lines. A 6-letter word might change direction 5 times.",
          },
          {
            title: "Reusing Letters in a Single Word",
            content:
              "Trying to use the same letter cell twice in one word. Each letter on the grid can only be used once per word. However, different words CAN share the same letter position — wait, actually they can't. Each letter belongs to exactly one answer word.",
          },
          {
            title: "Missing Diagonal Connections",
            content:
              "Forgetting that diagonal adjacency counts. Letters connect in all 8 directions: up, down, left, right, and all 4 diagonals. This means a letter in the center of the grid connects to 8 surrounding letters.",
          },
          {
            title: "Ignoring the Spangram Path",
            content:
              "Not recognizing that the Spangram must span from one edge to the opposite edge. If a word you found doesn't touch two opposite sides of the board, it's a theme word, not the Spangram.",
          },
        ],
      },
      {
        id: "strategic-errors",
        icon: "⚡",
        title: "Strategic Errors",
        content:
          "Avoid these tactical mistakes that slow down your solving:",
        subsections: [
          {
            title: "Ignoring Hint Tokens",
            content:
              "Stubbornly refusing to earn hints by finding non-theme words. Hint tokens are a designed mechanic, not a penalty. If you're stuck, finding three 4+ letter non-theme words reveals a letter in a theme word. Use this strategically.",
          },
          {
            title: "Not Tracking Found Words",
            content:
              "Losing track of which areas of the grid are already covered by found words. Found words' letters are accounted for — the remaining uncovered letters form the remaining answers. Pay attention to what's left.",
          },
          {
            title: "Random Scanning",
            content:
              "Scanning the grid without a system, jumping from corner to corner randomly. Use a systematic approach: start from one edge and scan methodically, or focus on uncovered letter regions.",
          },
          {
            title: "Giving Up on the Spangram",
            content:
              "Deciding the Spangram is too hard and only focusing on theme words. The Spangram confirms the theme and its letters are part of the solution. Finding it can unlock the rest of the puzzle.",
          },
        ],
      },
      {
        id: "word-finding-failures",
        icon: "🔍",
        title: "Word-Finding Failures",
        content:
          "These mistakes prevent you from spotting words on the grid:",
        subsections: [
          {
            title: "Limited Vocabulary Scope",
            content:
              "Only thinking of common, everyday words. Strands themes can include proper nouns, technical terms, brand names, or uncommon vocabulary. If the theme is 'Pasta', think beyond spaghetti — include penne, rigatoni, farfalle, orecchiette.",
          },
          {
            title: "Not Considering Word Variants",
            content:
              "Looking for singular forms only when the puzzle might use plural forms, or vice versa. Also consider different tenses, gerunds (-ing), and other word forms that might match the theme.",
          },
          {
            title: "Tunnel Vision on One Grid Area",
            content:
              "Staring at one section of the grid for too long. If you can't find a word in one area, move your eyes to a completely different part of the grid. The word you're looking for might be on the opposite side.",
          },
        ],
      },
      {
        id: "prevention-strategies",
        icon: "💪",
        title: "Mistake Prevention Strategies",
        content:
          "Use these proven techniques to avoid common mistakes:",
        subsections: [
          {
            title: "The 3-Interpretation Rule",
            content:
              "For every theme clue, brainstorm at least 3 different interpretations before starting. This prevents locking into a wrong interpretation and ensures you're considering puns, wordplay, and literal meanings.",
          },
          {
            title: "Systematic Grid Coverage",
            content:
              "Scan the grid row by row, then column by column. This ensures you've looked at every letter and every possible adjacency combination. Don't rely on random glancing.",
          },
          {
            title: "The Uncovered Letter Check",
            content:
              "After finding each word, count the remaining uncovered letters. Divide by the number of remaining words to estimate word lengths. If the math doesn't work out (e.g., 7 letters left for 3 words), reconsider your found words.",
          },
          {
            title: "Post-Game Review",
            content:
              "After each puzzle (solved or not), review the answers you missed. Note the theme clue interpretation, the Spangram path, and any words you didn't know. This builds your pattern recognition over time.",
          },
        ],
      },
    ],
  },
  {
    slug: "category-types",
    title: "Complete Guide to Strands Theme Types",
    metaTitle: "Complete Guide to Strands Theme Types",
    description:
      "Complete guide to all Strands theme types and clue patterns. Learn every theme style used in NYT Strands puzzles with examples and solving strategies.",
    keywords: [
      "strands theme types",
      "strands themes",
      "strands patterns",
      "strands examples",
      "NYT strands categories",
    ],
    icon: "📂",
    readTime: "15 min read",
    level: "intermediate",
    levelLabel: "Comprehensive Reference",
    sections: [
      {
        id: "straightforward-themes",
        icon: "🌍",
        title: "Straightforward Themes",
        content:
          "The most common type of theme where the clue directly describes what the words are:",
        subsections: [
          {
            title: "Basic Categories",
            content: "Simple groupings based on a clear classification:",
            items: [
              "Foods — Types of pasta, fruits, desserts, cheeses",
              "Animals — Dog breeds, cat breeds, ocean creatures, birds",
              "Places — Countries, capital cities, US states, landmarks",
              "Objects — Musical instruments, kitchen tools, sports equipment",
            ],
          },
          {
            title: "Professional & Academic",
            content: "Domain-specific vocabulary themes:",
            items: [
              "Medical terms — Body parts, organs, conditions",
              "Music — Genres, instruments, composers, songs",
              "Sports — Types of sports, positions, equipment",
              "Science — Elements, planets, scientific terms",
            ],
          },
          {
            title: "Pop Culture",
            content: "Entertainment and cultural knowledge themes:",
            items: [
              "Movies — Titles, characters, actors, directors",
              "TV Shows — Series names, characters, catchphrases",
              "Music — Song titles, band names, albums",
              "Books — Titles, authors, fictional characters",
            ],
          },
        ],
      },
      {
        id: "wordplay-themes",
        icon: "🎭",
        title: "Wordplay Themes",
        content:
          "These tricky themes involve puns, double meanings, or linguistic patterns:",
        subsections: [
          {
            title: "Pun-Based Clues",
            content: "The clue uses a pun that hints at the word pattern:",
            items: [
              "'Breaking news' — Words containing 'break' (breakfast, breakdown, breakup)",
              "'On a roll' — Types of rolls (bread roll, drum roll, rock and roll)",
              "'It's a wrap' — Things that wrap or contain 'wrap'",
              "'Seeing double' — Words with double letters (coffee, balloon, committee)",
            ],
          },
          {
            title: "Hidden Word Themes",
            content: "Each theme word contains a hidden smaller word:",
            items: [
              "Hidden animals — beCAMEl, enCOWrage, parROTting, carPETing",
              "Hidden colors — emBLUEing, goREDo, taNGO, bROWNie",
              "Hidden numbers — aFOURd, ONErous, tENder, sEIGHTh",
            ],
          },
          {
            title: "Compound Word Themes",
            content: "Words that pair with a common word:",
            items: [
              "Words before 'BOARD' — card, skate, surf, snow",
              "Words after 'SUN' — flower, burn, rise, screen",
              "Words before 'LIGHT' — day, flash, high, spot",
            ],
          },
        ],
      },
      {
        id: "association-themes",
        icon: "🔗",
        title: "Association Themes",
        content:
          "Themes based on looser associations rather than strict categories:",
        subsections: [
          {
            title: "Things Associated With...",
            content: "Items connected by a shared context:",
            items: [
              "Wedding — veil, ring, cake, toast, bouquet, aisle",
              "Beach — sand, wave, shell, towel, umbrella, surf",
              "Camping — tent, fire, marshmallow, trail, lantern",
              "Birthday — cake, candle, present, balloon, party",
            ],
          },
          {
            title: "Actions & Activities",
            content: "Words describing what you can do:",
            items: [
              "Dance moves — waltz, salsa, tango, foxtrot, swing",
              "Cooking methods — bake, fry, grill, roast, steam",
              "Ways to move — sprint, crawl, skip, hop, dash",
            ],
          },
          {
            title: "Descriptive Themes",
            content: "Words that share a quality:",
            items: [
              "Things that are round — ball, globe, wheel, coin, moon",
              "Things that are sharp — knife, needle, pencil, thorn",
              "Things that are sweet — honey, candy, sugar, chocolate",
            ],
          },
        ],
      },
      {
        id: "spangram-patterns",
        icon: "⭐",
        title: "Spangram Patterns",
        content:
          "Understanding common Spangram types helps you find them faster:",
        subsections: [
          {
            title: "Category Label Spangrams",
            content:
              "The most common type — the Spangram names the category. If theme words are types of pasta, the Spangram might be 'ITALIAN FOOD' or 'PASTA SHAPES'. The Spangram tells you what all the theme words have in common.",
          },
          {
            title: "Compound Spangrams",
            content:
              "Sometimes the Spangram is two words forming a phrase. These are longer and span more of the grid. Examples: 'BIRTHDAY PARTY', 'SOLAR SYSTEM', 'BOARD GAMES'. Look for phrases that describe the theme.",
          },
          {
            title: "Single-Word Spangrams",
            content:
              "Shorter Spangrams that are a single descriptive word. These tend to be 6-8 letters. Examples: 'FLOWERS', 'PLANETS', 'DESSERTS'. They're more direct but can be harder to spot because they're shorter paths on the grid.",
          },
        ],
      },
      {
        id: "difficulty-patterns",
        icon: "📊",
        title: "Theme Difficulty Patterns",
        content:
          "Recognizing what makes a theme harder helps you prepare:",
        subsections: [
          {
            title: "Easy Themes",
            content:
              "Literal clues with common vocabulary. The theme words are everyday items most people would recognize. Examples: 'Fruits' (apple, banana, grape), 'Colors' (red, blue, green). These are solvable by most players without hints.",
          },
          {
            title: "Medium Themes",
            content:
              "Slightly ambiguous clues or specialized vocabulary. You might need domain knowledge or to think about the clue more carefully. Examples: 'Suits you' (could mean playing card suits or clothing), 'Jazz' (music genre or related terms).",
          },
          {
            title: "Hard Themes",
            content:
              "Wordplay clues, obscure vocabulary, or abstract themes. These often involve puns, hidden words, or unexpected interpretations. The clue might not make sense until you've found several words and the Spangram.",
          },
          {
            title: "Weekend vs. Weekday",
            content:
              "Weekend puzzles (Saturday and Sunday) tend to be slightly harder than weekday puzzles. If you're solving on a weekend, expect more wordplay, less common vocabulary, and trickier clue interpretations.",
          },
        ],
      },
    ],
  },
  {
    slug: "why-so-hard",
    title: "Why Is Strands So Hard?",
    metaTitle:
      "Why Is Strands So Hard? The Challenge Behind NYT's Word Search Puzzle",
    description:
      "Discover why NYT Strands is so challenging. Learn about the grid mechanics, theme ambiguity, and Spangram difficulty that make Strands a uniquely tricky puzzle.",
    keywords: [
      "strands hard",
      "why strands difficult",
      "strands tricks",
      "NYT strands challenging",
      "word game difficulty",
    ],
    icon: "🤯",
    readTime: "7 min read",
    level: "intermediate",
    levelLabel: "Psychology & Analysis",
    sections: [
      {
        id: "grid-complexity",
        icon: "🔤",
        title: "The Grid Complexity",
        content:
          "The 6×8 grid creates unique challenges that make Strands harder than a typical word search:",
        subsections: [
          {
            title: "48 Letters, Infinite Paths",
            content:
              "With 48 letters and 8-directional adjacency, the number of possible word paths through the grid is astronomically large. Your brain has to evaluate countless letter combinations, creating cognitive overload. Unlike Wordle's 5-letter constraint or Connections' 16-word set, Strands gives you too many possibilities to check systematically.",
          },
          {
            title: "No Straight Lines",
            content:
              "Traditional word searches use straight lines — horizontal, vertical, diagonal. Strands words can twist and turn freely. A 7-letter word might change direction 6 times, snaking through the grid in an unpredictable path. This makes visual scanning much harder.",
          },
          {
            title: "Every Letter Matters",
            content:
              "Every single letter on the board belongs to exactly one answer word. This means there are no 'junk' letters to ignore. You can't narrow your search by identifying irrelevant letters — they're all relevant.",
          },
        ],
      },
      {
        id: "theme-ambiguity",
        icon: "🤹",
        title: "The Theme Ambiguity Problem",
        content:
          "The theme clue is both your biggest help and your biggest source of confusion:",
        subsections: [
          {
            title: "Puns and Double Meanings",
            content:
              "Many clues use wordplay that can be interpreted multiple ways. 'Breaking news' could mean journalism terms, things that break, or words containing 'break'. You might spend significant time pursuing the wrong interpretation before realizing the clue means something else entirely.",
          },
          {
            title: "Vague Clues",
            content:
              "Some clues are intentionally vague to increase difficulty. A clue like 'What's the point?' could refer to pencils, needles, geometric points, scoring points, or the point of something. The vagueness means you can't narrow your word search until you've found a few words.",
          },
          {
            title: "Clue-Answer Disconnect",
            content:
              "Sometimes the connection between the clue and the answer words isn't immediately obvious. You might find a word that seems unrelated to the clue, only to realize later that there's a subtle connection you missed initially.",
          },
        ],
      },
      {
        id: "spangram-difficulty",
        icon: "⭐",
        title: "The Spangram Challenge",
        content:
          "The Spangram is uniquely difficult because of its structural constraints:",
        subsections: [
          {
            title: "Edge-to-Edge Requirement",
            content:
              "The Spangram must touch two opposite sides of the board. This constraint means you need to find a word that not only matches the theme but also physically spans the grid. Many candidate words might fit the theme but not have a valid edge-to-edge path.",
          },
          {
            title: "Length and Complexity",
            content:
              "Spangrams tend to be longer words (7-12 letters), which are harder to trace through a dense grid. The longer the word, the more direction changes it requires, making it harder to spot visually.",
          },
          {
            title: "Theme Encapsulation",
            content:
              "The Spangram must describe the overall theme — it's the 'category name' for the theme words. This requires meta-level thinking: instead of finding individual theme words, you need to identify what they all have in common as a single concept.",
          },
        ],
      },
      {
        id: "cognitive-challenges",
        icon: "🧠",
        title: "Cognitive Challenges",
        content:
          "Your brain faces several simultaneous challenges while solving Strands:",
        subsections: [
          {
            title: "Working Memory Overload",
            content:
              "You're simultaneously tracking: the theme clue interpretation, discovered words, uncovered letter positions, potential word paths, and hint token count. This taxes your working memory far more than simpler puzzles.",
          },
          {
            title: "Visual Scanning Fatigue",
            content:
              "Searching a dense 6×8 grid for twisting word paths is visually exhausting. After several minutes, your eyes start to glaze over and you miss obvious words. This is why taking breaks is so effective.",
          },
          {
            title: "Confirmation Bias",
            content:
              "Once you've decided what the theme means, you only look for words that confirm your interpretation. If your interpretation is wrong, you'll waste time and get frustrated. The fix: after 3 minutes without progress, deliberately reconsider the theme clue.",
          },
          {
            title: "Pattern Completion Urge",
            content:
              "When you've found most theme words, you feel pressured to find the remaining ones quickly. This urgency actually impairs your ability to spot them. Slow down when you're close to finishing — the last word is often the hardest to find.",
          },
        ],
      },
      {
        id: "overcoming-difficulty",
        icon: "💪",
        title: "Overcoming the Difficulty",
        content:
          "Use these strategies to fight back against Strands' designed difficulty:",
        subsections: [
          {
            title: "Multiple Clue Interpretations",
            content:
              "Before starting, brainstorm 3+ interpretations of the theme clue. This prevents anchoring on a wrong interpretation and ensures you're considering puns and wordplay.",
          },
          {
            title: "Systematic Grid Scanning",
            content:
              "Don't randomly scan the grid. Use a system: start at the top-left corner, scan right along each row, then scan down each column. This ensures you've looked at every letter.",
          },
          {
            title: "Strategic Hint Usage",
            content:
              "Hints are not a sign of weakness — they're a designed game mechanic. If you're stuck for more than 3 minutes on a single word, earn some hint tokens. The revealed letters can break your mental block.",
          },
          {
            title: "Fresh Eyes Technique",
            content:
              "Look away from the grid for 30 seconds, then look back. Your brain resets its visual processing, and you'll often immediately spot a word you were blind to moments ago. The puzzle has no timer — use this to your advantage.",
          },
        ],
      },
    ],
  },
  {
    slug: "advanced-techniques",
    title: "Advanced Strands Techniques",
    metaTitle:
      "Advanced Strands Techniques - Expert Strategies for Hard Puzzles",
    description:
      "Master advanced Strands techniques with expert-level strategies, grid analysis methods, and pro tips for consistently solving the hardest NYT Strands puzzles.",
    keywords: [
      "strands advanced techniques",
      "expert strands strategies",
      "hard strands puzzles",
      "strands Spangram tips",
      "strands pro tips",
    ],
    icon: "🎓",
    readTime: "12 min read",
    level: "advanced",
    levelLabel: "Expert / Master",
    sections: [
      {
        id: "grid-analysis",
        icon: "🔬",
        title: "Advanced Grid Analysis",
        content:
          "Expert players analyze the grid structure before hunting for words:",
        subsections: [
          {
            title: "Letter Frequency Mapping",
            content:
              "Before searching for words, note the frequency of each letter on the grid. Common letters (E, A, T, O, I, N, S) appearing frequently suggest common English words. Uncommon letters (Q, X, Z, J) drastically narrow the possible words — focus on those letters first as they have fewer word possibilities.",
          },
          {
            title: "Grid Segmentation",
            content:
              "Mentally divide the 6×8 grid into quadrants or thirds. As you find words, track which areas are covered and which remain open. This segmentation helps you focus your scanning on productive areas rather than re-checking already-solved regions.",
          },
        ],
      },
      {
        id: "spangram-mastery",
        icon: "⭐",
        title: "Spangram Mastery",
        content:
          "Advanced techniques for finding the Spangram quickly and consistently:",
        subsections: [
          {
            title: "Path Topology Analysis",
            content:
              "The Spangram must connect opposite edges. Analyze the grid for viable paths: which edge-to-edge paths contain enough vowels for real words? Which paths avoid impossible letter combinations (like QJ or ZX)? Eliminate impossible paths to focus on likely ones.",
          },
          {
            title: "Theme-to-Spangram Inference",
            content:
              "After finding 2-3 theme words, infer what the Spangram might be. If theme words are PINE, OAK, MAPLE, BIRCH, the Spangram is likely something like 'TREE TYPES' or 'FOREST'. Use the pattern of found words to predict the Spangram's meaning, then search for that specific word on the grid.",
          },
          {
            title: "Bidirectional Search",
            content:
              "Search for the Spangram from both edges simultaneously. Start tracing a promising word from the left edge AND the right edge. If both partial paths lead to the same central region, you've likely found the Spangram path.",
          },
        ],
      },
      {
        id: "pattern-recognition",
        icon: "🗣️",
        title: "Advanced Pattern Recognition",
        content:
          "Deeper grid analysis reveals hidden words faster:",
        subsections: [
          {
            title: "Consonant-Vowel Rhythm",
            content:
              "English words follow a consonant-vowel rhythm. Scan the grid for alternating C-V-C-V patterns (like B-A-K-E or T-I-M-E). These natural rhythms help you 'hear' words visually. Clusters of consonants (RSTL) or vowels (AEIO) usually indicate word boundaries.",
          },
          {
            title: "Common Word Ending Detection",
            content:
              "Scan for common word endings: -ING, -TION, -MENT, -NESS, -ABLE, -ED, -ER, -LY. When you find one, trace backwards to find the full word. This reverse approach is often faster than searching forward from the beginning of words.",
          },
          {
            title: "Adjacency Graph Mental Model",
            content:
              "Think of the grid as a graph where each letter connects to its 3-8 neighbors. Expert players build a mental model of this graph, allowing them to quickly evaluate whether a candidate word has a valid path through the grid. Practice by tracing known words backwards.",
          },
        ],
      },
      {
        id: "elimination-mastery",
        icon: "⚡",
        title: "Systematic Elimination Mastery",
        content:
          "Advanced elimination techniques for when you're down to the last few words:",
        subsections: [
          {
            title: "The Remaining Letter Count",
            content:
              "Count uncovered letters precisely. If 12 letters remain and you need the Spangram + 1 theme word, estimate their lengths (e.g., 8 + 4, or 7 + 5). This narrows your search dramatically.",
          },
          {
            title: "The Connectivity Test",
            content:
              "For remaining uncovered letters, check if they form one or more connected components (groups of adjacent letters). Each connected component must form exactly one answer word. If you see two separate islands of letters, you know exactly which letters belong to which word.",
          },
          {
            title: "The Anagram Check",
            content:
              "When you know which letters form a remaining word, treat it as an anagram puzzle. Mentally rearrange the uncovered letters to form valid words that match the theme. The adjacency constraint limits the actual arrangements, but the anagram step helps you think of candidate words.",
          },
        ],
      },
      {
        id: "speed-solving",
        icon: "⏱️",
        title: "Speed Solving Techniques",
        content:
          "For experienced players looking to solve puzzles faster:",
        subsections: [
          {
            title: "The 30-Second Theme Assessment",
            content:
              "In the first 30 seconds: read the clue, brainstorm 5 possible theme words, and do a quick full-grid scan. If you spot any of your brainstormed words, start there. If not, reconsider the theme interpretation.",
          },
          {
            title: "Spangram-First Strategy",
            content:
              "Advanced players often find the Spangram first. Since it encapsulates the theme, finding it immediately confirms your interpretation and makes all other words easier. Spend the first 1-2 minutes focused exclusively on the Spangram.",
          },
          {
            title: "Peripheral Vision Training",
            content:
              "Train yourself to see words in your peripheral vision. Instead of focusing on individual letters, let your gaze soften and scan larger areas of the grid. Word shapes (tall letters, descenders, common patterns) pop out when you're not focusing too hard.",
          },
        ],
      },
      {
        id: "meta-strategies",
        icon: "🧠",
        title: "Meta-Strategies",
        content:
          "High-level approaches that improve your overall Strands ability:",
        subsections: [
          {
            title: "Daily Practice Routine",
            content:
              "Consistency beats intensity. Solve the daily puzzle every day, even when you need hints. Track your hint usage over time — it should decrease as you get better. Reviewing past puzzles in the archive also builds pattern recognition.",
          },
          {
            title: "Theme Vocabulary Building",
            content:
              "Build your mental database of theme words by reviewing past puzzles. Note which themes appear frequently (foods, animals, places, entertainment) and learn associated vocabulary. The more words you know in common categories, the faster you'll spot them.",
          },
          {
            title: "Post-Solve Analysis",
            content:
              "After each puzzle, review: How quickly did you find the Spangram? Which words took longest? Did you misinterpret the clue? What would you do differently? This reflection accelerates improvement more than just solving more puzzles.",
          },
        ],
      },
    ],
  },
];

export const GUIDES: Guide[] = [...STRANDS_GUIDES, ...WORDLE_GUIDES];

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export const GUIDE_SLUGS = GUIDES.map((g) => g.slug);
