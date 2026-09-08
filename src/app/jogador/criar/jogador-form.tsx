"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createJogador } from "@/actions/jogador";
import { PitchCard } from "@/components/pebol/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Alert, AlertDescription } from "@/components/ui/alert";

type JogadorFormProps = {
  defaultNome?: string;
};

export function JogadorForm({ defaultNome = "" }: JogadorFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const nome = String(form.get("nome") ?? "");
    const fotoUrl = String(form.get("fotoUrl") ?? "") || null;

    startTransition(async () => {
      const result = await createJogador(nome, fotoUrl);
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.push(`/jogador/${result.data.slug}`);
    });
  }

  return (
    <PitchCard>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FieldGroup>
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <Field>
            <FieldLabel htmlFor="nome">Nome</FieldLabel>
            <Input
              id="nome"
              name="nome"
              defaultValue={defaultNome}
              required
              placeholder="Seu apelido no pebol"
              className="min-h-11"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="fotoUrl">Foto (URL opcional)</FieldLabel>
            <Input
              id="fotoUrl"
              name="fotoUrl"
              type="url"
              placeholder="https://..."
              className="min-h-11"
            />
            <FieldDescription>Link direto para uma imagem</FieldDescription>
          </Field>
        </FieldGroup>
        <Button
          type="submit"
          disabled={pending}
          className="min-h-11 w-full cursor-pointer"
        >
          {pending ? "Criando..." : "Criar cartão"}
        </Button>
      </form>
    </PitchCard>
  );
}
