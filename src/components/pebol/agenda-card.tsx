import Link from "next/link";
import {
  CalendarIcon,
  ChevronRightIcon,
  ListIcon,
  MapPinIcon,
} from "lucide-react";
import type { PebolAgendaView } from "@/lib/pebol-types";
import { formatDateTime, formatCurrency } from "@/lib/format";
import { absoluteUrl } from "@/lib/url";
import { PitchCard } from "@/components/pebol/page-shell";
import { WhatsAppShareButton } from "@/components/pebol/whatsapp-share-button";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/pebol/copy-button";
import { Badge } from "@/components/ui/badge";

type AgendaCardProps = {
  agenda: PebolAgendaView;
  origin?: string;
};

export function AgendaCard({ agenda, origin }: AgendaCardProps) {
  const pebolUrl = absoluteUrl(`/pebol/${agenda.id}`, origin);

  return (
    <PitchCard hover className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-heading text-xl tracking-wide">{agenda.titulo.toUpperCase()}</h2>
          {agenda.valor != null && Number(agenda.valor) > 0 ? (
            <Badge>{formatCurrency(agenda.valor)}</Badge>
          ) : null}
        </div>
        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
          <p className="flex min-h-11 items-center gap-2">
            <CalendarIcon className="size-4 text-primary" />
            {formatDateTime(agenda.dataHora)}
          </p>
          {agenda.local ? (
            <p className="flex min-h-11 items-center gap-2">
              <MapPinIcon className="size-4 text-primary" />
              {agenda.local}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <WhatsAppShareButton
          shareUrl={pebolUrl}
          message={`Bora pro pebol no PEBOL KOPOHA! ${agenda.titulo} — confirma tua presença: ${pebolUrl}`}
        />
        <CopyButton value={pebolUrl} label="Copiar link RSVP" className="w-full" />
        <Button
          nativeButton={false}
          render={<Link href={`/admin/agenda/${agenda.id}`} />}
          variant="outline"
          className="min-h-11 w-full cursor-pointer"
        >
          <ListIcon data-icon="inline-start" />
          Gerenciar lista
          <ChevronRightIcon data-icon="inline-end" />
        </Button>
        <Button
          nativeButton={false}
          render={<Link href={`/lista/${agenda.id}`} />}
          variant="ghost"
          className="min-h-11 w-full cursor-pointer"
        >
          Ver lista pública
        </Button>
      </div>
    </PitchCard>
  );
}
