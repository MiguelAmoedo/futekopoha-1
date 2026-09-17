import "dotenv/config";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import {
  CampBracketSlot,
  CampMatchPhase,
  CampMatchStatus,
  CampPlayerRole,
  CampTeamKey,
  PrismaClient,
} from "../src/generated/prisma/client";
import { formatCampEventSubtitle } from "../src/lib/camp/constants";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaNeon({ connectionString });
const db = new PrismaClient({ adapter });

const TOURNAMENT_SLUG = "copa-resenha-kopoha-1";

const TEAM_DEFS: {
  key: CampTeamKey;
  name: string;
  captain: string;
  colorClass: string;
  managerToken: string;
}[] = [
  {
    key: CampTeamKey.A,
    name: "Liverpool",
    captain: "Miguel",
    colorClass: "bg-sky-600 text-white",
    managerToken: "camp-manager-a",
  },
  {
    key: CampTeamKey.B,
    name: "Real Madrid",
    captain: "Luiz Felipe",
    colorClass: "bg-red-600 text-white",
    managerToken: "camp-manager-b",
  },
  {
    key: CampTeamKey.C,
    name: "Time C",
    captain: "Renan",
    colorClass: "bg-emerald-600 text-white",
    managerToken: "camp-manager-c",
  },
  {
    key: CampTeamKey.D,
    name: "Time D",
    captain: "MF",
    colorClass: "bg-yellow-500 text-yellow-950",
    managerToken: "camp-manager-d",
  },
];

const PLAYERS: {
  key: CampTeamKey;
  name: string;
  role: CampPlayerRole;
  number: number;
  goals: number;
  assists: number;
  inLineup: boolean;
}[] = [
  // Liverpool (A)
  { key: CampTeamKey.A, name: "A definir", role: CampPlayerRole.GOLEIRO, number: 1, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.A, name: "Miguel", role: CampPlayerRole.LINHA, number: 10, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.A, name: "Rafael", role: CampPlayerRole.LINHA, number: 7, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.A, name: "Levy", role: CampPlayerRole.LINHA, number: 8, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.A, name: "A definir", role: CampPlayerRole.LINHA, number: 9, goals: 0, assists: 0, inLineup: true },
  // Real Madrid (B)
  { key: CampTeamKey.B, name: "A definir", role: CampPlayerRole.GOLEIRO, number: 1, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.B, name: "Luiz Felipe", role: CampPlayerRole.LINHA, number: 10, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.B, name: "Lukas", role: CampPlayerRole.LINHA, number: 7, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.B, name: "Felipe", role: CampPlayerRole.LINHA, number: 8, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.B, name: "Gabriel", role: CampPlayerRole.LINHA, number: 9, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.B, name: "William", role: CampPlayerRole.LINHA, number: 11, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.B, name: "Paulinho", role: CampPlayerRole.LINHA, number: 5, goals: 0, assists: 0, inLineup: false },
  // Time C
  { key: CampTeamKey.C, name: "A definir", role: CampPlayerRole.GOLEIRO, number: 1, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.C, name: "Renan", role: CampPlayerRole.LINHA, number: 10, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.C, name: "A definir", role: CampPlayerRole.LINHA, number: 7, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.C, name: "A definir", role: CampPlayerRole.LINHA, number: 8, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.C, name: "A definir", role: CampPlayerRole.LINHA, number: 9, goals: 0, assists: 0, inLineup: true },
  // Time D
  { key: CampTeamKey.D, name: "A definir", role: CampPlayerRole.GOLEIRO, number: 1, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.D, name: "MF", role: CampPlayerRole.LINHA, number: 10, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.D, name: "Guilherme Leite", role: CampPlayerRole.LINHA, number: 7, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.D, name: "Carlos Manoel", role: CampPlayerRole.LINHA, number: 6, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.D, name: "Liedson Paes", role: CampPlayerRole.LINHA, number: 8, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.D, name: "André Pantoja", role: CampPlayerRole.LINHA, number: 9, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.D, name: "A definir", role: CampPlayerRole.LINHA, number: 5, goals: 0, assists: 0, inLineup: false },
];

