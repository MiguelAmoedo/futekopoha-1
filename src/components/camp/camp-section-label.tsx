import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type CampSectionLabelProps = {
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
  accent?: boolean;
};

/** Rótulo de seção uppercase — estilo EA FC Ultimate Team. */
export function CampSectionLabel({
  children,
  icon: Icon,
  className,
  accent = false,
}: CampSectionLabelProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {Icon ? (
        <Icon
          aria-hidden="true"
          className={cn(
            "size-4 shrink-0",
            accent ? "text-[var(--camp-gold)]" : "text-muted-foreground",
          )}
        />
      ) : null}
      <h2
        className={cn(
          "font-heading text-xs font-semibold uppercase tracking-[0.18em]",
          accent ? "camp-gold-gradient-text" : "camp-chrome tracking-wide",
        )}
      >
        {children}
      </h2>
    </div>
  );
}
