import type { Metadata } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getAgenda } from "@/actions/agenda";
import { getPresencasByAgenda } from "@/actions/presenca";
import { listPagamentos } from "@/actions/pagamento";
import { absoluteUrl } from "@/lib/url";
import { serializeAgenda } from "@/lib/serialize-agenda";
import { PageShell } from "@/components/pebol/page-shell";
import { PebolLogoLink, AgendaInfo } from "@/components/pebol/agenda-info";
import { PresencaListWithPagamento } from "@/components/pebol/presenca-list";
import { PixQrPanel } from "@/components/pebol/pix-qr-panel";
import { WhatsAppShareButton } from "@/components/pebol/whatsapp-share-button";
import { CopyButton } from "@/components/pebol/copy-button";
import { AgendaPageSkeleton } from "@/components/pebol/loading-skeletons";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getAgenda(id);

  if (!result.success) {
    return { title: "Lista" };
  }

  const agenda = result.data;
  const url = absoluteUrl(`/lista/${id}`);

  return {
    title: `Lista · ${agenda.titulo}`,
    description: `Lista online e PIX do pebol: ${agenda.titulo}`,
    openGraph: {
      title: `Lista · ${agenda.titulo}`,
      description: "Veja quem vai e pague via PIX",
      url,
      siteName: "PEBOL KOPOHA",
      type: "website",
      locale: "pt_BR",
      images: [
        {
          url: absoluteUrl(`/api/og/lista?agendaId=${id}`),
          width: 1200,
          height: 630,
          alt: agenda.titulo,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Lista · ${agenda.titulo} · PEBOL KOPOHA`,
      images: [absoluteUrl(`/api/og/lista?agendaId=${id}`)],
    },
  };
}

async function ListaContent({ id }: { id: string }) {
  const [agendaResult, presencasResult, pagamentosResult] = await Promise.all([
    getAgenda(id),
    getPresencasByAgenda(id),
    listPagamentos(id),
  ]);

  if (!agendaResult.success) notFound();
  if (!presencasResult.success || !pagamentosResult.success) {
    return <p className="text-destructive">Erro ao carregar lista</p>;
  }

  const headersList = await headers();
  const origin = headersList.get("x-forwarded-host")
    ? `${headersList.get("x-forwarded-proto") ?? "https"}://${headersList.get("x-forwarded-host")}`
    : undefined;
  const shareUrl = absoluteUrl(`/lista/${id}`, origin);

  const pagamentosMap = new Map(
    pagamentosResult.data.map((p) => [p.nome, p.pago]),
  );

  const agenda = serializeAgenda(agendaResult.data);

  return (
    <div className="flex flex-col gap-4">
      <AgendaInfo
        titulo={agenda.titulo}
        dataHora={agenda.dataHora}
        local={agenda.local}
        valor={agenda.valor}
      />

      <div className="flex flex-col gap-2">
        <WhatsAppShareButton
          shareUrl={shareUrl}
          message={`Lista do pebol no PEBOL KOPOHA — ${agenda.titulo}: ${shareUrl}`}
        />
        <CopyButton value={shareUrl} label="Copiar link da lista" className="w-full" />
      </div>

      <PixQrPanel agendaId={id} />

      <PresencaListWithPagamento
        presencas={presencasResult.data}
        pagamentosMap={pagamentosMap}
      />
    </div>
  );
}

export default async function ListaPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <PageShell header={<PebolLogoLink />}>
      <Suspense fallback={<AgendaPageSkeleton />}>
        <ListaContent id={id} />
      </Suspense>
    </PageShell>
  );
}
