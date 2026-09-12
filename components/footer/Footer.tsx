import SocialShare from "@/components/footer/SocialShare";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Link as I18nLink } from "@/i18n/routing";
import { FooterLink } from "@/types/common";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function Footer() {
  const t = await getTranslations("Home");
  const tFooter = await getTranslations("Footer");
  const footerLinks: FooterLink[] = tFooter.raw("Links.groups");

  return (
    <footer className="mt-12 w-full border-t border-slate-800 bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-x-6 gap-y-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] lg:px-8 xl:gap-x-10">
        {/* About column */}
        <div>
          <h2 className="font-heading text-xl font-bold text-white">
            {siteConfig.name}
          </h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
            {t("description")}
          </p>
          <SocialShare />
        </div>

        {/* Footer link groups */}
        {footerLinks.map((section) => (
          <div key={section.title}>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-slate-200">
              {section.title}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {section.links.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith("/") && !link.useA ? (
                    <I18nLink
                      href={link.href}
                      title={link.name}
                      prefetch={false}
                      className="text-slate-400 transition-colors hover:text-primary"
                      target={link.target || undefined}
                      rel={link.rel || undefined}
                    >
                      {link.name}
                    </I18nLink>
                  ) : (
                    <Link
                      href={link.href}
                      title={link.name}
                      prefetch={false}
                      className="text-slate-400 transition-colors hover:text-primary"
                      target={link.target || undefined}
                      rel={link.rel || undefined}
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Blog entry point — the long-form articles are easy to miss among the
          link columns, so they get a dedicated call to action. */}
      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div>
            <h3 className="font-heading text-lg font-semibold text-white">
              {tFooter("BlogCta.title")}
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              {tFooter("BlogCta.description")}
            </p>
          </div>
          <I18nLink
            href="/blog"
            title={tFooter("BlogCta.button")}
            prefetch={false}
            className="inline-flex shrink-0 items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {tFooter("BlogCta.button")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </I18nLink>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-6 text-sm text-slate-500 sm:px-6 md:flex-row lg:px-8">
          <p>
            {tFooter("Copyright", {
              year: new Date().getFullYear(),
              name: siteConfig.name,
            })}
          </p>
          <p className="text-xs text-slate-600">
            Not affiliated with The New York Times. NYT Strands is a trademark of The New York Times Company.
          </p>
        </div>
      </div>
    </footer>
  );
}