async function main() {
  await db.campTournament.deleteMany({ where: { slug: TOURNAMENT_SLUG } });

  const tournament = await db.campTournament.create({
    data: {
      slug: TOURNAMENT_SLUG,
      name: "Copa Resenha Kopoha 1",
      subtitle: formatCampEventSubtitle("5x5 · 4 na linha + 1 no gol"),
      format: "Todos x todos + mata-mata (1º×4º, 2º×3º) + final",
      matchDurationMinutes: 5,
      totalDurationMinutes: 45,
      penaltyRule: "Empate: 3 pênaltis normais, depois alternados",
    },
  });

  const teamIds = new Map<CampTeamKey, string>();

  for (const team of TEAM_DEFS) {
    const created = await db.campTeam.create({
      data: {
        tournamentId: tournament.id,
        key: team.key,
        name: team.name,
        captain: team.captain,
        colorClass: team.colorClass,
        managerToken: team.managerToken,
      },
    });
    teamIds.set(team.key, created.id);
  }

  for (const player of PLAYERS) {
    const teamId = teamIds.get(player.key);
    if (!teamId) continue;
    await db.campPlayer.create({
      data: {
        teamId,
        name: player.name,
        role: player.role,
        number: player.number,
        goals: player.goals,
        assists: player.assists,
        inLineup: player.inLineup,
      },
    });
  }

  const fase1Matches: {
    orderIndex: number;
    roundLabel: string;
    home: CampTeamKey;
    away: CampTeamKey;
  }[] = [
    { orderIndex: 1, roundLabel: "Fase 1 · Jogo 1", home: CampTeamKey.A, away: CampTeamKey.B },
    { orderIndex: 2, roundLabel: "Fase 1 · Jogo 2", home: CampTeamKey.C, away: CampTeamKey.D },
    { orderIndex: 3, roundLabel: "Fase 1 · Jogo 3", home: CampTeamKey.A, away: CampTeamKey.C },
    { orderIndex: 4, roundLabel: "Fase 1 · Jogo 4", home: CampTeamKey.B, away: CampTeamKey.D },
    { orderIndex: 5, roundLabel: "Fase 1 · Jogo 5", home: CampTeamKey.A, away: CampTeamKey.D },
    { orderIndex: 6, roundLabel: "Fase 1 · Jogo 6", home: CampTeamKey.B, away: CampTeamKey.C },
  ];

  for (const match of fase1Matches) {
    await db.campMatch.create({
      data: {
        tournamentId: tournament.id,
        phase: CampMatchPhase.FASE1,
        roundLabel: match.roundLabel,
        orderIndex: match.orderIndex,
        homeTeamId: teamIds.get(match.home)!,
        awayTeamId: teamIds.get(match.away)!,
        durationMinutes: 5,
        status: CampMatchStatus.SCHEDULED,
      },
    });
  }

  await db.campMatch.create({
    data: {
      tournamentId: tournament.id,
      phase: CampMatchPhase.SEMIFINAL,
      roundLabel: "Semifinal · 1º x 4º",
      orderIndex: 7,
      homeBracketSlot: CampBracketSlot.FIRST,
      awayBracketSlot: CampBracketSlot.FOURTH,
      durationMinutes: 5,
      status: CampMatchStatus.SCHEDULED,
    },
  });

  await db.campMatch.create({
    data: {
      tournamentId: tournament.id,
      phase: CampMatchPhase.SEMIFINAL,
      roundLabel: "Semifinal · 2º x 3º",
      orderIndex: 8,
      homeBracketSlot: CampBracketSlot.SECOND,
      awayBracketSlot: CampBracketSlot.THIRD,
      durationMinutes: 5,
      status: CampMatchStatus.SCHEDULED,
    },
  });

  await db.campMatch.create({
    data: {
      tournamentId: tournament.id,
      phase: CampMatchPhase.FINAL,
      roundLabel: "Final",
      orderIndex: 9,
      homeBracketSlot: CampBracketSlot.WINNER_SEMI_1,
      awayBracketSlot: CampBracketSlot.WINNER_SEMI_2,
      durationMinutes: 5,
      status: CampMatchStatus.SCHEDULED,
    },
  });

  console.log(`Seed OK: ${TOURNAMENT_SLUG}`);
  console.log("Tokens gerente: camp-manager-a/b/c/d");
  console.log("Admin: defina CAMP_ADMIN_TOKEN no .env (padrão camp-admin-dev)");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
