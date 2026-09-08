"use server";

import { revalidatePath } from "next/cache";
import { ok, fail, type ActionResult } from "@/lib/action-result";
import { uniqueJogadorSlug } from "@/lib/slug";
import { db, type Estatistica, type Jogador } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";

export type EstatisticaInput = {
  pebols?: number;
  gols?: number;
  vitorias?: number;
  assistencias?: number;
  premiosCount?: number;
};

export type JogadorWithStats = Jogador & { estatistica: Estatistica | null };

export async function createJogador(
  nome: string,
  fotoUrl?: string | null,
): Promise<ActionResult<JogadorWithStats>> {
  try {
    const trimmedNome = nome?.trim();
    if (!trimmedNome) return fail("Nome é obrigatório");

    const slug = await uniqueJogadorSlug(trimmedNome, async (candidate) => {
      const existing = await db.jogador.findUnique({ where: { slug: candidate } });
      return existing !== null;
    });

    const jogador = await db.jogador.create({
      data: {
        nome: trimmedNome,
        slug,
        fotoUrl: fotoUrl?.trim() || null,
        estatistica: { create: {} },
      },
      include: { estatistica: true },
    });

    revalidatePath("/admin/jogadores");
    revalidatePath(`/jogador/${slug}`);
    return ok(jogador);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Erro ao criar jogador");
  }
}

export async function getJogadorBySlug(
  slug: string,
): Promise<ActionResult<JogadorWithStats>> {
  try {
    if (!slug?.trim()) return fail("Slug é obrigatório");

    const jogador = await db.jogador.findUnique({
      where: { slug: slug.trim() },
      include: {
        estatistica: true,
        premios: { orderBy: { createdAt: "desc" }, take: 6 },
      },
    });

    if (!jogador) return fail("Jogador não encontrado");

    return ok(jogador);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Erro ao buscar jogador");
  }
}

export async function listJogadores(): Promise<ActionResult<JogadorWithStats[]>> {
  try {
    const jogadores = await db.jogador.findMany({
      include: { estatistica: true },
      orderBy: { nome: "asc" },
    });
    return ok(jogadores);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Erro ao listar jogadores");
  }
}

export async function updateEstatistica(
  jogadorId: string,
  input: EstatisticaInput,
): Promise<ActionResult<Estatistica>> {
  try {
    if (!jogadorId) return fail("ID do jogador é obrigatório");

    const jogador = await db.jogador.findUnique({
      where: { id: jogadorId },
      select: { slug: true },
    });
    if (!jogador) return fail("Jogador não encontrado");

    const data: Prisma.EstatisticaUpdateInput = {};
    for (const field of [
      "pebols",
      "gols",
      "vitorias",
      "assistencias",
      "premiosCount",
    ] as const) {
      const value = input[field];
      if (value !== undefined) {
        if (!Number.isInteger(value) || value < 0) {
          return fail(`${field} deve ser um inteiro não negativo`);
        }
        data[field] = value;
      }
    }

    const estatistica = await db.estatistica.upsert({
      where: { jogadorId },
      create: {
        jogadorId,
        pebols: input.pebols ?? 0,
        gols: input.gols ?? 0,
        vitorias: input.vitorias ?? 0,
        assistencias: input.assistencias ?? 0,
        premiosCount: input.premiosCount ?? 0,
      },
      update: data,
    });

    revalidatePath(`/jogador/${jogador.slug}`);
    revalidatePath(`/api/og/jogador/${jogador.slug}`);
    revalidatePath("/admin/jogadores");
    return ok(estatistica);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Erro ao atualizar estatísticas");
  }
}
