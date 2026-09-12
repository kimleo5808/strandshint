import MDXComponents from "@/components/mdx/MDXComponents";
import { getStaticPageContent } from "@/lib/getStaticPage";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { breadcrumbSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import remarkGfm from "remark-gfm";

const options = {
  parseFrontmatter: true,
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
};


type Params = Promise<{
  locale: string;
}>;

type MetadataProps = {
  params: Params;
};

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });

  return constructMetadata({
    page: "About",
    title: t("title"),
    description: t("description"),
    keywords: [
      "about strandshint", "strands hint website", "nyt strands help site",
    ],
    locale: locale as Locale,
    path: `/about`,
    canonicalUrl: `/about`,
  });
}

export default async function AboutPage({ params }: { params: Params }) {
  const { locale } = await params;
  const content = getStaticPageContent("about", locale);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "About", url: `${BASE_URL}/about` },
        ])}
      />
      <header className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-primary/5 to-primary/5 p-6 dark:border-primary/40 dark:from-zinc-900 dark:via-zinc-900 dark:to-slate-950">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
        <h1 className="relative font-heading text-3xl font-bold text-foreground sm:text-4xl">
          About StrandsHint
        </h1>
        <p className="relative mt-4 text-muted-foreground">
          How we provide daily NYT Strands hints and maintain our puzzle archive.
        </p>
      </header>

      <article className="rounded-2xl border border-primary/20 bg-card p-6 dark:border-primary/40 sm:p-8">
        <MDXRemote
          source={content}
          components={MDXComponents}
          options={options}
        />
      </article>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({
    locale,
  }));
}
