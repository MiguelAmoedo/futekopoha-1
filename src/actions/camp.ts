"use server";

import { revalidatePath } from "next/cache";
import {
  CampMatchPhase,
  CampMatchStatus,
  CampPlayerRole,
  CampTeamKey,
} from "@/generated/prisma/client";
import { ok, fail, type ActionResult } from "@/lib/action-result";
import { calculateStandings, teamIdAtPosition } from "@/lib/camp/standings";
import { fetchTournamentFromDb, TOURNAMENT_SLUG } from "@/lib/camp/tournament-data";
import type { TeamId } from "@/lib/camp/types";
import { db } from "@/lib/db";

const CAMP_PATHS = ["/", "/camp", "/camp/torneio", "/camp/times", "/camp/admin"];

function revalidateCamp() {
  for (const path of CAMP_PATHS) {
    revalidatePath(path, "layout");
  }
}

function checkAdminToken(token: string | null | undefined): boolean {
  const expected = process.env.CAMP_ADMIN_TOKEN ?? "camp-admin-dev";
  return Boolean(token && token === expected);
}

function teamKeyFromId(teamId: TeamId): CampTeamKey {
  return teamId as CampTeamKey;
}

export async function verifyAdminAccess(token: string | null | undefined): Promise<boolean> {
  return checkAdminToken(token);
}

export async function verifyTeamManagerAccess(
  teamKey: TeamId,
  token: string | null | undefined,
): Promise<boolean> {
  if (checkAdminToken(token)) return true;

  try {
    const team = await db.campTeam.findFirst({
      where: {
        key: teamKeyFromId(teamKey),
        tournament: { slug: TOURNAMENT_SLUG },
      },
    });
    return Boolean(team?.managerToken && team.managerToken === token);
  } catch {
    return false;
  }
}

export type UpdateMatchInput = {
  matchId: string;
  adminToken: string;
  homeScore: number;
  awayScore: number;
  decidedByPenalties?: boolean;
  status?: "scheduled" | "live" | "finished";
};

export async function updateMatchResult(input: UpdateMatchInput): Promise<ActionResult<void>> {
  if (!checkAdminToken(input.adminToken)) {
    return fail("Token de admin inválido");
  }

  try {
    const statusMap: Record<NonNullable<UpdateMatchInput["status"]>, CampMatchStatus> = {
      scheduled: CampMatchStatus.SCHEDULED,
      live: CampMatchStatus.LIVE,
      finished: CampMatchStatus.FINISHED,
    };

    await db.campMatch.update({
      where: { id: input.matchId },
      data: {
        homeScore: input.homeScore,
        awayScore: input.awayScore,
        decidedByPenalties: input.decidedByPenalties ?? false,
        status: input.status ? statusMap[input.status] : CampMatchStatus.FINISHED,
      },
    });

    revalidateCamp();
    return ok(undefined);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Erro ao atualizar jogo");
  }
}

export async function setMatchStatus(
  matchId: string,
  adminToken: string,
  status: "scheduled" | "live" | "finished",
): Promise<ActionResult<void>> {
  if (!checkAdminToken(adminToken)) {
    return fail("Token de admin inválido");
  }

  const statusMap = {
    scheduled: CampMatchStatus.SCHEDULED,
    live: CampMatchStatus.LIVE,
    finished: CampMatchStatus.FINISHED,
  };

  try {
    await db.campMatch.update({
      where: { id: matchId },
      data: { status: statusMap[status] },
    });
    revalidateCamp();
    return ok(undefined);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Erro ao alterar status");
  }
}

function winnerTeamId(
  homeTeamId: string,
  awayTeamId: string,
  homeScore: number,
  awayScore: number,
): string {
  if (homeScore > awayScore) return homeTeamId;
  if (awayScore > homeScore) return awayTeamId;
  return homeTeamId;
}

