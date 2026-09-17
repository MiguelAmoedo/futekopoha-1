import type { TeamId } from "@/lib/camp/types";
import { cn } from "@/lib/utils";

const TEAM_STYLES: Record<TeamId, string> = {
  A: "bg-sky-600 text-white",
  B: "bg-amber-500 text-amber-950",
  C: "bg-violet-600 text-white",
  D: "bg-rose-600 text-white",
};

type TeamBadgeProps = {
  teamId: TeamId;
  name?: string;
  size?: "sm" | "md";
  className?: string;
};

export function TeamBadge({ teamId, name, size = "md", className }: TeamBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-lg font-semibold",
        TEAM_STYLES[teamId],
        size === "sm" ? "size-7 text-xs" : "min-h-8 min-w-8 px-2 text-sm",
        className,
      )}
    >
      {name ?? teamId}
    </span>
  );
}
