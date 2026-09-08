"use client";

import { WhatsAppShareButton } from "@/components/pebol/whatsapp-share-button";
import { CopyButton } from "@/components/pebol/copy-button";

type SharePlayerButtonProps = {
  shareUrl: string;
};

export function SharePlayerButton({ shareUrl }: SharePlayerButtonProps) {
  return (
    <div className="flex flex-col gap-2">
      <WhatsAppShareButton
        shareUrl={shareUrl}
        message={`Confere meu cartão de jogador no PEBOL KOPOHA: ${shareUrl}`}
      />
      <CopyButton value={shareUrl} label="Copiar link do cartão" className="w-full" />
    </div>
  );
}
