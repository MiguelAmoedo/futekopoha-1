import { UserIcon } from "lucide-react";

import type { CampPlayer } from "@/lib/camp/types";
import { getTeamById } from "@/lib/camp/mock-data";
import {
  futCardStats,
  futPosition,
  futRating,
  getTeamColor,
  starCount,
} from "@/lib/camp/fut-utils";
import { cn } from "@/lib/utils";

type FutPlayerCardSize = "xs" | "sm" | "md" | "lg";

type FutPlayerCardProps = {
  player: CampPlayer;
  size?: FutPlayerCardSize;
  lineIndex?: number;
  chemistryStyle?: string;
  className?: string;
  style?: React.CSSProperties;
  as?: "article" | "div";
  iconOnly?: boolean;
};

const SIZE_CLASS: Record<FutPlayerCardSize, string> = {
  xs: "fut-card--xs",
  sm: "fut-card--sm",
  md: "fut-card--md",
  lg: "fut-card--lg",
};

export function FutPlayerCard({
  player,
  size = "md",
  lineIndex,
  chemistryStyle,
  className,
  style,
  as: Comp = "article",
  iconOnly = false,
}: FutPlayerCardProps) {
  const team = getTeamById(player.teamId);
  const rating = futRating(player);
  const position = futPosition(player, lineIndex);
  const stars = starCount(rating);
  const chem = chemistryStyle ?? (position === "MC" ? "BAS" : position);
  const stats = iconOnly || size === "xs" ? [] : futCardStats(player);
  const showDecor = !iconOnly && size !== "xs";
  const showName = !iconOnly;
  const showStrip = !iconOnly;

  return (
    <Comp
      className={cn("fut-card", SIZE_CLASS[size], "fut-card--gold", className)}
      style={style}
      aria-label={Comp === "article" ? `${player.name}, ${rating} OVR, ${position}` : undefined}
    >
      <div className="fut-card__shell" aria-hidden="true">
        <span className="fut-card__flare" />
      </div>

      <div className="fut-card__inner">
        <div className="fut-card__header">
          <div className="fut-card__rating-block">
            <span className="fut-card__rating">{rating}</span>
            <span className="fut-card__position">{position}</span>
          </div>
        </div>

        <div className="fut-card__photo">
          <div className="fut-card__photo-rays" aria-hidden="true" />
          <span className="fut-card__initials" aria-hidden="true">
            <UserIcon />
          </span>
          {showDecor ? (
            <>
              <span className="fut-card__chem" title={chem}>
                {chem}
              </span>
              <span
                className="fut-card__skill"
                title={`${stars} estrelas · pé fraco ${stars}`}
              >
                {stars}★{stars}
              </span>
            </>
          ) : null}
        </div>

        {showName ? (
          <div className="fut-card__name-row">
            <span className="fut-card__name">{player.name}</span>
          </div>
        ) : null}

        {stats.length > 0 ? (
          <div className="fut-card__stats" aria-hidden="true">
            {stats.map((stat) => (
              <div key={stat.label} className="fut-card__stat">
                <span className="fut-card__stat-label">{stat.label}</span>
                <span className="fut-card__stat-value">{stat.value}</span>
              </div>
            ))}
          </div>
        ) : null}

        {showStrip ? (
          <div className="fut-card__strip">
            <span
              className="fut-card__team-badge"
              style={{ background: getTeamColor(player.teamId) }}
              title={team?.name}
              aria-hidden="true"
            />
            <span className="fut-card__league-shield" aria-hidden="true" />
            <span className="fut-card__number" aria-hidden="true">
              #{player.number}
            </span>
          </div>
        ) : null}
      </div>
    </Comp>
  );
}
