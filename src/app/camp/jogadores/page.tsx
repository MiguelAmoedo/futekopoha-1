import type { Metadata } from "next";

import { CampSectionLabel } from "@/components/camp/camp-section-label";
import { CampShell } from "@/components/camp/camp-shell";
import { FutPlayerCard } from "@/components/camp/fut-player-card";
import { MOCK_TOURNAMENT } from "@/lib/camp/mock-data";

export const metadata: Metadata = {
  title: "Jogadores",
  description: "Elenco mock — Copa Resenha Kopoha 1",
};

export default function CampJogadoresPage() {
  const allPlayers = MOCK_TOURNAMENT.players;

  const sortedForGrid = [...allPlayers].sort((a, b) => {
    if (a.teamId !== b.teamId) return a.teamId.localeCompare(b.teamId);
    if (a.role !== b.role) return a.role === "goleiro" ? -1 : 1;
    return a.number - b.number;
  });

  return (
    <CampShell
      title="Jogadores"
      subtitle={`${allPlayers.length} atletas · estilo FUT`}
      backHref="/camp"
      className="gap-4"
      wide
    >
      <section className="flex flex-col gap-2.5">
        <CampSectionLabel>Todos os jogadores</CampSectionLabel>
        <div className="fut-card-grid">
          {sortedForGrid.map((player) => (
            <FutPlayerCard key={player.id} player={player} size="lg" />
          ))}
        </div>
      </section>
    </CampShell>
  );
}
