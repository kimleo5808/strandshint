import MDXComponents from "@/components/mdx/MDXComponents";
import { getStaticPageContent } from "@/lib/getStaticPage";
import { Locale, LOCALES } from "@/i18n/routing";
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
  const t = await getTranslations({ locale, namespace: "TermsOfService" });

  return constructMetadata({
    page: "TermsOfService",
    title: t("title"),
    description: t("description"),
    keywords: [
      "strandshint terms of service", "strands hint terms",
    ],
    locale: locale as Locale,
    path: `/terms-of-service`,
    canonicalUrl: `/terms-of-service`,
  });
}

export default async function TermsOfServicePage({
  params,
}: {
  params: Params;
}) {
  const { locale } = await params;
  const content = getStaticPageContent("terms-of-service", locale);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <header className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-primary/5 to-primary/5 p-6 dark:border-primary/40 dark:from-zinc-900 dark:via-zinc-900 dark:to-slate-950">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
        <h1 className="relative font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Terms of Service
        </h1>
        <p className="relative mt-4 text-muted-foreground">
          Usage rules, disclaimers, and acceptable use for strandshint.app.
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
