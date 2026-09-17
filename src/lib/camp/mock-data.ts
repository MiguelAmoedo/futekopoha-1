import { formatCampEventSubtitle } from "./constants";

import { TEAM_META, TEAM_COLOR_CLASS } from "./teams-config";

import type { CampPlayer, CampTournament, TeamId } from "./types";



export {

  ALL_TEAM_ROUTE_SLUGS as TEAM_SLUGS,

  teamRouteSlugToId as teamSlugToId,

  teamIdToRouteSlug as teamIdToSlug,

} from "./teams-config";



export type TeamSlug = string;



const teamFromMeta = (id: TeamId, playerCount: number, wins = 0) => ({

  id,

  name: TEAM_META[id].name,

  captain: TEAM_META[id].captain,

  playerCount,

  wins,

  colorClass: TEAM_COLOR_CLASS[id],

});



export const MOCK_TOURNAMENT: CampTournament = {

  id: "copa-resenha-kopoha-1",

  name: "Copa Resenha Kopoha 1",

  subtitle: formatCampEventSubtitle("5x5 · 4 na linha + 1 no gol"),

  format: "Todos x todos + mata-mata (1º×4º, 2º×3º) + final",

  matchDurationMinutes: 5,

  totalDurationMinutes: 45,

  penaltyRule: "Empate: 3 pênaltis normais, depois alternados",

  teams: [

    teamFromMeta("A", 5),

    teamFromMeta("B", 7),

    teamFromMeta("C", 5),

    teamFromMeta("D", 7),

  ],

  standings: [

    {

      teamId: "A",

      position: 1,

      played: 0,

      wins: 0,

      draws: 0,

      losses: 0,

      goalsFor: 0,

      goalsAgainst: 0,

      points: 0,

    },

    {

      teamId: "B",

      position: 2,

      played: 0,

      wins: 0,

      draws: 0,

      losses: 0,

      goalsFor: 0,

      goalsAgainst: 0,

      points: 0,

    },

    {

      teamId: "C",

      position: 3,

      played: 0,

      wins: 0,

      draws: 0,

      losses: 0,

      goalsFor: 0,

      goalsAgainst: 0,

      points: 0,

    },

    {

      teamId: "D",

      position: 4,

      played: 0,

      wins: 0,

      draws: 0,

      losses: 0,

      goalsFor: 0,

      goalsAgainst: 0,

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

      status: "scheduled",

    },

    {

      id: "m2",

      phase: "fase1",

      roundLabel: "Fase 1 · Jogo 2",

      homeTeamId: "C",

      awayTeamId: "D",

      durationMinutes: 5,

      status: "scheduled",

    },

    {

      id: "m3",

      phase: "fase1",

      roundLabel: "Fase 1 · Jogo 3",

      homeTeamId: "A",

      awayTeamId: "C",

      durationMinutes: 5,

      status: "scheduled",

    },

    {

      id: "m4",

      phase: "fase1",

      roundLabel: "Fase 1 · Jogo 4",

      homeTeamId: "B",

      awayTeamId: "D",

      durationMinutes: 5,

      status: "scheduled",

    },

    {

      id: "m5",

      phase: "fase1",

      roundLabel: "Fase 1 · Jogo 5",

      homeTeamId: "A",

      awayTeamId: "D",

      durationMinutes: 5,

      status: "scheduled",

    },

    {

      id: "m6",

      phase: "fase1",

      roundLabel: "Fase 1 · Jogo 6",

      homeTeamId: "B",

      awayTeamId: "C",

      durationMinutes: 5,

      status: "scheduled",

    },

    {

      id: "m7",

      phase: "semifinal",

      roundLabel: "Semifinal · 1º x 4º",

      homeTeamId: "A",

      awayTeamId: "D",

      durationMinutes: 5,

      status: "scheduled",

    },

    {

      id: "m8",

      phase: "semifinal",

      roundLabel: "Semifinal · 2º x 3º",

      homeTeamId: "B",

      awayTeamId: "C",

      durationMinutes: 5,

      status: "scheduled",

    },

    {

      id: "m9",

      phase: "final",

      roundLabel: "Final",

      homeTeamId: "A",

      awayTeamId: "B",

      durationMinutes: 5,

      status: "scheduled",

    },

  ],

  players: [

    { id: "p-a-gk", name: "A definir", teamId: "A", role: "goleiro", number: 1, goals: 0, assists: 0 },

    { id: "p-a-1", name: "Miguel", teamId: "A", role: "linha", number: 10, goals: 0, assists: 0 },

    { id: "p-a-2", name: "Rafael", teamId: "A", role: "linha", number: 7, goals: 0, assists: 0 },

    { id: "p-a-3", name: "Levy", teamId: "A", role: "linha", number: 8, goals: 0, assists: 0 },

    { id: "p-a-4", name: "A definir", teamId: "A", role: "linha", number: 9, goals: 0, assists: 0 },

    { id: "p-b-gk", name: "A definir", teamId: "B", role: "goleiro", number: 1, goals: 0, assists: 0 },

    { id: "p-b-1", name: "Luiz Felipe", teamId: "B", role: "linha", number: 10, goals: 0, assists: 0 },

    { id: "p-b-2", name: "Lukas", teamId: "B", role: "linha", number: 7, goals: 0, assists: 0 },

    { id: "p-b-3", name: "Felipe", teamId: "B", role: "linha", number: 8, goals: 0, assists: 0 },

    { id: "p-b-4", name: "Gabriel", teamId: "B", role: "linha", number: 9, goals: 0, assists: 0 },

    { id: "p-b-5", name: "William", teamId: "B", role: "linha", number: 11, goals: 0, assists: 0 },

    { id: "p-b-res", name: "Paulinho", teamId: "B", role: "linha", number: 5, goals: 0, assists: 0 },

    { id: "p-c-gk", name: "A definir", teamId: "C", role: "goleiro", number: 1, goals: 0, assists: 0 },

    { id: "p-c-1", name: "Renan", teamId: "C", role: "linha", number: 10, goals: 0, assists: 0 },

    { id: "p-c-2", name: "A definir", teamId: "C", role: "linha", number: 7, goals: 0, assists: 0 },

    { id: "p-c-3", name: "A definir", teamId: "C", role: "linha", number: 8, goals: 0, assists: 0 },

    { id: "p-c-4", name: "A definir", teamId: "C", role: "linha", number: 9, goals: 0, assists: 0 },

    { id: "p-d-gk", name: "A definir", teamId: "D", role: "goleiro", number: 1, goals: 0, assists: 0 },

    { id: "p-d-1", name: "MF", teamId: "D", role: "linha", number: 10, goals: 0, assists: 0 },

    { id: "p-d-2", name: "Guilherme Leite", teamId: "D", role: "linha", number: 7, goals: 0, assists: 0 },

    { id: "p-d-3", name: "Carlos Manoel", teamId: "D", role: "linha", number: 6, goals: 0, assists: 0 },

    { id: "p-d-4", name: "Liedson Paes", teamId: "D", role: "linha", number: 8, goals: 0, assists: 0 },

    { id: "p-d-5", name: "André Pantoja", teamId: "D", role: "linha", number: 9, goals: 0, assists: 0 },

    { id: "p-d-res", name: "A definir", teamId: "D", role: "linha", number: 5, goals: 0, assists: 0 },

  ],

};



export function getTeamById(teamId: string) {

  return MOCK_TOURNAMENT.teams.find((team) => team.id === teamId);

}



export function getPlayersByTeam(teamId: string) {

  return MOCK_TOURNAMENT.players.filter((player) => player.teamId === teamId);

}



export function getStartingXi(players: CampPlayer[]): CampPlayer[] {

  const goalkeeper = players.find((player) => player.role === "goleiro");

  const line = players

    .filter((player) => player.role === "linha")

    .sort((a, b) => a.number - b.number)

    .slice(0, 4);

  return goalkeeper ? [...line, goalkeeper] : line;

}

