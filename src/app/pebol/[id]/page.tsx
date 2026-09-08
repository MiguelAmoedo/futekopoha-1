import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getAgenda } from "@/actions/agenda";
import { getPresencasByAgenda } from "@/actions/presenca";
import { APP_NAME } from "@/lib/brand";
import { absoluteUrl } from "@/lib/url";
import { serializeAgenda } from "@/lib/serialize-agenda";
import { PageShell } from "@/components/pebol/page-shell";
import { PebolLogoLink } from "@/components/pebol/agenda-info";
import { AgendaPageSkeleton } from "@/components/pebol/loading-skeletons";
import { RsvpClient } from "./rsvp-client";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getAgenda(id);

  if (!result.success) {
    return { title: APP_NAME };
  }

  const agenda = result.data;
  const url = absoluteUrl(`/pebol/${id}`);

  return {
    title: agenda.titulo,
    description: `Confirma tua presença no pebol: ${agenda.titulo}`,
    openGraph: {
      title: `${agenda.titulo} · ${APP_NAME}`,
      description: agenda.local
        ? `${agenda.local} — confirma tua presença!`
        : "Confirma tua presença no pebol!",
      url,
      siteName: APP_NAME,
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
      title: `${agenda.titulo} · ${APP_NAME}`,
      images: [absoluteUrl(`/api/og/lista?agendaId=${id}`)],
    },
  };
}

async function PebolRsvpContent({ id }: { id: string }) {
  const [agendaResult, presencasResult] = await Promise.all([
    getAgenda(id),
    getPresencasByAgenda(id),
  ]);

  if (!agendaResult.success) notFound();
  if (!presencasResult.success) {
    return <p className="text-destructive">{presencasResult.error}</p>;
  }

  return (
    <RsvpClient
      agenda={serializeAgenda(agendaResult.data)}
      presencas={presencasResult.data}
    />
  );
}

export default async function PebolRsvpPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <PageShell header={<PebolLogoLink />}>
      <Suspense fallback={<AgendaPageSkeleton />}>
        <PebolRsvpContent id={id} />
      </Suspense>
    </PageShell>
  );
}
