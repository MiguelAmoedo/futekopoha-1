import type { CampPlayer } from "@/lib/camp/types";
import { cn } from "@/lib/utils";

type PlayerStatBadgesProps = {
  goals: number;
  assists: number;
  compact?: boolean;
  className?: string;
  isTopScorer?: boolean;
  isTopAssister?: boolean;
};

export function PlayerStatBadges({
  goals,
  assists,
  compact = false,
  className,
  isTopScorer = false,
  isTopAssister = false,
}: PlayerStatBadgesProps) {
  return (
    <div
      className={cn("flex shrink-0 items-center gap-1.5", className)}
      aria-label={`${goals} gols, ${assists} assistências`}
    >
      <StatBadge
        label="GOL"
        value={goals}
        highlight={goals > 0}
        gold={isTopScorer}
        compact={compact}
      />
      <StatBadge
        label="ASS"
        value={assists}
        highlight={assists > 0}
        gold={isTopAssister}
        compact={compact}
      />
    </div>
  );
}

function StatBadge({
  label,
  value,
  highlight,
  gold,
  compact,
}: {
  label: string;
  value: number;
  highlight: boolean;
  gold?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-lg border px-2 py-1 tabular-nums",
        compact ? "min-w-11" : "min-w-12",
        gold
          ? "border-[color-mix(in_oklch,var(--camp-tier-gold)_50%,transparent)] bg-[color-mix(in_oklch,var(--camp-tier-gold)_16%,transparent)] shadow-[0_0_8px_var(--camp-tier-gold-glow)]"
          : highlight
            ? "camp-stat-highlight"
            : "border-border bg-muted/50",
      )}
    >
      <span
        className={cn(
          "font-heading text-lg leading-none",
          gold || highlight ? "camp-stat-highlight-value" : "text-muted-foreground",
        )}
      >
        {value}
      </span>
      <span className="text-[0.6rem] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export function getTopScorer(players: CampPlayer[]) {
  return [...players].sort((a, b) => b.goals - a.goals || b.assists - a.assists)[0];
}

export function getTopAssister(players: CampPlayer[]) {
  return [...players].sort((a, b) => b.assists - a.assists || b.goals - a.goals)[0];
}
