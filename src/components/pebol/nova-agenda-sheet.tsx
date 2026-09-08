"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";
import { createAgenda, type AgendaInput } from "@/actions/agenda";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function NovaAgendaSheet() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const input: AgendaInput = {
      titulo: String(form.get("titulo") ?? ""),
      dataHora: String(form.get("dataHora") ?? ""),
      local: String(form.get("local") ?? "") || null,
      valor: String(form.get("valor") ?? "") || null,
      chavePix: String(form.get("chavePix") ?? "") || null,
      nomeRecebedor: String(form.get("nomeRecebedor") ?? "") || null,
    };

    startTransition(async () => {
      const result = await createAgenda(input);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button className="min-h-11 cursor-pointer">
            <PlusIcon data-icon="inline-start" />
            Nova agenda
          </Button>
        }
      />
      <SheetContent side="bottom" className="max-h-[90dvh] overflow-y-auto rounded-t-2xl">
        <SheetHeader>
          <SheetTitle className="font-heading text-2xl tracking-wide">NOVA AGENDA</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 pb-4">
          <FieldGroup>
            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
            <Field>
              <FieldLabel htmlFor="titulo">Título</FieldLabel>
              <Input id="titulo" name="titulo" required placeholder="Pebol de quarta" />
            </Field>
            <Field>
              <FieldLabel htmlFor="dataHora">Data e hora</FieldLabel>
              <Input
                id="dataHora"
                name="dataHora"
                type="datetime-local"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="local">Local</FieldLabel>
              <Input id="local" name="local" placeholder="Campo do bairro" />
            </Field>
            <Field>
              <FieldLabel htmlFor="valor">Valor (R$)</FieldLabel>
              <Input
                id="valor"
                name="valor"
                type="number"
                min="0"
                step="0.01"
                placeholder="25.00"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="chavePix">Chave PIX (opcional)</FieldLabel>
              <Input id="chavePix" name="chavePix" placeholder="Usa PIX padrão se vazio" />
              <FieldDescription>
                Deixe em branco para usar a chave PIX padrão do Pebol
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="nomeRecebedor">Nome do recebedor</FieldLabel>
              <Input id="nomeRecebedor" name="nomeRecebedor" placeholder="João Silva" />
              <FieldDescription>Aparece no QR Code PIX</FieldDescription>
            </Field>
          </FieldGroup>
          <SheetFooter className="flex-col gap-2 sm:flex-col">
            <Button
              type="submit"
              disabled={pending}
              className="min-h-11 w-full cursor-pointer"
            >
              {pending ? "Salvando..." : "Criar agenda"}
            </Button>
            <SheetClose
              render={
                <Button type="button" variant="outline" className="min-h-11 w-full cursor-pointer">
                  Cancelar
                </Button>
              }
            />
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
