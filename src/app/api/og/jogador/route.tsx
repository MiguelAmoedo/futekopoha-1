import { NextRequest } from "next/server";
import { buildJogadorOgImage } from "@/lib/og-images";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");

  if (!slug) {
    return new Response("Missing slug query parameter", { status: 400 });
  }

  const image = await buildJogadorOgImage(slug);
  if (!image) {
    return new Response("Jogador not found", { status: 404 });
  }

  return image;
}
