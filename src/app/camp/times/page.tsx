import type { Metadata } from "next";

import { ShieldIcon, TrophyIcon } from "lucide-react";

import { CampShell } from "@/components/camp/camp-shell";

import { CampTimesView } from "@/components/camp/camp-times-view";

import { CampTierBadge } from "@/components/camp/camp-tier-badge";

import { getTournamentData } from "@/lib/camp/tournament-data";



export const metadata: Metadata = {

  title: "Times",

  description: "Times A, B, C e D — Copa Resenha Kopoha 1",

};



const TIER_LABELS: Record<number, string> = {

  1: "Ouro",

  2: "Prata",

  3: "Bronze",

  4: "Neutro",

};



export default async function CampTimesPage() {

  const tournament = await getTournamentData();



  const teams = tournament.teams.map((team) => ({

    team,

    position: tournament.standings.find((row) => row.teamId === team.id)?.position,

  }));



  return (

    <CampShell

      title="Times"

      subtitle="Time A · B · C · D"

      backHref="/camp"

      className="gap-4"

    >

      <div className="camp-surface camp-card p-4">

        <div className="flex items-center gap-3">

          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[color-mix(in_oklch,var(--camp-gold)_35%,transparent)] bg-[color-mix(in_oklch,var(--camp-gold)_10%,oklch(0.2_0.035_260))] text-[var(--camp-gold)]">

            <ShieldIcon aria-hidden="true" className="size-5" />

          </span>

          <div className="flex flex-col gap-0.5">

            <h2 className="font-heading text-lg uppercase tracking-widest">Plantel</h2>

            <p className="text-sm text-muted-foreground">4 equipes · elenco 5×5</p>

          </div>

        </div>



        <div className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">

          <TrophyIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[var(--camp-gold)]" />

          <span>Posição na tabela vem da fase de pontos corridos.</span>

        </div>



        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">

          {([1, 2, 3, 4] as const).map((pos) => (

            <div key={pos} className="flex items-center gap-1.5">

              <CampTierBadge position={pos} className="size-6 text-[0.625rem]" />

              <span className="text-xs text-muted-foreground">{TIER_LABELS[pos]}</span>

            </div>

          ))}

        </div>

      </div>



      <CampTimesView teams={teams} />

    </CampShell>

  );

}

