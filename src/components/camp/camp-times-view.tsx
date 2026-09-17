"use client";

import Link from "next/link";
import { useState } from "react";
import type { CampTeam, TeamId } from "@/lib/camp/types";
import { teamIdToSlug } from "@/lib/camp/mock-data";
import { CampSectionLabel } from "@/components/camp/camp-section-label";
import { TeamCard } from "@/components/camp/team-card";
import { TeamFilterRow } from "@/components/camp/team-filter-row";

type TeamEntry = {
  team: CampTeam;
  position?: number;
};

type CampTimesViewProps = {
  teams: TeamEntry[];
};

export function CampTimesView({ teams }: CampTimesViewProps) {
  const [selectedTeam, setSelectedTeam] = useState<TeamId | null>(null);

  const visibleTeams = selectedTeam
    ? teams.filter(({ team }) => team.id === selectedTeam)
    : teams;

  return (
    <>
      <TeamFilterRow
        selected={selectedTeam}
        onSelect={setSelectedTeam}
        className="camp-surface camp-card p-4"
      />

      <CampSectionLabel>
        {selectedTeam ? `Time ${selectedTeam}` : "Todos os times"}
      </CampSectionLabel>

      <div className="flex flex-col gap-4">
        {visibleTeams.map(({ team, position }) => (
          <Link
            key={team.id}
            href={`/camp/times/${teamIdToSlug(team.id)}`}
            className="block rounded-xl focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--camp-gold)]/50"
          >
            <TeamCard team={team} standingPosition={position} />
          </Link>
        ))}
      </div>
    </>
  );
}
