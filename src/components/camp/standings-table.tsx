import type { CampStanding, CampTeam } from "@/lib/camp/types";
import { getTeamById } from "@/lib/camp/mock-data";
import { findTeamById } from "@/lib/camp/teams-config";
import { getStandingTier, STANDING_ROW_CLASS } from "@/lib/camp/tiers";
import { CampCard } from "@/components/camp/camp-card";
import { CampTierBadge } from "@/components/camp/camp-tier-badge";
import { TeamBadge } from "@/components/camp/team-badge";
import { cn } from "@/lib/utils";

type StandingsTableProps = {
  standings: CampStanding[];
  teams?: CampTeam[];
};

export function StandingsTable({ standings, teams }: StandingsTableProps) {
  return (
    <CampCard
      title="Classificação"
      description="Fase 1 · todos x todos"
      contentClassName="flex flex-col gap-2"
    >
      <div className="grid grid-cols-[auto_1fr_auto_auto] gap-x-3 gap-y-1 px-1 text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
        <span>#</span>
        <span>Time</span>
        <span className="text-center">J</span>
        <span className="text-center">Pts</span>
      </div>
      {standings.map((row) => {
        const team = teams ? findTeamById(teams, row.teamId) : getTeamById(row.teamId);
        const goalDiff = row.goalsFor - row.goalsAgainst;
        const tier = getStandingTier(row.position);

        return (
          <div
            key={row.teamId}
            className={cn(
              "grid grid-cols-[auto_1fr_auto_auto] items-center gap-x-3 rounded-lg border border-[var(--camp-surface-border)] px-3 py-2",
              STANDING_ROW_CLASS[tier],
            )}
          >
            <CampTierBadge position={row.position} tier={tier} />
            <div className="flex min-w-0 items-center gap-2">
              <TeamBadge teamId={row.teamId} size="sm" />
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold">{team?.name}</span>
                <span className="text-xs tabular-nums text-muted-foreground">
                  SG {goalDiff >= 0 ? `+${goalDiff}` : goalDiff}
                </span>
              </div>
            </div>
            <span className="text-center text-sm tabular-nums">{row.played}</span>
            <span className="camp-gold-gradient-text text-center font-heading text-sm font-bold tabular-nums">
              {row.points}
            </span>
          </div>
        );
      })}
    </CampCard>
  );
}
