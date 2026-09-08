import type { Agenda } from "@/lib/db";
import type { PebolAgendaView } from "@/lib/pebol-types";

/** Converte Agenda Prisma (Decimal/Date) para props seguras em Client Components. */
export function serializeAgenda(agenda: Agenda): PebolAgendaView {
  return {
    id: agenda.id,
    titulo: agenda.titulo,
    dataHora: agenda.dataHora.toISOString(),
    local: agenda.local,
    valor: agenda.valor != null ? agenda.valor.toString() : null,
    chavePix: agenda.chavePix,
    nomeRecebedor: agenda.nomeRecebedor,
    cidadePix: agenda.cidadePix,
    mensagemPix: agenda.mensagemPix,
  };
}

export function serializeAgendas(agendas: Agenda[]): PebolAgendaView[] {
  return agendas.map(serializeAgenda);
}
