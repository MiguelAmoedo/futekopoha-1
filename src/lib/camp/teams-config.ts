import type { CampTeam, TeamId } from "./types";

export const TEAM_COLOR_CLASS: Record<TeamId, string> = {
  A: "bg-sky-600 text-white",
  B: "bg-amber-500 text-amber-950",
  C: "bg-violet-600 text-white",
  D: "bg-rose-600 text-white",
};

export const TEAM_META: Record<
  TeamId,
  { name: string; captain: string; colorClass: string }
> = {
  A: { name: "Time A", captain: "Rafa", colorClass: TEAM_COLOR_CLASS.A },
  B: { name: "Time B", captain: "Miguel", colorClass: TEAM_COLOR_CLASS.B },
  C: { name: "Time C", captain: "Leo", colorClass: TEAM_COLOR_CLASS.C },
  D: { name: "Time D", captain: "Gui", colorClass: TEAM_COLOR_CLASS.D },
};

export function getTeamMeta(teamId: TeamId) {
  return TEAM_META[teamId];
}

export function findTeamById(teams: CampTeam[], teamId: TeamId | string) {
  return teams.find((team) => team.id === teamId);
}