export async function advanceKnockoutBracket(adminToken: string): Promise<ActionResult<void>> {
  if (!checkAdminToken(adminToken)) {
    return fail("Token de admin inválido");
  }

  try {
    const tournament = await db.campTournament.findUnique({
      where: { slug: TOURNAMENT_SLUG },
      include: {
        teams: true,
        matches: {
          include: { homeTeam: true, awayTeam: true },
          orderBy: { orderIndex: "asc" },
        },
      },
    });

    if (!tournament) return fail("Torneio não encontrado");

    const teamByKey = new Map(tournament.teams.map((team) => [team.key, team.id]));

    const campMatches = tournament.matches
      .filter((match) => match.homeTeam && match.awayTeam)
      .map((match) => ({
        id: match.id,
        phase:
          match.phase === CampMatchPhase.FASE1
            ? ("fase1" as const)
            : match.phase === CampMatchPhase.SEMIFINAL
              ? ("semifinal" as const)
              : ("final" as const),
        roundLabel: match.roundLabel,
        homeTeamId: match.homeTeam!.key as TeamId,
        awayTeamId: match.awayTeam!.key as TeamId,
        durationMinutes: match.durationMinutes,
        status:
          match.status === CampMatchStatus.LIVE
            ? ("live" as const)
            : match.status === CampMatchStatus.FINISHED
              ? ("finished" as const)
              : ("scheduled" as const),
        result:
          match.homeScore !== null && match.awayScore !== null
            ? {
                homeScore: match.homeScore,
                awayScore: match.awayScore,
                decidedByPenalties: match.decidedByPenalties,
              }
            : undefined,
      }));

    const standings = calculateStandings(campMatches);

    const positionTeamId = (position: number) => {
      const teamId = teamIdAtPosition(standings, position);
      return teamId ? teamByKey.get(teamKeyFromId(teamId)) ?? null : null;
    };

    const first = positionTeamId(1);
    const second = positionTeamId(2);
    const third = positionTeamId(3);
    const fourth = positionTeamId(4);

    const semi1 = tournament.matches.find((m) => m.orderIndex === 7);
    const semi2 = tournament.matches.find((m) => m.orderIndex === 8);
    const finalMatch = tournament.matches.find((m) => m.orderIndex === 9);

    if (semi1 && first && fourth) {
      await db.campMatch.update({
        where: { id: semi1.id },
        data: { homeTeamId: first, awayTeamId: fourth },
      });
    }

    if (semi2 && second && third) {
      await db.campMatch.update({
        where: { id: semi2.id },
        data: { homeTeamId: second, awayTeamId: third },
      });
    }

    const semi1Updated = await db.campMatch.findUnique({ where: { id: semi1?.id } });
    const semi2Updated = await db.campMatch.findUnique({ where: { id: semi2?.id } });

    if (
      finalMatch &&
      semi1Updated?.homeTeamId &&
      semi1Updated.awayTeamId &&
      semi1Updated.homeScore !== null &&
      semi1Updated.awayScore !== null &&
      semi1Updated.status === CampMatchStatus.FINISHED
    ) {
      const sf1Winner = winnerTeamId(
        semi1Updated.homeTeamId,
        semi1Updated.awayTeamId,
        semi1Updated.homeScore,
        semi1Updated.awayScore,
      );
      const sf2Winner =
        semi2Updated?.homeTeamId &&
        semi2Updated.awayTeamId &&
        semi2Updated.homeScore !== null &&
        semi2Updated.awayScore !== null &&
        semi2Updated.status === CampMatchStatus.FINISHED
          ? winnerTeamId(
              semi2Updated.homeTeamId,
              semi2Updated.awayTeamId,
              semi2Updated.homeScore,
              semi2Updated.awayScore,
            )
          : null;

      await db.campMatch.update({
        where: { id: finalMatch.id },
        data: {
          homeTeamId: sf1Winner,
          awayTeamId: sf2Winner ?? finalMatch.awayTeamId,
        },
      });
    }

    revalidateCamp();
    return ok(undefined);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Erro ao atualizar chave");
  }
}

export type UpdateLineupInput = {
  teamKey: TeamId;
  managerToken: string;
  playerIds: string[];
};

export async function updateTeamLineup(input: UpdateLineupInput): Promise<ActionResult<void>> {
  const allowed = await verifyTeamManagerAccess(input.teamKey, input.managerToken);
  if (!allowed) return fail("Acesso negado");

  if (input.playerIds.length !== 5) {
    return fail("Selecione exatamente 5 jogadores (4 linha + 1 goleiro)");
  }

  try {
    const team = await db.campTeam.findFirst({
      where: {
        key: teamKeyFromId(input.teamKey),
        tournament: { slug: TOURNAMENT_SLUG },
      },
      include: { players: true },
    });

    if (!team) return fail("Time não encontrado");

    const selected = team.players.filter((player) => input.playerIds.includes(player.id));
    if (selected.length !== 5) return fail("Jogadores inválidos");

    const goalkeepers = selected.filter((player) => player.role === CampPlayerRole.GOLEIRO);
    const linha = selected.filter((player) => player.role === CampPlayerRole.LINHA);

    if (goalkeepers.length !== 1 || linha.length !== 4) {
      return fail("Escalação: 4 de linha + 1 goleiro");
    }

    await db.$transaction([
      db.campPlayer.updateMany({
        where: { teamId: team.id },
        data: { inLineup: false },
      }),
      db.campPlayer.updateMany({
        where: { id: { in: input.playerIds }, teamId: team.id },
        data: { inLineup: true },
      }),
    ]);

    revalidatePath(`/camp/times/${input.teamKey.toLowerCase()}`);
    revalidatePath(`/camp/times/${input.teamKey.toLowerCase()}/gerenciar`);
    return ok(undefined);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Erro ao salvar escalação");
  }
}

export async function listAdminMatches(adminToken: string) {
  if (!checkAdminToken(adminToken)) return null;
  return fetchTournamentFromDb();
}
