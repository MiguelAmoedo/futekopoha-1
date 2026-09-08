import { NextRequest } from "next/server";
import { buildListaOgImage } from "@/lib/og-images";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const agendaId = request.nextUrl.searchParams.get("agendaId");

  if (!agendaId) {
    return new Response("Missing agendaId query parameter", { status: 400 });
  }

  const image = await buildListaOgImage(agendaId);
  if (!image) {
    return new Response("Agenda not found", { status: 404 });
  }

  return image;
}
