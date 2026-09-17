export type TeamId = "A" | "B" | "C" | "D";

export type MatchPhase = "fase1" | "semifinal" | "final";

export type MatchStatus = "scheduled" | "live" | "finished";

export type MatchResult = {
  homeScore: number;
  awayScore: number;
  decidedByPenalties?: boolean;
};

export type CampMatch = {
  id: string;
  phase: MatchPhase;
  roundLabel: string;
  homeTeamId: TeamId;
  awayTeamId: TeamId;
  durationMinutes: number;
  status: MatchStatus;
  result?: MatchResult;
};

export type CampStanding = {
  teamId: TeamId;
  position: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
};

export type CampPlayer = {
  id: string;
  name: string;
  teamId: TeamId;
  role: "linha" | "goleiro";
  number: number;
  goals: number;
  assists: number;
};

export type CampTeam = {
  id: TeamId;
  name: string;
  captain: string;
  playerCount: number;
  wins: number;
  colorClass: string;
};

export type CampTournament = {
  id: string;
  name: string;
  subtitle: string;
  format: string;
  matchDurationMinutes: number;
  totalDurationMinutes: number;
  penaltyRule: string;
  standings: CampStanding[];
  matches: CampMatch[];
  teams: CampTeam[];
  players: CampPlayer[];
};
