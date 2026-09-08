import { createStaticPix, hasError } from "pix-utils";
import { db } from "@/lib/db";
import {
  resolveMerchantCity,
  resolveMerchantName,
  resolvePixKey,
} from "@/lib/pix-config";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ agendaId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { agendaId } = await context.params;

  if (!agendaId) {
    return Response.json({ error: "ID da agenda é obrigatório" }, { status: 400 });
  }

  const agenda = await db.agenda.findUnique({ where: { id: agendaId } });
  if (!agenda) {
    return Response.json({ error: "Agenda não encontrada" }, { status: 404 });
  }

  const pixKey = resolvePixKey(agenda.chavePix);
  const merchantName = resolveMerchantName(agenda.nomeRecebedor);
  const merchantCity = resolveMerchantCity(agenda.cidadePix);

  const pix = createStaticPix({
    merchantName,
    merchantCity,
    pixKey,
    infoAdicional: agenda.mensagemPix?.trim() || agenda.titulo.trim(),
    txid: agendaId.slice(-25),
    transactionAmount: 0,
  });

  if (hasError(pix)) {
    return Response.json(
      { error: "Não foi possível gerar o payload PIX", details: pix.message },
      { status: 422 },
    );
  }

  const brCode = pix.toBRCode();

  return Response.json({
    agendaId: agenda.id,
    titulo: agenda.titulo,
    brCode,
    merchantName,
    merchantCity,
    pixKey,
    bank: "Nubank",
  });
}
