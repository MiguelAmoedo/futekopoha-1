import type { StandingTier } from "@/lib/camp/tiers";
import { getStandingTier, TIER_BADGE_CLASS } from "@/lib/camp/tiers";
import { cn } from "@/lib/utils";

type CampTierBadgeProps = {
  position: number;
  tier?: StandingTier;
  className?: string;
};

export function CampTierBadge({ position, tier, className }: CampTierBadgeProps) {
  const resolvedTier = tier ?? getStandingTier(position);

  return (
    <span
      className={cn(
        "inline-flex size-7 shrink-0 items-center justify-center rounded-full border font-heading text-sm font-bold tabular-nums",
        TIER_BADGE_CLASS[resolvedTier],
        className,
      )}
    >
      {position}
    </span>
  );
}
