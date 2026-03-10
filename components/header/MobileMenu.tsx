"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { siteConfig } from "@/config/site";
import { Link as I18nLink } from "@/i18n/routing";
import { HeaderLinkGroup } from "@/types/common";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";

export default function MobileMenu() {
  const tHeader = useTranslations("Header");
  const groups: HeaderLinkGroup[] = tHeader.raw("groups");

  return (
    <div className="flex items-center gap-1 md:hidden">
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger className="p-2 text-slate-300 hover:text-white">
          <Menu className="h-5 w-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 max-h-[80vh] overflow-y-auto">
          <DropdownMenuLabel>
            <I18nLink
              href="/"
              prefetch={true}
              className="flex items-center space-x-2 font-bold"
            >
              <span className="font-heading text-lg text-foreground">
                {siteConfig.name}
              </span>
            </I18nLink>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {groups.map((group, i) => (
            <div key={group.name}>
              {/* Plain link group */}
              {!group.links || group.links.length === 0 ? (
                <DropdownMenuItem asChild>
                  <I18nLink href={group.href ?? "/"} className="w-full cursor-pointer font-medium">
                    {group.name}
                  </I18nLink>
                </DropdownMenuItem>
              ) : (
                <>
                  {i > 0 && <DropdownMenuSeparator />}
                  <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground py-1.5">
                    {group.name}
                  </DropdownMenuLabel>
                  <DropdownMenuGroup>
                    {group.links.map((link) => (
                      <DropdownMenuItem key={link.href} asChild>
                        <I18nLink
                          href={link.href}
                          prefetch={link.target !== "_blank"}
                          target={link.target ?? "_self"}
                          rel={link.rel ?? undefined}
                          className="w-full cursor-pointer pl-4"
                        >
                          {link.name}
                        </I18nLink>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </>
              )}
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
