import type { CampMatch, CampStanding } from "@/lib/camp/types";
import { buildBracketSlots } from "@/lib/camp/tournament-utils";
import { CampCard } from "@/components/camp/camp-card";
import { TeamBadge } from "@/components/camp/team-badge";
import { Separator } from "@/components/ui/separator";
import { TrophyIcon } from "lucide-react";
import type { TeamId } from "@/lib/camp/types";

type BracketViewProps = {
  standings: CampStanding[];
  matches: CampMatch[];
};

export function BracketView({ standings, matches }: BracketViewProps) {
  const bracket = buildBracketSlots(standings, matches);

  return (
    <CampCard
      title="Chave"
      description="Mata-mata após a fase de pontos"
      contentClassName="flex flex-col gap-4"
    >
      <BracketMatch
        label="Semifinal · 1º x 4º"
        home={bracket.semi1[0]?.teamId}
        away={bracket.semi1[1]?.teamId}
      />
      <BracketMatch
        label="Semifinal · 2º x 3º"
        home={bracket.semi2[0]?.teamId}
        away={bracket.semi2[1]?.teamId}
      />
      <Separator className="bg-[var(--camp-surface-border)]" />
      <div className="camp-bracket-final flex flex-col items-center gap-3 rounded-lg px-4 py-4">
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--camp-gold-strong)]">
          <TrophyIcon aria-hidden="true" className="size-3.5 text-[var(--camp-gold)]" />
          Final
        </span>
        <div className="flex items-center gap-3">
          {bracket.final[0]?.teamId ? (
            <TeamBadge teamId={bracket.final[0].teamId} />
          ) : (
            <span className="text-sm text-muted-foreground">SF1</span>
          )}
          <span className="font-heading text-lg font-semibold text-muted-foreground">VS</span>
          {bracket.final[1]?.teamId ? (
            <TeamBadge teamId={bracket.final[1].teamId} />
          ) : (
            <span className="text-sm text-muted-foreground">SF2</span>
          )}
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Vencedores das semifinais · 5 min · empate = pênaltis
        </p>
      </div>
    </CampCard>
  );
}

function BracketMatch({
  label,
  home,
  away,
}: {
  label: string;
  home: TeamId | null | undefined;
  away: TeamId | null | undefined;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-[var(--camp-surface-border)] bg-[oklch(0.22_0.035_260/0.75)] p-3">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="flex items-center justify-center gap-3">
        {home ? <TeamBadge teamId={home} /> : <span className="text-sm text-muted-foreground">—</span>}
        <span className="font-heading text-sm font-semibold text-muted-foreground">VS</span>
        {away ? <TeamBadge teamId={away} /> : <span className="text-sm text-muted-foreground">—</span>}
      </div>
    </div>
  );
}
