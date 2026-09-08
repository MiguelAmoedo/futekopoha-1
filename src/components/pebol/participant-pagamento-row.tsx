"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { togglePagamento } from "@/actions/pagamento";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { presencaBadgeVariant, presencaLabel } from "@/lib/format";
import type { PebolPresencaView } from "@/lib/pebol-types";

type ParticipantPagamentoRowProps = {
  presenca: PebolPresencaView;
  pago: boolean;
  agendaId: string;
};

export function ParticipantPagamentoRow({
  presenca,
  pago,
  agendaId,
}: ParticipantPagamentoRowProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleToggle(checked: boolean) {
    startTransition(async () => {
      await togglePagamento(agendaId, presenca.nome);
      router.refresh();
    });
  }

  return (
    <div className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-border bg-background px-3 py-2">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate font-medium">{presenca.nome}</span>
        <Badge variant={presencaBadgeVariant(presenca.status)} className="w-fit">
          {presencaLabel(presenca.status)}
        </Badge>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Badge variant={pago ? "default" : "outline"}>
          {pago ? "Pago" : "Pendente"}
        </Badge>
        <div className="flex items-center gap-2">
          <Switch
            id={`pagamento-${presenca.id}`}
            checked={pago}
            disabled={pending}
            onCheckedChange={handleToggle}
            className="cursor-pointer"
          />
          <Label htmlFor={`pagamento-${presenca.id}`} className="sr-only">
            Pagamento de {presenca.nome}
          </Label>
        </div>
      </div>
    </div>
  );
}
