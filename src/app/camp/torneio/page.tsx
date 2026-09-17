import type { Metadata } from "next";

import Link from "next/link";

import { CampCard } from "@/components/camp/camp-card";

import { CampShell } from "@/components/camp/camp-shell";

import { CampTournamentTabs } from "@/components/camp/camp-tournament-tabs";

import { TeamFilterRow } from "@/components/camp/team-filter-row";

import { CAMP_EVENT_SUMMARY } from "@/lib/camp/constants";
import { getTournamentData } from "@/lib/camp/tournament-data";

import { Button } from "@/components/ui/button";

import { SettingsIcon } from "lucide-react";



export const metadata: Metadata = {

  title: "Torneio",

  description: "Tabela, jogos e chave — Copa Resenha Kopoha 1",

};



export default async function CampTorneioPage() {

  const tournament = await getTournamentData();



  return (

    <CampShell

      title="Camp"

      subtitle={tournament.name}

    >

      <CampCard

        header={<TeamFilterRow />}

        title={tournament.subtitle}

        description={`${CAMP_EVENT_SUMMARY} · Fase 1 → semifinais 1º×4º e 2º×3º → final`}

        contentClassName="text-sm text-muted-foreground"

      >

        <div className="flex flex-col gap-3">

          <span>

            Cada partida: {tournament.matchDurationMinutes} min · empate encerra nos pênaltis

          </span>

          <Button

            nativeButton={false}

            render={<Link href="/camp/admin" />}

            variant="outline"

            size="sm"

            className="w-fit min-h-9 cursor-pointer gap-1.5"

          >

            <SettingsIcon aria-hidden="true" className="size-4" />

            Admin do torneio

          </Button>

        </div>

      </CampCard>



      <CampTournamentTabs

        standings={tournament.standings}

        matches={tournament.matches}

        teams={tournament.teams}

      />

    </CampShell>

  );

}

