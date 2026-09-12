import { BlogCard } from "@/app/[locale]/blog/BlogCard";
import { Locale, LOCALES } from "@/i18n/routing";
import { getPosts } from "@/lib/getBlogs";
import { constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Params = Promise<{ locale: string }>;

type MetadataProps = {
  params: Params;
};

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });

  return constructMetadata({
    page: "Blog",
    title: t("title"),
    description: t("description"),
    keywords: [
      "strands tips", "nyt strands strategy", "strands puzzle guide",
      "strands hints blog", "word puzzle tips",
    ],
    locale: locale as Locale,
    path: `/blog`,
    canonicalUrl: `/blog`,
  });
}

export default async function Page({ params }: { params: Params }) {
  const { locale } = await params;
  const { posts } = await getPosts(locale);

  const t = await getTranslations("Blog");

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mx-auto mb-10 max-w-3xl text-center">
        <h1 className="text-4xl font-bold">{t("title")}</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          {t("description")}
        </p>
      </header>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.slug} locale={locale} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400">
          {t("empty")}
        </p>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
