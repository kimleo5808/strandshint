import { BASE_URL } from "@/config/site";
import { GUIDES } from "@/data/guides";
import { Locale, LOCALES } from "@/i18n/routing";
import { Link as I18nLink } from "@/i18n/routing";
import { breadcrumbSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { BookOpen, Clock, GraduationCap } from "lucide-react";
import { Metadata } from "next";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "Guides",
    title: "Puzzle Guides - NYT Strands and Wordle Strategy",
    description:
      "In-depth guides for NYT Strands and Wordle. Spangram tactics, theme types, Hard Mode rules, and the endgame decisions that cost most players a guess.",
    keywords: [
      "strands guides",
      "strands strategy guide",
      "wordle strategy guide",
      "wordle hard mode",
      "how to play strands",
      "strands tips",
      "puzzle guides",
    ],
    locale: locale as Locale,
    path: `/guides`,
    canonicalUrl: `/guides`,
  });
}

const LEVEL_COLORS: Record<string, string> = {
  beginner:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  intermediate:
    "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary",
  advanced:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export default async function GuidesPage({ params }: { params: Params }) {
  await params;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Guides", url: `${BASE_URL}/guides` },
        ])}
      />

      {/* Header */}
      <header className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-white to-primary/5 p-6 sm:p-8 dark:border-primary/40 dark:from-zinc-900 dark:via-zinc-900 dark:to-primary/10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">
              Guides
            </span>
          </div>
          <h1 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Puzzle Guides
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Strategy guides for NYT Strands and Wordle, from the basic rules
            through Spangram tactics, Hard Mode, and endgame decisions.
          </p>
        </div>
      </header>

      {/* Guide Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((guide) => (
          <I18nLink
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            prefetch={false}
            className="group rounded-xl border border-primary/20 bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg dark:border-primary/40 dark:hover:border-primary/60"
          >
            <div className="text-3xl">{guide.icon}</div>
            <h2 className="mt-3 font-heading text-lg font-bold text-foreground group-hover:text-primary dark:group-hover:text-primary">
              {guide.title}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">
              {guide.description}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${LEVEL_COLORS[guide.level] || LEVEL_COLORS.intermediate}`}
              >
                <GraduationCap className="h-3 w-3" />
                {guide.levelLabel}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {guide.readTime}
              </span>
            </div>
          </I18nLink>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-10 rounded-2xl bg-gradient-to-br from-primary to-primary/90 p-6 text-center text-primary-foreground">
        <h2 className="font-heading text-xl font-bold">
          Ready to test your skills?
        </h2>
        <p className="mt-1 text-sm opacity-90">
          Put these strategies into practice with today&apos;s puzzle.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <I18nLink
            href="/strands-hint-today"
            prefetch={false}
            className="rounded-xl bg-white px-5 py-2 text-sm font-bold text-primary transition-all hover:bg-white/90"
          >
            Today&apos;s Hints
          </I18nLink>
          <I18nLink
            href="/strands-hint"
            prefetch={false}
            className="rounded-xl border-2 border-white/30 px-5 py-2 text-sm font-bold text-white transition-all hover:bg-white/10"
          >
            Browse All Puzzles
          </I18nLink>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
