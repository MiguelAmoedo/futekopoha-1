import type { Metadata } from "next";

import Link from "next/link";

import { notFound } from "next/navigation";

import { CampShell } from "@/components/camp/camp-shell";

import { CampSectionLabel } from "@/components/camp/camp-section-label";

import { FutFormationPitch } from "@/components/camp/fut-formation-pitch";

import {

  getTopAssister,

  getTopScorer,

} from "@/components/camp/player-stat-badges";

import {

  getTeamFromDb,

  getTournamentData,

  TOURNAMENT_SLUG,

} from "@/lib/camp/tournament-data";

import { getLineupPlayers } from "@/lib/camp/tournament-utils";

import { teamSlugToId } from "@/lib/camp/mock-data";
import { ALL_TEAM_ROUTE_SLUGS, teamIdToRouteSlug } from "@/lib/camp/teams-config";

import { Button } from "@/components/ui/button";

import { SettingsIcon } from "lucide-react";



type CampTeamPageProps = {

  params: Promise<{ teamId: string }>;

};



export function generateStaticParams() {

  return ALL_TEAM_ROUTE_SLUGS.map((teamId) => ({ teamId }));

}



export async function generateMetadata({ params }: CampTeamPageProps): Promise<Metadata> {

  const { teamId: slug } = await params;

  const teamId = teamSlugToId(slug);

  const tournament = await getTournamentData();

  const team = teamId ? tournament.teams.find((t) => t.id === teamId) : undefined;



  return {

    title: team ? team.name : "Time",

    description: team

      ? `Formação 5×5 — ${team.name} · Copa Resenha Kopoha 1`

      : "Formação do time",

  };

}



export default async function CampTeamPage({ params }: CampTeamPageProps) {

  const { teamId: slug } = await params;

  const teamId = teamSlugToId(slug);



  if (!teamId) {

    notFound();

  }



  const tournament = await getTournamentData();

  const team = tournament.teams.find((t) => t.id === teamId);

  if (!team) {

    notFound();

  }



  const dbTeam = await getTeamFromDb(TOURNAMENT_SLUG, teamId);

  const teamPlayers = tournament.players.filter((p) => p.teamId === teamId);

  const lineupIds = dbTeam

    ? new Set(dbTeam.players.filter((p) => p.inLineup).map((p) => p.id))

    : new Set(teamPlayers.slice(0, 5).map((p) => p.id));



  const startingXi = getLineupPlayers(teamPlayers, lineupIds);

  const topScorer = getTopScorer(tournament.players);

  const topAssister = getTopAssister(tournament.players);

  const standing = tournament.standings.find((row) => row.teamId === teamId);



  return (

    <CampShell

      title={team.name}

      subtitle={`Capitão: ${team.captain} · 4 na linha + 1 no gol · 5×5`}

      eyebrow={standing ? `${standing.position}º na tabela` : undefined}

      backHref="/camp/times"

      className="gap-4"

      wide

    >

      <Button

        nativeButton={false}

        render={
          <Link
            href={`/camp/times/${teamIdToRouteSlug(teamId)}/gerenciar?token=camp-manager-${teamId.toLowerCase()}`}
          />
        }

        variant="outline"

        size="sm"

        className="w-fit min-h-9 cursor-pointer gap-1.5"

      >

        <SettingsIcon aria-hidden="true" className="size-4" />

        Gerenciar time

      </Button>



      <section className="flex flex-col gap-2.5 pb-8">

        <CampSectionLabel accent>Formação</CampSectionLabel>

        <FutFormationPitch

          players={startingXi}

          variant="line"

          topScorerId={topScorer.id}

          topAssisterId={topAssister.id}

        />

      </section>

    </CampShell>

  );

}

