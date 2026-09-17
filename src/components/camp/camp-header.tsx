import Link from "next/link";
import { ChevronLeftIcon, TrophyIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type CampHeaderProps = {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  backHref?: string;
  className?: string;
};

export function CampHeader({
  title = "Copa Resenha",
  subtitle,
  eyebrow,
  backHref,
  className,
}: CampHeaderProps) {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      {backHref ? (
        <Link
          href={backHref}
          className="mt-0.5 flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[color-mix(in_oklch,var(--camp-gold)_35%,transparent)] bg-[oklch(0.22_0.04_260/0.8)] text-[var(--camp-gold-strong)] transition-colors hover:bg-[oklch(0.28_0.04_260/0.9)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--camp-gold)]/50"
          aria-label="Voltar"
        >
          <ChevronLeftIcon aria-hidden="true" className="size-5" />
        </Link>
      ) : (
        <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg border border-[color-mix(in_oklch,var(--camp-gold)_45%,transparent)] bg-[color-mix(in_oklch,var(--camp-gold)_12%,oklch(0.18_0.035_260))] text-[var(--camp-gold-strong)] shadow-[0_0_12px_-2px_var(--camp-tier-gold-glow)]">
          <TrophyIcon aria-hidden="true" className="size-5" />
        </span>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {eyebrow ? (
          <p className="camp-gold-gradient-text text-[0.625rem] font-semibold uppercase tracking-[0.12em]">
            {eyebrow}
          </p>
        ) : null}
        <p className="font-heading text-xl leading-none tracking-wide">{title}</p>
        {subtitle ? (
          <p className="text-sm leading-5 camp-chrome-muted">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}
