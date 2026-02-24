import HomeComponent from "@/components/home";
import { Locale, LOCALES } from "@/i18n/routing";

type Params = Promise<{ locale: string }>;

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function Home({ params }: { params: Params }) {
  const { locale } = await params;

  return <HomeComponent locale={locale as Locale} />;
}
