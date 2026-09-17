import type { Metadata } from "next";
import Link from "next/link";
import { CampShell } from "@/components/camp/camp-shell";
import { AdminMatchEditor } from "@/components/camp/admin-match-editor";
import { StandingsTable } from "@/components/camp/standings-table";
import { BracketView } from "@/components/camp/bracket-view";
import { fetchTournamentFromDb } from "@/lib/camp/tournament-data";
import { Button } from "@/components/ui/button";
import { SettingsIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin · Camp",
  description: "Administração da Copa Resenha Kopoha 1",
};

type CampAdminPageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function CampAdminPage({ searchParams }: CampAdminPageProps) {
  const { token } = await searchParams;
  const adminToken = token ?? process.env.CAMP_ADMIN_TOKEN ?? "camp-admin-dev";

  const tournament = await fetchTournamentFromDb();

  if (!tournament) {
    return (
      <CampShell title="Admin" subtitle="Camp" hideNav backHref="/camp">
        <div className="camp-surface camp-card p-4 text-sm text-muted-foreground">
          <p>Torneio não encontrado no banco.</p>
          <p className="mt-2">
            Rode <code className="text-foreground">npx prisma migrate dev</code> e{" "}
            <code className="text-foreground">npm run db:seed</code>.
          </p>
        </div>
      </CampShell>
    );
  }

  const fase1Matches = tournament.matches.filter((m) => m.phase === "fase1");
  const fase1Complete = fase1Matches.every((m) => m.status === "finished");

  return (
    <CampShell
      title="Admin"
      subtitle={tournament.name}
      backHref="/camp"
      hideNav
      className="gap-4"
    >
      <div className="camp-surface camp-card flex flex-col gap-2 p-4">
        <div className="flex items-center gap-2">
          <SettingsIcon aria-hidden="true" className="size-5 text-[var(--camp-gold)]" />
          <h2 className="font-heading text-base uppercase tracking-wide">Painel do torneio</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Token via query <code className="text-foreground">?token=...</code> ou env{" "}
          <code className="text-foreground">CAMP_ADMIN_TOKEN</code> (padrão: camp-admin-dev).
        </p>
        <Button
          nativeButton={false}
          render={<Link href={`/camp/admin?token=${encodeURIComponent(adminToken)}`} />}
          variant="outline"
          size="sm"
          className="w-fit cursor-pointer"
        >
          Recarregar com token atual
        </Button>
      </div>

      <StandingsTable standings={tournament.standings} teams={tournament.teams} />

      <BracketView
        standings={tournament.standings}
        matches={tournament.matches}
      />

      <section className="flex flex-col gap-2">
        <h2 className="camp-chrome font-heading text-base font-semibold uppercase tracking-wide">
          Jogos
        </h2>
        <AdminMatchEditor
          matches={tournament.matches}
          teams={tournament.teams}
          adminToken={adminToken}
          fase1Complete={fase1Complete}
        />
      </section>
    </CampShell>
  );
}
