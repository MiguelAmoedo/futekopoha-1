"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckIcon, HelpCircleIcon, XIcon } from "lucide-react";
import { setPresenca } from "@/actions/presenca";
import { STATUS_PRESENCA, type StatusPresencaValue } from "@/lib/pebol-types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PresencaButtonsProps = {
  agendaId: string;
  nome: string;
  sessionId: string;
  currentStatus?: string | null;
};

const options = [
  {
    status: STATUS_PRESENCA.VAI,
    label: "VOU",
    icon: CheckIcon,
    className: "bg-primary text-primary-foreground hover:bg-primary/90",
  },
  {
    status: STATUS_PRESENCA.NAO_VAI,
    label: "NÃO VOU",
    icon: XIcon,
    className: "bg-destructive/10 text-destructive hover:bg-destructive/20",
  },
  {
    status: STATUS_PRESENCA.TALVEZ,
    label: "TALVEZ",
    icon: HelpCircleIcon,
    className: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  },
] as const;

export function PresencaButtons({
  agendaId,
  nome,
  sessionId,
  currentStatus,
}: PresencaButtonsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleSelect(status: StatusPresencaValue) {
    if (!nome.trim()) return;

    startTransition(async () => {
      await setPresenca(agendaId, nome, status, sessionId);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {options.map(({ status, label, icon: Icon, className }) => {
        const selected = currentStatus === status;
        return (
          <Button
            key={status}
            type="button"
            disabled={pending || !nome.trim()}
            onClick={() => handleSelect(status)}
            className={cn(
              "min-h-14 w-full cursor-pointer rounded-2xl border-[3px] text-base font-bold transition-all",
              selected
                ? "border-foreground shadow-[0_4px_0_0_var(--foreground)]"
                : "border-border",
              className,
            )}
          >
            <Icon data-icon="inline-start" />
            {label}
          </Button>
        );
      })}
    </div>
  );
}
