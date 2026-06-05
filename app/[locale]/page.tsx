import HomeComponent from "@/components/home";
import { Locale, LOCALES } from "@/i18n/routing";

type Params = Promise<{ locale: string }>;

// Revalidate every 60s so this page picks up new puzzle data from KV
export const revalidate = 60;

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function Home({ params }: { params: Params }) {
  const { locale } = await params;

  return <HomeComponent locale={locale as Locale} />;
}
