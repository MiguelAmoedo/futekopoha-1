import type { TeamId } from "@/lib/camp/types";
import { MOCK_TOURNAMENT } from "@/lib/camp/mock-data";
import { getStandingTier } from "@/lib/camp/tiers";
import { CampTierBadge } from "@/components/camp/camp-tier-badge";
import { TeamBadge } from "@/components/camp/team-badge";
import { UsersIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type TeamFilterRowProps = {
  className?: string;
  selected?: TeamId | null;
  onSelect?: (teamId: TeamId | null) => void;
};

export function TeamFilterRow({ className, selected = null, onSelect }: TeamFilterRowProps) {
  const standingsByTeam = new Map(
    MOCK_TOURNAMENT.standings.map((row) => [row.teamId, row.position]),
  );
  const interactive = Boolean(onSelect);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <UsersIcon aria-hidden="true" className="size-3.5 text-[var(--camp-gold)]" />
        Times no camp
      </div>
      <div className="flex flex-wrap gap-2">
        {interactive ? (
          <button
            type="button"
            onClick={() => onSelect?.(null)}
            className={cn(
              "rounded-lg border px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
              selected === null
                ? "border-[color-mix(in_oklch,var(--camp-gold)_45%,transparent)] bg-[color-mix(in_oklch,var(--camp-gold)_14%,oklch(0.2_0.035_260))] text-[var(--camp-gold-strong)]"
                : "border-[var(--camp-surface-border)] bg-[oklch(0.24_0.035_260)] text-muted-foreground hover:text-foreground",
            )}
          >
            Todos
          </button>
        ) : null}
        {MOCK_TOURNAMENT.teams.map((team) => {
          const position = standingsByTeam.get(team.id);
          const isSelected = selected === team.id;

          const chip = (
            <>
              {position ? (
                <CampTierBadge
                  position={position}
                  tier={getStandingTier(position)}
                  className="size-6 text-xs"
                />
              ) : null}
              <TeamBadge teamId={team.id} name={team.name} size="md" />
            </>
          );

          if (!interactive) {
            return (
              <div
                key={team.id}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--camp-surface-border)] bg-[oklch(0.24_0.035_260)] px-2 py-1.5"
              >
                {chip}
              </div>
            );
          }

          return (
            <button
              key={team.id}
              type="button"
              onClick={() => onSelect?.(isSelected ? null : team.id)}
              aria-pressed={isSelected}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 rounded-lg border px-2 py-1.5 transition-colors",
                isSelected
                  ? "border-[color-mix(in_oklch,var(--camp-gold)_45%,transparent)] bg-[color-mix(in_oklch,var(--camp-gold)_14%,oklch(0.2_0.035_260))] shadow-[0_0_12px_-4px_var(--camp-tier-gold-glow)]"
                  : "border-[var(--camp-surface-border)] bg-[oklch(0.24_0.035_260)] hover:border-[color-mix(in_oklch,var(--camp-gold)_30%,var(--camp-surface-border))]",
              )}
            >
              {chip}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export type { TeamId };
