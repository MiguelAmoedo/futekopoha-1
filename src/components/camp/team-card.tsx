import { ShieldIcon, TrophyIcon, Users2Icon } from "lucide-react";
import type { CampPlayer, CampTeam } from "@/lib/camp/types";
import { getPlayersByTeam, MOCK_TOURNAMENT } from "@/lib/camp/mock-data";
import { futPosition } from "@/lib/camp/fut-utils";
import { getStandingTier } from "@/lib/camp/tiers";
import { CampTierBadge } from "@/components/camp/camp-tier-badge";
import {
  getTopAssister,
  getTopScorer,
  PlayerStatBadges,
} from "@/components/camp/player-stat-badges";
import { TeamBadge } from "@/components/camp/team-badge";
import { cn } from "@/lib/utils";

type TeamCardProps = {
  team: CampTeam;
  standingPosition?: number;
};

function sortRoster(players: CampPlayer[]) {
  return [...players].sort((a, b) => {
    if (a.role !== b.role) return a.role === "goleiro" ? -1 : 1;
    return a.number - b.number;
  });
}

export function TeamCard({ team, standingPosition }: TeamCardProps) {
  const players = sortRoster(getPlayersByTeam(team.id));
  const linePlayers = players.filter((player) => player.role === "linha");
  const tier = standingPosition ? getStandingTier(standingPosition) : null;
  const topScorer = getTopScorer(MOCK_TOURNAMENT.players);
  const topAssister = getTopAssister(MOCK_TOURNAMENT.players);

  return (
    <article
      className={cn(
        "camp-surface camp-card overflow-hidden",
        tier === "gold" && "camp-card--tier-gold",
        tier === "silver" && "camp-card--tier-silver",
        tier === "bronze" && "camp-card--tier-bronze",
      )}
    >
      <div className="flex items-start justify-between gap-3 border-b border-[var(--camp-surface-border)] p-4">
        <div className="flex items-center gap-3">
          <TeamBadge teamId={team.id} />
          <div className="flex flex-col gap-0.5">
            <h3 className="font-heading text-xl tracking-wide">{team.name}</h3>
            <p className="text-sm text-muted-foreground">Capitão: {team.captain}</p>
          </div>
        </div>
        {standingPosition ? (
          <CampTierBadge position={standingPosition} tier={tier ?? undefined} />
        ) : null}
      </div>

      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center gap-1.5">
          <Users2Icon
            aria-hidden="true"
            className="size-3.5 shrink-0 text-[var(--camp-gold)]"
          />
          <span className="text-[0.625rem] font-bold uppercase tracking-wider text-muted-foreground">
            Elenco
          </span>
        </div>

        <ul className="flex flex-col gap-1.5">
          {players.map((player) => {
            const isGoalkeeper = player.role === "goleiro";
            const lineIndex = linePlayers.findIndex((p) => p.id === player.id);
            const positionLabel = isGoalkeeper
              ? "Goleiro"
              : futPosition(player, lineIndex >= 0 ? lineIndex : undefined);
            const isTopScorer = player.id === topScorer.id;
            const isTopAssister = player.id === topAssister.id;

            return (
              <li
                key={player.id}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-2.5 py-2",
                  isGoalkeeper
                    ? "border-[color-mix(in_oklch,var(--camp-tier-gold)_55%,transparent)] bg-[color-mix(in_oklch,var(--camp-tier-gold)_10%,oklch(0.2_0.035_260))]"
                    : "border-[var(--camp-surface-border)] bg-[oklch(0.18_0.035_260/0.85)]",
                )}
              >
                <span className="w-7 shrink-0 text-center text-xs font-semibold tabular-nums text-muted-foreground">
                  #{player.number}
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <div className="flex min-w-0 items-center gap-1.5">
                    {isGoalkeeper ? (
                      <ShieldIcon
                        aria-hidden="true"
                        className="size-3 shrink-0 text-[var(--camp-gold)]"
                      />
                    ) : null}
                    <span className="truncate text-sm font-semibold">{player.name}</span>
                  </div>
                  <span className="text-[0.625rem] font-semibold uppercase tracking-wide text-muted-foreground">
                    {positionLabel}
                  </span>
                </div>
                <PlayerStatBadges
                  goals={player.goals}
                  assists={player.assists}
                  compact
                  isTopScorer={isTopScorer}
                  isTopAssister={isTopAssister}
                />
              </li>
            );
          })}
        </ul>
      </div>

      <footer className="flex items-center gap-1.5 border-t border-[var(--camp-surface-border)] px-4 py-3 text-xs text-muted-foreground">
        <TrophyIcon aria-hidden="true" className="size-3.5 shrink-0 text-[var(--camp-gold)]" />
        <span>
          {team.playerCount} jogadores · {team.wins} vitória{team.wins === 1 ? "" : "s"} na fase 1
        </span>
      </footer>
    </article>
  );
}
