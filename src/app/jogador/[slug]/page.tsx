import type { Metadata } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getJogadorBySlug } from "@/actions/jogador";
import { absoluteUrl } from "@/lib/url";
import { PageShell } from "@/components/pebol/page-shell";
import { PebolLogoLink } from "@/components/pebol/agenda-info";
import { PlayerHeroCard } from "@/components/pebol/player-hero-card";
import { PlayerCardSkeleton } from "@/components/pebol/loading-skeletons";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getJogadorBySlug(slug);

  if (!result.success) {
    return { title: "Jogador" };
  }

  const jogador = result.data;
  const url = absoluteUrl(`/jogador/${slug}`);

  return {
    title: jogador.nome,
    description: `Cartão de jogador PEBOL KOPOHA — ${jogador.nome}`,
    openGraph: {
      title: `${jogador.nome} · PEBOL KOPOHA`,
      description: "Cartão de jogador PEBOL KOPOHA",
      url,
      siteName: "PEBOL KOPOHA",
      type: "profile",
      locale: "pt_BR",
      images: [
        {
          url: absoluteUrl(`/api/og/jogador/${slug}`),
          width: 600,
          height: 900,
          alt: jogador.nome,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${jogador.nome} · PEBOL KOPOHA`,
      images: [absoluteUrl(`/api/og/jogador/${slug}`)],
    },
  };
}

async function JogadorContent({ slug }: { slug: string }) {
  const result = await getJogadorBySlug(slug);
  if (!result.success) notFound();

  const headersList = await headers();
  const origin = headersList.get("x-forwarded-host")
    ? `${headersList.get("x-forwarded-proto") ?? "https"}://${headersList.get("x-forwarded-host")}`
    : undefined;

  const shareUrl = absoluteUrl(`/jogador/${slug}`, origin);

  return <PlayerHeroCard jogador={result.data} shareUrl={shareUrl} />;
}

export default async function JogadorPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <PageShell
      header={
        <div className="flex w-full items-center gap-3">
          <Button
            nativeButton={false}
            render={<Link href="/jogador/criar" />}
            variant="ghost"
            size="icon"
            className="cursor-pointer"
          >
            <ChevronLeftIcon />
          </Button>
          <PebolLogoLink />
        </div>
      }
    >
      <Suspense fallback={<PlayerCardSkeleton />}>
        <JogadorContent slug={slug} />
      </Suspense>
    </PageShell>
  );
}
