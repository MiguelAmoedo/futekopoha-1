export const APP_NAME = "PEBOL KOPOHA";
export const APP_NAME_SHORT = "PEBOL";
export const APP_TAGLINE = "Organize teu pebol";
export const APP_DESCRIPTION =
  "RSVP no WhatsApp, lista ao vivo, PIX na hora e cartão de jogador — tudo num só lugar.";

export const BRAND_ASSETS = {
  logo: "/brand/logo-sm.png",
  icon: "/brand/icon.png",
  icon192: "/brand/icon-192.png",
  icon512: "/brand/icon-512.png",
  og: "/brand/og.jpg",
} as const;

export function brandTitle(page?: string): string {
  if (!page) return APP_NAME;
  return `${page} · ${APP_NAME}`;
}
