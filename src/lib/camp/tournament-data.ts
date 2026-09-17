import "server-only";

import {
  CampBracketSlot,
  CampMatchPhase,
  CampMatchStatus,
  CampPlayerRole,
  CampTeamKey,
} from "@/generated/prisma/enums";
import type {
  CampMatch as DbCampMatch,
  CampPlayer as DbCampPlayer,
  CampTeam as DbCampTeam,
  CampTournament as DbCampTournament,
} from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { MOCK_TOURNAMENT } from "./mock-data";
import { calculateStandings } from "./standings";
import type {
  CampMatch,
  CampPlayer,
  CampStanding,
  CampTeam,
  CampTournament,
  MatchPhase,
  MatchStatus,
  TeamId,
} from "./types";

export const TOURNAMENT_SLUG = "copa-resenha-kopoha-1";

function teamKeyToId(key: CampTeamKey): TeamId {
  return key as TeamId;
}

function phaseFromDb(phase: CampMatchPhase): MatchPhase {
  if (phase === CampMatchPhase.FASE1) return "fase1";
  if (phase === CampMatchPhase.SEMIFINAL) return "semifinal";
  return "final";
}

function statusFromDb(status: CampMatchStatus): MatchStatus {
  if (status === CampMatchStatus.LIVE) return "live";
  if (status === CampMatchStatus.FINISHED) return "finished";
  return "scheduled";
}

function roleFromDb(role: CampPlayerRole): CampPlayer["role"] {
  return role === CampPlayerRole.GOLEIRO ? "goleiro" : "linha";
}

type DbTeamWithPlayers = DbCampTeam & { players: DbCampPlayer[] };
type DbMatchWithTeams = DbCampMatch & {
  homeTeam: DbCampTeam | null;
  awayTeam: DbCampTeam | null;
};
type DbTournamentFull = DbCampTournament & {
  teams: DbTeamWithPlayers[];
  matches: DbMatchWithTeams[];
};

function mapTeam(team: DbCampTeam, wins: number): CampTeam {
  return {
    id: teamKeyToId(team.key),
    name: team.name,
    captain: team.captain,
    playerCount: 0,
    wins,
    colorClass: team.colorClass,
  };
}

function mapPlayer(player: DbCampPlayer, teamKey: CampTeamKey): CampPlayer {
  return {
    id: player.id,
    name: player.name,
    teamId: teamKeyToId(teamKey),
    role: roleFromDb(player.role),
    number: player.number,
    goals: player.goals,
    assists: player.assists,
  };
}

function mapMatchBase(match: DbMatchWithTeams, homeKey: CampTeamKey, awayKey: CampTeamKey): CampMatch {
  const campMatch: CampMatch = {
    id: match.id,
    phase: phaseFromDb(match.phase),
    roundLabel: match.roundLabel,
    homeTeamId: teamKeyToId(homeKey),
    awayTeamId: teamKeyToId(awayKey),
    durationMinutes: match.durationMinutes,
    status: statusFromDb(match.status),
  };

  if (match.homeScore !== null && match.awayScore !== null) {
    campMatch.result = {
      homeScore: match.homeScore,
      awayScore: match.awayScore,
      decidedByPenalties: match.decidedByPenalties,
    };
  }

  return campMatch;
}

function winnerKey(match: CampMatch): TeamId | null {
  if (!match.result || match.status !== "finished") return null;
  if (match.result.homeScore > match.result.awayScore) return match.homeTeamId;
  if (match.result.awayScore > match.result.homeScore) return match.awayTeamId;
  return match.homeTeamId;
}

function resolveBracketKey(
  slot: CampBracketSlot | null,
  standings: CampStanding[],
  semi1: CampMatch | undefined,
  semi2: CampMatch | undefined,
): CampTeamKey | null {
  if (!slot) return null;

  switch (slot) {
    case CampBracketSlot.FIRST:
      return (standings.find((r) => r.position === 1)?.teamId as CampTeamKey) ?? null;
    case CampBracketSlot.SECOND:
      return (standings.find((r) => r.position === 2)?.teamId as CampTeamKey) ?? null;
    case CampBracketSlot.THIRD:
      return (standings.find((r) => r.position === 3)?.teamId as CampTeamKey) ?? null;
    case CampBracketSlot.FOURTH:
      return (standings.find((r) => r.position === 4)?.teamId as CampTeamKey) ?? null;
    case CampBracketSlot.WINNER_SEMI_1:
      return (winnerKey(semi1!) as CampTeamKey) ?? null;
    case CampBracketSlot.WINNER_SEMI_2:
      return (winnerKey(semi2!) as CampTeamKey) ?? null;
    default:
      return null;
  }
}

