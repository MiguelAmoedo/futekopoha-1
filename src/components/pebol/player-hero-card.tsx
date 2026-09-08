import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { JogadorWithStats } from "@/actions/jogador";
import { PitchCard } from "@/components/pebol/page-shell";
import { SharePlayerButton } from "@/components/pebol/share-player-button";
import { TrophyIcon, TargetIcon, MedalIcon, StarIcon } from "lucide-react";

type PlayerHeroCardProps = {
  jogador: JogadorWithStats & {
    premios?: { id: string; titulo: string }[];
  };
  shareUrl: string;
};

export function PlayerHeroCard({ jogador, shareUrl }: PlayerHeroCardProps) {
  const stats = jogador.estatistica;
  const initials = jogador.nome
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const statItems = [
    { label: "Pebols", value: stats?.pebols ?? 0, icon: StarIcon },
    { label: "Gols", value: stats?.gols ?? 0, icon: TargetIcon },
    { label: "Vitórias", value: stats?.vitorias ?? 0, icon: TrophyIcon },
    { label: "Prêmios", value: stats?.premiosCount ?? 0, icon: MedalIcon },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PitchCard className="relative overflow-hidden bg-gradient-to-br from-primary/15 via-card to-primary/5 p-0">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        />
        <div className="flex flex-col items-center gap-4 px-4 pb-6 pt-8">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary to-primary/60 opacity-80 blur-sm" />
            <Avatar className="relative size-28 border-[4px] border-card shadow-lg">
              {jogador.fotoUrl ? (
                <AvatarImage src={jogador.fotoUrl} alt={jogador.nome} />
              ) : null}
              <AvatarFallback className="bg-primary text-2xl font-bold text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <Badge variant="secondary" className="uppercase tracking-wide">
              Cartão PEBOL KOPOHA
            </Badge>
            <h1 className="font-heading text-4xl tracking-wide">
              {jogador.nome.toUpperCase()}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px bg-border">
          {statItems.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 bg-card px-3 py-4"
            >
              <Icon className="size-4 text-primary" />
              <span className="font-heading text-2xl">{value}</span>
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                {label}
              </span>
            </div>
          ))}
        </div>
      </PitchCard>

      {jogador.premios && jogador.premios.length > 0 ? (
        <PitchCard className="flex flex-col gap-3">
          <h2 className="font-heading text-xl tracking-wide">CONQUISTAS</h2>
          <div className="flex flex-wrap gap-2">
            {jogador.premios.map((premio) => (
              <Badge key={premio.id} variant="outline">
                {premio.titulo}
              </Badge>
            ))}
          </div>
        </PitchCard>
      ) : null}

      <SharePlayerButton shareUrl={shareUrl} />
    </div>
  );
}
