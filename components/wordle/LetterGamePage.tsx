import { BASE_URL } from "@/config/site";
import { LETTER_GAMES, LetterGameData } from "@/data/letter-games";
import {
  LetterGameConfig,
  getLetterGameConfig,
  UniqueSection,
} from "@/data/letter-games-config";
import { Link as I18nLink } from "@/i18n/routing";
import { breadcrumbSchema, faqPageSchema, JsonLd } from "@/lib/jsonld";
import {
  Gamepad2,
  Zap,
  BookOpen,
  Trophy,
  Crown,
  ArrowRight,
  Wrench,
  HelpCircle,
  BarChart3,
  Target,
  Layers,
  Brain,
  GraduationCap,
} from "lucide-react";
import WordleGameLoader from "@/components/wordle/WordleGameLoader";
import SeoContent from "@/components/wordle/SeoContent";

/* ------------------------------------------------------------------ */
/*  Tier Icons                                                         */
/* ------------------------------------------------------------------ */

const TIER_ICONS = {
  beginner: Zap,
  intermediate: BookOpen,
  advanced: Trophy,
  master: Crown,
};

/* ------------------------------------------------------------------ */
/*  WebApplication Schema                                              */
/* ------------------------------------------------------------------ */

function gameSchema(game: LetterGameData, config: LetterGameConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: game.title,
    url: `${BASE_URL}/${game.slug}`,
    description: game.description,
    applicationCategory: "GameApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.6",
      ratingCount: "128",
      bestRating: "5",
      worstRating: "1",
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Difficulty Badge                                                   */
/* ------------------------------------------------------------------ */

function DifficultyBadge({ config }: { config: LetterGameConfig }) {
  const TierIcon = TIER_ICONS[config.tier];
  return (
    <div className={`mx-auto flex items-center justify-center gap-2`}>
      <TierIcon className={`h-5 w-5 ${config.theme.iconColor}`} />
      <span
        className={`text-sm font-medium ${config.theme.badgeText}`}
      >
        {config.theme.label}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stats Bar                                                          */
/* ------------------------------------------------------------------ */

function StatsBar({ config }: { config: LetterGameConfig }) {
  const stats = [
    {
      icon: BarChart3,
      label: "Difficulty",
      value: `${config.difficultyScore}/10`,
    },
    { icon: Target, label: "Word Pool", value: config.wordPoolSize },
    { icon: Layers, label: "Avg Guesses", value: config.avgSolveGuesses },
    { icon: Brain, label: "Double Letters", value: config.doubleLettterPct },
  ];

  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`rounded-xl border p-3 text-center ${config.theme.borderColor} bg-card`}
        >
          <s.icon
            className={`mx-auto h-4 w-4 ${config.theme.iconColor}`}
          />
          <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
          <div className="font-heading text-sm font-bold text-foreground">
            {s.value}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Unique Section Renderers (different layout per type)               */
/* ------------------------------------------------------------------ */

function renderTable(section: UniqueSection, config: LetterGameConfig) {
  const { columns, rows, insight } = section.data as {
    columns: string[];
    rows: string[][];
    insight?: string;
  };
  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className={`${config.theme.sectionBg}`}>
              {columns.map((col: string) => (
                <th
                  key={col}
                  className="px-4 py-3 font-heading text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row: string[], i: number) => (
              <tr
                key={i}
                className="transition-colors hover:bg-muted/50"
              >
                {row.map((cell: string, j: number) => (
                  <td
                    key={j}
                    className={`px-4 py-3 ${j === 0 ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {insight && (
        <p className="mt-3 rounded-lg border-l-4 border-l-current p-3 text-sm italic text-muted-foreground" style={{ borderColor: `var(--${config.theme.color})` }}>
          {insight}
        </p>
      )}
    </div>
  );
}

function renderCards(section: UniqueSection, config: LetterGameConfig) {
  const data = section.data as Record<string, unknown>;
  // Handle both "prefixes/suffixes" format and "groups" format
  const items = (data.prefixes || data.suffixes || data.groups || []) as {
    affix?: string;
    prefix?: string;
    meaning?: string;
    examples: string;
    frequency?: string;
    strategy?: string;
    words?: string[];
    count?: number;
    description?: string;
  }[];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i: number) => (
        <div
          key={i}
          className={`rounded-xl border p-5 ${config.theme.borderColor} bg-card transition-all hover:-translate-y-0.5 hover:shadow-md`}
        >
          <div
            className={`inline-block rounded-lg px-3 py-1 font-heading text-sm font-bold ${config.theme.badgeBg} ${config.theme.badgeText}`}
          >
            {item.affix || item.prefix || ""}
          </div>
          {item.meaning && (
            <p className="mt-2 text-xs font-medium text-muted-foreground">
              Meaning: {item.meaning}
            </p>
          )}
          {item.count !== undefined && (
            <p className="mt-1 text-xs text-muted-foreground">
              {item.count}+ words in this family
            </p>
          )}
          <p className="mt-2 text-sm leading-relaxed text-foreground">
            {item.examples || (item.words || []).join(", ")}
          </p>
          {item.frequency && (
            <p className="mt-1.5 text-xs text-muted-foreground">
              Frequency: {item.frequency}
            </p>
          )}
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {item.strategy || item.description || ""}
          </p>
        </div>
      ))}
    </div>
  );
}

function renderGrid(section: UniqueSection, config: LetterGameConfig) {
  const data = section.data as Record<string, unknown>;
  const items = (data.families || data.categories || data.domains || data.fields || []) as {
    pattern?: string;
    category?: string;
    field?: string;
    profession?: string;
    words: string[];
    count?: number;
    tip?: string;
    rootTip?: string;
    cue?: string;
    insight?: string;
  }[];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item, i: number) => (
        <div
          key={i}
          className={`rounded-xl border p-5 ${config.theme.borderColor} bg-card`}
        >
          <div className="flex items-center justify-between">
            <h4 className="font-heading text-base font-bold text-foreground">
              {item.pattern || item.category || item.field || item.profession || ""}
            </h4>
            {item.count !== undefined && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${config.theme.badgeBg} ${config.theme.badgeText}`}
              >
                {item.count} words
              </span>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.words.map((word: string) => (
              <span
                key={word}
                className="rounded-md bg-muted px-2 py-1 font-mono text-xs text-foreground"
              >
                {word}
              </span>
            ))}
          </div>
          {(item.tip || item.rootTip || item.cue || item.insight) && (
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              {item.tip || item.rootTip || item.cue || item.insight}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function renderComparison(section: UniqueSection, config: LetterGameConfig) {
  const data = section.data as Record<string, unknown>;
  const stats = (data.stats || []) as {
    label?: string;
    metric?: string;
    value?: string;
    five?: string;
    six?: string;
    context?: string;
    impact?: string;
  }[];

  // Check if this is a simple stats format or a comparison format
  const isComparison = stats[0] && ("five" in stats[0] || "six" in stats[0]);

  if (isComparison) {
    return (
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className={`${config.theme.sectionBg}`}>
              <th className="px-4 py-3 font-heading text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Metric
              </th>
              <th className="px-4 py-3 font-heading text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                5-Letter
              </th>
              <th className="px-4 py-3 font-heading text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                6-Letter
              </th>
              <th className="px-4 py-3 font-heading text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Impact
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {stats.map((row, i: number) => (
              <tr key={i} className="transition-colors hover:bg-muted/50">
                <td className="px-4 py-3 font-semibold text-foreground">
                  {row.metric}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{row.five}</td>
                <td className="px-4 py-3 font-semibold text-foreground">
                  {row.six}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {row.impact}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Simple stats format
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, i: number) => (
        <div
          key={i}
          className={`rounded-xl border p-4 ${config.theme.borderColor} bg-card`}
        >
          <div className="font-heading text-2xl font-bold text-foreground">
            {stat.value}
          </div>
          <div className="mt-1 text-sm font-medium text-foreground">
            {stat.label}
          </div>
          {stat.context && (
            <div className="mt-1 text-xs text-muted-foreground">
              {stat.context}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function renderList(section: UniqueSection, config: LetterGameConfig) {
  const { entries } = section.data as {
    entries: {
      word: string;
      context?: string;
      difficulty?: number;
      reason?: string;
      category?: string;
    }[];
  };

  return (
    <div className="space-y-4">
      {entries.map((entry, i: number) => (
        <div
          key={i}
          className={`rounded-xl border p-5 ${config.theme.borderColor} bg-card`}
        >
          <div className="flex items-start justify-between">
            <h4 className="font-heading text-lg font-bold text-foreground">
              {entry.word}
            </h4>
            {entry.category && (
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${config.theme.badgeBg} ${config.theme.badgeText}`}
              >
                {entry.category}
              </span>
            )}
            {entry.difficulty !== undefined && (
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${config.theme.badgeBg} ${config.theme.badgeText}`}
              >
                Difficulty: {entry.difficulty}/10
              </span>
            )}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {entry.context || entry.reason || ""}
          </p>
        </div>
      ))}
    </div>
  );
}

function UniqueSectionRenderer({
  section,
  config,
}: {
  section: UniqueSection;
  config: LetterGameConfig;
}) {
  let content: React.ReactNode;

  switch (section.layout) {
    case "table":
      content = renderTable(section, config);
      break;
    case "cards":
      content = renderCards(section, config);
      break;
    case "grid":
      content = renderGrid(section, config);
      break;
    case "comparison":
      content = renderComparison(section, config);
      break;
    case "list":
      content = renderList(section, config);
      break;
    case "reference":
      content = renderTable(section, config);
      break;
    default:
      content = null;
  }

  return (
    <section className="mt-10">
      <h2 className="font-heading text-2xl font-bold text-foreground">
        {section.heading}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {section.description}
      </p>
      <div className="mt-5">{content}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ Section                                                        */
/* ------------------------------------------------------------------ */

function FaqSection({ config }: { config: LetterGameConfig }) {
  if (!config.faq.length) return null;

  return (
    <section className="mt-10">
      <div className="flex items-center gap-2">
        <HelpCircle className={`h-5 w-5 ${config.theme.iconColor}`} />
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Frequently Asked Questions
        </h2>
      </div>
      <div className="mt-5 space-y-4">
        {config.faq.map((item, i) => (
          <details
            key={i}
            className={`group rounded-xl border ${config.theme.borderColor} bg-card`}
          >
            <summary className="cursor-pointer select-none px-5 py-4 font-heading text-sm font-semibold text-foreground transition-colors hover:bg-muted/50 [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between">
                <span>{item.question}</span>
                <span className="ml-2 text-muted-foreground transition-transform group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <div className="border-t border-border px-5 py-4 text-sm leading-relaxed text-muted-foreground">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Related Tools                                                      */
/* ------------------------------------------------------------------ */

function RelatedTools({ config }: { config: LetterGameConfig }) {
  if (!config.relatedTools.length) return null;

  return (
    <section className="mt-10">
      <div className="flex items-center gap-2">
        <Wrench className={`h-5 w-5 ${config.theme.iconColor}`} />
        <h2 className="font-heading text-xl font-bold text-foreground">
          Helpful Tools
        </h2>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {config.relatedTools.map((tool) => (
          <I18nLink
            key={tool.href}
            href={tool.href}
            prefetch={false}
            className={`group flex items-center justify-between rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${config.theme.borderColor} bg-card`}
          >
            <div>
              <div className="font-heading text-sm font-semibold text-foreground">
                {tool.name}
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                {tool.description}
              </div>
            </div>
            <ArrowRight
              className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${config.theme.iconColor}`}
            />
          </I18nLink>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Next Level CTA                                                     */
/* ------------------------------------------------------------------ */

function NextLevelCta({
  config,
  nextGame,
}: {
  config: LetterGameConfig;
  nextGame: LetterGameData;
}) {
  return (
    <section className="mt-10">
      <I18nLink
        href={`/${nextGame.slug}`}
        prefetch={false}
        className={`group block rounded-2xl border p-6 text-center transition-all hover:-translate-y-0.5 hover:shadow-lg ${config.theme.borderColor} bg-gradient-to-r ${config.theme.bgGradient}`}
      >
        <GraduationCap
          className={`mx-auto h-8 w-8 ${config.theme.iconColor}`}
        />
        <h3 className="mt-3 font-heading text-lg font-bold text-foreground">
          Ready for {nextGame.wordLength}-Letter Words?
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Take the next step and challenge yourself with {nextGame.wordLength}-letter Wordle
        </p>
        <span
          className={`mt-3 inline-flex items-center gap-1 text-sm font-semibold ${config.theme.badgeText} transition-transform group-hover:translate-x-1`}
        >
          Play Now <ArrowRight className="h-4 w-4" />
        </span>
      </I18nLink>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Other Games (compact, not all 7)                                   */
/* ------------------------------------------------------------------ */

function OtherGames({
  config,
  currentLength,
}: {
  config: LetterGameConfig;
  currentLength: number;
}) {
  const otherGames = LETTER_GAMES.filter(
    (g) => g.wordLength !== currentLength
  );

  return (
    <section
      className={`mt-10 border-t pt-8 ${config.theme.borderColor}`}
    >
      <h2 className="font-heading text-xl font-bold text-foreground">
        All Word Lengths
      </h2>
      <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-7">
        {otherGames.map((g) => (
          <I18nLink
            key={g.slug}
            href={`/${g.slug}`}
            prefetch={false}
            className={`group rounded-xl border bg-card p-3 text-center transition-all hover:-translate-y-0.5 hover:shadow-md ${config.theme.borderColor}`}
          >
            <div
              className={`font-heading text-xl font-bold ${config.theme.iconColor}`}
            >
              {g.wordLength}
            </div>
            <div className="mt-0.5 text-[10px] text-muted-foreground">
              letters
            </div>
          </I18nLink>
        ))}
      </div>
    </section>
  );
}

/* ================================================================== */
/*  TIER-SPECIFIC LAYOUTS                                              */
/* ================================================================== */

/*
 * Each tier has a different section ordering and visual structure:
 *
 * Beginner (4-5):  Game → Stats → SEO Content → Unique Sections → FAQ → Tools → Next → Others
 * Intermediate (6-7): Stats → Game → Unique(first) → SEO Content → Unique(rest) → FAQ → Tools → Next → Others
 * Advanced (8-9):  Stats → Unique(first) → Game → SEO Content → Unique(rest) → FAQ → Tools → Next → Others
 * Master (10-11):  Unique(first) → Stats → Game → Unique(rest) → SEO Content → FAQ → Tools → Next → Others
 */

function BeginnerLayout({
  game,
  config,
  nextGame,
}: {
  game: LetterGameData;
  config: LetterGameConfig;
  nextGame: LetterGameData;
}) {
  return (
    <>
      {/* Game first — beginners want to play immediately */}
      <section
        className={`flex justify-center rounded-2xl border bg-gradient-to-b p-6 sm:p-8 ${config.theme.borderColor} ${config.theme.bgGradient}`}
      >
        <WordleGameLoader wordLength={config.wordLength} />
      </section>

      <StatsBar config={config} />

      <SeoContent wordLength={config.wordLength} />

      {config.uniqueSections.map((section) => (
        <UniqueSectionRenderer
          key={section.id}
          section={section}
          config={config}
        />
      ))}

      <FaqSection config={config} />
      <RelatedTools config={config} />
      <NextLevelCta config={config} nextGame={nextGame} />
      <OtherGames config={config} currentLength={config.wordLength} />
    </>
  );
}

function IntermediateLayout({
  game,
  config,
  nextGame,
}: {
  game: LetterGameData;
  config: LetterGameConfig;
  nextGame: LetterGameData;
}) {
  const [firstUnique, ...restUnique] = config.uniqueSections;

  return (
    <>
      <StatsBar config={config} />

      {/* Game */}
      <section
        className={`mt-8 flex justify-center rounded-2xl border bg-gradient-to-b p-6 sm:p-8 ${config.theme.borderColor} ${config.theme.bgGradient}`}
      >
        <WordleGameLoader wordLength={config.wordLength} />
      </section>

      {/* First unique section before SEO content — differentiates early */}
      {firstUnique && (
        <UniqueSectionRenderer section={firstUnique} config={config} />
      )}

      <SeoContent wordLength={config.wordLength} />

      {restUnique.map((section) => (
        <UniqueSectionRenderer
          key={section.id}
          section={section}
          config={config}
        />
      ))}

      <FaqSection config={config} />
      <RelatedTools config={config} />
      <NextLevelCta config={config} nextGame={nextGame} />
      <OtherGames config={config} currentLength={config.wordLength} />
    </>
  );
}

function AdvancedLayout({
  game,
  config,
  nextGame,
}: {
  game: LetterGameData;
  config: LetterGameConfig;
  nextGame: LetterGameData;
}) {
  const [firstUnique, ...restUnique] = config.uniqueSections;

  return (
    <>
      <StatsBar config={config} />

      {/* Lead with unique content — advanced players want depth first */}
      {firstUnique && (
        <UniqueSectionRenderer section={firstUnique} config={config} />
      )}

      {/* Game */}
      <section
        className={`mt-8 flex justify-center rounded-2xl border bg-gradient-to-b p-6 sm:p-8 ${config.theme.borderColor} ${config.theme.bgGradient}`}
      >
        <WordleGameLoader wordLength={config.wordLength} />
      </section>

      <SeoContent wordLength={config.wordLength} />

      {restUnique.map((section) => (
        <UniqueSectionRenderer
          key={section.id}
          section={section}
          config={config}
        />
      ))}

      <FaqSection config={config} />
      <RelatedTools config={config} />
      <NextLevelCta config={config} nextGame={nextGame} />
      <OtherGames config={config} currentLength={config.wordLength} />
    </>
  );
}

function MasterLayout({
  game,
  config,
  nextGame,
}: {
  game: LetterGameData;
  config: LetterGameConfig;
  nextGame: LetterGameData;
}) {
  const [firstUnique, ...restUnique] = config.uniqueSections;

  return (
    <>
      {/* Master level: lead with knowledge, establish expertise */}
      {firstUnique && (
        <UniqueSectionRenderer section={firstUnique} config={config} />
      )}

      <StatsBar config={config} />

      {/* Game */}
      <section
        className={`mt-8 flex justify-center rounded-2xl border bg-gradient-to-b p-6 sm:p-8 ${config.theme.borderColor} ${config.theme.bgGradient}`}
      >
        <WordleGameLoader wordLength={config.wordLength} />
      </section>

      {restUnique.map((section) => (
        <UniqueSectionRenderer
          key={section.id}
          section={section}
          config={config}
        />
      ))}

      <SeoContent wordLength={config.wordLength} />

      <FaqSection config={config} />
      <RelatedTools config={config} />
      <NextLevelCta config={config} nextGame={nextGame} />
      <OtherGames config={config} currentLength={config.wordLength} />
    </>
  );
}

/* ================================================================== */
/*  MAIN PAGE COMPONENT                                                */
/* ================================================================== */

export default function LetterGamePage({
  wordLength,
}: {
  wordLength: number;
}) {
  const game = LETTER_GAMES.find((g) => g.wordLength === wordLength)!;
  const config = getLetterGameConfig(wordLength)!;
  const nextGame = LETTER_GAMES.find(
    (g) => g.wordLength === config.recommendNext
  )!;

  const Layout =
    config.tier === "beginner"
      ? BeginnerLayout
      : config.tier === "intermediate"
        ? IntermediateLayout
        : config.tier === "advanced"
          ? AdvancedLayout
          : MasterLayout;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Structured Data */}
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: game.title, url: `${BASE_URL}/${game.slug}` },
        ])}
      />
      <JsonLd data={gameSchema(game, config)} />
      {config.faq.length > 0 && <JsonLd data={faqPageSchema(config.faq)} />}

      {/* Header */}
      <header className="mb-8 text-center">
        <DifficultyBadge config={config} />
        <h1 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          {game.title}
        </h1>
        <p className="mt-2 text-muted-foreground">{game.description}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Best for: {config.targetAudience}
        </p>
      </header>

      {/* Tier-specific layout */}
      <Layout game={game} config={config} nextGame={nextGame} />
    </div>
  );
}
