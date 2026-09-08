"use client";

import { MessageCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsAppShareUrl } from "@/lib/url";
import { cn } from "@/lib/utils";

type WhatsAppShareButtonProps = {
  shareUrl: string;
  message?: string;
  className?: string;
};

export function WhatsAppShareButton({
  shareUrl,
  message,
  className,
}: WhatsAppShareButtonProps) {
  const text =
    message ??
    `Bora pro pebol no PEBOL KOPOHA! Confirma tua presença aqui: ${shareUrl}`;

  return (
    <Button
      nativeButton={false}
      render={
        <a
          href={whatsAppShareUrl(text)}
          target="_blank"
          rel="noopener noreferrer"
        />
      }
      variant="secondary"
      className={cn("min-h-11 w-full cursor-pointer bg-[#25D366] text-white hover:bg-[#20bd5a]", className)}
    >
      <MessageCircleIcon data-icon="inline-start" />
      Enviar no WhatsApp
    </Button>
  );
}
