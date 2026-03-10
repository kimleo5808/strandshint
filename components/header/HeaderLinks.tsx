"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link as I18nLink, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { HeaderLinkGroup } from "@/types/common";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

const HeaderLinks = () => {
  const tHeader = useTranslations("Header");
  const pathname = usePathname();

  const groups: HeaderLinkGroup[] = tHeader.raw("groups");

  return (
    <div className="hidden md:flex flex-row items-center gap-x-0.5 text-sm font-medium">
      {groups.map((group) => {
        // Plain link (no dropdown)
        if (!group.links || group.links.length === 0) {
          return (
            <I18nLink
              key={group.name}
              href={group.href ?? "/"}
              className={cn(
                "rounded-lg px-3 py-2 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white",
                pathname === group.href && "font-semibold bg-slate-800 text-white"
              )}
            >
              {group.name}
            </I18nLink>
          );
        }

        // Dropdown group
        const isActive = group.links.some((l) => pathname === l.href);

        return (
          <DropdownMenu key={group.name}>
            <DropdownMenuTrigger
              className={cn(
                "flex items-center gap-1 rounded-lg px-3 py-2 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white outline-none",
                isActive && "font-semibold bg-slate-800 text-white"
              )}
            >
              {group.name}
              <ChevronDown className="h-3.5 w-3.5 opacity-70" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              {group.links.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <I18nLink
                    href={link.href}
                    className={cn(
                      "w-full cursor-pointer",
                      pathname === link.href && "font-semibold text-primary"
                    )}
                  >
                    {link.name}
                  </I18nLink>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      })}
    </div>
  );
};

export default HeaderLinks;
