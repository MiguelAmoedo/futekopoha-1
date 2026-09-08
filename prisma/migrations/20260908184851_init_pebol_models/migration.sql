-- CreateEnum
CREATE TYPE "StatusPresenca" AS ENUM ('VAI', 'NAO_VAI', 'TALVEZ');

-- CreateTable
CREATE TABLE "Agenda" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL,
    "local" TEXT,
    "valor" DECIMAL(10,2),
    "chavePix" TEXT,
    "nomeRecebedor" TEXT,
    "cidadePix" TEXT,
    "mensagemPix" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Presenca" (
    "id" TEXT NOT NULL,
    "agendaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "status" "StatusPresenca" NOT NULL,
    "sessionKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Presenca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jogador" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "fotoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jogador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Estatistica" (
    "jogadorId" TEXT NOT NULL,
    "pebols" INTEGER NOT NULL DEFAULT 0,
    "gols" INTEGER NOT NULL DEFAULT 0,
    "vitorias" INTEGER NOT NULL DEFAULT 0,
    "assistencias" INTEGER NOT NULL DEFAULT 0,
    "premiosCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Estatistica_pkey" PRIMARY KEY ("jogadorId")
);

-- CreateTable
CREATE TABLE "Premio" (
    "id" TEXT NOT NULL,
    "jogadorId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "data" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Premio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pagamento" (
    "id" TEXT NOT NULL,
    "agendaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "pago" BOOLEAN NOT NULL DEFAULT false,
    "valor" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pagamento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Presenca_agendaId_nome_idx" ON "Presenca"("agendaId", "nome");

-- CreateIndex
CREATE UNIQUE INDEX "Presenca_agendaId_nome_sessionKey_key" ON "Presenca"("agendaId", "nome", "sessionKey");

-- CreateIndex
CREATE UNIQUE INDEX "Jogador_slug_key" ON "Jogador"("slug");

-- CreateIndex
CREATE INDEX "Premio_jogadorId_idx" ON "Premio"("jogadorId");

-- CreateIndex
CREATE UNIQUE INDEX "Pagamento_agendaId_nome_key" ON "Pagamento"("agendaId", "nome");

-- AddForeignKey
ALTER TABLE "Presenca" ADD CONSTRAINT "Presenca_agendaId_fkey" FOREIGN KEY ("agendaId") REFERENCES "Agenda"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estatistica" ADD CONSTRAINT "Estatistica_jogadorId_fkey" FOREIGN KEY ("jogadorId") REFERENCES "Jogador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Premio" ADD CONSTRAINT "Premio_jogadorId_fkey" FOREIGN KEY ("jogadorId") REFERENCES "Jogador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagamento" ADD CONSTRAINT "Pagamento_agendaId_fkey" FOREIGN KEY ("agendaId") REFERENCES "Agenda"("id") ON DELETE CASCADE ON UPDATE CASCADE;