function mapTournament(record: DbTournamentFull): CampTournament {
  for (const team of record.teams) {
    team.players.sort((a, b) => a.number - b.number);
  }

  const sortedDb = [...record.matches].sort((a, b) => a.orderIndex - b.orderIndex);

  const fase1Matches = sortedDb
    .filter((m) => m.phase === CampMatchPhase.FASE1 && m.homeTeam && m.awayTeam)
    .map((m) => mapMatchBase(m, m.homeTeam!.key, m.awayTeam!.key));

  const standings = calculateStandings(fase1Matches);

  const semi1Db = sortedDb.find((m) => m.orderIndex === 7);
  const semi2Db = sortedDb.find((m) => m.orderIndex === 8);
  const finalDb = sortedDb.find((m) => m.orderIndex === 9);

  const semi1KeyHome =
    semi1Db?.homeTeam?.key ??
    resolveBracketKey(semi1Db?.homeBracketSlot ?? null, standings, undefined, undefined);
  const semi1KeyAway =
    semi1Db?.awayTeam?.key ??
    resolveBracketKey(semi1Db?.awayBracketSlot ?? null, standings, undefined, undefined);

  const semi1 =
    semi1Db && semi1KeyHome && semi1KeyAway
      ? mapMatchBase(semi1Db, semi1KeyHome, semi1KeyAway)
      : undefined;

  const semi2KeyHome =
    semi2Db?.homeTeam?.key ??
    resolveBracketKey(semi2Db?.homeBracketSlot ?? null, standings, semi1, undefined);
  const semi2KeyAway =
    semi2Db?.awayTeam?.key ??
    resolveBracketKey(semi2Db?.awayBracketSlot ?? null, standings, semi1, undefined);

  const semi2 =
    semi2Db && semi2KeyHome && semi2KeyAway
      ? mapMatchBase(semi2Db, semi2KeyHome, semi2KeyAway)
      : undefined;

  const allMatches: CampMatch[] = [...fase1Matches];

  if (semi1) allMatches.push(semi1);
  if (semi2) allMatches.push(semi2);

  if (finalDb) {
    const finalHome =
      finalDb.homeTeam?.key ??
      resolveBracketKey(finalDb.homeBracketSlot ?? null, standings, semi1, semi2);
    const finalAway =
      finalDb.awayTeam?.key ??
      resolveBracketKey(finalDb.awayBracketSlot ?? null, standings, semi1, semi2);

    if (finalHome && finalAway) {
      allMatches.push(mapMatchBase(finalDb, finalHome, finalAway));
    }
  }

  const teams: CampTeam[] = record.teams
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((team) => {
      const wins = standings.find((row) => row.teamId === teamKeyToId(team.key))?.wins ?? 0;
      const mapped = mapTeam(team, wins);
      mapped.playerCount = team.players.length;
      return mapped;
    });

  const players: CampPlayer[] = record.teams.flatMap((team) =>
    team.players.map((player) => mapPlayer(player, team.key)),
  );

  return {
    id: record.id,
    name: record.name,
    subtitle: record.subtitle,
    format: record.format,
    matchDurationMinutes: record.matchDurationMinutes,
    totalDurationMinutes: record.totalDurationMinutes,
    penaltyRule: record.penaltyRule,
    standings,
    matches: allMatches,
    teams,
    players,
  };
}

export async function fetchTournamentFromDb(
  slug = TOURNAMENT_SLUG,
): Promise<CampTournament | null> {
  try {
    const record = await db.campTournament.findUnique({
      where: { slug },
      include: {
        teams: { include: { players: true }, orderBy: { key: "asc" } },
        matches: {
          include: { homeTeam: true, awayTeam: true },
          orderBy: { orderIndex: "asc" },
        },
      },
    });

    if (!record) return null;
    return mapTournament(record);
  } catch {
    return null;
  }
}

export async function getTournamentData(): Promise<CampTournament> {
  const fromDb = await fetchTournamentFromDb();
  return fromDb ?? MOCK_TOURNAMENT;
}

export async function getTeamFromDb(slug: string, teamKey: TeamId) {
  try {
    const team = await db.campTeam.findFirst({
      where: {
        key: teamKey as CampTeamKey,
        tournament: { slug },
      },
      include: { players: { orderBy: { number: "asc" } } },
    });
    return team;
  } catch {
    return null;
  }
}
