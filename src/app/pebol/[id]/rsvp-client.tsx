"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type PebolAgendaView,
  type PebolPresencaView,
} from "@/lib/pebol-types";
import { usePebolSession } from "@/hooks/use-pebol-session";
import { absoluteUrl } from "@/lib/url";
import { AgendaInfo } from "@/components/pebol/agenda-info";
import { PresencaButtons } from "@/components/pebol/presenca-buttons";
import { PresencaList } from "@/components/pebol/presenca-list";
import { PitchCard } from "@/components/pebol/page-shell";
import { WhatsAppShareButton } from "@/components/pebol/whatsapp-share-button";
import { CopyButton } from "@/components/pebol/copy-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { ListIcon, UserPlusIcon } from "lucide-react";

type RsvpClientProps = {
  agenda: PebolAgendaView;
  presencas: PebolPresencaView[];
};

export function RsvpClient({ agenda, presencas }: RsvpClientProps) {
  const router = useRouter();
  const { nome, sessionId, setNome, ready } = usePebolSession();
  const [inputNome, setInputNome] = useState("");
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (ready && nome) setInputNome(nome);
  }, [ready, nome]);

  const myPresenca = presencas.find(
    (p) => p.sessionKey === sessionId || (nome && p.nome === nome),
  );

  const shareUrl = absoluteUrl(`/pebol/${agenda.id}`);

  function handleSaveNome() {
    const trimmed = inputNome.trim();
    if (!trimmed) return;
    setNome(trimmed);
    startTransition(() => router.refresh());
  }

  return (
    <div className="flex flex-col gap-4">
      <AgendaInfo
        titulo={agenda.titulo}
        dataHora={agenda.dataHora}
        local={agenda.local}
        valor={agenda.valor}
        agendaId={agenda.id}
        showPix
      />

      <div className="flex flex-col gap-2">
        <WhatsAppShareButton
          shareUrl={shareUrl}
          message={`Bora pro pebol no PEBOL KOPOHA! ${agenda.titulo} — confirma tua presença: ${shareUrl}`}
        />
        <CopyButton value={shareUrl} label="Copiar link do RSVP" className="w-full" />
      </div>

      <PitchCard className="flex flex-col gap-4">
        <Field>
          <FieldLabel htmlFor="nome">Seu nome</FieldLabel>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="nome"
              value={inputNome}
              onChange={(e) => setInputNome(e.target.value)}
              placeholder="Como te chamam no pebol?"
              className="min-h-11"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveNome();
              }}
            />
            <Button
              type="button"
              onClick={handleSaveNome}
              disabled={!inputNome.trim()}
              className="min-h-11 shrink-0 cursor-pointer"
            >
              Salvar
            </Button>
          </div>
        </Field>

        <PresencaButtons
          agendaId={agenda.id}
          nome={nome || inputNome.trim()}
          sessionId={sessionId}
          currentStatus={myPresenca?.status}
        />
      </PitchCard>

      <PresencaList presencas={presencas} />

      <Button
        nativeButton={false}
        render={<Link href={`/lista/${agenda.id}`} />}
        variant="outline"
        className="min-h-11 w-full cursor-pointer"
      >
        <ListIcon data-icon="inline-start" />
        Ver lista completa
      </Button>

      {(nome || inputNome.trim()) ? (
        <Button
          nativeButton={false}
          render={
            <Link
              href={`/jogador/criar?nome=${encodeURIComponent(nome || inputNome.trim())}`}
            />
          }
          variant="secondary"
          className="min-h-11 w-full cursor-pointer"
        >
          <UserPlusIcon data-icon="inline-start" />
          Criar meu card de jogador
        </Button>
      ) : null}
    </div>
  );
}
