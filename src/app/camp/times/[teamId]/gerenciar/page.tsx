import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CampShell } from "@/components/camp/camp-shell";
import { CampSectionLabel } from "@/components/camp/camp-section-label";
import { FutFormationPitch } from "@/components/camp/fut-formation-pitch";
import { TeamLineupEditor } from "@/components/camp/team-lineup-editor";
import {
  getTeamFromDb,
  getTournamentData,
  TOURNAMENT_SLUG,
} from "@/lib/camp/tournament-data";
import { getLineupPlayers } from "@/lib/camp/tournament-utils";
import { teamSlugToId } from "@/lib/camp/mock-data";
import { ALL_TEAM_ROUTE_SLUGS } from "@/lib/camp/teams-config";
import { verifyTeamManagerAccess } from "@/actions/camp";

type GerenciarPageProps = {
  params: Promise<{ teamId: string }>;
  searchParams: Promise<{ token?: string }>;
};

export function generateStaticParams() {
  return ALL_TEAM_ROUTE_SLUGS.map((teamId) => ({ teamId }));
}

export async function generateMetadata({ params }: GerenciarPageProps): Promise<Metadata> {
  const { teamId: slug } = await params;
  const teamId = teamSlugToId(slug);
  const tournament = await getTournamentData();
  const team = teamId ? tournament.teams.find((t) => t.id === teamId) : undefined;
  return {
    title: team ? `Gerenciar · ${team.name}` : "Gerenciar time",
    description: "Escalação e elenco — Copa Resenha Kopoha 1",
  };
}

export default async function GerenciarTimePage({ params, searchParams }: GerenciarPageProps) {
  const { teamId: slug } = await params;
  const { token } = await searchParams;
  const teamId = teamSlugToId(slug);

  if (!teamId) notFound();

  const managerToken = token ?? "";
  const allowed = await verifyTeamManagerAccess(teamId, managerToken);

  const tournament = await getTournamentData();
  const teamMeta = tournament.teams.find((t) => t.id === teamId);
  if (!teamMeta) notFound();

  const dbTeam = await getTeamFromDb(TOURNAMENT_SLUG, teamId);
  const players = tournament.players.filter((p) => p.teamId === teamId);
  const lineupIds = dbTeam
    ? dbTeam.players.filter((p) => p.inLineup).map((p) => p.id)
    : players.slice(0, 5).map((p) => p.id);

  const startingXi = getLineupPlayers(players, new Set(lineupIds));
  const teamMatches = tournament.matches.filter(
    (m) => m.homeTeamId === teamId || m.awayTeamId === teamId,
  );

  if (!allowed) {
    return (
      <CampShell
        title={teamMeta.name}
        subtitle="Gerenciar time"
        backHref={`/camp/times/${slug}`}
        hideNav
      >
        <div className="camp-surface camp-card p-4 text-sm text-muted-foreground">
          <p>Acesso restrito ao gerente do time.</p>
          <p className="mt-2">
            Use <code className="text-foreground">?token=camp-manager-{slug}</code> (após seed).
          </p>
          <p className="mt-2">
            Admin: <code className="text-foreground">?token=camp-admin-dev</code>
          </p>
        </div>
      </CampShell>
    );
  }

  return (
    <CampShell
      title={teamMeta.name}
      subtitle="Gerenciar · 5×5"
      backHref={`/camp/times/${slug}`}
      hideNav
      wide
      className="gap-4"
    >
      <section className="flex flex-col gap-2.5">
        <CampSectionLabel accent>Escalação atual</CampSectionLabel>
        <FutFormationPitch players={startingXi} variant="line" />
      </section>

      <TeamLineupEditor
        teamKey={teamId}
        players={players}
        lineupIds={lineupIds}
        managerToken={managerToken}
      />

      <section className="flex flex-col gap-2">
        <CampSectionLabel>Agenda do time</CampSectionLabel>
        <div className="flex flex-col gap-2">
          {teamMatches.map((match) => (
            <div
              key={match.id}
              className="camp-surface rounded-lg border border-[var(--camp-surface-border)] px-3 py-2 text-sm"
            >
              <p className="font-semibold">{match.roundLabel}</p>
              <p className="text-muted-foreground">
                {match.homeTeamId} × {match.awayTeamId} ·{" "}
                {match.status === "finished"
                  ? `${match.result?.homeScore ?? 0}-${match.result?.awayScore ?? 0}`
                  : match.status === "live"
                    ? "Ao vivo"
                    : "Agendado"}
              </p>
            </div>
          ))}
        </div>
      </section>
    </CampShell>
  );
}
