import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/pebol/page-shell";
import { PebolLogoLink } from "@/components/pebol/agenda-info";
import { JogadorForm } from "./jogador-form";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Criar cartão",
  description: "Crie seu cartão de jogador estilo FIFA",
};

type PageProps = {
  searchParams: Promise<{ nome?: string }>;
};

export default async function CriarJogadorPage({ searchParams }: PageProps) {
  const { nome } = await searchParams;

  return (
    <PageShell
      header={
        <div className="flex w-full items-center gap-3">
          <Button
            nativeButton={false}
            render={<Link href="/" />}
            variant="ghost"
            size="icon"
            className="cursor-pointer"
          >
            <ChevronLeftIcon />
          </Button>
          <PebolLogoLink />
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-3xl tracking-wide">CARTÃO DE JOGADOR</h1>
          <p className="text-sm text-muted-foreground">
            Monta teu card estilo FIFA e compartilha no grupo.
          </p>
        </div>
        <JogadorForm defaultNome={nome ?? ""} />
      </div>
    </PageShell>
  );
}
