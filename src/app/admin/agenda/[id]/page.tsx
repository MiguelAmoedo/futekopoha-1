import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAgenda } from "@/actions/agenda";
import { getPresencasByAgenda } from "@/actions/presenca";
import { listPagamentos } from "@/actions/pagamento";
import { serializeAgenda } from "@/lib/serialize-agenda";
import { PageShell, PitchCard } from "@/components/pebol/page-shell";
import { PebolLogoLink, AgendaInfo } from "@/components/pebol/agenda-info";
import { ParticipantPagamentoRow } from "@/components/pebol/participant-pagamento-row";
import { AgendaPageSkeleton } from "@/components/pebol/loading-skeletons";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ExternalLinkIcon } from "lucide-react";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getAgenda(id);
  if (!result.success) return { title: "Agenda" };
  return { title: `${result.data.titulo} · Admin` };
}

async function AdminAgendaContent({ id }: { id: string }) {
  const [agendaResult, presencasResult, pagamentosResult] = await Promise.all([
    getAgenda(id),
    getPresencasByAgenda(id),
    listPagamentos(id),
  ]);

  if (!agendaResult.success) notFound();

  if (!presencasResult.success) {
    return (
      <PitchCard>
        <p className="text-destructive">{presencasResult.error}</p>
      </PitchCard>
    );
  }

  if (!pagamentosResult.success) {
    return (
      <PitchCard>
        <p className="text-destructive">{pagamentosResult.error}</p>
      </PitchCard>
    );
  }

  const agenda = serializeAgenda(agendaResult.data);
  const presencas = presencasResult.data;
  const pagamentos = pagamentosResult.data;
  const pagamentosMap = new Map(pagamentos.map((p) => [p.nome, p.pago]));

  return (
    <div className="flex flex-col gap-4">
      <AgendaInfo
        titulo={agenda.titulo}
        dataHora={agenda.dataHora}
        local={agenda.local}
        valor={agenda.valor}
      />

      <div className="flex flex-col gap-2">
        <Button
          nativeButton={false}
          render={<Link href={`/lista/${id}`} />}
          variant="outline"
          className="min-h-11 w-full cursor-pointer"
        >
          <ExternalLinkIcon data-icon="inline-start" />
          Abrir lista online
        </Button>
        <Button
          nativeButton={false}
          render={<Link href={`/pebol/${id}`} />}
          variant="ghost"
          className="min-h-11 w-full cursor-pointer"
        >
          Ver página RSVP
        </Button>
      </div>

      <PitchCard className="flex flex-col gap-3">
        <h2 className="font-heading text-xl tracking-wide">
          PAGAMENTOS ({presencas.length})
        </h2>
        {presencas.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Ninguém confirmou presença ainda.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {presencas.map((presenca) => (
              <ParticipantPagamentoRow
                key={presenca.id}
                presenca={presenca}
                pago={pagamentosMap.get(presenca.nome) ?? false}
                agendaId={id}
              />
            ))}
          </div>
        )}
      </PitchCard>
    </div>
  );
}

export default async function AdminAgendaPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <PageShell
      header={
        <div className="flex w-full items-center gap-3">
          <Button
            nativeButton={false}
            render={<Link href="/admin" />}
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
      <Suspense fallback={<AgendaPageSkeleton />}>
        <AdminAgendaContent id={id} />
      </Suspense>
    </PageShell>
  );
}
