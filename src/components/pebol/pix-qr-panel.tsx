"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { PitchCard } from "@/components/pebol/page-shell";
import { CopyButton } from "@/components/pebol/copy-button";
import { BuildingIcon, QrCodeIcon } from "lucide-react";

export type PixData = {
  brCode: string;
  merchantName: string;
  titulo: string;
  pixKey: string;
  bank: string;
};

function formatMerchantDisplayName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return trimmed;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

type PixQrPanelProps = {
  agendaId: string;
};

function usePixData(agendaId: string) {
  const [pix, setPix] = useState<PixData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadPix() {
      try {
        const res = await fetch(`/api/pix/${agendaId}`);
        const data = await res.json();
        if (!res.ok) {
          if (!cancelled) setError(data.error ?? "Erro ao carregar PIX");
          return;
        }
        if (!cancelled) setPix(data);
      } catch {
        if (!cancelled) setError("Erro ao carregar PIX");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPix();
    return () => {
      cancelled = true;
    };
  }, [agendaId]);

  return { pix, error, loading };
}

type PixQrContentProps = {
  agendaId: string;
  embedded?: boolean;
};

export function PixQrContent({ agendaId, embedded = false }: PixQrContentProps) {
  const { pix, error, loading } = usePixData(agendaId);

  if (loading) {
    return (
      <div className="flex w-full flex-col items-center gap-4">
        <Skeleton className="size-48 rounded-xl" />
        <Skeleton className="h-11 w-full" />
      </div>
    );
  }

  if (error || !pix) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error ?? "PIX indisponível para esta agenda"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div
      className={
        embedded
          ? "flex w-full flex-col items-center gap-4"
          : "flex flex-col items-center gap-4"
      }
    >
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <QrCodeIcon className="size-5 text-primary" />
          <h2 className="font-heading text-xl tracking-wide">PAGAR VIA PIX</h2>
        </div>
        <Badge variant="outline" className="font-normal">
          {pix.bank}
        </Badge>
      </div>

      <p className="w-full text-sm text-muted-foreground">
        {pix.titulo} · Valor livre — você define no app do banco
      </p>

      <div className="flex w-full items-center gap-2 rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm">
        <BuildingIcon className="size-4 shrink-0 text-primary" />
        <span className="font-medium text-foreground">
          {formatMerchantDisplayName(pix.merchantName)}
        </span>
        <span className="text-muted-foreground">·</span>
        <span className="truncate text-muted-foreground">{pix.pixKey}</span>
        <span className="text-muted-foreground">·</span>
        <span className="shrink-0 text-muted-foreground">{pix.bank}</span>
      </div>

      <p className="w-full text-center text-xs text-muted-foreground">
        Escaneie o QR ou copie o código PIX. No app do banco, informe o valor
        que deseja pagar.
      </p>

      <div className="rounded-2xl border-[3px] border-primary/20 bg-white p-4 shadow-sm">
        <QRCode value={pix.brCode} size={192} />
      </div>

      <CopyButton
        value={pix.brCode}
        label="Copiar PIX copia e cola"
        className="w-full"
      />
    </div>
  );
}

export function PixQrPanel({ agendaId }: PixQrPanelProps) {
  return (
    <PitchCard className="flex flex-col items-center gap-4">
      <PixQrContent agendaId={agendaId} />
    </PitchCard>
  );
}
