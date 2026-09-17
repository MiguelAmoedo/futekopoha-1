import type { CampMatch, CampTeam } from "@/lib/camp/types";
import { getTeamById } from "@/lib/camp/mock-data";
import { findTeamById } from "@/lib/camp/teams-config";
import { TeamBadge } from "@/components/camp/team-badge";
import { Badge } from "@/components/ui/badge";
import { RadioIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type MatchCardProps = {
  match: CampMatch;
  teams?: CampTeam[];
};

const STATUS_LABEL = {
  scheduled: "Agendado",
  live: "Ao vivo",
  finished: "Encerrado",
} as const;

export function MatchCard({ match, teams }: MatchCardProps) {
  const home = teams ? findTeamById(teams, match.homeTeamId) : getTeamById(match.homeTeamId);
  const away = teams ? findTeamById(teams, match.awayTeamId) : getTeamById(match.awayTeamId);
  const hasScore = match.result !== undefined;
  const isLive = match.status === "live";

  return (
    <article
      className={cn(
        "camp-surface camp-card flex flex-col gap-3 p-4",
        isLive && "camp-match-live camp-live-pulse",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {match.roundLabel}
        </span>
        <Badge
          variant={isLive ? "default" : "secondary"}
          className={cn(
            "gap-1 font-semibold uppercase tracking-wide",
            isLive &&
              "border-[var(--camp-tier-gold)] bg-[var(--camp-gold-gradient)] text-[var(--camp-gold-fg)]",
          )}
        >
          {isLive ? <RadioIcon aria-hidden="true" className="size-3 animate-pulse" /> : null}
          {STATUS_LABEL[match.status]}
        </Badge>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
          <TeamBadge teamId={match.homeTeamId} name={home?.name} />
          {hasScore ? (
            <span className="font-heading text-3xl font-bold tabular-nums tracking-tight text-foreground">
              {match.result!.homeScore}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          )}
        </div>

        <div className="flex flex-col items-center gap-1 px-1">
          <span className="font-heading text-lg font-semibold text-muted-foreground">VS</span>
          <span className="text-[0.65rem] font-medium uppercase tabular-nums text-muted-foreground">
            {match.durationMinutes} min
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
          <TeamBadge teamId={match.awayTeamId} name={away?.name} />
          {hasScore ? (
            <span className="font-heading text-3xl font-bold tabular-nums tracking-tight text-foreground">
              {match.result!.awayScore}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          )}
        </div>
      </div>

      {match.result?.decidedByPenalties ? (
        <p className="text-center text-xs text-muted-foreground">Decidido nos pênaltis</p>
      ) : null}
    </article>
  );
}
