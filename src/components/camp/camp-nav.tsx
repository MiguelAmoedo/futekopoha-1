"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGridIcon,
  ShieldIcon,
} from "lucide-react";
import { CAMP_NAV_ITEMS } from "@/lib/camp/constants";
import { cn } from "@/lib/utils";

const NAV_ICONS = {
  "/": LayoutGridIcon,
  "/camp/times": ShieldIcon,
} as const;

function isActive(pathname: string, href: string, match: "exact" | "prefix") {
  if (match === "exact") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function CampNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação do campeonato"
      className="camp-bottom-nav grid grid-cols-2 gap-1 p-1"
    >
      {CAMP_NAV_ITEMS.map(({ href, label, match }) => {
        const Icon = NAV_ICONS[href];
        const active = isActive(pathname, href, match);

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "camp-nav-link flex min-h-12 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg px-0.5 py-1.5 text-[0.625rem] font-semibold uppercase leading-tight tracking-normal focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--camp-gold)]/50",
              active && "camp-nav-link--active",
            )}
          >
            <Icon aria-hidden="true" className="size-5" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
