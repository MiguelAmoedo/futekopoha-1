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
    name: "Time A",
    captain: "Rafa",
    colorClass: "bg-sky-600 text-white",
    managerToken: "camp-manager-a",
  },
  {
    key: CampTeamKey.B,
    name: "Time B",
    captain: "Miguel",
    colorClass: "bg-amber-500 text-amber-950",
    managerToken: "camp-manager-b",
  },
  {
    key: CampTeamKey.C,
    name: "Time C",
    captain: "Leo",
    colorClass: "bg-violet-600 text-white",
    managerToken: "camp-manager-c",
  },
  {
    key: CampTeamKey.D,
    name: "Time D",
    captain: "Gui",
    colorClass: "bg-rose-600 text-white",
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
  { key: CampTeamKey.A, name: "Rafa", role: CampPlayerRole.GOLEIRO, number: 1, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.A, name: "Pedro", role: CampPlayerRole.LINHA, number: 7, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.A, name: "Dudu", role: CampPlayerRole.LINHA, number: 10, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.A, name: "Zeca", role: CampPlayerRole.LINHA, number: 4, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.A, name: "Lucas", role: CampPlayerRole.LINHA, number: 8, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.B, name: "Miguel", role: CampPlayerRole.GOLEIRO, number: 1, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.B, name: "Caio", role: CampPlayerRole.LINHA, number: 9, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.B, name: "Breno", role: CampPlayerRole.LINHA, number: 11, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.B, name: "Lipe", role: CampPlayerRole.LINHA, number: 5, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.B, name: "Diego", role: CampPlayerRole.LINHA, number: 7, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.C, name: "Leo", role: CampPlayerRole.GOLEIRO, number: 1, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.C, name: "Nando", role: CampPlayerRole.LINHA, number: 8, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.C, name: "Marcos", role: CampPlayerRole.LINHA, number: 3, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.C, name: "Fábio", role: CampPlayerRole.LINHA, number: 9, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.C, name: "Renan", role: CampPlayerRole.LINHA, number: 11, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.D, name: "Gui", role: CampPlayerRole.GOLEIRO, number: 1, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.D, name: "Tito", role: CampPlayerRole.LINHA, number: 6, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.D, name: "Vini", role: CampPlayerRole.LINHA, number: 10, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.D, name: "Guga", role: CampPlayerRole.LINHA, number: 4, goals: 0, assists: 0, inLineup: true },
  { key: CampTeamKey.D, name: "Thiago", role: CampPlayerRole.LINHA, number: 9, goals: 0, assists: 0, inLineup: true },
];

async function main() {
  await db.campTournament.deleteMany({ where: { slug: TOURNAMENT_SLUG } });

  const tournament = await db.campTournament.create({
    data: {
      slug: TOURNAMENT_SLUG,
      name: "Copa Resenha Kopoha 1",
      subtitle: "5x5 · 4 na linha + 1 no gol",
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
