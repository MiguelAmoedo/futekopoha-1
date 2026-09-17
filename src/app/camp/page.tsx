import type { Metadata } from "next";

import Link from "next/link";

import {

  ChevronRightIcon,

  ClockIcon,

  LayoutGridIcon,

  RadioIcon,

  ShieldIcon,

  TrophyIcon,

  UsersIcon,

} from "lucide-react";

import { CampSectionLabel } from "@/components/camp/camp-section-label";

import { CampShell } from "@/components/camp/camp-shell";

import { FutFormationPitch } from "@/components/camp/fut-formation-pitch";

import { FutSquadPanel } from "@/components/camp/fut-squad-panel";

import { MatchCard } from "@/components/camp/match-card";

import {

  getTopAssister,

  getTopScorer,

} from "@/components/camp/player-stat-badges";

import { getTournamentData } from "@/lib/camp/tournament-data";

import { squadChemistry, squadRating } from "@/lib/camp/fut-utils";

import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";



export const metadata: Metadata = {

  title: "Copa Resenha Kopoha 1",

  description: "Hub do campeonato",

};



const quickLinks = [

  {

    href: "/camp/torneio",

    label: "Ver camp",

    description: "Tabela, jogos e chave",

    icon: LayoutGridIcon,

  },

  {

    href: "/camp/times",

    label: "Times A–D",

    description: "Escalações e capitães",

    icon: ShieldIcon,

  },

  {

    href: "/camp/jogadores",

    label: "Jogadores",

    description: "Cartas FUT do elenco",

    icon: UsersIcon,

  },

] as const;



export default async function CampHomePage() {

  const tournament = await getTournamentData();



  const liveMatch = tournament.matches.find((match) => match.status === "live");

  const finishedCount = tournament.matches.filter(

    (match) => match.status === "finished",

  ).length;



  const leaderTeamId = tournament.standings[0]?.teamId ?? "B";

  const squadPlayers = tournament.players

    .filter((p) => p.teamId === leaderTeamId)

    .slice(0, 5);

  const topScorer = getTopScorer(tournament.players);

  const topAssister = getTopAssister(tournament.players);



  return (

    <CampShell

      eyebrow="Campeonato"

      title={tournament.name}

      subtitle={tournament.subtitle}

      className="gap-4"

    >

      <section className="fut-squad-hero">

        <div className="flex flex-wrap items-center gap-2">

          <Badge className="rounded-sm border-transparent bg-[color-mix(in_oklch,var(--camp-gold)_22%,oklch(0.2_0.035_260))] text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--camp-gold-strong)]">

            Líder: Time {leaderTeamId}

          </Badge>

          <Badge

            variant="outline"

            className="rounded-sm border-[var(--camp-surface-border)] bg-[oklch(0.22_0.035_260)] text-[0.65rem] font-semibold uppercase tracking-wider"

          >

            5×5 · {tournament.matchDurationMinutes} min

          </Badge>

        </div>



        <div className="relative mt-2">

          <FutFormationPitch

            players={squadPlayers}

            topScorerId={topScorer.id}

            topAssisterId={topAssister.id}

          />

          <FutSquadPanel

            rating={squadRating(squadPlayers)}

            chemistry={squadChemistry(squadPlayers)}

            className="fut-squad-hero__panel"

          />

        </div>



        <div className="flex flex-col gap-1.5 text-sm camp-chrome-muted">

          <div className="flex items-center gap-2">

            <ClockIcon aria-hidden="true" className="size-4 shrink-0 text-[var(--camp-gold)]" />

            <span>

              ~{tournament.totalDurationMinutes} min · {tournament.penaltyRule}

            </span>

          </div>

          <div className="flex items-center gap-2">

            <TrophyIcon aria-hidden="true" className="size-4 shrink-0 text-[var(--camp-gold)]" />

            <span>

              {finishedCount} jogos encerrados · {tournament.format}

            </span>

          </div>

        </div>

      </section>



      {liveMatch ? (

        <section className="flex flex-col gap-2.5">

          <CampSectionLabel icon={RadioIcon} accent>

            Ao vivo agora

          </CampSectionLabel>

          <MatchCard match={liveMatch} teams={tournament.teams} />

        </section>

      ) : null}



      <section className="flex flex-col gap-2.5">

        <CampSectionLabel>Atalhos</CampSectionLabel>

        <div className="flex flex-col gap-2">

          {quickLinks.map(({ href, label, description, icon: Icon }) => (

            <Link

              key={href}

              href={href}

              className={cn(

                "camp-surface camp-card group flex min-h-[3.75rem] cursor-pointer items-center gap-3 p-3",

                "transition-[box-shadow,border-color,transform] duration-200",

                "hover:-translate-y-px hover:border-[color-mix(in_oklch,var(--camp-gold)_45%,var(--camp-surface-border))] hover:shadow-[0_4px_24px_-6px_var(--camp-tier-gold-glow)]",

                "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--camp-gold)]/50",

              )}

            >

              <span className="flex size-11 shrink-0 items-center justify-center rounded-md border border-[color-mix(in_oklch,var(--camp-gold)_30%,transparent)] bg-[color-mix(in_oklch,var(--camp-gold)_12%,oklch(0.2_0.035_260))] text-[var(--camp-gold)] transition-colors group-hover:bg-[color-mix(in_oklch,var(--camp-gold)_22%,oklch(0.2_0.035_260))] group-hover:shadow-[0_0_12px_-2px_var(--camp-tier-gold-glow)]">

                <Icon aria-hidden="true" className="size-5" />

              </span>

              <span className="flex min-w-0 flex-1 flex-col gap-0.5">

                <span className="font-heading text-sm uppercase tracking-wide">{label}</span>

                <span className="text-xs text-muted-foreground">{description}</span>

              </span>

              <ChevronRightIcon

                aria-hidden="true"

                className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-[var(--camp-gold)]"

              />

            </Link>

          ))}

        </div>

      </section>

    </CampShell>

  );

}

