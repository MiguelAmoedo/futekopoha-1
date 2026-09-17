import { starCount } from "@/lib/camp/fut-utils";
import { cn } from "@/lib/utils";

type FutSquadPanelProps = {
  rating: number;
  chemistry: number;
  label?: string;
  className?: string;
};

export function FutSquadPanel({
  rating,
  chemistry,
  label = "OVERALL SQUAD",
  className,
}: FutSquadPanelProps) {
  const stars = starCount(rating);

  return (
    <aside
      className={cn("fut-squad-panel", className)}
      aria-label={`${label}: rating ${rating}, química ${chemistry}`}
    >
      <h2 className="fut-squad-panel__title">{label}</h2>

      <div className="fut-squad-panel__row">
        <span className="fut-squad-panel__label">Rating</span>
        <div className="fut-squad-panel__rating-block">
          <span className="fut-squad-panel__rating">{rating}</span>
          <div className="fut-squad-panel__stars" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "fut-squad-panel__star",
                  i < stars && "fut-squad-panel__star--filled",
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="fut-squad-panel__row">
        <span className="fut-squad-panel__label">Chemistry</span>
        <div className="fut-squad-panel__chem-block">
          <span className="fut-squad-panel__chem-value">{chemistry}</span>
          <div className="fut-squad-panel__chem-bar" role="presentation">
            <div
              className="fut-squad-panel__chem-fill"
              style={{ width: `${Math.min(100, chemistry)}%` }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
