"use client";

import type { CampMatch, CampStanding, CampTeam } from "@/lib/camp/types";
import { BracketView } from "@/components/camp/bracket-view";
import { MatchCard } from "@/components/camp/match-card";
import { StandingsTable } from "@/components/camp/standings-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type CampTournamentTabsProps = {
  standings: CampStanding[];
  matches: CampMatch[];
  teams?: CampTeam[];
};

const tabTriggerClass = cn(
  "camp-tab-trigger min-h-10 flex-1 cursor-pointer rounded-md px-2 text-sm font-semibold uppercase tracking-wide",
  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--camp-gold)]/50",
);

export function CampTournamentTabs({ standings, matches, teams }: CampTournamentTabsProps) {
  const fase1 = matches.filter((match) => match.phase === "fase1");
  const knockout = matches.filter((match) => match.phase !== "fase1");

  return (
    <Tabs defaultValue="classificacao" className="flex flex-col gap-3">
      <div className="camp-tab-shell p-1">
        <TabsList className="camp-tab-list grid h-auto w-full grid-cols-3 gap-1 p-1">
          <TabsTrigger value="classificacao" className={tabTriggerClass}>
            Tabela
          </TabsTrigger>
          <TabsTrigger value="jogos" className={tabTriggerClass}>
            Jogos
          </TabsTrigger>
          <TabsTrigger value="chave" className={tabTriggerClass}>
            Chave
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="classificacao" className="flex flex-col gap-3">
        <StandingsTable standings={standings} teams={teams} />
      </TabsContent>

      <TabsContent value="jogos" className="flex flex-col gap-4">
        <section className="flex flex-col gap-2">
          <h2 className="camp-chrome font-heading text-base font-semibold uppercase tracking-wide">
            Fase 1
          </h2>
          <div className="flex flex-col gap-2">
            {fase1.map((match) => (
              <MatchCard key={match.id} match={match} teams={teams} />
            ))}
          </div>
        </section>
        <section className="flex flex-col gap-2">
          <h2 className="camp-chrome font-heading text-base font-semibold uppercase tracking-wide">
            Mata-mata
          </h2>
          <div className="flex flex-col gap-2">
            {knockout.map((match) => (
              <MatchCard key={match.id} match={match} teams={teams} />
            ))}
          </div>
        </section>
      </TabsContent>

      <TabsContent value="chave">
        <BracketView standings={standings} matches={matches} />
      </TabsContent>
    </Tabs>
  );
}
