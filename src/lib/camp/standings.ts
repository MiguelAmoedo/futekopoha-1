import type { CampMatch, CampStanding, TeamId } from "./types";

const TEAM_IDS: TeamId[] = ["A", "B", "C", "D"];

type MutableStanding = Omit<CampStanding, "position">;

function emptyStanding(teamId: TeamId): MutableStanding {
  return {
    teamId,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
  };
}

function headToHeadPoints(
  teamA: TeamId,
  teamB: TeamId,
  matches: CampMatch[],
): { a: number; b: number } {
  let a = 0;
  let b = 0;

  for (const match of matches) {
    if (match.phase !== "fase1" || match.status !== "finished" || !match.result) continue;
    const isPair =
      (match.homeTeamId === teamA && match.awayTeamId === teamB) ||
      (match.homeTeamId === teamB && match.awayTeamId === teamA);
    if (!isPair) continue;

    const { homeScore, awayScore } = match.result;
    if (homeScore === awayScore) {
      a += 1;
      b += 1;
    } else if (
      (match.homeTeamId === teamA && homeScore > awayScore) ||
      (match.awayTeamId === teamA && awayScore > homeScore)
    ) {
      a += 3;
    } else {
      b += 3;
    }
  }

  return { a, b };
}

function compareStandings(a: MutableStanding, b: MutableStanding, fase1: CampMatch[]): number {
  if (b.points !== a.points) return b.points - a.points;

  const gdA = a.goalsFor - a.goalsAgainst;
  const gdB = b.goalsFor - b.goalsAgainst;
  if (gdB !== gdA) return gdB - gdA;

  if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;

  const h2h = headToHeadPoints(a.teamId, b.teamId, fase1);
  if (h2h.b !== h2h.a) return h2h.b - h2h.a;

  return a.teamId.localeCompare(b.teamId);
}

export function calculateStandings(matches: CampMatch[]): CampStanding[] {
  const fase1 = matches.filter((match) => match.phase === "fase1");
  const table = new Map<TeamId, MutableStanding>();

  for (const teamId of TEAM_IDS) {
    table.set(teamId, emptyStanding(teamId));
  }

  for (const match of fase1) {
    if (match.status !== "finished" || !match.result) continue;

    const home = table.get(match.homeTeamId)!;
    const away = table.get(match.awayTeamId)!;
    const { homeScore, awayScore } = match.result;

    home.played += 1;
    away.played += 1;
    home.goalsFor += homeScore;
    home.goalsAgainst += awayScore;
    away.goalsFor += awayScore;
    away.goalsAgainst += homeScore;

    if (homeScore > awayScore) {
      home.wins += 1;
      home.points += 3;
      away.losses += 1;
    } else if (homeScore < awayScore) {
      away.wins += 1;
      away.points += 3;
      home.losses += 1;
    } else {
      home.draws += 1;
      away.draws += 1;
      home.points += 1;
      away.points += 1;
    }
  }

  const sorted = [...table.values()].sort((a, b) => compareStandings(a, b, fase1));

  return sorted.map((row, index) => ({
    ...row,
    position: index + 1,
  }));
}

export function teamIdAtPosition(standings: CampStanding[], position: number): TeamId | null {
  return standings.find((row) => row.position === position)?.teamId ?? null;
}
