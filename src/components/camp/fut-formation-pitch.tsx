import type { CampPlayer } from "@/lib/camp/types";
import { FutPlayerCard } from "@/components/camp/fut-player-card";
import { cn } from "@/lib/utils";

type FutFormationPitchProps = {
  players: CampPlayer[];
  topScorerId?: string;
  topAssisterId?: string;
  showPedestals?: boolean;
  variant?: "diamond" | "line";
  className?: string;
};

function pickGoalkeeper(players: CampPlayer[]): CampPlayer | undefined {
  return (
    players.find((player) => player.role === "goleiro") ??
    players.find((player) => player.number === 1)
  );
}

export function FutFormationPitch({
  players,
  className,
}: FutFormationPitchProps) {
  const goalkeeper = pickGoalkeeper(players);
  const line = players
    .filter((player) => player.id !== goalkeeper?.id && player.role !== "goleiro")
    .sort((a, b) => a.number - b.number)
    .slice(0, 4);

  return (
    <div className={cn("fut-formation-pitch", className)}>
      <div className="fut-formation-pitch__block">
        <p className="fut-formation-pitch__label">Linha</p>
        <div className="fut-formation-pitch__line">
          {line.map((player, index) => (
            <FutPlayerCard
              key={player.id}
              player={player}
              size="md"
              lineIndex={index}
            />
          ))}
        </div>
      </div>

      <div className="fut-formation-pitch__block fut-formation-pitch__block--gk">
        <p className="fut-formation-pitch__label">Goleiro</p>
        {goalkeeper ? (
          <FutPlayerCard player={goalkeeper} size="md" />
        ) : (
          <div className="fut-formation-pitch__slot--empty" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}
