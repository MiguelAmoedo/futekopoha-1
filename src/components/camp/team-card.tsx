import Link from "next/link";
import { ChevronRightIcon, TrophyIcon, Users2Icon } from "lucide-react";
import type { CampPlayer, CampTeam } from "@/lib/camp/types";
import { getPlayersByTeam } from "@/lib/camp/mock-data";
import { futPosition } from "@/lib/camp/fut-utils";
import { getStandingTier } from "@/lib/camp/tiers";
import { FutPlayerCard } from "@/components/camp/fut-player-card";
import { TeamBadge } from "@/components/camp/team-badge";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type TeamCardProps = {
  team: CampTeam;
  href: string;
  standingPosition?: number;
};

function sortRoster(players: CampPlayer[]) {
  return [...players].sort((a, b) => {
    if (a.role !== b.role) return a.role === "goleiro" ? -1 : 1;
    return a.number - b.number;
  });
}

export function TeamCard({ team, href, standingPosition }: TeamCardProps) {
  const players = sortRoster(getPlayersByTeam(team.id));
  const linePlayers = players.filter((player) => player.role === "linha");
  const tier = standingPosition ? getStandingTier(standingPosition) : null;

  return (
    <Link
      href={href}
      aria-label={`Acessar ${team.name}`}
      className={cn(
        "camp-surface camp-card group relative block overflow-hidden transition-[box-shadow,border-color] outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-[var(--camp-gold)]/50",
        tier === "gold" && "camp-card--tier-gold",
        tier === "silver" && "camp-card--tier-silver",
        tier === "bronze" && "camp-card--tier-bronze",
      )}
    >
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="flex min-w-0 items-center gap-3">
          <TeamBadge teamId={team.id} />
          <div className="flex min-w-0 flex-col gap-0.5">
            <h3 className="font-heading text-xl tracking-wide">{team.name}</h3>
            <p className="text-sm text-muted-foreground">Capitão: {team.captain}</p>
          </div>
        </div>
        <span
          aria-hidden="true"
          className={cn(
            buttonVariants({ variant: "outline", size: "xs" }),
            "group-hover:bg-muted group-hover:text-foreground",
          )}
        >
          Acessar
          <ChevronRightIcon data-icon="inline-end" />
        </span>
      </div>

      <Separator />

      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-1.5">
          <Users2Icon
            aria-hidden="true"
            className="size-3.5 shrink-0 text-[var(--camp-gold)]"
          />
          <span className="text-[0.625rem] font-bold uppercase tracking-wider text-muted-foreground">
            Elenco
          </span>
        </div>

        <ul className="team-roster mx-auto grid w-fit max-w-full grid-cols-2 gap-x-3 gap-y-3">
          {players.map((player) => {
            const lineIndex =
              player.role === "linha"
                ? linePlayers.findIndex((linePlayer) => linePlayer.id === player.id)
                : undefined;
            const position = futPosition(player, lineIndex);

            return (
              <li
                key={player.id}
                className="grid min-w-0 grid-cols-[var(--fut-card-w-xs)_minmax(0,1fr)] items-center gap-2.5"
              >
                <FutPlayerCard
                  as="div"
                  player={player}
                  size="xs"
                  iconOnly
                  lineIndex={lineIndex}
                  className="pointer-events-none"
                />
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="truncate text-sm font-semibold leading-tight">
                    {player.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline">{position}</Badge>
                    <span className="text-xs text-muted-foreground">
                      #{player.number}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <Separator />

      <footer className="flex items-center gap-1.5 p-4 text-xs text-muted-foreground">
        <TrophyIcon aria-hidden="true" className="size-3.5 shrink-0 text-[var(--camp-gold)]" />
        <span>
          {team.playerCount} jogadores · {team.wins} vitória{team.wins === 1 ? "" : "s"} na fase 1
        </span>
      </footer>
    </Link>
  );
}
