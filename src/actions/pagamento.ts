"use server";

import { revalidatePath } from "next/cache";
import { ok, fail, type ActionResult } from "@/lib/action-result";
import { db, type Pagamento } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";

function revalidatePagamentoPaths(agendaId: string) {
  revalidatePath(`/lista/${agendaId}`);
  revalidatePath(`/api/og/lista`);
  revalidatePath(`/api/pix/${agendaId}`);
}

export async function togglePagamento(
  agendaId: string,
  nome: string,
): Promise<ActionResult<Pagamento>> {
  try {
    const trimmedNome = nome?.trim();
    if (!agendaId) return fail("ID da agenda é obrigatório");
    if (!trimmedNome) return fail("Nome é obrigatório");

    const existing = await db.pagamento.findUnique({
      where: { agendaId_nome: { agendaId, nome: trimmedNome } },
    });

    const pagamento = existing
      ? await db.pagamento.update({
          where: { id: existing.id },
          data: { pago: !existing.pago },
        })
      : await db.pagamento.create({
          data: { agendaId, nome: trimmedNome, pago: true },
        });

    revalidatePagamentoPaths(agendaId);
    return ok(pagamento);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Erro ao alternar pagamento");
  }
}

export async function listPagamentos(
  agendaId: string,
): Promise<ActionResult<Pagamento[]>> {
  try {
    if (!agendaId) return fail("ID da agenda é obrigatório");

    const pagamentos = await db.pagamento.findMany({
      where: { agendaId },
      orderBy: [{ pago: "desc" }, { nome: "asc" }],
    });

    return ok(pagamentos);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Erro ao listar pagamentos");
  }
}

export async function setPagamentoStatus(
  agendaId: string,
  nome: string,
  pago: boolean,
  valor?: number | string | null,
): Promise<ActionResult<Pagamento>> {
  try {
    const trimmedNome = nome?.trim();
    if (!agendaId) return fail("ID da agenda é obrigatório");
    if (!trimmedNome) return fail("Nome é obrigatório");

    const valorDecimal =
      valor === undefined
        ? undefined
        : valor === null || valor === ""
          ? null
          : new Prisma.Decimal(valor);

    const pagamento = await db.pagamento.upsert({
      where: { agendaId_nome: { agendaId, nome: trimmedNome } },
      create: {
        agendaId,
        nome: trimmedNome,
        pago,
        valor: valorDecimal ?? null,
      },
      update: {
        pago,
        ...(valorDecimal !== undefined ? { valor: valorDecimal } : {}),
      },
    });

    revalidatePagamentoPaths(agendaId);
    return ok(pagamento);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Erro ao atualizar pagamento");
  }
}
