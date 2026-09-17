import type { CampTeam, TeamId } from "./types";

export const TEAM_COLOR_CLASS: Record<TeamId, string> = {
  A: "bg-sky-600 text-white",
  B: "bg-red-600 text-white",
  C: "bg-emerald-600 text-white",
  D: "bg-yellow-500 text-yellow-950",
};

/** Slug amigável na URL (`/camp/times/liverpool`). */
export const TEAM_ROUTE_SLUG: Record<TeamId, string> = {
  A: "liverpool",
  B: "real-madrid",
  C: "time-c",
  D: "time-d",
};

export const TEAM_META: Record<
  TeamId,
  { name: string; captain: string; colorClass: string }
> = {
  A: { name: "Liverpool", captain: "Miguel", colorClass: TEAM_COLOR_CLASS.A },
  B: { name: "Real Madrid", captain: "Luiz Felipe", colorClass: TEAM_COLOR_CLASS.B },
  C: { name: "Time C", captain: "Renan", colorClass: TEAM_COLOR_CLASS.C },
  D: { name: "Time D", captain: "MF", colorClass: TEAM_COLOR_CLASS.D },
};

export function getTeamMeta(teamId: TeamId) {
  return TEAM_META[teamId];
}

export function findTeamById(teams: CampTeam[], teamId: TeamId | string) {
  return teams.find((team) => team.id === teamId);
}

export function teamRouteSlugToId(slug: string): TeamId | null {
  const normalized = slug.trim().toLowerCase();
  const letter = normalized.toUpperCase();
  if (letter === "A" || letter === "B" || letter === "C" || letter === "D") {
    return letter;
  }
  const entry = (Object.entries(TEAM_ROUTE_SLUG) as [TeamId, string][]).find(
    ([, routeSlug]) => routeSlug === normalized,
  );
  return entry?.[0] ?? null;
}

export function teamIdToRouteSlug(teamId: TeamId): string {
  return TEAM_ROUTE_SLUG[teamId];
}

export const ALL_TEAM_ROUTE_SLUGS: string[] = [
  "a",
  "b",
  "c",
  "d",
  ...Object.values(TEAM_ROUTE_SLUG),
];
