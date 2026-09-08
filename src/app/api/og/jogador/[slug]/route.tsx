import { buildJogadorOgImage } from "@/lib/og-images";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  if (!slug) {
    return new Response("Missing slug", { status: 400 });
  }

  const image = await buildJogadorOgImage(slug);
  if (!image) {
    return new Response("Jogador not found", { status: 404 });
  }

  return image;
}
