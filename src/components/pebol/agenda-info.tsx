"use client";

import {
  CalendarIcon,
  MapPinIcon,
  WalletIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { APP_NAME_SHORT } from "@/lib/brand";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { BrandLogo } from "@/components/pebol/brand-logo";
import { PitchCard } from "@/components/pebol/page-shell";
import { PixQrContent } from "@/components/pebol/pix-qr-panel";

type AgendaInfoProps = {
  titulo: string;
  dataHora: string;
  local?: string | null;
  valor?: string | number | null;
  agendaId?: string;
  showPix?: boolean;
};

export function AgendaInfo({
  titulo,
  dataHora,
  local,
  valor,
  agendaId,
  showPix = false,
}: AgendaInfoProps) {
  return (
    <PitchCard className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-6 size-32 rounded-full border-[3px] border-primary/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-2 -top-2 size-20 rounded-full border-2 border-primary/15"
      />
      <div className="relative flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <Badge variant="secondary" className="w-fit font-semibold uppercase tracking-wide">
            {APP_NAME_SHORT} KOPOHA
          </Badge>
          <h1 className="font-heading text-3xl leading-tight tracking-wide text-foreground">
            {titulo.toUpperCase()}
          </h1>
        </div>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <p className="flex min-h-11 items-center gap-2">
            <CalendarIcon className="size-4 shrink-0 text-primary" />
            {formatDateTime(dataHora)}
          </p>
          {local ? (
            <p className="flex min-h-11 items-center gap-2">
              <MapPinIcon className="size-4 shrink-0 text-primary" />
              {local}
            </p>
          ) : null}
          {valor != null && Number(valor) > 0 ? (
            <p className="flex min-h-11 items-center gap-2 font-semibold text-foreground">
              <WalletIcon className="size-4 shrink-0 text-primary" />
              Sugestão: {formatCurrency(valor)}
            </p>
          ) : null}
        </div>

        {showPix && agendaId ? (
          <div className="border-t border-border pt-4">
            <PixQrContent agendaId={agendaId} embedded />
          </div>
        ) : null}
      </div>
    </PitchCard>
  );
}

export function PebolLogoLink() {
  return <BrandLogo variant="header" />;
}
