import type { CampPlayer } from "@/lib/camp/types";
import { FutPlayerCard } from "@/components/camp/fut-player-card";
import { PlayerStatBadges } from "@/components/camp/player-stat-badges";
import { getTeamById } from "@/lib/camp/mock-data";
import { TeamBadge } from "@/components/camp/team-badge";

type PlayerRowProps = {
  player: CampPlayer;
  topScorerId: string;
  topAssisterId: string;
};

export function PlayerRow({ player, topScorerId, topAssisterId }: PlayerRowProps) {
  const team = getTeamById(player.teamId);
  const isTopScorer = player.id === topScorerId;
  const isTopAssister = player.id === topAssisterId;

  return (
    <div className="camp-surface flex items-center gap-3 rounded-lg border border-[var(--camp-surface-border)] bg-[oklch(0.18_0.035_260/0.85)] p-2">
      <FutPlayerCard player={player} size="sm" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate font-semibold">{player.name}</span>
          <TeamBadge teamId={player.teamId} size="sm" />
        </div>
        <span className="truncate text-xs text-muted-foreground">
          {team?.name} · {player.role === "goleiro" ? "Goleiro" : "Linha"}
        </span>
      </div>
      <PlayerStatBadges
        goals={player.goals}
        assists={player.assists}
        compact
        isTopScorer={isTopScorer}
        isTopAssister={isTopAssister}
      />
    </div>
  );
}
