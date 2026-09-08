"use server";

import { revalidatePath } from "next/cache";
import { ok, fail, type ActionResult } from "@/lib/action-result";
import { db, type Presenca, StatusPresenca } from "@/lib/db";
import { normalizeSessionKey } from "@/lib/session-key";

export async function setPresenca(
  agendaId: string,
  nome: string,
  status: StatusPresenca,
  sessionKey?: string | null,
): Promise<ActionResult<Presenca>> {
  try {
    const trimmedNome = nome?.trim();
    if (!agendaId) return fail("ID da agenda é obrigatório");
    if (!trimmedNome) return fail("Nome é obrigatório");
    if (!Object.values(StatusPresenca).includes(status)) {
      return fail("Status de presença inválido");
    }

    const agenda = await db.agenda.findUnique({ where: { id: agendaId } });
    if (!agenda) return fail("Agenda não encontrada");

    const key = normalizeSessionKey(sessionKey);

    const presenca = await db.presenca.upsert({
      where: {
        agendaId_nome_sessionKey: {
          agendaId,
          nome: trimmedNome,
          sessionKey: key,
        },
      },
      create: {
        agendaId,
        nome: trimmedNome,
        status,
        sessionKey: key,
      },
      update: { status },
    });

    revalidatePath(`/lista/${agendaId}`);
    revalidatePath(`/pebol/${agendaId}`);
    revalidatePath(`/api/og/lista`);
    return ok(presenca);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Erro ao registrar presença");
  }
}

export async function getPresencasByAgenda(
  agendaId: string,
): Promise<ActionResult<Presenca[]>> {
  try {
    if (!agendaId) return fail("ID da agenda é obrigatório");

    const presencas = await db.presenca.findMany({
      where: { agendaId },
      orderBy: [{ status: "asc" }, { nome: "asc" }],
    });

    return ok(presencas);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Erro ao listar presenças");
  }
}
