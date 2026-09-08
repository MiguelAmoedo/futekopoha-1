"use server";

import { revalidatePath } from "next/cache";
import { ok, fail, type ActionResult } from "@/lib/action-result";
import { db, type Agenda } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";

export type AgendaInput = {
  titulo: string;
  dataHora: Date | string;
  local?: string | null;
  valor?: number | string | null;
  chavePix?: string | null;
  nomeRecebedor?: string | null;
  cidadePix?: string | null;
  mensagemPix?: string | null;
};

function parseDataHora(value: Date | string): Date {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Data e hora inválidas");
  }
  return date;
}

function parseValor(value?: number | string | null): Prisma.Decimal | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  return new Prisma.Decimal(value);
}

function agendaData(input: AgendaInput): Prisma.AgendaCreateInput {
  return {
    titulo: input.titulo.trim(),
    dataHora: parseDataHora(input.dataHora),
    local: input.local?.trim() || null,
    valor: parseValor(input.valor) ?? null,
    chavePix: input.chavePix?.trim() || null,
    nomeRecebedor: input.nomeRecebedor?.trim() || null,
    cidadePix: input.cidadePix?.trim() || null,
    mensagemPix: input.mensagemPix?.trim() || null,
  };
}

function revalidateAgendaPaths(id: string) {
  revalidatePath("/admin");
  revalidatePath(`/lista/${id}`);
  revalidatePath(`/pebol/${id}`);
  revalidatePath(`/api/og/lista`);
  revalidatePath(`/api/pix/${id}`);
}

export async function createAgenda(input: AgendaInput): Promise<ActionResult<Agenda>> {
  try {
    if (!input.titulo?.trim()) return fail("Título é obrigatório");

    const agenda = await db.agenda.create({ data: agendaData(input) });
    revalidateAgendaPaths(agenda.id);
    return ok(agenda);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Erro ao criar agenda");
  }
}

export async function updateAgenda(
  id: string,
  input: Partial<AgendaInput>,
): Promise<ActionResult<Agenda>> {
  try {
    if (!id) return fail("ID da agenda é obrigatório");

    const data: Prisma.AgendaUpdateInput = {};
    if (input.titulo !== undefined) data.titulo = input.titulo.trim();
    if (input.dataHora !== undefined) data.dataHora = parseDataHora(input.dataHora);
    if (input.local !== undefined) data.local = input.local?.trim() || null;
    if (input.valor !== undefined) data.valor = parseValor(input.valor) ?? null;
    if (input.chavePix !== undefined) data.chavePix = input.chavePix?.trim() || null;
    if (input.nomeRecebedor !== undefined) {
      data.nomeRecebedor = input.nomeRecebedor?.trim() || null;
    }
    if (input.cidadePix !== undefined) data.cidadePix = input.cidadePix?.trim() || null;
    if (input.mensagemPix !== undefined) data.mensagemPix = input.mensagemPix?.trim() || null;

    const agenda = await db.agenda.update({ where: { id }, data });
    revalidateAgendaPaths(agenda.id);
    return ok(agenda);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Erro ao atualizar agenda");
  }
}

export async function deleteAgenda(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    if (!id) return fail("ID da agenda é obrigatório");

    await db.agenda.delete({ where: { id } });
    revalidateAgendaPaths(id);
    return ok({ id });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Erro ao excluir agenda");
  }
}

export async function getAgenda(id: string): Promise<ActionResult<Agenda>> {
  try {
    if (!id) return fail("ID da agenda é obrigatório");

    const agenda = await db.agenda.findUnique({ where: { id } });
    if (!agenda) return fail("Agenda não encontrada");

    return ok(agenda);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Erro ao buscar agenda");
  }
}

export async function listAgendas(): Promise<ActionResult<Agenda[]>> {
  try {
    const agendas = await db.agenda.findMany({
      orderBy: { dataHora: "desc" },
    });
    return ok(agendas);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Erro ao listar agendas");
  }
}
