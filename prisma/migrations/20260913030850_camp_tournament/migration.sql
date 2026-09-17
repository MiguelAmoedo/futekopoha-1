-- CreateEnum
CREATE TYPE "CampTeamKey" AS ENUM ('A', 'B', 'C', 'D');

-- CreateEnum
CREATE TYPE "CampMatchPhase" AS ENUM ('FASE1', 'SEMIFINAL', 'FINAL');

-- CreateEnum
CREATE TYPE "CampMatchStatus" AS ENUM ('SCHEDULED', 'LIVE', 'FINISHED');

-- CreateEnum
CREATE TYPE "CampPlayerRole" AS ENUM ('LINHA', 'GOLEIRO');

-- CreateEnum
CREATE TYPE "CampBracketSlot" AS ENUM ('FIRST', 'SECOND', 'THIRD', 'FOURTH', 'WINNER_SEMI_1', 'WINNER_SEMI_2');

-- CreateTable
CREATE TABLE "CampTournament" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "matchDurationMinutes" INTEGER NOT NULL DEFAULT 5,
    "totalDurationMinutes" INTEGER NOT NULL DEFAULT 45,
    "penaltyRule" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampTournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampTeam" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "key" "CampTeamKey" NOT NULL,
    "name" TEXT NOT NULL,
    "captain" TEXT NOT NULL,
    "colorClass" TEXT NOT NULL,
    "managerToken" TEXT,

    CONSTRAINT "CampTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampPlayer" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "CampPlayerRole" NOT NULL,
    "number" INTEGER NOT NULL,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER NOT NULL DEFAULT 0,
    "inLineup" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CampPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampMatch" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "phase" "CampMatchPhase" NOT NULL,
    "roundLabel" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "homeTeamId" TEXT,
    "awayTeamId" TEXT,
    "homeBracketSlot" "CampBracketSlot",
    "awayBracketSlot" "CampBracketSlot",
    "durationMinutes" INTEGER NOT NULL DEFAULT 5,
    "status" "CampMatchStatus" NOT NULL DEFAULT 'SCHEDULED',
    "homeScore" INTEGER,
    "awayScore" INTEGER,
    "decidedByPenalties" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CampMatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CampTournament_slug_key" ON "CampTournament"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CampTeam_managerToken_key" ON "CampTeam"("managerToken");

-- CreateIndex
CREATE INDEX "CampTeam_tournamentId_idx" ON "CampTeam"("tournamentId");

-- CreateIndex
CREATE UNIQUE INDEX "CampTeam_tournamentId_key_key" ON "CampTeam"("tournamentId", "key");

-- CreateIndex
CREATE INDEX "CampPlayer_teamId_idx" ON "CampPlayer"("teamId");

-- CreateIndex
CREATE INDEX "CampMatch_tournamentId_idx" ON "CampMatch"("tournamentId");

-- CreateIndex
CREATE UNIQUE INDEX "CampMatch_tournamentId_orderIndex_key" ON "CampMatch"("tournamentId", "orderIndex");

-- AddForeignKey
ALTER TABLE "CampTeam" ADD CONSTRAINT "CampTeam_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "CampTournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampPlayer" ADD CONSTRAINT "CampPlayer_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "CampTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampMatch" ADD CONSTRAINT "CampMatch_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "CampTournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampMatch" ADD CONSTRAINT "CampMatch_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "CampTeam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampMatch" ADD CONSTRAINT "CampMatch_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "CampTeam"("id") ON DELETE SET NULL ON UPDATE CASCADE;
