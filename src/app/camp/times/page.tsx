import type { Metadata } from "next";

import { CampShell } from "@/components/camp/camp-shell";
import { CampTimesView } from "@/components/camp/camp-times-view";
import { getTournamentData } from "@/lib/camp/tournament-data";

export const metadata: Metadata = {
  title: "Times",
  description: "Liverpool, Real Madrid, Time C e Time D — Copa Resenha Kopoha 1",
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
      subtitle="Liverpool · Real Madrid · Time C · Time D"
      backHref="/camp/torneio"
      className="gap-4"
    >
      <CampTimesView teams={teams} />
    </CampShell>
  );
}
