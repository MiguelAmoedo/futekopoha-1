"use client";

import { Badge } from "@/components/ui/badge";
import { presencaBadgeVariant, presencaLabel } from "@/lib/format";
import type { PebolPresencaView } from "@/lib/pebol-types";
import { PitchCard } from "@/components/pebol/page-shell";
import { UsersIcon } from "lucide-react";

type PresencaListProps = {
  presencas: PebolPresencaView[];
  title?: string;
  emptyMessage?: string;
};

export function PresencaList({
  presencas,
  title = "Quem confirmou",
  emptyMessage = "Ninguém confirmou ainda. Seja o primeiro!",
}: PresencaListProps) {
  const vai = presencas.filter((p) => p.status === "VAI");
  const talvez = presencas.filter((p) => p.status === "TALVEZ");
  const naoVai = presencas.filter((p) => p.status === "NAO_VAI");

  return (
    <PitchCard className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <UsersIcon className="size-5 text-primary" />
        <h2 className="font-heading text-xl tracking-wide">{title.toUpperCase()}</h2>
        <Badge variant="secondary">{presencas.length}</Badge>
      </div>

      {presencas.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <div className="flex flex-col gap-4">
          <PresencaGroup label="Vão" items={vai} />
          <PresencaGroup label="Talvez" items={talvez} />
          <PresencaGroup label="Não vão" items={naoVai} />
        </div>
      )}
    </PitchCard>
  );
}

function PresencaGroup({
  label,
  items,
}: {
  label: string;
  items: PebolPresencaView[];
}) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-primary">
        {label} ({items.length})
      </h3>
      <ul className="flex flex-col gap-2">
        {items.map((presenca) => (
          <li
            key={presenca.id}
            className="flex min-h-11 items-center justify-between rounded-xl border border-border bg-background px-3 py-2"
          >
            <span className="font-medium">{presenca.nome}</span>
            <Badge variant={presencaBadgeVariant(presenca.status)}>
              {presencaLabel(presenca.status)}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PresencaListWithPagamento({
  presencas,
  pagamentosMap,
}: {
  presencas: PebolPresencaView[];
  pagamentosMap: Map<string, boolean>;
}) {
  return (
    <PitchCard className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <UsersIcon className="size-5 text-primary" />
        <h2 className="font-heading text-xl tracking-wide">PARTICIPANTES</h2>
      </div>
      <ul className="flex flex-col gap-2">
        {presencas.map((presenca) => {
          const pago = pagamentosMap.get(presenca.nome) ?? false;
          return (
            <li
              key={presenca.id}
              className="flex min-h-11 items-center justify-between gap-2 rounded-xl border border-border bg-background px-3 py-2"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <span className="truncate font-medium">{presenca.nome}</span>
                <Badge
                  variant={presencaBadgeVariant(presenca.status)}
                  className="w-fit"
                >
                  {presencaLabel(presenca.status)}
                </Badge>
              </div>
              <Badge variant={pago ? "default" : "outline"}>
                {pago ? "Pago" : "Pendente"}
              </Badge>
            </li>
          );
        })}
      </ul>
    </PitchCard>
  );
}
