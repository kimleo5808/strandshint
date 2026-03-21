import { LETTER_GAMES } from "@/data/letter-games";
import { Locale, LOCALES } from "@/i18n/routing";
import { constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import LetterGamePage from "@/components/wordle/LetterGamePage";

const WORD_LENGTH = 6;

const game = LETTER_GAMES.find((g) => g.wordLength === WORD_LENGTH)!;

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "LetterGame",
    title: game.title,
    description: game.description,
    keywords: game.keywords,
    locale: locale as Locale,
    path: `/${game.slug}`,
    canonicalUrl: `/${game.slug}`,
  });
}

export default async function Page({ params }: { params: Params }) {
  await params;
  return <LetterGamePage wordLength={WORD_LENGTH} />;
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
