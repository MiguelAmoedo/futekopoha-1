import type { CampPlayer, CampTournament, TeamId } from "./types";

export const TEAM_SLUGS = ["a", "b", "c", "d"] as const;

export type TeamSlug = (typeof TEAM_SLUGS)[number];

export const MOCK_TOURNAMENT: CampTournament = {
  id: "copa-resenha-kopoha-1",
  name: "Copa Resenha Kopoha 1",
  subtitle: "5x5 · 4 na linha + 1 no gol",
  format: "Todos x todos + mata-mata (1º×4º, 2º×3º) + final",
  matchDurationMinutes: 5,
  totalDurationMinutes: 45,
  penaltyRule: "Empate: 3 pênaltis normais, depois alternados",
  teams: [
    {
      id: "A",
      name: "Time A",
      captain: "Rafa",
      playerCount: 6,
      wins: 2,
      colorClass: "bg-sky-600 text-white",
    },
    {
      id: "B",
      name: "Time B",
      captain: "Miguel",
      playerCount: 6,
      wins: 3,
      colorClass: "bg-amber-500 text-amber-950",
    },
    {
      id: "C",
      name: "Time C",
      captain: "Leo",
      playerCount: 5,
      wins: 1,
      colorClass: "bg-violet-600 text-white",
    },
    {
      id: "D",
      name: "Time D",
      captain: "Gui",
      playerCount: 6,
      wins: 0,
      colorClass: "bg-rose-600 text-white",
    },
  ],
  standings: [
    {
      teamId: "B",
      position: 1,
      played: 3,
      wins: 2,
      draws: 1,
      losses: 0,
      goalsFor: 9,
      goalsAgainst: 4,
      points: 7,
    },
    {
      teamId: "A",
      position: 2,
      played: 3,
      wins: 2,
      draws: 0,
      losses: 1,
      goalsFor: 7,
      goalsAgainst: 5,
      points: 6,
    },
    {
      teamId: "C",
      position: 3,
      played: 3,
      wins: 1,
      draws: 1,
      losses: 1,
      goalsFor: 5,
      goalsAgainst: 6,
      points: 4,
    },
    {
      teamId: "D",
      position: 4,
      played: 3,
      wins: 0,
      draws: 0,
      losses: 3,
      goalsFor: 3,
      goalsAgainst: 9,
      points: 0,
    },
  ],
  matches: [
    {
      id: "m1",
      phase: "fase1",
      roundLabel: "Fase 1 · Jogo 1",
      homeTeamId: "A",
      awayTeamId: "B",
      durationMinutes: 5,
      status: "finished",
      result: { homeScore: 1, awayScore: 2 },
    },
    {
      id: "m2",
      phase: "fase1",
      roundLabel: "Fase 1 · Jogo 2",
      homeTeamId: "C",
      awayTeamId: "D",
      durationMinutes: 5,
      status: "finished",
      result: { homeScore: 2, awayScore: 0 },
    },
    {
      id: "m3",
      phase: "fase1",
      roundLabel: "Fase 1 · Jogo 3",
      homeTeamId: "A",
      awayTeamId: "C",
      durationMinutes: 5,
      status: "finished",
      result: { homeScore: 3, awayScore: 1 },
    },
    {
      id: "m4",
      phase: "fase1",
      roundLabel: "Fase 1 · Jogo 4",
      homeTeamId: "B",
      awayTeamId: "D",
      durationMinutes: 5,
      status: "finished",
      result: { homeScore: 2, awayScore: 1 },
    },
    {
      id: "m5",
      phase: "fase1",
      roundLabel: "Fase 1 · Jogo 5",
      homeTeamId: "A",
      awayTeamId: "D",
      durationMinutes: 5,
      status: "finished",
      result: { homeScore: 3, awayScore: 0 },
    },
    {
      id: "m6",
      phase: "fase1",
      roundLabel: "Fase 1 · Jogo 6",
      homeTeamId: "B",
      awayTeamId: "C",
      durationMinutes: 5,
      status: "live",
      result: { homeScore: 1, awayScore: 1 },
    },
    {
      id: "m7",
      phase: "semifinal",
      roundLabel: "Semifinal · 1º x 4º",
      homeTeamId: "B",
      awayTeamId: "D",
      durationMinutes: 5,
      status: "scheduled",
    },
    {
      id: "m8",
      phase: "semifinal",
      roundLabel: "Semifinal · 2º x 3º",
      homeTeamId: "A",
      awayTeamId: "C",
      durationMinutes: 5,
      status: "scheduled",
    },
    {
      id: "m9",
      phase: "final",
      roundLabel: "Final",
      homeTeamId: "B",
      awayTeamId: "A",
      durationMinutes: 5,
      status: "scheduled",
    },
  ],
  players: [
    { id: "p1", name: "Rafa", teamId: "A", role: "goleiro", number: 1, goals: 0, assists: 0 },
    { id: "p2", name: "Pedro", teamId: "A", role: "linha", number: 7, goals: 2, assists: 1 },
    { id: "p3", name: "Dudu", teamId: "A", role: "linha", number: 10, goals: 3, assists: 0 },
    { id: "p4", name: "Miguel", teamId: "B", role: "goleiro", number: 1, goals: 0, assists: 0 },
    { id: "p5", name: "Caio", teamId: "B", role: "linha", number: 9, goals: 4, assists: 2 },
    { id: "p6", name: "Breno", teamId: "B", role: "linha", number: 11, goals: 2, assists: 3 },
    { id: "p7", name: "Leo", teamId: "C", role: "goleiro", number: 1, goals: 0, assists: 0 },
    { id: "p8", name: "Nando", teamId: "C", role: "linha", number: 8, goals: 2, assists: 1 },
    { id: "p9", name: "Gui", teamId: "D", role: "goleiro", number: 1, goals: 0, assists: 0 },
    { id: "p10", name: "Tito", teamId: "D", role: "linha", number: 6, goals: 1, assists: 0 },
    { id: "p11", name: "Zeca", teamId: "A", role: "linha", number: 4, goals: 1, assists: 2 },
    { id: "p12", name: "Lipe", teamId: "B", role: "linha", number: 5, goals: 1, assists: 1 },
    { id: "p13", name: "Marcos", teamId: "C", role: "linha", number: 3, goals: 1, assists: 1 },
    { id: "p14", name: "Vini", teamId: "D", role: "linha", number: 10, goals: 1, assists: 0 },
    { id: "p15", name: "Lucas", teamId: "A", role: "linha", number: 8, goals: 0, assists: 1 },
    { id: "p16", name: "Diego", teamId: "B", role: "linha", number: 7, goals: 1, assists: 0 },
    { id: "p17", name: "Fábio", teamId: "C", role: "linha", number: 9, goals: 0, assists: 2 },
    { id: "p18", name: "Renan", teamId: "C", role: "linha", number: 11, goals: 2, assists: 0 },
    { id: "p19", name: "Guga", teamId: "D", role: "linha", number: 4, goals: 0, assists: 1 },
    { id: "p20", name: "Thiago", teamId: "D", role: "linha", number: 9, goals: 1, assists: 1 },
  ],
};

export function getTeamById(teamId: string) {
  return MOCK_TOURNAMENT.teams.find((team) => team.id === teamId);
}

export function getPlayersByTeam(teamId: string) {
  return MOCK_TOURNAMENT.players.filter((player) => player.teamId === teamId);
}

export function teamSlugToId(slug: string): TeamId | null {
  const normalized = slug.trim().toUpperCase();
  if (normalized === "A" || normalized === "B" || normalized === "C" || normalized === "D") {
    return normalized;
  }
  return null;
}

export function teamIdToSlug(teamId: TeamId): TeamSlug {
  return teamId.toLowerCase() as TeamSlug;
}

export function getStartingXi(players: CampPlayer[]): CampPlayer[] {
  const goalkeeper = players.find((player) => player.role === "goleiro");
  const line = players
    .filter((player) => player.role === "linha")
    .sort((a, b) => a.number - b.number)
    .slice(0, 4);
  return goalkeeper ? [...line, goalkeeper] : line;
}
