import type { Metadata } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";
import Link from "next/link";
import { listAgendas } from "@/actions/agenda";
import { serializeAgendas } from "@/lib/serialize-agenda";
import { PageShell, PitchCard } from "@/components/pebol/page-shell";
import { PebolLogoLink } from "@/components/pebol/agenda-info";
import { NovaAgendaSheet } from "@/components/pebol/nova-agenda-sheet";
import { AgendaCard } from "@/components/pebol/agenda-card";
import { AgendaListSkeleton } from "@/components/pebol/loading-skeletons";
import { Button } from "@/components/ui/button";
import { UserPlusIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin",
  description: "Gerencie agendas e listas do pebol",
};

async function AdminAgendaList() {
  const result = await listAgendas();
  const headersList = await headers();
  const origin = headersList.get("x-forwarded-host")
    ? `${headersList.get("x-forwarded-proto") ?? "https"}://${headersList.get("x-forwarded-host")}`
    : undefined;

  if (!result.success) {
    return (
      <PitchCard>
        <p className="text-destructive">{result.error}</p>
      </PitchCard>
    );
  }

  if (result.data.length === 0) {
    return (
      <PitchCard>
        <p className="text-muted-foreground">
          Nenhuma agenda ainda. Cria a primeira e manda no grupo!
        </p>
      </PitchCard>
    );
  }

  const agendas = serializeAgendas(result.data);

  return (
    <div className="flex flex-col gap-4">
      {agendas.map((agenda) => (
        <AgendaCard key={agenda.id} agenda={agenda} origin={origin} />
      ))}
    </div>
  );
}

export default function AdminPage() {
  return (
    <PageShell
      header={
        <div className="flex w-full items-center justify-between gap-3">
          <PebolLogoLink />
          <span className="text-sm font-medium text-muted-foreground">Admin</span>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl tracking-wide">AGENDAS</h1>
          <p className="text-sm text-muted-foreground">
            Crie pebols, compartilhe no WhatsApp e acompanhe pagamentos.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <NovaAgendaSheet />
          <Button
            nativeButton={false}
            render={<Link href="/jogador/criar" />}
            variant="outline"
            className="min-h-11 cursor-pointer"
          >
            <UserPlusIcon data-icon="inline-start" />
            Criar / editar jogador
          </Button>
        </div>

        <Suspense fallback={<AgendaListSkeleton />}>
          <AdminAgendaList />
        </Suspense>
      </div>
    </PageShell>
  );
}
