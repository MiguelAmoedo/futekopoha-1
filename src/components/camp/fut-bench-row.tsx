import type { CampPlayer } from "@/lib/camp/types";
import { FutPlayerCard } from "@/components/camp/fut-player-card";
import { cn } from "@/lib/utils";

type FutBenchRowProps = {
  substitutes: CampPlayer[];
  reserves?: CampPlayer[];
  topScorerId?: string;
  topAssisterId?: string;
  className?: string;
};

export function FutBenchRow({
  substitutes,
  reserves = [],
  className,
}: FutBenchRowProps) {
  return (
    <div className={cn("fut-bench", className)}>
      <div className="fut-bench__section">
        <span className="fut-bench__label">Substitutes</span>
        <div className="fut-bench__cards">
          {substitutes.map((player, i) => (
            <FutPlayerCard
              key={player.id}
              player={player}
              size="sm"
              className="fut-bench__card"
              style={{ zIndex: substitutes.length - i }}
            />
          ))}
        </div>
      </div>

      {reserves.length > 0 ? (
        <>
          <span className="fut-bench__divider" aria-hidden="true">
            RES
          </span>
          <div className="fut-bench__section">
            <div className="fut-bench__cards">
              {reserves.map((player, i) => (
                <FutPlayerCard
                  key={player.id}
                  player={player}
                  size="xs"
                  className="fut-bench__card"
                  style={{ zIndex: reserves.length - i }}
                />
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
